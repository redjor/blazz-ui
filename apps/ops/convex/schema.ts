import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	clients: defineTable({
		name: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(v.string()),
		notes: v.optional(v.string()),
		logoStorageId: v.optional(v.id("_storage")),
		createdAt: v.number(),
	}),

	projects: defineTable({
		clientId: v.id("clients"),
		name: v.string(),
		description: v.optional(v.string()),
		tjm: v.number(),
		hoursPerDay: v.number(),
		currency: v.union(v.literal("EUR")),
		status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_client", ["clientId"])
		.index("by_status", ["status"]),

	timeEntries: defineTable({
		projectId: v.id("projects"),
		date: v.string(),
		minutes: v.number(),
		hourlyRate: v.number(),
		description: v.optional(v.string()),
		billable: v.boolean(),
		invoicedAt: v.optional(v.number()),
		status: v.optional(
			v.union(
				v.literal("draft"),
				v.literal("ready_to_invoice"),
				v.literal("invoiced"),
				v.literal("paid")
			)
		),
		createdAt: v.number(),
	})
		.index("by_project", ["projectId"])
		.index("by_date", ["date"]),

	todos: defineTable({
		text: v.string(),
		status: v.union(
			v.literal("triage"),
			v.literal("todo"),
			v.literal("in_progress"),
			v.literal("done")
		),
		source: v.union(v.literal("app"), v.literal("telegram")),
		projectId: v.optional(v.id("projects")),
		createdAt: v.number(),
	})
		.index("by_status", ["status"]),
})
