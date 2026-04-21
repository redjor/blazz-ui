import { ConvexError, v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { internalMutation, internalQuery, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// Shared seed definition used by both internalSeed (CLI) and seed (user-facing).
// Keep this in sync with the SOUL/STYLE/SKILL markdown files in apps/ops/agents/<slug>/.
const SEED_AGENTS = [
	{
		slug: "cfo",
		name: "Marc",
		role: "Directeur Financier",
		model: "gpt-4.1-mini",
		avatar: "🟡",
		budget: { maxPerMission: 0.15, maxPerDay: 0.5, maxPerMonth: 5.0 },
		permissions: {
			safe: ["qonto_balance", "qonto_transactions", "list_invoices", "list_recurring_expenses", "list_expenses", "treasury_forecast", "list_projects", "list_time_entries", "list_goals", "list_notes"],
			confirm: ["create_note", "create_expense"],
			blocked: ["write_file", "github_create_issue"],
		},
	},
	{
		slug: "timekeeper",
		name: "Léo",
		role: "Suivi de temps",
		model: "gpt-4.1-mini",
		avatar: "🟢",
		budget: { maxPerMission: 0.05, maxPerDay: 0.2, maxPerMonth: 2.0 },
		permissions: {
			safe: ["list_time_entries", "list_projects", "check_time_anomalies", "list_todos", "list_goals"],
			confirm: ["create_note", "create_todo"],
			blocked: ["qonto_balance", "qonto_transactions", "write_file", "github_create_issue"],
		},
	},
	{
		slug: "product-lead",
		name: "Sarah",
		role: "Chef de Produit Blazz UI",
		model: "gpt-4.1",
		avatar: "🔵",
		budget: { maxPerMission: 0.3, maxPerDay: 1.0, maxPerMonth: 8.0 },
		permissions: {
			safe: ["git_log", "git_diff", "read_file", "glob_files", "github_issues", "web_search", "list_notes", "list_todos", "list_bookmarks"],
			confirm: ["write_file", "github_create_issue", "create_note"],
			blocked: ["qonto_balance", "qonto_transactions"],
		},
	},
	{
		slug: "assistant",
		name: "Alex",
		role: "Assistant Personnel",
		model: "gpt-4.1-mini",
		avatar: "🟣",
		budget: { maxPerMission: 0.1, maxPerDay: 0.5, maxPerMonth: 5.0 },
		permissions: {
			safe: ["list_time_entries", "list_projects", "check_time_anomalies", "list_notes", "list_todos", "list_bookmarks", "list_missions", "list_goals", "list_feed_items"],
			confirm: ["create_todo", "create_note", "delegate_to_agent", "ask_agent", "save_memory"],
			blocked: ["qonto_balance", "qonto_transactions", "write_file", "github_create_issue"],
		},
	},
	{
		slug: "account-manager",
		name: "Jules",
		role: "Account Manager",
		model: "gpt-4.1-mini",
		avatar: "🟠",
		budget: { maxPerMission: 0.1, maxPerDay: 0.3, maxPerMonth: 3.0 },
		permissions: {
			safe: ["list_projects", "list_invoices", "list_time_entries", "list_recurring_expenses", "list_notes", "list_todos"],
			confirm: ["create_note", "create_todo", "ask_agent", "save_memory"],
			blocked: ["qonto_balance", "qonto_transactions", "write_file", "github_create_issue", "git_log", "git_diff", "read_file"],
		},
	},
	{
		slug: "curator",
		name: "Aria",
		role: "Curatrice de connaissances",
		model: "gpt-4.1-mini",
		avatar: "🟤",
		budget: { maxPerMission: 0.1, maxPerDay: 0.3, maxPerMonth: 3.0 },
		permissions: {
			safe: ["list_notes", "list_bookmarks", "list_feed_items", "list_todos", "web_search"],
			confirm: ["create_note", "save_memory", "ask_agent"],
			blocked: ["qonto_balance", "qonto_transactions", "write_file", "github_create_issue", "create_todo"],
		},
	},
	{
		slug: "growth",
		name: "Victor",
		role: "Veille & croissance",
		model: "gpt-4.1-mini",
		avatar: "⚪",
		budget: { maxPerMission: 0.15, maxPerDay: 0.5, maxPerMonth: 4.0 },
		permissions: {
			safe: ["list_feed_items", "list_bookmarks", "list_notes", "web_search"],
			confirm: ["create_todo", "create_note", "save_memory", "ask_agent"],
			blocked: ["qonto_balance", "qonto_transactions", "write_file", "github_create_issue"],
		},
	},
] as const

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const get = query({
	args: { id: v.id("agents") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const agent = await ctx.db.get(id)
		if (!agent || agent.userId !== userId) throw new ConvexError("Introuvable")
		return agent
	},
})

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("agents")
			.withIndex("by_slug", (q) => q.eq("userId", userId).eq("slug", slug))
			.unique()
	},
})

