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
	},
	handler: async (ctx, { text, status = "triage", source = "app", projectId }) => {
		return ctx.db.insert("todos", {
			text,
			status,
			source,
			projectId,
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

export const linkProject = mutation({
	args: {
		id: v.id("todos"),
		projectId: v.optional(v.id("projects")),
	},
	handler: async (ctx, { id, projectId }) => ctx.db.patch(id, { projectId }),
})

export const remove = mutation({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => ctx.db.delete(id),
})
