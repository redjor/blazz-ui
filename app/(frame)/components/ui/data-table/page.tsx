"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { DataTable } from "@/components/features/data-table/data-table"
import { createUserManagementPreset } from "@/components/features/data-table/presets/users"
import type { User } from "@/types/user-management"
import type { DataTableColumnDef } from "@/components/features/data-table/data-table.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data for examples
const mockUsers = [
	{
		id: "1",
		email: "alice@example.com",
		name: "Alice Johnson",
		firstName: "Alice",
		lastName: "Johnson",
		username: "alice",
		status: "active",
		lastSignedIn: "2024-01-15",
		createdAt: "2023-06-10",
	},
	{
		id: "2",
		email: "bob@example.com",
		name: "Bob Smith",
		firstName: "Bob",
		lastName: "Smith",
		username: "bob",
		status: "active",
		lastSignedIn: "2024-01-14",
		createdAt: "2023-07-22",
	},
	{
		id: "3",
		email: "charlie@example.com",
		name: "Charlie Brown",
		firstName: "Charlie",
		lastName: "Brown",
		username: "charlie",
		status: "suspended",
		lastSignedIn: "2024-01-10",
		createdAt: "2023-05-15",
	},
	{
		id: "4",
		email: "diana@example.com",
		name: "Diana Prince",
		firstName: "Diana",
		lastName: "Prince",
		username: "diana",
		status: "inactive",
		lastSignedIn: "2023-12-01",
		createdAt: "2023-08-30",
	},
	{
		id: "5",
		email: "evan@example.com",
		name: "Evan Davis",
		firstName: "Evan",
		lastName: "Davis",
		username: "evan",
		status: "never_active",
		lastSignedIn: null,
		createdAt: "2024-01-05",
	},
] as User[]

// Simple product data for basic examples
interface Product {
	id: string
	name: string
	category: string
	price: number
	stock: number
	status: "in_stock" | "low_stock" | "out_of_stock"
}

const mockProducts: Product[] = [
	{ id: "1", name: "Laptop Pro", category: "Electronics", price: 1299, stock: 15, status: "in_stock" },
	{ id: "2", name: "Wireless Mouse", category: "Electronics", price: 29, stock: 3, status: "low_stock" },
	{ id: "3", name: "USB-C Cable", category: "Accessories", price: 19, stock: 0, status: "out_of_stock" },
	{ id: "4", name: "Desk Lamp", category: "Office", price: 45, stock: 22, status: "in_stock" },
	{ id: "5", name: "Notebook Set", category: "Stationery", price: 12, stock: 50, status: "in_stock" },
]

const dataTableProps: PropDefinition[] = [
	{
		name: "data",
		type: "TData[]",
		description: "Array of data objects to display in the table.",
	},
	{
		name: "columns",
		type: "DataTableColumnDef<TData>[]",
		description: "Column definitions for the table.",
	},
	{
		name: "enableSorting",
		type: "boolean",
		default: "true",
		description: "Enable column sorting functionality.",
	},
	{
		name: "enablePagination",
		type: "boolean",
		default: "true",
		description: "Enable pagination controls.",
	},
	{
		name: "enableRowSelection",
		type: "boolean",
		default: "false",
		description: "Enable row selection with checkboxes.",
	},
	{
		name: "enableGlobalSearch",
		type: "boolean",
		default: "true",
		description: "Enable global search functionality.",
	},
	{
		name: "enableAdvancedFilters",
		type: "boolean",
		default: "false",
		description: "Enable advanced filter builder with AND/OR logic.",
	},
	{
		name: "views",
		type: "DataTableView[]",
		description: "Predefined views for quick filtering and sorting.",
	},
	{
		name: "activeView",
		type: "DataTableView | null",
		description: "Currently active view.",
	},
	{
		name: "onViewChange",
		type: "(view: DataTableView) => void",
		description: "Callback when view changes.",
	},
	{
		name: "enableCustomViews",
		type: "boolean",
		default: "false",
		description: "Allow users to create and save custom views.",
	},
	{
		name: "rowActions",
		type: "RowAction<TData>[]",
		description: "Actions available for each row (edit, delete, etc.).",
	},
	{
		name: "bulkActions",
		type: "BulkAction<TData>[]",
		description: "Actions available for multiple selected rows.",
	},
	{
		name: "variant",
		type: '"default" | "lined" | "striped"',
		default: '"lined"',
		description: "Visual style variant of the table.",
	},
	{
		name: "density",
		type: '"compact" | "default" | "comfortable"',
		default: '"default"',
		description: "Row spacing density.",
	},
	{
		name: "pagination",
		type: "PaginationConfig",
		description: "Pagination configuration (pageSize, pageSizeOptions).",
	},
	{
		name: "locale",
		type: '"fr" | "en"',
		default: '"en"',
		description: "Locale for internationalization.",
	},
]

