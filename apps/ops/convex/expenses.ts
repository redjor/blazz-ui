import { ConvexError, v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { type MutationCtx, mutation, type QueryCtx, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"
import { computeMileageReimbursement } from "./lib/urssaf"

// ── Helpers (not exported) ───────────────────────────────────────────

async function getAnnualKm(ctx: QueryCtx | MutationCtx, userId: string, year: string, excludeId?: Id<"expenses">): Promise<number> {
	const from = `${year}-01-01`
	const to = `${year}-12-31`

	const entries = await ctx.db
		.query("expenses")
		.withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", "mileage"))
		.collect()

	return entries
		.filter((e) => e.date >= from && e.date <= to)
		.filter((e) => !excludeId || e._id !== excludeId)
		.reduce((sum, e) => sum + (e.distanceKm ?? 0), 0)
}

async function getVehicleSettings(ctx: QueryCtx | MutationCtx, userId: string) {
	return ctx.db
		.query("vehicleSettings")
		.withIndex("by_user", (q) => q.eq("userId", userId))
		.first()
}

async function recalculateYear(ctx: MutationCtx, userId: string, year: string) {
	const from = `${year}-01-01`
	const to = `${year}-12-31`

	const vehicle = await ctx.db
		.query("vehicleSettings")
		.withIndex("by_user", (q) => q.eq("userId", userId))
		.first()

	if (!vehicle) return

	const entries = await ctx.db
		.query("expenses")
		.withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", "mileage"))
		.collect()

	const yearEntries = entries
		.filter((e) => e.date >= from && e.date <= to)
		.sort((a, b) => {
			const d = a.date.localeCompare(b.date)
			if (d !== 0) return d
			return a._creationTime - b._creationTime
		})

	let cumulativeKm = 0
	for (const entry of yearEntries) {
		const km = entry.distanceKm ?? 0
		const reimbursementCents = computeMileageReimbursement(km, cumulativeKm, vehicle.fiscalPower)
		cumulativeKm += km
		await ctx.db.patch(entry._id, { reimbursementCents })
	}
}

// ── Queries ──────────────────────────────────────────────────────────

export const list = query({
	args: {
		type: v.optional(v.union(v.literal("restaurant"), v.literal("mileage"))),
		from: v.optional(v.string()),
		to: v.optional(v.string()),
	},
	handler: async (ctx, { type, from, to }) => {
		const { userId } = await requireAuth(ctx)

		let entries = type
			? await ctx.db
					.query("expenses")
					.withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type))
					.collect()
			: await ctx.db
					.query("expenses")
					.withIndex("by_user", (q) => q.eq("userId", userId))
					.collect()

		if (from) entries = entries.filter((e) => e.date >= from)
		if (to) entries = entries.filter((e) => e.date <= to)

		// Join client names
		const clientIds = [...new Set(entries.filter((e) => e.clientId).map((e) => e.clientId!))]
		const clients = await Promise.all(clientIds.map((id) => ctx.db.get(id)))
		const clientMap = new Map(clients.filter(Boolean).map((c) => [c!._id, c!.name]))

		return entries
			.sort((a, b) => b.date.localeCompare(a.date))
			.map((e) => ({
				...e,
				clientName: e.clientId ? (clientMap.get(e.clientId) ?? null) : null,
			}))
	},
})

export const stats = query({
	args: {
		from: v.string(),
		to: v.string(),
	},
	handler: async (ctx, { from, to }) => {
		const { userId } = await requireAuth(ctx)

		const entries = await ctx.db
			.query("expenses")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const filtered = entries.filter((e) => e.date >= from && e.date <= to)

		const restaurants = filtered.filter((e) => e.type === "restaurant")
		const mileages = filtered.filter((e) => e.type === "mileage")

		return {
			totalRestaurantCents: restaurants.reduce((sum, e) => sum + (e.amountCents ?? 0), 0),
			totalKm: mileages.reduce((sum, e) => sum + (e.distanceKm ?? 0), 0),
			totalReimbursementCents: mileages.reduce((sum, e) => sum + (e.reimbursementCents ?? 0), 0),
			restaurantCount: restaurants.length,
			mileageCount: mileages.length,
		}
	},
})

