import { query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

function entryCents(e: { minutes: number; hourlyRate: number }) {
	return Math.round((e.minutes / 60) * e.hourlyRate * 100)
}

/** Aggregate unbilled time entries + unpaid invoices for forecast */
export const forecast = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		const allEntries = await ctx.db
			.query("timeEntries")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		// Draft: billable, not invoiced, status draft or missing
		const draft = allEntries.filter(
			(e) => e.billable && !e.invoicedAt && (!e.status || e.status === "draft")
		)
		const draftCents = draft.reduce((sum, e) => sum + entryCents(e), 0)

		// Ready to invoice: billable, status ready_to_invoice
		const readyToInvoice = allEntries.filter(
			(e) => e.billable && e.status === "ready_to_invoice"
		)
		const readyToInvoiceCents = readyToInvoice.reduce(
			(sum, e) => sum + entryCents(e),
			0
		)

		// All unbilled combined (backward compat)
		const unbilledCents = draftCents + readyToInvoiceCents
		const unbilledCount = draft.length + readyToInvoice.length

		// Unpaid invoices: status "sent" (sent but not paid)
		const allInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const unpaid = allInvoices.filter((i) => i.status === "sent")
		const unpaidCents = unpaid.reduce((sum, i) => sum + i.totalAmount, 0)

		return {
			draftCents,
			draftCount: draft.length,
			readyToInvoiceCents,
			readyToInvoiceCount: readyToInvoice.length,
			unbilledCents,
			unbilledCount,
			unpaidCents,
			unpaidCount: unpaid.length,
			totalCents: unbilledCents + unpaidCents,
		}
	},
})
