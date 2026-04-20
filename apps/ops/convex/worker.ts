/**
 * Public Convex functions for the worker daemon.
 * These don't require user auth since the worker runs as a separate process.
 * Named with worker* prefix to distinguish from user-facing functions.
 */
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

// ── Agents ──

export const workerGetAgent = query({
	args: { id: v.id("agents") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

export const workerUpdateAgentStatus = mutation({
	args: { id: v.id("agents"), status: v.union(v.literal("idle"), v.literal("busy"), v.literal("paused"), v.literal("error"), v.literal("disabled")) },
	handler: async (ctx, { id, status }) => {
		await ctx.db.patch(id, { status, lastActiveAt: Date.now() })
	},
})

export const workerAddAgentUsage = mutation({
	args: { id: v.id("agents"), costUsd: v.number() },
	handler: async (ctx, { id, costUsd }) => {
		const agent = await ctx.db.get(id)
		if (!agent) return

		const today = new Date().toISOString().slice(0, 10)
		const month = new Date().toISOString().slice(0, 7)

		const todayUsd = agent.usage.lastResetDay === today ? agent.usage.todayUsd + costUsd : costUsd
		const monthUsd = agent.usage.lastResetMonth === month ? agent.usage.monthUsd + costUsd : costUsd

		const newUsage = {
			todayUsd,
			monthUsd,
			totalUsd: agent.usage.totalUsd + costUsd,
			lastResetDay: today,
			lastResetMonth: month,
		}

		// Auto-pause if monthly budget exceeded
		const budgetExceeded = monthUsd >= agent.budget.maxPerMonth
		await ctx.db.patch(id, {
			usage: newUsage,
			...(budgetExceeded ? { status: "disabled" as const } : {}),
		})

		return { budgetExceeded, monthUsd, maxPerMonth: agent.budget.maxPerMonth }
	},
})

// ── Missions ──

export const workerListByStatus = query({
	args: { status: v.string() },
	handler: async (ctx, { status }) => {
		const all = await ctx.db.query("missions").collect()
		return all.filter((m) => m.status === status)
	},
})

export const workerUpdateStatus = mutation({
	args: {
		id: v.id("missions"),
		status: v.string(),
		soulHash: v.optional(v.string()),
	},
	handler: async (ctx, { id, status, soulHash }) => {
		const patch: Record<string, unknown> = { status }
		if (status === "in_progress") patch.startedAt = Date.now()
		if (status === "review" || status === "done") patch.completedAt = Date.now()
		if (soulHash) patch.soulHash = soulHash
		await ctx.db.patch(id, patch)
	},
})

export const workerComplete = mutation({
	args: {
		id: v.id("missions"),
		output: v.string(),
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
		costUsd: v.number(),
		soulHash: v.string(),
	},
	handler: async (ctx, { id, ...data }) => {
		await ctx.db.patch(id, { ...data, status: "review", completedAt: Date.now() })
	},
})

export const workerFailMission = mutation({
	args: { id: v.id("missions"), error: v.string() },
	handler: async (ctx, { id, error }) => {
		await ctx.db.patch(id, { status: "review", error, completedAt: Date.now() })
	},
})

export const workerListCron = query({
	args: {},
	handler: async (ctx) => {
		const all = await ctx.db.query("missions").collect()
		return all.filter((m) => m.cron && m.status === "done")
	},
})

export const workerCreateFromTemplate = mutation({
	args: { templateMissionId: v.id("missions") },
	handler: async (ctx, { templateMissionId }) => {
		const template = await ctx.db.get(templateMissionId)
		if (!template) throw new ConvexError("Template introuvable")
		return ctx.db.insert("missions", {
			userId: template.userId,
			agentId: template.agentId,
			title: `${template.title} (auto ${new Date().toLocaleDateString("fr-FR")})`,
			prompt: template.prompt,
			status: "todo",
			priority: template.priority,
			mode: template.mode,
			maxIterations: template.maxIterations,
			templateId: template.templateId,
			cron: template.cron,
			parentMissionId: templateMissionId,
			onComplete: template.onComplete,
		})
	},
})

// ── Agent Memory ──

export const workerListMemory = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const all = await ctx.db.query("agentMemory").collect()
		const now = Date.now()
		// Private memories for this agent + all shared memories
		return all.filter((m) => (!m.expiresAt || m.expiresAt > now) && ((m.scope === "private" && m.agentId === agentId) || m.scope === "shared"))
	},
})

