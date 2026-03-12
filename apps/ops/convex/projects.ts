import { mutation, query } from "./_generated/server"
import { v, ConvexError } from "convex/values"
import { requireAuth } from "./lib/auth"

const statusValidator = v.union(
  v.literal("active"),
  v.literal("paused"),
  v.literal("closed")
)

export const listByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    const { userId } = await requireAuth(ctx)
    const client = await ctx.db.get(clientId)
    if (!client || client.userId !== userId) return []

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user_client", (q) => q.eq("userId", userId).eq("clientId", clientId))
      .collect()

    // Batch fetch timeEntries for all projects at once (eliminates N+1)
    const projectIds = new Set(projects.map((p) => p._id))
    const allEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
    const entriesByProject = new Map<string, typeof allEntries>()
    for (const e of allEntries) {
      if (projectIds.has(e.projectId)) {
        const key = e.projectId as string
        if (!entriesByProject.has(key)) entriesByProject.set(key, [])
        entriesByProject.get(key)!.push(e)
      }
    }

    return projects.map((project) => {
      if (!project.budgetAmount) return { ...project, budgetPercent: null }
      const entries = entriesByProject.get(project._id as string) ?? []
      const billableEntries = entries.filter((e) => e.billable)
      const daysConsumed =
        project.hoursPerDay > 0
          ? billableEntries.reduce((s, e) => s + e.minutes, 0) / (project.hoursPerDay * 60)
          : 0
      const daysSold = project.tjm > 0 ? project.budgetAmount / project.tjm : 0
      const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
      return { ...project, budgetPercent: Math.round(percentUsed * 10) / 10 }
    })
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  },
})

export const listAllWithBudget = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    // Batch fetch all user's timeEntries and contracts (eliminates N+1)
    const allEntries = await ctx.db
      .query("timeEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
    const allContracts = await ctx.db
      .query("contracts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    // Group by project in memory
    const entriesByProject = new Map<string, typeof allEntries>()
    for (const e of allEntries) {
      const key = e.projectId as string
      if (!entriesByProject.has(key)) entriesByProject.set(key, [])
      entriesByProject.get(key)!.push(e)
    }
    const contractsByProject = new Map<string, typeof allContracts>()
    for (const c of allContracts) {
      const key = c.projectId as string
      if (!contractsByProject.has(key)) contractsByProject.set(key, [])
      contractsByProject.get(key)!.push(c)
    }

    return projects.map((project) => {
      const entries = entriesByProject.get(project._id as string) ?? []
      const billableEntries = entries.filter((e) => e.billable)
      const billableMinutes = billableEntries.reduce((s, e) => s + e.minutes, 0)
      const billableRevenue = Math.round(
        billableEntries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
      )
      const daysConsumed =
        project.hoursPerDay > 0 ? billableMinutes / (project.hoursPerDay * 60) : 0

      const contracts = contractsByProject.get(project._id as string) ?? []
      const activeContract = contracts.find((c) => c.status === "active")

      if (!project.budgetAmount) {
        return {
          ...project,
          budgetPercent: null,
          billableRevenue,
          daysConsumed: Math.round(daysConsumed * 10) / 10,
          hasActiveContract: !!activeContract,
          contractType: activeContract?.type ?? null,
          contractDaysPerMonth: activeContract?.daysPerMonth ?? null,
        }
      }

      const daysSold = project.tjm > 0 ? project.budgetAmount / project.tjm : 0
      const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
      return {
        ...project,
        budgetPercent: Math.round(percentUsed * 10) / 10,
        billableRevenue,
        daysConsumed: Math.round(daysConsumed * 10) / 10,
        hasActiveContract: !!activeContract,
        contractType: activeContract?.type ?? null,
        contractDaysPerMonth: activeContract?.daysPerMonth ?? null,
      }
    })
  },
})

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("projects")
      .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "active"))
      .collect()
  },
})

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const project = await ctx.db.get(id)
    if (!project || project.userId !== userId) return null
    return project
  },
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
    const { userId } = await requireAuth(ctx)
    const client = await ctx.db.get(args.clientId)
    if (!client || client.userId !== userId) throw new ConvexError("Introuvable")
    return ctx.db.insert("projects", { ...args, userId, createdAt: Date.now() })
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
  handler: async (ctx, { id, ...fields }) => {
    const { userId } = await requireAuth(ctx)
    const project = await ctx.db.get(id)
    if (!project || project.userId !== userId) throw new ConvexError("Introuvable")
    return ctx.db.patch(id, fields)
  },
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
    const { userId } = await requireAuth(ctx)
    const project = await ctx.db.get(id)
    if (!project || project.userId !== userId) return null

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
