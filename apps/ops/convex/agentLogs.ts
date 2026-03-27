import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"

export const listRecent = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit = 50 }) => {
		return ctx.db.query("agentLogs").order("desc").take(limit)
	},
})

export const list = query({
	args: { missionId: v.id("missions") },
	handler: async (ctx, { missionId }) => {
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
		type: v.union(
			v.literal("thinking"),
			v.literal("tool_call"),
			v.literal("tool_result"),
			v.literal("error"),
			v.literal("budget_warning"),
			v.literal("done")
		),
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
		type: v.union(
			v.literal("thinking"),
			v.literal("tool_call"),
			v.literal("tool_result"),
			v.literal("error"),
			v.literal("budget_warning"),
			v.literal("done")
		),
		content: v.string(),
		toolName: v.optional(v.string()),
		duration: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("agentLogs", args)
	},
})
