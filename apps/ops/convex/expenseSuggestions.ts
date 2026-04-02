import { v } from "convex/values"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const listPending = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("expenseSuggestions")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "pending"))
			.collect()
	},
})

/** All qontoTransactionIds that have been processed (for deduplication) */
export const listProcessedTransactionIds = internalQuery({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const all = await ctx.db
			.query("expenseSuggestions")
			.withIndex("by_user_status", (q) => q.eq("userId", userId))
			.collect()
		// Return ALL transaction IDs (pending + accepted + rejected) to avoid re-suggesting
		return all.map((s) => s.qontoTransactionId)
	},
})

export const accept = mutation({
	args: { id: v.id("expenseSuggestions") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const suggestion = await ctx.db.get(id)
		if (!suggestion || suggestion.userId !== userId) throw new Error("Not found")
		if (suggestion.status !== "pending") throw new Error("Already processed")

		// Create expense from suggestion
		await ctx.db.insert("expenses", {
			userId,
			type: "restaurant",
			date: suggestion.date,
			amountCents: suggestion.amountCents,
			notes: suggestion.label,
			qontoTransactionId: suggestion.qontoTransactionId,
			createdAt: Date.now(),
		})

		await ctx.db.patch(id, { status: "accepted" })
	},
})

export const reject = mutation({
	args: { id: v.id("expenseSuggestions") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const suggestion = await ctx.db.get(id)
		if (!suggestion || suggestion.userId !== userId) throw new Error("Not found")
		if (suggestion.status !== "pending") throw new Error("Already processed")
		await ctx.db.patch(id, { status: "rejected" })
	},
})

export const acceptAll = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const pending = await ctx.db
			.query("expenseSuggestions")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "pending"))
			.collect()

		for (const suggestion of pending) {
			await ctx.db.insert("expenses", {
				userId,
				type: "restaurant",
				date: suggestion.date,
				amountCents: suggestion.amountCents,
				notes: suggestion.label,
				qontoTransactionId: suggestion.qontoTransactionId,
				createdAt: Date.now(),
			})
			await ctx.db.patch(suggestion._id, { status: "accepted" })
		}

		return { accepted: pending.length }
	},
})

export const rejectAll = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const pending = await ctx.db
			.query("expenseSuggestions")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "pending"))
			.collect()

		for (const suggestion of pending) {
			await ctx.db.patch(suggestion._id, { status: "rejected" })
		}

		return { rejected: pending.length }
	},
})

export const insertFromAction = internalMutation({
	args: {
		userId: v.string(),
		source: v.literal("qonto"),
		syncedAt: v.number(),
		suggestions: v.array(
			v.object({
				qontoTransactionId: v.string(),
				label: v.string(),
				amountCents: v.number(),
				date: v.string(),
				confidence: v.number(),
			})
		),
	},
	handler: async (ctx, { userId, source, syncedAt, suggestions }) => {
		let inserted = 0
		for (const suggestion of suggestions) {
			await ctx.db.insert("expenseSuggestions", {
				userId,
				source,
				syncedAt,
				status: "pending",
				...suggestion,
			})
			inserted++
		}
		return { inserted }
	},
})
