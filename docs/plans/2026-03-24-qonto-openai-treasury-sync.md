# Qonto + OpenAI Treasury Sync — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Sync Qonto transactions and use OpenAI to detect/categorize recurring expenses, with review UI in the treasury page.

**Architecture:** Convex action fetches 3 months of Qonto debit transactions, sends them to OpenAI gpt-4o-mini for recurring expense detection + categorization, stores suggestions in `syncSuggestions` table. User reviews and accepts/rejects each suggestion from the treasury page.

**Tech Stack:** Convex actions, OpenAI API (structured output), @blazz/ui components

---

### Task 1: Install openai package

**Files:**
- Modify: `apps/ops/package.json`

**Step 1: Install dependency**

Run: `cd apps/ops && pnpm add openai`

OpenAI SDK is needed in Convex actions (the existing `@ai-sdk/openai` is for Vercel AI SDK in Next.js API routes, not usable in Convex).

**Step 2: Commit**

```bash
git add apps/ops/package.json apps/ops/pnpm-lock.yaml
git commit -m "chore(ops): add openai package for Convex actions"
```

---

### Task 2: Add `syncSuggestions` table to schema

**Files:**
- Modify: `apps/ops/convex/schema.ts` (after `treasurySettings` table, ~line 380)

**Step 1: Add table definition**

Add after the `treasurySettings` table definition:

```ts
syncSuggestions: defineTable({
	userId: v.string(),
	source: v.literal("qonto"),
	syncedAt: v.number(),
	name: v.string(),
	amountCents: v.number(),
	frequency: v.union(
		v.literal("monthly"),
		v.literal("quarterly"),
		v.literal("yearly")
	),
	category: v.string(),
	confidence: v.number(),
	transactionIds: v.array(v.string()),
	transactionLabels: v.array(v.string()),
	status: v.union(
		v.literal("pending"),
		v.literal("accepted"),
		v.literal("rejected")
	),
})
	.index("by_user_status", ["userId", "status"])
	.index("by_user_synced", ["userId", "syncedAt"]),
```

**Step 2: Verify Convex accepts schema**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully, no validation errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add syncSuggestions table to schema"
```

---

### Task 3: Create `syncSuggestions.ts` — queries + mutations

**Files:**
- Create: `apps/ops/convex/syncSuggestions.ts`

**Step 1: Write the file**

```ts
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { api } from "./_generated/api"
import { requireAuth } from "./lib/auth"

/** List pending suggestions for the current user */
export const listPending = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const suggestions = await ctx.db
			.query("syncSuggestions")
			.withIndex("by_user_status", (q) =>
				q.eq("userId", userId).eq("status", "pending")
			)
			.collect()
		return suggestions.sort((a, b) => b.confidence - a.confidence)
	},
})

/** Accept a suggestion → create recurringExpense + mark accepted */
export const accept = mutation({
	args: { id: v.id("syncSuggestions") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const suggestion = await ctx.db.get(id)
		if (!suggestion || suggestion.userId !== userId) {
			throw new Error("Not found")
		}
		if (suggestion.status !== "pending") {
			throw new Error("Already processed")
		}

		// Create the recurring expense
		await ctx.db.insert("recurringExpenses", {
			userId,
			name: suggestion.name,
			amountCents: suggestion.amountCents,
			amountType: "fixed" as const,
			frequency: suggestion.frequency,
			startDate: new Date().toISOString().slice(0, 10),
			active: true,
			notes: `Importé depuis Qonto (${suggestion.category})`,
			createdAt: Date.now(),
		})

		// Mark suggestion as accepted
		await ctx.db.patch(id, { status: "accepted" as const })
	},
})

/** Reject a suggestion */
export const reject = mutation({
	args: { id: v.id("syncSuggestions") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const suggestion = await ctx.db.get(id)
		if (!suggestion || suggestion.userId !== userId) {
			throw new Error("Not found")
		}
		if (suggestion.status !== "pending") {
			throw new Error("Already processed")
		}
		await ctx.db.patch(id, { status: "rejected" as const })
	},
})

