import { describe, expect, it } from "vitest"
import { TAG_COLORS, getTagColor } from "./tag-colors"

describe("TAG_COLORS", () => {
	it("has 9 colors", () => {
		expect(TAG_COLORS).toHaveLength(9)
	})

	it("each color has key, label, dot, bg, text", () => {
		for (const color of TAG_COLORS) {
			expect(color).toHaveProperty("key")
			expect(color).toHaveProperty("label")
			expect(color).toHaveProperty("dot")
			expect(color).toHaveProperty("bg")
			expect(color).toHaveProperty("text")
		}
	})

	it("all keys are unique", () => {
		const keys = TAG_COLORS.map((c) => c.key)
		expect(new Set(keys).size).toBe(keys.length)
	})
})

describe("getTagColor", () => {
	it("returns matching color for known key", () => {
		expect(getTagColor("blue").key).toBe("blue")
		expect(getTagColor("red").key).toBe("red")
	})

	it("falls back to first color (gray) for unknown key", () => {
		expect(getTagColor("unknown").key).toBe("gray")
		expect(getTagColor("").key).toBe("gray")
	})
})
