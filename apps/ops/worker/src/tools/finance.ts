import type { ConvexHttpClient } from "convex/browser"
import { getToolSchema } from "../../../shared/tool-schemas"
import { api } from "../convex"
import type { Tool } from "./index"

function toOpenAIDef(name: string) {
	const schema = getToolSchema(name)
	if (!schema) throw new Error(`Unknown tool schema: ${name}`)
	return {
		type: "function" as const,
		function: {
			name: schema.name,
			description: schema.description,
			parameters: schema.parameters,
		},
	}
}

export function financeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "qonto_balance",
			category: "read",
			definition: toOpenAIDef("qonto_balance"),
			execute: async () => {
				const settings = await convex.query(api.worker.workerGetTreasurySettings, {})
				return {
					balanceCents: settings?.qontoBalanceCents ?? 0,
					balanceEur: (settings?.qontoBalanceCents ?? 0) / 100,
					lastUpdated: settings?._creationTime,
				}
			},
		},
		{
			name: "qonto_transactions",
			category: "read",
			definition: toOpenAIDef("qonto_transactions"),
			execute: async () => {
				try {
					return await convex.action(api.qonto.listTransactions, {})
				} catch {
					return { error: "Qonto API not configured or unavailable" }
				}
			},
		},
		{
			name: "treasury_forecast",
			category: "read",
			definition: toOpenAIDef("treasury_forecast"),
			execute: async () => {
				const [settings, expenses] = await Promise.all([convex.query(api.worker.workerGetTreasurySettings, {}), convex.query(api.worker.workerExpenseSummary, {})])
				return { settings, expenses }
			},
		},
		{
			name: "list_invoices",
			category: "read",
			definition: toOpenAIDef("list_invoices"),
			execute: async (args) => {
				return convex.query(api.worker.workerListInvoices, args as any)
			},
		},
		{
			name: "list_expenses",
			category: "read",
			definition: toOpenAIDef("list_expenses"),
			execute: async (args) => {
				return convex.query(api.worker.workerListExpenses, {
					type: args.type as "restaurant" | "mileage" | undefined,
					from: args.from as string | undefined,
					to: args.to as string | undefined,
					limit: Math.min((args.limit as number) ?? 30, 100),
				})
			},
		},
		{
			name: "create_expense",
			category: "write",
			definition: toOpenAIDef("create_expense"),
			execute: async (args) => {
				return convex.mutation(api.worker.workerCreateExpense, args as any)
			},
		},
	]
}
