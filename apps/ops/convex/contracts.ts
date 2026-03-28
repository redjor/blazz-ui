import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const contractStatusValidator = v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled"))

const contractTypeValidator = v.union(v.literal("tma"), v.literal("forfait"), v.literal("regie"))

// ── Queries ────────────────────────────────────────

export const getActiveByProject = query({
	args: { projectId: v.id("projects") },
	handler: async (ctx, { projectId }) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(projectId)
		if (!project || project.userId !== userId) return null

		const contracts = await ctx.db
			.query("contracts")
			.withIndex("by_project", (q) => q.eq("projectId", projectId))
			.collect()
		return contracts.find((c) => c.status === "active") ?? null
	},
})

export const listByProject = query({
	args: { projectId: v.id("projects") },
	handler: async (ctx, { projectId }) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(projectId)
		if (!project || project.userId !== userId) return []

		const contracts = await ctx.db
			.query("contracts")
			.withIndex("by_project", (q) => q.eq("projectId", projectId))
			.collect()
		return contracts.sort((a, b) => b.createdAt - a.createdAt)
	},
})

// ── Mutations ──────────────────────────────────────

export const create = mutation({
	args: {
		projectId: v.id("projects"),
		type: contractTypeValidator,
		daysPerMonth: v.optional(v.number()),
		budgetAmount: v.optional(v.number()),
		carryOver: v.boolean(),
		prestationStartDate: v.optional(v.string()),
		startDate: v.string(),
		endDate: v.string(),
		status: contractStatusValidator,
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(args.projectId)
		if (!project || project.userId !== userId) throw new ConvexError("Introuvable")

		// Enforce: only one active contract per project
		if (args.status === "active") {
			const existing = await ctx.db
				.query("contracts")
				.withIndex("by_project", (q) => q.eq("projectId", args.projectId))
				.collect()
			const hasActive = existing.some((c) => c.status === "active")
			if (hasActive) {
				throw new Error("Ce projet a déjà un contrat actif. Clôturez-le d'abord.")
			}
		}

		// Enforce: daysPerMonth required for TMA
		if (args.type === "tma" && (!args.daysPerMonth || args.daysPerMonth <= 0)) {
			throw new Error("Le nombre de jours/mois est requis pour un contrat TMA.")
		}

		return ctx.db.insert("contracts", { ...args, userId, createdAt: Date.now() })
	},
})

export const update = mutation({
	args: {
		id: v.id("contracts"),
		type: v.optional(contractTypeValidator),
		daysPerMonth: v.optional(v.number()),
		budgetAmount: v.optional(v.number()),
		carryOver: v.optional(v.boolean()),
		prestationStartDate: v.optional(v.string()),
		startDate: v.optional(v.string()),
		endDate: v.optional(v.string()),
		status: v.optional(contractStatusValidator),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const contract = await ctx.db.get(id)
		if (!contract || contract.userId !== userId) throw new ConvexError("Introuvable")

		const newType = fields.type ?? contract.type
		const newDays = fields.daysPerMonth ?? contract.daysPerMonth
		if (newType === "tma" && (!newDays || newDays <= 0)) {
			throw new Error("Le nombre de jours/mois est requis pour un contrat TMA.")
		}

		return ctx.db.patch(id, fields)
	},
})

export const complete = mutation({
	args: { id: v.id("contracts") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const contract = await ctx.db.get(id)
		if (!contract || contract.userId !== userId) throw new ConvexError("Introuvable")
		if (contract.status !== "active") {
			throw new Error("Seul un contrat actif peut être clôturé.")
		}
		return ctx.db.patch(id, { status: "completed" })
	},
})

export const cancel = mutation({
	args: { id: v.id("contracts") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const contract = await ctx.db.get(id)
		if (!contract || contract.userId !== userId) throw new ConvexError("Introuvable")
		if (contract.status !== "active") {
			throw new Error("Seul un contrat actif peut être annulé.")
		}
		return ctx.db.patch(id, { status: "cancelled" })
	},
})
