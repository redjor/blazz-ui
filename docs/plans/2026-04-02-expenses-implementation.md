# Frais Professionnels — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an `/expenses` page to Blazz Ops for tracking restaurant receipts and vehicle mileage with URSSAF reimbursement calculation.

**Architecture:** Single Convex table `expenses` discriminated by `type` (restaurant|mileage), plus `vehicleSettings` table. New page at `/expenses` with stats cards, filtered list (Card-based like treasury), and dialog forms. Barème URSSAF calculated server-side in mutations.

**Tech Stack:** Convex (schema + queries/mutations), React 19, react-hook-form, @blazz/ui + @blazz/pro components, Tailwind v4, lucide-react icons.

---

### Task 1: Convex Schema — Add `expenses` and `vehicleSettings` tables

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add both tables to the schema**

Add before the closing `})` of `defineSchema`, after the `providerConfigs` table:

```typescript
// ── Frais professionnels ──────────────────────────────────────────
expenses: defineTable({
	userId: v.string(),
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
	reimbursementCents: v.optional(v.number()),
	createdAt: v.number(),
})
	.index("by_user", ["userId"])
	.index("by_user_date", ["userId", "date"])
	.index("by_user_type", ["userId", "type"]),

vehicleSettings: defineTable({
	userId: v.string(),
	fiscalPower: v.number(),
	vehicleType: v.union(v.literal("car"), v.literal("motorcycle")),
})
	.index("by_user", ["userId"]),
```

**Step 2: Push schema to Convex**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema deployed successfully, new tables visible.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add expenses and vehicleSettings tables to schema"
```

---

### Task 2: Convex — URSSAF barème helper + expenses CRUD

**Files:**
- Create: `apps/ops/convex/lib/urssaf.ts`
- Create: `apps/ops/convex/expenses.ts`

**Step 1: Create the URSSAF barème helper**

Create `apps/ops/convex/lib/urssaf.ts`:

```typescript
/**
 * Barème kilométrique URSSAF 2025 — voitures.
 * Chaque entrée: [coeffLow, coeffMid, flatMid, coeffHigh]
 *   - ≤ 5000 km: d × coeffLow
 *   - 5001–20000 km: (d × coeffMid) + flatMid
 *   - > 20000 km: d × coeffHigh
 */
const BAREME_VOITURE: Record<number, [number, number, number, number]> = {
	3: [0.529, 0.316, 1065, 0.370],
	4: [0.606, 0.340, 1330, 0.407],
	5: [0.636, 0.357, 1395, 0.427],
	6: [0.665, 0.374, 1457, 0.447],
	7: [0.697, 0.394, 1515, 0.470],
}

/**
 * Calcule l'indemnité kilométrique URSSAF pour un trajet donné,
 * en tenant compte du cumul annuel.
 *
 * @param distanceKm - Distance du trajet
 * @param annualKmBefore - Cumul km annuel AVANT ce trajet
 * @param fiscalPower - Puissance fiscale (3-7, 7+ = 7)
 * @returns Indemnité en centimes
 */
export function computeMileageReimbursement(
	distanceKm: number,
	annualKmBefore: number,
	fiscalPower: number
): number {
	const cv = Math.min(Math.max(fiscalPower, 3), 7)
	const [coeffLow, coeffMid, flatMid, coeffHigh] = BAREME_VOITURE[cv]

	const totalAfter = annualKmBefore + distanceKm

	// Full distance falls in one bracket
	if (totalAfter <= 5000) {
		return Math.round(distanceKm * coeffLow * 100)
	}
	if (annualKmBefore >= 20000) {
		return Math.round(distanceKm * coeffHigh * 100)
	}

	// The URSSAF formula applies to total annual distance, not per-trip.
	// We compute the total annual reimbursement before and after, then diff.
	function annualReimbursement(km: number): number {
		if (km <= 0) return 0
		if (km <= 5000) return km * coeffLow
		if (km <= 20000) return km * coeffMid + flatMid
		return km * coeffHigh
	}

	const reimbBefore = annualReimbursement(annualKmBefore)
	const reimbAfter = annualReimbursement(totalAfter)

	return Math.round((reimbAfter - reimbBefore) * 100)
}
```

**Step 2: Create expenses CRUD file**

Create `apps/ops/convex/expenses.ts`:

```typescript
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"
import { computeMileageReimbursement } from "./lib/urssaf"

