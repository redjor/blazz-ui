import { v } from "convex/values"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const categoryValidator = v.union(
	v.literal("fact"),
	v.literal("preference"),
	v.literal("episode"),
	v.literal("pattern"),
	v.literal("rule"),
)

// ── Public (authenticated) ──

export const list = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const { userId } = await requireAuth(ctx)
		const memories = await ctx.db
			.query("agentMemory")
			.withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
			.collect()

		const now = Date.now()
		return memories.filter((m) => !m.expiresAt || m.expiresAt > now)
	},
})

export const listShared = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const memories = await ctx.db
			.query("agentMemory")
			.withIndex("by_scope", (q) => q.eq("userId", userId).eq("scope", "shared"))
			.collect()

		const now = Date.now()
		return memories.filter((m) => !m.expiresAt || m.expiresAt > now)
	},
})

export const listAll = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const all = await ctx.db.query("agentMemory").collect()
		const now = Date.now()
		return all
			.filter((m) => m.userId === userId)
			.filter((m) => !m.expiresAt || m.expiresAt > now)
	},
})

export const add = mutation({
	args: {
		agentId: v.optional(v.id("agents")),
		missionId: v.optional(v.id("missions")),
		scope: v.union(v.literal("private"), v.literal("shared")),
		category: categoryValidator,
		content: v.string(),
		confidence: v.optional(v.number()),
		source: v.optional(v.string()),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("agentMemory", {
			...args,
			userId,
			lastConfirmedAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: { id: v.id("agentMemory") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const mem = await ctx.db.get(id)
		if (!mem || mem.userId !== userId) return
		await ctx.db.delete(id)
	},
})

// ── Internal (for worker, no auth) ──

export const internalList = internalQuery({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const memories = await ctx.db.query("agentMemory").collect()
		const now = Date.now()
		return memories
			.filter((m) => m.agentId === agentId && m.scope === "private")
			.filter((m) => !m.expiresAt || m.expiresAt > now)
	},
})

export const internalAdd = internalMutation({
	args: {
		userId: v.id("users"),
		agentId: v.optional(v.id("agents")),
		missionId: v.optional(v.id("missions")),
		scope: v.union(v.literal("private"), v.literal("shared")),
		category: categoryValidator,
		content: v.string(),
		confidence: v.optional(v.number()),
		source: v.optional(v.string()),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("agentMemory", { ...args, lastConfirmedAt: Date.now() })
	},
})
