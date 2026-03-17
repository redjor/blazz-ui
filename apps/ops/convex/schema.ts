import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	...authTables,
	clients: defineTable({
		userId: v.string(),
		name: v.string(),
		type: v.optional(v.union(v.literal("freelance"), v.literal("product"), v.literal("both"))),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		address: v.optional(v.string()),
		notes: v.optional(v.string()),
		logoStorageId: v.optional(v.id("_storage")),
		qontoClientId: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_type", ["userId", "type"]),

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

	contracts: defineTable({
		userId: v.string(),
		projectId: v.id("projects"),
		type: v.union(v.literal("tma"), v.literal("forfait"), v.literal("regie")),
		daysPerMonth: v.optional(v.number()),
		carryOver: v.boolean(),
		prestationStartDate: v.optional(v.string()),
		startDate: v.string(),
		endDate: v.string(),
		status: v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled")),
		notes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_project", ["projectId"])
		.index("by_status", ["status"])
		.index("by_user", ["userId"]),

	contractFiles: defineTable({
		userId: v.string(),
		contractId: v.id("contracts"),
		storageId: v.id("_storage"),
		fileName: v.string(),
		fileSize: v.number(),
		createdAt: v.number(),
	})
		.index("by_contract", ["contractId"])
		.index("by_user", ["userId"]),

	invoices: defineTable({
		userId: v.string(),
		projectId: v.id("projects"),
		clientId: v.id("clients"),
		qontoInvoiceId: v.optional(v.string()),
		qontoNumber: v.optional(v.string()),
		label: v.string(),
		totalAmount: v.number(),
		vatRate: v.number(),
		currency: v.union(v.literal("EUR")),
		periodStart: v.string(),
		periodEnd: v.string(),
		status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
		pdfStorageId: v.optional(v.id("_storage")),
		paidAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_project", ["projectId"])
		.index("by_user", ["userId"])
		.index("by_status", ["status"]),

	timeEntries: defineTable({
		userId: v.string(),
		projectId: v.id("projects"),
		date: v.string(),
		minutes: v.number(),
		hourlyRate: v.number(),
		description: v.optional(v.string()),
		billable: v.boolean(),
		invoiceId: v.optional(v.id("invoices")),
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
		.index("by_user_date", ["userId", "date"])
		.index("by_invoice", ["invoiceId"]),

	categories: defineTable({
		userId: v.optional(v.string()),
		name: v.string(),
		color: v.optional(v.string()),
		icon: v.optional(v.string()),
		createdAt: v.number(),
	}).index("by_user", ["userId"]),

	todos: defineTable({
		userId: v.string(),
		text: v.string(),
		description: v.optional(v.string()),
		descriptionJson: v.optional(v.any()),
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
			v.union(v.literal("urgent"), v.literal("high"), v.literal("normal"), v.literal("low"))
		),
		createdAt: v.number(),
	})
		.index("by_status", ["status"])
		.index("by_category", ["categoryId"])
		.index("by_user", ["userId"])
		.index("by_user_status", ["userId", "status"])
		.index("by_user_category", ["userId", "categoryId"]),

	licenseKeys: defineTable({
		userId: v.string(),
		key: v.string(),
		plan: v.union(v.literal("PRO"), v.literal("TEAM"), v.literal("ENTERPRISE")),
		orgId: v.string(),
		clientId: v.optional(v.id("clients")),
		clientName: v.optional(v.string()),
		email: v.optional(v.string()),
		expiresAt: v.string(),
		revokedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_key", ["key"])
		.index("by_client", ["clientId"]),

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