// ── Queries ──

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
				clientName: e.clientId ? clientMap.get(e.clientId) : undefined,
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

// ── Helpers ──

/** Get total mileage km for a year, excluding a specific expense ID */
async function getAnnualKm(
	ctx: any,
	userId: string,
	year: number,
	excludeId?: string
): Promise<number> {
	const from = `${year}-01-01`
	const to = `${year}-12-31`
	const entries = await ctx.db
		.query("expenses")
		.withIndex("by_user_type", (q: any) => q.eq("userId", userId).eq("type", "mileage"))
		.collect()
	return entries
		.filter((e: any) => e.date >= from && e.date <= to && (!excludeId || e._id !== excludeId))
		.reduce((sum: number, e: any) => sum + (e.distanceKm ?? 0), 0)
}

async function getVehicleSettings(ctx: any, userId: string) {
	return ctx.db
		.query("vehicleSettings")
		.withIndex("by_user", (q: any) => q.eq("userId", userId))
		.unique()
}

/** Recalculate reimbursement for all mileage entries in a given year */
async function recalculateYear(ctx: any, userId: string, year: number) {
	const from = `${year}-01-01`
	const to = `${year}-12-31`
	const vehicle = await getVehicleSettings(ctx, userId)
	if (!vehicle) return

	const entries = await ctx.db
		.query("expenses")
		.withIndex("by_user_type", (q: any) => q.eq("userId", userId).eq("type", "mileage"))
		.collect()

	const yearEntries = entries
		.filter((e: any) => e.date >= from && e.date <= to)
		.sort((a: any, b: any) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)

	let cumulKm = 0
	for (const entry of yearEntries) {
		const km = entry.distanceKm ?? 0
		const reimbursementCents = computeMileageReimbursement(km, cumulKm, vehicle.fiscalPower)
		if (entry.reimbursementCents !== reimbursementCents) {
			await ctx.db.patch(entry._id, { reimbursementCents })
		}
		cumulKm += km
	}
}

// ── Mutations ──