/** Accept all pending suggestions at once */
export const acceptAll = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const pending = await ctx.db
			.query("syncSuggestions")
			.withIndex("by_user_status", (q) =>
				q.eq("userId", userId).eq("status", "pending")
			)
			.collect()

		for (const suggestion of pending) {
			await ctx.db.insert("recurringExpenses", {
				userId,
				name: suggestion.name,
				amountCents: suggestion.amountCents,
				amountType: "fixed" as const,
				frequency: suggestion.frequency,
				startDate: new Date().toISOString().slice(0, 10),
				active: true,
				notes: `Importé depuis Qonto (${suggestion.category})`,
				createdAt: Date.now(),
			})
			await ctx.db.patch(suggestion._id, { status: "accepted" as const })
		}

		return { accepted: pending.length }
	},
})

/** Reject all pending suggestions at once */
export const rejectAll = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const pending = await ctx.db
			.query("syncSuggestions")
			.withIndex("by_user_status", (q) =>
				q.eq("userId", userId).eq("status", "pending")
			)
			.collect()

		for (const suggestion of pending) {
			await ctx.db.patch(suggestion._id, { status: "rejected" as const })
		}

		return { rejected: pending.length }
	},
})
```

**Step 2: Verify types compile**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/syncSuggestions.ts
git commit -m "feat(ops): add syncSuggestions queries and mutations"
```

---

### Task 4: Add `analyzeRecurring` action to `qonto.ts`

**Files:**
- Modify: `apps/ops/convex/qonto.ts`

**Step 1: Add the action**

Add at the end of `apps/ops/convex/qonto.ts`:

```ts
import OpenAI from "openai"

/** Fetch 3 months of debit transactions and use OpenAI to detect recurring expenses */
export const analyzeRecurring = action({
	args: { bankAccountSlug: v.string() },
	handler: async (ctx, { bankAccountSlug }) => {
		const openaiKey = process.env.OPENAI_API_KEY
		if (!openaiKey) throw new Error("OPENAI_API_KEY not configured")

		// 1. Fetch 3 months of transactions (paginated)
		const threeMonthsAgo = new Date()
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
		const fromDate = threeMonthsAgo.toISOString().slice(0, 10)
		const toDate = new Date().toISOString().slice(0, 10)

		const allTransactions: Array<{
			id: string
			label: string
			amountCents: number
			settledAt: string
			side: string
		}> = []

		let currentPage = 1
		let hasMore = true

		while (hasMore) {
			const data = await qontoFetch(
				`/transactions?slug=${bankAccountSlug}` +
				`&settled_at_from=${fromDate}T00:00:00.000Z` +
				`&settled_at_to=${toDate}T23:59:59.999Z` +
				`&sort_by=settled_at:desc&per_page=100&current_page=${currentPage}`
			)

			const transactions = data.transactions ?? []
			for (const t of transactions) {
				if ((t.side as string) === "debit") {
					allTransactions.push({
						id: t.id as string,
						label: t.label as string,
						amountCents: t.amount_cents as number,
						settledAt: t.settled_at as string,
					})
				}
			}

			// Qonto pagination: check if there are more pages
			const meta = data.meta
			if (meta && meta.next_page) {
				currentPage = meta.next_page as number
			} else {
				hasMore = false
			}
		}

		if (allTransactions.length === 0) {
			return { count: 0, syncedAt: Date.now() }
		}

		// 2. Load existing recurring expenses to exclude duplicates
		const existingExpenses = await ctx.runQuery(
			api.recurringExpenses.list,
			{}
		)
		const existingNames = existingExpenses.map((e: { name: string }) => e.name)

		// 3. Call OpenAI
		const openai = new OpenAI({ apiKey: openaiKey })

		const response = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			response_format: { type: "json_object" },
			messages: [
				{
					role: "system",
					content: `Tu es un analyste financier. Analyse les transactions bancaires ci-dessous et détecte les dépenses récurrentes.

Règles :
- Une dépense est récurrente si elle apparaît au moins 2 fois avec un label similaire et un montant proche.
- Ignore les transactions déjà enregistrées : ${JSON.stringify(existingNames)}
- Catégorise chaque dépense (exemples : SaaS, Assurance, Charges sociales, Loyer, Comptabilité, Télécom, Hébergement, Abonnement, Banque, Autre).
- Pour le montant, utilise la moyenne des transactions matchées (en centimes).
- Détermine la fréquence : monthly, quarterly, ou yearly.
- Donne un score de confiance entre 0 et 1.

