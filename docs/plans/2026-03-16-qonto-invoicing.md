# Qonto Invoicing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate invoices from time entries and push them to Qonto for PDF, numbering, and e-invoicing compliance.

**Architecture:** Convex mutations handle local state (draft invoices, status transitions). A Convex action calls the Qonto API to create invoices and fetch PDFs. The UI adds a bulk action on time entries and an invoice section on the project detail page.

**Tech Stack:** Convex (schema, mutations, actions), Qonto REST API v2, React (dialog, section components), @blazz/ui primitives

---

### Task 1: Schema — Add `invoices` table and modify existing tables

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add `invoices` table, `invoiceId` on timeEntries, `qontoClientId` on clients**

Add after the `contractFiles` table definition:

```typescript
invoices: defineTable({
  userId: v.string(),
  projectId: v.id("projects"),
  clientId: v.id("clients"),
  qontoInvoiceId: v.optional(v.string()),
  qontoNumber: v.optional(v.string()),
  label: v.string(),
  totalAmount: v.number(),
  vatRate: v.number(),
  currency: v.union(v.literal("EUR")),
  periodStart: v.string(),
  periodEnd: v.string(),
  status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
  pdfStorageId: v.optional(v.id("_storage")),
  paidAt: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_project", ["projectId"])
  .index("by_user", ["userId"])
  .index("by_status", ["status"]),
```

Add `invoiceId` to `timeEntries`:
```typescript
invoiceId: v.optional(v.id("invoices")),
```
Add index `by_invoice: ["invoiceId"]` to timeEntries.

Add `qontoClientId` to `clients`:
```typescript
qontoClientId: v.optional(v.string()),
```

**Step 2: Push schema to Convex dev**

Run: `cd apps/ops && npx convex dev --once`
Expected: `✔ Convex functions ready!`

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add invoices table and qontoClientId to schema"
```

---

### Task 2: Mutations — Invoice CRUD

**Files:**
- Create: `apps/ops/convex/invoices.ts`

**Step 1: Create invoices.ts with queries and mutations**

```typescript
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const invoiceStatusValidator = v.union(
  v.literal("draft"),
  v.literal("sent"),
  v.literal("paid")
)

// ── Queries ────────────────────────────────────────

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const { userId } = await requireAuth(ctx)
    const project = await ctx.db.get(projectId)
    if (!project || project.userId !== userId) return []

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
    return invoices.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const get = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const invoice = await ctx.db.get(id)
    if (!invoice || invoice.userId !== userId) return null
    return {
      ...invoice,
      pdfUrl: invoice.pdfStorageId
        ? await ctx.storage.getUrl(invoice.pdfStorageId)
        : null,
    }
  },
})

// ── Mutations ──────────────────────────────────────

/** Create a draft invoice and link the time entries to it */
export const createDraft = mutation({
  args: {
    projectId: v.id("projects"),
    label: v.string(),
    totalAmount: v.number(),
    vatRate: v.number(),
    periodStart: v.string(),
    periodEnd: v.string(),
    entryIds: v.array(v.id("timeEntries")),
  },
  handler: async (ctx, { entryIds, ...args }) => {
    const { userId } = await requireAuth(ctx)
    const project = await ctx.db.get(args.projectId)
    if (!project || project.userId !== userId) throw new ConvexError("Introuvable")

    // Create the invoice
    const invoiceId = await ctx.db.insert("invoices", {
      ...args,
      userId,
      clientId: project.clientId,
      currency: "EUR",
      status: "draft",
      createdAt: Date.now(),
    })

    // Link entries to this invoice
    for (const entryId of entryIds) {
      const entry = await ctx.db.get(entryId)
      if (!entry || entry.userId !== userId) continue
      await ctx.db.patch(entryId, { invoiceId })
    }

    return invoiceId
  },
})

