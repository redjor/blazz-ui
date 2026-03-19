# Invoice Editor — Design

Date: 2026-03-19

## Problem

The current invoicing flow is limited: one invoice = one project, no editable lines, no discounts, no notes. Users need to create invoices spanning multiple projects for the same client, add custom lines (travel, fees), apply discounts, and add notes.

## Decisions

- **Approach**: Lines embedded as array in the `invoices` document (not a separate table). Lines have no life outside their invoice — one save = one atomic mutation.
- **Editor**: Full-page editor at `/invoices/new` and `/invoices/[id]` (not a dialog).
- **No YAGNI**: No local PDF generation (Qonto handles it), no invoice duplication, no recurrence, no drag & drop reordering, no multi-currency.

## Schema Changes

Fields **added** to `invoices` (existing fields unchanged):

```ts
invoiceType: "unique" | "acompte" | "situation"  // default "unique"

lines: [{
  id: string,                   // nanoid, stable key for UI
  type: "project" | "custom",
  projectId?: Id<"projects">,   // when type = "project"
  label: string,
  quantity: number,             // default 1
  unitPrice: number,            // cents
  discountPercent?: number,     // 0-100, per-line discount
  sortOrder: number,
}]

globalDiscount?: {
  type: "percent" | "fixed",    // fixed = cents
  value: number,
}

notes?: string           // printed on invoice (payment terms, thanks)
internalNotes?: string   // visible only in app

// projectId becomes optional (invoice can span N projects via lines)
```

`totalAmount` remains and is **recalculated** on every save: sum of line totals (after per-line discounts) minus global discount. Preserves compatibility with existing StatsGrid, forecast, and InvoiceSection.

## Invoice Types

| Type | Description |
|------|-------------|
| `unique` | Full amount in a single invoice |
| `acompte` | Upfront payment before work starts |
| `situation` | Partial billing for ongoing project (mid-sprint, end-of-month) |

## Page Layout

```
Top bar: "Factures > Nouvelle facture" + breadcrumb

┌─ Header ──────────────────────────────────────────────────┐
│  Type: [Facture unique ▾]    Client: [Acme Corp ▾]       │
│  Libellé: [Prestation mars 2026          ]               │
└───────────────────────────────────────────────────────────┘

┌─ Lines table ─────────────────────────────────────────────┐
│  #  Type      Label                   Qty  Unit HT  Disc   Total HT │
│  1  Projet    Prestation TMA Acme     1    3 200€   —      3 200€   │
│  2  Projet    Support React           1    1 800€   -10%   1 620€   │
│  3  Libre     Frais de déplacement    2      150€   —        300€   │
│                                                                      │
│  [+ Ajouter un projet]  [+ Ajouter une ligne libre]                 │
└───────────────────────────────────────────────────────────┘

┌─ Totals ──────────────────────────────────────────────────┐
│                          Sous-total HT      5 120,00 €    │
│                          Remise globale -5%  -256,00 €    │
│                          Total HT           4 864,00 €    │
│                          TVA 20%              972,80 €    │
│                          Total TTC          5 836,80 €    │
└───────────────────────────────────────────────────────────┘

┌─ Notes ───────────────────────────────────────────────────┐
│  Notes (facture):  [Paiement à 30 jours...             ]  │
│  Notes internes:   [Remise exceptionnelle car...       ]  │
└───────────────────────────────────────────────────────────┘

─── Sticky footer ──────────────────────────────────────────
   [Annuler]                    [Brouillon]  [Créer la facture]
```

## Flow & Mutations

### `invoices.saveDraft`

```
args: { id?, clientId, invoiceType, label, lines[], vatRate,
        globalDiscount?, notes?, internalNotes?, entryIds? }

- If id → patch existing (must be draft)
- Else → insert new document
- Recalculate totalAmount from lines + discounts
- Link time entries (entryIds) to invoice
```

### "Add project" line

1. User picks a project from client's active projects
2. Frontend fetches unbilled entries via `timeEntries.listForRecap`
3. Computes `hours × hourlyRate`, pre-fills: `quantity: 1`, `unitPrice: computed`, `label: "Prestation {project} — {period}"`

### "Add custom" line

Adds an empty editable row: label, quantity, unit price, optional discount.

### Send to Qonto

Existing `qonto.createInvoice` sends lines as `items[]` to Qonto API (currently sends 1 item, updated to send N items).

### Edit flow

- `/invoices/[id]` loads the invoice, same editor component
- Only `draft` invoices are editable
- `sent` and `paid` invoices render in read-only mode

## Constraints

- Multi-project invoices must be for the **same client**
- `projectId` on invoice becomes optional (N projects via lines)
- EUR only
- No PDF generation (Qonto generates it)
- No drag & drop line reordering (sortOrder managed by add order)