export const workerAddMemory = mutation({
	args: {
		userId: v.id("users"),
		agentId: v.optional(v.id("agents")),
		missionId: v.optional(v.id("missions")),
		scope: v.union(v.literal("private"), v.literal("shared")),
		category: v.union(v.literal("fact"), v.literal("preference"), v.literal("episode"), v.literal("pattern"), v.literal("rule")),
		content: v.string(),
		confidence: v.optional(v.number()),
		source: v.optional(v.string()),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("agentMemory", { ...args, lastConfirmedAt: Date.now() })
	},
})

// Update existing memory entry (for memory consolidation)
export const workerUpdateMemory = mutation({
	args: {
		id: v.id("agentMemory"),
		content: v.string(),
		confidence: v.optional(v.number()),
	},
	handler: async (ctx, { id, content, confidence }) => {
		const patch: Record<string, unknown> = { content, lastConfirmedAt: Date.now() }
		if (confidence !== undefined) patch.confidence = confidence
		await ctx.db.patch(id, patch)
	},
})

// Delete memory entry (for memory consolidation)
export const workerDeleteMemory = mutation({
	args: { id: v.id("agentMemory") },
	handler: async (ctx, { id }) => {
		const mem = await ctx.db.get(id)
		if (mem) await ctx.db.delete(id)
	},
})

// List all memory visible to an agent (private + shared)
export const workerListAllMemory = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const all = await ctx.db.query("agentMemory").collect()
		return all.filter((m) => (m.scope === "private" && m.agentId === agentId) || m.scope === "shared")
	},
})

// List all agents
export const workerListAgents = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("agents").collect()
	},
})

// Get agent by slug (for delegate_to_agent tool)
export const workerGetAgentBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const all = await ctx.db.query("agents").collect()
		return all.find((a) => a.slug === slug) ?? null
	},
})

// Create mission (for delegate_to_agent tool)
export const workerCreateMission = mutation({
	args: {
		userId: v.id("users"),
		agentId: v.id("agents"),
		title: v.string(),
		prompt: v.string(),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
		parentMissionId: v.optional(v.id("missions")),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("missions", {
			...args,
			status: "todo",
			mode: "live",
		})
	},
})

// ── Data queries (for agent tools, no auth) ──

export const workerListTimeEntries = query({
	args: {
		projectId: v.optional(v.string()),
		from: v.optional(v.string()),
		to: v.optional(v.string()),
	},
	handler: async (ctx, { projectId, from, to }) => {
		let entries = await ctx.db.query("timeEntries").collect()
		if (projectId) entries = entries.filter((e) => e.projectId === projectId)
		if (from) entries = entries.filter((e) => e.date >= from)
		if (to) entries = entries.filter((e) => e.date <= to)
		return entries.sort((a, b) => (b.date > a.date ? 1 : -1))
	},
})

export const workerListProjects = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("projects").collect()
	},
})

export const workerListInvoices = query({
	args: { status: v.optional(v.string()) },
	handler: async (ctx, { status }) => {
		let invoices = await ctx.db.query("invoices").collect()
		if (status) invoices = invoices.filter((i) => i.status === status)
		return invoices
	},
})

export const workerGetTreasurySettings = query({
	args: {},
	handler: async (ctx) => {
		const all = await ctx.db.query("treasurySettings").collect()
		return all[0] ?? null
	},
})

export const workerExpenseSummary = query({
	args: {},
	handler: async (ctx) => {
		const expenses = await ctx.db.query("recurringExpenses").collect()
		return expenses.filter((e) => e.active !== false)
	},
})

export const workerListClients = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("clients").collect()
	},
})

// ── Knowledge queries (notes, bookmarks, todos, missions, goals, feed) ──

