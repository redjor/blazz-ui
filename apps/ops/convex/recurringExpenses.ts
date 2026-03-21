import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const expenses = await ctx.db
			.query("recurringExpenses")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		return expenses.sort((a, b) => b.createdAt - a.createdAt)
	},
})

export const listActive = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("recurringExpenses")
			.withIndex("by_user_active", (q) => q.eq("userId", userId).eq("active", true))
			.collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		amountCents: v.number(),
		amountType: v.union(v.literal("fixed"), v.literal("variable")),
		frequency: v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly")),
		dayOfMonth: v.optional(v.number()),
		categoryId: v.optional(v.id("categories")),
		startDate: v.string(),
		endDate: v.optional(v.string()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("recurringExpenses", {
			...args,
			userId,
			active: true,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("recurringExpenses"),
		name: v.optional(v.string()),
		amountCents: v.optional(v.number()),
		amountType: v.optional(v.union(v.literal("fixed"), v.literal("variable"))),
		frequency: v.optional(v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly"))),
		dayOfMonth: v.optional(v.number()),
		categoryId: v.optional(v.id("categories")),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		active: v.optional(v.boolean()),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { id, ...updates }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db.get(id)
		if (!existing || existing.userId !== userId) {
			throw new Error("Not found")
		}
		// Filter out undefined values
		const patch: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(updates)) {
			if (value !== undefined) {
				patch[key] = value
			}
		}
		await ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("recurringExpenses") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db.get(id)
		if (!existing || existing.userId !== userId) {
			throw new Error("Not found")
		}
		await ctx.db.delete(id)
	},
})