Réponds UNIQUEMENT en JSON avec ce format :
{
  "suggestions": [
    {
      "name": "Nom normalisé de la dépense",
      "amountCents": 1999,
      "frequency": "monthly",
      "category": "SaaS",
      "confidence": 0.95,
      "matchedTransactionIds": ["id1", "id2", "id3"],
      "matchedLabels": ["LABEL ORIGINAL 1", "LABEL ORIGINAL 2"]
    }
  ]
}`,
				},
				{
					role: "user",
					content: JSON.stringify(
						allTransactions.map((t) => ({
							id: t.id,
							label: t.label,
							amount_cents: t.amountCents,
							settled_at: t.settledAt,
						}))
					),
				},
			],
		})

		const content = response.choices[0]?.message?.content
		if (!content) throw new Error("OpenAI returned empty response")

		const parsed = JSON.parse(content) as {
			suggestions: Array<{
				name: string
				amountCents: number
				frequency: "monthly" | "quarterly" | "yearly"
				category: string
				confidence: number
				matchedTransactionIds: string[]
				matchedLabels: string[]
			}>
		}

		// 4. Insert suggestions into syncSuggestions
		const syncedAt = Date.now()
		const { userId } = await requireAuth(ctx)

		for (const s of parsed.suggestions) {
			await ctx.runMutation(api.syncSuggestions.insertFromAction, {
				userId,
				source: "qonto" as const,
				syncedAt,
				name: s.name,
				amountCents: Math.round(s.amountCents),
				frequency: s.frequency,
				category: s.category,
				confidence: s.confidence,
				transactionIds: s.matchedTransactionIds,
				transactionLabels: s.matchedLabels,
				status: "pending" as const,
			})
		}

		return { count: parsed.suggestions.length, syncedAt }
	},
})
```

Also add the import for `requireAuth` at the top of `qonto.ts`:

```ts
import { requireAuth } from "./lib/auth"
```

**Step 2: Add the internal `insertFromAction` mutation to `syncSuggestions.ts`**

Actions cannot write to the DB directly — they call mutations. Add this to `syncSuggestions.ts`:

```ts
/** Internal mutation called by qonto.analyzeRecurring action */
export const insertFromAction = mutation({
	args: {
		userId: v.string(),
		source: v.literal("qonto"),
		syncedAt: v.number(),
		name: v.string(),
		amountCents: v.number(),
		frequency: v.union(v.literal("monthly"), v.literal("quarterly"), v.literal("yearly")),
		category: v.string(),
		confidence: v.number(),
		transactionIds: v.array(v.string()),
		transactionLabels: v.array(v.string()),
		status: v.literal("pending"),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("syncSuggestions", args)
	},
})
```

**Step 3: Verify compilation**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors.

**Step 4: Commit**

```bash
git add apps/ops/convex/qonto.ts apps/ops/convex/syncSuggestions.ts
git commit -m "feat(ops): add Qonto analyzeRecurring action with OpenAI detection"
```

---

### Task 5: Create `_suggestions-section.tsx` component

**Files:**
- Create: `apps/ops/app/(main)/treasury/_suggestions-section.tsx`

**Step 1: Write the component**

Reference `_client.tsx` for patterns (imports, hooks, Blazz UI usage). Use:
- `BlockStack`, `InlineStack` for layout (NEVER raw divs for layout)
- `Card`, `CardHeader`, `CardTitle`, `CardContent` for container
- `Button` with ghost variant for accept/reject actions
- `formatCurrency` from `@/lib/format`
- `useMutation`, `useQuery` from `convex/react`
- `Check`, `X` icons from `lucide-react`
- Toast after accept via `toast` from `sonner`

