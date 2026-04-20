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
		{
			name: "list_expenses",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_expenses",
					description: "List professional expenses (frais pro) — restaurants and mileage. Distinct from list_recurring_expenses (subscriptions).",
					parameters: {
						type: "object",
						properties: {
							type: { type: "string", enum: ["restaurant", "mileage"], description: "Filter by type" },
							from: { type: "string", description: "Start date YYYY-MM-DD" },
							to: { type: "string", description: "End date YYYY-MM-DD" },
							limit: { type: "number", description: "Max entries (default 30, max 100)" },
						},
						required: [],
					},
				},
			},
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
			definition: {
				type: "function",
				function: {
					name: "create_expense",
					description:
						"Create a professional expense (frais pro). Type 'restaurant' needs amountCents + guests + purpose. Type 'mileage' needs departure + destination + distanceKm (reimbursement is auto-computed via URSSAF scale if vehicle settings exist).",
					parameters: {
						type: "object",
						properties: {
							type: { type: "string", enum: ["restaurant", "mileage"], description: "Type of expense" },
							date: { type: "string", description: "Date YYYY-MM-DD" },
							amountCents: { type: "number", description: "Amount in cents (restaurant only)" },
							clientId: { type: "string", description: "Optional client ID this expense is attached to" },
							projectId: { type: "string", description: "Optional project ID" },
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
			},
			execute: async (args) => {
				return convex.mutation(api.worker.workerCreateExpense, args as any)
			},
		},
	]
}
