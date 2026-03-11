import { describe, expect, it } from "vitest"
import { getEffectiveStatus, getAllowedTransitions } from "./time-entry-status"

describe("getEffectiveStatus", () => {
	it("returns null for non-billable", () => {
		expect(getEffectiveStatus({ billable: false })).toBeNull()
	})

	it("returns explicit status when set", () => {
		expect(getEffectiveStatus({ billable: true, status: "invoiced" })).toBe("invoiced")
		expect(getEffectiveStatus({ billable: true, status: "paid" })).toBe("paid")
	})

	it("falls back to invoiced when invoicedAt is set (legacy)", () => {
		expect(getEffectiveStatus({ billable: true, invoicedAt: 1234 })).toBe("invoiced")
	})

	it("defaults to draft for billable without status", () => {
		expect(getEffectiveStatus({ billable: true })).toBe("draft")
	})

	it("prefers explicit status over invoicedAt", () => {
		expect(getEffectiveStatus({ billable: true, status: "paid", invoicedAt: 1234 })).toBe("paid")
	})
})

describe("getAllowedTransitions", () => {
	it("draft → ready_to_invoice", () => {
		expect(getAllowedTransitions("draft")).toEqual(["ready_to_invoice"])
	})

	it("ready_to_invoice → draft or invoiced", () => {
		expect(getAllowedTransitions("ready_to_invoice")).toEqual(["draft", "invoiced"])
	})

	it("invoiced → ready_to_invoice or paid", () => {
		expect(getAllowedTransitions("invoiced")).toEqual(["ready_to_invoice", "paid"])
	})

	it("paid is terminal", () => {
		expect(getAllowedTransitions("paid")).toEqual([])
	})

	it("null returns empty", () => {
		expect(getAllowedTransitions(null)).toEqual([])
	})
})
