/**
 * Tool schemas partagés entre le worker (OpenAI function-calling) et le handler MCP.
 * Data pure : aucun import runtime (pas de Convex, pas d'OpenAI). Importable depuis
 * n'importe quel runtime TypeScript (Node worker, Convex httpAction, tests vitest).
 *
 * Toute date est YYYY-MM-DD en Europe/Paris. Les consumers sont responsables
 * de convertir les dates relatives ("hier", "today") dans cette TZ avant l'appel.
 */

export type ToolCategory = "read" | "write"

export type ToolSchema = {
	name: string
	category: ToolCategory
	description: string
	parameters: {
		type: "object"
		properties: Record<string, unknown>
		required?: readonly string[]
	}
}

export const TOOL_SCHEMAS: readonly ToolSchema[] = [
	{
		name: "qonto_balance",
		category: "read",
		description: "Get current Qonto bank account balance",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "qonto_transactions",
		category: "read",
		description: "List recent Qonto bank transactions. Returns the 10 most recent.",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "treasury_forecast",
		category: "read",
		description: "Get cashflow forecast: returns current settings + expenses summary for the agent to compute projections.",
		parameters: {
			type: "object",
			properties: {
				months: { type: "number", description: "Number of months to forecast (default 6)" },
			},
			required: [],
		},
	},
	{
		name: "list_invoices",
		category: "read",
		description: "List all invoices. Returns id, client, amount, status, dates.",
		parameters: {
			type: "object",
			properties: {
				status: { type: "string", enum: ["draft", "sent", "paid"], description: "Filter by status" },
			},
			required: [],
		},
	},
	{
		name: "list_expenses",
		category: "read",
		description: "List professional expenses (frais pro) — restaurants and mileage. Distinct from recurring expenses (subscriptions).",
		parameters: {
			type: "object",
			properties: {
				type: { type: "string", enum: ["restaurant", "mileage"], description: "Filter by type" },
				from: { type: "string", description: "Start date YYYY-MM-DD in Europe/Paris" },
				to: { type: "string", description: "End date YYYY-MM-DD in Europe/Paris" },
				limit: { type: "number", description: "Max entries (default 30, max 100)" },
			},
			required: [],
		},
	},
	{
		name: "list_time_entries",
		category: "read",
		description: "List time entries. Can filter by project and date range.",
		parameters: {
			type: "object",
			properties: {
				projectId: { type: "string", description: "Filter by project ID (Convex ID, use list_projects to discover)" },
				from: { type: "string", description: "Start date YYYY-MM-DD in Europe/Paris" },
				to: { type: "string", description: "End date YYYY-MM-DD in Europe/Paris" },
			},
			required: [],
		},
	},
	{
		name: "list_todos",
		category: "read",
		description: "List the user's todos. Useful to check what's on the user's plate or cross-reference work against time entries.",
		parameters: {
			type: "object",
			properties: {
				status: {
					type: "string",
					enum: ["triage", "todo", "blocked", "in_progress", "done"],
					description: "Filter by status.",
				},
				limit: { type: "number", description: "Max todos (default 50, max 100)" },
			},
			required: [],
		},
	},
	{
		name: "list_clients",
		category: "read",
		description: "List all clients with their Convex IDs. Use before create_expense when the user mentions a client by name.",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "list_projects",
		category: "read",
		description: "List all projects with their status, client, budget info, and Convex IDs.",
		parameters: { type: "object", properties: {}, required: [] },
	},
	{
		name: "create_expense",
		category: "write",
		description:
			"Create a professional expense (frais pro). Type 'restaurant' needs amountCents + guests + purpose. Type 'mileage' needs departure + destination + distanceKm (reimbursement is auto-computed via URSSAF scale if vehicle settings exist).",
		parameters: {
			type: "object",
			properties: {
				type: { type: "string", enum: ["restaurant", "mileage"], description: "Type of expense" },
				date: { type: "string", description: "Date YYYY-MM-DD in Europe/Paris" },
				amountCents: { type: "number", description: "Amount in cents (restaurant only)" },
				clientId: { type: "string", description: "Optional Convex client ID (discover via list_clients)" },
				projectId: { type: "string", description: "Optional Convex project ID (discover via list_projects)" },
				notes: { type: "string", description: "Free-form notes" },
				guests: { type: "string", description: "Restaurant: who was invited (e.g. 'Client X, 3 pers.')" },
				purpose: { type: "string", description: "Restaurant: business purpose" },
				departure: { type: "string", description: "Mileage: starting address/city" },
				destination: { type: "string", description: "Mileage: destination address/city" },
				distanceKm: { type: "number", description: "Mileage: distance in km" },
			},
			required: ["type", "date"],
		},
	},
] as const

export const MCP_TOOL_NAMES: readonly string[] = TOOL_SCHEMAS.map((t) => t.name)

export function getToolSchema(name: string): ToolSchema | undefined {
	return TOOL_SCHEMAS.find((t) => t.name === name)
}
