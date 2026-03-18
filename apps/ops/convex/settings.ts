import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const get = query({
	args: { key: v.string() },
	handler: async (ctx, { key }) => {
		const { userId } = await requireAuth(ctx)
		const setting = await ctx.db
			.query("settings")
			.withIndex("by_user_key", (q) => q.eq("userId", userId).eq("key", key))
			.first()
		return setting?.value ?? null
	},
})

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const settings = await ctx.db
			.query("settings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		return Object.fromEntries(settings.map((s) => [s.key, s.value]))
	},
})

export const set = mutation({
	args: {
		key: v.string(),
		value: v.string(),
	},
	handler: async (ctx, { key, value }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("settings")
			.withIndex("by_user_key", (q) => q.eq("userId", userId).eq("key", key))
			.first()

		if (existing) {
			return ctx.db.patch(existing._id, { value })
		}
		return ctx.db.insert("settings", { userId, key, value })
	},
})

export const remove = mutation({
	args: { key: v.string() },
	handler: async (ctx, { key }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("settings")
			.withIndex("by_user_key", (q) => q.eq("userId", userId).eq("key", key))
			.first()
		if (existing) {
			return ctx.db.delete(existing._id)
		}
	},
})