export const create = mutation({
	args: {
		type: v.union(v.literal("restaurant"), v.literal("mileage")),
		date: v.string(),
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
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)

		// Validate client/project ownership
		if (args.clientId) {
			const client = await ctx.db.get(args.clientId)
			if (!client || client.userId !== userId) throw new ConvexError("Client introuvable")
		}
		if (args.projectId) {
			const project = await ctx.db.get(args.projectId)
			if (!project || project.userId !== userId) throw new ConvexError("Projet introuvable")
		}

		let reimbursementCents: number | undefined
		if (args.type === "mileage" && args.distanceKm) {
			const vehicle = await getVehicleSettings(ctx, userId)
			if (vehicle) {
				const year = Number.parseInt(args.date.slice(0, 4), 10)
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

		// Recalculate all mileage for the year (order matters for brackets)
		if (args.type === "mileage") {
			const year = Number.parseInt(args.date.slice(0, 4), 10)
			await recalculateYear(ctx, userId, year)
		}

		return id
	},
})

export const update = mutation({
	args: {
		id: v.id("expenses"),
		date: v.string(),
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
		const entry = await ctx.db.get(id)
		if (!entry || entry.userId !== userId) throw new ConvexError("Frais introuvable")

		if (fields.clientId) {
			const client = await ctx.db.get(fields.clientId)
			if (!client || client.userId !== userId) throw new ConvexError("Client introuvable")
		}
		if (fields.projectId) {
			const project = await ctx.db.get(fields.projectId)
			if (!project || project.userId !== userId) throw new ConvexError("Projet introuvable")
		}

		await ctx.db.patch(id, fields)

		// Recalculate mileage for affected year(s)
		if (entry.type === "mileage") {
			const oldYear = Number.parseInt(entry.date.slice(0, 4), 10)
			const newYear = Number.parseInt(fields.date.slice(0, 4), 10)
			await recalculateYear(ctx, userId, newYear)
			if (oldYear !== newYear) {
				await recalculateYear(ctx, userId, oldYear)
			}
		}
	},
})

export const remove = mutation({
	args: { id: v.id("expenses") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const entry = await ctx.db.get(id)
		if (!entry || entry.userId !== userId) throw new ConvexError("Frais introuvable")

		const isMileage = entry.type === "mileage"
		const year = Number.parseInt(entry.date.slice(0, 4), 10)

		await ctx.db.delete(id)

		// Recalculate remaining mileage entries
		if (isMileage) {
			await recalculateYear(ctx, userId, year)
		}
	},
})
```

**Step 3: Commit**

```bash
git add apps/ops/convex/lib/urssaf.ts apps/ops/convex/expenses.ts
git commit -m "feat(ops): add expenses CRUD with URSSAF mileage calculation"
```

---

### Task 3: Convex — Vehicle settings CRUD

**Files:**
- Create: `apps/ops/convex/vehicleSettings.ts`

**Step 1: Create vehicle settings file**

Create `apps/ops/convex/vehicleSettings.ts`:

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const get = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("vehicleSettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()
	},
})

export const save = mutation({
	args: {
		fiscalPower: v.number(),
		vehicleType: v.union(v.literal("car"), v.literal("motorcycle")),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("vehicleSettings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, args)
			return existing._id
		}
		return ctx.db.insert("vehicleSettings", { ...args, userId })
	},
})
```

**Step 2: Commit**

```bash
git add apps/ops/convex/vehicleSettings.ts
git commit -m "feat(ops): add vehicle settings CRUD"
```

---

### Task 4: Feature flag + Navigation

**Files:**
- Modify: `apps/ops/lib/features.ts`
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add feature flag**

In `apps/ops/lib/features.ts`, add `expenses: true` to the `defaults` object (after `treasury`), and add the route mapping `"/expenses": "expenses"` to `routeMap`.

**Step 2: Add nav item**

In `apps/ops/components/ops-frame.tsx`:

1. Add `Wallet` (or `ReceiptText`) to the lucide-react imports.
2. In the "Finances" group of `allNavGroups`, add after "Trésorerie":
```typescript
{ title: "Frais pro", url: "/expenses", icon: ReceiptText, flag: "expenses" },
```

**Step 3: Commit**

```bash
git add apps/ops/lib/features.ts apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add expenses feature flag and nav item"
```

---

### Task 5: Expense dialog component

**Files:**
- Create: `apps/ops/app/(main)/expenses/_expense-dialog.tsx`

**Step 1: Create the dialog**

Create `apps/ops/app/(main)/expenses/_expense-dialog.tsx`. Follow the same pattern as `treasury/_expense-dialog.tsx`:

```typescript
"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { Controller, useForm } from "react-hook-form"
import { useEffect, useMemo } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { computeMileageReimbursement } from "@/convex/lib/urssaf"

type ExpenseType = "restaurant" | "mileage"

interface ExpenseFormValues {
	date: string
	amountCents: string
	clientId: string
	projectId: string
	notes: string
	// Restaurant
	guests: string
	purpose: string
	// Mileage
	departure: string
	destination: string
	distanceKm: string
}

interface ExpenseDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	type: ExpenseType
	expense?: {
		_id: Id<"expenses">
		type: ExpenseType
		date: string
		amountCents?: number
		clientId?: Id<"clients">
		projectId?: Id<"projects">
		notes?: string
		guests?: string
		purpose?: string
		departure?: string
		destination?: string
		distanceKm?: number
		reimbursementCents?: number
	} | null
}

export function ExpenseDialog({ open, onOpenChange, type, expense }: ExpenseDialogProps) {
	const create = useMutation(api.expenses.create)
	const update = useMutation(api.expenses.update)
	const clients = useQuery(api.clients.list)
	const vehicleSettings = useQuery(api.vehicleSettings.get)

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { isSubmitting },
	} = useForm<ExpenseFormValues>({
		defaultValues: {
			date: expense?.date ?? new Date().toISOString().slice(0, 10),
			amountCents: expense?.amountCents ? String(expense.amountCents / 100) : "",
			clientId: expense?.clientId ?? "",
			projectId: expense?.projectId ?? "",
			notes: expense?.notes ?? "",
			guests: expense?.guests ?? "",
			purpose: expense?.purpose ?? "",
			departure: expense?.departure ?? "",
			destination: expense?.destination ?? "",
			distanceKm: expense?.distanceKm ? String(expense.distanceKm) : "",
		},
	})

	// Reset form when expense/type changes
	useEffect(() => {
		reset({
			date: expense?.date ?? new Date().toISOString().slice(0, 10),
			amountCents: expense?.amountCents ? String(expense.amountCents / 100) : "",
			clientId: expense?.clientId ?? "",
			projectId: expense?.projectId ?? "",
			notes: expense?.notes ?? "",
			guests: expense?.guests ?? "",
			purpose: expense?.purpose ?? "",
			departure: expense?.departure ?? "",
			destination: expense?.destination ?? "",
			distanceKm: expense?.distanceKm ? String(expense.distanceKm) : "",
		})
	}, [expense, type, reset])

	const selectedClientId = watch("clientId")
	const distanceKmStr = watch("distanceKm")

	// Filter projects by selected client
	const projects = useQuery(
		api.projects.list,
		selectedClientId ? { clientId: selectedClientId as Id<"clients"> } : "skip"
	)

	// Compute preview reimbursement for mileage
	const reimbursementPreview = useMemo(() => {
		if (type !== "mileage" || !distanceKmStr || !vehicleSettings) return null
		const km = Number(distanceKmStr)
		if (km <= 0 || Number.isNaN(km)) return null
		// Approximate with 0 annual km (real calc is server-side)
		const cents = computeMileageReimbursement(km, 0, vehicleSettings.fiscalPower)
		return (cents / 100).toFixed(2)
	}, [type, distanceKmStr, vehicleSettings])

	const clientItems = useMemo(
		() => [{ value: "", label: "Aucun" }, ...(clients?.map((c) => ({ value: c._id, label: c.name })) ?? [])],
		[clients]
	)

	const projectItems = useMemo(
		() => [{ value: "", label: "Aucun" }, ...(projects?.map((p) => ({ value: p._id, label: p.name })) ?? [])],
		[projects]
	)

	async function onSubmit(data: ExpenseFormValues) {
		const base = {
			date: data.date,
			clientId: data.clientId ? (data.clientId as Id<"clients">) : undefined,
			projectId: data.projectId ? (data.projectId as Id<"projects">) : undefined,
			notes: data.notes || undefined,
		}

		if (expense) {
			await update({
				id: expense._id,
				...base,
				...(type === "restaurant"
					? {
							amountCents: Math.round(Number(data.amountCents) * 100),
							guests: data.guests || undefined,
							purpose: data.purpose || undefined,
						}
					: {
							departure: data.departure || undefined,
							destination: data.destination || undefined,
							distanceKm: Number(data.distanceKm),
						}),
			})
		} else {
			await create({
				type,
				...base,
				...(type === "restaurant"
					? {
							amountCents: Math.round(Number(data.amountCents) * 100),
							guests: data.guests || undefined,
							purpose: data.purpose || undefined,
						}
					: {
							departure: data.departure || undefined,
							destination: data.destination || undefined,
							distanceKm: Number(data.distanceKm),
						}),
			})
		}

		reset()
		onOpenChange(false)
	}

	const isRestaurant = type === "restaurant"

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>
							{expense ? "Modifier" : "Nouveau"} {isRestaurant ? "restaurant" : "déplacement"}
						</DialogTitle>
					</DialogHeader>

					<BlockStack gap="400" className="py-4">
						{/* Date */}
						<BlockStack gap="200">
							<Label htmlFor="exp-date">Date</Label>
							<Input id="exp-date" type="date" {...register("date", { required: true })} />
						</BlockStack>

						{isRestaurant ? (
							<>
								{/* Amount */}
								<BlockStack gap="200">
									<Label htmlFor="exp-amount">Montant TTC (€)</Label>
									<Input id="exp-amount" type="number" step="0.01" placeholder="ex: 45.50" {...register("amountCents", { required: true })} />
								</BlockStack>

								{/* Guests */}
								<BlockStack gap="200">
									<Label htmlFor="exp-guests">Convive(s)</Label>
									<Input id="exp-guests" placeholder="ex: Jean Dupont, Marie Martin" {...register("guests")} />
								</BlockStack>

								{/* Purpose */}
								<BlockStack gap="200">
									<Label htmlFor="exp-purpose">Motif</Label>
									<Input id="exp-purpose" placeholder="ex: Déjeuner prospection" {...register("purpose")} />
								</BlockStack>
							</>
						) : (
							<>
								{/* Departure / Destination */}
								<div className="grid grid-cols-2 gap-4">
									<BlockStack gap="200">
										<Label htmlFor="exp-departure">Départ</Label>
										<Input id="exp-departure" placeholder="ex: Paris, bureau" {...register("departure", { required: true })} />
									</BlockStack>
									<BlockStack gap="200">
										<Label htmlFor="exp-destination">Destination</Label>
										<Input id="exp-destination" placeholder="ex: Lyon, client" {...register("destination", { required: true })} />
									</BlockStack>
								</div>

								{/* Distance */}
								<div className="grid grid-cols-2 gap-4">
									<BlockStack gap="200">
										<Label htmlFor="exp-km">Distance (km)</Label>
										<Input id="exp-km" type="number" step="1" placeholder="ex: 450" {...register("distanceKm", { required: true })} />
									</BlockStack>
									<BlockStack gap="200">
										<Label>Indemnité estimée</Label>
										<div className="flex items-center h-9 px-3 rounded-md border border-edge bg-muted text-sm text-fg-muted tabular-nums">
											{reimbursementPreview ? `${reimbursementPreview} €` : "—"}
										</div>
									</BlockStack>
								</div>
							</>
						)}

						{/* Client */}
						<BlockStack gap="200">
							<Label>Client</Label>
							<Controller
								control={control}
								name="clientId"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange} items={clientItems}>
										<SelectTrigger>
											<SelectValue placeholder="Aucun" />
										</SelectTrigger>
										<SelectContent>
											{clientItems.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</BlockStack>

						{/* Project (filtered by client) */}
						{selectedClientId && (
							<BlockStack gap="200">
								<Label>Projet</Label>
								<Controller
									control={control}
									name="projectId"
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange} items={projectItems}>
											<SelectTrigger>
												<SelectValue placeholder="Aucun" />
											</SelectTrigger>
											<SelectContent>
												{projectItems.map((item) => (
													<SelectItem key={item.value} value={item.value}>
														{item.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							</BlockStack>
						)}

						{/* Notes */}
						<BlockStack gap="200">
							<Label htmlFor="exp-notes">Notes</Label>
							<Textarea id="exp-notes" placeholder="Détails..." rows={2} {...register("notes")} />
						</BlockStack>
					</BlockStack>

					<DialogFooter>
						<Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{expense ? "Enregistrer" : "Ajouter"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
```

**Notes:**
- The `computeMileageReimbursement` import is used for a preview only (approximation with 0 annual km). The real calculation happens server-side in the mutation.
- Check if `api.projects.list` accepts `{ clientId }` — if not, filter client-side.
- The `items` prop on `<Select>` is critical (Base UI rule from MEMORY).

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/expenses/_expense-dialog.tsx
git commit -m "feat(ops): add expense dialog with restaurant/mileage forms"
```

---

### Task 6: Expenses page

**Files:**
- Create: `apps/ops/app/(main)/expenses/page.tsx`
- Create: `apps/ops/app/(main)/expenses/_client.tsx`

**Step 1: Create the server page**

Create `apps/ops/app/(main)/expenses/page.tsx`:

```typescript
import type { Metadata } from "next"
import ExpensesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Frais professionnels",
}

