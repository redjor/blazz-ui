import { ConvexError, v } from "convex/values"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const listPending = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const approvals = await ctx.db
			.query("missionApprovals")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "pending"))
			.collect()
		return approvals.sort((a, b) => b.requestedAt - a.requestedAt)
	},
})

export const listByMission = query({
	args: { missionId: v.id("missions") },
	handler: async (ctx, { missionId }) => {
		const { userId } = await requireAuth(ctx)
		const mission = await ctx.db.get(missionId)
		if (!mission || mission.userId !== userId) return []
		const approvals = await ctx.db
			.query("missionApprovals")
			.withIndex("by_mission", (q) => q.eq("missionId", missionId))
			.collect()
		return approvals.sort((a, b) => b.requestedAt - a.requestedAt)
	},
})

export const approve = mutation({
	args: { id: v.id("missionApprovals") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const approval = await ctx.db.get(id)
		if (!approval || approval.userId !== userId) throw new ConvexError("Introuvable")
		if (approval.status !== "pending") throw new ConvexError("Déjà résolu")
		await ctx.db.patch(id, { status: "approved", resolvedAt: Date.now() })
	},
})

export const reject = mutation({
	args: { id: v.id("missionApprovals"), reason: v.optional(v.string()) },
	handler: async (ctx, { id, reason }) => {
		const { userId } = await requireAuth(ctx)
		const approval = await ctx.db.get(id)
		if (!approval || approval.userId !== userId) throw new ConvexError("Introuvable")
		if (approval.status !== "pending") throw new ConvexError("Déjà résolu")
		await ctx.db.patch(id, {
			status: "rejected",
			resolvedAt: Date.now(),
			rejectionReason: reason,
		})
	},
})

// ── Internal (worker) ──

export const internalRequest = internalMutation({
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
			status: "pending",
			requestedAt: Date.now(),
		})
	},
})

export const internalGet = internalQuery({
	args: { id: v.id("missionApprovals") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})