export const workerListNotes = query({
	args: { entityType: v.optional(v.string()), limit: v.optional(v.number()) },
	handler: async (ctx, { entityType, limit = 20 }) => {
		let notes = await ctx.db.query("notes").collect()
		if (entityType) notes = notes.filter((n) => n.entityType === entityType)
		notes = notes.filter((n) => !n.archivedAt)
		return notes
			.sort((a, b) => b.updatedAt - a.updatedAt)
			.slice(0, limit)
			.map((n) => ({
				id: n._id,
				title: n.title,
				content: n.contentText?.slice(0, 500) ?? "",
				entityType: n.entityType,
				entityId: n.entityId,
				pinned: n.pinned,
				updatedAt: n.updatedAt,
			}))
	},
})

export const workerListBookmarks = query({
	args: { type: v.optional(v.string()), limit: v.optional(v.number()) },
	handler: async (ctx, { type, limit = 20 }) => {
		let bookmarks = await ctx.db.query("bookmarks").collect()
		if (type) bookmarks = bookmarks.filter((b) => b.type === type)
		bookmarks = bookmarks.filter((b) => !b.archivedAt)
		return bookmarks
			.sort((a, b) => b.createdAt - a.createdAt)
			.slice(0, limit)
			.map((b) => ({
				id: b._id,
				url: b.url,
				type: b.type,
				title: b.title,
				description: b.description,
				author: b.author,
				siteName: b.siteName,
				pinned: b.pinned,
				createdAt: b.createdAt,
			}))
	},
})

export const workerListTodos = query({
	args: { status: v.optional(v.string()), limit: v.optional(v.number()) },
	handler: async (ctx, { status, limit = 50 }) => {
		let todos = await ctx.db.query("todos").collect()
		if (status) todos = todos.filter((t) => t.status === status)
		return todos
			.sort((a, b) => b.createdAt - a.createdAt)
			.slice(0, limit)
			.map((t) => ({
				id: t._id,
				text: t.text,
				status: t.status,
				priority: t.priority,
				dueDate: t.dueDate,
				projectId: t.projectId,
				tags: t.tags,
				createdAt: t.createdAt,
			}))
	},
})

export const workerListMissions = query({
	args: { status: v.optional(v.string()), agentId: v.optional(v.id("agents")), limit: v.optional(v.number()) },
	handler: async (ctx, { status, agentId, limit = 20 }) => {
		let missions = await ctx.db.query("missions").collect()
		if (status) missions = missions.filter((m) => m.status === status)
		if (agentId) missions = missions.filter((m) => m.agentId === agentId)
		return missions
			.sort((a, b) => b._creationTime - a._creationTime)
			.slice(0, limit)
			.map((m) => ({
				id: m._id,
				title: m.title,
				status: m.status,
				priority: m.priority,
				agentId: m.agentId,
				costUsd: m.costUsd,
				completedAt: m.completedAt,
				createdAt: m._creationTime,
			}))
	},
})

export const workerListGoals = query({
	args: { year: v.optional(v.number()) },
	handler: async (ctx, { year }) => {
		const resolvedYear = year ?? new Date().getFullYear()
		const all = await ctx.db.query("goalPlans").collect()
		return all
			.filter((g) => g.year === resolvedYear)
			.map((g) => ({
				year: g.year,
				revenue: g.revenue,
				days: g.days,
				tjm: g.tjm,
			}))
	},
})

export const workerListFeedItems = query({
	args: { unreadOnly: v.optional(v.boolean()), limit: v.optional(v.number()) },
	handler: async (ctx, { unreadOnly, limit = 20 }) => {
		let items = await ctx.db.query("feedItems").collect()
		if (unreadOnly) items = items.filter((i) => !i.isRead)
		return items
			.sort((a, b) => b.publishedAt - a.publishedAt)
			.slice(0, limit)
			.map((i) => ({
				id: i._id,
				title: i.title,
				url: i.url,
				type: i.type,
				summary: i.aiSummary,
				tags: i.aiTags,
				publishedAt: i.publishedAt,
				isRead: i.isRead,
				isFavorite: i.isFavorite,
			}))
	},
})

// ── Write mutations (for agent tools) ──

