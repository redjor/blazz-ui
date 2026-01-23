# DataTable Quick Examples

Quick reference snippets for common DataTable use cases.

## Table of Contents

- [Minimal Table](#minimal-table)
- [Table with Filters](#table-with-filters)
- [Table with Views](#table-with-views)
- [Table with Actions](#table-with-actions)
- [Table with Selection](#table-with-selection)
- [Full-Featured Table](#full-featured-table)
- [Shopify-Style Layout (Tabs)](#shopify-style-layout-tabs)

---

## Minimal Table

Simplest possible table with just data and columns.

```typescript
import { DataTable } from "@/components/features/data-table"
import type { DataTableColumnDef } from "@/components/features/data-table"

interface Product {
  id: string
  name: string
  price: number
}

const products: Product[] = [
  { id: "1", name: "Widget", price: 29.99 },
  { id: "2", name: "Gadget", price: 49.99 },
]

const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.getValue("price").toFixed(2)}`,
  },
]

export default function ProductsPage() {
  return <DataTable data={products} columns={columns} />
}
```

---

## Table with Filters

Add filtering capability to columns.

```typescript
import { DataTable, DataTableColumnHeader } from "@/components/features/data-table"
import type { DataTableColumnDef } from "@/components/features/data-table"

const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    filterConfig: {
      type: "text",
      operators: ["contains", "equals", "startsWith"],
      placeholder: "Search products..."
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => `$${row.getValue("price").toFixed(2)}`,
    filterConfig: {
      type: "number",
      min: 0,
      max: 1000
    },
    meta: {
      align: "right"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    filterConfig: {
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]
    }
  }
]

export default function ProductsPage() {
  return (
    <DataTable
      data={products}
      columns={columns}
      enableFiltering
      enableAdvancedFilters
      enableGlobalSearch
    />
  )
}
```

---

## Table with Views

Add predefined filter views with localStorage persistence.

```typescript
import { DataTable } from "@/components/features/data-table"
import type { DataTableView } from "@/components/features/data-table"
import { useDataTableViews } from "@/hooks/use-data-table-views"
import { CheckCircle, XCircle } from "lucide-react"

const defaultViews: DataTableView[] = [
  {
    id: "all",
    name: "All Products",
    isSystem: true,
    isDefault: true,
    filters: { id: "root", operator: "AND", conditions: [] }
  },
  {
    id: "active",
    name: "Active",
    icon: CheckCircle,
    isSystem: true,
    filters: {
      id: "root",
      operator: "AND",
      conditions: [
        {
          id: "status-active",
          column: "status",
          operator: "equals",
          value: "active",
          type: "select"
        }
      ]
    }
  },
  {
    id: "inactive",
    name: "Inactive",
    icon: XCircle,
    isSystem: true,
    filters: {
      id: "root",
      operator: "AND",
      conditions: [
        {
          id: "status-inactive",
          column: "status",
          operator: "equals",
          value: "inactive",
          type: "select"
        }
      ]
    }
  }
]

export default function ProductsPage() {
  const { views, activeView, setActiveView } = useDataTableViews({
    storageKey: "products-table-views",
    defaultViews
  })

  return (
    <DataTable
      data={products}
      columns={columns}
      views={views}
      activeView={activeView}
      onViewChange={setActiveView}
      enableCustomViews
    />
  )
}
```

---

## Table with Actions

Add row-level and bulk actions.

```typescript
import { DataTable } from "@/components/features/data-table"
import type { RowAction, BulkAction } from "@/components/features/data-table"
import { Edit, Trash, Copy, CheckCircle } from "lucide-react"

const rowActions: RowAction<Product>[] = [
  {
    id: "edit",
    label: "Edit",
    icon: Edit,
    handler: (row) => {
      // Navigate to edit page
      router.push(`/products/${row.original.id}/edit`)
    }
  },
  {
    id: "duplicate",
    label: "Duplicate",
    icon: Copy,
    handler: async (row) => {
      await duplicateProduct(row.original.id)
    }
  },
  {
    id: "delete",
    label: "Delete",
    icon: Trash,
    variant: "destructive",
    separator: true,
    requireConfirmation: true,
    confirmationMessage: (row) =>
      `Are you sure you want to delete "${row.original.name}"?`,
    handler: async (row) => {
      await deleteProduct(row.original.id)
    },
    hidden: (row) => row.original.status === "archived"
  }
]

const bulkActions: BulkAction<Product>[] = [
  {
    id: "activate",
    label: "Activate Selected",
    icon: CheckCircle,
    handler: async (rows) => {
      const ids = rows.map(r => r.original.id)
      await bulkActivateProducts(ids)
    }
  },
  {
    id: "delete",
    label: "Delete Selected",
    icon: Trash,
    variant: "destructive",
    requireConfirmation: true,
    confirmationMessage: (count) =>
      `Are you sure you want to delete ${count} product(s)?`,
    handler: async (rows) => {
      const ids = rows.map(r => r.original.id)
      await bulkDeleteProducts(ids)
    }
  }
]

export default function ProductsPage() {
  return (
    <DataTable
      data={products}
      columns={columns}
      rowActions={rowActions}
      bulkActions={bulkActions}
      enableRowSelection
    />
  )
}
```

---

## Table with Selection

Enable row selection with custom selection handling.

```typescript
'use client'

import * as React from 'react'
import { DataTable } from "@/components/features/data-table"

export default function ProductsPage() {
  const [selectedRows, setSelectedRows] = React.useState<Record<string, boolean>>({})

  const handleSelectionChange = (selection: Record<string, boolean>) => {
    setSelectedRows(selection)

    // Get selected product IDs
    const selectedIds = Object.keys(selection).filter(id => selection[id])
    console.log("Selected products:", selectedIds)
  }

  return (
    <div>
      <DataTable
        data={products}
        columns={columns}
        enableRowSelection
        enableSelectAll
        onRowSelectionChange={handleSelectionChange}
      />

      {Object.keys(selectedRows).length > 0 && (
        <div className="mt-4">
          <p>Selected {Object.keys(selectedRows).length} product(s)</p>
        </div>
      )}
    </div>
  )
}
```

---

## Full-Featured Table

All features enabled.

```typescript
'use client'

import * as React from 'react'
import { DataTable, DataTableColumnHeader } from "@/components/features/data-table"
import type {
  DataTableColumnDef,
  DataTableView,
  RowAction,
  BulkAction
} from "@/components/features/data-table"
import { useDataTableViews } from "@/hooks/use-data-table-views"
import { Edit, Trash, CheckCircle, AlertCircle } from "lucide-react"

// Column definitions with filters
const columns = React.useMemo<DataTableColumnDef<Product>[]>(
  () => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" />
      ),
      filterConfig: {
        type: "text",
        placeholder: "Search products..."
      }
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => `$${row.getValue("price").toFixed(2)}`,
      filterConfig: {
        type: "number",
        min: 0,
        max: 10000
      },
      meta: { align: "right" }
    },
    {
      accessorKey: "status",
      header: "Status",
      filterConfig: {
        type: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ]
      }
    }
  ],
  []
)

