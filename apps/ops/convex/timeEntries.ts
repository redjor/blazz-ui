import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {
    projectId: v.optional(v.id("projects")),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, from, to }) => {
    let entries = projectId
      ? await ctx.db
          .query("timeEntries")
          .withIndex("by_project", (q) => q.eq("projectId", projectId))
          .collect()
      : await ctx.db.query("timeEntries").collect()

    if (from) entries = entries.filter((e) => e.date >= from)
    if (to) entries = entries.filter((e) => e.date <= to)

    return entries.sort((a, b) => b.date.localeCompare(a.date))
  },
})

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    return ctx.db.query("timeEntries").order("desc").take(limit)
  },
})

export const listForRecap = query({
  args: {
    projectId: v.optional(v.id("projects")),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    includeInvoiced: v.optional(v.boolean()),
  },
  handler: async (ctx, { projectId, from, to, includeInvoiced = false }) => {
    let entries = projectId
      ? await ctx.db
          .query("timeEntries")
          .withIndex("by_project", (q) => q.eq("projectId", projectId))
          .collect()
      : await ctx.db.query("timeEntries").collect()

    if (!includeInvoiced) entries = entries.filter((e) => !e.invoicedAt)
    if (from) entries = entries.filter((e) => e.date >= from)
    if (to) entries = entries.filter((e) => e.date <= to)
    entries = entries.filter((e) => e.billable)

    return entries.sort((a, b) => a.date.localeCompare(b.date))
  },
})

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("timeEntries", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("timeEntries"),
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})

export const remove = mutation({
  args: { id: v.id("timeEntries") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
})

export const unmarkInvoiced = mutation({
  args: { ids: v.array(v.id("timeEntries")) },
  handler: async (ctx, { ids }) => {
    await Promise.all(
      ids.map(async (id) => {
        const entry = await ctx.db.get(id)
        if (entry?.invoicedAt) {
          await ctx.db.patch(id, { invoicedAt: undefined })
        }
      })
    )
  },
})

export const markInvoiced = mutation({
  args: { ids: v.array(v.id("timeEntries")) },
  handler: async (ctx, { ids }) => {
    const now = Date.now()
    await Promise.all(
      ids.map(async (id) => {
        const entry = await ctx.db.get(id)
        if (entry && !entry.invoicedAt) {
          await ctx.db.patch(id, { invoicedAt: now })
        }
      })
    )
  },
})
