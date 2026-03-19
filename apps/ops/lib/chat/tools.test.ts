import { describe, expect, it } from "vitest"
import {
	allTools,
	readTools,
	writeDangerousToolNames,
	writeDangerousTools,
	writeSafeToolNames,
	writeSafeTools,
} from "./tools"

describe("chat tools", () => {
	it("readTools has 8 tools", () => {
		expect(Object.keys(readTools)).toHaveLength(8)
	})

	it("writeSafeTools has 4 tools", () => {
		expect(Object.keys(writeSafeTools)).toHaveLength(4)
	})

	it("writeDangerousTools has 6 tools", () => {
		expect(Object.keys(writeDangerousTools)).toHaveLength(6)
	})

	it("allTools merges all tool categories", () => {
		const total =
			Object.keys(readTools).length +
			Object.keys(writeSafeTools).length +
			Object.keys(writeDangerousTools).length
		expect(Object.keys(allTools)).toHaveLength(total)
	})

	it("writeSafeToolNames matches writeSafeTools keys", () => {
		for (const key of Object.keys(writeSafeTools)) {
			expect(writeSafeToolNames.has(key)).toBe(true)
		}
	})

	it("writeDangerousToolNames matches writeDangerousTools keys", () => {
		for (const key of Object.keys(writeDangerousTools)) {
			expect(writeDangerousToolNames.has(key)).toBe(true)
		}
	})

	it("each tool has description and inputSchema", () => {
		for (const [name, tool] of Object.entries(allTools)) {
			expect(tool, `${name} missing description`).toHaveProperty("description")
			expect(tool, `${name} missing inputSchema`).toHaveProperty("inputSchema")
		}
	})

	it("no overlap between tool categories", () => {
		const readKeys = new Set(Object.keys(readTools))
		const safeKeys = new Set(Object.keys(writeSafeTools))
		const dangerKeys = new Set(Object.keys(writeDangerousTools))
		for (const k of readKeys) {
			expect(safeKeys.has(k)).toBe(false)
			expect(dangerKeys.has(k)).toBe(false)
		}
		for (const k of safeKeys) {
			expect(dangerKeys.has(k)).toBe(false)
		}
	})
})
