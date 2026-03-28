import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"

export function financeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "qonto_balance",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "qonto_balance",
					description: "Get current Qonto bank account balance",
					parameters: { type: "object", properties: {}, required: [] },
				},
			},
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
			definition: {
				type: "function",
				function: {
					name: "qonto_transactions",
					description: "List recent Qonto bank transactions. Returns the 10 most recent.",
					parameters: { type: "object", properties: {}, required: [] },
				},
			},
			execute: async () => {
				try {
					return await convex.action(api.qonto.listTransactions, {})
				} catch {
					return { error: "Qonto API not configured or unavailable" }
				}
			},
		},
		{
			name: "list_invoices",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_invoices",
					description: "List all invoices. Returns id, client, amount, status, dates.",
					parameters: {
						type: "object",
						properties: {
							status: { type: "string", enum: ["draft", "sent", "paid"], description: "Filter by status" },
						},
						required: [],
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListInvoices, args as any)
			},
		},
		{
			name: "list_recurring_expenses",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_recurring_expenses",
					description: "List active recurring expenses (subscriptions, charges, etc.)",
					parameters: { type: "object", properties: {}, required: [] },
				},
			},
			execute: async () => {
				return convex.query(api.worker.workerExpenseSummary, {})
			},
		},
		{
			name: "treasury_forecast",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "treasury_forecast",
					description: "Get cashflow forecast for the next N months. Returns projected balance per month.",
					parameters: {
						type: "object",
						properties: {
							months: { type: "number", description: "Number of months to forecast (default 6)" },
						},
						required: [],
					},
				},
			},
			execute: async () => {
				// Simplified: return expenses + settings for the agent to compute
				const [settings, expenses] = await Promise.all([convex.query(api.worker.workerGetTreasurySettings, {}), convex.query(api.worker.workerExpenseSummary, {})])
				return { settings, expenses }
			},
		},
	]
}
