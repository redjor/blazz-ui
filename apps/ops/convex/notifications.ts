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

// ---------------------------------------------------------------------------
// Seed (temporary — remove after testing)
// ---------------------------------------------------------------------------

export const seed = internalMutation({
	args: {},
	handler: async (ctx) => {
		// Grab first user from the users table
		const user = await ctx.db.query("users").first()
		if (!user) throw new Error("No users found — log in first")
		const userId = user._id
		const now = Date.now()

		const samples = [
			{
				source: "github" as const,
				externalId: `seed-gh-1`,
				title: "PR #142 merged on blazz-ui-app",
				description: "feat: add inbox block component",
				actionType: "comment",
				status: "done",
				authorName: "jonathanruas",
				authorInitials: "JR",
				authorAvatar: "https://avatars.githubusercontent.com/u/12345?v=4",
				url: "https://github.com/blazz/blazz-ui-app/pull/142",
				read: false,
				createdAt: now - 5 * 60 * 1000, // 5 min ago
			},
			{
				source: "github" as const,
				externalId: `seed-gh-2`,
				title: "Review requested on PR #143",
				description: "refactor: migrate auth middleware to new compliance model",
				actionType: "mention",
				status: "in-progress",
				priority: "high",
				authorName: "dependabot[bot]",
				authorInitials: "DE",
				url: "https://github.com/blazz/blazz-ui-app/pull/143",
				read: false,
				createdAt: now - 15 * 60 * 1000, // 15 min ago
			},
			{
				source: "vercel" as const,
				externalId: `seed-vercel-1`,
				title: "Deploy succeeded on main",
				description: "feat: add notifications inbox page",
				actionType: "added",
				status: "done",
				authorName: "Vercel",
				authorInitials: "VC",
				authorColor: "#000000",
				read: true,
				createdAt: now - 30 * 60 * 1000, // 30 min ago
			},
			{
				source: "vercel" as const,
				externalId: `seed-vercel-2`,
				title: "Deploy failed on develop",
				description: "fix: resolve type errors in webhook handlers",
				actionType: "added",
				status: "urgent",
				priority: "high",
				authorName: "Vercel",
				authorInitials: "VC",
				authorColor: "#000000",
				read: false,
				createdAt: now - 45 * 60 * 1000, // 45 min ago
			},
			{
				source: "github" as const,
				externalId: `seed-gh-3`,
				title: "CI failed: typecheck",
				description: "Type error in convex/http.ts — Property 'source' does not exist",
				actionType: "mention",
				status: "urgent",
				priority: "high",
				authorName: "github-actions",
				authorInitials: "GA",
				url: "https://github.com/blazz/blazz-ui-app/actions/runs/123",
				read: false,
				createdAt: now - 2 * 60 * 60 * 1000, // 2h ago
			},
			{
				source: "github" as const,
				externalId: `seed-gh-4`,
				title: "Comment on #138",
				description: "Looks good! Just one nit: the error message should be more descriptive.",
				actionType: "reply",
				authorName: "sarah-dev",
				authorInitials: "SD",
				authorColor: "#8b5cf6",
				url: "https://github.com/blazz/blazz-ui-app/pull/138#comment-456",
				read: true,
				createdAt: now - 3 * 60 * 60 * 1000, // 3h ago
			},
			{
				source: "convex" as const,
				externalId: `seed-convex-1`,
				title: "Rate limit approaching",
				description: "Database reads at 85% of quota for current billing period",
				actionType: "mention",
				status: "in-progress",
				priority: "high",
				authorName: "Convex",
				authorInitials: "CX",
				authorColor: "#f97316",
				url: "https://dashboard.convex.dev",
				read: false,
				createdAt: now - 6 * 60 * 60 * 1000, // 6h ago
			},
			{
				source: "github" as const,
				externalId: `seed-gh-5`,
				title: "Push to develop",
				description: "chore: update dependencies",
				actionType: "added",
				authorName: "jonathanruas",
				authorInitials: "JR",
				authorAvatar: "https://avatars.githubusercontent.com/u/12345?v=4",
				read: true,
				createdAt: now - 24 * 60 * 60 * 1000, // 1 day ago
			},
		]

		for (const s of samples) {
			await ctx.db.insert("notifications", {
				userId,
				...s,
			})
		}

		return { inserted: samples.length }
	},
})
