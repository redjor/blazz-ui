import { v } from "convex/values"
import { internalQuery, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const configs = await ctx.db
			.query("providerConfigs")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		// Never expose clientSecret to the client — return only provider + masked secret
		return configs.map((c) => ({
			_id: c._id,
			provider: c.provider,
			clientId: c.clientId,
			hasSecret: !!c.clientSecret,
			configuredAt: c.configuredAt,
		}))
	},
})

export const getByProvider = query({
	args: { provider: v.string() },
	handler: async (ctx, { provider }) => {
		const { userId } = await requireAuth(ctx)
		const config = await ctx.db
			.query("providerConfigs")
			.withIndex("by_user_provider", (q) => q.eq("userId", userId).eq("provider", provider))
			.first()
		if (!config) return null
		return {
			_id: config._id,
			provider: config.provider,
			clientId: config.clientId,
			hasSecret: !!config.clientSecret,
			configuredAt: config.configuredAt,
		}
	},
})

export const upsert = mutation({
	args: {
		provider: v.string(),
		clientId: v.string(),
		clientSecret: v.string(),
	},
	handler: async (ctx, { provider, clientId, clientSecret }) => {
		const { userId } = await requireAuth(ctx)

		const existing = await ctx.db
			.query("providerConfigs")
			.withIndex("by_user_provider", (q) => q.eq("userId", userId).eq("provider", provider))
			.first()

		if (existing) {
			await ctx.db.patch(existing._id, {
				clientId,
				clientSecret,
				configuredAt: Date.now(),
			})
			return existing._id
		}

		return ctx.db.insert("providerConfigs", {
			userId,
			provider,
			clientId,
			clientSecret,
			configuredAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: { provider: v.string() },
	handler: async (ctx, { provider }) => {
		const { userId } = await requireAuth(ctx)
		const config = await ctx.db
			.query("providerConfigs")
			.withIndex("by_user_provider", (q) => q.eq("userId", userId).eq("provider", provider))
			.first()
		if (config) {
			await ctx.db.delete(config._id)
		}
	},
})

// Internal — used by API routes to get full credentials (with secret)
export const internalGetByProvider = internalQuery({
	args: { userId: v.string(), provider: v.string() },
	handler: async (ctx, { userId, provider }) => {
		return ctx.db
			.query("providerConfigs")
			.withIndex("by_user_provider", (q) => q.eq("userId", userId).eq("provider", provider))
			.first()
	},
})
