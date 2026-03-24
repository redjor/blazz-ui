import { v } from "convex/values"
import { internalMutation, internalQuery } from "./_generated/server"

// ── Entity type union (reused across notes functions) ──────────────────────
const entityTypeValidator = v.union(
	v.literal("client"),
	v.literal("project"),
	v.literal("contract"),
	v.literal("invoice"),
	v.literal("todo"),
	v.literal("general")
)

const statusValidator = v.union(
	v.literal("triage"),
	v.literal("todo"),
	v.literal("blocked"),
	v.literal("in_progress"),
	v.literal("done")
)

const priorityValidator = v.union(
	v.literal("urgent"),
	v.literal("high"),
	v.literal("normal"),
	v.literal("low")
)

// ═══════════════════════════════════════════════════════════════════════════
// NOTES
// ═══════════════════════════════════════════════════════════════════════════

export const notesList = internalQuery({
	args: {
		userId: v.string(),
		entityType: v.optional(entityTypeValidator),
		pinned: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		let notes = await ctx.db
			.query("notes")
			.withIndex("by_user", (q) => q.eq("userId", args.userId))
			.collect()

		if (args.entityType !== undefined) {
			notes = notes.filter((n) => n.entityType === args.entityType)
		}
		if (args.pinned !== undefined) {
			notes = notes.filter((n) => n.pinned === args.pinned)
		}

		// Sort: pinned first, then by updatedAt desc
		notes.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return b.updatedAt - a.updatedAt
		})

		return notes
	},
})

export const notesGet = internalQuery({
	args: {
		userId: v.string(),
		id: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const note = await ctx.db.get(args.id)
		if (!note || note.userId !== args.userId) return null
		return note
	},
})

export const notesCreate = internalMutation({
	args: {
		userId: v.string(),
		entityType: entityTypeValidator,
		entityId: v.optional(v.string()),
		title: v.optional(v.string()),
		contentJson: v.optional(v.any()),
		contentText: v.optional(v.string()),
		pinned: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const now = Date.now()
		return await ctx.db.insert("notes", {
			userId: args.userId,
			entityType: args.entityType,
			entityId: args.entityId,
			title: args.title ?? "Nouvelle note",
			contentJson: args.contentJson,
			contentText: args.contentText,
			pinned: args.pinned ?? false,
			createdAt: now,
			updatedAt: now,
		})
	},
})

export const notesUpdate = internalMutation({
	args: {
		userId: v.string(),
		id: v.id("notes"),
		title: v.optional(v.string()),
		contentJson: v.optional(v.union(v.any(), v.null())),
		contentText: v.optional(v.union(v.string(), v.null())),
		pinned: v.optional(v.boolean()),
		locked: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const note = await ctx.db.get(args.id)
		if (!note || note.userId !== args.userId) {
			throw new Error("Note not found or access denied")
		}

		// If note is locked and we're not unlocking, block content edits
		if (note.locked && args.locked !== false) {
			if (args.title !== undefined || args.contentText !== undefined) {
				throw new Error("Cannot edit a locked note")
			}
		}

		const patch: Record<string, unknown> = { updatedAt: Date.now() }
		if (args.title !== undefined) patch.title = args.title
		if (args.contentJson !== undefined)
			patch.contentJson = args.contentJson ?? undefined
		if (args.contentText !== undefined)
			patch.contentText = args.contentText ?? undefined
		if (args.pinned !== undefined) patch.pinned = args.pinned
		if (args.locked !== undefined) patch.locked = args.locked

		await ctx.db.patch(args.id, patch)
	},
})

export const notesArchive = internalMutation({
	args: {
		userId: v.string(),
		id: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const note = await ctx.db.get(args.id)
		if (!note || note.userId !== args.userId) {
			throw new Error("Note not found or access denied")
		}
		if (note.locked) {
			throw new Error("Cannot archive a locked note")
		}
		await ctx.db.patch(args.id, { archivedAt: Date.now() })
	},
})