export default function ExpensesPage() {
	return <ExpensesPageClient />
}
```

**Step 2: Create the client page**

Create `apps/ops/app/(main)/expenses/_client.tsx`. Follow the treasury page pattern:

```typescript
"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Car, ChevronLeft, ChevronRight, MapPin, MoreHorizontal, Plus, ReceiptText, Trash2, Edit2, Utensils } from "lucide-react"
import { useMemo, useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency } from "@/lib/format"
import { ExpenseDialog } from "./_expense-dialog"

type ExpenseType = "restaurant" | "mileage"
type TypeFilter = "all" | ExpenseType

export default function ExpensesPageClient() {
	const [month, setMonth] = useState(() => new Date())
	const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogType, setDialogType] = useState<ExpenseType>("restaurant")
	const [editingExpense, setEditingExpense] = useState<any>(null)
	const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: Id<"expenses"> | null }>({ open: false, id: null })

	const from = format(startOfMonth(month), "yyyy-MM-dd")
	const to = format(endOfMonth(month), "yyyy-MM-dd")

	const expenses = useQuery(api.expenses.list, {
		type: typeFilter === "all" ? undefined : typeFilter,
		from,
		to,
	})
	const stats = useQuery(api.expenses.stats, { from, to })
	const removeExpense = useMutation(api.expenses.remove)

	useAppTopBar([{ label: "Frais pro" }])

	function handleNew(type: ExpenseType) {
		setDialogType(type)
		setEditingExpense(null)
		setDialogOpen(true)
	}

	function handleEdit(expense: any) {
		setDialogType(expense.type)
		setEditingExpense(expense)
		setDialogOpen(true)
	}

	async function handleDelete() {
		if (!deleteConfirm.id) return
		await removeExpense({ id: deleteConfirm.id })
		setDeleteConfirm({ open: false, id: null })
	}

	const monthLabel = format(month, "MMMM yyyy", { locale: fr })

	const filterItems = [
		{ value: "all", label: "Tous" },
		{ value: "restaurant", label: "Restaurants" },
		{ value: "mileage", label: "Déplacements" },
	]

	// Loading
	if (expenses === undefined || stats === undefined) {
		return (
			<BlockStack gap="600" className="p-4">
				<PageHeader title="Frais professionnels" />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-4">
			<PageHeader
				title="Frais professionnels"
				actions={
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button />}>
							<Plus className="size-4 mr-1" />
							Ajouter
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleNew("restaurant")}>
								<Utensils className="size-4 mr-2" />
								Restaurant
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleNew("mileage")}>
								<Car className="size-4 mr-2" />
								Déplacement
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				}
				bottom={
					<InlineStack gap="300" blockAlign="center">
						{/* Month navigation */}
						<InlineStack gap="100" blockAlign="center">
							<Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => subMonths(m, 1))}>
								<ChevronLeft className="size-4" />
							</Button>
							<span className="text-sm font-medium capitalize w-32 text-center">{monthLabel}</span>
							<Button variant="ghost" size="icon-sm" onClick={() => setMonth((m) => addMonths(m, 1))}>
								<ChevronRight className="size-4" />
							</Button>
						</InlineStack>

						{/* Type filter */}
						<Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)} items={filterItems}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{filterItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</InlineStack>
				}
			/>

			{/* Stats */}
			<StatsGrid
				columns={3}
				stats={[
					{
						label: "Restaurants",
						value: formatCurrency(stats.totalRestaurantCents / 100),
						description: `${stats.restaurantCount} repas`,
						icon: Utensils,
					},
					{
						label: "Kilomètres",
						value: `${stats.totalKm.toLocaleString("fr-FR")} km`,
						description: `${stats.mileageCount} trajets`,
						icon: MapPin,
					},
					{
						label: "Indemnités km",
						value: formatCurrency(stats.totalReimbursementCents / 100),
						description: "Barème URSSAF 2025",
						icon: Car,
					},
				]}
			/>

			{/* List */}
			{expenses.length === 0 ? (
				<Card>
					<CardContent className="py-10 text-center">
						<BlockStack gap="200" className="items-center">
							<ReceiptText className="size-10 text-fg-muted" />
							<span className="text-sm text-fg-muted">Aucun frais ce mois</span>
						</BlockStack>
					</CardContent>
				</Card>
			) : (
				<Card>
					<div className="divide-y divide-separator">
						{expenses.map((expense) => (
							<div
								key={expense._id}
								className="flex items-center justify-between px-inset py-3 cursor-pointer hover:bg-muted/50 transition-colors"
								onClick={() => handleEdit(expense)}
							>
								<div className="flex flex-col gap-0.5 min-w-0 flex-1">
									<InlineStack gap="200" blockAlign="center">
										<Badge variant={expense.type === "restaurant" ? "default" : "secondary"}>
											{expense.type === "restaurant" ? "Restaurant" : "Déplacement"}
										</Badge>
										<span className="text-sm text-fg-muted">{format(new Date(expense.date), "dd MMM", { locale: fr })}</span>
									</InlineStack>
									<span className="text-sm text-fg truncate">
										{expense.type === "restaurant"
											? [expense.guests, expense.purpose].filter(Boolean).join(" — ") || "—"
											: `${expense.departure ?? "?"} → ${expense.destination ?? "?"}`}
									</span>
									{expense.clientName && (
										<span className="text-xs text-fg-muted">{expense.clientName}</span>
									)}
								</div>
								<InlineStack gap="200" blockAlign="center">
									<span className="text-sm font-medium tabular-nums text-fg">
										{expense.type === "restaurant"
											? formatCurrency((expense.amountCents ?? 0) / 100)
											: `${expense.distanceKm ?? 0} km — ${formatCurrency((expense.reimbursementCents ?? 0) / 100)}`}
									</span>
									<DropdownMenu>
										<DropdownMenuTrigger
											render={<Button variant="ghost" size="icon-sm" />}
											onClick={(e: React.MouseEvent) => e.stopPropagation()}
										>
											<MoreHorizontal className="size-3.5" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(expense) }}>
												<Edit2 className="size-3.5 mr-2" />
												Modifier
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-destructive"
												onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ open: true, id: expense._id }) }}
											>
												<Trash2 className="size-3.5 mr-2" />
												Supprimer
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</InlineStack>
							</div>
						))}
					</div>
				</Card>
			)}

			{/* Dialogs */}
			<ExpenseDialog
				open={dialogOpen}
				onOpenChange={(open) => {
					setDialogOpen(open)
					if (!open) setEditingExpense(null)
				}}
				type={dialogType}
				expense={editingExpense}
			/>

			<ConfirmationDialog
				open={deleteConfirm.open}
				onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
				title="Supprimer ce frais ?"
				description="Cette action est irréversible."
				confirmLabel="Supprimer"
				cancelLabel="Annuler"
				variant="destructive"
				onConfirm={handleDelete}
			/>
		</BlockStack>
	)
}
```

**Notes:**
- Uses Card with `divide-y` for the list (same as treasury), not DataTable — simpler and consistent.
- Month navigation with chevrons and capitalized month name.
- `DropdownMenuTrigger` uses `render` prop (Base UI rule).
- `formatCurrency` imported from `@/lib/format` (existing utility).

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/expenses/
git commit -m "feat(ops): add expenses page with stats, list, and filters"
```

