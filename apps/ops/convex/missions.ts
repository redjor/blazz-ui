import { ConvexError, v } from "convex/values"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const missionStatus = v.union(
	v.literal("planning"),
	v.literal("todo"),
	v.literal("in_progress"),
	v.literal("review"),
	v.literal("done"),
	v.literal("rejected"),
	v.literal("aborted")
)

export const list = query({
	args: { status: v.optional(v.string()) },
	handler: async (ctx, { status }) => {
		const { userId } = await requireAuth(ctx)
		if (status) {
			return ctx.db
				.query("missions")
				.withIndex("by_status", (q) =>
					q.eq("userId", userId).eq("status", status as "planning" | "todo" | "in_progress" | "review" | "done" | "rejected" | "aborted"),
				)
				.collect()
		}
		const all = await ctx.db
			.query("missions")
			.withIndex("by_status", (q) => q.eq("userId", userId))
			.collect()
		return all.sort((a, b) => b._creationTime - a._creationTime)
	},
})

export const listByAgent = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("missions")
			.withIndex("by_agent", (q) => q.eq("userId", userId).eq("agentId", agentId))
			.collect()
	},
})

export const listByStatus = query({
	args: { status: v.string() },
	handler: async (ctx, { status }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("missions")
			.withIndex("by_status", (q) =>
				q.eq("userId", userId).eq("status", status as "planning" | "todo" | "in_progress" | "review" | "done" | "rejected" | "aborted"),
			)
			.collect()
	},
})

export const listCron = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const all = await ctx.db
			.query("missions")
			.withIndex("by_status", (q) => q.eq("userId", userId))
			.collect()
		return all.filter((m) => m.cron && m.status === "done")
	},
})

export const get = query({
	args: { id: v.id("missions") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const mission = await ctx.db.get(id)
		if (!mission || mission.userId !== userId) throw new ConvexError("Introuvable")
		return mission
	},
})

export const create = mutation({
	args: {
		agentId: v.id("agents"),
		title: v.string(),
		prompt: v.string(),
		status: missionStatus,
		priority: v.union(
			v.literal("low"),
			v.literal("medium"),
			v.literal("high"),
			v.literal("urgent")
		),
		mode: v.optional(v.union(v.literal("dry-run"), v.literal("live"))),
		maxIterations: v.optional(v.number()),
		templateId: v.optional(v.string()),
		cron: v.optional(v.string()),
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
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("missions", {
			...args,
			userId,
			mode: args.mode ?? "live",
		})
	},
})

export const updateStatus = mutation({
	args: {
		id: v.id("missions"),
		status: missionStatus,
		soulHash: v.optional(v.string()),
		rejectionReason: v.optional(v.string()),
	},
	handler: async (ctx, { id, status, soulHash, rejectionReason }) => {
		const mission = await ctx.db.get(id)
		if (!mission) throw new ConvexError("Introuvable")

		const patch: Record<string, unknown> = { status }
		if (status === "in_progress") patch.startedAt = Date.now()
		if (status === "review" || status === "done") patch.completedAt = Date.now()
		if (status === "done" || status === "rejected") patch.reviewedAt = Date.now()
		if (soulHash) patch.soulHash = soulHash
		if (rejectionReason) patch.rejectionReason = rejectionReason

		await ctx.db.patch(id, patch)
	},
})

export const complete = mutation({
	args: {
		id: v.id("missions"),
		output: v.string(),
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
		costUsd: v.number(),
		soulHash: v.string(),
	},
	handler: async (ctx, { id, ...data }) => {
		await ctx.db.patch(id, {
			...data,
			status: "review",
			completedAt: Date.now(),
		})
	},
})

export const failMission = mutation({
	args: { id: v.id("missions"), error: v.string() },
	handler: async (ctx, { id, error }) => {
		await ctx.db.patch(id, { status: "review", error, completedAt: Date.now() })
	},
})

export const createFromTemplate = mutation({
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

// ── Internal (for worker, no auth) ──

export const internalListByStatus = internalQuery({
	args: { status: v.string() },
	handler: async (ctx, { status }) => {
		// Get all missions with this status (across all users)
		const all = await ctx.db.query("missions").collect()
		return all.filter((m) => m.status === status)
	},
})

export const internalGet = internalQuery({
	args: { id: v.id("missions") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

export const internalUpdateStatus = internalMutation({
	args: {
		id: v.id("missions"),
		status: v.string(),
		soulHash: v.optional(v.string()),
		rejectionReason: v.optional(v.string()),
	},
	handler: async (ctx, { id, status, soulHash, rejectionReason }) => {
		const patch: Record<string, unknown> = { status }
		if (status === "in_progress") patch.startedAt = Date.now()
		if (status === "review" || status === "done") patch.completedAt = Date.now()
		if (status === "done" || status === "rejected") patch.reviewedAt = Date.now()
		if (soulHash) patch.soulHash = soulHash
		if (rejectionReason) patch.rejectionReason = rejectionReason
		await ctx.db.patch(id, patch)
	},
})

export const internalComplete = internalMutation({
	args: {
		id: v.id("missions"),
		output: v.string(),
		structuredOutput: v.optional(v.any()),
		outputType: v.optional(v.string()),
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

export const internalFailMission = internalMutation({
	args: { id: v.id("missions"), error: v.string() },
	handler: async (ctx, { id, error }) => {
		await ctx.db.patch(id, { status: "review", error, completedAt: Date.now() })
	},
})

export const internalListCron = internalQuery({
	args: {},
	handler: async (ctx) => {
		const all = await ctx.db.query("missions").collect()
		return all.filter((m) => m.cron && m.status === "done")
	},
})

export const internalCreateFromTemplate = internalMutation({
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
