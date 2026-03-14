# Data Table — Linear-style Toolbar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the DataTable toolbar into a Linear-inspired stacked layout (views row + conditional filter row + conditional search row), and create a new docs page showcasing two order-line DataTables (read-only + editable).

**Architecture:** Add a `toolbarLayout="stacked"` prop to `DataTable` and `DataTableActionsBar`. When `stacked`, the toolbar renders 3 conditional rows instead of one monolithic row. The existing `"classic"` layout remains default for backward compatibility. A new preset `order-lines` provides columns/views for the docs page.

**Tech Stack:** React 19, TanStack Table, Tailwind v4, Lucide icons, @blazz/ui primitives (Button, Input, Badge, DropdownMenu, Menu)

---

## Task 1: Add `toolbarLayout` prop to types

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.types.ts`

**Step 1: Add the prop to DataTableProps**

In `data-table.types.ts`, add after `combineSearchAndFilters` (line ~199):

```typescript
/** Toolbar layout: "classic" (single row, default) or "stacked" (Linear-style 3-row) */
toolbarLayout?: "classic" | "stacked"
```

**Step 2: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.types.ts
git commit -m "feat(data-table): add toolbarLayout prop type"
```

---

## Task 2: Refactor DataTableActionsBar for stacked layout

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table-actions-bar.tsx`

**Step 1: Add toolbarLayout + export prop to interface**

Add to `DataTableActionsBarProps` (line ~37):

```typescript
/** Toolbar layout mode */
toolbarLayout?: "classic" | "stacked"