```tsx
"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@blazz/ui/components/ui/tooltip"
import { useMutation, useQuery } from "convex/react"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { formatCurrency } from "@/lib/format"

const FREQ_LABELS: Record<string, string> = {
	monthly: "/mois",
	quarterly: "/trim",
	yearly: "/an",
}

export function SuggestionsSection() {
	const suggestions = useQuery(api.syncSuggestions.listPending)
	const acceptSuggestion = useMutation(api.syncSuggestions.accept)
	const rejectSuggestion = useMutation(api.syncSuggestions.reject)
	const acceptAllMutation = useMutation(api.syncSuggestions.acceptAll)
	const rejectAllMutation = useMutation(api.syncSuggestions.rejectAll)

	if (!suggestions || suggestions.length === 0) return null

	async function handleAccept(id: Id<"syncSuggestions">, name: string) {
		await acceptSuggestion({ id })
		toast.success(`${name} ajouté aux dépenses récurrentes`)
	}

	async function handleReject(id: Id<"syncSuggestions">) {
		await rejectSuggestion({ id })
	}

	async function handleAcceptAll() {
		const result = await acceptAllMutation()
		toast.success(`${result.accepted} dépenses ajoutées`)
	}

	async function handleRejectAll() {
		await rejectAllMutation()
		toast.success("Suggestions rejetées")
	}

	return (
		<Card>
			<CardHeader>
				<InlineStack align="space-between" blockAlign="center">
					<BlockStack gap="050">
						<CardTitle className="text-sm font-medium">
							Suggestions Qonto
						</CardTitle>
						<span className="text-xs text-fg-muted">
							{suggestions.length} dépense{suggestions.length > 1 ? "s" : ""} détectée{suggestions.length > 1 ? "s" : ""}
						</span>
					</BlockStack>
					<InlineStack gap="200">
						<Button variant="outline" size="sm" onClick={handleAcceptAll}>
							Tout accepter ({suggestions.length})
						</Button>
						<Button variant="ghost" size="sm" onClick={handleRejectAll}>
							Tout rejeter
						</Button>
					</InlineStack>
				</InlineStack>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y divide-separator">
					{suggestions.map((s) => (
						<div
							key={s._id}
							className={`flex items-center justify-between px-inset py-3 ${
								s.confidence < 0.7 ? "opacity-60" : ""
							}`}
						>
							<div className="flex flex-col gap-0.5 min-w-0 flex-1">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="text-sm font-medium text-fg truncate cursor-default">
												{s.name}
											</span>
										</TooltipTrigger>
										<TooltipContent side="bottom" align="start">
											<BlockStack gap="050">
												<span className="text-xs font-medium">Transactions source :</span>
												{s.transactionLabels.map((label, i) => (
													<span key={i} className="text-xs text-fg-muted">
														{label}
													</span>
												))}
											</BlockStack>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<InlineStack gap="200">
									<span className="text-xs text-fg-muted">{s.category}</span>
									<span className="text-xs text-fg-muted">
										· {s.transactionIds.length} transaction{s.transactionIds.length > 1 ? "s" : ""}
									</span>
								</InlineStack>
							</div>
							<InlineStack gap="200" blockAlign="center">
								<span className="text-sm font-medium tabular-nums text-fg">
									{formatCurrency(s.amountCents / 100)}
									{FREQ_LABELS[s.frequency]}
								</span>
								<span className="text-xs text-fg-muted tabular-nums w-8 text-right">
									{Math.round(s.confidence * 100)}%
								</span>
								<InlineStack gap="050">
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => handleAccept(s._id, s.name)}
										title="Accepter"
									>
										<Check className="size-3.5 text-positive" />
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => handleReject(s._id)}
										title="Rejeter"
									>
										<X className="size-3.5 text-fg-muted" />
									</Button>
								</InlineStack>
							</InlineStack>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
```

**Step 2: Verify it compiles**

Run: `cd apps/ops && npx next build --no-lint 2>&1 | tail -5` (or just check IDE errors)

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/treasury/_suggestions-section.tsx
git commit -m "feat(ops): add suggestions section component for treasury"
```

---

### Task 6: Wire sync button + suggestions into treasury page

**Files:**
- Modify: `apps/ops/app/(main)/treasury/_client.tsx`

**Step 1: Add imports**

Add at the top of `_client.tsx`:

```ts
import { useAction } from "convex/react"
import { toast } from "sonner"
import { SuggestionsSection } from "./_suggestions-section"
```

**Step 2: Add sync state and handler**

Inside `TreasuryPageClient`, add:

```ts
const analyzeRecurring = useAction(api.qonto.analyzeRecurring)
const [syncing, setSyncing] = useState(false)

