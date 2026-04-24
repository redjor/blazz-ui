import { describe, expect, it } from "vitest"
import { contentHash } from "./contentHash"

describe("contentHash", () => {
	it("returns hex-encoded sha1 hash", async () => {
		const hash = await contentHash("hello world")
		// sha1("hello world") = 2aae6c35c94fcfb415dbe95f408b9ce91ee846ed
		expect(hash).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed")
	})

	it("is deterministic", async () => {
		const a = await contentHash("same input")
		const b = await contentHash("same input")
		expect(a).toBe(b)
	})

	it("differs for different inputs", async () => {
		const a = await contentHash("input 1")
		const b = await contentHash("input 2")
		expect(a).not.toBe(b)
	})

	it("handles empty string", async () => {
		const hash = await contentHash("")
		// sha1("") = da39a3ee5e6b4b0d3255bfef95601890afd80709
		expect(hash).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709")
	})
})
