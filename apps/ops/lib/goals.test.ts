import { describe, expect, it } from "vitest"
import { resolveMonthlyTargets } from "./goals"

describe("resolveMonthlyTargets", () => {
	it("distributes evenly with no overrides", () => {
		const result = resolveMonthlyTargets(120000, {})
		expect(result).toHaveLength(12)
		expect(result.every((v) => v === 10000)).toBe(true)
	})

	it("applies overrides and redistributes remainder", () => {
		const result = resolveMonthlyTargets(120000, { "8": 0, "12": 5000 })
		expect(result[7]).toBe(0)
		expect(result[11]).toBe(5000)
		expect(result[0]).toBe(11500)
		expect(result.reduce((a, b) => a + b, 0)).toBe(120000)
	})

	it("handles all months overridden", () => {
		const overrides: Record<string, number> = {}
		for (let i = 1; i <= 12; i++) overrides[String(i)] = 10000
		const result = resolveMonthlyTargets(120000, overrides)
		expect(result.every((v) => v === 10000)).toBe(true)
	})

	it("handles zero annual", () => {
		const result = resolveMonthlyTargets(0, {})
		expect(result.every((v) => v === 0)).toBe(true)
	})

	it("rounds to avoid floating point issues", () => {
		const result = resolveMonthlyTargets(100000, {})
		const sum = result.reduce((a, b) => a + b, 0)
		expect(sum).toBe(100000)
		expect(result.every((v) => Number.isInteger(v))).toBe(true)
	})
})
