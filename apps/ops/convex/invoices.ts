import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Helpers ───────────────────────────────────────

const lineValidator = v.object({
	id: v.string(),
	type: v.union(v.literal("project"), v.literal("custom")),
	projectId: v.optional(v.id("projects")),
	label: v.string(),
	quantity: v.number(),
	unitPrice: v.number(),
	discountPercent: v.optional(v.number()),
	sortOrder: v.number(),
})

function computeTotal(lines: Array<{ quantity: number; unitPrice: number; discountPercent?: number }>, globalDiscount?: { type: "percent" | "fixed"; value: number }): number {
	const subtotal = lines.reduce((sum, line) => {
		const lineTotal = line.quantity * line.unitPrice
		const discount = line.discountPercent ? lineTotal * (line.discountPercent / 100) : 0
		return sum + lineTotal - discount
	}, 0)

	if (!globalDiscount) return subtotal
	if (globalDiscount.type === "percent") {
		return Math.round(subtotal * (1 - globalDiscount.value / 100))
	}
	return subtotal - globalDiscount.value
}

// ── Queries ────────────────────────────────────────

export const listAll = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		const invoices = await ctx.db
			.query("invoices")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const sorted = invoices.sort((a, b) => b.createdAt - a.createdAt)

		// Batch fetch all referenced clients and projects (eliminates N+1)
		const clientIds = [...new Set(sorted.map((i) => i.clientId))]
		const projectIds = [...new Set(sorted.filter((i) => i.projectId).map((i) => i.projectId!))]

		const [clients, projects] = await Promise.all([Promise.all(clientIds.map((id) => ctx.db.get(id))), Promise.all(projectIds.map((id) => ctx.db.get(id)))])

		const clientMap = new Map(clients.filter(Boolean).map((c) => [c!._id, c!.name]))
		const projectMap = new Map(projects.filter(Boolean).map((p) => [p!._id, p!.name]))

		return Promise.all(
			sorted.map(async (invoice) => ({
				...invoice,
				clientName: clientMap.get(invoice.clientId) ?? "—",
				projectName: invoice.projectId ? (projectMap.get(invoice.projectId) ?? "—") : "—",
				pdfUrl: invoice.pdfStorageId ? await ctx.storage.getUrl(invoice.pdfStorageId) : null,
			}))
		)
	},
})

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
				pdfUrl: invoice.pdfStorageId ? await ctx.storage.getUrl(invoice.pdfStorageId) : null,
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
			pdfUrl: invoice.pdfStorageId ? await ctx.storage.getUrl(invoice.pdfStorageId) : null,
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

export const saveDraft = mutation({
	args: {
		id: v.optional(v.id("invoices")),
		clientId: v.id("clients"),
		invoiceType: v.union(v.literal("unique"), v.literal("acompte"), v.literal("situation")),
		label: v.string(),
		lines: v.array(lineValidator),
		vatRate: v.number(),
		globalDiscount: v.optional(
			v.object({
				type: v.union(v.literal("percent"), v.literal("fixed")),
				value: v.number(),
			})
		),
		notes: v.optional(v.string()),
		internalNotes: v.optional(v.string()),
		entryIds: v.optional(v.array(v.id("timeEntries"))),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)

		const sortedLines = [...args.lines].sort((a, b) => a.sortOrder - b.sortOrder)
		const totalAmount = computeTotal(sortedLines, args.globalDiscount ?? undefined)

		const now = new Date().toISOString().slice(0, 10)

		const data = {
			userId,
			clientId: args.clientId,
			label: args.label,
			totalAmount,
			vatRate: args.vatRate,
			currency: "EUR" as const,
			periodStart: now,
			periodEnd: now,
			status: "draft" as const,
			invoiceType: args.invoiceType,
			lines: sortedLines,
			globalDiscount: args.globalDiscount,
			notes: args.notes,
			internalNotes: args.internalNotes,
		}

		let invoiceId: typeof args.id & string

		if (args.id) {
			const existing = await ctx.db.get(args.id)
			if (!existing || existing.userId !== userId) throw new ConvexError("Introuvable")
			if (existing.status !== "draft") throw new ConvexError("Seul un brouillon peut etre modifie")
			await ctx.db.patch(args.id, data)
			invoiceId = args.id
		} else {
			invoiceId = await ctx.db.insert("invoices", {
				...data,
				createdAt: Date.now(),
			})
		}

		// Link time entries if provided
		if (args.entryIds) {
			for (const entryId of args.entryIds) {
				const entry = await ctx.db.get(entryId)
				if (entry && entry.userId === userId) {
					await ctx.db.patch(entryId, { invoiceId })
				}
			}
		}

		return invoiceId
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
