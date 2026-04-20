import { describe, expect, it } from "vitest"
import { getToolSchema, TOOL_SCHEMAS, type ToolSchema } from "./tool-schemas"

describe("tool-schemas", () => {
	it("exports exactly 10 tools", () => {
		expect(TOOL_SCHEMAS).toHaveLength(10)
	})

	it("all tools have name, description, parameters", () => {
		for (const t of TOOL_SCHEMAS) {
			expect(t.name).toBeTruthy()
			expect(t.description).toBeTruthy()
			expect(t.parameters).toMatchObject({ type: "object" })
		}
	})

	it("all tool names are unique", () => {
		const names = TOOL_SCHEMAS.map((t) => t.name)
		expect(new Set(names).size).toBe(names.length)
	})

	it("write tools are marked as such", () => {
		const writeTools = TOOL_SCHEMAS.filter((t) => t.category === "write")
		expect(writeTools.map((t) => t.name)).toEqual(["create_expense"])
	})

	it("all date params mention Europe/Paris timezone", () => {
		for (const t of TOOL_SCHEMAS) {
			const props = t.parameters.properties ?? {}
			for (const [key, schema] of Object.entries(props)) {
				if (key === "date" || key === "from" || key === "to") {
					const desc = schema.description ?? ""
					expect(desc).toMatch(/Europe\/Paris/)
				}
			}
		}
	})

	it("getToolSchema returns the schema by name", () => {
		const schema = getToolSchema("qonto_balance")
		expect(schema?.name).toBe("qonto_balance")
		expect(schema?.category).toBe("read")
	})

	it("getToolSchema returns undefined for unknown name", () => {
		expect(getToolSchema("nuke_db")).toBeUndefined()
	})
})
