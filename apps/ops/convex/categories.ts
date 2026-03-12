import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("categories")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("asc")
			.collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		color: v.optional(v.string()),
	},
	handler: async (ctx, { name, color }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("categories", { name, color, userId, createdAt: Date.now() })
	},
})

export const update = mutation({
	args: {
		id: v.id("categories"),
		name: v.optional(v.string()),
		color: v.optional(v.string()),
	},
	handler: async (ctx, { id, name, color }) => {
		const { userId } = await requireAuth(ctx)
		const category = await ctx.db.get(id)
		if (!category || category.userId !== userId) throw new ConvexError("Introuvable")
		const patch: Record<string, unknown> = {}
		if (name !== undefined) patch.name = name
		if (color !== undefined) patch.color = color
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("categories") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const category = await ctx.db.get(id)
		if (!category || category.userId !== userId) throw new ConvexError("Introuvable")
		// Nullify categoryId on all todos linked to this category (same user only)
		const linked = await ctx.db
			.query("todos")
			.withIndex("by_user_category", (q) => q.eq("userId", userId).eq("categoryId", id))
			.collect()
		await Promise.all(linked.map((t) => ctx.db.patch(t._id, { categoryId: undefined })))
		await ctx.db.delete(id)
	},
})
