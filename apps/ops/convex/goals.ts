import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

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

		// Fetch all billable time entries for the year
		const startDate = `${year}-01-01`
		const endDate = `${year}-12-31`
		const allEntries = await ctx.db
			.query("timeEntries")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const yearEntries = allEntries.filter(
			(e) => e.billable && e.date >= startDate && e.date <= endDate
		)

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

		return {
			year,
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
					percent: pct(
						sumRange(monthlyDays, qStart, qEnd),
						sumRange(dayTargets, qStart, qEnd)
					),
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
						? Math.round(
								((totalRevenue / totalDays - plan.tjm.target) / plan.tjm.target) * 1000
							) / 10
						: 0,
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
