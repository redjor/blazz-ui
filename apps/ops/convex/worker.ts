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
		return all.filter((m) => m.agentId === agentId && (!m.expiresAt || m.expiresAt > now))
	},
})
