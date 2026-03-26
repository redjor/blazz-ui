import type { ConvexHttpClient } from "convex/browser"
import { api } from "../../../convex/_generated/api"
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
        const settings = await convex.query(api.treasury.getSettings, {})
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
        // Delegate to Convex action
        return convex.action(api.qonto.listTransactions, {})
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
        return convex.query(api.invoices.list, args as any)
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
        return convex.query(api.treasury.expenseSummary, {})
      },
    },
    {
      name: "treasury_forecast",
      category: "read",
      definition: {
        type: "function",
        function: {
          name: "treasury_forecast",
          description: "Get cashflow forecast for the next N months",
          parameters: {
            type: "object",
            properties: {
              months: { type: "number", description: "Number of months to forecast (default 6)" },
            },
            required: [],
          },
        },
      },
      execute: async (args) => {
        return convex.query(api.treasury.forecast, { months: (args.months as number) ?? 6 })
      },
    },
  ]
}
