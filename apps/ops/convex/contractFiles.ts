import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth } from "./lib/auth"

// ── Queries ────────────────────────────────────────

export const listByContract = query({
	args: { contractId: v.id("contracts") },
	handler: async (ctx, { contractId }) => {
		await requireAuth(ctx)
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
		await requireAuth(ctx)
		return ctx.db.insert("contractFiles", {
			...args,
			createdAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: { id: v.id("contractFiles") },
	handler: async (ctx, { id }) => {
		await requireAuth(ctx)
		const file = await ctx.db.get(id)
		if (!file) throw new Error("Fichier introuvable.")
		await ctx.storage.delete(file.storageId)
		await ctx.db.delete(id)
	},
})
