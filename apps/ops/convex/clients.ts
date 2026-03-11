import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const clients = await ctx.db.query("clients").order("desc").collect()
		return Promise.all(
			clients.map(async (c) => ({
				...c,
				logoUrl: c.logoStorageId ? await ctx.storage.getUrl(c.logoStorageId) : null,
			}))
		)
	},
})

export const get = query({
	args: { id: v.id("clients") },
	handler: async (ctx, { id }) => {
		const c = await ctx.db.get(id)
		if (!c) return null
		return {
			...c,
			logoUrl: c.logoStorageId ? await ctx.storage.getUrl(c.logoStorageId) : null,
		}
	},
})

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx)
		return ctx.storage.generateUploadUrl()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(v.string()),
		notes: v.optional(v.string()),
		logoStorageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		await requireAuth(ctx)
		return ctx.db.insert("clients", { ...args, createdAt: Date.now() })
	},
})

export const update = mutation({
	args: {
		id: v.id("clients"),
		name: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(v.string()),
		notes: v.optional(v.string()),
		logoStorageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, { id, ...fields }) => {
		await requireAuth(ctx)
		// If logo is being replaced, delete old file from storage
		const existing = await ctx.db.get(id)
		if (
			existing?.logoStorageId &&
			fields.logoStorageId !== undefined &&
			fields.logoStorageId !== existing.logoStorageId
		) {
			await ctx.storage.delete(existing.logoStorageId)
		}
		return ctx.db.patch(id, fields)
	},
})

export const remove = mutation({
	args: { id: v.id("clients") },
	handler: async (ctx, { id }) => {
		await requireAuth(ctx)
		const existing = await ctx.db.get(id)
		if (existing?.logoStorageId) {
			await ctx.storage.delete(existing.logoStorageId)
		}
		return ctx.db.delete(id)
	},
})

export const getStats = query({
	args: { clientId: v.id("clients") },
	handler: async (ctx, { clientId }) => {
		const projects = await ctx.db
			.query("projects")
			.withIndex("by_client", (q) => q.eq("clientId", clientId))
			.collect()

		const allEntries = (
			await Promise.all(
				projects.map((p) =>
					ctx.db
						.query("timeEntries")
						.withIndex("by_project", (q) => q.eq("projectId", p._id))
						.collect()
				)
			)
		)
			.flat()
			.filter((e) => e.billable)

		const calc = (filter: (e: (typeof allEntries)[number]) => boolean) =>
			Math.round(allEntries.filter(filter).reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0))

		return {
			toInvoice: calc((e) => e.status === "ready_to_invoice"),
			invoiced: calc((e) => e.status === "invoiced"),
			paid: calc((e) => e.status === "paid"),
			total: calc(() => true),
		}
	},
})