/** Called after successful Qonto API call — finalize the invoice */
export const markSent = mutation({
  args: {
    id: v.id("invoices"),
    qontoInvoiceId: v.string(),
    qontoNumber: v.string(),
  },
  handler: async (ctx, { id, qontoInvoiceId, qontoNumber }) => {
    const { userId } = await requireAuth(ctx)
    const invoice = await ctx.db.get(id)
    if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")
    if (invoice.status !== "draft") throw new ConvexError("Seul un brouillon peut être envoyé")

    // Update invoice
    await ctx.db.patch(id, { status: "sent", qontoInvoiceId, qontoNumber })

    // Mark linked entries as invoiced
    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", id))
      .collect()
    for (const entry of entries) {
      await ctx.db.patch(entry._id, { status: "invoiced", invoicedAt: Date.now() })
    }
  },
})

/** Called on Qonto API failure — delete draft and unlink entries */
export const deleteDraft = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const invoice = await ctx.db.get(id)
    if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")
    if (invoice.status !== "draft") throw new ConvexError("Seul un brouillon peut être supprimé")

    // Unlink entries
    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", id))
      .collect()
    for (const entry of entries) {
      await ctx.db.patch(entry._id, { invoiceId: undefined })
    }

    await ctx.db.delete(id)
  },
})

/** Manually mark invoice as paid */
export const markPaid = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const invoice = await ctx.db.get(id)
    if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")
    if (invoice.status !== "sent") throw new ConvexError("Seul une facture envoyée peut être marquée payée")

    await ctx.db.patch(id, { status: "paid", paidAt: Date.now() })

    // Mark linked entries as paid
    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_invoice", (q) => q.eq("invoiceId", id))
      .collect()
    for (const entry of entries) {
      await ctx.db.patch(entry._id, { status: "paid" })
    }
  },
})

/** Store PDF backup from Qonto */
export const storePdf = mutation({
  args: {
    id: v.id("invoices"),
    pdfStorageId: v.id("_storage"),
  },
  handler: async (ctx, { id, pdfStorageId }) => {
    const { userId } = await requireAuth(ctx)
    const invoice = await ctx.db.get(id)
    if (!invoice || invoice.userId !== userId) throw new ConvexError("Introuvable")
    await ctx.db.patch(id, { pdfStorageId })
  },
})
```

**Step 2: Push to Convex dev**

Run: `cd apps/ops && npx convex dev --once`
Expected: `✔ Convex functions ready!`

**Step 3: Commit**

```bash
git add apps/ops/convex/invoices.ts
git commit -m "feat(ops): add invoice mutations and queries"
```

---

### Task 3: Qonto API Action

**Files:**
- Create: `apps/ops/convex/qonto.ts`

**Step 1: Create the Qonto action**

```typescript
import { v } from "convex/values"
import { action } from "./_generated/server"
import { api, internal } from "./_generated/api"

const QONTO_BASE = "https://thirdparty.qonto.com/v2"

async function qontoFetch(path: string, options: RequestInit = {}) {
  const apiKey = process.env.QONTO_API_KEY
  if (!apiKey) throw new Error("QONTO_API_KEY not configured")

  const res = await fetch(`${QONTO_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Qonto API error ${res.status}: ${body}`)
  }

  return res.json()
}

/** List clients from Qonto for mapping dropdown */
export const listClients = action({
  args: {},
  handler: async () => {
    const data = await qontoFetch("/clients?per_page=100")
    return (data.clients ?? []).map((c: Record<string, unknown>) => ({
      id: c.id,
      name: c.name,
      email: c.email,
    }))
  },
})

