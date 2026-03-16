# Qonto Invoicing — Design

Date: 2026-03-16
Branch: `feature/qonto-invoicing`
Status: Validated

## Context

Ops app tracks time entries per project with statuses `draft → ready_to_invoice → invoiced → paid`. The user needs to generate invoices from tracked time and push them to Qonto for PDF generation, sequential numbering, and e-invoicing compliance (Factur-X, mandatory in France from 2026-2027).

## Decisions

| Aspect | Decision |
|--------|----------|
| Source of truth | Qonto (numbering, PDF, e-invoicing) |
| Billing unit | Per project, single consolidated line |
| Line items | Editable before sending (label, amount, VAT) |
| Numbering | Qonto automatic, sequential no gaps (format: F001, F002...) |
| Payment tracking | Manual |
| Client mapping | Dropdown fetching Qonto clients via API |
| Local storage | `invoices` table with Qonto reference + PDF backup |
| UI | Dialog from bulk action + invoice section on project page |
| Rollback | Draft invoice locally, only finalize on Qonto success |

## Data Model

### New table: `invoices`

```
invoices
├── userId: string
├── projectId: Id<"projects">
├── clientId: Id<"clients">
├── qontoInvoiceId: optional<string>       ← null while draft
├── qontoNumber: optional<string>          ← null while draft
├── label: string                          ← editable description
├── totalAmount: number                    ← HT amount in cents
├── vatRate: number                        ← e.g. 0.20
├── currency: "EUR"
├── periodStart: string                    ← ISO date
├── periodEnd: string                      ← ISO date
├── status: "draft" | "sent" | "paid"
├── pdfStorageId: optional<Id<"_storage">> ← backup copy of Qonto PDF
├── paidAt: optional<number>
├── createdAt: number
└── indexes: by_project, by_user, by_status
```

### Modified table: `timeEntries`

```
+ invoiceId: optional<Id<"invoices">>
+ index by_invoice: ["invoiceId"]
```

### Modified table: `clients`

```
+ qontoClientId: optional<string>
```

## User Flow

1. On project detail page, bulk-select time entries with status "ready_to_invoice"
2. Bulk action "Facturer" opens a preview dialog:
   - Label pre-filled: "Prestation [contract type] [project name] — [period]"
   - HT amount computed from entries
   - VAT rate (default 20%, editable)
   - TTC total
   - Label is editable before sending
3. "Créer la facture" → creates local draft invoice, links entries
4. "Envoyer à Qonto" → Convex action:
   - POST /v2/client_invoices to Qonto API
   - On success: invoice status → "sent", entries status → "invoiced", store qontoInvoiceId + qontoNumber, async fetch PDF → store in Convex storage
   - On failure: delete draft invoice, entries remain "ready_to_invoice"
5. Invoice section on project page shows all invoices with number, period, amount, status
6. "Marquer payée" button → invoice status → "paid", entries status → "paid"

## Qonto API Integration

### Authentication
- API Key stored as env var `QONTO_API_KEY` in Convex
- Calls via Convex actions (HTTP to external service)

### Endpoints used
- `POST /v2/client_invoices` — create invoice
- `GET /v2/clients` — list Qonto clients for mapping dropdown
- `GET /v2/client_invoices/{id}/attachment` — fetch PDF (~10s after creation)

### Client mapping
- `qontoClientId` field on `clients` table
- Set via dropdown that fetches Qonto clients list
- Done once per client

## Out of Scope (V1)
- Dedicated `/invoices` page
- Automatic payment sync (webhooks/polling)
- Custom PDF generation (Qonto handles it)
- Credit notes / avoirs
- Multi-line invoices (always single consolidated line)
- Multi-currency (EUR only)
