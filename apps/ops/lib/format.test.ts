import { describe, expect, it } from "vitest"
import { formatBytes, formatCurrency, formatMinutes } from "./format"

describe("formatMinutes", () => {
	it("formats full hours", () => {
		expect(formatMinutes(60)).toBe("1h")
		expect(formatMinutes(120)).toBe("2h")
	})

	it("formats hours and minutes", () => {
		expect(formatMinutes(90)).toBe("1h30")
		expect(formatMinutes(75)).toBe("1h15")
	})

	it("formats minutes only", () => {
		expect(formatMinutes(30)).toBe("0h30")
		expect(formatMinutes(5)).toBe("0h05")
	})

	it("formats zero", () => {
		expect(formatMinutes(0)).toBe("0h")
	})
})

describe("formatCurrency", () => {
	it("formats EUR by default", () => {
		expect(formatCurrency(1234)).toMatch(/€/)
		expect(formatCurrency(1234)).toMatch(/1[\s\u202f]?234/)
	})

	it("rounds to integer", () => {
		expect(formatCurrency(99.7)).toMatch(/100/)
	})

	it("formats zero", () => {
		expect(formatCurrency(0)).toMatch(/€/)
		expect(formatCurrency(0)).toMatch(/0/)
	})
})

describe("formatBytes", () => {
	it("formats bytes", () => {
		expect(formatBytes(500)).toBe("500 B")
	})

	it("formats kilobytes", () => {
		expect(formatBytes(1024)).toBe("1.0 kB")
		expect(formatBytes(1536)).toBe("1.5 kB")
	})

	it("formats megabytes", () => {
		expect(formatBytes(1048576)).toBe("1.0 MB")
	})
})
