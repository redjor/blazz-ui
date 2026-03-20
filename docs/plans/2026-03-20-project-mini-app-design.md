# Project Mini-App — Design

**Date:** 2026-03-20
**Scope:** `apps/ops` — transform project detail page into a mini-app with sub-navigation

## Context

The current project detail page (`/clients/[id]/projects/[pid]/_client.tsx`, ~878 lines) is a monolithic scrollable page containing KPIs, budget, contracts, invoices, notes, and time entries. Adding project-scoped todos would make the scroll even longer.

The solution: transform the project detail into a **mini-app with a compact sidebar navigation** (Linear-style), where each section is a dedicated sub-route.

## Route Structure

```
app/(main)/clients/[id]/projects/[pid]/
├── layout.tsx          ← Sidebar nav + breadcrumb (lightweight fetch: project name + client name)
├── page.tsx            ← Overview: KPIs + budget + active contract (direct content, no redirect)
├── time/page.tsx       ← DataTable time entries (extracted from current _client.tsx)
├── todos/page.tsx      ← TodosDataTable with projectId fixed
├── invoices/page.tsx   ← InvoiceSection wrapper
├── notes/page.tsx      ← ProjectNotesList wrapper
└── contracts/page.tsx  ← All contracts list + CRUD dialogs
```

## Sidebar Navigation

- Fixed width ~200px, not resizable (no SplitView — just a `nav` element)
- Active item detected via `usePathname()`, highlighted with `bg-surface-2` + `text-fg`
- Inactive items in `text-fg-muted`
- Separated from content by `border-r` (border-edge), no shadow
- Lucide icons for each section

```
┌─────────────────────┐
│ LayoutDashboard  Vue d'ensemble  │  ← / (exact match)
│ Clock            Temps           │  ← /time
│ CheckSquare      Todos           │  ← /todos
│ Receipt          Factures        │  ← /invoices
│ StickyNote       Notes           │  ← /notes
│ FileStack        Contrats        │  ← /contracts
└─────────────────────┘
```

Order follows Serial Position Effect: Overview first (most used), Contracts last (least used).

## Data Fetching Strategy

**No shared React Context.** Each sub-page fetches its own data independently via Convex `useQuery`. This is Convex-idiomatic (reactive subscriptions) and avoids unnecessary re-renders across pages.

The **layout** only fetches:
- `projects.get` — project name, status (for breadcrumb + sidebar header)
- `clients.get` — client name (for breadcrumb)

Each **sub-page** fetches what it needs:
- Overview: `projects.getWithStats`, `contracts.getActiveByProject`
- Time: `projects.getWithStats` (includes entries)
- Todos: `todos.listByProject`, `categories.list`, `todos.listAllTags`
- Invoices: project invoices query
- Notes: project notes query
- Contracts: `contracts.listByProject`

## Project Todos Page

Mirror of `/todos/_client.tsx`, scoped to `projectId`.

### Shared Component

Extract `<TodosDataTable projectId?: Id<"projects" />` into `components/todos-data-table.tsx`:
- Used by both `/todos` (global) and `/projects/[pid]/todos` (scoped)
- When `projectId` is provided: filters by project, hides project column, pre-fills project in AddTodoDialog
- When `projectId` is undefined: shows all todos with project column (current behavior)
- Kanban/List toggle persisted in localStorage with distinct key (`project-todos-view-${pid}` vs `todos-view`)
- Views are independent between global and project-scoped

### Convex Changes

- `schema.ts`: add index `by_project` on `todos` table (`["projectId"]`)
- `todos.ts`: add query `listByProject({ projectId })` using the new index

## Page Decomposition

### Overview (page.tsx — direct content)
- 4 KPI cards (CA total, Facturé, À facturer, Temps passé)
- BudgetSection (burn-down chart)
- ContractSection (active contract only)
- Edit project dialog

### Time (time/page.tsx)
- DataTable time entries (full config: columns, views, row/bulk actions)
- TimeEntryForm dialog
- QuickTimeEntryModal
- "+ Saisie" button

### Todos (todos/page.tsx)
- `<TodosDataTable projectId={pid} />`

### Invoices (invoices/page.tsx)
- InvoiceSection (already isolated component)

### Notes (notes/page.tsx)
- ProjectNotesList (already isolated component)

### Contracts (contracts/page.tsx)
- All contracts list (active + history)
- ContractForm dialog (create/edit)
- Complete/edit actions

## Files Created
- `[pid]/layout.tsx` — layout with sidebar nav + breadcrumb
- `[pid]/page.tsx` — Overview content (replaces `_client.tsx`)
- `[pid]/time/page.tsx` — time entries
- `[pid]/todos/page.tsx` — project todos
- `[pid]/invoices/page.tsx` — invoices
- `[pid]/notes/page.tsx` — notes
- `[pid]/contracts/page.tsx` — contracts
- `components/project-sidebar.tsx` — sidebar nav component
- `components/todos-data-table.tsx` — shared todos DataTable

## Files Modified
- `convex/schema.ts` — add `by_project` index on todos
- `convex/todos.ts` — add `listByProject` query

## Files Deleted
- `[pid]/_client.tsx` — replaced by sub-pages

## What Does NOT Change
- Existing components (BudgetSection, ContractSection, InvoiceSection, ProjectNotesList, TimeEntryForm, QuickTimeEntryModal, etc.)
- Global `/todos` page (uses same shared component)
- `/todos/[id]` detail page
- Client detail page `/clients/[id]`

## Known Trade-offs
- URLs are long (`/clients/[id]/projects/[pid]/todos`) but acceptable for a personal app
- Active contract appears in both Overview and Contracts (intentional: overview = quick summary)
- No counters in sidebar (can be added later as enhancement)