/** Export handler (stacked layout) */
onExport?: () => void
```

**Step 2: Add the new import**

Add `Download` to the lucide imports (line ~5):

```typescript
import {
	ArrowUpDown,
	ChevronDown,
	Copy,
	Download,
	Edit2,
	ListFilter,
	MoreVertical,
	Plus,
	Save,
	Search,
	SlidersHorizontal,
	Trash2,
	X,
} from "lucide-react"
```

**Step 3: Implement stacked layout rendering**

After the existing `return` block (line ~315), restructure the component body. The component function should check `toolbarLayout` and branch:

```tsx
export function DataTableActionsBar({
	// ... existing props ...
	toolbarLayout = "classic",
	onExport,
}: DataTableActionsBarProps) {
	const t = useDataTableTranslations(locale)
	const searchInputRef = React.useRef<HTMLInputElement>(null)

	// ... keep all existing hooks (useEffect for focus, Escape, combined toggle, overflow logic) ...

	// ---- STACKED LAYOUT ----
	if (toolbarLayout === "stacked") {
		return (
			<div data-slot="data-table-actions-bar" className="border-b border-separator">
				{/* ROW 1 — Views + Action Icons */}
				<div ref={barRef} className="flex items-center justify-between px-2 pt-2 pb-1">
					{/* Left: Views tabs */}
					<div ref={containerRef} className="flex items-center gap-1 overflow-x-clip">
						{views && views.length > 0 ? (
							<>
								{displayedViews.map((view) => {
									const isActive = activeView?.id === view.id
									return (
										<button
											key={view.id}
											type="button"
											data-view-item
											onClick={() => onViewChange?.(view)}
											className={cn(
												"relative inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition-colors",
												isActive
													? "bg-raised text-fg"
													: "text-fg-muted hover:bg-raised/50 hover:text-fg"
											)}
										>
											{view.icon && <view.icon className="h-3.5 w-3.5" />}
											<span>{view.name}</span>
										</button>
									)
								})}

								{/* Overflow dropdown */}
								{overflowViews.length > 0 && (
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button variant="ghost" size="sm" className="h-7 shrink-0 whitespace-nowrap px-2">
													<span>{t.moreViews}</span>
													<ChevronDown className="ml-1 h-3 w-3" />
												</Button>
											}
										/>
										<DropdownMenuContent align="start" sideOffset={4}>
											{overflowViews.map((view) => (
												<DropdownMenuItem
													key={view.id}
													onClick={() => onViewChange?.(view)}
													className={cn(activeView?.id === view.id && "bg-raised text-fg")}
												>
													{view.name}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								)}

								{/* + New View */}
								{enableCustomViews && onCreateView && (
									<Button
										variant="ghost"
										size="sm"
										onClick={onCreateView}
										className="h-7 shrink-0 gap-1 px-2 text-fg-muted"
									>
										<Plus className="h-3.5 w-3.5" />
										<span className="text-xs">New view</span>
									</Button>
								)}
							</>
						) : null}
					</div>

					{/* Right: Icon buttons */}
					<div className="flex shrink-0 items-center gap-0.5">
						{/* Search */}
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => onSearchOpenChange(!searchOpen)}
							className={cn("h-7 w-7", searchOpen && "bg-raised text-fg")}
							aria-label="Toggle search"
						>
							<Search className="h-3.5 w-3.5" />
						</Button>

						{/* Filter */}
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={onToggleInlineFilters || onOpenFilterBuilder}
							className={cn("relative h-7 w-7", showInlineFilters && "bg-raised text-fg")}
							aria-label="Toggle filters"
						>
							<ListFilter className="h-3.5 w-3.5" />
							{filterCount > 0 && (
								<Badge
									variant="secondary"
									className="absolute -right-1 -top-1 h-3.5 min-w-3.5 rounded-full px-1 py-0 text-[9px] font-medium flex items-center justify-center"
								>
									{filterCount}
								</Badge>
							)}
						</Button>

						{/* Sort */}
						<Menu>
							<MenuTrigger
								className="inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-raised hover:text-fg"
								aria-label="Sort options"
							>
								<ArrowUpDown className="h-3.5 w-3.5" />
							</MenuTrigger>
							<MenuPortal>
								<MenuPositioner sideOffset={8}>
									<MenuPopup>
										<DataTableSortMenu
											columns={sortableColumns}
											sorting={sorting}
											onSortingChange={onSortingChange}
											locale={locale}
										/>
									</MenuPopup>
								</MenuPositioner>
							</MenuPortal>
						</Menu>

						{/* Display settings */}
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={onOpenFilterBuilder}
							className="h-7 w-7"
							aria-label="Display settings"
						>
							<SlidersHorizontal className="h-3.5 w-3.5" />
						</Button>

						{/* Export */}
						{onExport && (
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={onExport}
								className="h-7 w-7"
								aria-label="Export"
							>
								<Download className="h-3.5 w-3.5" />
							</Button>
						)}
					</div>
				</div>

				{/* ROW 2 — Search Bar (conditional) */}
				{searchOpen && (
					<div className="flex items-center gap-2 px-2 pb-1">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
							<Input
								ref={searchInputRef}
								type="text"
								placeholder={searchPlaceholder || t.searchPlaceholder}
								value={searchValue}
								onChange={(e) => onSearchChange(e.target.value)}
								className="h-7 pl-8 pr-8 text-xs"
								aria-label="Search"
							/>
							{searchValue && (
								<button
									type="button"
									onClick={() => onSearchChange("")}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
									aria-label="Clear search"
								>
									<X className="h-3.5 w-3.5" />
								</button>
							)}
						</div>
						<button
							type="button"
							onClick={() => {
								onSearchOpenChange(false)
								onSearchChange("")
							}}
							className="text-xs text-fg-muted hover:text-fg"
						>
							{t.cancel}
						</button>
					</div>
				)}
			</div>
		)
	}

	// ---- CLASSIC LAYOUT (existing code, unchanged) ----
	return (
		// ... entire existing return block stays unchanged ...
	)
}
```

**Important:** The stacked layout does NOT replace the classic layout — it's a parallel `if` branch. All existing code stays untouched inside the classic return.

**Step 3: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table-actions-bar.tsx
git commit -m "feat(data-table): implement stacked toolbar layout (Linear-style)"
```

---

## Task 3: Wire toolbarLayout through DataTable

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Accept and forward the prop**

In the destructured props (~line 95-149), add:

```typescript
toolbarLayout = "classic",
```

In the `<DataTableActionsBar>` render (~line 633), add the new prop:

```tsx
<DataTableActionsBar
	// ... existing props ...
	toolbarLayout={toolbarLayout}
/>
```

**Step 2: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(data-table): forward toolbarLayout prop to actions bar"
```

---

## Task 4: Create order-lines mock data

**Files:**
- Create: `apps/docs/src/lib/order-lines-data.ts`

**Step 1: Define the type and mock data**

```typescript
export interface OrderLine {
	id: string
	articleName: string
	articleRef: string
	articleVariant?: string
	sku: string
	ean: string
	type: "UNIT" | "PACK" | "PALLET" | "VRAC"
	quantity: number
	unitPriceHT: number
	vatRate: number
	totalHT: number
	totalTTC: number
	inStock: boolean
}

export const orderLines: OrderLine[] = [
	{
		id: "1",
		articleName: "Coca-Cola Cannette 33cl",
		articleRef: "BOI-101",
		articleVariant: "Cannette 33cl",
		sku: "BOI101 • UNIT",
		ean: "376 0000 1010 01",
		type: "UNIT",
		quantity: 1,
		unitPriceHT: 0.35,
		vatRate: 5.5,
		totalHT: 0.35,
		totalTTC: 0.37,
		inStock: true,
	},
	{
		id: "2",
		articleName: "Evian 1.5L",
		articleRef: "BOI-205",
		articleVariant: "Pack 6x1.5L",
		sku: "BOI205 • PACK",
		ean: "376 0000 2050 06",
		type: "PACK",
		quantity: 10,
		unitPriceHT: 1.85,
		vatRate: 5.5,
		totalHT: 18.50,
		totalTTC: 19.52,
		inStock: true,
	},
	{
		id: "3",
		articleName: "Pain de mie Harry's",
		articleRef: "ALI-042",
		articleVariant: "500g",
		sku: "ALI042 • UNIT",
		ean: "376 0000 0420 01",
		type: "UNIT",
		quantity: 24,
		unitPriceHT: 1.20,
		vatRate: 5.5,
		totalHT: 28.80,
		totalTTC: 30.38,
		inStock: true,
	},
	{
		id: "4",
		articleName: "Nutella 750g",
		articleRef: "ALI-078",
		sku: "ALI078 • UNIT",
		ean: "376 0000 0780 01",
		type: "UNIT",
		quantity: 12,
		unitPriceHT: 4.50,
		vatRate: 5.5,
		totalHT: 54.00,
		totalTTC: 56.97,
		inStock: true,
	},
	{
		id: "5",
		articleName: "Papier A4 Clairefontaine",
		articleRef: "FOU-310",
		articleVariant: "Ramette 500 feuilles",
		sku: "FOU310 • UNIT",
		ean: "376 0000 3100 01",
		type: "UNIT",
		quantity: 5,
		unitPriceHT: 3.90,
		vatRate: 20.0,
		totalHT: 19.50,
		totalTTC: 23.40,
		inStock: true,
	},
	{
		id: "6",
		articleName: "Stylo Bic Cristal",
		articleRef: "FOU-112",
		articleVariant: "Boîte 50 bleu",
		sku: "FOU112 • PACK",
		ean: "376 0000 1120 50",
		type: "PACK",
		quantity: 2,
		unitPriceHT: 8.50,
		vatRate: 20.0,
		totalHT: 17.00,
		totalTTC: 20.40,
		inStock: false,
	},
	{
		id: "7",
		articleName: "Café Lavazza Qualità Oro",
		articleRef: "BOI-450",
		articleVariant: "1kg grains",
		sku: "BOI450 • UNIT",
		ean: "376 0000 4500 01",
		type: "UNIT",
		quantity: 6,
		unitPriceHT: 12.90,
		vatRate: 5.5,
		totalHT: 77.40,
		totalTTC: 81.66,
		inStock: true,
	},
	{
		id: "8",
		articleName: "Sucre en poudre Daddy",
		articleRef: "ALI-091",
		articleVariant: "1kg",
		sku: "ALI091 • UNIT",
		ean: "376 0000 0910 01",
		type: "UNIT",
		quantity: 15,
		unitPriceHT: 0.95,
		vatRate: 5.5,
		totalHT: 14.25,
		totalTTC: 15.03,
		inStock: true,
	},
	{
		id: "9",
		articleName: "Lait Lactel demi-écrémé",
		articleRef: "BOI-320",
		articleVariant: "Brique 1L",
		sku: "BOI320 • UNIT",
		ean: "376 0000 3200 01",
		type: "UNIT",
		quantity: 48,
		unitPriceHT: 0.89,
		vatRate: 5.5,
		totalHT: 42.72,
		totalTTC: 45.07,
		inStock: true,
	},
	{
		id: "10",
		articleName: "Enveloppes C5 auto-adhésives",
		articleRef: "FOU-205",
		articleVariant: "Boîte 500",
		sku: "FOU205 • PACK",
		ean: "376 0000 2050 01",
		type: "PACK",
		quantity: 1,
		unitPriceHT: 15.60,
		vatRate: 20.0,
		totalHT: 15.60,
		totalTTC: 18.72,
		inStock: false,
	},
	{
		id: "11",
		articleName: "Beurre Président doux",
		articleRef: "ALI-155",
		articleVariant: "250g",
		sku: "ALI155 • UNIT",
		ean: "376 0000 1550 01",
		type: "UNIT",
		quantity: 20,
		unitPriceHT: 1.75,
		vatRate: 5.5,
		totalHT: 35.00,
		totalTTC: 36.93,
		inStock: true,
	},
	{
		id: "12",
		articleName: "Scotch 3M transparent",
		articleRef: "FOU-088",
		articleVariant: "Lot de 6 rouleaux",
		sku: "FOU088 • PACK",
		ean: "376 0000 0880 06",
		type: "PACK",
		quantity: 3,
		unitPriceHT: 5.20,
		vatRate: 20.0,
		totalHT: 15.60,
		totalTTC: 18.72,
		inStock: true,
	},
	{
		id: "13",
		articleName: "Jus d'orange Tropicana",
		articleRef: "BOI-178",
		articleVariant: "Brique 1L",
		sku: "BOI178 • UNIT",
		ean: "376 0000 1780 01",
		type: "UNIT",
		quantity: 30,
		unitPriceHT: 1.65,
		vatRate: 5.5,
		totalHT: 49.50,
		totalTTC: 52.22,
		inStock: true,
	},
	{
		id: "14",
		articleName: "Post-it 3M 76x76mm",
		articleRef: "FOU-045",
		articleVariant: "Bloc 100 feuilles jaune",
		sku: "FOU045 • UNIT",
		ean: "376 0000 0450 01",
		type: "UNIT",
		quantity: 10,
		unitPriceHT: 1.30,
		vatRate: 20.0,
		totalHT: 13.00,
		totalTTC: 15.60,
		inStock: true,
	},
	{
		id: "15",
		articleName: "Yaourt Danone Nature",
		articleRef: "ALI-201",
		articleVariant: "Pack 12x125g",
		sku: "ALI201 • PACK",
		ean: "376 0000 2010 12",
		type: "PACK",
		quantity: 8,
		unitPriceHT: 2.40,
		vatRate: 5.5,
		totalHT: 19.20,
		totalTTC: 20.26,
		inStock: true,
	},
]
```

**Step 2: Commit**

```bash
git add apps/docs/src/lib/order-lines-data.ts
git commit -m "feat(docs): add order lines mock data for data-table showcase"
```

---

## Task 5: Create order-lines preset

**Files:**
- Create: `packages/ui/src/components/blocks/data-table/presets/order-lines.tsx`

**Step 1: Create the preset**

This preset creates columns for order lines — both read-only and editable variants.

```tsx
"use client"

import type { DataTableColumnDef, DataTableView } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"
import { col } from "../factories/col"
import { createStatusViews } from "../factories/view-builders"

/**
 * Order line data shape — generic enough for any ERP.
 * Consumers provide their own data matching this interface.
 */
export interface OrderLineRow {
	id: string
	articleName: string
	articleRef: string
	articleVariant?: string
	sku: string
	ean: string
	type: string
	quantity: number
	unitPriceHT: number
	vatRate: number
	totalHT: number
	totalTTC: number
	inStock?: boolean
}

// ---------- Columns ----------

function articleColumn(): DataTableColumnDef<OrderLineRow> {
	return {
		accessorKey: "articleName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Article" />,
		cell: ({ row }) => {
			const name = row.original.articleName
			const variant = row.original.articleVariant
			const ref = row.original.articleRef
			return (
				<div className="flex flex-col gap-0.5">
					<span className="font-medium text-fg">
						{name}
						{variant && <span className="ml-1.5 text-fg-muted font-normal">[{variant}]</span>}
					</span>
					<span className="text-xs text-fg-muted font-mono">{ref}</span>
				</div>
			)
		},
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Rechercher un article...",
			showInlineFilter: true,
			filterLabel: "Article",
		},
	} as DataTableColumnDef<OrderLineRow>
}

const currencyFmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })
const pctFmt = (v: number) => `${v}%`

function readOnlyColumns(): DataTableColumnDef<OrderLineRow>[] {
	return [
		articleColumn(),
		col.text<OrderLineRow>("sku", { title: "SKU" }),
		col.text<OrderLineRow>("ean", { title: "EAN", enableSorting: false }),
		col.text<OrderLineRow>("type", { title: "Type" }),
		col.numeric<OrderLineRow>("quantity", { title: "Qté", align: "right" }),
		col.currency<OrderLineRow>("unitPriceHT", { title: "PU HT", currency: "EUR", locale: "fr-FR" }),
		col.numeric<OrderLineRow>("vatRate", { title: "TVA %", formatter: pctFmt, align: "right" }),
		col.currency<OrderLineRow>("totalHT", { title: "Total HT", currency: "EUR", locale: "fr-FR" }),
		col.currency<OrderLineRow>("totalTTC", { title: "Total TTC", currency: "EUR", locale: "fr-FR" }),
	]
}

// ---------- Views ----------

function orderLineViews(): DataTableView[] {
	return [
		{
			id: "all",
			name: "Toutes",
			isSystem: true,
			isDefault: true,
			filters: { id: "root", operator: "AND", conditions: [], groups: [] },
		},
		{
			id: "in-stock",
			name: "En stock",
			isSystem: true,
			filters: {
				id: "stock",
				operator: "AND",
				conditions: [{ id: "c1", column: "inStock", operator: "equals", value: true, type: "boolean" }],
				groups: [],
			},
		},
		{
			id: "out-of-stock",
			name: "Rupture",
			isSystem: true,
			filters: {
				id: "oos",
				operator: "AND",
				conditions: [{ id: "c1", column: "inStock", operator: "equals", value: false, type: "boolean" }],
				groups: [],
			},
		},
		{
			id: "tva-5.5",
			name: "TVA 5.5%",
			isSystem: true,
			filters: {
				id: "tva55",
				operator: "AND",
				conditions: [{ id: "c1", column: "vatRate", operator: "equals", value: 5.5, type: "number" }],
				groups: [],
			},
		},
		{
			id: "tva-20",
			name: "TVA 20%",
			isSystem: true,
			filters: {
				id: "tva20",
				operator: "AND",
				conditions: [{ id: "c1", column: "vatRate", operator: "equals", value: 20, type: "number" }],
				groups: [],
			},
		},
	]
}

