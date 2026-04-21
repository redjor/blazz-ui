/**
 * MCP dispatcher — JSON-RPC 2.0 pur, testable sans runtime Convex.
 * Exporté comme fonction standalone ; la httpAction dans http.ts appelle
 * dispatchMcpRequest en lui passant un `executeTool` qui fait les ctx.runQuery.
 */
import { getToolSchema, TOOL_SCHEMAS } from "../shared/tool-schemas"

const SERVER_NAME = "blazz-ops-mcp"
const SERVER_VERSION = "0.1.0"
const PROTOCOL_VERSION = "2024-11-05"

export type JsonRpcRequest = {
	jsonrpc: "2.0"
	id?: number | string
	method: string
	params?: Record<string, unknown>
}

export type JsonRpcResponse = {
	jsonrpc: "2.0"
	id?: number | string
	result?: any
	error?: { code: number; message: string; data?: unknown }
}

export type McpAuditEntry = {
	method: string
	tool?: string
	success: boolean
	errorMessage?: string
	argsPreview?: string
}

export type McpDeps = {
	executeTool: (name: string, args: Record<string, unknown>) => Promise<unknown>
	appendAudit: (entry: McpAuditEntry) => Promise<void>
}

export function buildJsonRpcError(id: number | string | undefined, code: number, message: string): JsonRpcResponse {
	return { jsonrpc: "2.0", id, error: { code, message } }
}

function isJsonRpcRequest(body: unknown): body is JsonRpcRequest {
	if (typeof body !== "object" || body === null) return false
	const b = body as Record<string, unknown>
	return b.jsonrpc === "2.0" && typeof b.method === "string"
}

function argsPreview(args: Record<string, unknown>): string {
	try {
		const str = JSON.stringify(args)
		return str.length > 500 ? `${str.slice(0, 500)}...` : str
	} catch {
		return "[unserializable]"
	}
}

export async function dispatchMcpRequest(body: unknown, deps: McpDeps): Promise<JsonRpcResponse> {
	if (!isJsonRpcRequest(body)) {
		return buildJsonRpcError(undefined, -32600, "Invalid Request")
	}
	const { id, method, params } = body

	if (method === "initialize") {
		return {
			jsonrpc: "2.0",
			id,
			result: {
				protocolVersion: PROTOCOL_VERSION,
				capabilities: { tools: {} },
				serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
			},
		}
	}

	if (method === "tools/list") {
		return {
			jsonrpc: "2.0",
			id,
			result: {
				tools: TOOL_SCHEMAS.map((t) => ({
					name: t.name,
					description: t.description,
					inputSchema: t.parameters,
				})),
			},
		}
	}

	if (method === "tools/call") {
		const p = (params ?? {}) as { name?: string; arguments?: Record<string, unknown> }
		const toolName = p.name
		const toolArgs = p.arguments ?? {}

		if (!toolName || !getToolSchema(toolName)) {
			await deps.appendAudit({
				method,
				tool: toolName,
				success: false,
				errorMessage: "Unknown tool",
			})
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
					isError: true,
				},
			}
		}

		try {
			const result = await deps.executeTool(toolName, toolArgs)
			await deps.appendAudit({
				method,
				tool: toolName,
				success: true,
				argsPreview: argsPreview(toolArgs),
			})
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{ type: "text", text: JSON.stringify(result) }],
					isError: false,
				},
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			await deps.appendAudit({
				method,
				tool: toolName,
				success: false,
				errorMessage: message,
				argsPreview: argsPreview(toolArgs),
			})
			return {
				jsonrpc: "2.0",
				id,
				result: {
					content: [{ type: "text", text: message }],
					isError: true,
				},
			}
		}
	}

	return buildJsonRpcError(id, -32601, `Method not found: ${method}`)
}
