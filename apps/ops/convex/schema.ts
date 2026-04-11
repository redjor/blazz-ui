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
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_client", ["clientId"])
		.index("by_status", ["status"])
		.index("by_user", ["userId"])
		.index("by_user_client", ["userId", "clientId"])
		.index("by_user_status", ["userId", "status"]),

	notes: defineTable({
		userId: v.string(),
		entityType: v.union(v.literal("client"), v.literal("project"), v.literal("contract"), v.literal("invoice"), v.literal("todo"), v.literal("general")),
		entityId: v.optional(v.string()),
		title: v.string(),
		contentJson: v.optional(v.any()),
		contentText: v.optional(v.string()),
		pinned: v.boolean(),
		locked: v.optional(v.boolean()),
		tags: v.optional(v.array(v.id("tags"))),
		archivedAt: v.optional(v.number()),
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
		invoiceType: v.optional(v.union(v.literal("unique"), v.literal("acompte"), v.literal("situation"))),
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
		status: v.optional(v.union(v.literal("draft"), v.literal("ready_to_invoice"), v.literal("invoiced"), v.literal("paid"))),
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
		status: v.union(v.literal("triage"), v.literal("todo"), v.literal("blocked"), v.literal("in_progress"), v.literal("done")),
		source: v.union(v.literal("app"), v.literal("telegram")),
		dueDate: v.optional(v.string()),
		projectId: v.optional(v.id("projects")),
		categoryId: v.optional(v.id("categories")),
		tags: v.optional(v.array(v.string())),
		priority: v.optional(v.union(v.literal("urgent"), v.literal("high"), v.literal("normal"), v.literal("low"))),
		createdAt: v.number(),
		createdByAgent: v.optional(v.id("agents")),
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
		type: v.union(v.literal("tweet"), v.literal("youtube"), v.literal("image"), v.literal("video"), v.literal("link")),
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

	recurringExpenses: defineTable({
		userId: v.string(),
		name: v.string(),
		amountCents: v.number(),
		amountType: v.union(v.literal("fixed"), v.literal("variable")),
		frequency: v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly")),
		dayOfMonth: v.optional(v.number()),
		categoryId: v.optional(v.id("categories")),
		startDate: v.string(),
		endDate: v.optional(v.string()),
		active: v.boolean(),
		notes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_active", ["userId", "active"]),

	treasurySettings: defineTable({
		userId: v.string(),
		manualBalanceCents: v.optional(v.number()),
		qontoBalanceCents: v.optional(v.number()),
		defaultPaymentDelayDays: v.number(),
		forecastMonths: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_user", ["userId"]),

	syncSuggestions: defineTable({
		userId: v.string(),
		source: v.literal("qonto"),
		syncedAt: v.number(),
		name: v.string(),
		amountCents: v.number(),
		frequency: v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly")),
		category: v.string(),
		confidence: v.number(),
		transactionIds: v.array(v.string()),
		transactionLabels: v.array(v.string()),
		status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
	})
		.index("by_user_status", ["userId", "status"])
		.index("by_user_synced", ["userId", "syncedAt"]),

	notifications: defineTable({
		userId: v.string(),
		source: v.union(v.literal("github"), v.literal("vercel"), v.literal("convex"), v.literal("system")),
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

	// ── Agent System ──────────────────────────────────────────────────

	chatMessages: defineTable({
		userId: v.id("users"),
		agentId: v.id("agents"),
		role: v.union(v.literal("user"), v.literal("assistant")),
		content: v.string(),
	}).index("by_agent", ["userId", "agentId"]),

	agents: defineTable({
		userId: v.id("users"),
		slug: v.string(),
		name: v.string(),
		role: v.string(),
		model: v.string(),
		avatar: v.optional(v.string()),
		status: v.union(v.literal("idle"), v.literal("busy"), v.literal("paused"), v.literal("error"), v.literal("disabled")),
		lastActiveAt: v.optional(v.number()),
		budget: v.object({
			maxPerMission: v.number(),
			maxPerDay: v.number(),
			maxPerMonth: v.number(),
		}),
		usage: v.object({
			todayUsd: v.number(),
			monthUsd: v.number(),
			totalUsd: v.number(),
			lastResetDay: v.string(),
			lastResetMonth: v.string(),
		}),
		permissions: v.object({
			safe: v.array(v.string()),
			confirm: v.array(v.string()),
			blocked: v.array(v.string()),
		}),
	})
		.index("by_user", ["userId"])
		.index("by_slug", ["userId", "slug"]),

	missions: defineTable({
		userId: v.id("users"),
		agentId: v.id("agents"),
		title: v.string(),
		prompt: v.string(),
		status: v.union(v.literal("planning"), v.literal("todo"), v.literal("in_progress"), v.literal("review"), v.literal("done"), v.literal("rejected"), v.literal("aborted")),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
		mode: v.optional(v.union(v.literal("dry-run"), v.literal("live"))),
		output: v.optional(v.string()),
		structuredOutput: v.optional(v.any()),
		outputType: v.optional(v.string()),
		actions: v.optional(
			v.array(
				v.object({
					type: v.string(),
					description: v.string(),
					entityId: v.optional(v.string()),
					reversible: v.boolean(),
				})
			)
		),
		error: v.optional(v.string()),
		costUsd: v.optional(v.number()),
		maxIterations: v.optional(v.number()),
		rejectionReason: v.optional(v.string()),
		soulHash: v.optional(v.string()),
		templateId: v.optional(v.string()),
		cron: v.optional(v.string()),
		parentMissionId: v.optional(v.id("missions")),
		onComplete: v.optional(
			v.object({
				createMission: v.optional(
					v.object({
						agentSlug: v.string(),
						templateId: v.string(),
						condition: v.optional(v.string()),
					})
				),
			})
		),
		startedAt: v.optional(v.number()),
		completedAt: v.optional(v.number()),
		reviewedAt: v.optional(v.number()),
		metadata: v.optional(v.any()),
	})
		.index("by_status", ["userId", "status"])
		.index("by_agent", ["userId", "agentId"])
		.index("by_cron", ["userId", "cron"]),

	agentLogs: defineTable({
		missionId: v.id("missions"),
		agentId: v.id("agents"),
		type: v.union(v.literal("thinking"), v.literal("tool_call"), v.literal("tool_result"), v.literal("error"), v.literal("budget_warning"), v.literal("done")),
		content: v.string(),
		toolName: v.optional(v.string()),
		duration: v.optional(v.number()),
	}).index("by_mission", ["missionId"]),

	agentMemory: defineTable({
		userId: v.id("users"),
		agentId: v.optional(v.id("agents")), // null = shared memory
		missionId: v.optional(v.id("missions")),
		scope: v.union(v.literal("private"), v.literal("shared")), // private = agent-only, shared = all agents
		category: v.union(
			v.literal("fact"), // "Client X paie en retard" — expires
			v.literal("preference"), // "Jonathan préfère les forecasts conservateurs" — permanent
			v.literal("episode"), // "Le 26 mars, discussion sur investissement monitoring" — expires
			v.literal("pattern"), // "Anomalies temps → toujours créer un todo" — permanent
			v.literal("rule") // "Ne jamais suggérer de couper Figma" — permanent, manual
		),
		content: v.string(),
		confidence: v.optional(v.number()), // 0.0-1.0, increases on confirmation
		source: v.optional(v.string()), // "mission" | "chat" | "rejection" | "manual" | "consolidation"
		lastConfirmedAt: v.optional(v.number()), // for decay
		expiresAt: v.optional(v.number()),
	})
		.index("by_agent", ["userId", "agentId"])
		.index("by_scope", ["userId", "scope"]),

	// ── Favorites ──────────────────────────────────────────────────
	favorites: defineTable({
		userId: v.string(),
		entityType: v.union(v.literal("client"), v.literal("project"), v.literal("todo"), v.literal("note"), v.literal("bookmark"), v.literal("feedItem")),
		entityId: v.string(),
		label: v.string(),
		order: v.number(),
		createdAt: v.number(),
	})
		.index("by_user_order", ["userId", "order"])
		.index("by_user_entity", ["userId", "entityType", "entityId"]),

	// ── External Connections ──────────────────────────────────────────
	connections: defineTable({
		userId: v.string(),
		provider: v.string(),
		label: v.string(),
		authType: v.union(v.literal("oauth2"), v.literal("api_key")),
		status: v.union(v.literal("active"), v.literal("expired"), v.literal("error"), v.literal("disconnected")),
		accessToken: v.optional(v.string()),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		scopes: v.optional(v.array(v.string())),
		apiKey: v.optional(v.string()),
		accountInfo: v.optional(
			v.object({
				email: v.optional(v.string()),
				name: v.optional(v.string()),
				avatar: v.optional(v.string()),
			})
		),
		lastUsedAt: v.optional(v.number()),
		errorMessage: v.optional(v.string()),
	})
		.index("by_user", ["userId"])
		.index("by_user_provider", ["userId", "provider"]),

	agentConnections: defineTable({
		userId: v.string(),
		agentId: v.id("agents"),
		connectionId: v.id("connections"),
		addedAt: v.number(),
	})
		.index("by_agent", ["agentId"])
		.index("by_connection", ["connectionId"]),

	providerConfigs: defineTable({
		userId: v.string(),
		provider: v.string(),
		clientId: v.string(),
		clientSecret: v.string(),
		configuredAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_provider", ["userId", "provider"]),

	// ── Frais professionnels ──

	expenses: defineTable({
		userId: v.string(),
		type: v.union(v.literal("restaurant"), v.literal("mileage")),
		date: v.string(),
		amountCents: v.optional(v.number()),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
		notes: v.optional(v.string()),
		// Restaurant
		guests: v.optional(v.string()),
		purpose: v.optional(v.string()),
		// Mileage
		departure: v.optional(v.string()),
		destination: v.optional(v.string()),
		distanceKm: v.optional(v.number()),
		reimbursementCents: v.optional(v.number()),
		qontoTransactionId: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_date", ["userId", "date"])
		.index("by_user_type", ["userId", "type"]),

	vehicleSettings: defineTable({
		userId: v.string(),
		fiscalPower: v.number(),
		vehicleType: v.union(v.literal("car"), v.literal("motorcycle")),
	}).index("by_user", ["userId"]),

	expenseSuggestions: defineTable({
		userId: v.string(),
		source: v.literal("qonto"),
		status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
		qontoTransactionId: v.string(),
		label: v.string(),
		amountCents: v.number(),
		date: v.string(),
		confidence: v.number(),
		syncedAt: v.number(),
	})
		.index("by_user_status", ["userId", "status"])
		.index("by_user_txn", ["userId", "qontoTransactionId"]),
})