// Default views
const defaultViews: DataTableView[] = [
  {
    id: "all",
    name: "All Products",
    isSystem: true,
    isDefault: true,
    filters: { id: "root", operator: "AND", conditions: [] }
  },
  {
    id: "active",
    name: "Active",
    icon: CheckCircle,
    isSystem: true,
    filters: {
      id: "root",
      operator: "AND",
      conditions: [
        {
          id: "status-active",
          column: "status",
          operator: "equals",
          value: "active",
          type: "select"
        }
      ]
    }
  }
]

// Row actions
const rowActions: RowAction<Product>[] = [
  {
    id: "edit",
    label: "Edit",
    icon: Edit,
    handler: (row) => console.log("Edit", row.original)
  },
  {
    id: "delete",
    label: "Delete",
    icon: Trash,
    variant: "destructive",
    separator: true,
    requireConfirmation: true,
    confirmationMessage: (row) => `Delete "${row.original.name}"?`,
    handler: (row) => console.log("Delete", row.original)
  }
]

// Bulk actions
const bulkActions: BulkAction<Product>[] = [
  {
    id: "activate",
    label: "Activate Selected",
    icon: CheckCircle,
    handler: (rows) => console.log("Activate", rows.length, "products")
  }
]

export default function ProductsPage() {
  const { views, activeView, setActiveView } = useDataTableViews({
    storageKey: "products-views",
    defaultViews
  })

  return (
    <DataTable
      data={products}
      columns={columns}

      // Filtering
      enableFiltering
      enableAdvancedFilters

      // Views
      views={views}
      activeView={activeView}
      onViewChange={setActiveView}
      enableCustomViews

      // Sorting
      enableSorting
      enableMultiSort

      // Pagination
      enablePagination
      pagination={{
        pageSize: 25,
        pageSizeOptions: [10, 25, 50, 100]
      }}

      // Selection
      enableRowSelection
      enableSelectAll

      // Search
      enableGlobalSearch
      searchPlaceholder="Search products..."

      // Actions
      rowActions={rowActions}
      bulkActions={bulkActions}

      // Appearance
      variant="lined"
      density="default"
    />
  )
}
```

---

## Shopify-Style Layout (Tabs)

Clean layout with view tabs and hidden toolbar.

```typescript
'use client'

