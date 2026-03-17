import { query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

/** Aggregate unbilled time entries + unpaid invoices for forecast */
export const forecast = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		// Unbilled: billable time entries without invoicedAt
		const allEntries = await ctx.db
			.query("timeEntries")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const unbilled = allEntries.filter((e) => e.billable && !e.invoicedAt)
		const unbilledCents = unbilled.reduce(
			(sum, e) => sum + Math.round((e.minutes / 60) * e.hourlyRate * 100),
			0
		)

		// Unpaid invoices: status "sent" (sent but not paid)
		const allInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const unpaid = allInvoices.filter((i) => i.status === "sent")
		const unpaidCents = unpaid.reduce((sum, i) => sum + i.totalAmount, 0)

		return {
			unbilledCents,
			unbilledCount: unbilled.length,
			unpaidCents,
			unpaidCount: unpaid.length,
			totalCents: unbilledCents + unpaidCents,
		}
	},
})
