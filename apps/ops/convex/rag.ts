import { ConvexError, v } from "convex/values"
import { api, internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { buildIndexableText } from "./lib/rag/buildIndexableText"
import { contentHash } from "./lib/rag/contentHash"
import { embedBatch, OpenAIError } from "./lib/rag/openai"

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

// ── Support internes pour l'indexer ──

export const _getPendingJobs = internalQuery({
	args: { limit: v.number() },
	handler: async (ctx, { limit }) => {
		return ctx.db.query("embeddingJobs").withIndex("by_created").order("asc").take(limit)
	},
})

export const _getSourceDoc = internalQuery({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceId }) => {
		return ctx.db.get(sourceId)
	},
})

export const _getExistingEmbedding = internalQuery({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		return ctx.db
			.query("embeddings")
			.withIndex("by_source", (q) => q.eq("sourceTable", sourceTable).eq("sourceId", sourceId))
			.first()
	},
})

export const _upsertEmbedding = internalMutation({
	args: {
		existingId: v.optional(v.id("embeddings")),
		userId: v.string(),
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
		contentHash: v.string(),
		text: v.string(),
		vector: v.array(v.number()),
	},
	handler: async (ctx, { existingId, ...fields }) => {
		const payload = { ...fields, updatedAt: Date.now() }
		if (existingId) {
			await ctx.db.patch(existingId, payload)
			return existingId
		}
		return ctx.db.insert("embeddings", payload)
	},
})

export const _deleteJob = internalMutation({
	args: { jobId: v.id("embeddingJobs") },
	handler: async (ctx, { jobId }) => {
		await ctx.db.delete(jobId)
	},
})

export const _markJobFailed = internalMutation({
	args: { jobId: v.id("embeddingJobs"), error: v.string() },
	handler: async (ctx, { jobId, error }) => {
		const job = await ctx.db.get(jobId)
		if (!job) return
		const attempts = job.attempts + 1
		if (attempts >= 5) {
			// Abandon
			await ctx.db.delete(jobId)
			return
		}
		await ctx.db.patch(jobId, { attempts, lastError: error.slice(0, 500) })
	},
})

// ── Indexer action (appelée par le cron toutes les 60s) ──

export const indexPendingJobs = action({
	args: {},
	handler: async (ctx): Promise<{ processed: number; skipped: number; failed: number }> => {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) {
			console.error("[rag] OPENAI_API_KEY not set, skipping")
			return { processed: 0, skipped: 0, failed: 0 }
		}

		const jobs = await ctx.runQuery(internal.rag._getPendingJobs, { limit: 50 })
		if (jobs.length === 0) return { processed: 0, skipped: 0, failed: 0 }

		type BatchItem = {
			job: (typeof jobs)[number]
			text: string
			hash: string
			existingId: Id<"embeddings"> | undefined
			userId: string
		}
		const batch: BatchItem[] = []
		let skipped = 0

		for (const job of jobs) {
			try {
				const doc = await ctx.runQuery(internal.rag._getSourceDoc, {
					sourceTable: job.sourceTable,
					sourceId: job.sourceId,
				})
				if (!doc) {
					// Source disparu → delete embedding + job (GC)
					await ctx.runMutation(internal.rag.removeForSource, {
						sourceTable: job.sourceTable,
						sourceId: job.sourceId,
					})
					skipped++
					continue
				}

				const text =
					job.sourceTable === "notes"
						? buildIndexableText({
								kind: "notes",
								title: (doc as { title?: string }).title,
								contentText: (doc as { contentText?: string }).contentText,
							})
						: buildIndexableText({
								kind: "bookmarks",
								title: (doc as { title?: string }).title,
								notes: (doc as { notes?: string }).notes,
								description: (doc as { description?: string }).description,
								url: (doc as { url: string }).url,
							})

				const hash = await contentHash(text)

				const existing = await ctx.runQuery(internal.rag._getExistingEmbedding, {
					sourceTable: job.sourceTable,
					sourceId: job.sourceId,
				})

				if (existing && existing.contentHash === hash) {
					// Skip — contenu identique, delete le job
					await ctx.runMutation(internal.rag._deleteJob, { jobId: job._id })
					skipped++
					continue
				}

				batch.push({
					job,
					text,
					hash,
					existingId: existing?._id,
					userId: (doc as { userId: string }).userId,
				})
			} catch (err) {
				await ctx.runMutation(internal.rag._markJobFailed, {
					jobId: job._id,
					error: err instanceof Error ? err.message : String(err),
				})
			}
		}

		if (batch.length === 0) return { processed: 0, skipped, failed: 0 }

		let failed = 0
		try {
			const { vectors } = await embedBatch(
				batch.map((b) => b.text),
				apiKey
			)
			for (let i = 0; i < batch.length; i++) {
				const b = batch[i]
				const vec = vectors[i]
				await ctx.runMutation(internal.rag._upsertEmbedding, {
					existingId: b.existingId,
					userId: b.userId,
					sourceTable: b.job.sourceTable,
					sourceId: b.job.sourceId,
					contentHash: b.hash,
					text: b.text,
					vector: vec,
				})
				await ctx.runMutation(internal.rag._deleteJob, { jobId: b.job._id })
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			const retryable = err instanceof OpenAIError ? err.retryable : true
			for (const b of batch) {
				await ctx.runMutation(internal.rag._markJobFailed, {
					jobId: b.job._id,
					error: retryable ? `transient: ${message}` : `non-retryable: ${message}`,
				})
				failed++
			}
		}

		return { processed: batch.length - failed, skipped, failed }
	},
})

