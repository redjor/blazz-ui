import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("bookmarkCollections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
		parentId: v.optional(v.id("bookmarkCollections")),
	},
	handler: async (ctx, { name, icon, color, parentId }) => {
		const { userId } = await requireAuth(ctx)
		const trimmed = name.trim()
		if (!trimmed) throw new ConvexError("Le nom est requis")

		if (parentId) {
			const parent = await ctx.db.get(parentId)
			if (!parent || parent.userId !== userId) throw new ConvexError("Collection parente introuvable")
			if (parent.parentId) throw new ConvexError("Maximum 2 niveaux de collections")
		}

		const siblings = await ctx.db
			.query("bookmarkCollections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const sameLevel = siblings.filter((c) => (parentId ? c.parentId === parentId : !c.parentId))
		const maxOrder = sameLevel.reduce((max, c) => Math.max(max, c.order), -1)

		return ctx.db.insert("bookmarkCollections", {
			userId,
			name: trimmed,
			icon,
			color,
			parentId,
			order: maxOrder + 1,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("bookmarkCollections"),
		name: v.optional(v.string()),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
		order: v.optional(v.number()),
	},
	handler: async (ctx, { id, name, icon, color, order }) => {
		const { userId } = await requireAuth(ctx)
		const col = await ctx.db.get(id)
		if (!col || col.userId !== userId) throw new ConvexError("Introuvable")

		const patch: Record<string, unknown> = {}
		if (name !== undefined) patch.name = name.trim() || col.name
		if (icon !== undefined) patch.icon = icon
		if (color !== undefined) patch.color = color
		if (order !== undefined) patch.order = order
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("bookmarkCollections") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const col = await ctx.db.get(id)
		if (!col || col.userId !== userId) throw new ConvexError("Introuvable")

		const bookmarks = await ctx.db
			.query("bookmarks")
			.withIndex("by_user_collection", (q) => q.eq("userId", userId).eq("collectionId", id))
			.collect()
		for (const b of bookmarks) {
			await ctx.db.patch(b._id, { collectionId: undefined })
		}

		const children = await ctx.db
			.query("bookmarkCollections")
			.withIndex("by_parent", (q) => q.eq("parentId", id))
			.collect()
		for (const child of children) {
			const childBookmarks = await ctx.db
				.query("bookmarks")
				.withIndex("by_user_collection", (q) => q.eq("userId", userId).eq("collectionId", child._id))
				.collect()
			for (const b of childBookmarks) {
				await ctx.db.patch(b._id, { collectionId: undefined })
			}
			await ctx.db.delete(child._id)
		}

		return ctx.db.delete(id)
	},
})
