import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth } from "./lib/auth"

const contractStatusValidator = v.union(
  v.literal("active"),
  v.literal("completed"),
  v.literal("cancelled")
)

const contractTypeValidator = v.union(
  v.literal("tma"),
  v.literal("forfait")
)

// ── Queries ────────────────────────────────────────

export const getActiveByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireAuth(ctx)
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
    await requireAuth(ctx)
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
    carryOver: v.boolean(),
    startDate: v.string(),
    endDate: v.string(),
    status: contractStatusValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)

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

    return ctx.db.insert("contracts", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("contracts"),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAuth(ctx)
    return ctx.db.patch(id, fields)
  },
})

export const complete = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx)
    return ctx.db.patch(id, { status: "completed" })
  },
})

export const cancel = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx)
    return ctx.db.patch(id, { status: "cancelled" })
  },
})
