import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Queries ────────────────────────────────────────

export const listByProject = query({
	args: { projectId: v.id("projects") },
	handler: async (ctx, { projectId }) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(projectId)
		if (!project || project.userId !== userId) return []

		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_project", (q) => q.eq("projectId", projectId))
			.collect()

		const sorted = invoices.sort((a, b) => b.createdAt - a.createdAt)

		return Promise.all(
			sorted.map(async (invoice) => ({
				...invoice,
				pdfUrl: invoice.pdfStorageId
					? await ctx.storage.getUrl(invoice.pdfStorageId)
					: null,
			}))
		)
	},
})

export const get = query({
	args: { id: v.id("invoices") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const invoice = await ctx.db.get(id)
		if (!invoice || invoice.userId !== userId) return null

		return {
			...invoice,
			pdfUrl: invoice.pdfStorageId
				? await ctx.storage.getUrl(invoice.pdfStorageId)
				: null,
		}
	},
})

// ── Mutations ──────────────────────────────────────

export const createDraft = mutation({
	args: {
		projectId: v.id("projects"),
		label: v.string(),
		totalAmount: v.number(),
		vatRate: v.number(),
		periodStart: v.string(),
		periodEnd: v.string(),
		entryIds: v.array(v.id("timeEntries")),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(args.projectId)
		if (!project || project.userId !== userId) throw new ConvexError("Introuvable")

		const invoiceId = await ctx.db.insert("invoices", {
			userId,
			projectId: args.projectId,
			clientId: project.clientId,
			label: args.label,
			totalAmount: args.totalAmount,
			vatRate: args.vatRate,
			currency: "EUR",
			periodStart: args.periodStart,
			periodEnd: args.periodEnd,
			status: "draft",
			createdAt: Date.now(),
		})

		// Link time entries to this invoice
		for (const entryId of args.entryIds) {
			const entry = await ctx.db.get(entryId)
			if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
			await ctx.db.patch(entryId, { invoiceId })
		}

		return invoiceId
	},
})

export const markSent = mutation({
	args: {
		id: v.id("invoices"),
		qontoInvoiceId: v.string(),
		qontoNumber: v.string(),
	},
	handler: async (ctx, { id, qontoInvoiceId, qontoNumber }) => {
		const { userId } = await requireAuth(ctx)
		const invoice = await ctx.db.get(id)
		if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")

		await ctx.db.patch(id, {
			status: "sent",
			qontoInvoiceId,
			qontoNumber,
		})

		// Mark linked entries as invoiced
		const entries = await ctx.db
			.query("timeEntries")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", id))
			.collect()

		for (const entry of entries) {
			await ctx.db.patch(entry._id, {
				status: "invoiced",
				invoicedAt: Date.now(),
			})
		}
	},
})

export const deleteDraft = mutation({
	args: { id: v.id("invoices") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const invoice = await ctx.db.get(id)
		if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")
		if (invoice.status !== "draft") {
			throw new Error("Seul un brouillon peut être supprimé.")
		}

		// Unlink time entries
		const entries = await ctx.db
			.query("timeEntries")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", id))
			.collect()

		for (const entry of entries) {
			await ctx.db.patch(entry._id, { invoiceId: undefined })
		}

		await ctx.db.delete(id)
	},
})

export const markPaid = mutation({
	args: { id: v.id("invoices") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const invoice = await ctx.db.get(id)
		if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")

		await ctx.db.patch(id, {
			status: "paid",
			paidAt: Date.now(),
		})

		// Mark linked entries as paid
		const entries = await ctx.db
			.query("timeEntries")
			.withIndex("by_invoice", (q) => q.eq("invoiceId", id))
			.collect()

		for (const entry of entries) {
			await ctx.db.patch(entry._id, { status: "paid" })
		}
	},
})

export const storePdf = mutation({
	args: {
		id: v.id("invoices"),
		pdfStorageId: v.id("_storage"),
	},
	handler: async (ctx, { id, pdfStorageId }) => {
		const { userId } = await requireAuth(ctx)
		const invoice = await ctx.db.get(id)
		if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")

		await ctx.db.patch(id, { pdfStorageId })
	},
})
