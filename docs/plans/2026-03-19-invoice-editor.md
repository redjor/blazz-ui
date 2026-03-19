# Invoice Editor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the single-project invoice dialog with a full-page invoice editor supporting multiple projects, custom lines, discounts, notes, and invoice types.

**Architecture:** Embedded lines array in the `invoices` Convex document. Full-page editor at `/invoices/new` and `/invoices/[id]`. Client-side state managed with `useReducer` for the lines table, persisted via a single `saveDraft` mutation.

**Tech Stack:** Convex (schema + mutations), React 19, @blazz/ui primitives, Next.js 16 routes

**Design doc:** `docs/plans/2026-03-19-invoice-editor-design.md`

---

### Task 1: Evolve the Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts:102-121`

**Step 1: Update the invoices table definition**

Add `lines`, `invoiceType`, `globalDiscount`, `notes`, `internalNotes`. Make `projectId` optional.

```ts
invoices: defineTable({
  userId: v.string(),
  projectId: v.optional(v.id("projects")),  // was required, now optional (multi-project)
  clientId: v.id("clients"),
  qontoInvoiceId: v.optional(v.string()),
  qontoNumber: v.optional(v.string()),
  label: v.string(),
  totalAmount: v.number(),  // recalculated from lines
  vatRate: v.number(),
  currency: v.union(v.literal("EUR")),
  periodStart: v.string(),
  periodEnd: v.string(),
  status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
  pdfStorageId: v.optional(v.id("_storage")),
  paidAt: v.optional(v.number()),
  createdAt: v.number(),
  // ── New fields ──
  invoiceType: v.optional(v.union(v.literal("unique"), v.literal("acompte"), v.literal("situation"))),
  lines: v.optional(v.array(v.object({
    id: v.string(),
    type: v.union(v.literal("project"), v.literal("custom")),
    projectId: v.optional(v.id("projects")),
    label: v.string(),
    quantity: v.number(),
    unitPrice: v.number(),       // cents
    discountPercent: v.optional(v.number()),
    sortOrder: v.number(),
  }))),
  globalDiscount: v.optional(v.object({
    type: v.union(v.literal("percent"), v.literal("fixed")),
    value: v.number(),
  })),
  notes: v.optional(v.string()),
  internalNotes: v.optional(v.string()),
})
  .index("by_project", ["projectId"])
  .index("by_user", ["userId"])
  .index("by_status", ["status"]),
```

All new fields are `v.optional()` so existing invoices keep working without migration.

**Step 2: Run Convex dev to validate schema**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema accepted, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): extend invoices schema with lines, types, discounts, notes"
```

---

### Task 2: Add `saveDraft` mutation and update `listAll`

**Files:**
- Modify: `apps/ops/convex/invoices.ts`

**Step 1: Add the line validator and totalAmount calculator as helpers at the top of the file**

```ts
const lineValidator = v.object({
  id: v.string(),
  type: v.union(v.literal("project"), v.literal("custom")),
  projectId: v.optional(v.id("projects")),
  label: v.string(),
  quantity: v.number(),
  unitPrice: v.number(),
  discountPercent: v.optional(v.number()),
  sortOrder: v.number(),
})

