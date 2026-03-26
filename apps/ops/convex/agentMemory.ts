import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const { userId } = await requireAuth(ctx)
		const memories = await ctx.db
			.query("agentMemory")
			.withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
			.collect()

		// Filter expired
		const now = Date.now()
		return memories.filter((m) => !m.expiresAt || m.expiresAt > now)
	},
})

export const add = mutation({
	args: {
		agentId: v.id("agents"),
		missionId: v.optional(v.id("missions")),
		type: v.union(v.literal("summary"), v.literal("learning"), v.literal("fact")),
		content: v.string(),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("agentMemory", { ...args, userId })
	},
})

export const remove = mutation({
	args: { id: v.id("agentMemory") },
	handler: async (ctx, { id }) => {
		await ctx.db.delete(id)
	},
})
