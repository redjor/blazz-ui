import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {
		type: v.optional(v.union(v.literal("youtube"), v.literal("rss"))),
		unreadOnly: v.optional(v.boolean()),
		favoritesOnly: v.optional(v.boolean()),
	},
	handler: async (ctx, { type, unreadOnly, favoritesOnly }) => {
		const { userId } = await requireAuth(ctx)

		// biome-ignore lint/suspicious/noImplicitAnyLet: type inferred from first assignment
		let results
		if (type) {
			results = await ctx.db
				.query("feedItems")
				.withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type))
				.collect()
		} else {
			results = await ctx.db
				.query("feedItems")
				.withIndex("by_user", (q) => q.eq("userId", userId))
				.collect()
		}

		if (unreadOnly) {
			results = results.filter((item) => !item.isRead)
		}

		if (favoritesOnly) {
			results = results.filter((item) => item.isFavorite)
		}

		return results.sort((a, b) => b.publishedAt - a.publishedAt)
	},
})

export const unreadCount = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const items = await ctx.db
			.query("feedItems")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		return items.filter((item) => !item.isRead).length
	},
})

export const markRead = mutation({
	args: { id: v.id("feedItems") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const item = await ctx.db.get(id)
		if (!item || item.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { isRead: true })
	},
})

export const toggleFavorite = mutation({
	args: { id: v.id("feedItems") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const item = await ctx.db.get(id)
		if (!item || item.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { isFavorite: !item.isFavorite })
	},
})

export const markAllRead = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const items = await ctx.db
			.query("feedItems")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		for (const item of items) {
			if (!item.isRead) {
				await ctx.db.patch(item._id, { isRead: true })
			}
		}
	},
})
