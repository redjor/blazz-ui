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
	args: { id: v.id("agents"), status: v.union(v.literal("idle"), v.literal("busy"), v.literal("disabled")) },
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

		await ctx.db.patch(id, {
			usage: {
				todayUsd,
				monthUsd,
				totalUsd: agent.usage.totalUsd + costUsd,
				lastResetDay: today,
				lastResetMonth: month,
			},
		})
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
		actions: v.optional(v.array(v.object({
			type: v.string(),
			description: v.string(),
			entityId: v.optional(v.string()),
			reversible: v.boolean(),
		}))),
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
		return all.filter((m) =>
			(!m.expiresAt || m.expiresAt > now) &&
			(
				(m.scope === "private" && m.agentId === agentId) ||
				m.scope === "shared"
			)
		)
	},
})

export const workerAddMemory = mutation({
	args: {
		userId: v.id("users"),
		agentId: v.optional(v.id("agents")),
		missionId: v.optional(v.id("missions")),
		scope: v.union(v.literal("private"), v.literal("shared")),
		category: v.union(
			v.literal("fact"), v.literal("preference"), v.literal("episode"),
			v.literal("pattern"), v.literal("rule"),
		),
		content: v.string(),
		confidence: v.optional(v.number()),
		source: v.optional(v.string()),
		expiresAt: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("agentMemory", { ...args, lastConfirmedAt: Date.now() })
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

// ── Write mutations (for agent tools) ──

export const workerCreateNote = mutation({
	args: {
		content: v.string(),
		entityType: v.optional(v.string()),
		entityId: v.optional(v.string()),
		userId: v.optional(v.id("users")),
	},
	handler: async (ctx, { content, entityType, entityId, userId }) => {
		return ctx.db.insert("notes", {
			content,
			entityType: entityType ?? "general",
			entityId,
			userId: userId as any,
			pinned: false,
			locked: false,
		})
	},
})

export const workerCreateTodo = mutation({
	args: {
		text: v.string(),
		priority: v.optional(v.string()),
		dueDate: v.optional(v.string()),
		userId: v.optional(v.id("users")),
		createdByAgent: v.optional(v.id("agents")),
	},
	handler: async (ctx, { text, priority, dueDate, userId, createdByAgent }) => {
		return ctx.db.insert("todos", {
			text,
			status: "todo",
			priority: priority ?? "normal",
			dueDate,
			userId: userId as any,
			createdByAgent,
		})
	},
})
