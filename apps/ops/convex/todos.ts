import { ConvexError, v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

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

export const list = query({
	args: {
		status: v.optional(statusValidator),
	},
	handler: async (ctx, { status }) => {
		const { userId } = await requireAuth(ctx)
		if (status) {
			return ctx.db
				.query("todos")
				.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", status))
				.collect()
		}
		return ctx.db
			.query("todos")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("desc")
			.collect()
	},
})

export const get = query({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const todo = await ctx.db.get(id)
		if (!todo || todo.userId !== userId) return null
		return todo
	},
})

export const listByDate = query({
	args: { date: v.string() },
	handler: async (ctx, { date }) => {
		const { userId } = await requireAuth(ctx)
		const todos = await ctx.db
			.query("todos")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
		return todos
			.filter((t) => t.dueDate === date && t.status !== "done")
			.sort((a, b) => (priorityOrder[a.priority ?? "normal"] ?? 2) - (priorityOrder[b.priority ?? "normal"] ?? 2))
	},
})

export const listAllTags = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const todos = await ctx.db
			.query("todos")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const tagSet = new Set<string>()
		for (const todo of todos) {
			for (const tag of todo.tags ?? []) {
				tagSet.add(tag)
			}
		}
		return Array.from(tagSet).sort()
	},
})

export const create = mutation({
	args: {
		text: v.string(),
		description: v.optional(v.string()),
		status: v.optional(statusValidator),
		source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
		dueDate: v.optional(v.string()),
		projectId: v.optional(v.id("projects")),
		categoryId: v.optional(v.id("categories")),
		tags: v.optional(v.array(v.string())),
		priority: v.optional(priorityValidator),
	},
	handler: async (ctx, { text, description, status = "triage", source = "app", dueDate, projectId, categoryId, tags, priority }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("todos", {
			text,
			description,
			status,
			source,
			dueDate,
			projectId,
			categoryId,
			tags,
			priority,
			userId,
			createdAt: Date.now(),
		})
	},
})

/** Internal-only: create a todo without auth (for Telegram webhook). */
export const internalCreate = internalMutation({
	args: {
		text: v.string(),
		userId: v.string(),
		status: v.optional(statusValidator),
		source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
	},
	handler: async (ctx, { text, userId, status = "triage", source = "telegram" }) => {
		return ctx.db.insert("todos", {
			text,
			userId,
			status,
			source,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("todos"),
		text: v.optional(v.string()),
		description: v.optional(v.string()),
		priority: v.optional(priorityValidator),
		dueDate: v.optional(v.string()),
		projectId: v.optional(v.id("projects")),
		categoryId: v.optional(v.id("categories")),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, { id, text, description, priority, dueDate, projectId, categoryId, tags }) => {
		const { userId } = await requireAuth(ctx)
		const todo = await ctx.db.get(id)
		if (!todo || todo.userId !== userId) throw new ConvexError("Introuvable")
		const patch: Record<string, unknown> = {}
		if (text !== undefined) patch.text = text
		if (description !== undefined) patch.description = description
		if (priority !== undefined) patch.priority = priority
		patch.dueDate = dueDate
		patch.projectId = projectId
		patch.categoryId = categoryId
		patch.tags = tags
		return ctx.db.patch(id, patch)
	},
})

export const updateStatus = mutation({
	args: {
		id: v.id("todos"),
		status: statusValidator,
	},
	handler: async (ctx, { id, status }) => {
		const { userId } = await requireAuth(ctx)
		const todo = await ctx.db.get(id)
		if (!todo || todo.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { status })
	},
})

export const remove = mutation({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const todo = await ctx.db.get(id)
		if (!todo || todo.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.delete(id)
	},
})
