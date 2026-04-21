import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const listRecent = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit = 50 }) => {
		const { userId } = await requireAuth(ctx)
		const userAgents = await ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const agentIds = new Set(userAgents.map((a) => a._id))
		// Logs have no userId column; over-fetch then filter by agent ownership.
		const logs = await ctx.db
			.query("agentLogs")
			.order("desc")
			.take(limit * 3)
		return logs.filter((l) => agentIds.has(l.agentId)).slice(0, limit)
	},
})

export const list = query({
	args: { missionId: v.id("missions") },
	handler: async (ctx, { missionId }) => {
		const { userId } = await requireAuth(ctx)
		const mission = await ctx.db.get(missionId)
		if (!mission || mission.userId !== userId) return []
		return ctx.db
			.query("agentLogs")
			.withIndex("by_mission", (q) => q.eq("missionId", missionId))
			.collect()
	},
})

export const append = mutation({
	args: {
		missionId: v.id("missions"),
		agentId: v.id("agents"),
		type: v.union(v.literal("thinking"), v.literal("tool_call"), v.literal("tool_result"), v.literal("error"), v.literal("budget_warning"), v.literal("done")),
		content: v.string(),
		toolName: v.optional(v.string()),
		duration: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("agentLogs", args)
	},
})

export const internalAppend = internalMutation({
	args: {
		missionId: v.id("missions"),
		agentId: v.id("agents"),
		type: v.union(v.literal("thinking"), v.literal("tool_call"), v.literal("tool_result"), v.literal("error"), v.literal("budget_warning"), v.literal("done")),
		content: v.string(),
		toolName: v.optional(v.string()),
		duration: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("agentLogs", args)
	},
})
