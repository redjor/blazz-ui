import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const bookmarkTypeValidator = v.union(
	v.literal("tweet"),
	v.literal("youtube"),
	v.literal("image"),
	v.literal("video"),
	v.literal("link")
)

export const list = query({
	args: {
		collectionId: v.optional(v.id("bookmarkCollections")),
		type: v.optional(bookmarkTypeValidator),
		tag: v.optional(v.id("tags")),
		archived: v.optional(v.boolean()),
		uncategorized: v.optional(v.boolean()),
		search: v.optional(v.string()),
	},
	handler: async (ctx, { collectionId, type, tag, archived, uncategorized, search }) => {
		const { userId } = await requireAuth(ctx)

		let results
		if (collectionId) {
			results = await ctx.db
				.query("bookmarks")
				.withIndex("by_user_collection", (q) => q.eq("userId", userId).eq("collectionId", collectionId))
				.collect()
		} else if (type) {
			results = await ctx.db
				.query("bookmarks")
				.withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type))
				.collect()
		} else {
			results = await ctx.db
				.query("bookmarks")
				.withIndex("by_user", (q) => q.eq("userId", userId))
				.collect()
		}

		if (archived === true) {
			results = results.filter((b) => b.archivedAt != null)
		} else {
			results = results.filter((b) => b.archivedAt == null)
		}

		if (uncategorized) {
			results = results.filter((b) => !b.collectionId)
		}

		if (tag) {
			results = results.filter((b) => b.tags?.includes(tag))
		}

		if (search) {
			const q = search.toLowerCase()
			results = results.filter(
				(b) =>
					b.title?.toLowerCase().includes(q) ||
					b.description?.toLowerCase().includes(q) ||
					b.url.toLowerCase().includes(q) ||
					b.author?.toLowerCase().includes(q)
			)
		}

		return results.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return b._creationTime - a._creationTime
		})
	},
})

export const get = query({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return bookmark
	},
})

export const create = mutation({
	args: {
		url: v.string(),
		type: bookmarkTypeValidator,
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		author: v.optional(v.string()),
		siteName: v.optional(v.string()),
		embedUrl: v.optional(v.string()),
		collectionId: v.optional(v.id("bookmarkCollections")),
		tags: v.optional(v.array(v.id("tags"))),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const url = args.url.trim()
		if (!url) throw new ConvexError("L'URL est requise")

		return ctx.db.insert("bookmarks", {
			userId,
			url,
			type: args.type,
			title: args.title,
			description: args.description,
			thumbnailUrl: args.thumbnailUrl,
			author: args.author,
			siteName: args.siteName,
			embedUrl: args.embedUrl,
			collectionId: args.collectionId,
			tags: args.tags,
			notes: args.notes,
			pinned: false,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("bookmarks"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		collectionId: v.optional(v.union(v.id("bookmarkCollections"), v.null())),
		tags: v.optional(v.array(v.id("tags"))),
		notes: v.optional(v.string()),
		pinned: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")

		const patch: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(fields)) {
			if (value !== undefined) {
				patch[key] = value === null ? undefined : value
			}
		}
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.delete(id)
	},
})

export const removeBatch = mutation({
	args: { ids: v.array(v.id("bookmarks")) },
	handler: async (ctx, { ids }) => {
		const { userId } = await requireAuth(ctx)
		for (const id of ids) {
			const bookmark = await ctx.db.get(id)
			if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
			await ctx.db.delete(id)
		}
	},
})

export const archive = mutation({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { archivedAt: Date.now() })
	},
})

export const unarchive = mutation({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { archivedAt: undefined })
	},
})

export const move = mutation({
	args: {
		ids: v.array(v.id("bookmarks")),
		collectionId: v.optional(v.id("bookmarkCollections")),
	},
	handler: async (ctx, { ids, collectionId }) => {
		const { userId } = await requireAuth(ctx)
		for (const id of ids) {
			const bookmark = await ctx.db.get(id)
			if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
			await ctx.db.patch(id, { collectionId: collectionId ?? undefined })
		}
	},
})
