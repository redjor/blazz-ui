import { v } from "convex/values"
import { action } from "./_generated/server"
import { api } from "./_generated/api"

const QONTO_BASE = "https://thirdparty.qonto.com/v2"

async function qontoFetch(path: string, options: RequestInit = {}) {
	const apiKey = process.env.QONTO_API_KEY
	if (!apiKey) throw new Error("QONTO_API_KEY not configured")

	const res = await fetch(`${QONTO_BASE}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	})

	if (!res.ok) {
		const body = await res.text()
		throw new Error(`Qonto API error ${res.status}: ${body}`)
	}

	return res.json()
}

/** List clients from Qonto for mapping dropdown */
export const listClients = action({
	args: {},
	handler: async () => {
		const data = await qontoFetch("/clients?per_page=100")
		return (data.clients ?? []).map((c: Record<string, unknown>) => ({
			id: c.id as string,
			name: c.name as string,
			email: (c.email as string) ?? "",
		}))
	},
})

/** Create an invoice on Qonto, then update local state */
export const createInvoice = action({
	args: {
		invoiceId: v.id("invoices"),
		qontoClientId: v.string(),
		label: v.string(),
		totalAmount: v.number(),
		vatRate: v.number(),
	},
	handler: async (ctx, args) => {
		try {
			const unitPrice = (args.totalAmount / 100).toFixed(2)

			const data = await qontoFetch("/client_invoices", {
				method: "POST",
				body: JSON.stringify({
					client_id: args.qontoClientId,
					currency: "EUR",
					items: [
						{
							title: args.label.slice(0, 40),
							description: args.label,
							quantity: "1",
							unit_price: { value: unitPrice, currency: "EUR" },
							vat_rate: String(args.vatRate),
						},
					],
				}),
			})

			const invoice = data.client_invoice ?? data
			const qontoInvoiceId = invoice.id
			const qontoNumber = invoice.number ?? invoice.invoice_number ?? ""

			// Mark invoice as sent locally
			await ctx.runMutation(api.invoices.markSent, {
				id: args.invoiceId,
				qontoInvoiceId,
				qontoNumber,
			})

			return { success: true, qontoNumber }
		} catch (e) {
			// Rollback: delete the draft invoice
			await ctx.runMutation(api.invoices.deleteDraft, { id: args.invoiceId })
			throw e
		}
	},
})