export const create = mutation({
	args: {
		slug: v.string(),
		name: v.string(),
		role: v.string(),
		model: v.string(),
		avatar: v.optional(v.string()),
		budget: v.object({
			maxPerMission: v.number(),
			maxPerDay: v.number(),
			maxPerMonth: v.number(),
		}),
		permissions: v.object({
			safe: v.array(v.string()),
			confirm: v.array(v.string()),
			blocked: v.array(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db.insert("agents", {
			...args,
			userId,
			status: "idle",
			usage: {
				todayUsd: 0,
				monthUsd: 0,
				totalUsd: 0,
				lastResetDay: new Date().toISOString().slice(0, 10),
				lastResetMonth: new Date().toISOString().slice(0, 7),
			},
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("agents"),
		name: v.optional(v.string()),
		role: v.optional(v.string()),
		model: v.optional(v.string()),
		reportsTo: v.optional(v.union(v.id("agents"), v.null())),
		budget: v.optional(
			v.object({
				maxPerMission: v.number(),
				maxPerDay: v.number(),
				maxPerMonth: v.number(),
			})
		),
		status: v.optional(v.union(v.literal("idle"), v.literal("busy"), v.literal("paused"), v.literal("error"), v.literal("disabled"))),
	},
	handler: async (ctx, { id, reportsTo, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const agent = await ctx.db.get(id)
		if (!agent || agent.userId !== userId) throw new ConvexError("Introuvable")
		// reportsTo === null means "clear". undefined means "leave unchanged".
		const patch: Record<string, unknown> = { ...fields }
		if (reportsTo !== undefined) {
			if (reportsTo === null) {
				patch.reportsTo = undefined
			} else {
				if (reportsTo === id) throw new ConvexError("Un agent ne peut pas se rapporter à lui-même")
				const manager = await ctx.db.get(reportsTo)
				if (!manager || manager.userId !== userId) throw new ConvexError("Manager introuvable")
				patch.reportsTo = reportsTo
			}
		}
		await ctx.db.patch(id, patch)
	},
})

// Migration: seed the default hierarchy (Alex root, others report to him) on
// agents that haven't been configured yet. Only touches agents whose reportsTo
// is currently undefined — user customizations are preserved. Run once after
// pulling the org-chart change; subsequent runs are safe no-ops.
export const applyDefaultHierarchy = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const agents = await ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const alex = agents.find((a) => a.slug === "assistant")
		if (!alex) return { updated: 0, message: "Alex introuvable" }

		const subordinateSlugs = new Set(["cfo", "timekeeper", "product-lead", "account-manager", "curator", "growth"])
		let updated = 0
		for (const agent of agents) {
			if (agent.slug === "assistant") continue
			if (subordinateSlugs.has(agent.slug) && agent.reportsTo === undefined) {
				await ctx.db.patch(agent._id, { reportsTo: alex._id })
				updated++
			}
		}
		return { updated, message: `${updated} agent(s) mis à jour` }
	},
})

// Insert any SEED_AGENTS slug missing from the DB without touching existing
// records. Wires reportsTo (Alex as root) for newly-inserted agents only.
// Safe to run anytime — idempotent, non-destructive.
export const ensureAgents = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const existingSlugs = new Set(existing.map((a) => a.slug))

		const insertedIds = new Map<string, Id<"agents">>()
		for (const agent of SEED_AGENTS) {
			if (existingSlugs.has(agent.slug)) continue
			const id = await ctx.db.insert("agents", {
				...agent,
				permissions: {
					safe: [...agent.permissions.safe],
					confirm: [...agent.permissions.confirm],
					blocked: [...agent.permissions.blocked],
				},
				userId,
				status: "idle" as const,
				usage: {
					todayUsd: 0,
					monthUsd: 0,
					totalUsd: 0,
					lastResetDay: new Date().toISOString().slice(0, 10),
					lastResetMonth: new Date().toISOString().slice(0, 7),
				},
			})
			insertedIds.set(agent.slug, id)
		}

		// Wire reportsTo for newly-inserted subordinates. Alex may be a
		// pre-existing record or a fresh insert — handle both.
		const alexExisting = existing.find((a) => a.slug === "assistant")
		const alexId = alexExisting?._id ?? insertedIds.get("assistant") ?? null
		if (alexId) {
			for (const [slug, id] of insertedIds) {
				if (slug === "assistant") continue
				await ctx.db.patch(id, { reportsTo: alexId })
			}
		}

		const inserted = [...insertedIds.keys()]
		return { inserted, count: inserted.length, message: inserted.length === 0 ? "Aucun agent à ajouter" : `${inserted.length} agent(s) inséré(s) : ${inserted.join(", ")}` }
	},
})

