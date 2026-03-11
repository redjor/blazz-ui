import { describe, expect, it } from "vitest"
import { computeHourlyRate } from "./rate"

describe("computeHourlyRate", () => {
	it("divides TJM by hours per day", () => {
		expect(computeHourlyRate(800, 8)).toBe(100)
		expect(computeHourlyRate(700, 7)).toBe(100)
	})

	it("handles fractional results", () => {
		expect(computeHourlyRate(500, 7)).toBeCloseTo(71.43, 1)
	})

	it("falls back to 8h when hoursPerDay is 0", () => {
		expect(computeHourlyRate(800, 0)).toBe(100)
	})

	it("falls back to 8h when hoursPerDay is negative", () => {
		expect(computeHourlyRate(800, -1)).toBe(100)
	})
})
