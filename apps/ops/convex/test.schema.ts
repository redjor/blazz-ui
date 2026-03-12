/**
 * Simplified schema for convex-test.
 * Mirrors the production schema but omits authTables (not supported by convex-test 0.0.41).
 */
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	clients: defineTable({
		userId: v.string(),
		name: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(v.string()),
		notes: v.optional(v.string()),
		logoStorageId: v.optional(v.id("_storage")),
		createdAt: v.number(),
	}).index("by_user", ["userId"]),

	projects: defineTable({
		userId: v.string(),
		clientId: v.id("clients"),
		name: v.string(),
		description: v.optional(v.string()),
		tjm: v.number(),
		hoursPerDay: v.number(),
		budgetAmount: v.optional(v.number()),
		currency: v.union(v.literal("EUR")),
		status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_client", ["clientId"])
		.index("by_status", ["status"])
		.index("by_user", ["userId"])
		.index("by_user_client", ["userId", "clientId"])
		.index("by_user_status", ["userId", "status"]),

	timeEntries: defineTable({
		userId: v.string(),
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
		.index("by_date", ["date"])
		.index("by_user", ["userId"])
		.index("by_user_project", ["userId", "projectId"])
		.index("by_user_date", ["userId", "date"]),

	categories: defineTable({
		userId: v.optional(v.string()),
		name: v.string(),
		color: v.optional(v.string()),
		createdAt: v.number(),
	}).index("by_user", ["userId"]),

	todos: defineTable({
		userId: v.string(),
		text: v.string(),
		description: v.optional(v.string()),
		status: v.union(
			v.literal("triage"),
			v.literal("todo"),
			v.literal("blocked"),
			v.literal("in_progress"),
			v.literal("done")
		),
		source: v.union(v.literal("app"), v.literal("telegram")),
		dueDate: v.optional(v.string()),
		projectId: v.optional(v.id("projects")),
		categoryId: v.optional(v.id("categories")),
		tags: v.optional(v.array(v.string())),
		priority: v.optional(
			v.union(
				v.literal("urgent"),
				v.literal("high"),
				v.literal("normal"),
				v.literal("low")
			)
		),
		createdAt: v.number(),
	})
		.index("by_status", ["status"])
		.index("by_category", ["categoryId"])
		.index("by_user", ["userId"])
		.index("by_user_status", ["userId", "status"])
		.index("by_user_category", ["userId", "categoryId"]),

	packages: defineTable({
		name: v.string(),
		latestVersion: v.string(),
		publishedAt: v.string(),
		weeklyDownloads: v.number(),
		description: v.string(),
		license: v.optional(v.string()),
		unpackedSize: v.optional(v.number()),
		lastSyncedAt: v.number(),
	}).index("by_name", ["name"]),
})
