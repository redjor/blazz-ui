import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("chatMessages")
			.withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
			.collect()
	},
})

export const append = mutation({
	args: {
		agentId: v.id("agents"),
		role: v.union(v.literal("user"), v.literal("assistant")),
		content: v.string(),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("chatMessages", { ...args, userId })
	},
})

export const clear = mutation({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const { userId } = await requireAuth(ctx)
		const messages = await ctx.db
			.query("chatMessages")
			.withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
			.collect()
		for (const m of messages) {
			await ctx.db.delete(m._id)
		}
	},
})