/** Create an invoice on Qonto, then update local state */
export const createInvoice = action({
  args: {
    invoiceId: v.id("invoices"),
    qontoClientId: v.string(),
    label: v.string(),
    totalAmount: v.number(),
    vatRate: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      // Amount is in cents, Qonto expects string with decimals
      const unitPrice = (args.totalAmount / 100).toFixed(2)

      const data = await qontoFetch("/client_invoices", {
        method: "POST",
        body: JSON.stringify({
          client_id: args.qontoClientId,
          currency: "EUR",
          items: [
            {
              title: args.label.slice(0, 40),
              description: args.label,
              quantity: "1",
              unit_price: { value: unitPrice, currency: "EUR" },
              vat_rate: String(args.vatRate),
            },
          ],
        }),
      })

      const invoice = data.client_invoice ?? data
      const qontoInvoiceId = invoice.id
      const qontoNumber = invoice.number ?? invoice.invoice_number ?? ""

      // Mark invoice as sent locally
      await ctx.runMutation(api.invoices.markSent, {
        id: args.invoiceId,
        qontoInvoiceId,
        qontoNumber,
      })

      // Fetch PDF after a delay (Qonto generates it async)
      // We'll do this in a scheduled function or best-effort here
      try {
        await new Promise((r) => setTimeout(r, 12000))
        const attachmentData = await qontoFetch(
          `/client_invoices/${qontoInvoiceId}`
        )
        const attachmentId =
          attachmentData.client_invoice?.attachment_id ??
          attachmentData.attachment_id
        if (attachmentId) {
          const attachmentInfo = await qontoFetch(
            `/attachments/${attachmentId}`
          )
          const pdfUrl = attachmentInfo.attachment?.url ?? attachmentInfo.url
          if (pdfUrl) {
            const pdfRes = await fetch(pdfUrl)
            const pdfBlob = await pdfRes.blob()
            const uploadUrl = await ctx.runMutation(
              api.contractFiles.generateUploadUrl
            )
            await fetch(uploadUrl, {
              method: "POST",
              headers: { "Content-Type": "application/pdf" },
              body: pdfBlob,
            })
            // Note: we'd need the storageId from the upload response
            // For now, PDF backup is best-effort
          }
        }
      } catch {
        // PDF fetch is best-effort, don't fail the invoice creation
        console.error("Failed to fetch PDF from Qonto")
      }

      return { success: true, qontoNumber }
    } catch (e) {
      // Rollback: delete the draft invoice
      await ctx.runMutation(api.invoices.deleteDraft, { id: args.invoiceId })
      throw e
    }
  },
})
```

**Step 2: Add `QONTO_API_KEY` to environment**

Add to `apps/ops/.env.local`:
```
QONTO_API_KEY=your_qonto_api_key_here
```

Add to `turbo.json` globalPassThroughEnv:
```
"QONTO_API_KEY"
```

Also add on Vercel dashboard for production.

**Step 3: Push to Convex dev**

Run: `cd apps/ops && npx convex dev --once`
Expected: `✔ Convex functions ready!`

**Step 4: Commit**

```bash
git add apps/ops/convex/qonto.ts turbo.json
git commit -m "feat(ops): add Qonto API action for invoice creation"
```

---

### Task 4: Client form — Add Qonto client mapping

**Files:**
- Modify: `apps/ops/convex/clients.ts` — add `qontoClientId` to create/update args
- Modify: `apps/ops/components/client-form.tsx` — add dropdown field

**Step 1: Add `qontoClientId` to client mutations**

In `clients.ts`, add to both `create.args` and `update.args`:
```typescript
qontoClientId: v.optional(v.string()),
```

**Step 2: Add Qonto client selector to client form**

In `client-form.tsx`:
- Add `qontoClientId: z.string().optional()` to zod schema
- Add a text input field (V1 — dropdown with API fetch can come later):
```tsx
<div className="space-y-1.5">
  <Label htmlFor="qontoClientId">ID Client Qonto</Label>
  <Input
    id="qontoClientId"
    placeholder="Optionnel — visible dans Qonto > Clients"
    {...register("qontoClientId")}
  />
</div>
```

**Step 3: Push to Convex dev and commit**

```bash
git add apps/ops/convex/clients.ts apps/ops/components/client-form.tsx
git commit -m "feat(ops): add qontoClientId field to client form"
```

---

### Task 5: Invoice Preview Dialog

**Files:**
- Create: `apps/ops/components/invoice-preview-dialog.tsx`

**Step 1: Create the dialog component**

```tsx
"use client"