function computeTotal(
  lines: Array<{ quantity: number; unitPrice: number; discountPercent?: number }>,
  globalDiscount?: { type: "percent" | "fixed"; value: number }
): number {
  const subtotal = lines.reduce((sum, line) => {
    const lineTotal = line.quantity * line.unitPrice
    const discount = line.discountPercent ? lineTotal * (line.discountPercent / 100) : 0
    return sum + lineTotal - discount
  }, 0)

  if (!globalDiscount) return subtotal
  if (globalDiscount.type === "percent") {
    return Math.round(subtotal * (1 - globalDiscount.value / 100))
  }
  return subtotal - globalDiscount.value
}
```

**Step 2: Add the `saveDraft` mutation**

```ts
export const saveDraft = mutation({
  args: {
    id: v.optional(v.id("invoices")),
    clientId: v.id("clients"),
    invoiceType: v.union(v.literal("unique"), v.literal("acompte"), v.literal("situation")),
    label: v.string(),
    lines: v.array(lineValidator),
    vatRate: v.number(),
    globalDiscount: v.optional(v.object({
      type: v.union(v.literal("percent"), v.literal("fixed")),
      value: v.number(),
    })),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    entryIds: v.optional(v.array(v.id("timeEntries"))),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx)

    const sortedLines = [...args.lines].sort((a, b) => a.sortOrder - b.sortOrder)
    const totalAmount = computeTotal(sortedLines, args.globalDiscount ?? undefined)

    // Derive period from lines
    // For project lines we could compute from entries, but the label already captures it
    const now = new Date().toISOString().slice(0, 10)

    const data = {
      userId,
      clientId: args.clientId,
      label: args.label,
      totalAmount,
      vatRate: args.vatRate,
      currency: "EUR" as const,
      periodStart: now,
      periodEnd: now,
      status: "draft" as const,
      invoiceType: args.invoiceType,
      lines: sortedLines,
      globalDiscount: args.globalDiscount,
      notes: args.notes,
      internalNotes: args.internalNotes,
    }

    let invoiceId: typeof args.id & string

    if (args.id) {
      const existing = await ctx.db.get(args.id)
      if (!existing || existing.userId !== userId) throw new ConvexError("Introuvable")
      if (existing.status !== "draft") throw new ConvexError("Seul un brouillon peut etre modifie")
      await ctx.db.patch(args.id, data)
      invoiceId = args.id
    } else {
      invoiceId = await ctx.db.insert("invoices", {
        ...data,
        createdAt: Date.now(),
      })
    }

    // Link time entries if provided
    if (args.entryIds) {
      for (const entryId of args.entryIds) {
        const entry = await ctx.db.get(entryId)
        if (entry && entry.userId === userId) {
          await ctx.db.patch(entryId, { invoiceId })
        }
      }
    }

    return invoiceId
  },
})
```

**Step 3: Update `listAll` to include new fields**

In the existing `listAll` query, the `...invoice` spread already returns all fields including the new ones. No change needed — just verify it works.

**Step 4: Commit**

```bash
git add apps/ops/convex/invoices.ts
git commit -m "feat(ops): add saveDraft mutation with lines and global discount"
```

---

### Task 3: Update Qonto integration for multi-line invoices

**Files:**
- Modify: `apps/ops/convex/qonto.ts:91-150`

**Step 1: Update `createInvoice` to accept and send multiple items**

Replace the single-item payload with a `lines` arg:

```ts
export const createInvoice = action({
  args: {
    invoiceId: v.id("invoices"),
    qontoClientId: v.string(),
    label: v.string(),
    lines: v.array(v.object({
      label: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),       // cents
      discountPercent: v.optional(v.number()),
    })),
    vatRate: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      // Demo mode
      if (!process.env.QONTO_API_KEY) {
        const demoNumber = `F${String(Date.now()).slice(-4)}`
        await ctx.runMutation(api.invoices.markSent, {
          id: args.invoiceId,
          qontoInvoiceId: `demo_${Date.now()}`,
          qontoNumber: demoNumber,
        })
        return { success: true, qontoNumber: demoNumber }
      }

      const items = args.lines.map((line) => {
        const unitPriceEur = (line.unitPrice / 100).toFixed(2)
        return {
          title: line.label.slice(0, 40),
          description: line.label,
          quantity: String(line.quantity),
          unit_price: { value: unitPriceEur, currency: "EUR" },
          vat_rate: String(args.vatRate),
          ...(line.discountPercent ? { discount: { type: "percentage", value: String(line.discountPercent) } } : {}),
        }
      })

      const data = await qontoFetch("/client_invoices", {
        method: "POST",
        body: JSON.stringify({
          client_id: args.qontoClientId,
          currency: "EUR",
          items,
        }),
      })

      const invoice = data.client_invoice ?? data
      const qontoInvoiceId = invoice.id
      const qontoNumber = invoice.number ?? invoice.invoice_number ?? ""

      await ctx.runMutation(api.invoices.markSent, {
        id: args.invoiceId,
        qontoInvoiceId,
        qontoNumber,
      })

      return { success: true, qontoNumber }
    } catch (e) {
      await ctx.runMutation(api.invoices.deleteDraft, { id: args.invoiceId })
      throw e
    }
  },
})
```

**Step 2: Commit**

```bash
git add apps/ops/convex/qonto.ts
git commit -m "feat(ops): update Qonto integration for multi-line invoices"
```

---

### Task 4: Create the invoice editor page (routes)

**Files:**
- Create: `apps/ops/app/(main)/invoices/new/page.tsx`
- Create: `apps/ops/app/(main)/invoices/[id]/page.tsx`

**Step 1: Create `/invoices/new/page.tsx`**

```tsx
import type { Metadata } from "next"
import { InvoiceEditorClient } from "@/components/invoice-editor"

