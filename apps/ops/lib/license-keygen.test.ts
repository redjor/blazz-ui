import { describe, expect, it } from "vitest"
import { generateLicenseKey } from "./license-keygen"

describe("generateLicenseKey", () => {
	it("returns BLAZZ-{plan}-{orgId}-{expiry}-{signature} format", async () => {
		const key = await generateLicenseKey("PRO", "org_123", "2027-01-01")
		expect(key).toMatch(/^BLAZZ-PRO-org_123-20270101-[0-9a-f]{16}$/)
	})

	it("strips dashes from expiry date", async () => {
		const key = await generateLicenseKey("TEAM", "org_456", "2026-12-31")
		expect(key).toContain("20261231")
		expect(key).not.toContain("2026-12-31")
	})

	it("produces different signatures for different plans", async () => {
		const pro = await generateLicenseKey("PRO", "org_1", "2027-01-01")
		const team = await generateLicenseKey("TEAM", "org_1", "2027-01-01")
		const enterprise = await generateLicenseKey("ENTERPRISE", "org_1", "2027-01-01")
		const sigs = [pro, team, enterprise].map((k) => k.split("-").pop())
		expect(new Set(sigs).size).toBe(3)
	})

	it("produces different signatures for different orgIds", async () => {
		const a = await generateLicenseKey("PRO", "org_a", "2027-01-01")
		const b = await generateLicenseKey("PRO", "org_b", "2027-01-01")
		expect(a).not.toBe(b)
	})

	it("is deterministic (same inputs → same output)", async () => {
		const k1 = await generateLicenseKey("PRO", "org_1", "2027-01-01")
		const k2 = await generateLicenseKey("PRO", "org_1", "2027-01-01")
		expect(k1).toBe(k2)
	})

	it("includes plan in the key", async () => {
		for (const plan of ["PRO", "TEAM", "ENTERPRISE"] as const) {
			const key = await generateLicenseKey(plan, "org_1", "2027-01-01")
			expect(key).toContain(`BLAZZ-${plan}-`)
		}
	})
})
