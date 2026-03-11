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
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect()

    return Promise.all(
      projects.map(async (project) => {
        if (!project.budgetAmount) return { ...project, budgetPercent: null }
        const entries = await ctx.db
          .query("timeEntries")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect()
        const billableEntries = entries.filter((e) => e.billable)
        const daysConsumed =
          project.hoursPerDay > 0
            ? billableEntries.reduce((s, e) => s + e.minutes, 0) / (project.hoursPerDay * 60)
            : 0
        const daysSold = project.tjm > 0 ? project.budgetAmount / project.tjm : 0
        const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
        return { ...project, budgetPercent: Math.round(percentUsed * 10) / 10 }
      })
    )
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("projects").collect(),
})

export const listAllWithBudget = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect()

    return Promise.all(
      projects.map(async (project) => {
        const entries = await ctx.db
          .query("timeEntries")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect()
        const billableEntries = entries.filter((e) => e.billable)
        const billableMinutes = billableEntries.reduce((s, e) => s + e.minutes, 0)
        const billableRevenue = Math.round(
          billableEntries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
        )
        const daysConsumed =
          project.hoursPerDay > 0 ? billableMinutes / (project.hoursPerDay * 60) : 0

        if (!project.budgetAmount) {
          return {
            ...project,
            budgetPercent: null,
            billableRevenue,
            daysConsumed: Math.round(daysConsumed * 10) / 10,
          }
        }

        const daysSold = project.tjm > 0 ? project.budgetAmount / project.tjm : 0
        const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
        return {
          ...project,
          budgetPercent: Math.round(percentUsed * 10) / 10,
          billableRevenue,
          daysConsumed: Math.round(daysConsumed * 10) / 10,
        }
      })
    )
  },
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
    budgetAmount: v.optional(v.number()),
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
    budgetAmount: v.optional(v.number()),
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})

function buildWeeklyBurnDown(
    project: { startDate?: string; budgetAmount?: number; tjm: number; hoursPerDay: number },
    billableEntries: Array<{ date: string; minutes: number; hourlyRate: number }>
) {
    if (!project.budgetAmount || !project.startDate) return null

    const revenueByWeek: Record<string, number> = {}
    for (const e of billableEntries) {
        const d = new Date(e.date)
        const day = d.getDay() || 7
        const monday = new Date(d)
        monday.setDate(d.getDate() - day + 1)
        const weekKey = monday.toISOString().slice(0, 10)
        revenueByWeek[weekKey] = (revenueByWeek[weekKey] ?? 0) + (e.minutes / 60) * e.hourlyRate
    }

    const sortedWeeks = Object.keys(revenueByWeek).sort()
    if (sortedWeeks.length === 0) return null

    const budget = project.budgetAmount
    let cumulative = 0
    const points = sortedWeeks.map((week) => {
        cumulative += revenueByWeek[week]
        return { week, remaining: Math.round(budget - cumulative) }
    })

    const totalWeeks = points.length
    return points.map((p, i) => ({
        ...p,
        theoretical: Math.round(budget - (budget / totalWeeks) * (i + 1)),
    }))
}

export const getWithStats = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id)
    if (!project) return null

    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect()

    const billableEntries = entries.filter((e) => e.billable)

    const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0)
    const totalRevenue = billableEntries.reduce(
      (s, e) => s + (e.minutes / 60) * e.hourlyRate,
      0
    )
    const invoicedRevenue = billableEntries
      .filter((e) => e.status === "invoiced" || e.status === "paid")
      .reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
    const pendingRevenue = totalRevenue - invoicedRevenue

    const byMonthMap: Record<string, { minutes: number; revenue: number }> = {}
    for (const e of entries) {
      const month = e.date.slice(0, 7) // "2026-03"
      if (!byMonthMap[month]) byMonthMap[month] = { minutes: 0, revenue: 0 }
      byMonthMap[month].minutes += e.minutes
      if (e.billable) byMonthMap[month].revenue += (e.minutes / 60) * e.hourlyRate
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
      entries: [...entries].sort((a, b) => b.date.localeCompare(a.date)),
      stats: {
        totalMinutes,
        billableMinutes: billableEntries.reduce((s, e) => s + e.minutes, 0),
        billableRevenue: Math.round(
            billableEntries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
        ),
        totalRevenue: Math.round(totalRevenue),
        invoicedRevenue: Math.round(invoicedRevenue),
        pendingRevenue: Math.round(pendingRevenue),
      },
      monthlyData,
      weeklyBurnDown: buildWeeklyBurnDown(project, billableEntries),
    }
  },
})
