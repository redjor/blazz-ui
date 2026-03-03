import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("categories").order("asc").collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		color: v.optional(v.string()),
	},
	handler: async (ctx, { name, color }) => {
		return ctx.db.insert("categories", { name, color, createdAt: Date.now() })
	},
})

export const update = mutation({
	args: {
		id: v.id("categories"),
		name: v.optional(v.string()),
		color: v.optional(v.string()),
	},
	handler: async (ctx, { id, name, color }) => {
		const patch: Record<string, unknown> = {}
		if (name !== undefined) patch.name = name
		if (color !== undefined) patch.color = color
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("categories") },
	handler: async (ctx, { id }) => {
		// Nullify categoryId on all todos linked to this category
		const linked = await ctx.db
			.query("todos")
			.withIndex("by_category", (q) => q.eq("categoryId", id))
			.collect()
		await Promise.all(linked.map((t) => ctx.db.patch(t._id, { categoryId: undefined })))
		await ctx.db.delete(id)
	},
})
