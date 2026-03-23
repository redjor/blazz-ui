import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const entityTypeValidator = v.union(
	v.literal("client"),
	v.literal("project"),
	v.literal("contract"),
	v.literal("invoice"),
	v.literal("todo"),
	v.literal("general")
)

function applyNotePatchField(
	patch: Record<string, unknown>,
	key: "title" | "contentJson" | "contentText" | "pinned" | "locked",
	value: unknown
) {
	if (value === undefined) return
	if (key === "contentJson" || key === "contentText") {
		patch[key] = value ?? undefined
		return
	}
	patch[key] = value
}

export const listByEntity = query({
	args: {
		entityType: entityTypeValidator,
		entityId: v.optional(v.string()),
	},
	handler: async (ctx, { entityType, entityId }) => {
		const { userId } = await requireAuth(ctx)
		const notes = await ctx.db
			.query("notes")
			.withIndex("by_entity_updated", (q) =>
				q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId)
			)
			.order("desc")
			.collect()

		return notes.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return b.updatedAt - a.updatedAt
		})
	},
})

export const listRecent = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const notes = await ctx.db
			.query("notes")
			.withIndex("by_user_updated", (q) => q.eq("userId", userId))
			.order("desc")
			.collect()

		return notes.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return b.updatedAt - a.updatedAt
		})
	},
})

export const create = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.optional(v.string()),
		title: v.optional(v.string()),
		contentJson: v.optional(v.any()),
		contentText: v.optional(v.string()),
		pinned: v.optional(v.boolean()),
	},
	handler: async (
		ctx,
		{ entityType, entityId, title, contentJson, contentText, pinned = false }
	) => {
		const { userId } = await requireAuth(ctx)
		const now = Date.now()
		return ctx.db.insert("notes", {
			userId,
			entityType,
			entityId,
			title: title?.trim() || "Nouvelle note",
			contentJson,
			contentText,
			pinned,
			createdAt: now,
			updatedAt: now,
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("notes"),
		title: v.optional(v.string()),
		contentJson: v.optional(v.union(v.any(), v.null())),
		contentText: v.optional(v.union(v.string(), v.null())),
		pinned: v.optional(v.boolean()),
		locked: v.optional(v.boolean()),
		tags: v.optional(v.array(v.id("tags"))),
	},
	handler: async (ctx, { id, title, contentJson, contentText, pinned, locked, tags }) => {
		const { userId } = await requireAuth(ctx)
		const note = await ctx.db.get(id)
		if (!note || note.userId !== userId) throw new ConvexError("Introuvable")

		// Locked notes only allow toggling the lock itself
		const isContentEdit =
			title !== undefined || contentJson !== undefined || contentText !== undefined || tags !== undefined
		if (note.locked && locked !== false && isContentEdit) {
			throw new ConvexError("Note verrouillée")
		}

		const patch: Record<string, unknown> = { updatedAt: Date.now() }
		applyNotePatchField(
			patch,
			"title",
			title?.trim() || (title === "" ? "Nouvelle note" : undefined)
		)
		applyNotePatchField(patch, "contentJson", contentJson)
		applyNotePatchField(patch, "contentText", contentText)
		applyNotePatchField(patch, "pinned", pinned)
		applyNotePatchField(patch, "locked", locked)
		if (tags !== undefined) patch.tags = tags
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("notes") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const note = await ctx.db.get(id)
		if (!note || note.userId !== userId) throw new ConvexError("Introuvable")
		if (note.locked) throw new ConvexError("Note verrouillée")
		return ctx.db.delete(id)
	},
})
