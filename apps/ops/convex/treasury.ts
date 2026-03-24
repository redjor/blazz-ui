import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Settings ──

export const getSettings = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return (
			(await ctx.db
				.query("treasurySettings")
				.withIndex("by_user", (q) => q.eq("userId", userId))
				.unique()) ?? {
				manualBalanceCents: undefined,
				defaultPaymentDelayDays: 30,
				forecastMonths: 6,
			}
		)
	},
})

export const saveSettings = mutation({
	args: {
		manualBalanceCents: v.optional(v.number()),
		defaultPaymentDelayDays: v.number(),
		forecastMonths: v.number(),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("treasurySettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, { ...args, updatedAt: Date.now() })
			return existing._id
		}
		return ctx.db.insert("treasurySettings", {
			...args,
			userId,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		})
	},
})

/** Update Qonto balance snapshot (called by qonto.analyzeRecurring) */
export const updateQontoBalance = mutation({
	args: { balanceCents: v.number() },
	handler: async (ctx, { balanceCents }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("treasurySettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, { qontoBalanceCents: balanceCents, updatedAt: Date.now() })
		} else {
			await ctx.db.insert("treasurySettings", {
				userId,
				qontoBalanceCents: balanceCents,
				defaultPaymentDelayDays: 30,
				forecastMonths: 6,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			})
		}
	},
})

// ── Helpers ──

/** Mensualise un montant selon la fréquence */
function monthlyAmount(amountCents: number, frequency: "monthly" | "quarterly" | "yearly"): number {
	switch (frequency) {
		case "monthly":
			return amountCents
		case "quarterly":
			return Math.round(amountCents / 3)
		case "yearly":
			return Math.round(amountCents / 12)
	}
}

/** Check if an expense is active during a given month (YYYY-MM) */
function isActiveInMonth(
	expense: { startDate: string; endDate?: string; active: boolean },
	yearMonth: string
): boolean {
	if (!expense.active) return false
	const start = expense.startDate.slice(0, 7) // YYYY-MM
	if (yearMonth < start) return false
	if (expense.endDate) {
		const end = expense.endDate.slice(0, 7)
		if (yearMonth > end) return false
	}
	return true
}

/** Check if a quarterly expense falls in a given month (0-indexed) */
function isQuarterlyMonth(monthIndex: number): boolean {
	return monthIndex % 3 === 0 // Jan, Apr, Jul, Oct
}

/** Get exact monthly cost for an expense in a given month */
function expenseCentsInMonth(
	expense: { amountCents: number; frequency: "monthly" | "quarterly" | "yearly"; startDate: string; endDate?: string; active: boolean },
	yearMonth: string,
	monthIndex: number
): number {
	if (!isActiveInMonth(expense, yearMonth)) return 0
	switch (expense.frequency) {
		case "monthly":
			return expense.amountCents
		case "quarterly":
			return isQuarterlyMonth(monthIndex) ? expense.amountCents : 0
		case "yearly": {
			// Yearly expenses fall in the start month
			const startMonth = Number.parseInt(expense.startDate.slice(5, 7), 10) - 1
			return monthIndex === startMonth ? expense.amountCents : 0
		}
	}
}

// ── Forecast Query ──

