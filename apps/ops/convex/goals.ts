import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"
import { contractMonthlyRevenue } from "./lib/contracts"

// ── Pure helper (duplicated from lib/goals.ts — Convex can't import from app lib) ──

function resolveTargets(annual: number, overrides: Record<string, number>): number[] {
	const result: number[] = new Array(12).fill(0)
	const autoMonths: number[] = []
	let overrideSum = 0
	for (let i = 0; i < 12; i++) {
		const key = String(i + 1)
		if (key in overrides) {
			result[i] = overrides[key]
			overrideSum += overrides[key]
		} else {
			autoMonths.push(i)
		}
	}
	if (autoMonths.length === 0) return result
	const remainder = annual - overrideSum
	const base = Math.floor(remainder / autoMonths.length)
	let leftover = remainder - base * autoMonths.length
	for (const idx of autoMonths) {
		result[idx] = base + (leftover > 0 ? 1 : 0)
		if (leftover > 0) leftover--
	}
	return result
}

function sumRange(arr: number[], from: number, to: number) {
	return arr.slice(from, to + 1).reduce((a, b) => a + b, 0)
}

function pct(actual: number, target: number) {
	return target === 0 ? 0 : Math.round((actual / target) * 100)
}

/** Count business days (Mon-Fri) in a month */
function businessDaysInMonth(year: number, month: number): number {
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	let count = 0
	for (let d = 1; d <= daysInMonth; d++) {
		const day = new Date(year, month, d).getDay()
		if (day !== 0 && day !== 6) count++
	}
	return count
}

/** Count business days elapsed so far in a month (up to and including `today`) */
function businessDaysElapsed(year: number, month: number, today: number): number {
	let count = 0
	for (let d = 1; d <= today; d++) {
		const day = new Date(year, month, d).getDay()
		if (day !== 0 && day !== 6) count++
	}
	return count
}

// ── Queries ──

export const get = query({
	args: { year: v.number() },
	handler: async (ctx, { year }) => {
		const { userId } = await requireAuth(ctx)
		const plan = await ctx.db
			.query("goalPlans")
			.withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", year))
			.unique()
		return plan ?? null
	},
})