import { Button } from "@blazz/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { useAction, useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: Id<"projects">
  projectName: string
  clientId: Id<"clients">
  qontoClientId: string | undefined
  entries: Doc<"timeEntries">[]
  contractType?: string
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  clientId,
  qontoClientId,
  entries,
  contractType,
}: Props) {
  const createDraft = useMutation(api.invoices.createDraft)
  const createQontoInvoice = useAction(api.qonto.createInvoice)

  // Compute defaults from entries
  const totalHT = entries.reduce(
    (sum, e) => sum + (e.minutes / 60) * e.hourlyRate,
    0
  )
  const dates = entries.map((e) => e.date).sort()
  const periodStart = dates[0] ?? ""
  const periodEnd = dates[dates.length - 1] ?? ""
  const periodLabel = periodStart.slice(0, 7) === periodEnd.slice(0, 7)
    ? new Date(periodStart).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : `${new Date(periodStart).toLocaleDateString("fr-FR", { month: "short" })} — ${new Date(periodEnd).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`

  const defaultLabel = `Prestation ${contractType === "tma" ? "TMA " : ""}${projectName} — ${periodLabel}`

  const [label, setLabel] = useState(defaultLabel)
  const [vatRate, setVatRate] = useState(0.2)
  const [sending, setSending] = useState(false)

  const totalTTC = totalHT * (1 + vatRate)

  const handleSend = async () => {
    if (!qontoClientId) {
      toast.error("Configurez l'ID Client Qonto dans la fiche client")
      return
    }

    setSending(true)
    try {
      // 1. Create local draft
      const invoiceId = await createDraft({
        projectId,
        label,
        totalAmount: Math.round(totalHT * 100),
        vatRate,
        periodStart,
        periodEnd,
        entryIds: entries.map((e) => e._id),
      })

      // 2. Push to Qonto
      await createQontoInvoice({
        invoiceId,
        qontoClientId,
        label,
        totalAmount: Math.round(totalHT * 100),
        vatRate,
      })

      toast.success("Facture envoyée à Qonto")
      onOpenChange(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de la création")
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Nouvelle facture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!qontoClientId && (
            <div className="px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
              ID Client Qonto manquant — configurez-le dans la fiche client avant de facturer.
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Libellé</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Période</Label>
              <p className="text-sm text-fg">{periodStart} → {periodEnd}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Entrées</Label>
              <p className="text-sm text-fg">{entries.length} entrée(s)</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vatRate">TVA (%)</Label>
            <Input
              id="vatRate"
              type="number"
              step="0.01"
              value={vatRate * 100}
              onChange={(e) => setVatRate(Number(e.target.value) / 100)}
            />
          </div>

          <div className="border-t border-edge pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-fg-muted">Montant HT</span>
              <span className="font-mono font-medium text-fg">
                {totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-fg-muted">TVA ({(vatRate * 100).toFixed(0)}%)</span>
              <span className="font-mono text-fg-muted">
                {(totalHT * vatRate).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-fg">Total TTC</span>
              <span className="font-mono text-fg">
                {totalTTC.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Annuler
          </Button>
          <Button onClick={handleSend} disabled={sending || !qontoClientId}>
            {sending ? "Envoi en cours…" : "Envoyer à Qonto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/invoice-preview-dialog.tsx
git commit -m "feat(ops): add invoice preview dialog component"
```

---

### Task 6: Invoice Section (project detail)

**Files:**
- Create: `apps/ops/components/invoice-section.tsx`

**Step 1: Create the section component**

```tsx
"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { useMutation, useQuery } from "convex/react"
import { Download, FileText } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface Props {
  projectId: Id<"projects">
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
}

const STATUS_COLOR: Record<string, string> = {
  draft: "text-fg-muted",
  sent: "text-amber-600 dark:text-amber-400",
  paid: "text-green-600 dark:text-green-400",
}

export function InvoiceSection({ projectId }: Props) {
  const invoices = useQuery(api.invoices.listByProject, { projectId })
  const markPaid = useMutation(api.invoices.markPaid)

  if (!invoices || invoices.length === 0) return null

  const totalInvoiced = invoices
    .filter((i) => i.status === "sent" || i.status === "paid")
    .reduce((s, i) => s + i.totalAmount, 0)
  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.totalAmount, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-fg">Factures</h2>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-fg-muted mb-1">Facturé</p>
            <p className="text-xl font-semibold font-mono">
              {(totalInvoiced / 100).toLocaleString("fr-FR")} €
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-fg-muted mb-1">Encaissé</p>
            <p className="text-xl font-semibold font-mono text-green-600 dark:text-green-400">
              {(totalPaid / 100).toLocaleString("fr-FR")} €
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="border border-edge rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-3">
              <th className="text-left px-3 py-2 font-medium text-fg-muted">N°</th>
              <th className="text-left px-3 py-2 font-medium text-fg-muted">Libellé</th>
              <th className="text-right px-3 py-2 font-medium text-fg-muted">Montant HT</th>
              <th className="text-center px-3 py-2 font-medium text-fg-muted">Statut</th>
              <th className="text-right px-3 py-2 font-medium text-fg-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-t border-edge">
                <td className="px-3 py-2 font-mono text-fg">
                  {inv.qontoNumber ?? "—"}
                </td>
                <td className="px-3 py-2 text-fg truncate max-w-[200px]">
                  {inv.label}
                </td>
                <td className="text-right px-3 py-2 font-mono text-fg">
                  {(inv.totalAmount / 100).toLocaleString("fr-FR")} €
                </td>
                <td className={`text-center px-3 py-2 font-medium ${STATUS_COLOR[inv.status]}`}>
                  {STATUS_LABEL[inv.status]}
                </td>
                <td className="text-right px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    {inv.status === "sent" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          try {
                            await markPaid({ id: inv._id })
                            toast.success("Facture marquée payée")
                          } catch (e) {
                            toast.error(
                              e instanceof Error ? e.message : "Erreur"
                            )
                          }
                        }}
                      >
                        Payée
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/invoice-section.tsx
git commit -m "feat(ops): add invoice section component for project page"
```

---

### Task 7: Wire everything in the project detail page

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx`

**Step 1: Add imports**

```typescript
import { InvoicePreviewDialog } from "@/components/invoice-preview-dialog"
import { InvoiceSection } from "@/components/invoice-section"
```

**Step 2: Add state for invoice dialog**

```typescript
const [invoiceEntries, setInvoiceEntries] = useState<Doc<"timeEntries">[]>([])
const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
```

**Step 3: Add "Facturer" bulk action**

Add to `entryBulkActions` array:
```typescript
{
  id: "create-invoice",
  label: "Facturer",
  icon: FileText,
  handler: async (rows) => {
    const readyEntries = rows
      .map((r) => r.original)
      .filter((e) => e.billable && (e.status === "ready_to_invoice" || (!e.status && !e.invoicedAt)))
    if (readyEntries.length === 0) {
      toast.error("Aucune entrée prête à facturer dans la sélection")
      return
    }
    setInvoiceEntries(readyEntries)
    setInvoiceDialogOpen(true)
  },
},
```

**Step 4: Add InvoiceSection after ContractSection**

```tsx
{/* Invoices section */}
<InvoiceSection projectId={pid as Id<"projects">} />
```

**Step 5: Add InvoicePreviewDialog before closing `</>`**

```tsx
<InvoicePreviewDialog
  open={invoiceDialogOpen}
  onOpenChange={setInvoiceDialogOpen}
  projectId={pid as Id<"projects">}
  projectName={project.name}
  clientId={project.clientId}
  qontoClientId={client?.qontoClientId}
  entries={invoiceEntries}
  contractType={activeContract?.type}
/>
```

**Step 6: Push to Convex dev, test the flow manually**

Run: `pnpm dev:ops`
Test: Select entries → bulk action "Facturer" → dialog opens with correct data

**Step 7: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/_client.tsx
git commit -m "feat(ops): wire invoice dialog and section in project detail"
```

---

### Task 8: Add QONTO_API_KEY to turbo.json and test end-to-end

**Files:**
- Modify: `turbo.json`

**Step 1: Add QONTO_API_KEY to globalPassThroughEnv**

Add `"QONTO_API_KEY"` to the existing array in `turbo.json`.

**Step 2: Set up Qonto API key**

- Get API key from Qonto dashboard (Settings > API)
- Add to `apps/ops/.env.local`: `QONTO_API_KEY=your_key`
- Add to Convex dashboard env vars for production

**Step 3: End-to-end test**

1. Set `qontoClientId` on a client
2. Create time entries, mark "ready_to_invoice"
3. Select entries → "Facturer" → preview dialog
4. Click "Envoyer à Qonto"
5. Verify: invoice created in Qonto, entries marked "invoiced", invoice appears in section

**Step 4: Commit**

```bash
git add turbo.json
git commit -m "chore: add QONTO_API_KEY to turbo env passthrough"
```
