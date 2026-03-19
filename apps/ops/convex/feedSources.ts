import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("feedSources")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		type: v.union(v.literal("youtube"), v.literal("rss")),
		externalId: v.string(),
		avatarUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const name = args.name.trim()
		if (!name) throw new ConvexError("Le nom est requis")
		const externalId = args.externalId.trim()
		if (!externalId) throw new ConvexError("L'identifiant externe est requis")

		return ctx.db.insert("feedSources", {
			userId,
			name,
			type: args.type,
			externalId,
			avatarUrl: args.avatarUrl,
			isActive: true,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("feedSources"),
		name: v.optional(v.string()),
		externalId: v.optional(v.string()),
		avatarUrl: v.optional(v.string()),
		isActive: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const source = await ctx.db.get(id)
		if (!source || source.userId !== userId) throw new ConvexError("Introuvable")

		const patch: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(fields)) {
			if (value !== undefined) {
				patch[key] = value
			}
		}
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("feedSources") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const source = await ctx.db.get(id)
		if (!source || source.userId !== userId) throw new ConvexError("Introuvable")

		// Delete all feedItems for this source
		const items = await ctx.db
			.query("feedItems")
			.withIndex("by_source", (q) => q.eq("sourceId", id))
			.collect()
		for (const item of items) {
			await ctx.db.delete(item._id)
		}

		return ctx.db.delete(id)
	},
})