export const dashboard = query({
	args: { year: v.number() },
	handler: async (ctx, { year }) => {
		const { userId } = await requireAuth(ctx)

		const plan = await ctx.db
			.query("goalPlans")
			.withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", year))
			.unique()

		if (!plan) return null

		// Fetch billable time entries for the year (using date index for performance)
		const startDate = `${year}-01-01`
		const endDate = `${year}-12-31`
		const yearEntries = (
			await ctx.db
				.query("timeEntries")
				.withIndex("by_user_date", (q) =>
					q.eq("userId", userId).gte("date", startDate).lte("date", endDate)
				)
				.collect()
		).filter((e) => e.billable)

		// Fetch active contracts for revenue projection
		const contracts = await ctx.db
			.query("contracts")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "active"))
			.collect()

		const contractProjects = await Promise.all(
			contracts.map((c) => ctx.db.get(c.projectId))
		)
		const projectMap = new Map(
			contractProjects.filter(Boolean).map((p) => [p!._id, p!])
		)

		// Compute contract revenue per month
		const monthlyContractRevenue = new Array(12).fill(0) as number[]
		for (let i = 0; i < 12; i++) {
			const ym = `${year}-${String(i + 1).padStart(2, "0")}`
			for (const contract of contracts) {
				const project = projectMap.get(contract.projectId)
				if (!project) continue
				monthlyContractRevenue[i] += contractMonthlyRevenue(contract, project, ym)
			}
		}

		const securedAnnual = Math.round(monthlyContractRevenue.reduce((a, b) => a + b, 0))

		// Aggregate actuals per month
		const monthlyRevenue = new Array(12).fill(0) as number[]
		const monthlyMinutes = new Array(12).fill(0) as number[]
		for (const e of yearEntries) {
			const monthIdx = Number.parseInt(e.date.slice(5, 7), 10) - 1
			monthlyRevenue[monthIdx] += (e.minutes / 60) * e.hourlyRate
			monthlyMinutes[monthIdx] += e.minutes
		}

		// Convert minutes to days (7h standard day)
		const monthlyDays = monthlyMinutes.map((m) => Math.round((m / 60 / 7) * 10) / 10)

		// Resolve targets
		const revenueTargets = resolveTargets(plan.revenue.annual, plan.revenue.overrides)
		const dayTargets = resolveTargets(plan.days.annual, plan.days.overrides)

		const now = new Date()
		const currentMonth = now.getFullYear() === year ? now.getMonth() : 11
		const currentQuarter = Math.floor(currentMonth / 3)
		const qStart = currentQuarter * 3
		const qEnd = qStart + 2

		const totalRevenue = sumRange(monthlyRevenue, 0, 11)
		const totalDays = sumRange(monthlyDays, 0, 11)

		// ── Projections ──
		const isCurrentYear = now.getFullYear() === year
		const currentDay = now.getDate()

		// End-of-month projection: extrapolate current pace over remaining business days
		const bdTotal = isCurrentYear ? businessDaysInMonth(year, currentMonth) : 0
		const bdElapsed = isCurrentYear ? businessDaysElapsed(year, currentMonth, currentDay) : 0
		const bdRemaining = bdTotal - bdElapsed

		const monthRevenuePace = bdElapsed > 0 ? monthlyRevenue[currentMonth] / bdElapsed : 0
		const monthDaysPace = bdElapsed > 0 ? monthlyDays[currentMonth] / bdElapsed : 0

		const projectedMonthRevenue = Math.round(
			monthlyRevenue[currentMonth] + bdRemaining * monthRevenuePace
		)
		const projectedMonthDays =
			Math.round((monthlyDays[currentMonth] + bdRemaining * monthDaysPace) * 10) / 10

		// End-of-year projection (hybrid: real + current extrapolation + future max(contract, target))
		let projectedYearRevenue = 0
		let projectedYearDays = 0

		for (let i = 0; i < 12; i++) {
			if (!isCurrentYear) {
				// Past year: just use actuals
				projectedYearRevenue += monthlyRevenue[i]
				projectedYearDays += monthlyDays[i]
			} else if (i < currentMonth) {
				// Past month: actual
				projectedYearRevenue += monthlyRevenue[i]
				projectedYearDays += monthlyDays[i]
			} else if (i === currentMonth) {
				// Current month: extrapolation from pace
				projectedYearRevenue += projectedMonthRevenue
				projectedYearDays += projectedMonthDays
			} else {
				// Future month: max(contract revenue, target from goalPlan)
				projectedYearRevenue += Math.max(monthlyContractRevenue[i], revenueTargets[i])
				projectedYearDays += dayTargets[i]
			}
		}

		projectedYearRevenue = Math.round(projectedYearRevenue)
		projectedYearDays = Math.round(projectedYearDays * 10) / 10

		return {
			year,
			projection: {
				month: {
					revenue: projectedMonthRevenue,
					revenuePercent: pct(projectedMonthRevenue, revenueTargets[currentMonth]),
					days: projectedMonthDays,
					daysPercent: pct(projectedMonthDays, dayTargets[currentMonth]),
					businessDaysTotal: bdTotal,
					businessDaysElapsed: bdElapsed,
					businessDaysRemaining: bdRemaining,
				},
				year: {
					revenue: projectedYearRevenue,
					revenuePercent: pct(projectedYearRevenue, plan.revenue.annual),
					days: projectedYearDays,
					daysPercent: pct(projectedYearDays, plan.days.annual),
				},
			},
			revenue: {
				annual: {
					target: plan.revenue.annual,
					actual: Math.round(totalRevenue),
					percent: pct(totalRevenue, plan.revenue.annual),
				},
				quarter: {
					target: sumRange(revenueTargets, qStart, qEnd),
					actual: Math.round(sumRange(monthlyRevenue, qStart, qEnd)),
					percent: pct(
						sumRange(monthlyRevenue, qStart, qEnd),
						sumRange(revenueTargets, qStart, qEnd)
					),
					label: `Q${currentQuarter + 1}`,
				},
				month: {
					target: revenueTargets[currentMonth],
					actual: Math.round(monthlyRevenue[currentMonth]),
					percent: pct(monthlyRevenue[currentMonth], revenueTargets[currentMonth]),
					label: new Date(year, currentMonth).toLocaleDateString("fr-FR", { month: "long" }),
				},
				monthlyTargets: revenueTargets,
				monthlyActuals: monthlyRevenue.map(Math.round),
			},
			days: {
				annual: {
					target: plan.days.annual,
					actual: Math.round(totalDays * 10) / 10,
					percent: pct(totalDays, plan.days.annual),
				},
				quarter: {
					target: sumRange(dayTargets, qStart, qEnd),
					actual: Math.round(sumRange(monthlyDays, qStart, qEnd) * 10) / 10,
					percent: pct(sumRange(monthlyDays, qStart, qEnd), sumRange(dayTargets, qStart, qEnd)),
					label: `Q${currentQuarter + 1}`,
				},
				month: {
					target: dayTargets[currentMonth],
					actual: Math.round(monthlyDays[currentMonth] * 10) / 10,
					percent: pct(monthlyDays[currentMonth], dayTargets[currentMonth]),
					label: new Date(year, currentMonth).toLocaleDateString("fr-FR", { month: "long" }),
				},
				monthlyTargets: dayTargets,
				monthlyActuals: monthlyDays,
			},
			tjm: {
				target: plan.tjm.target,
				actual: totalDays > 0 ? Math.round(totalRevenue / totalDays) : 0,
				trend:
					totalDays > 0
						? Math.round(((totalRevenue / totalDays - plan.tjm.target) / plan.tjm.target) * 1000) /
							10
						: 0,
			},
			secured: {
				annual: securedAnnual,
				percent: pct(securedAnnual, plan.revenue.annual),
				monthlyBreakdown: monthlyContractRevenue.map(Math.round),
			},
		}
	},
})

// ── Mutation ──

export const save = mutation({
	args: {
		year: v.number(),
		revenue: v.object({
			annual: v.number(),
			overrides: v.record(v.string(), v.number()),
		}),
		days: v.object({
			annual: v.number(),
			overrides: v.record(v.string(), v.number()),
		}),
		tjm: v.object({ target: v.number() }),
	},
	handler: async (ctx, { year, revenue, days, tjm }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("goalPlans")
			.withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", year))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, { revenue, days, tjm, updatedAt: Date.now() })
			return existing._id
		}
		return ctx.db.insert("goalPlans", {
			userId,
			year,
			revenue,
			days,
			tjm,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		})
	},
})
