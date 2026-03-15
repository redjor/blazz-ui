import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("licenseKeys")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("desc")
			.collect()
	},
})

export const create = mutation({
	args: {
		key: v.string(),
		plan: v.union(v.literal("PRO"), v.literal("TEAM"), v.literal("ENTERPRISE")),
		orgId: v.string(),
		clientId: v.optional(v.id("clients")),
		clientName: v.optional(v.string()),
		email: v.optional(v.string()),
		expiresAt: v.string(),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("licenseKeys", {
			...args,
			userId,
			createdAt: Date.now(),
		})
	},
})

export const revoke = mutation({
	args: { id: v.id("licenseKeys") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db.get(id)
		if (!existing || existing.userId !== userId) throw new ConvexError("Introuvable")
		if (existing.revokedAt) throw new ConvexError("Déjà révoquée")
		return ctx.db.patch(id, { revokedAt: Date.now() })
	},
})

export const remove = mutation({
	args: { id: v.id("licenseKeys") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db.get(id)
		if (!existing || existing.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.delete(id)
	},
})