// ---------- Public API ----------

export interface OrderLinesPreset {
	columns: DataTableColumnDef<OrderLineRow>[]
	views: DataTableView[]
}

export function createOrderLinesPreset(): OrderLinesPreset {
	return {
		columns: readOnlyColumns(),
		views: orderLineViews(),
	}
}

export function createEditableOrderLinesPreset(): {
	columns: DataTableColumnDef<OrderLineRow>[]
} {
	// Same base columns but Qté and PU HT use editable builders
	const cols = readOnlyColumns()

	// Replace quantity with editable
	const qtyIdx = cols.findIndex((c) => "accessorKey" in c && c.accessorKey === "quantity")
	if (qtyIdx !== -1) {
		cols[qtyIdx] = col.editableNumber<OrderLineRow>("quantity", {
			title: "Qté",
			align: "right",
		})
	}

	// Replace unitPriceHT with editable
	const puIdx = cols.findIndex((c) => "accessorKey" in c && c.accessorKey === "unitPriceHT")
	if (puIdx !== -1) {
		cols[puIdx] = col.editableCurrency<OrderLineRow>("unitPriceHT", {
			title: "PU HT",
			currency: "EUR",
			locale: "fr-FR",
		})
	}

	return { columns: cols }
}
```

**Step 2: Export from index**

In `packages/ui/src/components/blocks/data-table/presets/` — check if there's a barrel. If not, the presets are imported directly. No barrel needed.

**Step 3: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/presets/order-lines.tsx
git commit -m "feat(data-table): add order-lines preset (read-only + editable)"
```

