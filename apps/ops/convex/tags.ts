import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("tags")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		color: v.string(),
	},
	handler: async (ctx, { name, color }) => {
		const { userId } = await requireAuth(ctx)
		const trimmed = name.trim().toLowerCase()
		if (!trimmed) throw new ConvexError("Le nom du tag est requis")
		return ctx.db.insert("tags", {
			userId,
			name: trimmed,
			color,
			createdAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: { id: v.id("tags") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const tag = await ctx.db.get(id)
		if (!tag || tag.userId !== userId) throw new ConvexError("Introuvable")

		// Remove tag from all entities that reference it
		const tables = ["notes", "projects", "timeEntries", "licenseKeys", "bookmarks"] as const
		for (const table of tables) {
			const rows = await ctx.db
				.query(table)
				.withIndex("by_user", (q) => q.eq("userId", userId))
				.collect()
			for (const row of rows) {
				if ((row as any).tags?.includes(id)) {
					await ctx.db.patch(row._id, {
						tags: (row as any).tags.filter((t: any) => t !== id),
					})
				}
			}
		}

		return ctx.db.delete(id)
	},
})