// Full reconciliation: insert missing slugs AND update existing records whose
// name / role / model / avatar / budget / permissions have drifted from
// SEED_AGENTS. Use when you change the seed const and want existing DBs to
// pick up the change. Leaves `usage`, `status`, `lastActiveAt`, `reportsTo`
// alone so user customizations and runtime state survive.
export const syncAgentsFromSeed = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const bySlug = new Map(existing.map((a) => [a.slug, a]))

		const setEq = (a: readonly string[], b: readonly string[]) => {
			if (a.length !== b.length) return false
			const setA = new Set(a)
			for (const x of b) if (!setA.has(x)) return false
			return true
		}

		const inserted: string[] = []
		const updated: string[] = []
		const insertedIds = new Map<string, Id<"agents">>()

		for (const seedAgent of SEED_AGENTS) {
			const current = bySlug.get(seedAgent.slug)
			if (!current) {
				const id = await ctx.db.insert("agents", {
					...seedAgent,
					permissions: {
						safe: [...seedAgent.permissions.safe],
						confirm: [...seedAgent.permissions.confirm],
						blocked: [...seedAgent.permissions.blocked],
					},
					userId,
					status: "idle" as const,
					usage: {
						todayUsd: 0,
						monthUsd: 0,
						totalUsd: 0,
						lastResetDay: new Date().toISOString().slice(0, 10),
						lastResetMonth: new Date().toISOString().slice(0, 7),
					},
				})
				insertedIds.set(seedAgent.slug, id)
				inserted.push(seedAgent.slug)
				continue
			}

			const patch: Record<string, unknown> = {}
			if (current.name !== seedAgent.name) patch.name = seedAgent.name
			if (current.role !== seedAgent.role) patch.role = seedAgent.role
			if (current.model !== seedAgent.model) patch.model = seedAgent.model
			if (current.avatar !== seedAgent.avatar) patch.avatar = seedAgent.avatar

			const budgetDiffers =
				current.budget.maxPerMission !== seedAgent.budget.maxPerMission || current.budget.maxPerDay !== seedAgent.budget.maxPerDay || current.budget.maxPerMonth !== seedAgent.budget.maxPerMonth
			if (budgetDiffers) patch.budget = { ...seedAgent.budget }

			const permsDiffer =
				!setEq(current.permissions.safe, seedAgent.permissions.safe) ||
				!setEq(current.permissions.confirm, seedAgent.permissions.confirm) ||
				!setEq(current.permissions.blocked, seedAgent.permissions.blocked)
			if (permsDiffer) {
				patch.permissions = {
					safe: [...seedAgent.permissions.safe],
					confirm: [...seedAgent.permissions.confirm],
					blocked: [...seedAgent.permissions.blocked],
				}
			}

			if (Object.keys(patch).length > 0) {
				await ctx.db.patch(current._id, patch)
				updated.push(seedAgent.slug)
			}
		}

		// Wire reportsTo for newly-inserted subordinates.
		const alexExisting = existing.find((a) => a.slug === "assistant")
		const alexId = alexExisting?._id ?? insertedIds.get("assistant") ?? null
		if (alexId) {
			for (const [slug, id] of insertedIds) {
				if (slug === "assistant") continue
				await ctx.db.patch(id, { reportsTo: alexId })
			}
		}

		return {
			inserted,
			updated,
			message: `${inserted.length} inséré(s), ${updated.length} mis à jour`,
		}
	},
})

export const updateStatus = mutation({
	args: {
		id: v.id("agents"),
		status: v.union(v.literal("idle"), v.literal("busy"), v.literal("paused"), v.literal("error"), v.literal("disabled")),
	},
	handler: async (ctx, { id, status }) => {
		const { userId } = await requireAuth(ctx)
		const agent = await ctx.db.get(id)
		if (!agent || agent.userId !== userId) throw new ConvexError("Introuvable")
		await ctx.db.patch(id, { status, lastActiveAt: Date.now() })
	},
})

