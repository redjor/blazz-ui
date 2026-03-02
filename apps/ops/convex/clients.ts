import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").order("desc").collect()
    return Promise.all(
      clients.map(async (c) => ({
        ...c,
        logoUrl: c.logoStorageId ? await ctx.storage.getUrl(c.logoStorageId) : null,
      }))
    )
  },
})

export const get = query({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const c = await ctx.db.get(id)
    if (!c) return null
    return {
      ...c,
      logoUrl: c.logoStorageId ? await ctx.storage.getUrl(c.logoStorageId) : null,
    }
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
})

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("clients", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { id, ...fields }) => {
    // If logo is being replaced, delete old file from storage
    const existing = await ctx.db.get(id)
    if (
      existing?.logoStorageId &&
      fields.logoStorageId !== undefined &&
      fields.logoStorageId !== existing.logoStorageId
    ) {
      await ctx.storage.delete(existing.logoStorageId)
    }
    return ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)
    if (existing?.logoStorageId) {
      await ctx.storage.delete(existing.logoStorageId)
    }
    return ctx.db.delete(id)
  },
})
