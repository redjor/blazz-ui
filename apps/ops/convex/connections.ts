import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Queries ──

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("connections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const get = query({
	args: { id: v.id("connections") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) return null
		return conn
	},
})

// ── Mutations ──

export const create = mutation({
	args: {
		provider: v.string(),
		label: v.string(),
		authType: v.union(v.literal("oauth2"), v.literal("api_key")),
		accessToken: v.optional(v.string()),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		scopes: v.optional(v.array(v.string())),
		apiKey: v.optional(v.string()),
		accountInfo: v.optional(
			v.object({
				email: v.optional(v.string()),
				name: v.optional(v.string()),
				avatar: v.optional(v.string()),
			})
		),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("connections", {
			...args,
			userId,
			status: "active",
			lastUsedAt: Date.now(),
		})
	},
})

export const updateTokens = mutation({
	args: {
		id: v.id("connections"),
		accessToken: v.string(),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		status: v.optional(v.union(v.literal("active"), v.literal("expired"), v.literal("error"))),
		errorMessage: v.optional(v.string()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) throw new Error("Not found")
		await ctx.db.patch(id, fields)
	},
})

export const markExpired = mutation({
	args: {
		id: v.id("connections"),
		errorMessage: v.string(),
	},
	handler: async (ctx, { id, errorMessage }) => {
		const { userId } = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) throw new Error("Not found")
		await ctx.db.patch(id, {
			status: "expired" as const,
			errorMessage,
		})
	},
})

export const remove = mutation({
	args: { id: v.id("connections") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) throw new Error("Not found")

		// Delete all agentConnections referencing this connection
		const links = await ctx.db
			.query("agentConnections")
			.withIndex("by_connection", (q) => q.eq("connectionId", id))
			.collect()
		for (const link of links) {
			await ctx.db.delete(link._id)
		}

		await ctx.db.delete(id)
	},
})

// ── Internal (for OAuth callback API route) ──

export const internalCreate = internalMutation({
	args: {
		userId: v.string(),
		provider: v.string(),
		label: v.string(),
		authType: v.union(v.literal("oauth2"), v.literal("api_key")),
		accessToken: v.optional(v.string()),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		scopes: v.optional(v.array(v.string())),
		accountInfo: v.optional(
			v.object({
				email: v.optional(v.string()),
				name: v.optional(v.string()),
				avatar: v.optional(v.string()),
			})
		),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("connections", {
			...args,
			status: "active",
			lastUsedAt: Date.now(),
		})
	},
})
