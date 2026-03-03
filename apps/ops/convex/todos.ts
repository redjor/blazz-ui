import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
	args: {
		status: v.optional(
			v.union(
				v.literal("triage"),
				v.literal("todo"),
				v.literal("in_progress"),
				v.literal("done")
			)
		),
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

export const create = mutation({
	args: {
		text: v.string(),
		description: v.optional(v.string()),
		status: v.optional(
			v.union(
				v.literal("triage"),
				v.literal("todo"),
				v.literal("in_progress"),
				v.literal("done")
			)
		),
		source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
		projectId: v.optional(v.id("projects")),
		priority: v.optional(
			v.union(
				v.literal("urgent"),
				v.literal("high"),
				v.literal("normal"),
				v.literal("low")
			)
		),
	},
	handler: async (ctx, { text, description, status = "triage", source = "app", projectId, priority }) => {
		return ctx.db.insert("todos", {
			text,
			description,
			status,
			source,
			projectId,
			priority,
			createdAt: Date.now(),
		})
	},
})

export const updateStatus = mutation({
	args: {
		id: v.id("todos"),
		status: v.union(
			v.literal("triage"),
			v.literal("todo"),
			v.literal("in_progress"),
			v.literal("done")
		),
	},
	handler: async (ctx, { id, status }) => ctx.db.patch(id, { status }),
})

export const updateText = mutation({
	args: { id: v.id("todos"), text: v.string(), description: v.optional(v.string()) },
	handler: async (ctx, { id, text, description }) => ctx.db.patch(id, { text, description }),
})

export const linkProject = mutation({
	args: {
		id: v.id("todos"),
		projectId: v.optional(v.id("projects")),
	},
	handler: async (ctx, { id, projectId }) => ctx.db.patch(id, { projectId }),
})

export const updatePriority = mutation({
	args: {
		id: v.id("todos"),
		priority: v.optional(
			v.union(
				v.literal("urgent"),
				v.literal("high"),
				v.literal("normal"),
				v.literal("low")
			)
		),
	},
	handler: async (ctx, { id, priority }) => ctx.db.patch(id, { priority }),
})

export const remove = mutation({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => ctx.db.delete(id),
})
