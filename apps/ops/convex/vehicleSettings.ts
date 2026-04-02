import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const get = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("vehicleSettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()
	},
})

export const save = mutation({
	args: {
		fiscalPower: v.number(),
		vehicleType: v.union(v.literal("car"), v.literal("motorcycle")),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("vehicleSettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, args)
			return existing._id
		}
		return ctx.db.insert("vehicleSettings", { ...args, userId })
	},
})
