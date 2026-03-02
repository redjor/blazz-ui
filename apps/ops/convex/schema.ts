import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }),

  projects: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.string(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  timeEntries: defineTable({
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
    invoicedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_date", ["date"]),
})
