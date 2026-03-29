import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const listByAgent = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		await requireAuth(ctx)
		const links = await ctx.db
			.query("agentConnections")
			.withIndex("by_agent", (q) => q.eq("agentId", agentId))
			.collect()

		// Resolve connections
		const connections = await Promise.all(
			links.map(async (link) => {
				const conn = await ctx.db.get(link.connectionId)
				return conn ? { ...conn, linkId: link._id } : null
			})
		)
		return connections.filter(Boolean)
	},
})

export const link = mutation({
	args: {
		agentId: v.id("agents"),
		connectionId: v.id("connections"),
	},
	handler: async (ctx, { agentId, connectionId }) => {
		const { userId } = await requireAuth(ctx)

		// Check agent and connection belong to user
		const agent = await ctx.db.get(agentId)
		if (!agent || agent.userId !== userId) throw new Error("Agent not found")
		const conn = await ctx.db.get(connectionId)
		if (!conn || conn.userId !== userId) throw new Error("Connection not found")

		// Prevent duplicates
		const existing = await ctx.db
			.query("agentConnections")
			.withIndex("by_agent", (q) => q.eq("agentId", agentId))
			.collect()
		if (existing.some((e) => e.connectionId === connectionId)) return

		return ctx.db.insert("agentConnections", {
			userId,
			agentId,
			connectionId,
			addedAt: Date.now(),
		})
	},
})

export const unlink = mutation({
	args: {
		agentId: v.id("agents"),
		connectionId: v.id("connections"),
	},
	handler: async (ctx, { agentId, connectionId }) => {
		const { userId } = await requireAuth(ctx)
		const links = await ctx.db
			.query("agentConnections")
			.withIndex("by_agent", (q) => q.eq("agentId", agentId))
			.collect()

		const link = links.find((l) => l.connectionId === connectionId)
		if (link && link.userId === userId) {
			await ctx.db.delete(link._id)
		}
	},
})