---

## Task 6: Create the docs page

**Files:**
- Create: `apps/docs/src/routes/_docs/docs/blocks/data-table-v2.tsx`

**Step 1: Create the route file**

This page shows two DataTables stacked: read-only on top, editable below. Both use order-line data.

```tsx
import { DataTable } from "@blazz/ui/components/blocks/data-table/data-table"
import {
	createEditableOrderLinesPreset,
	createOrderLinesPreset,
	type OrderLineRow,
} from "@blazz/ui/components/blocks/data-table/presets/order-lines"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { orderLines } from "~/lib/order-lines-data"

export const Route = createFileRoute("/_docs/docs/blocks/data-table-v2")({
	component: DataTableV2Page,
})

function DataTableV2Page() {
	const readOnlyPreset = React.useMemo(() => createOrderLinesPreset(), [])
	const editablePreset = React.useMemo(() => createEditableOrderLinesPreset(), [])

	// Editable data with recalculation
	const [editableData, setEditableData] = React.useState<OrderLineRow[]>(orderLines)

	const handleCellEdit = React.useCallback(
		(rowId: string, columnId: string, value: unknown) => {
			setEditableData((prev) =>
				prev.map((row) => {
					if (row.id !== rowId) return row
					const updated = { ...row, [columnId]: value }
					// Recalculate totals
					updated.totalHT = updated.quantity * updated.unitPriceHT
					updated.totalTTC = updated.totalHT * (1 + updated.vatRate / 100)
					// Round to 2 decimals
					updated.totalHT = Math.round(updated.totalHT * 100) / 100
					updated.totalTTC = Math.round(updated.totalTTC * 100) / 100
					return updated
				})
			)
		},
		[]
	)

	return (
		<DocPage>
			<DocHero
				title="Data Table v2"
				description="Linear-inspired toolbar layout with stacked views, filters, and search. Two examples: read-only order lines and editable order lines with auto-calculated totals."
			/>

			<DocSection title="Read-only — Lignes de commande" id="read-only">
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={orderLines}
						columns={readOnlyPreset.columns}
						views={readOnlyPreset.views}
						getRowId={(row) => row.id}
						enableSorting
						enablePagination
						enableRowSelection
						enableGlobalSearch
						enableAdvancedFilters
						enableCustomViews
						toolbarLayout="stacked"
						searchPlaceholder="Rechercher un article, SKU, EAN..."
						locale="fr"
						variant="lined"
						pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
					/>
				</div>
			</DocSection>

			<DocSection title="Éditable — Lignes de commande" id="editable">
				<p className="text-sm text-fg-muted mb-4">
					Les colonnes <strong>Qté</strong> et <strong>PU HT</strong> sont éditables.
					Les totaux se recalculent automatiquement. Navigation clavier : Tab, Enter, Escape, Ctrl+Z/Y.
				</p>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={editableData}
						columns={editablePreset.columns}
						getRowId={(row) => row.id}
						enableSorting
						enablePagination
						enableGlobalSearch
						enableCellEditing
						onCellEdit={handleCellEdit}
						toolbarLayout="stacked"
						searchPlaceholder="Rechercher un article..."
						locale="fr"
						variant="editable"
						pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
					/>
				</div>
			</DocSection>
		</DocPage>
	)
}
```