import { Page } from '@/components/ui/page'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableViewTabs
} from '@/components/features/data-table'
import type { DataTableColumnDef, DataTableView } from '@/components/features/data-table'
import { useDataTableViews } from '@/hooks/use-data-table-views'
import { Package, CheckCircle, Send } from 'lucide-react'

const columns: DataTableColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Order #</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('orderNumber')}</span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Customer</span>,
  },
  {
    accessorKey: 'total',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Total</span>,
    cell: ({ row }) => {
      const total = row.getValue('total') as number
      return <span className="font-medium">${total.toFixed(2)}</span>
    },
    meta: { align: 'right' }
  }
]

const defaultViews: DataTableView[] = [
  {
    id: 'all',
    name: 'All Orders',
    isSystem: true,
    isDefault: true,
    filters: { id: 'root', operator: 'AND', conditions: [] },
  },
  {
    id: 'pending',
    name: 'Pending',
    icon: Package,
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [{
        id: 'status-pending',
        column: 'status',
        operator: 'equals',
        value: 'pending',
        type: 'select',
      }],
    },
  },
  {
    id: 'shipped',
    name: 'Shipped',
    icon: Send,
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [{
        id: 'status-shipped',
        column: 'status',
        operator: 'equals',
        value: 'shipped',
        type: 'select',
      }],
    },
  },
  {
    id: 'completed',
    name: 'Completed',
    icon: CheckCircle,
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [{
        id: 'status-completed',
        column: 'status',
        operator: 'equals',
        value: 'completed',
        type: 'select',
      }],
    },
  }
]

export default function OrdersPage() {
  const { views, activeView, setActiveView } = useDataTableViews({
    storageKey: 'orders-table-views',
    defaultViews,
  })

  return (
    <Page title="Orders" subtitle="Manage your orders">
      <div className="rounded-lg border border-border bg-background">
        {/* View tabs at the top */}
        <DataTableViewTabs
          views={views}
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Table with hidden toolbar */}
        <div className="px-4">
          <DataTable
            data={orders}
            columns={columns}
            enableSorting
            enablePagination
            enableRowSelection
            enableGlobalSearch={false}
            hideToolbar
            views={views}
            activeView={activeView}
            onViewChange={setActiveView}
            pagination={{
              pageSize: 25,
              pageSizeOptions: [25, 50, 100],
            }}
            variant="lined"
            density="comfortable"
          />
        </div>
      </div>
    </Page>
  )
}
```

---

## Table with Inline Filters (ReUI)

Modern table with inline filters powered by ReUI Filters component.

```typescript
'use client'

import * as React from 'react'
import { DataTable, DataTableColumnHeader } from "@/components/features/data-table"
import type { DataTableColumnDef } from "@/components/features/data-table"

interface Product {
  id: string
  name: string
  category: string
  price: number
  status: "active" | "inactive"
  stock: number
  createdAt: string
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    category: "electronics",
    price: 29.99,
    status: "active",
    stock: 45,
    createdAt: "2024-01-15"
  },
  // ... more products
]