export const notesRestore = internalMutation({
	args: {
		userId: v.string(),
		id: v.id("notes"),
	},
	handler: async (ctx, args) => {
		const note = await ctx.db.get(args.id)
		if (!note || note.userId !== args.userId) {
			throw new Error("Note not found or access denied")
		}
		await ctx.db.patch(args.id, { archivedAt: undefined })
	},
})

// ═══════════════════════════════════════════════════════════════════════════
// TODOS
// ═══════════════════════════════════════════════════════════════════════════

export const todosList = internalQuery({
	args: {
		userId: v.string(),
		status: v.optional(statusValidator),
		projectId: v.optional(v.string()),
		priority: v.optional(priorityValidator),
	},
	handler: async (ctx, args) => {
		let todos
		if (args.status !== undefined) {
			todos = await ctx.db
				.query("todos")
				.withIndex("by_user_status", (q) =>
					q.eq("userId", args.userId).eq("status", args.status!)
				)
				.collect()
		} else {
			todos = await ctx.db
				.query("todos")
				.withIndex("by_user", (q) => q.eq("userId", args.userId))
				.collect()
		}

		if (args.projectId !== undefined) {
			todos = todos.filter(
				(t) => t.projectId !== undefined && String(t.projectId) === args.projectId
			)
		}
		if (args.priority !== undefined) {
			todos = todos.filter((t) => t.priority === args.priority)
		}

		return todos
	},
})

export const todosGet = internalQuery({
	args: {
		userId: v.string(),
		id: v.id("todos"),
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.id)
		if (!todo || todo.userId !== args.userId) return null
		return todo
	},
})

export const todosCreate = internalMutation({
	args: {
		userId: v.string(),
		text: v.string(),
		description: v.optional(v.string()),
		status: v.optional(statusValidator),
		dueDate: v.optional(v.string()),
		projectId: v.optional(v.id("projects")),
		priority: v.optional(priorityValidator),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("todos", {
			userId: args.userId,
			text: args.text,
			description: args.description,
			status: args.status ?? "triage",
			source: "app" as const,
			dueDate: args.dueDate,
			projectId: args.projectId,
			priority: args.priority,
			tags: args.tags,
			createdAt: Date.now(),
		})
	},
})

export const todosUpdate = internalMutation({
	args: {
		userId: v.string(),
		id: v.id("todos"),
		text: v.optional(v.string()),
		description: v.optional(v.union(v.string(), v.null())),
		priority: v.optional(priorityValidator),
		dueDate: v.optional(v.union(v.string(), v.null())),
		projectId: v.optional(v.union(v.id("projects"), v.null())),
		tags: v.optional(v.union(v.array(v.string()), v.null())),
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.id)
		if (!todo || todo.userId !== args.userId) {
			throw new Error("Todo not found or access denied")
		}

		const patch: Record<string, unknown> = {}
		if (args.text !== undefined) patch.text = args.text
		if (args.description !== undefined)
			patch.description = args.description ?? undefined
		if (args.priority !== undefined) patch.priority = args.priority
		if (args.dueDate !== undefined) patch.dueDate = args.dueDate ?? undefined
		if (args.projectId !== undefined)
			patch.projectId = args.projectId ?? undefined
		if (args.tags !== undefined) patch.tags = args.tags ?? undefined

		await ctx.db.patch(args.id, patch)
	},
})

export const todosUpdateStatus = internalMutation({
	args: {
		userId: v.string(),
		id: v.id("todos"),
		status: statusValidator,
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.id)
		if (!todo || todo.userId !== args.userId) {
			throw new Error("Todo not found or access denied")
		}
		await ctx.db.patch(args.id, { status: args.status })
	},
})

export const todosRemove = internalMutation({
	args: {
		userId: v.string(),
		id: v.id("todos"),
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.id)
		if (!todo || todo.userId !== args.userId) {
			throw new Error("Todo not found or access denied")
		}
		await ctx.db.delete(args.id)
	},
})