---

### Task 7: Vehicle settings in Settings page

**Files:**
- Modify: `apps/ops/app/(main)/settings/_general-client.tsx`

**Step 1: Add vehicle settings section**

Add a new `SettingsSection` for "Véhicule" in the settings page. Use the existing `Item` / `ItemContent` / `ItemActions` pattern with two `Select` components for fiscal power and vehicle type.

Import `useQuery`/`useMutation` for `api.vehicleSettings.get` and `api.vehicleSettings.save`.

Add after the "Bookmarks" section:

```tsx
<SettingsSection title="Véhicule" description="Configuration pour le calcul des indemnités kilométriques URSSAF.">
	<Item>
		<ItemContent>
			<ItemTitle>Puissance fiscale</ItemTitle>
			<ItemDescription>Puissance fiscale de votre véhicule (en CV).</ItemDescription>
		</ItemContent>
		<ItemActions>
			<Select
				value={vehicleSettings?.fiscalPower?.toString() ?? "5"}
				onValueChange={(v) => handleVehicleSave({ fiscalPower: Number(v) })}
				items={fiscalPowerItems}
			>
				<SelectTrigger className="w-24">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{fiscalPowerItems.map((item) => (
						<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
					))}
				</SelectContent>
			</Select>
		</ItemActions>
	</Item>
	<Item>
		<ItemContent>
			<ItemTitle>Type de véhicule</ItemTitle>
			<ItemDescription>Voiture ou moto (barème différent).</ItemDescription>
		</ItemContent>
		<ItemActions>
			<Select
				value={vehicleSettings?.vehicleType ?? "car"}
				onValueChange={(v) => handleVehicleSave({ vehicleType: v as "car" | "motorcycle" })}
				items={vehicleTypeItems}
			>
				<SelectTrigger className="w-32">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{vehicleTypeItems.map((item) => (
						<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
					))}
				</SelectContent>
			</Select>
		</ItemActions>
	</Item>
</SettingsSection>
```

