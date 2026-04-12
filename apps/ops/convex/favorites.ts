import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const entityTypeValidator = v.union(v.literal("client"), v.literal("project"), v.literal("todo"), v.literal("note"), v.literal("bookmark"), v.literal("feedItem"))

// ── Queries ──────────────────────────────────────────────────

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const favorites = await ctx.db
			.query("favorites")
			.withIndex("by_user_order", (q) => q.eq("userId", userId))
			.collect()
		return favorites.sort((a, b) => a.order - b.order)
	},
})

export const isFavorited = query({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
	},
	handler: async (ctx, { entityType, entityId }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) => q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId))
			.first()
		return existing !== null
	},
})

// ── Mutations ────────────────────────────────────────────────

export const add = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
		label: v.string(),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
	},
	handler: async (ctx, { entityType, entityId, label, icon, color }) => {
		const { userId } = await requireAuth(ctx)

		// Check if already favorited
		const existing = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) => q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId))
			.first()
		if (existing) {
			// Update icon/color if they changed (e.g. project icon was set after favoriting)
			if (icon !== existing.icon || color !== existing.color) {
				await ctx.db.patch(existing._id, { icon, color })
			}
			return existing._id
		}

		// Get max order
		const all = await ctx.db
			.query("favorites")
			.withIndex("by_user_order", (q) => q.eq("userId", userId))
			.collect()
		const maxOrder = all.length > 0 ? Math.max(...all.map((f) => f.order)) : 0

		return ctx.db.insert("favorites", {
			userId,
			entityType,
			entityId,
			label: label.slice(0, 30),
			icon,
			color,
			order: maxOrder + 1,
			createdAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
	},
	handler: async (ctx, { entityType, entityId }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) => q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId))
			.first()
		if (existing) {
			await ctx.db.delete(existing._id)
		}
	},
})

export const reorder = mutation({
	args: {
		orderedIds: v.array(v.id("favorites")),
	},
	handler: async (ctx, { orderedIds }) => {
		const { userId } = await requireAuth(ctx)
		for (let i = 0; i < orderedIds.length; i++) {
			const fav = await ctx.db.get(orderedIds[i])
			if (!fav || fav.userId !== userId) continue
			await ctx.db.patch(orderedIds[i], { order: i + 1 })
		}
	},
})

export const updateLabel = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
		label: v.string(),
	},
	handler: async (ctx, { entityType, entityId, label }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) => q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId))
			.first()
		if (existing) {
			await ctx.db.patch(existing._id, { label: label.slice(0, 30) })
		}
	},
})

export const syncLabels = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const favorites = await ctx.db
			.query("favorites")
			.withIndex("by_user_order", (q) => q.eq("userId", userId))
			.collect()

		for (const fav of favorites) {
			// Look up the source entity (polymorphic ID, may be invalid)
			// biome-ignore lint/suspicious/noImplicitAnyLet: polymorphic entity lookup
			let entity
			try {
				entity = await ctx.db.get(fav.entityId as any)
			} catch {
				await ctx.db.delete(fav._id)
				continue
			}

			// If entity deleted → delete the favorite
			if (!entity) {
				await ctx.db.delete(fav._id)
				continue
			}

			// Determine label field based on entity type
			let newLabel: string | undefined
			if (fav.entityType === "todo") {
				newLabel = (entity as any).text
			} else if (fav.entityType === "feedItem") {
				newLabel = (entity as any).title
			} else {
				// client, project, note, bookmark → name, fallback to title
				newLabel = (entity as any).name ?? (entity as any).title
			}

			const patch: Record<string, any> = {}
			if (newLabel && newLabel.slice(0, 30) !== fav.label) {
				patch.label = newLabel.slice(0, 30)
			}
			// Sync icon/color for projects
			if (fav.entityType === "project") {
				const projIcon = (entity as any).icon as string | undefined
				const projColor = (entity as any).color as string | undefined
				if (projIcon !== fav.icon) patch.icon = projIcon
				if (projColor !== fav.color) patch.color = projColor
			}
			if (Object.keys(patch).length > 0) {
				await ctx.db.patch(fav._id, patch)
			}
		}
	},
})