export const metadata: Metadata = {
  title: "Nouvelle facture",
}

export default function NewInvoicePage() {
  return <InvoiceEditorClient />
}
```

**Step 2: Create `/invoices/[id]/page.tsx`**

```tsx
import type { Metadata } from "next"
import { InvoiceEditorClient } from "@/components/invoice-editor"

export const metadata: Metadata = {
  title: "Facture",
}

export default async function InvoiceDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <InvoiceEditorClient invoiceId={id} />
}
```

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/invoices/new/ apps/ops/app/\(main\)/invoices/\[id\]/
git commit -m "feat(ops): add invoice editor route pages"
```

---

### Task 5: Build the invoice editor component

**Files:**
- Create: `apps/ops/components/invoice-editor.tsx`

This is the main component. It handles both create (`invoiceId` undefined) and edit (`invoiceId` provided) modes.

**Step 1: Create the component**

Structure (top to bottom):
1. **State**: `useReducer` for lines array, `useState` for header fields (client, type, label, vatRate, notes)
2. **Data fetching**: `useQuery(api.invoices.get)` if editing, `useQuery(api.clients.list)` for client select, `useQuery(api.projects.listAll)` for project picker
3. **Header section**: type select, client select, label input
4. **Lines table**: editable rows with label, qty, unit price, discount, total. Two buttons: "+ Ajouter un projet" and "+ Ajouter une ligne"
5. **Add project flow**: when clicked, shows a select of client's active projects. On select, fetches unbilled entries via `useQuery(api.timeEntries.listForRecap)`, computes amount, adds a pre-filled line
6. **Totals section**: subtotal, global discount (toggle + input), total HT, TVA, total TTC — all computed live
7. **Notes section**: two textareas
8. **Sticky footer**: Annuler (link to /invoices), Brouillon (saveDraft), Creer la facture (saveDraft + send to Qonto)

Key implementation details:

- Lines reducer actions: `ADD_PROJECT_LINE`, `ADD_CUSTOM_LINE`, `UPDATE_LINE`, `REMOVE_LINE`
- Line `id` generated via `crypto.randomUUID()` (built-in, no dependency needed)
- Read-only mode when `invoice.status !== "draft"`
- `useAppTopBar` with breadcrumb: `[{ label: "Factures", href: "/invoices" }, { label: "Nouvelle facture" }]`
- Use `@blazz/ui` layout primitives: `BlockStack`, `InlineStack`, `Grid`, `Box`, `Divider`
- Use `@blazz/ui` form primitives: `Input`, `Label`, `Select`, `Textarea`
- Table for lines: plain HTML `<table>` like existing `InvoiceSection` pattern (dense, 13px)
- Inputs inline in table cells for editable fields
- `formatCurrency` from `@/lib/format` for display
- `tabular-nums` on all amount columns

**Step 2: Wire up the "Add project" flow**

When user clicks "+ Ajouter un projet":
1. Show a Select filtered to `projects.filter(p => p.clientId === selectedClientId && p.status === "active")`
2. On select, the component must have a child query for entries: `useQuery(api.timeEntries.listForRecap, { projectId })` — but since this is conditional, use a sub-component `<AddProjectLine>` that mounts only when the select is open and a project is picked, triggering the query
3. Compute `totalHT = entries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)`
4. Dispatch `ADD_PROJECT_LINE` with pre-filled values
5. Collect `entryIds` from the entries for linking on save

**Step 3: Wire up save actions**