export default function DataTablePage() {
	// Basic example columns
	const productColumns: DataTableColumnDef<Product>[] = [
		{
			accessorKey: "name",
			header: "Product",
			enableSorting: true,
		},
		{
			accessorKey: "category",
			header: "Category",
			enableSorting: true,
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => `$${row.getValue("price")}`,
			enableSorting: true,
		},
		{
			accessorKey: "stock",
			header: "Stock",
			enableSorting: true,
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("status") as string
				const variantMap = {
					in_stock: "success" as const,
					low_stock: "warning" as const,
					out_of_stock: "critical" as const,
				}
				return (
					<Badge variant={variantMap[status as keyof typeof variantMap]}>
						{status.replace("_", " ")}
					</Badge>
				)
			},
		},
	]

	// User management preset
	const userPreset = createUserManagementPreset({
		onView: (user) => console.log("View user:", user),
		onEdit: (user) => console.log("Edit user:", user),
		onSuspend: (user) => console.log("Suspend user:", user),
		onDelete: (user) => console.log("Delete user:", user),
		onBulkSuspend: (users) => console.log("Bulk suspend:", users),
		onBulkDelete: (users) => console.log("Bulk delete:", users),
	})

	return (
		<Page
			title="Data Table"
			subtitle="Enterprise-grade data table with advanced filtering, sorting, pagination, and bulk actions. Built with TanStack React Table v8."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Table"
					description="Simple data table with sorting and pagination."
					code={`const columns: DataTableColumnDef<Product>[] = [
  { accessorKey: "name", header: "Product", enableSorting: true },
  { accessorKey: "category", header: "Category", enableSorting: true },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => \`$\${row.getValue("price")}\`
  },
]

<DataTable
  data={products}
  columns={columns}
  enableSorting
  enablePagination
  pagination={{ pageSize: 10 }}
/>`}
				>
					<DataTable
						data={mockProducts}
						columns={productColumns}
						enableSorting
						enablePagination
						pagination={{ pageSize: 5 }}
					/>
				</ComponentExample>

				{/* With Row Selection */}
				<ComponentExample
					title="With Row Selection"
					description="Enable row selection with checkboxes for bulk operations."
					code={`<DataTable
  data={products}
  columns={columns}
  enableRowSelection
  enablePagination
  pagination={{ pageSize: 10 }}
/>`}
				>
					<DataTable
						data={mockProducts}
						columns={productColumns}
						enableRowSelection
						enablePagination
						pagination={{ pageSize: 5 }}
					/>
				</ComponentExample>

				{/* Variants */}
				<ComponentExample
					title="Visual Variants"
					description="Different visual styles: lined (default), striped, and default."
					code={`// Lined (default)
<DataTable variant="lined" data={products} columns={columns} />

// Striped rows
<DataTable variant="striped" data={products} columns={columns} />

// Default (no borders)
<DataTable variant="default" data={products} columns={columns} />`}
				>
					<div className="space-y-8">
						<div>
							<h4 className="text-sm font-semibold mb-2">Lined (Default)</h4>
							<DataTable
								data={mockProducts.slice(0, 3)}
								columns={productColumns.slice(0, 3)}
								variant="lined"
								enablePagination={false}
							/>
						</div>
						<div>
							<h4 className="text-sm font-semibold mb-2">Striped</h4>
							<DataTable
								data={mockProducts.slice(0, 3)}
								columns={productColumns.slice(0, 3)}
								variant="striped"
								enablePagination={false}
							/>
						</div>
					</div>
				</ComponentExample>

				{/* Density */}
				<ComponentExample
					title="Density Options"
					description="Control row spacing with compact, default, or comfortable density."
					code={`// Compact spacing
<DataTable density="compact" data={products} columns={columns} />

// Default spacing
<DataTable density="default" data={products} columns={columns} />

// Comfortable spacing
<DataTable density="comfortable" data={products} columns={columns} />`}
				>
					<div className="space-y-8">
						<div>
							<h4 className="text-sm font-semibold mb-2">Compact</h4>
							<DataTable
								data={mockProducts.slice(0, 3)}
								columns={productColumns.slice(0, 3)}
								density="compact"
								enablePagination={false}
							/>
						</div>
						<div>
							<h4 className="text-sm font-semibold mb-2">Comfortable</h4>
							<DataTable
								data={mockProducts.slice(0, 3)}
								columns={productColumns.slice(0, 3)}
								density="comfortable"
								enablePagination={false}
							/>
						</div>
					</div>
				</ComponentExample>

				{/* Full-Featured with Preset */}
				<ComponentExample
					title="Full-Featured with Preset"
					description="Complete example using the User Management preset with views, filters, row actions, and bulk actions."
					code={`import { createUserManagementPreset } from "@/components/features/data-table/presets/users"

const preset = createUserManagementPreset({
  onView: (user) => router.push(\`/users/\${user.id}\`),
  onEdit: (user) => router.push(\`/users/\${user.id}/edit\`),
  onSuspend: async (user) => await suspendUser(user.id),
  onDelete: async (user) => await deleteUser(user.id),
  onBulkSuspend: async (users) => await bulkSuspendUsers(users),
  onBulkDelete: async (users) => await bulkDeleteUsers(users),
})

<DataTable
  data={users}
  columns={preset.columns}
  views={preset.views}
  rowActions={preset.rowActions}
  bulkActions={preset.bulkActions}
  enableSorting
  enablePagination
  enableRowSelection
  enableGlobalSearch
  enableAdvancedFilters
  enableCustomViews
  pagination={{ pageSize: 25 }}
/>`}
				>
					<DataTable
						data={mockUsers}
						columns={userPreset.columns}
						views={userPreset.views}
						rowActions={userPreset.rowActions}
						bulkActions={userPreset.bulkActions}
						enableSorting
						enablePagination
						enableRowSelection
						enableGlobalSearch
						enableAdvancedFilters
						enableCustomViews
						pagination={{ pageSize: 5 }}
					/>
				</ComponentExample>

				{/* Props Table */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={dataTableProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						DataTable uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-bg-surface</code> - Table background
						</li>
						<li>
							<code className="text-xs">border-p-border</code> - Row and cell borders
						</li>
						<li>
							<code className="text-xs">hover:bg-p-bg-surface-hover</code> - Row hover state
						</li>
						<li>
							<code className="text-xs">data-[state=selected]:bg-p-bg-surface-selected</code> - Selected row
						</li>
						<li>
							<code className="text-xs">text-p-text</code> - Primary text color
						</li>
						<li>
							<code className="text-xs">text-p-text-secondary</code> - Secondary text (headers)
						</li>
						<li>
							<code className="text-xs">p-p-2 to p-p-4</code> - Cell padding based on density
						</li>
						<li>
							<code className="text-xs">rounded-p-lg</code> - Filter badges and controls
						</li>
					</ul>
				</section>

				{/* Features */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Key Features</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Filtering & Search</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Global search with debouncing</li>
								<li>Advanced filter builder with AND/OR logic</li>
								<li>Inline column filters</li>
								<li>Predefined filter views</li>
							</ul>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Sorting & Views</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Single and multi-column sorting</li>
								<li>Predefined views with saved state</li>
								<li>Custom user-created views</li>
								<li>View duplication and renaming</li>
							</ul>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Selection & Actions</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Row selection with checkboxes</li>
								<li>Select all functionality</li>
								<li>Row-level actions menu</li>
								<li>Bulk actions for selected rows</li>
							</ul>
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-sm">Pagination & Performance</h3>
							<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
								<li>Customizable page sizes</li>
								<li>Page info display</li>
								<li>Optimized rendering</li>
								<li>Debounced search</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Presets */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Available Presets</h2>
					<p className="text-sm text-p-text-secondary">
						Presets provide pre-configured columns, views, and actions for common use cases:
					</p>
					<div className="space-y-3">
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-1">User Management</h3>
							<code className="text-xs text-p-text-secondary">
								createUserManagementPreset()
							</code>
							<p className="text-sm text-muted-foreground mt-2">
								User listing with status filtering, role management, and bulk operations.
							</p>
						</div>
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-1">Invitations</h3>
							<code className="text-xs text-p-text-secondary">
								createInvitationsPreset()
							</code>
							<p className="text-sm text-muted-foreground mt-2">
								Invitation management with status tracking and resend functionality.
							</p>
						</div>
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-1">E-commerce Products</h3>
							<code className="text-xs text-p-text-secondary">
								createEcommercePreset()
							</code>
							<p className="text-sm text-muted-foreground mt-2">
								Product catalog with inventory, pricing, and category management.
							</p>
						</div>
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-1">CRM Contacts</h3>
							<code className="text-xs text-p-text-secondary">
								createCRMPreset()
							</code>
							<p className="text-sm text-muted-foreground mt-2">
								Contact management with lead status and engagement tracking.
							</p>
						</div>
						<div className="border border-p-border rounded-p-lg p-p-4">
							<h3 className="font-semibold text-sm mb-1">Order Management</h3>
							<code className="text-xs text-p-text-secondary">
								createOrdersPreset()
							</code>
							<p className="text-sm text-muted-foreground mt-2">
								Order tracking with fulfillment status and customer details.
							</p>
						</div>
					</div>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use presets when available to save development time</li>
						<li>Enable pagination for datasets with more than 25 rows</li>
						<li>Use advanced filters for complex data filtering needs</li>
						<li>Provide row actions for common operations (view, edit, delete)</li>
						<li>Enable bulk actions when users need to operate on multiple rows</li>
						<li>Use custom views to save frequently used filter combinations</li>
						<li>Keep columns sortable unless there's a specific reason not to</li>
						<li>Use appropriate density for your use case (compact for dashboards, comfortable for detailed views)</li>
						<li>Implement proper loading and empty states</li>
						<li>Consider internationalization if supporting multiple languages</li>
					</ul>
				</section>

				{/* Column Definition */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Column Definition</h2>
					<p className="text-sm text-p-text-secondary">
						Columns extend TanStack Table's ColumnDef with additional filter configuration:
					</p>
					<pre className="bg-p-bg-surface-secondary p-p-4 rounded-p-lg overflow-x-auto">
						<code className="text-xs">{`const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    enableSorting: true,
    filterConfig: {
      type: "text",
      placeholder: "Search products...",
      showInlineFilter: true,
      defaultInlineFilter: true,
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
    filterConfig: {
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ],
      showInlineFilter: true,
    }
  }
]`}</code>
					</pre>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Uses semantic HTML table elements</li>
						<li>Keyboard navigable with proper focus management</li>
						<li>ARIA attributes for sorting state and selection</li>
						<li>Screen reader announcements for actions and state changes</li>
						<li>Proper label associations for checkboxes and controls</li>
						<li>High contrast support in all variants</li>
						<li>Focus indicators on all interactive elements</li>
					</ul>
				</section>

				{/* Related Components */}
				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For simple tables without advanced features, use the Table component</li>
						<li>For data visualization, consider using charts from the reporting library</li>
						<li>Use Badge component for status indicators in cells</li>
						<li>Use Avatar component for user information in cells</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
