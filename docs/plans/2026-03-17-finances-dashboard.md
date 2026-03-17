# Finances Dashboard — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enrichir la page Finances avec les 10 dernières transactions Qonto et un prévisionnel CA basé sur les données Convex (time entries non facturées + factures en attente).

**Architecture:** 3 sections verticales sur une seule page : StatsGrid (4 cards), DataTable transactions Qonto, détails comptes bancaires (existant). Le backend ajoute une action Convex pour fetcher les transactions Qonto et une query pour agréger le prévisionnel.

**Tech Stack:** Convex (action + query), Qonto API v2 `/transactions`, @blazz/ui + @blazz/pro components, React 19

---

### Task 1: Action Convex `qonto:listTransactions`

**Files:**
- Modify: `apps/ops/convex/qonto.ts`

**Step 1: Add the `listTransactions` action**

Append after `listClients` action in `apps/ops/convex/qonto.ts`:

```ts
/** Fetch the 10 most recent transactions from the main bank account */
export const listTransactions = action({
	args: { bankAccountSlug: v.string() },
	handler: async (_ctx, { bankAccountSlug }) => {
		const data = await qontoFetch(
			`/transactions?slug=${bankAccountSlug}&sort_by=settled_at:desc&per_page=10`
		)
		return (data.transactions ?? []).map((t: Record<string, unknown>) => ({
			id: t.id as string,
			amount: t.amount as number,
			amountCents: t.amount_cents as number,
			currency: t.currency as string,
			side: t.side as string, // "credit" | "debit"
			label: t.label as string,
			settledAt: t.settled_at as string,
			status: t.status as string,
		}))
	},
})
```

**Step 2: Verify Convex picks it up**

Run: `pnpm dev:ops` — check no type errors in terminal.

**Step 3: Commit**

```bash
git add apps/ops/convex/qonto.ts
git commit -m "feat(ops): add listTransactions Qonto action"
```

---

### Task 2: Query Convex `finances:forecast`

**Files:**
- Create: `apps/ops/convex/finances.ts`

**Step 1: Create the forecast query**

```ts
import { query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

/** Aggregate unbilled time entries + unpaid invoices for forecast */
export const forecast = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		// Unbilled: billable time entries without invoicedAt
		const allEntries = await ctx.db
			.query("timeEntries")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const unbilled = allEntries.filter((e) => e.billable && !e.invoicedAt)
		const unbilledCents = unbilled.reduce(
			(sum, e) => sum + Math.round((e.minutes / 60) * e.hourlyRate * 100),
			0
		)

		// Unpaid invoices: status "sent" (sent but not paid)
		const allInvoices = await ctx.db
			.query("invoices")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const unpaid = allInvoices.filter((i) => i.status === "sent")
		const unpaidCents = unpaid.reduce((sum, i) => sum + i.totalAmount, 0)

		return {
			unbilledCents,
			unbilledCount: unbilled.length,
			unpaidCents,
			unpaidCount: unpaid.length,
			totalCents: unbilledCents + unpaidCents,
		}
	},
})
```

**Step 2: Verify Convex picks it up**

Check terminal — `finances.ts` should auto-register.

**Step 3: Commit**

```bash
git add apps/ops/convex/finances.ts
git commit -m "feat(ops): add finances forecast query"
```

---

### Task 3: Refactor `_client.tsx` — StatsGrid avec prévisionnel

**Files:**
- Modify: `apps/ops/app/(main)/finances/_client.tsx`

**Step 1: Update StatsGrid from 3 to 4 cards**

Add `useQuery` import from `convex/react` (alongside existing `useAction`).
Import `api` for the new forecast query.
Add forecast data fetch:

```ts
const forecast = useQuery(api.finances.forecast)
```

Replace the StatsGrid `stats` array with 4 items:

```tsx
<StatsGrid
	columns={4}
	loading={loading || forecast === undefined}
	stats={[
		{
			label: "Solde Qonto",
			value: mainAccount ? formatAmount(mainAccount.balance, mainAccount.currency) : "—",
			icon: Banknote,
		},
		{
			label: "Non facturé",
			value: forecast ? formatAmount(forecast.unbilledCents / 100) : "—",
			description: forecast ? `${forecast.unbilledCount} entrées` : undefined,
			icon: Clock,
		},
		{
			label: "En attente",
			value: forecast ? formatAmount(forecast.unpaidCents / 100) : "—",
			description: forecast ? `${forecast.unpaidCount} factures` : undefined,
			icon: FileText,
		},
		{
			label: "Total à encaisser",
			value: forecast ? formatAmount(forecast.totalCents / 100) : "—",
			icon: TrendingUp,
		},
	]}
/>
```

Add imports: `Clock, FileText, TrendingUp` from `lucide-react`, `useQuery` from `convex/react`.

**Step 2: Verify the page renders with 4 stats**

Open `http://localhost:3120/finances` — 4 cards should display.

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/finances/_client.tsx
git commit -m "feat(ops): add forecast stats to finances page"
```

---

### Task 4: Transactions table

**Files:**
- Modify: `apps/ops/app/(main)/finances/_client.tsx`

**Step 1: Add transactions fetch**

After `fetchData`, add a second action call for transactions:

```ts
const listTransactions = useAction(api.qonto.listTransactions)
const [transactions, setTransactions] = useState<Transaction[]>([])

// Inside fetchData, after setOrg(data):
if (data.bankAccounts.length > 0) {
	const txns = await listTransactions({ bankAccountSlug: data.bankAccounts[0].slug })
	setTransactions(txns)
}
```

Add `Transaction` interface:

```ts
interface Transaction {
	id: string
	amount: number
	amountCents: number
	currency: string
	side: string
	label: string
	settledAt: string
	status: string
}
```

**Step 2: Add the transactions section between StatsGrid and bank accounts**

Simple table using Card + native `<table>`:

```tsx
{!loading && transactions.length > 0 && (
	<BlockStack gap="400">
		<h2 className="text-sm font-medium text-fg-muted">
			Dernières transactions
		</h2>
		<Card>
			<div className="divide-y divide-separator">
				{transactions.map((tx) => (
					<div key={tx.id} className="flex items-center justify-between px-inset py-3">
						<div className="flex flex-col gap-0.5">
							<span className="text-sm text-fg">{tx.label || "—"}</span>
							<span className="text-xs text-fg-muted">
								{new Date(tx.settledAt).toLocaleDateString("fr-FR")}
							</span>
						</div>
						<span
							className={`text-sm font-medium tabular-nums ${
								tx.side === "credit" ? "text-success" : "text-danger"
							}`}
						>
							{tx.side === "credit" ? "+" : "−"}
							{formatAmount(tx.amount, tx.currency)}
						</span>
					</div>
				))}
			</div>
		</Card>
	</BlockStack>
)}
```

**Step 3: Verify**

Open `http://localhost:3120/finances` — transactions should appear below stats.

**Step 4: Commit**

```bash
git add apps/ops/app/(main)/finances/_client.tsx
git commit -m "feat(ops): add last 10 transactions to finances page"
```