- **"Brouillon"**: call `saveDraft` mutation, redirect to `/invoices/[id]` on success
- **"Creer la facture"**: call `saveDraft`, then `qonto.createInvoice` with the lines, redirect to `/invoices` on success
- **"Annuler"**: `router.push("/invoices")`

**Step 4: Commit**

```bash
git add apps/ops/components/invoice-editor.tsx
git commit -m "feat(ops): add full-page invoice editor component"
```

---

### Task 6: Update invoices list page

**Files:**
- Modify: `apps/ops/app/(main)/invoices/_client.tsx`
- Delete: `apps/ops/components/new-invoice-dialog.tsx` (replaced by editor page)

**Step 1: Update the "+" button to navigate to `/invoices/new`**

In `_client.tsx`, change the `topBarActions` button from opening a dialog to navigating:

```tsx
const router = useRouter()

const topBarActions = useMemo(
  () => (
    <Button size="icon-sm" variant="ghost" onClick={() => router.push("/invoices/new")}>
      <Plus className="size-4" />
    </Button>
  ),
  [router]
)
```

**Step 2: Make invoice rows clickable to navigate to `/invoices/[id]`**

Wrap the first column (N° or label) in a `<Link href={`/invoices/${inv._id}`}>` or make the entire row clickable via `onClick={() => router.push(...)}`.

**Step 3: Remove `NewInvoiceDialog` import and usage**

Remove the `<NewInvoiceDialog>` component and its state from the page.

**Step 4: Delete `apps/ops/components/new-invoice-dialog.tsx`**

This file is superseded by the full-page editor.

**Step 5: Commit**

```bash
git add apps/ops/app/\(main\)/invoices/_client.tsx
git rm apps/ops/components/new-invoice-dialog.tsx
git commit -m "feat(ops): wire invoice list to full-page editor, remove dialog"
```

---

### Task 7: Update existing invoice creation flow in project detail

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx`

**Step 1: Update the "Facturer" button to navigate to `/invoices/new?clientId=X&projectId=Y`**

Instead of opening the `InvoicePreviewDialog`, navigate to the editor with query params pre-filled:

```tsx
<Button
  size="sm"
  variant="outline"
  onClick={() => router.push(`/invoices/new?clientId=${project.clientId}&projectId=${pid}`)}
>
  <FileText className="size-3.5 mr-1" />
  Facturer
</Button>
```

**Step 2: In invoice-editor.tsx, read query params to pre-fill**

Use `useSearchParams()` to read `clientId` and `projectId`. If present:
- Pre-select the client
- Auto-add the project as a line on mount

**Step 3: Remove `InvoicePreviewDialog` import and usage from project detail**

**Step 4: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/_client.tsx apps/ops/components/invoice-editor.tsx
git commit -m "feat(ops): wire project detail 'Facturer' to invoice editor"
```

---

### Task 8: Cleanup and final lint

**Files:**
- Delete: `apps/ops/components/invoice-preview-dialog.tsx` (if no longer used anywhere)
- Verify all files pass `pnpm biome check`

**Step 1: Check if `invoice-preview-dialog.tsx` is still imported anywhere**

Run: `grep -r "invoice-preview-dialog" apps/ops/ --include="*.tsx"`

If only used in project detail (now removed), delete it.

**Step 2: Run full lint**

Run: `pnpm biome check apps/ops/`

Fix any errors.

**Step 3: Manual test checklist**

- [ ] Navigate to `/invoices` — page loads with top bar, padding, stats
- [ ] Click `+` — navigates to `/invoices/new`
- [ ] Select client → select type → add project line → amounts auto-calculated
- [ ] Add custom line → edit label, qty, price inline
- [ ] Add per-line discount → total updates
- [ ] Add global discount → total updates
- [ ] Add notes (public + internal)
- [ ] Click "Brouillon" → saved, redirected to `/invoices/[id]`
- [ ] Invoice appears in list with status "Brouillon"
- [ ] Click on invoice in list → opens editor in edit mode
- [ ] Click "Creer la facture" → saved + sent (demo mode), status changes to "Envoyee"
- [ ] Sent invoice opens in read-only mode
- [ ] From project detail, click "Facturer" → opens editor pre-filled with that project

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore(ops): cleanup old invoice dialog, final lint fixes"
```
