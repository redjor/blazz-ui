import { describe, expect, it } from "vitest"
import { computeContractMetrics, computeForfaitMetrics } from "./contracts"

describe("computeForfaitMetrics", () => {
	it("computes consumption from billable entries in period", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 10000,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [
				{ date: "2026-03-01", minutes: 60, hourlyRate: 100, billable: true },
				{ date: "2026-03-02", minutes: 120, hourlyRate: 100, billable: true },
			],
		})
		expect(result.consumed).toBe(300) // (60/60)*100 + (120/60)*100
		expect(result.remaining).toBe(9700)
	})

	it("ignores non-billable entries", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 10000,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [
				{ date: "2026-03-01", minutes: 60, hourlyRate: 100, billable: false },
			],
		})
		expect(result.consumed).toBe(0)
	})

	it("ignores entries outside period", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 10000,
			startDate: "2026-01-01",
			endDate: "2026-06-30",
			entries: [
				{ date: "2025-12-31", minutes: 60, hourlyRate: 100, billable: true },
				{ date: "2026-07-01", minutes: 60, hourlyRate: 100, billable: true },
			],
		})
		expect(result.consumed).toBe(0)
	})

	it("health ok at low consumption", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 10000,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [],
		})
		expect(result.health).toBe("ok")
		expect(result.percentUsed).toBe(0)
	})

	it("health warning at 70-90%", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 1000,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [
				{ date: "2026-03-01", minutes: 480, hourlyRate: 100, billable: true }, // 800
			],
		})
		expect(result.health).toBe("warning")
	})

	it("health danger at 90-100%", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 1000,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [
				{ date: "2026-03-01", minutes: 570, hourlyRate: 100, billable: true }, // 950
			],
		})
		expect(result.health).toBe("danger")
	})

	it("health over at >= 100%", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 1000,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [
				{ date: "2026-03-01", minutes: 660, hourlyRate: 100, billable: true }, // 1100
			],
		})
		expect(result.health).toBe("over")
	})

	it("handles zero budget", () => {
		const result = computeForfaitMetrics({
			budgetAmount: 0,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			entries: [],
		})
		expect(result.percentUsed).toBe(0)
		expect(result.health).toBe("ok")
	})
})

describe("computeContractMetrics", () => {
	it("returns null when daysPerMonth is 0", () => {
		expect(
			computeContractMetrics({
				daysPerMonth: 0,
				carryOver: false,
				startDate: "2026-01-01",
				endDate: "2026-12-31",
				hoursPerDay: 8,
				entries: [],
			})
		).toBeNull()
	})

	it("returns null when daysPerMonth is negative", () => {
		expect(
			computeContractMetrics({
				daysPerMonth: -1,
				carryOver: false,
				startDate: "2026-01-01",
				endDate: "2026-12-31",
				hoursPerDay: 8,
				entries: [],
			})
		).toBeNull()
	})

	it("builds monthly breakdown", () => {
		const result = computeContractMetrics({
			daysPerMonth: 10,
			carryOver: false,
			startDate: "2026-01-01",
			endDate: "2026-03-31",
			hoursPerDay: 8,
			entries: [
				{ date: "2026-01-15", minutes: 480, billable: true }, // 1 day
				{ date: "2026-02-15", minutes: 960, billable: true }, // 2 days
			],
		})!
		expect(result).not.toBeNull()
		expect(result.monthlyBreakdown.length).toBeGreaterThanOrEqual(1)
		const jan = result.monthlyBreakdown.find((r) => r.month === "2026-01")
		expect(jan).toBeDefined()
		expect(jan!.consumed).toBe(1)
		expect(jan!.allocated).toBe(10)
	})

	it("carries over remaining days when carryOver is true", () => {
		const result = computeContractMetrics({
			daysPerMonth: 10,
			carryOver: true,
			startDate: "2026-01-01",
			endDate: "2026-03-31",
			hoursPerDay: 8,
			entries: [
				{ date: "2026-01-15", minutes: 480, billable: true }, // 1 day consumed in Jan → 9 carry
			],
		})!
		const feb = result.monthlyBreakdown.find((r) => r.month === "2026-02")
		expect(feb).toBeDefined()
		expect(feb!.carryIn).toBe(9)
		expect(feb!.allocated).toBe(19) // 10 + 9 carry
	})

	it("does not carry over when carryOver is false", () => {
		const result = computeContractMetrics({
			daysPerMonth: 10,
			carryOver: false,
			startDate: "2026-01-01",
			endDate: "2026-03-31",
			hoursPerDay: 8,
			entries: [
				{ date: "2026-01-15", minutes: 480, billable: true },
			],
		})!
		const feb = result.monthlyBreakdown.find((r) => r.month === "2026-02")
		expect(feb).toBeDefined()
		expect(feb!.carryIn).toBe(0)
		expect(feb!.allocated).toBe(10)
	})

	it("ignores non-billable entries", () => {
		const result = computeContractMetrics({
			daysPerMonth: 10,
			carryOver: false,
			startDate: "2026-01-01",
			endDate: "2026-03-31",
			hoursPerDay: 8,
			entries: [
				{ date: "2026-01-15", minutes: 480, billable: false },
			],
		})!
		const jan = result.monthlyBreakdown.find((r) => r.month === "2026-01")
		expect(jan!.consumed).toBe(0)
	})

	it("isAnticipated is false when not in prestation window", () => {
		const result = computeContractMetrics({
			daysPerMonth: 10,
			carryOver: false,
			startDate: "2026-01-01",
			endDate: "2026-12-31",
			hoursPerDay: 8,
			entries: [],
		})!
		expect(result.isAnticipated).toBe(false)
	})

	it("reports totalDaysAllocated and totalDaysConsumed", () => {
		const result = computeContractMetrics({
			daysPerMonth: 10,
			carryOver: false,
			startDate: "2026-01-01",
			endDate: "2026-03-31",
			hoursPerDay: 8,
			entries: [
				{ date: "2026-01-15", minutes: 480, billable: true },
				{ date: "2026-02-15", minutes: 480, billable: true },
			],
		})!
		expect(result.totalDaysConsumed).toBe(2)
	})
})
