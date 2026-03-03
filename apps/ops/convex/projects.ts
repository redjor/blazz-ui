import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const statusValidator = v.union(
  v.literal("active"),
  v.literal("paused"),
  v.literal("closed")
)

export const listByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    return ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect()
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("projects").collect(),
})

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => ctx.db.get(id),
})

export const create = mutation({
  args: {
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("projects", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})

export const getWithStats = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id)
    if (!project) return null

    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect()

    const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0)
    const totalRevenue = entries.reduce(
      (s, e) => s + (e.minutes / 60) * e.hourlyRate,
      0
    )
    const invoicedRevenue = entries
      .filter((e) => e.status === "invoiced" || e.status === "paid")
      .reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
    const pendingRevenue = totalRevenue - invoicedRevenue

    const byMonthMap: Record<string, { minutes: number; revenue: number }> = {}
    for (const e of entries) {
      const month = e.date.slice(0, 7) // "2026-03"
      if (!byMonthMap[month]) byMonthMap[month] = { minutes: 0, revenue: 0 }
      byMonthMap[month].minutes += e.minutes
      byMonthMap[month].revenue += (e.minutes / 60) * e.hourlyRate
    }
    const monthlyData = Object.entries(byMonthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        heures: Math.round((data.minutes / 60) * 10) / 10,
        ca: Math.round(data.revenue),
      }))

    return {
      project,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
      stats: {
        totalMinutes,
        totalRevenue: Math.round(totalRevenue),
        invoicedRevenue: Math.round(invoicedRevenue),
        pendingRevenue: Math.round(pendingRevenue),
      },
      monthlyData,
    }
  },
})
