import { describe, expect, it } from "vitest"
import { TOOL_SCHEMAS } from "../shared/tool-schemas"
import { buildJsonRpcError, dispatchMcpRequest } from "./mcp"

describe("MCP JSON-RPC dispatcher", () => {
	it("returns error for non-JSON-RPC body", async () => {
		const res = await dispatchMcpRequest({ foo: "bar" } as any, {
			executeTool: async () => ({}),
			appendAudit: async () => {},
		})
		expect(res).toMatchObject({
			jsonrpc: "2.0",
			error: { code: -32600 },
		})
	})

	it("responds to initialize with capabilities", async () => {
		const res = await dispatchMcpRequest({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }, { executeTool: async () => ({}), appendAudit: async () => {} })
		expect(res).toMatchObject({
			jsonrpc: "2.0",
			id: 1,
			result: {
				protocolVersion: "2024-11-05",
				capabilities: { tools: {} },
				serverInfo: { name: "blazz-ops-mcp", version: expect.any(String) },
			},
		})
	})

	it("returns 10 tools on tools/list", async () => {
		const res = await dispatchMcpRequest({ jsonrpc: "2.0", id: 2, method: "tools/list" }, { executeTool: async () => ({}), appendAudit: async () => {} })
		expect(res.result.tools).toHaveLength(10)
		expect(res.result.tools[0]).toMatchObject({
			name: expect.any(String),
			description: expect.any(String),
			inputSchema: expect.objectContaining({ type: "object" }),
		})
	})

	it("dispatches tools/call to executeTool", async () => {
		let calledWith: { name: string; args: unknown } | null = null
		const res = await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 3,
				method: "tools/call",
				params: { name: "qonto_balance", arguments: {} },
			},
			{
				executeTool: async (name, args) => {
					calledWith = { name, args }
					return { balanceEur: 1234 }
				},
				appendAudit: async () => {},
			}
		)
		expect(calledWith).toEqual({ name: "qonto_balance", args: {} })
		expect(res.result).toMatchObject({
			content: [{ type: "text", text: expect.stringContaining("1234") }],
			isError: false,
		})
	})

	it("returns isError:true when tool throws", async () => {
		const res = await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 4,
				method: "tools/call",
				params: { name: "create_expense", arguments: {} },
			},
			{
				executeTool: async () => {
					throw new Error("Invalid clientId")
				},
				appendAudit: async () => {},
			}
		)
		expect(res.result).toMatchObject({
			content: [{ type: "text", text: expect.stringContaining("Invalid clientId") }],
			isError: true,
		})
	})

	it("rejects unknown tool name", async () => {
		const res = await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 5,
				method: "tools/call",
				params: { name: "nuke_db", arguments: {} },
			},
			{ executeTool: async () => ({}), appendAudit: async () => {} }
		)
		expect(res.result).toMatchObject({
			isError: true,
			content: [{ type: "text", text: expect.stringContaining("Unknown tool") }],
		})
	})

	it("rejects unknown method", async () => {
		const res = await dispatchMcpRequest({ jsonrpc: "2.0", id: 6, method: "resources/list" }, { executeTool: async () => ({}), appendAudit: async () => {} })
		expect(res).toMatchObject({ error: { code: -32601 } })
	})

	it("audit log called on every tools/call", async () => {
		let audited: any = null
		await dispatchMcpRequest(
			{
				jsonrpc: "2.0",
				id: 7,
				method: "tools/call",
				params: { name: "qonto_balance", arguments: {} },
			},
			{
				executeTool: async () => ({ ok: true }),
				appendAudit: async (entry) => {
					audited = entry
				},
			}
		)
		expect(audited).toMatchObject({ method: "tools/call", tool: "qonto_balance", success: true })
	})

	it("buildJsonRpcError shape", () => {
		expect(buildJsonRpcError(42, -32601, "Method not found")).toEqual({
			jsonrpc: "2.0",
			id: 42,
			error: { code: -32601, message: "Method not found" },
		})
	})

	it("shared TOOL_SCHEMAS has 10 entries", () => {
		expect(TOOL_SCHEMAS).toHaveLength(10)
	})
})
