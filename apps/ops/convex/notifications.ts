import { ConvexError, v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const sourceValidator = v.union(v.literal("github"), v.literal("vercel"), v.literal("convex"))

// ── Queries ──

export const list = query({
	args: {
		source: v.optional(sourceValidator),
		read: v.optional(v.boolean()),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, { source, read, limit = 50 }) => {
		const { userId } = await requireAuth(ctx)
		const rows = await ctx.db
			.query("notifications")
			.withIndex("by_user_date", (q) => q.eq("userId", userId))
			.order("desc")
			.collect()

		return rows
			.filter((n) => n.archivedAt === undefined)
			.filter((n) => (source !== undefined ? n.source === source : true))
			.filter((n) => (read !== undefined ? n.read === read : true))
			.slice(0, limit)
	},
})

export const unreadCount = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const rows = await ctx.db
			.query("notifications")
			.withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
			.collect()

		return rows.filter((n) => n.archivedAt === undefined).length
	},
})

// ── Mutations ──

export const markRead = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const notification = await ctx.db.get(id)
		if (!notification || notification.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { read: true })
	},
})

export const markAllRead = mutation({
	args: {
		source: v.optional(sourceValidator),
	},
	handler: async (ctx, { source }) => {
		const { userId } = await requireAuth(ctx)
		const rows = await ctx.db
			.query("notifications")
			.withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
			.collect()

		const toUpdate = rows
			.filter((n) => n.archivedAt === undefined)
			.filter((n) => (source !== undefined ? n.source === source : true))

		for (const n of toUpdate) {
			await ctx.db.patch(n._id, { read: true })
		}
	},
})

export const archive = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const notification = await ctx.db.get(id)
		if (!notification || notification.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { archivedAt: Date.now() })
	},
})

export const archiveAllRead = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const rows = await ctx.db
			.query("notifications")
			.withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", true))
			.collect()

		const toArchive = rows.filter((n) => n.archivedAt === undefined)

		for (const n of toArchive) {
			await ctx.db.patch(n._id, { archivedAt: Date.now() })
		}
	},
})

// ── Internal Mutations ──

export const internalCreate = internalMutation({
	args: {
		userId: v.string(),
		source: sourceValidator,
		externalId: v.string(),
		title: v.string(),
		description: v.string(),
		actionType: v.string(),
		status: v.optional(v.string()),
		priority: v.optional(v.string()),
		authorName: v.string(),
		authorInitials: v.string(),
		authorColor: v.optional(v.string()),
		authorAvatar: v.optional(v.string()),
		url: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Idempotence check: skip if same source+externalId already exists
		const existing = await ctx.db
			.query("notifications")
			.withIndex("by_source_external", (q) =>
				q.eq("source", args.source).eq("externalId", args.externalId)
			)
			.first()

		if (existing) return existing._id

		return ctx.db.insert("notifications", {
			...args,
			read: false,
			createdAt: Date.now(),
		})
	},
})

export const cleanupOld = internalMutation({
	args: {},
	handler: async (ctx) => {
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

		// Scan all notifications that have been archived
		// We use a broad query since there's no index on archivedAt
		const allNotifications = await ctx.db.query("notifications").collect()

		const toDelete = allNotifications.filter(
			(n) => n.archivedAt !== undefined && n.archivedAt < thirtyDaysAgo
		)

		for (const n of toDelete) {
			await ctx.db.delete(n._id)
		}
	},
})