export const forecast = query({
	args: { months: v.optional(v.number()) },
	handler: async (ctx, { months: monthsArg }) => {
		const { userId } = await requireAuth(ctx)

		// Load settings
		const settings = await ctx.db
			.query("treasurySettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()

		const forecastMonths = monthsArg ?? settings?.forecastMonths ?? 6
		const paymentDelayDays = settings?.defaultPaymentDelayDays ?? 30
		const manualBalanceCents = settings?.manualBalanceCents ?? settings?.qontoBalanceCents

		// Load active recurring expenses
		const expenses = await ctx.db
			.query("recurringExpenses")
			.withIndex("by_user_active", (q) => q.eq("userId", userId).eq("active", true))
			.collect()

		// Load active contracts with their projects (for revenue projection)
		const contracts = await ctx.db
			.query("contracts")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "active"))
			.collect()

		const projects = await Promise.all(
			contracts.map((c) => ctx.db.get(c.projectId))
		)
		const projectMap = new Map(projects.filter(Boolean).map((p) => [p!._id, p!]))

		// Load unpaid invoices (sent but not paid) for payment delay projection
		const unpaidInvoices = (
			await ctx.db
				.query("invoices")
				.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "sent"))
				.collect()
		)

		// Build monthly forecast
		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth()

		const monthlyData: Array<{
			label: string
			yearMonth: string
			revenueCents: number
			expenseCents: number
			balanceCents: number
		}> = []

		// Monthly expenses total (for stats)
		const totalMonthlyExpenses = expenses.reduce(
			(sum, e) => sum + monthlyAmount(e.amountCents, e.frequency),
			0
		)

		let runningBalance = manualBalanceCents ?? 0

		for (let i = 0; i < forecastMonths; i++) {
			const date = new Date(currentYear, currentMonth + i, 1)
			const year = date.getFullYear()
			const monthIdx = date.getMonth()
			const yearMonth = `${year}-${String(monthIdx + 1).padStart(2, "0")}`
			const label = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })

			// Revenue: from active contracts
			let revenueCents = 0
			for (const contract of contracts) {
				// Check contract is active during this month
				const cStart = contract.startDate.slice(0, 7)
				const cEnd = contract.endDate.slice(0, 7)
				if (yearMonth < cStart || yearMonth > cEnd) continue

				const project = projectMap.get(contract.projectId)
				if (!project) continue

				if (contract.type === "tma" && contract.daysPerMonth) {
					revenueCents += Math.round(contract.daysPerMonth * project.tjm * 100)
				} else if (contract.type === "regie") {
					// Régie: estimate based on project's hoursPerDay × 20 working days × TJM
					revenueCents += Math.round(20 * project.tjm * 100)
				}
				// Forfait: budget spread over contract duration (simplified)
				if (contract.type === "forfait" && contract.budgetAmount) {
					const startDate = new Date(contract.startDate)
					const endDate = new Date(contract.endDate)
					const totalMonths =
						(endDate.getFullYear() - startDate.getFullYear()) * 12 +
						(endDate.getMonth() - startDate.getMonth()) + 1
					if (totalMonths > 0) {
						revenueCents += Math.round((contract.budgetAmount / totalMonths) * 100)
					}
				}
			}

			// Add unpaid invoices expected to land this month (based on payment delay)
			if (i < 3) {
				for (const inv of unpaidInvoices) {
					const sentDate = new Date(inv.createdAt)
					const expectedPayment = new Date(sentDate.getTime() + paymentDelayDays * 86400000)
					const payMonth = `${expectedPayment.getFullYear()}-${String(expectedPayment.getMonth() + 1).padStart(2, "0")}`
					if (payMonth === yearMonth) {
						revenueCents += Math.round(inv.totalAmount * 100)
					}
				}
			}

			// Expenses
			let expCents = 0
			for (const expense of expenses) {
				expCents += expenseCentsInMonth(expense, yearMonth, monthIdx)
			}

			runningBalance = runningBalance + revenueCents - expCents

			monthlyData.push({
				label,
				yearMonth,
				revenueCents,
				expenseCents: expCents,
				balanceCents: runningBalance,
			})
		}

		return {
			months: monthlyData,
			totalMonthlyExpensesCents: totalMonthlyExpenses,
			totalYearlyExpensesCents: totalMonthlyExpenses * 12,
			expenseCount: expenses.length,
			manualBalanceCents,
			forecastMonths,
			paymentDelayDays,
		}
	},
})

/** Summary of recurring expenses for the stats display */
export const expenseSummary = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const expenses = await ctx.db
			.query("recurringExpenses")
			.withIndex("by_user_active", (q) => q.eq("userId", userId).eq("active", true))
			.collect()

		const monthlyCents = expenses.reduce(
			(sum, e) => sum + monthlyAmount(e.amountCents, e.frequency),
			0
		)

		// Group by category
		const byCategory = new Map<string, number>()
		for (const e of expenses) {
			const key = e.categoryId ?? "uncategorized"
			byCategory.set(key, (byCategory.get(key) ?? 0) + monthlyAmount(e.amountCents, e.frequency))
		}

		return {
			totalMonthlyCents: monthlyCents,
			totalYearlyCents: monthlyCents * 12,
			count: expenses.length,
			byCategory: Object.fromEntries(byCategory),
		}
	},
})
