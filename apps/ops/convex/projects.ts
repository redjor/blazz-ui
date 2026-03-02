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