const columns = React.useMemo<DataTableColumnDef<Product>[]>(
  () => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product Name" />
      ),
      filterConfig: {
        type: "text",
        showInlineFilter: true,
        placeholder: "Search by name..."
      }
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("category")}</span>
      ),
      filterConfig: {
        type: "select",
        showInlineFilter: true,
        options: [
          { label: "Electronics", value: "electronics" },
          { label: "Clothing", value: "clothing" },
          { label: "Food", value: "food" }
        ]
      }
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const price = row.getValue("price") as number
        return <span className="font-medium">${price.toFixed(2)}</span>
      },
      filterConfig: {
        type: "number",
        showInlineFilter: true,
        min: 0,
        max: 1000
      },
      meta: { align: "right" }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const colors = {
          active: "bg-green-500",
          inactive: "bg-gray-500"
        }
        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colors[status]}`} />
            <span className="capitalize">{status}</span>
          </div>
        )
      },
      filterConfig: {
        type: "select",
        showInlineFilter: true,
        options: [
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" }
        ]
      }
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      filterConfig: {
        type: "number",
        showInlineFilter: true,
        min: 0
      },
      meta: { align: "right" }
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <span>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </span>
        )
      },
      filterConfig: {
        type: "date",
        showInlineFilter: true
      }
    }
  ],
  []
)

export default function ProductsPage() {
  return (
    <DataTable
      data={products}
      columns={columns}

      // Enable inline filters
      enableInlineFilters={true}
      inlineFiltersVariant="outline"
      inlineFiltersSize="sm"

      // Other features
      enableSorting
      enablePagination
      enableGlobalSearch

      pagination={{
        pageSize: 25,
        pageSizeOptions: [10, 25, 50, 100]
      }}

      variant="lined"
      density="default"
    />
  )
}
```

**Features:**
- Inline filters for all columns (text, select, number, date)
- Multi-select for category and status
- Number range filter for price
- Date range filter for createdAt
- "Clear all" button to reset filters
- French/English localization

---

## Complex Filters (AND/OR Logic)

Build complex filter expressions with nested groups.

```typescript
import type { FilterGroup } from "@/components/features/data-table"

// Example: Show products that are:
// (status = 'active' OR status = 'pending')
// AND (price > 100 OR stock < 10)
// AND category = 'electronics'

const complexFilter: FilterGroup = {
  id: "root",
  operator: "AND",
  conditions: [
    {
      id: "category-filter",
      column: "category",
      operator: "equals",
      value: "electronics",
      type: "select"
    }
  ],
  groups: [
    {
      id: "status-group",
      operator: "OR",
      conditions: [
        {
          id: "status-active",
          column: "status",
          operator: "equals",
          value: "active",
          type: "select"
        },
        {
          id: "status-pending",
          column: "status",
          operator: "equals",
          value: "pending",
          type: "select"
        }
      ]
    },
    {
      id: "alert-group",
      operator: "OR",
      conditions: [
        {
          id: "price-high",
          column: "price",
          operator: "greaterThan",
          value: 100,
          type: "number"
        },
        {
          id: "stock-low",
          column: "stock",
          operator: "lessThan",
          value: 10,
          type: "number"
        }
      ]
    }
  ]
}

export default function ProductsPage() {
  return (
    <DataTable
      data={products}
      columns={columns}
      defaultFilterGroup={complexFilter}
      enableAdvancedFilters
    />
  )
}
```

---

## Date Formatting (SSR Safe)

Prevent hydration mismatches with consistent date formatting.

```typescript
const columns: DataTableColumnDef<Order>[] = [
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))

      // ✅ Good - Explicit locale prevents hydration mismatch
      return (
        <span>
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
        </span>
      )
    },
    filterConfig: {
      type: "date"
    }
  }
]
```

---

## Custom Empty State

Provide helpful empty states based on context.

```typescript
import { Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const { activeView } = useDataTableViews({...})

  return (
    <DataTable
      data={products}
      columns={columns}
      emptyComponent={
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {activeView?.id === "all"
              ? "Get started by creating your first product"
              : "No products match the current filters"
            }
          </p>
          {activeView?.id === "all" && (
            <Button onClick={() => router.push("/products/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      }
    />
  )
}
```

---

## Controlled State (URL Sync)

Sync table state with URL parameters for shareable links.

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const viewIdFromUrl = searchParams.get('view')

  const [activeView, setActiveView] = React.useState<DataTableView | null>(() => {
    if (viewIdFromUrl) {
      return views.find(v => v.id === viewIdFromUrl) || null
    }
    return null
  })

  const handleViewChange = (view: DataTableView) => {
    setActiveView(view)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view.id)
    router.push(`?${params.toString()}`)
  }

  return (
    <DataTable
      data={products}
      columns={columns}
      views={views}
      activeView={activeView}
      onViewChange={handleViewChange}
    />
  )
}
```

---

For complete documentation, see [DATA_TABLE_README.md](./DATA_TABLE_README.md).