export const workerCreateNote = mutation({
	args: {
		content: v.string(),
		title: v.optional(v.string()),
		entityType: v.optional(v.string()),
		entityId: v.optional(v.string()),
		userId: v.optional(v.string()),
	},
	handler: async (ctx, { content, title, entityType, entityId, userId }) => {
		let resolvedUserId = userId
		if (!resolvedUserId) {
			const users = await ctx.db.query("users").take(1)
			resolvedUserId = users[0]?._id
		}
		const now = Date.now()
		return ctx.db.insert("notes", {
			title: title ?? content.slice(0, 80),
			contentText: content,
			entityType: (entityType ?? "general") as "client" | "project" | "contract" | "invoice" | "todo" | "general",
			entityId,
			userId: resolvedUserId as any,
			pinned: false,
			createdAt: now,
			updatedAt: now,
		})
	},
})

export const workerCreateTodo = mutation({
	args: {
		text: v.string(),
		description: v.optional(v.string()),
		priority: v.optional(v.string()),
		dueDate: v.optional(v.string()),
		projectId: v.optional(v.string()),
		userId: v.optional(v.string()),
		createdByAgent: v.optional(v.id("agents")),
		agentSlug: v.optional(v.string()),
	},
	handler: async (ctx, { text, description, priority, dueDate, projectId, userId, createdByAgent, agentSlug }) => {
		// Resolve userId from agent if not provided
		let resolvedUserId = userId
		if (!resolvedUserId && agentSlug) {
			const agents = await ctx.db.query("agents").collect()
			const agent = agents.find((a) => a.slug === agentSlug)
			if (agent) resolvedUserId = agent.userId
		}
		if (!resolvedUserId && createdByAgent) {
			const agent = await ctx.db.get(createdByAgent)
			if (agent) resolvedUserId = agent.userId
		}
		if (!resolvedUserId) {
			// Last resort: get first user
			const users = await ctx.db.query("users").take(1)
			resolvedUserId = users[0]?._id
		}
		if (!resolvedUserId) throw new ConvexError("Cannot resolve userId")

		return ctx.db.insert("todos", {
			text,
			description,
			status: "todo",
			priority: priority ?? "normal",
			source: "app" as const,
			createdAt: Date.now(),
			dueDate,
			projectId: projectId as any,
			userId: resolvedUserId,
			createdByAgent,
		})
	},
})

// ── Notifications ──

export const workerCreateNotification = mutation({
	args: {
		userId: v.string(),
		title: v.string(),
		description: v.string(),
		url: v.optional(v.string()),
		agentName: v.string(),
		agentAvatar: v.optional(v.string()),
		externalId: v.string(),
	},
	handler: async (ctx, args) => {
		// Idempotence
		const existing = await ctx.db
			.query("notifications")
			.withIndex("by_source_external", (q) => q.eq("source", "convex").eq("externalId", args.externalId))
			.first()
		if (existing) return existing._id

		return ctx.db.insert("notifications", {
			userId: args.userId,
			source: "convex",
			externalId: args.externalId,
			title: args.title,
			description: args.description,
			actionType: "mission_complete",
			authorName: args.agentName,
			authorInitials: args.agentName.slice(0, 2).toUpperCase(),
			authorAvatar: args.agentAvatar,
			url: args.url,
			read: false,
			createdAt: Date.now(),
		})
	},
})

// ── Approvals (worker side) ──

export const workerRequestApproval = mutation({
	args: {
		missionId: v.id("missions"),
		agentId: v.id("agents"),
		toolName: v.string(),
		toolArgs: v.any(),
	},
	handler: async (ctx, { missionId, agentId, toolName, toolArgs }) => {
		const mission = await ctx.db.get(missionId)
		if (!mission) throw new ConvexError("Mission introuvable")
		return ctx.db.insert("missionApprovals", {
			userId: mission.userId,
			missionId,
			agentId,
			toolName,
			toolArgs,
			status: "pending" as const,
			requestedAt: Date.now(),
		})
	},
})

export const workerGetApproval = query({
	args: { id: v.id("missionApprovals") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

// Idempotent: only transitions a pending record to rejected. If the user has
// already resolved the approval (approve or reject), this is a no-op — the
// user's decision wins over the worker's cleanup.
export const workerResolveApproval = mutation({
	args: { id: v.id("missionApprovals"), reason: v.optional(v.string()) },
	handler: async (ctx, { id, reason }) => {
		const approval = await ctx.db.get(id)
		if (!approval || approval.status !== "pending") return
		await ctx.db.patch(id, {
			status: "rejected" as const,
			resolvedAt: Date.now(),
			rejectionReason: reason,
		})
	},
})
