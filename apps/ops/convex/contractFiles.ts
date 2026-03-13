import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Queries ────────────────────────────────────────

export const listByContract = query({
	args: { contractId: v.id("contracts") },
	handler: async (ctx, { contractId }) => {
		const { userId } = await requireAuth(ctx)
		const contract = await ctx.db.get(contractId)
		if (!contract || contract.userId !== userId) return []

		const files = await ctx.db
			.query("contractFiles")
			.withIndex("by_contract", (q) => q.eq("contractId", contractId))
			.collect()

		const withUrls = await Promise.all(
			files.map(async (f) => ({
				...f,
				url: await ctx.storage.getUrl(f.storageId),
			}))
		)
		return withUrls.sort((a, b) => b.createdAt - a.createdAt)
	},
})

// ── Mutations ──────────────────────────────────────

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		await requireAuth(ctx)
		return ctx.storage.generateUploadUrl()
	},
})

export const create = mutation({
	args: {
		contractId: v.id("contracts"),
		storageId: v.id("_storage"),
		fileName: v.string(),
		fileSize: v.number(),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const contract = await ctx.db.get(args.contractId)
		if (!contract || contract.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.insert("contractFiles", {
			...args,
			userId,
			createdAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: { id: v.id("contractFiles") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const file = await ctx.db.get(id)
		if (!file || file.userId !== userId) throw new ConvexError("Introuvable")
		await ctx.storage.delete(file.storageId)
		await ctx.db.delete(id)
	},
})
