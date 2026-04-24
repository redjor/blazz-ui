import { ConvexError, v } from "convex/values"
import { api, internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server"

const sourceTableValidator = v.union(v.literal("notes"), v.literal("bookmarks"))

// ── Queue : enqueue un doc à indexer ──

export const enqueueJob = internalMutation({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		// Dedup : si un job existe déjà pour cet id, on le laisse (sera traité avec l'état le plus récent)
		const existing = await ctx.db
			.query("embeddingJobs")
			.filter((q) => q.eq(q.field("sourceId"), sourceId))
			.first()
		if (existing) return existing._id

		return ctx.db.insert("embeddingJobs", {
			sourceTable,
			sourceId,
			attempts: 0,
			createdAt: Date.now(),
		})
	},
})

// ── Queue : cleanup quand une source est supprimée ──

export const removeForSource = internalMutation({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		// Delete embedding
		const emb = await ctx.db
			.query("embeddings")
			.withIndex("by_source", (q) => q.eq("sourceTable", sourceTable).eq("sourceId", sourceId))
			.first()
		if (emb) await ctx.db.delete(emb._id)

		// Delete any pending job
		const jobs = await ctx.db
			.query("embeddingJobs")
			.filter((q) => q.eq(q.field("sourceId"), sourceId))
			.collect()
		for (const job of jobs) await ctx.db.delete(job._id)
	},
})
