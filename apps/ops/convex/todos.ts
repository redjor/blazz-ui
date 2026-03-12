import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

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
		if (status) {
			return ctx.db
				.query("todos")
				.withIndex("by_status", (q) => q.eq("status", status))
				.collect()
		}
		return ctx.db.query("todos").order("desc").collect()
	},
})

export const get = query({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

export const listByDate = query({
	args: { date: v.string() },
	handler: async (ctx, { date }) => {
		const todos = await ctx.db.query("todos").collect()
		const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
		return todos
			.filter((t) => t.dueDate === date && t.status !== "done")
			.sort((a, b) => (priorityOrder[a.priority ?? "normal"] ?? 2) - (priorityOrder[b.priority ?? "normal"] ?? 2))
	},
})

export const listAllTags = query({
	args: {},
	handler: async (ctx) => {
		const todos = await ctx.db.query("todos").collect()
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
	handler: async (ctx, { id, status }) => ctx.db.patch(id, { status }),
})

export const remove = mutation({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => ctx.db.delete(id),
})