**Step 2: Add route to navigation**

Check `apps/docs/src/config/` for the docs navigation config and add the new page entry under blocks.

**Step 3: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/blocks/data-table-v2.tsx apps/docs/src/lib/order-lines-data.ts
git commit -m "feat(docs): add data-table-v2 page with Linear-style toolbar"
```

---

## Task 7: Verify and iterate

**Step 1: Run dev server**

```bash
pnpm dev:docs
```

**Step 2: Navigate to the new page**

Open `http://localhost:3100/docs/blocks/data-table-v2`

**Step 3: Verify:**

- [ ] Views tabs render as pills, active view highlighted
- [ ] Click search icon → search bar appears as Row 2
- [ ] Click filter icon → inline filters appear as Row 2
- [ ] Sort menu opens as popover
- [ ] Pagination works
- [ ] Editable table: click Qté/PU HT → edit → totals recalculate
- [ ] Keyboard nav works (Tab, Enter, Escape, Ctrl+Z)

**Step 4: Fix any issues found**

**Step 5: Final commit**

```bash
git add -A
git commit -m "fix(docs): data-table-v2 polish and fixes"
```

---

## Summary

| Task | Scope | Files |
|------|-------|-------|
| 1 | Type definition | `data-table.types.ts` |
| 2 | Stacked toolbar impl | `data-table-actions-bar.tsx` |
| 3 | Wire prop through | `data-table.tsx` |
| 4 | Mock data | `apps/docs/src/lib/order-lines-data.ts` |
| 5 | Order-lines preset | `presets/order-lines.tsx` |
| 6 | Docs page | `data-table-v2.tsx` + navigation |
| 7 | Verify & polish | All files |