// ── Mutations ────────────────────────────────────────────────────────

export const create = mutation({
	args: {
		type: v.union(v.literal("restaurant"), v.literal("mileage")),
		date: v.string(),
		amountCents: v.optional(v.number()),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
		notes: v.optional(v.string()),
		// Restaurant
		guests: v.optional(v.string()),
		purpose: v.optional(v.string()),
		// Mileage
		departure: v.optional(v.string()),
		destination: v.optional(v.string()),
		distanceKm: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)

		// Validate client ownership
		if (args.clientId) {
			const client = await ctx.db.get(args.clientId)
			if (!client || client.userId !== userId) {
				throw new ConvexError("Client non trouvé")
			}
		}

		// Validate project ownership
		if (args.projectId) {
			const project = await ctx.db.get(args.projectId)
			if (!project || project.userId !== userId) {
				throw new ConvexError("Projet non trouvé")
			}
		}

		let reimbursementCents: number | undefined
		if (args.type === "mileage" && args.distanceKm) {
			const vehicle = await getVehicleSettings(ctx, userId)
			if (vehicle) {
				const year = args.date.slice(0, 4)
				const annualKm = await getAnnualKm(ctx, userId, year)
				reimbursementCents = computeMileageReimbursement(args.distanceKm, annualKm, vehicle.fiscalPower)
			}
		}

		const id = await ctx.db.insert("expenses", {
			...args,
			userId,
			reimbursementCents,
			createdAt: Date.now(),
		})

		// Recalculate year to keep all entries consistent
		if (args.type === "mileage") {
			await recalculateYear(ctx, userId, args.date.slice(0, 4))
		}

		return id
	},
})

export const update = mutation({
	args: {
		id: v.id("expenses"),
		type: v.optional(v.union(v.literal("restaurant"), v.literal("mileage"))),
		date: v.optional(v.string()),
		amountCents: v.optional(v.number()),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
		notes: v.optional(v.string()),
		guests: v.optional(v.string()),
		purpose: v.optional(v.string()),
		departure: v.optional(v.string()),
		destination: v.optional(v.string()),
		distanceKm: v.optional(v.number()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)

		const existing = await ctx.db.get(id)
		if (!existing || existing.userId !== userId) {
			throw new ConvexError("Frais non trouvé")
		}

		// Validate client ownership
		if (fields.clientId) {
			const client = await ctx.db.get(fields.clientId)
			if (!client || client.userId !== userId) {
				throw new ConvexError("Client non trouvé")
			}
		}

		// Validate project ownership
		if (fields.projectId) {
			const project = await ctx.db.get(fields.projectId)
			if (!project || project.userId !== userId) {
				throw new ConvexError("Projet non trouvé")
			}
		}

		const oldYear = existing.date.slice(0, 4)
		const newDate = fields.date ?? existing.date
		const newYear = newDate.slice(0, 4)
		const newType = fields.type ?? existing.type

		await ctx.db.patch(id, fields)

		// Recalculate affected years for mileage entries
		if (existing.type === "mileage" || newType === "mileage") {
			await recalculateYear(ctx, userId, newYear)
			if (oldYear !== newYear) {
				await recalculateYear(ctx, userId, oldYear)
			}
		}
	},
})

export const remove = mutation({
	args: {
		id: v.id("expenses"),
	},
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)

		const existing = await ctx.db.get(id)
		if (!existing || existing.userId !== userId) {
			throw new ConvexError("Frais non trouvé")
		}

		const wasMileage = existing.type === "mileage"
		const year = existing.date.slice(0, 4)

		await ctx.db.delete(id)

		if (wasMileage) {
			await recalculateYear(ctx, userId, year)
		}
	},
})
