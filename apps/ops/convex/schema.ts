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
		tags: v.optional(v.array(v.id("tags"))),
		createdAt: v.number(),
	})
		.index("by_client", ["clientId"])
		.index("by_status", ["status"])
		.index("by_user", ["userId"])
		.index("by_user_client", ["userId", "clientId"])
		.index("by_user_status", ["userId", "status"]),

	notes: defineTable({
		userId: v.string(),
		entityType: v.union(
			v.literal("client"),
			v.literal("project"),
			v.literal("contract"),
			v.literal("invoice"),
			v.literal("todo"),
			v.literal("general")
		),
		entityId: v.optional(v.string()),
		title: v.string(),
		contentJson: v.optional(v.any()),
		contentText: v.optional(v.string()),
		pinned: v.boolean(),
		tags: v.optional(v.array(v.id("tags"))),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_entity_updated", ["userId", "entityType", "entityId", "updatedAt"])
		.index("by_user_updated", ["userId", "updatedAt"]),

	tags: defineTable({
		userId: v.string(),
		name: v.string(),
		color: v.string(),
		createdAt: v.number(),
	}).index("by_user", ["userId"]),

	contracts: defineTable({
		userId: v.string(),
		projectId: v.id("projects"),
		type: v.union(v.literal("tma"), v.literal("forfait"), v.literal("regie")),
		daysPerMonth: v.optional(v.number()),
		carryOver: v.boolean(),
		budgetAmount: v.optional(v.number()),
		prestationStartDate: v.optional(v.string()),
		startDate: v.string(),
		endDate: v.string(),
		status: v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled")),
		notes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_project", ["projectId"])
		.index("by_status", ["status"])
		.index("by_user", ["userId"])
		.index("by_user_status", ["userId", "status"]),

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
		projectId: v.optional(v.id("projects")),
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
		// ── New fields ──
		invoiceType: v.optional(
			v.union(v.literal("unique"), v.literal("acompte"), v.literal("situation"))
		),
		lines: v.optional(
			v.array(
				v.object({
					id: v.string(),
					type: v.union(v.literal("project"), v.literal("custom")),
					projectId: v.optional(v.id("projects")),
					label: v.string(),
					quantity: v.number(),
					unitPrice: v.number(),
					discountPercent: v.optional(v.number()),
					sortOrder: v.number(),
				})
			)
		),
		globalDiscount: v.optional(
			v.object({
				type: v.union(v.literal("percent"), v.literal("fixed")),
				value: v.number(),
			})
		),
		notes: v.optional(v.string()),
		internalNotes: v.optional(v.string()),
	})
		.index("by_project", ["projectId"])
		.index("by_user", ["userId"])
		.index("by_status", ["status"])
		.index("by_user_status", ["userId", "status"])
		.index("by_client", ["clientId"]),

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
		tags: v.optional(v.array(v.id("tags"))),
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
		.index("by_user_category", ["userId", "categoryId"])
		.index("by_user_project", ["userId", "projectId"]),

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
		tags: v.optional(v.array(v.id("tags"))),
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

	settings: defineTable({
		userId: v.string(),
		key: v.string(),
		value: v.string(),
	})
		.index("by_user", ["userId"])
		.index("by_user_key", ["userId", "key"]),

	goalPlans: defineTable({
		userId: v.string(),
		year: v.number(),
		revenue: v.object({
			annual: v.number(),
			overrides: v.record(v.string(), v.number()),
		}),
		days: v.object({
			annual: v.number(),
			overrides: v.record(v.string(), v.number()),
		}),
		tjm: v.object({
			target: v.number(),
		}),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_year", ["userId", "year"]),

	bookmarkCollections: defineTable({
		userId: v.string(),
		name: v.string(),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
		parentId: v.optional(v.id("bookmarkCollections")),
		order: v.number(),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_parent", ["parentId"]),

	feedSources: defineTable({
		userId: v.id("users"),
		name: v.string(),
		type: v.union(v.literal("youtube"), v.literal("rss")),
		externalId: v.string(),
		avatarUrl: v.optional(v.string()),
		lastFetchedAt: v.optional(v.number()),
		isActive: v.boolean(),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_type", ["userId", "type"])
		.index("by_user_active", ["userId", "isActive"]),

	feedItems: defineTable({
		userId: v.id("users"),
		sourceId: v.id("feedSources"),
		externalId: v.string(),
		type: v.union(v.literal("youtube"), v.literal("rss")),
		title: v.string(),
		content: v.string(),
		url: v.string(),
		thumbnailUrl: v.optional(v.string()),
		publishedAt: v.number(),
		aiSummary: v.optional(v.string()),
		aiTags: v.optional(v.array(v.string())),
		isRead: v.boolean(),
		isFavorite: v.boolean(),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_type", ["userId", "type"])
		.index("by_source", ["sourceId"])
		.index("by_external", ["externalId"])
		.index("by_user_published", ["userId", "publishedAt"]),

	bookmarks: defineTable({
		userId: v.string(),
		url: v.string(),
		type: v.union(
			v.literal("tweet"),
			v.literal("youtube"),
			v.literal("image"),
			v.literal("video"),
			v.literal("link")
		),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		thumbnailStorageId: v.optional(v.id("_storage")),
		author: v.optional(v.string()),
		siteName: v.optional(v.string()),
		embedUrl: v.optional(v.string()),
		collectionId: v.optional(v.id("bookmarkCollections")),
		tags: v.optional(v.array(v.id("tags"))),
		notes: v.optional(v.string()),
		pinned: v.boolean(),
		archivedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_collection", ["userId", "collectionId"])
		.index("by_user_type", ["userId", "type"])
		.index("by_user_archived", ["userId", "archivedAt"]),

	notifications: defineTable({
		userId: v.string(),
		source: v.union(v.literal("github"), v.literal("vercel"), v.literal("convex")),
		externalId: v.string(),
		title: v.string(),
		description: v.string(),
		actionType: v.string(),
		status: v.optional(v.string()),
		priority: v.optional(v.string()),
		authorName: v.string(),
		authorInitials: v.string(),
		authorColor: v.optional(v.string()),
		authorAvatar: v.optional(v.string()),
		url: v.optional(v.string()),
		read: v.boolean(),
		archivedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_user_date", ["userId", "createdAt"])
		.index("by_user_read", ["userId", "read"])
		.index("by_user_source", ["userId", "source"])
		.index("by_source_external", ["source", "externalId"])
		.index("by_user_archived", ["userId", "archivedAt"]),
})