export const addUsage = mutation({
	args: { id: v.id("agents"), costUsd: v.number() },
	handler: async (ctx, { id, costUsd }) => {
		const agent = await ctx.db.get(id)
		if (!agent) throw new ConvexError("Introuvable")

		const today = new Date().toISOString().slice(0, 10)
		const month = new Date().toISOString().slice(0, 7)

		const todayUsd = agent.usage.lastResetDay === today ? agent.usage.todayUsd + costUsd : costUsd
		const monthUsd = agent.usage.lastResetMonth === month ? agent.usage.monthUsd + costUsd : costUsd

		await ctx.db.patch(id, {
			usage: {
				todayUsd,
				monthUsd,
				totalUsd: agent.usage.totalUsd + costUsd,
				lastResetDay: today,
				lastResetMonth: month,
			},
		})
	},
})

// Internal seed — callable from CLI without auth
export const internalSeed = internalMutation({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		const existing = await ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		if (existing.length > 0) return "Already seeded"

		const insertedBySlug = new Map<string, Id<"agents">>()
		for (const agent of SEED_AGENTS) {
			const id = await ctx.db.insert("agents", {
				...agent,
				permissions: {
					safe: [...agent.permissions.safe],
					confirm: [...agent.permissions.confirm],
					blocked: [...agent.permissions.blocked],
				},
				userId,
				status: "idle" as const,
				usage: {
					todayUsd: 0,
					monthUsd: 0,
					totalUsd: 0,
					lastResetDay: new Date().toISOString().slice(0, 10),
					lastResetMonth: new Date().toISOString().slice(0, 7),
				},
			})
			insertedBySlug.set(agent.slug, id)
		}
		// Wire hierarchy: Alex (assistant) is root, everyone else reports to him.
		const alexId = insertedBySlug.get("assistant")
		if (alexId) {
			for (const [slug, id] of insertedBySlug) {
				if (slug !== "assistant") {
					await ctx.db.patch(id, { reportsTo: alexId })
				}
			}
		}
		return `Seeded ${SEED_AGENTS.length} agents`
	},
})

export const seed = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		const existing = await ctx.db
			.query("agents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		if (existing.length > 0) return

		const insertedBySlug = new Map<string, Id<"agents">>()
		for (const agent of SEED_AGENTS) {
			const id = await ctx.db.insert("agents", {
				...agent,
				permissions: {
					safe: [...agent.permissions.safe],
					confirm: [...agent.permissions.confirm],
					blocked: [...agent.permissions.blocked],
				},
				userId,
				status: "idle",
				usage: {
					todayUsd: 0,
					monthUsd: 0,
					totalUsd: 0,
					lastResetDay: new Date().toISOString().slice(0, 10),
					lastResetMonth: new Date().toISOString().slice(0, 7),
				},
			})
			insertedBySlug.set(agent.slug, id)
		}
		const alexId = insertedBySlug.get("assistant")
		if (alexId) {
			for (const [slug, id] of insertedBySlug) {
				if (slug !== "assistant") {
					await ctx.db.patch(id, { reportsTo: alexId })
				}
			}
		}
	},
})

// ── Internal (for worker, no auth) ──

export const internalGet = internalQuery({
	args: { id: v.id("agents") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})

export const internalUpdateStatus = internalMutation({
	args: { id: v.id("agents"), status: v.union(v.literal("idle"), v.literal("busy"), v.literal("paused"), v.literal("error"), v.literal("disabled")) },
	handler: async (ctx, { id, status }) => {
		await ctx.db.patch(id, { status, lastActiveAt: Date.now() })
	},
})

export const internalAddUsage = internalMutation({
	args: { id: v.id("agents"), costUsd: v.number() },
	handler: async (ctx, { id, costUsd }) => {
		const agent = await ctx.db.get(id)
		if (!agent) return

		const today = new Date().toISOString().slice(0, 10)
		const month = new Date().toISOString().slice(0, 7)

		const todayUsd = agent.usage.lastResetDay === today ? agent.usage.todayUsd + costUsd : costUsd
		const monthUsd = agent.usage.lastResetMonth === month ? agent.usage.monthUsd + costUsd : costUsd

		await ctx.db.patch(id, {
			usage: {
				todayUsd,
				monthUsd,
				totalUsd: agent.usage.totalUsd + costUsd,
				lastResetDay: today,
				lastResetMonth: month,
			},
		})
	},
})
