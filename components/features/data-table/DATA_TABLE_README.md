# DataTable Component Documentation

Complete reference for the DataTable component - an advanced data table built with TanStack React Table v8.

## Table of Contents

- [Overview](#overview)
- [Installation and Import](#installation-and-import)
- [Complete API: Props](#complete-api-props)
- [Essential Types and Interfaces](#essential-types-and-interfaces)
- [Usage Examples](#usage-examples)
- [Available Sub-Components](#available-sub-components)
- [useDataTableViews Hook](#usedatatableviews-hook)
- [Patterns and Best Practices](#patterns-and-best-practices)
- [Filter Operators by Type](#filter-operators-by-type)
- [Common Errors and Solutions](#common-errors-and-solutions)
- [Reference Files](#reference-files)

---

## Overview

The DataTable component is a fully-featured, type-safe table component built on [TanStack React Table v8](https://tanstack.com/table/v8). It provides enterprise-grade features while maintaining flexibility and ease of use.

**Key Features:**
- **Advanced Filtering** - Complex AND/OR filter logic with 13+ operators
- **Predefined Views** - Save and share filter/sort configurations with localStorage persistence
- **Row Selection** - Single or multi-row selection with bulk actions
- **Sorting** - Single and multi-column sorting
- **Pagination** - Built-in pagination controls with customizable page sizes
- **Actions** - Row-level and bulk actions with confirmation dialogs
- **Global Search** - Debounced search across all columns
- **Responsive** - Multiple variants (default, lined, striped) and density levels
- **Type-Safe** - Full TypeScript support with generics

**Typical Use Cases:**
- Admin dashboards with complex data
- E-commerce order/product management
- CRM customer lists
- Inventory management
- Any data-heavy interface requiring filtering and views

**Built with:**
- [TanStack React Table v8](https://tanstack.com/table/v8) - Headless table logic
- [Base UI](https://base-ui.com/) - Headless UI primitives
- [CVA](https://cva.style/) - Component variants
- [Lucide Icons](https://lucide.dev/) - Icon library

---

## Installation and Import

### Basic Imports

```typescript
// Main component
import { DataTable } from "@/components/features/data-table"

// Types (essential for column and view configuration)
import type {
  DataTableColumnDef,
  DataTableView,
  FilterGroup,
  FilterCondition,
  RowAction,
  BulkAction
} from "@/components/features/data-table"

// Hook for view management
import { useDataTableViews } from "@/hooks/use-data-table-views"

// Sub-components (optional, for advanced layouts)
import {
  DataTableColumnHeader,
  DataTableViewTabs
} from "@/components/features/data-table"
```

### Dependencies

The DataTable component requires the following to be installed in your project:
- `@tanstack/react-table` (^8.0.0)
- `@base-ui/react` (^0.1.0)
- `lucide-react` (^0.400.0)
- `class-variance-authority` (^0.7.0)

---

## Complete API: Props

### Required Props

```typescript
data: TData[]
// Array of data objects to display in the table
// Type: Generic array matching your data structure
// Example: Product[], Order[], Customer[]

columns: DataTableColumnDef<TData, TValue>[]
// Column definitions with headers, cells, and filter configs
// See "DataTableColumnDef" section for detailed structure
```

### Optional Props by Category

#### Identification

```typescript
getRowId?: (row: TData) => string
// Custom function to generate unique row IDs
// Default: Uses row index
// Example: (row) => row.id
```

#### Filtering

```typescript
enableFiltering?: boolean
// Enable filter functionality
// Default: true

enableAdvancedFilters?: boolean
// Enable advanced filter builder with AND/OR logic
// Default: true

defaultFilterGroup?: FilterGroup
// Initial filter state
// See "FilterGroup" type below
// Example: { id: "root", operator: "AND", conditions: [...] }

onFilterGroupChange?: (group: FilterGroup | null) => void
// Callback when filters change
// Useful for URL sync or state management
```

#### Views

```typescript
views?: DataTableView[]
// Array of predefined views (filter/sort configurations)
// See "DataTableView" type below

activeView?: DataTableView | null
// Currently active view
// Use with onViewChange for controlled mode

onViewChange?: (view: DataTableView) => void
// Callback when view changes
// Example: (view) => setActiveView(view)

onViewDelete?: (viewId: string) => void
// Callback when user deletes a custom view

onCreateView?: () => void
// Callback to open view creation dialog

enableCustomViews?: boolean
// Allow users to create custom views
// Default: false
```

#### Sorting

```typescript
enableSorting?: boolean
// Enable sorting functionality
// Default: true

enableMultiSort?: boolean
// Allow sorting by multiple columns (shift+click)
// Default: false

defaultSorting?: SortingState
// Initial sort state
// Type: { id: string; desc: boolean }[]
// Example: [{ id: "date", desc: true }]

onSortingChange?: (sorting: SortingState) => void
// Callback when sorting changes
```

#### Pagination

```typescript
enablePagination?: boolean
// Enable pagination controls
// Default: true

pagination?: {
  pageSize: number
  pageSizeOptions?: number[]
}
// Pagination configuration
// Default: { pageSize: 10, pageSizeOptions: [10, 25, 50, 100] }
// Example: { pageSize: 25, pageSizeOptions: [25, 50, 100] }

onPaginationChange?: (state: PaginationState) => void
// Callback when pagination changes
```

#### Selection

```typescript
enableRowSelection?: boolean
// Enable row selection checkboxes
// Default: false

enableSelectAll?: boolean
// Show "select all" checkbox in header
// Default: true (when enableRowSelection is true)

onRowSelectionChange?: (selection: Record<string, boolean>) => void
// Callback when selection changes
// selection is an object like { "row-1": true, "row-3": true }
```

#### Search

```typescript
enableGlobalSearch?: boolean
// Show global search input in toolbar
// Default: true

searchPlaceholder?: string
// Placeholder text for search input
// Default: "Search..."
```

#### Actions

```typescript
rowActions?: RowAction<TData>[]
// Actions available for each row (edit, delete, etc.)
// See "RowAction" type below
// Rendered in a dropdown menu at the end of each row

bulkActions?: BulkAction<TData>[]
// Actions for multiple selected rows
// See "BulkAction" type below
// Shown in toolbar when rows are selected
```

#### Appearance

```typescript
variant?: "default" | "lined" | "striped"
// Visual style of the table
// - "default": Standard table with borders
// - "lined": Horizontal lines only
// - "striped": Alternating row colors
// Default: "default"

density?: "compact" | "default" | "comfortable"
// Row height/padding
// - "compact": Minimal padding (h-8)
// - "default": Standard padding (h-10)
// - "comfortable": Generous padding (h-12)
// Default: "default"

className?: string
// Additional CSS classes for the table container
```

#### States

```typescript
isLoading?: boolean
// Show loading state
// Default: false

loadingComponent?: React.ReactNode
// Custom loading component
// Default: Spinner with "Loading..." text

emptyComponent?: React.ReactNode
// Custom empty state component
// Default: "No results found" message
```

#### Toolbar

```typescript
hideToolbar?: boolean
// Hide the entire toolbar (search, filters, actions)
// Useful when using DataTableViewTabs for a cleaner layout
// Default: false

toolbarActions?: React.ReactNode
// Custom actions to render in the toolbar
// Rendered before filter buttons
// Example: <Button>Export</Button>
```

---

## Essential Types and Interfaces

### DataTableColumnDef

Extends TanStack Table's `ColumnDef` with additional filter configuration.

```typescript
type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  // Filter configuration for this column
  filterConfig?: {
    // Type of data in this column (determines available operators)
    type: "text" | "number" | "date" | "boolean" | "select"

    // Allowed filter operators (optional, defaults to all for type)
    operators?: FilterOperator[]

    // Options for select type (required for type: "select")
    options?: { label: string; value: any }[]

    // Min/max for number type (optional)
    min?: number
    max?: number
    step?: number

    // Placeholder text in filter inputs
    placeholder?: string
  }
}
```

**Example:**

```typescript
const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
    filterConfig: {
      type: "text",
      operators: ["contains", "equals", "startsWith"],
      placeholder: "Search by name..."
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.getValue("price").toFixed(2)}`,
    filterConfig: {
      type: "number",
      min: 0,
      max: 10000,
      step: 0.01
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    filterConfig: {
      type: "select",
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Food", value: "food" }
      ]
    }
  }
]
```

### FilterGroup

Represents a group of filter conditions combined with AND or OR logic. Can be nested for complex queries.

```typescript
interface FilterGroup {
  id: string                    // Unique identifier
  operator: "AND" | "OR"        // How to combine conditions/groups
  conditions: FilterCondition[] // Filter conditions at this level
  groups?: FilterGroup[]        // Nested filter groups (for complex logic)
}
```

### FilterCondition

A single filter condition on a column.

```typescript
interface FilterCondition {
  id: string                    // Unique identifier
  column: string                // Column accessorKey to filter
  operator: FilterOperator      // Comparison operator
  value: any                    // Filter value
  value2?: any                  // Second value (for "between" operator)
  type: "text" | "number" | "date" | "boolean" | "select"
}
```

### FilterOperator

All available filter operators across data types.

```typescript
type FilterOperator =
  // Equality
  | "equals"
  | "notEquals"

  // Text
  | "contains"
  | "notContains"
  | "startsWith"
  | "endsWith"

  // Comparison
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual"
  | "between"

  // List
  | "in"
  | "notIn"

  // Empty
  | "isEmpty"
  | "isNotEmpty"
```

**Example Complex Filter:**

```typescript
// (status = 'active' OR status = 'pending') AND (price > 100)
const complexFilter: FilterGroup = {
  id: "root",
  operator: "AND",
  conditions: [
    {
      id: "price-filter",
      column: "price",
      operator: "greaterThan",
      value: 100,
      type: "number"
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
    }
  ]
}
```

### DataTableView

A saved configuration of filters, sorting, and column settings.

```typescript
interface DataTableView {
  id: string                      // Unique identifier
  name: string                    // Display name
  description?: string            // Optional description
  icon?: LucideIcon               // Optional icon component
  isSystem: boolean               // If true, cannot be deleted by user
  isDefault?: boolean             // If true, selected by default on load

  // Filter configuration
  filters: FilterGroup

  // Sort configuration (optional)
  sorting?: SortingState          // [{ id: "date", desc: true }]

  // Column visibility (optional)
  columnVisibility?: VisibilityState  // { "id": false, "name": true }

  // Column order (optional)
  columnOrder?: string[]          // ["name", "price", "status"]

  // Pinned columns (optional)
  pinnedColumns?: {
    left?: string[]               // Columns pinned to left
    right?: string[]              // Columns pinned to right
  }
}
```

**Example Views:**

```typescript
const defaultViews: DataTableView[] = [
  {
    id: "all",
    name: "All Products",
    isSystem: true,
    isDefault: true,
    filters: {
      id: "root",
      operator: "AND",
      conditions: []  // No filters
    }
  },
  {
    id: "active",
    name: "Active Products",
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
    },
    sorting: [{ id: "name", desc: false }]
  },
  {
    id: "low-stock",
    name: "Low Stock",
    icon: AlertCircle,
    isSystem: false,  // User can delete this
    filters: {
      id: "root",
      operator: "AND",
      conditions: [
        {
          id: "stock-low",
          column: "stock",
          operator: "lessThan",
          value: 10,
          type: "number"
        }
      ]
    }
  }
]
```

### RowAction

Action available for individual rows.

```typescript
interface RowAction<TData> {
  id: string                      // Unique identifier
  label: string                   // Display text
  icon?: LucideIcon               // Optional icon
  variant?: "default" | "outline" | "ghost" | "destructive"

  // Handler function (can be async)
  handler: (row: Row<TData>) => void | Promise<void>

  // Conditional visibility/state
  hidden?: (row: Row<TData>) => boolean
  disabled?: (row: Row<TData>) => boolean

  // Confirmation dialog
  requireConfirmation?: boolean
  confirmationMessage?: string | ((row: Row<TData>) => string)

  // Visual separator before this action
  separator?: boolean

  // Keyboard shortcut (display only)
  shortcut?: string
}
```

**Example Row Actions:**

```typescript
const rowActions: RowAction<Product>[] = [
  {
    id: "edit",
    label: "Edit",
    icon: Edit,
    handler: (row) => {
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
    separator: true,  // Visual separator above
    requireConfirmation: true,
    confirmationMessage: (row) =>
      `Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`,
    handler: async (row) => {
      await deleteProduct(row.original.id)
    },
    // Hide delete for archived products
    hidden: (row) => row.original.status === "archived"
  }
]
```

### BulkAction

Action for multiple selected rows.

```typescript
interface BulkAction<TData> {
  id: string                      // Unique identifier
  label: string                   // Display text
  icon?: LucideIcon               // Optional icon
  variant?: "default" | "outline" | "destructive"

  // Handler receives array of selected rows
  handler: (rows: Row<TData>[]) => void | Promise<void>

  // Conditional state based on selection
  disabled?: (rows: Row<TData>[]) => boolean

  // Confirmation dialog
  requireConfirmation?: boolean
  confirmationMessage?: string | ((count: number) => string)
}
```

**Example Bulk Actions:**

```typescript
const bulkActions: BulkAction<Product>[] = [
  {
    id: "activate",
    label: "Activate Selected",
    icon: CheckCircle,
    handler: async (rows) => {
      const ids = rows.map(r => r.original.id)
      await bulkActivateProducts(ids)
    },
    disabled: (rows) => rows.every(r => r.original.status === "active")
  },
  {
    id: "export",
    label: "Export Selected",
    icon: Download,
    handler: (rows) => {
      const data = rows.map(r => r.original)
      exportToCSV(data)
    }
  },
  {
    id: "delete",
    label: "Delete Selected",
    icon: Trash,
    variant: "destructive",
    requireConfirmation: true,
    confirmationMessage: (count) =>
      `Are you sure you want to delete ${count} product(s)? This action cannot be undone.`,
    handler: async (rows) => {
      const ids = rows.map(r => r.original.id)
      await bulkDeleteProducts(ids)
    }
  }
]
```

---

## Usage Examples

### Example 1: Minimal Configuration

The simplest possible usage with just data and columns.

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

### Example 2: Complete Configuration with All Features

Full-featured table with filtering, views, actions, and customization.

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
import { Edit, Trash, Copy, CheckCircle, AlertCircle, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  status: "active" | "inactive" | "discontinued"
  category: string
  createdAt: string
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    price: 29.99,
    stock: 45,
    status: "active",
    category: "electronics",
    createdAt: "2024-01-15T10:30:00Z"
  },
  // ... more products
]

export default function ProductsPage() {
  // Define columns with filter configs
  const columns = React.useMemo<DataTableColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product Name" />
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
        cell: ({ row }) => {
          const price = row.getValue("price") as number
          return <span className="font-medium">${price.toFixed(2)}</span>
        },
        filterConfig: {
          type: "number",
          min: 0,
          max: 1000,
          step: 0.01
        },
        meta: {
          align: "right"
        }
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock" />
        ),
        filterConfig: {
          type: "number",
          min: 0
        },
        meta: {
          align: "right"
        }
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          const colors = {
            active: "bg-green-500",
            inactive: "bg-gray-500",
            discontinued: "bg-red-500"
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
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Discontinued", value: "discontinued" }
          ]
        }
      },
      {
        accessorKey: "category",
        header: "Category",
        filterConfig: {
          type: "select",
          options: [
            { label: "Electronics", value: "electronics" },
            { label: "Clothing", value: "clothing" },
            { label: "Food", value: "food" }
          ]
        }
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"))
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })
        },
        filterConfig: {
          type: "date"
        }
      }
    ],
    []
  )

  // Define predefined views
  const defaultViews: DataTableView[] = [
    {
      id: "all",
      name: "All Products",
      isSystem: true,
      isDefault: true,
      filters: {
        id: "root",
        operator: "AND",
        conditions: []
      }
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
      id: "low-stock",
      name: "Low Stock",
      icon: AlertCircle,
      isSystem: true,
      filters: {
        id: "root",
        operator: "AND",
        conditions: [
          {
            id: "stock-low",
            column: "stock",
            operator: "lessThan",
            value: 10,
            type: "number"
          }
        ]
      }
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: Package,
      isSystem: false,
      filters: {
        id: "root",
        operator: "AND",
        conditions: [
          {
            id: "category-electronics",
            column: "category",
            operator: "equals",
            value: "electronics",
            type: "select"
          }
        ]
      }
    }
  ]

  // Use the views hook
  const { views, activeView, setActiveView } = useDataTableViews({
    storageKey: "products-table-views",
    defaultViews
  })

  // Define row actions
  const rowActions: RowAction<Product>[] = [
    {
      id: "edit",
      label: "Edit",
      icon: Edit,
      handler: (row) => {
        console.log("Edit product:", row.original)
        // router.push(`/products/${row.original.id}/edit`)
      }
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: Copy,
      handler: async (row) => {
        console.log("Duplicate product:", row.original)
        // await duplicateProduct(row.original.id)
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
        console.log("Delete product:", row.original)
        // await deleteProduct(row.original.id)
      },
      hidden: (row) => row.original.status === "discontinued"
    }
  ]

  // Define bulk actions
  const bulkActions: BulkAction<Product>[] = [
    {
      id: "activate",
      label: "Activate Selected",
      icon: CheckCircle,
      handler: async (rows) => {
        const ids = rows.map(r => r.original.id)
        console.log("Activate products:", ids)
        // await bulkActivateProducts(ids)
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
        console.log("Delete products:", ids)
        // await bulkDeleteProducts(ids)
      }
    }
  ]

  return (
    <div className="container py-10">
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
    </div>
  )
}
```

### Example 3: Minimal Layout with View Tabs (Shopify Style)

Clean layout with tabs for views and hidden toolbar.

```typescript
'use client'

import * as React from 'react'
import { Page } from '@/components/ui/page'
import {
  DataTable,
  DataTableColumnHeader,
  DataTableViewTabs
} from '@/components/features/data-table'
import type { DataTableColumnDef, DataTableView } from '@/components/features/data-table'
import { useDataTableViews } from '@/hooks/use-data-table-views'
import { FileText, Send, CheckCircle, Package } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  date: string
  customerName: string
  status: 'open' | 'invoiced' | 'completed'
  total: number
}

const orders: Order[] = [
  {
    id: '1',
    orderNumber: '#D11',
    date: '2024-01-15',
    customerName: 'John Doe',
    status: 'open',
    total: 185.00
  },
  // ... more orders
]

const columns: DataTableColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Order #</span>,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('orderNumber')}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'date',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Date</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return <span className="text-sm">{date.toLocaleDateString('en-US')}</span>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'customerName',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Customer</span>,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const colors = {
        open: 'bg-yellow-500',
        invoiced: 'bg-blue-500',
        completed: 'bg-green-500'
      }
      return (
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${colors[status]}`} />
          <span className="text-sm capitalize">{status}</span>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'total',
    header: () => <span className="text-xs font-semibold text-muted-foreground">Total</span>,
    cell: ({ row }) => {
      const total = row.getValue('total') as number
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(total)
      return <span className="text-sm font-medium">{formatted}</span>
    },
    enableSorting: true,
    meta: {
      align: 'right',
    },
  },
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
    id: 'open',
    name: 'Open',
    icon: Package,
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [
        {
          id: 'status-open',
          column: 'status',
          operator: 'equals',
          value: 'open',
          type: 'select',
        },
      ],
    },
  },
  {
    id: 'invoiced',
    name: 'Invoiced',
    icon: Send,
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [
        {
          id: 'status-invoiced',
          column: 'status',
          operator: 'equals',
          value: 'invoiced',
          type: 'select',
        },
      ],
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
      conditions: [
        {
          id: 'status-completed',
          column: 'status',
          operator: 'equals',
          value: 'completed',
          type: 'select',
        },
      ],
    },
  },
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

### Example 4: Controlled State (URL Sync)

Sync table state with URL parameters for shareable links.

```typescript
'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/features/data-table'
import type { DataTableView, FilterGroup } from '@/components/features/data-table'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse view ID from URL
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

## Available Sub-Components

### DataTableColumnHeader

Sortable column header with sort indicators.

**Usage:**

```typescript
import { DataTableColumnHeader } from "@/components/features/data-table"

const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
  }
]
```

**Props:**
- `column` - TanStack Table column object
- `title` - Header text to display
- `className` - Optional additional classes

### DataTableViewTabs

Horizontal tabs for view selection (alternative to dropdown selector).

**Usage:**

```typescript
import { DataTableViewTabs } from "@/components/features/data-table"

<DataTableViewTabs
  views={views}
  activeView={activeView}
  onViewChange={setActiveView}
  onCreateView={handleCreateView}  // Optional
  enableCustomViews={true}          // Optional, shows + button
/>
```

**Props:**
- `views` - Array of DataTableView
- `activeView` - Currently selected view
- `onViewChange` - Callback when view is clicked
- `onCreateView` - Optional callback for create view button
- `enableCustomViews` - Show + button to create views

### Internal Sub-Components

These are used internally by DataTable and typically don't need to be imported directly:

- **DataTablePagination** - Pagination controls at bottom of table
- **DataTableRowSelection** - Checkbox for row selection
- **DataTableRowActions** - Dropdown menu for row actions
- **DataTableBulkActions** - Toolbar shown when rows selected
- **DataTableToolbar** - Search bar and filter buttons
- **DataTableFilterBadges** - Active filter chips
- **DataTableFilterBuilder** - Dialog for creating complex filters
- **DataTableViewSelector** - Dropdown for selecting views

---

## useDataTableViews Hook

Custom hook for managing table views with localStorage persistence.

### Usage

```typescript
import { useDataTableViews } from "@/hooks/use-data-table-views"

const {
  views,
  activeView,
  setActiveView,
  saveView,
  updateView,
  deleteView,
  resetViews
} = useDataTableViews({
  storageKey: "my-table-views",
  defaultViews: [...]
})
```

### Parameters

```typescript
interface UseDataTableViewsOptions {
  storageKey: string           // Unique key for localStorage
  defaultViews: DataTableView[] // System views (always present)
}
```

### Return Value

```typescript
{
  views: DataTableView[]                           // All views (system + custom)
  activeView: DataTableView | null                 // Currently selected view
  setActiveView: (view: DataTableView) => void     // Set active view
  saveView: (view: Omit<DataTableView, "createdAt" | "updatedAt">) => void  // Save new view
  updateView: (viewId: string, updates: Partial<DataTableView>) => void     // Update existing view
  deleteView: (viewId: string) => void             // Delete custom view
  resetViews: () => void                           // Reset to default views
}
```

### Example

```typescript
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
    name: "Active Only",
    isSystem: true,
    filters: {
      id: "root",
      operator: "AND",
      conditions: [{
        id: "status-active",
        column: "status",
        operator: "equals",
        value: "active",
        type: "select"
      }]
    }
  }
]

function ProductsTable() {
  const {
    views,
    activeView,
    setActiveView,
    saveView,
    deleteView
  } = useDataTableViews({
    storageKey: "products-views",
    defaultViews
  })

  const handleSaveCustomView = () => {
    saveView({
      id: `custom-${Date.now()}`,
      name: "My Custom View",
      isSystem: false,
      filters: {
        id: "root",
        operator: "AND",
        conditions: [
          {
            id: "price-high",
            column: "price",
            operator: "greaterThan",
            value: 100,
            type: "number"
          }
        ]
      }
    })
  }

  return (
    <DataTable
      data={products}
      columns={columns}
      views={views}
      activeView={activeView}
      onViewChange={setActiveView}
      onViewDelete={deleteView}
    />
  )
}
```

### localStorage Format

Views are stored as JSON under the provided `storageKey`:

```json
{
  "activeViewId": "active",
  "customViews": [
    {
      "id": "custom-1234567890",
      "name": "High Value Products",
      "isSystem": false,
      "filters": {...},
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Patterns and Best Practices

### Pattern 1: Controlled vs Uncontrolled State

#### Uncontrolled (Recommended for Most Cases)

Let the DataTable manage its own state internally.

```typescript
<DataTable
  data={products}
  columns={columns}
  views={defaultViews}
  onViewChange={(view) => console.log("View changed:", view)}
/>
```

**When to use:**
- Simple tables without URL sync
- No external state management needed
- Faster implementation

#### Controlled

Manage state externally for full control.

```typescript
const [activeView, setActiveView] = useState<DataTableView | null>(null)
const [filterGroup, setFilterGroup] = useState<FilterGroup | null>(null)
const [sorting, setSorting] = useState<SortingState>([])

<DataTable
  data={products}
  columns={columns}

  // Controlled view
  activeView={activeView}
  onViewChange={setActiveView}

  // Controlled filters
  defaultFilterGroup={filterGroup}
  onFilterGroupChange={setFilterGroup}

  // Controlled sorting
  defaultSorting={sorting}
  onSortingChange={setSorting}
/>
```

**When to use:**
- URL sync for shareable links
- Global state management (Redux, Zustand)
- Analytics tracking
- Complex state coordination

### Pattern 2: Column Definitions

**Always memoize columns** to prevent unnecessary re-renders.

```typescript
// ❌ Bad - Creates new array on every render
const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "price", header: "Price" },
]

// ✅ Good - Memoized
const columns = React.useMemo<DataTableColumnDef<Product>[]>(
  () => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "price", header: "Price" },
  ],
  [] // Empty deps if columns are static
)

// ✅ Good - Memoized with dependencies
const columns = React.useMemo<DataTableColumnDef<Product>[]>(
  () => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => formatName(row.getValue("name"), locale)
    },
  ],
  [locale] // Re-compute when locale changes
)
```

### Pattern 3: Conditional Actions

Show/hide or enable/disable actions based on row data.

```typescript
const rowActions: RowAction<Product>[] = [
  {
    id: "edit",
    label: "Edit",
    icon: Edit,
    handler: (row) => editProduct(row.original),

    // Hide action for archived products
    hidden: (row) => row.original.status === "archived",

    // Disable if user doesn't have permission
    disabled: (row) => !hasEditPermission(row.original)
  },
  {
    id: "publish",
    label: "Publish",
    icon: Send,
    handler: (row) => publishProduct(row.original),

    // Only show for draft products
    hidden: (row) => row.original.status !== "draft"
  },
  {
    id: "delete",
    label: "Delete",
    variant: "destructive",
    separator: true,
    requireConfirmation: true,
    confirmationMessage: (row) => {
      if (row.original.hasOrders) {
        return `"${row.original.name}" has existing orders. Are you sure you want to delete it?`
      }
      return `Delete "${row.original.name}"?`
    },
    handler: (row) => deleteProduct(row.original.id)
  }
]
```

### Pattern 4: Complex Filters (Nested AND/OR)

Build complex filter logic with nested groups.

```typescript
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
```

### Pattern 5: System vs Custom Views

Distinguish between system views (cannot be deleted) and user-created views.

```typescript
const defaultViews: DataTableView[] = [
  {
    id: "all",
    name: "All Items",
    isSystem: true,      // Cannot be deleted
    isDefault: true,     // Selected by default
    filters: { id: "root", operator: "AND", conditions: [] }
  },
  {
    id: "active",
    name: "Active",
    icon: CheckCircle,
    isSystem: true,      // System view
    filters: {
      id: "root",
      operator: "AND",
      conditions: [{
        id: "1",
        column: "status",
        operator: "equals",
        value: "active",
        type: "select"
      }]
    }
  }
]

// Users can create custom views (isSystem: false)
// These will be persisted in localStorage
// and can be deleted via the UI
```

### Pattern 6: Async Actions with Loading States

Handle async operations in actions.

```typescript
const rowActions: RowAction<Product>[] = [
  {
    id: "publish",
    label: "Publish",
    icon: Send,
    handler: async (row) => {
      try {
        // Show loading state (handled internally)
        await publishProduct(row.original.id)

        // Show success notification
        toast.success(`"${row.original.name}" published successfully`)

        // Refresh data
        mutate()
      } catch (error) {
        // Show error notification
        toast.error("Failed to publish product")
      }
    }
  }
]
```

### Pattern 7: Date Formatting for SSR

Prevent hydration mismatches by using consistent date formatting.

```typescript
{
  accessorKey: "createdAt",
  header: "Created",
  cell: ({ row }) => {
    const date = new Date(row.getValue("createdAt"))

    // ❌ Bad - May cause hydration mismatch
    return <span>{date.toLocaleDateString()}</span>

    // ✅ Good - Explicit locale prevents mismatch
    return (
      <span>
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })}
      </span>
    )
  }
}
```

### Pattern 8: Custom Empty States

Provide helpful empty states based on context.

```typescript
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
      <Button onClick={() => router.push("/products/new")}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  }
/>
```

---

## Filter Operators by Type

### Text Type

Available operators for `type: "text"` columns:

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match (case-sensitive) | "Widget" matches "Widget" |
| `notEquals` | Not equal to | "Widget" excludes "Widget" |
| `contains` | Contains substring (case-insensitive) | "wid" matches "Widget" |
| `notContains` | Does not contain | "gadget" excludes items with "gadget" |
| `startsWith` | Starts with (case-insensitive) | "Wid" matches "Widget" |
| `endsWith` | Ends with (case-insensitive) | "get" matches "Widget" |
| `isEmpty` | Field is empty or null | |
| `isNotEmpty` | Field has a value | |

### Number Type

Available operators for `type: "number"` columns:

| Operator | Description | Requires value2 |
|----------|-------------|-----------------|
| `equals` | Equal to | No |
| `notEquals` | Not equal to | No |
| `greaterThan` | Greater than | No |
| `greaterThanOrEqual` | Greater than or equal | No |
| `lessThan` | Less than | No |
| `lessThanOrEqual` | Less than or equal | No |
| `between` | Between two values (inclusive) | Yes |
| `isEmpty` | Field is null or undefined | No |
| `isNotEmpty` | Field has a numeric value | No |

**Example:**
```typescript
// Between filter
{
  column: "price",
  operator: "between",
  value: 10,      // Min
  value2: 100,    // Max
  type: "number"
}
```

### Date Type

Available operators for `type: "date"` columns:

| Operator | Description | Requires value2 |
|----------|-------------|-----------------|
| `equals` | Same date | No |
| `notEquals` | Different date | No |
| `greaterThan` | After date | No |
| `greaterThanOrEqual` | On or after date | No |
| `lessThan` | Before date | No |
| `lessThanOrEqual` | On or before date | No |
| `between` | Between two dates (inclusive) | Yes |
| `isEmpty` | No date set | No |
| `isNotEmpty` | Has a date | No |

**Note:** Date values should be ISO 8601 strings: `"2024-01-15T00:00:00Z"`

### Select Type

Available operators for `type: "select"` columns:

| Operator | Description | Value Type |
|----------|-------------|------------|
| `equals` | Equals selected value | Single value |
| `notEquals` | Not equal to value | Single value |
| `in` | One of multiple values | Array of values |
| `notIn` | Not in list | Array of values |
| `isEmpty` | No selection | N/A |
| `isNotEmpty` | Has a selection | N/A |

**Example:**
```typescript
// Single value
{
  column: "status",
  operator: "equals",
  value: "active",
  type: "select"
}

// Multiple values
{
  column: "category",
  operator: "in",
  value: ["electronics", "clothing", "food"],
  type: "select"
}
```

### Boolean Type

Available operators for `type: "boolean"` columns:

| Operator | Description | Value |
|----------|-------------|-------|
| `equals` | Is true/false | `true` or `false` |

**Example:**
```typescript
{
  column: "isActive",
  operator: "equals",
  value: true,
  type: "boolean"
}
```

---

## Common Errors and Solutions

### Error 1: Hydration Mismatch with Dates

**Problem:**
```
Error: Hydration failed because the server rendered HTML didn't match the client.
Server: "15/01/2024"
Client: "1/15/2024"
```

**Cause:** `toLocaleDateString()` uses different locales on server vs client.

**Solution:** Specify explicit locale in date formatting:

```typescript
// ❌ Bad
cell: ({ row }) => {
  const date = new Date(row.getValue("date"))
  return <span>{date.toLocaleDateString()}</span>
}

// ✅ Good
cell: ({ row }) => {
  const date = new Date(row.getValue("date"))
  return (
    <span>
      {date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })}
    </span>
  )
}
```

### Error 2: Columns Not Memoized

**Problem:** Table re-renders excessively, performance degrades.

**Cause:** Column definitions recreated on every render.

**Solution:** Wrap columns in `React.useMemo`:

```typescript
// ❌ Bad
const columns = [
  { accessorKey: "name", header: "Name" }
]

// ✅ Good
const columns = React.useMemo<DataTableColumnDef<Product>[]>(
  () => [
    { accessorKey: "name", header: "Name" }
  ],
  []
)
```

### Error 3: TypeScript Cannot Infer Type

**Problem:**
```
Type 'unknown' is not assignable to type 'string'
```

**Cause:** TypeScript cannot infer `TData` type from generic.

**Solution:** Explicitly specify the type:

```typescript
// ❌ TypeScript confused
<DataTable
  data={products}
  columns={columns}
/>

// ✅ Explicit type
<DataTable<Product>
  data={products}
  columns={columns}
/>
```

### Error 4: Filter Not Working

**Problem:** Applied filter doesn't affect table data.

**Cause:** Column `accessorKey` in filter doesn't match column definition.

**Solution:** Ensure filter `column` matches `accessorKey`:

```typescript
// Column definition
{
  accessorKey: "productName",  // ← Must match
  header: "Name"
}

// Filter condition
{
  column: "productName",  // ← Must match
  operator: "contains",
  value: "widget",
  type: "text"
}
```

### Error 5: View Not Persisting

**Problem:** Custom views don't save to localStorage.

**Cause:** Missing or duplicate `storageKey`.

**Solution:** Ensure unique `storageKey` in `useDataTableViews`:

```typescript
// ❌ Bad - Generic key (might conflict)
const { views } = useDataTableViews({
  storageKey: "table-views",
  defaultViews
})

// ✅ Good - Specific unique key
const { views } = useDataTableViews({
  storageKey: "products-table-views",
  defaultViews
})
```

### Error 6: Actions Not Showing

**Problem:** Row actions don't appear in dropdown.

**Cause:** Missing `rowActions` prop or all actions are `hidden`.

**Solution:** Verify `rowActions` prop and `hidden` conditions:

```typescript
// Check if rowActions is passed
<DataTable
  data={products}
  columns={columns}
  rowActions={rowActions}  // ← Must be present
/>

// Check hidden conditions
const rowActions: RowAction<Product>[] = [
  {
    id: "edit",
    label: "Edit",
    handler: (row) => edit(row),
    // Verify this doesn't hide all rows
    hidden: (row) => row.original.status === "archived"
  }
]
```

### Error 7: Async Actions Not Awaited

**Problem:** Action completes but UI doesn't update.

**Cause:** Async handler not properly awaited or data not refreshed.

**Solution:** Use async/await and trigger data refresh:

```typescript
const rowActions: RowAction<Product>[] = [
  {
    id: "delete",
    label: "Delete",
    handler: async (row) => {
      // Await the async operation
      await deleteProduct(row.original.id)

      // Refresh data (method depends on your data fetching)
      mutate()           // SWR
      refetch()          // React Query
      fetchProducts()    // Manual
    }
  }
]
```

### Error 8: Filter Operators Not Available

**Problem:** Expected operator not showing in filter builder.

**Cause:** Operators not specified in `filterConfig` or wrong data type.

**Solution:** Explicitly define operators or verify type:

```typescript
// Specify allowed operators
{
  accessorKey: "price",
  header: "Price",
  filterConfig: {
    type: "number",
    operators: ["greaterThan", "lessThan", "between"]  // ← Explicit
  }
}

// Or verify type matches data
{
  accessorKey: "status",
  header: "Status",
  filterConfig: {
    type: "select",  // ← Must be "select" for dropdown
    options: [...]
  }
}
```

---

## Reference Files

### Complete Examples

#### Full-Featured Table
- **File:** `/examples/nextjs-app/app/(frame)/orders/page.tsx`
- **Features:** Toolbar, filters, views dropdown, row actions, bulk actions
- **Data:** 15 orders with 7 columns (order number, date, customer, status, payment, total, tracking)
- **Views:** 6 predefined views (All, Pending, Processing, Shipped, Delivered, Cancelled)

#### Minimal Layout with Tabs (Shopify Style)
- **File:** `/examples/nextjs-app/app/(frame)/commandes/page.tsx`
- **Features:** View tabs, hidden toolbar, clean layout
- **Data:** 11 commandes with client subtitles
- **Views:** 6 tab-based views (Toutes, Ouvertes et facture envoyée, Ouvertes, Facture envoyée, Terminées, Soumises pour examen)

### Type Definitions

- **File:** `/examples/nextjs-app/components/features/data-table/data-table.types.ts`
- **Contains:** All TypeScript interfaces and types
  - `DataTableColumnDef`
  - `FilterGroup` and `FilterCondition`
  - `DataTableView`
  - `RowAction` and `BulkAction`
  - `FilterOperator` type union
  - Column filter config interfaces

### Utilities

- **File:** `/examples/nextjs-app/components/features/data-table/data-table.utils.ts`
- **Contains:** Helper functions
  - `evaluateFilterCondition` - Single condition evaluation
  - `evaluateFilterGroup` - Recursive group evaluation (AND/OR)
  - Filter matching logic for all data types

### Components

#### Main Component
- **File:** `/examples/nextjs-app/components/features/data-table/data-table.tsx`
- **Description:** Core DataTable component with all features

#### Sub-Components
- **File:** `/examples/nextjs-app/components/features/data-table/data-table-column-header.tsx`
  - Sortable column header

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-view-tabs.tsx`
  - Horizontal tabs for view selection

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-toolbar.tsx`
  - Search bar and filter controls

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-filter-builder.tsx`
  - Advanced filter creation dialog

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-view-selector.tsx`
  - Dropdown for view selection

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-pagination.tsx`
  - Pagination controls

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-row-actions.tsx`
  - Row action dropdown menu

- **File:** `/examples/nextjs-app/components/features/data-table/data-table-bulk-actions.tsx`
  - Bulk action toolbar

#### Barrel Export
- **File:** `/examples/nextjs-app/components/features/data-table/index.ts`
- **Description:** Re-exports all public components and types

### Hooks

- **File:** `/examples/nextjs-app/hooks/use-data-table-views.ts`
- **Description:** Hook for managing views with localStorage persistence
- **Functions:** `useDataTableViews`

### Configuration Examples

- **File:** `/examples/nextjs-app/config/navigation.ts`
- **Description:** Sidebar navigation with links to example pages

---

## Additional Resources

### TanStack Table Documentation
- [Official Docs](https://tanstack.com/table/v8)
- [API Reference](https://tanstack.com/table/v8/docs/api/core/table)
- [Examples](https://tanstack.com/table/v8/docs/examples/react/basic)

### Base UI Documentation
- [Official Docs](https://base-ui.com/)
- [Menu Component](https://base-ui.com/react/components/menu)
- [Popover Component](https://base-ui.com/react/components/popover)

### Related Patterns
- [Server-Side Filtering/Sorting](https://tanstack.com/table/v8/docs/guide/pagination#manual-server-side-pagination)
- [Virtualization](https://tanstack.com/table/v8/docs/guide/virtualization)
- [Column Resizing](https://tanstack.com/table/v8/docs/guide/column-sizing)

---

## Migration from Standard Tables

If you're migrating from a basic HTML table or simpler table component:

1. **Define your data type:**
   ```typescript
   interface Product {
     id: string
     name: string
     price: number
   }
   ```

2. **Convert columns:**
   ```typescript
   // Before: <th>Product Name</th>
   // After:
   {
     accessorKey: "name",
     header: "Product Name"
   }
   ```

3. **Add the DataTable:**
   ```typescript
   <DataTable
     data={products}
     columns={columns}
   />
   ```

4. **Gradually add features:**
   - Start with basic sorting: `enableSorting`
   - Add pagination: `enablePagination`
   - Add filters: `enableFiltering`
   - Add views: `views` + `useDataTableViews`
   - Add actions: `rowActions` and `bulkActions`

---

## Summary

The DataTable component provides a complete solution for data-heavy interfaces with:

- ✅ **Type-safe** with full TypeScript support
- ✅ **Flexible** with 25+ configuration props
- ✅ **Powerful** with advanced filtering and views
- ✅ **Accessible** built on Base UI primitives
- ✅ **Performant** with TanStack Table v8
- ✅ **Customizable** with variants and density levels
- ✅ **Documented** with comprehensive examples and patterns

For questions or issues, refer to the [reference files](#reference-files) section or check the live examples in `/app/(frame)/orders` and `/app/(frame)/commandes`.
