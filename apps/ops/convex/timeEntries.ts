import { paginationOptsValidator } from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"
import { type EntryStatus, validateTransition } from "./lib/status"

export const list = query({
	args: {
		projectId: v.optional(v.id("projects")),
		from: v.optional(v.string()),
		to: v.optional(v.string()),
	},
	handler: async (ctx, { projectId, from, to }) => {
		const { userId } = await requireAuth(ctx)
		let entries = projectId
			? await ctx.db
					.query("timeEntries")
					.withIndex("by_user_project", (q) => q.eq("userId", userId).eq("projectId", projectId))
					.collect()
			: await ctx.db
					.query("timeEntries")
					.withIndex("by_user", (q) => q.eq("userId", userId))
					.collect()

		if (from) entries = entries.filter((e) => e.date >= from)
		if (to) entries = entries.filter((e) => e.date <= to)

		return entries.sort((a, b) => b.date.localeCompare(a.date))
	},
})

export const listByDate = query({
	args: { date: v.string() },
	handler: async (ctx, { date }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("timeEntries")
			.withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
			.collect()
	},
})

export const recent = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit = 10 }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("timeEntries")
			.order("desc")
			.filter((q) => q.eq(q.field("userId"), userId))
			.take(limit)
	},
})

export const listForRecap = query({
	args: {
		projectId: v.optional(v.id("projects")),
		from: v.optional(v.string()),
		to: v.optional(v.string()),
		includeInvoiced: v.optional(v.boolean()),
	},
	handler: async (ctx, { projectId, from, to, includeInvoiced = false }) => {
		const { userId } = await requireAuth(ctx)
		let entries = projectId
			? await ctx.db
					.query("timeEntries")
					.withIndex("by_user_project", (q) => q.eq("userId", userId).eq("projectId", projectId))
					.collect()
			: await ctx.db
					.query("timeEntries")
					.withIndex("by_user", (q) => q.eq("userId", userId))
					.collect()

		if (!includeInvoiced) entries = entries.filter((e) => !e.invoicedAt)
		if (from) entries = entries.filter((e) => e.date >= from)
		if (to) entries = entries.filter((e) => e.date <= to)
		entries = entries.filter((e) => e.billable)

		return entries.sort((a, b) => a.date.localeCompare(b.date))
	},
})

export const create = mutation({
	args: {
		projectId: v.id("projects"),
		date: v.string(),
		minutes: v.number(),
		hourlyRate: v.number(),
		description: v.optional(v.string()),
		billable: v.boolean(),
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("ready_to_invoice"),
				v.literal("invoiced"),
				v.literal("paid")
			)
		),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(args.projectId)
		if (!project || project.userId !== userId) throw new ConvexError("Projet introuvable")
		return ctx.db.insert("timeEntries", { ...args, userId, createdAt: Date.now() })
	},
})

export const update = mutation({
	args: {
		id: v.id("timeEntries"),
		projectId: v.id("projects"),
		date: v.string(),
		minutes: v.number(),
		hourlyRate: v.number(),
		description: v.optional(v.string()),
		billable: v.boolean(),
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("ready_to_invoice"),
				v.literal("invoiced"),
				v.literal("paid")
			)
		),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const entry = await ctx.db.get(id)
		if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
		if (entry.status === "invoiced") {
			throw new ConvexError("Impossible de modifier une entrée facturée")
		}
		if (entry.status === "paid") {
			throw new ConvexError("Impossible de modifier une entrée payée")
		}
		return ctx.db.patch(id, fields)
	},
})

export const remove = mutation({
	args: { id: v.id("timeEntries") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const entry = await ctx.db.get(id)
		if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
		if (entry.status === "invoiced") {
			throw new ConvexError("Impossible de supprimer une entrée facturée")
		}
		if (entry.status === "paid") {
			throw new ConvexError("Impossible de supprimer une entrée payée")
		}
		return ctx.db.delete(id)
	},
})

export const removeBatch = mutation({
	args: { ids: v.array(v.id("timeEntries")) },
	handler: async (ctx, { ids }) => {
		const { userId } = await requireAuth(ctx)
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				if (entry.status === "invoiced")
					throw new ConvexError("Impossible de supprimer une entrée facturée")
				if (entry.status === "paid")
					throw new ConvexError("Impossible de supprimer une entrée payée")
				await ctx.db.delete(id)
			})
		)
	},
})

/** @deprecated Use setStatus({ ids, status: "draft" }) instead — does not update the status field. */
export const unmarkInvoiced = mutation({
	args: { ids: v.array(v.id("timeEntries")) },
	handler: async (ctx, { ids }) => {
		const { userId } = await requireAuth(ctx)
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				if (entry.invoicedAt) {
					await ctx.db.patch(id, { invoicedAt: undefined })
				}
			})
		)
	},
})

/** @deprecated Use setStatus({ ids, status: "invoiced" }) instead — does not update the status field. */
export const markInvoiced = mutation({
	args: { ids: v.array(v.id("timeEntries")) },
	handler: async (ctx, { ids }) => {
		const { userId } = await requireAuth(ctx)
		const now = Date.now()
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				if (!entry.invoicedAt) {
					await ctx.db.patch(id, { invoicedAt: now })
				}
			})
		)
	},
})

export const setStatus = mutation({
	args: {
		ids: v.array(v.id("timeEntries")),
		status: v.union(
			v.literal("draft"),
			v.literal("ready_to_invoice"),
			v.literal("invoiced"),
			v.literal("paid")
		),
	},
	handler: async (ctx, { ids, status }) => {
		const { userId } = await requireAuth(ctx)
		const now = Date.now()
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				const currentStatus: EntryStatus = entry.status ?? "draft"
				validateTransition(currentStatus, status)
				const patch: Record<string, unknown> = { status }
				if (status === "invoiced") patch.invoicedAt = now
				if (status === "draft" || status === "ready_to_invoice") patch.invoicedAt = undefined
				await ctx.db.patch(id, patch)
			})
		)
	},
})

export const setBillable = mutation({
	args: {
		ids: v.array(v.id("timeEntries")),
		billable: v.boolean(),
	},
	handler: async (ctx, { ids, billable }) => {
		const { userId } = await requireAuth(ctx)
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				if (entry.status === "invoiced" || entry.status === "paid") {
					throw new ConvexError("Impossible de modifier une entrée facturée/payée")
				}
				await ctx.db.patch(id, { billable })
			})
		)
	},
})

export const listPaginated = query({
	args: {
		projectId: v.optional(v.id("projects")),
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("ready_to_invoice"),
				v.literal("invoiced"),
				v.literal("paid")
			)
		),
		billable: v.optional(v.boolean()),
		from: v.optional(v.string()),
		to: v.optional(v.string()),
		paginationOpts: paginationOptsValidator,
	},
	handler: async (ctx, { projectId, status, billable, from, to, paginationOpts }) => {
		const { userId } = await requireAuth(ctx)
		const baseQuery = ctx.db.query("timeEntries").withIndex("by_date").order("desc")

		const filtered = baseQuery.filter((q) => {
			const conditions = [q.eq(q.field("userId"), userId)]
			if (projectId !== undefined) conditions.push(q.eq(q.field("projectId"), projectId))
			if (status !== undefined) conditions.push(q.eq(q.field("status"), status))
			if (billable !== undefined) conditions.push(q.eq(q.field("billable"), billable))
			if (from !== undefined) conditions.push(q.gte(q.field("date"), from))
			if (to !== undefined) conditions.push(q.lte(q.field("date"), to))
			return conditions.reduce((acc, cond) => q.and(acc, cond))
		})

		return filtered.paginate(paginationOpts)
	},
})
