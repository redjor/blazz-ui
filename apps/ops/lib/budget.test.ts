import { describe, expect, it } from "vitest"
import { computeBudgetMetrics, healthColor } from "./budget"

describe("computeBudgetMetrics", () => {
	const base = {
		tjm: 800,
		hoursPerDay: 8,
		billableMinutes: 0,
		billableRevenue: 0,
	}

	it("returns null when no budget", () => {
		expect(computeBudgetMetrics({ ...base, budgetAmount: undefined })).toBeNull()
		expect(computeBudgetMetrics({ ...base, budgetAmount: 0 })).toBeNull()
		expect(computeBudgetMetrics({ ...base, budgetAmount: -100 })).toBeNull()
	})

	it("computes daysSold from budget / tjm", () => {
		const result = computeBudgetMetrics({ ...base, budgetAmount: 8000 })!
		expect(result.daysSold).toBe(10)
	})

	it("computes daysConsumed from billableMinutes", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableMinutes: 960, // 2 days × 8h × 60
		})!
		expect(result.daysConsumed).toBe(2)
	})

	it("computes remaining budget", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableRevenue: 3000,
		})!
		expect(result.remaining).toBe(5000)
	})

	it("computes effectiveTjm when days consumed", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableMinutes: 480, // 1 day
			billableRevenue: 900,
		})!
		expect(result.effectiveTjm).toBe(900)
	})

	it("effectiveTjm is null when no days consumed", () => {
		const result = computeBudgetMetrics({ ...base, budgetAmount: 8000 })!
		expect(result.effectiveTjm).toBeNull()
	})

	it("health ok when < 70%", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableMinutes: 480 * 5, // 5 days out of 10 = 50%
		})!
		expect(result.health).toBe("ok")
	})

	it("health warning when 70-90%", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableMinutes: 480 * 8, // 8 days out of 10 = 80%
		})!
		expect(result.health).toBe("warning")
	})

	it("health danger when 90-100%", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableMinutes: 480 * 9.5, // 95%
		})!
		expect(result.health).toBe("danger")
	})

	it("health over when >= 100%", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			billableMinutes: 480 * 11, // 110%
		})!
		expect(result.health).toBe("over")
	})

	it("handles zero tjm gracefully", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			tjm: 0,
		})!
		expect(result.daysSold).toBe(0)
		expect(result.percentUsed).toBe(0)
	})

	it("handles zero hoursPerDay gracefully", () => {
		const result = computeBudgetMetrics({
			...base,
			budgetAmount: 8000,
			hoursPerDay: 0,
			billableMinutes: 480,
		})!
		expect(result.daysConsumed).toBe(0)
	})
})

describe("healthColor", () => {
	it("returns green for ok", () => {
		expect(healthColor("ok").bar).toBe("bg-green-500")
	})

	it("returns amber for warning", () => {
		expect(healthColor("warning").bar).toBe("bg-amber-500")
	})

	it("returns red for danger", () => {
		expect(healthColor("danger").bar).toBe("bg-red-500")
	})

	it("returns dark red for over", () => {
		expect(healthColor("over").bar).toBe("bg-red-600")
	})

	it("returns all three keys for each health", () => {
		for (const h of ["ok", "warning", "danger", "over"] as const) {
			const c = healthColor(h)
			expect(c).toHaveProperty("bar")
			expect(c).toHaveProperty("text")
			expect(c).toHaveProperty("bg")
		}
	})
})