With the supporting code at the top of the component:

```tsx
const vehicleSettings = useQuery(api.vehicleSettings.get)
const saveVehicle = useMutation(api.vehicleSettings.save)

const fiscalPowerItems = [
	{ value: "3", label: "3 CV" },
	{ value: "4", label: "4 CV" },
	{ value: "5", label: "5 CV" },
	{ value: "6", label: "6 CV" },
	{ value: "7", label: "7 CV+" },
]

const vehicleTypeItems = [
	{ value: "car", label: "Voiture" },
	{ value: "motorcycle", label: "Moto" },
]

async function handleVehicleSave(partial: { fiscalPower?: number; vehicleType?: "car" | "motorcycle" }) {
	try {
		await saveVehicle({
			fiscalPower: partial.fiscalPower ?? vehicleSettings?.fiscalPower ?? 5,
			vehicleType: partial.vehicleType ?? vehicleSettings?.vehicleType ?? "car",
		})
		toast.success("Véhicule mis à jour")
	} catch {
		toast.error("Erreur")
	}
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/settings/_general-client.tsx
git commit -m "feat(ops): add vehicle settings for URSSAF mileage calculation"
```

---

### Task 8: Verify & push schema

**Step 1: Push Convex schema**

Run: `cd apps/ops && npx convex dev --once`
Expected: All tables deployed.

**Step 2: Run build**

Run: `pnpm build --filter=ops`
Expected: Build succeeds with no type errors.

**Step 3: Run lint**

Run: `pnpm lint`
Expected: No lint errors.

**Step 4: Manual smoke test**

Run: `pnpm dev:ops`

Verify:
1. "Frais pro" appears in sidebar under Finances
2. `/expenses` page loads with empty state
3. Click "Ajouter > Restaurant" → dialog opens, fill fields, submit → entry appears
4. Click "Ajouter > Déplacement" → dialog opens, fill fields, indemnité preview shows, submit → entry with km + indemnité
5. Settings > Véhicule section shows, can change fiscal power
6. Month navigation and type filter work
7. Edit (click row) and delete (... menu) work

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat(ops): expenses feature complete — frais pro page with URSSAF mileage"
```