async function handleSync() {
	setSyncing(true)
	try {
		// Get the bank account slug from org
		const org = await getOrganization({})
		const mainAccount = org.bankAccounts[0]
		if (!mainAccount) {
			toast.error("Aucun compte bancaire trouvé sur Qonto")
			return
		}
		const result = await analyzeRecurring({ bankAccountSlug: mainAccount.slug })
		if (result.count > 0) {
			toast.success(`${result.count} dépense${result.count > 1 ? "s" : ""} récurrente${result.count > 1 ? "s" : ""} détectée${result.count > 1 ? "s" : ""}`)
		} else {
			toast.info("Aucune nouvelle dépense récurrente détectée")
		}
	} catch (err) {
		toast.error(err instanceof Error ? err.message : "Erreur lors du sync Qonto")
	} finally {
		setSyncing(false)
	}
}
```

Also add the `getOrganization` action:

```ts
const getOrganization = useAction(api.qonto.getOrganization)
```

**Step 3: Add sync button to PageHeader actions**

Replace the `actions` prop of `PageHeader`:

```tsx
actions={
	<InlineStack gap="200">
		<Button variant="outline" onClick={handleSync} loading={syncing}>
			Sync Qonto
		</Button>
		<Button variant="outline" onClick={() => setSettingsOpen(true)}>
			Paramètres
		</Button>
		<Button onClick={handleNew}>
			<Plus className="size-4 mr-1" />
			Dépense
		</Button>
	</InlineStack>
}
```

**Step 4: Add SuggestionsSection after StatsGrid**

Insert `<SuggestionsSection />` between the `<StatsGrid>` and the cashflow chart:

```tsx
{/* Stats */}
<StatsGrid ... />

{/* Qonto suggestions */}
<SuggestionsSection />

{/* Cashflow Chart */}
{forecast.months.length > 0 && <CashflowChart months={forecast.months} />}
```

**Step 5: Verify the page renders**

Run: `pnpm dev:ops` and navigate to `/treasury`
Expected: Page renders with "Sync Qonto" button. Suggestions section hidden (no pending suggestions yet).

**Step 6: Commit**

```bash
git add apps/ops/app/\(main\)/treasury/_client.tsx
git commit -m "feat(ops): wire Qonto sync button and suggestions into treasury page"
```

---

### Task 7: Add OPENAI_API_KEY to Convex environment

**Files:**
- No code changes. Convex env config.

**Step 1: Set the env variable on Convex**

Run: `cd apps/ops && npx convex env set OPENAI_API_KEY <your-key>`

Note: The OPENAI_API_KEY is already in `.env.example`. The Convex action reads it from `process.env.OPENAI_API_KEY` which needs to be set in the Convex dashboard or via CLI.

**Step 2: Verify**

Run: `cd apps/ops && npx convex env list | grep OPENAI`
Expected: Shows `OPENAI_API_KEY` is set.

---

### Task 8: End-to-end manual test

**Step 1: Start the app**

Run: `pnpm dev:ops`

**Step 2: Navigate to /treasury**

**Step 3: Click "Sync Qonto"**

Expected flow:
1. Button shows loading spinner
2. After a few seconds, toast shows "X dépenses récurrentes détectées"
3. Suggestions section appears between StatsGrid and cashflow chart
4. Each suggestion shows: name, category, transaction count, amount/freq, confidence %
5. Low confidence (<70%) suggestions are visually dimmed

**Step 4: Test accept/reject**

- Click ✓ on a suggestion → toast "X ajouté aux dépenses récurrentes", suggestion disappears, appears in recurring expenses list below
- Click ✗ on a suggestion → suggestion disappears
- Click "Tout accepter" → all remaining suggestions accepted

**Step 5: Verify no duplicates**

Click "Sync Qonto" again → OpenAI should not re-suggest expenses that were just accepted (their names are excluded).