// ── Search (appelée par le MCP tool search_knowledge) ──

export type SearchHit = {
	sourceTable: "notes" | "bookmarks"
	sourceId: string
	text: string
	score: number
}

export const searchKnowledge = action({
	args: {
		query: v.string(),
		limit: v.number(),
		sourceTable: v.optional(sourceTableValidator),
	},
	handler: async (ctx, { query, limit, sourceTable }): Promise<SearchHit[]> => {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) throw new ConvexError("OPENAI_API_KEY not configured")

		const userId = process.env.OPS_USER_ID
		if (!userId) throw new ConvexError("OPS_USER_ID not configured")

		if (!query.trim()) return []

		// Embed la query
		const { vectors } = await embedBatch([query], apiKey)
		const queryVector = vectors[0]

		// Vector search — Convex filter DSL only supports a single .eq() per call.
		// Single-user app → skip userId filter (redundant). Post-filter userId in memory below.
		const effectiveLimit = Math.min(limit, 30)
		const results = await ctx.vectorSearch("embeddings", "by_vector", {
			vector: queryVector,
			limit: Math.min(effectiveLimit * 2, 60),
			filter: sourceTable ? (q) => q.eq("sourceTable", sourceTable) : undefined,
		})

		// Filter by score threshold + userId (defensive) + fetch text
		const filtered = results.filter((r) => r._score >= 0.25).slice(0, effectiveLimit * 2)

		const hits: SearchHit[] = []
		for (const r of filtered) {
			if (hits.length >= effectiveLimit) break
			const emb = await ctx.runQuery(internal.rag._getEmbeddingById, { id: r._id })
			if (!emb) continue
			if (emb.userId !== userId) continue
			hits.push({
				sourceTable: emb.sourceTable,
				sourceId: emb.sourceId,
				text: emb.text.slice(0, 300),
				score: r._score,
			})
		}
		return hits
	},
})

export const _getEmbeddingById = internalQuery({
	args: { id: v.id("embeddings") },
	handler: async (ctx, { id }) => ctx.db.get(id),
})

// ── Admin : backfill one-shot pour les data existantes ──

export const backfillAll = mutation({
	args: {},
	handler: async (ctx) => {
		const notes = await ctx.db.query("notes").collect()
		const bookmarks = await ctx.db.query("bookmarks").collect()

		let enqueued = 0
		for (const n of notes) {
			await ctx.db.insert("embeddingJobs", {
				sourceTable: "notes",
				sourceId: n._id,
				attempts: 0,
				createdAt: Date.now(),
			})
			enqueued++
		}
		for (const b of bookmarks) {
			await ctx.db.insert("embeddingJobs", {
				sourceTable: "bookmarks",
				sourceId: b._id,
				attempts: 0,
				createdAt: Date.now(),
			})
			enqueued++
		}
		return { enqueued, notes: notes.length, bookmarks: bookmarks.length }
	},
})

// ── Stats pour debug ──

export const stats = query({
	args: {},
	handler: async (ctx) => {
		const embeddings = await ctx.db.query("embeddings").collect()
		const jobs = await ctx.db.query("embeddingJobs").collect()

		const byTable: Record<string, number> = {}
		for (const e of embeddings) {
			byTable[e.sourceTable] = (byTable[e.sourceTable] ?? 0) + 1
		}

		return {
			totalEmbeddings: embeddings.length,
			byTable,
			pendingJobs: jobs.length,
			failedJobs: jobs.filter((j) => j.attempts > 0).length,
		}
	},
})
