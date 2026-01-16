import type { Meta, StoryObj } from "@storybook/react"
import { AlertCircle, CheckCircle, Copy, Edit, Package, Send, Trash, XCircle } from "lucide-react"
import { useDataTableViews } from "@/hooks/use-data-table-views"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "./data-table.types"
import { DataTable, DataTableColumnHeader, DataTableViewTabs } from "./index"

// Sample data type
interface Product {
	id: string
	name: string
	price: number
	stock: number
	status: "active" | "inactive" | "discontinued"
	category: "electronics" | "clothing" | "food" | "furniture"
	createdAt: string
}

// Sample data
const sampleProducts: Product[] = [
	{
		id: "1",
		name: "Wireless Mouse",
		price: 29.99,
		stock: 45,
		status: "active",
		category: "electronics",
		createdAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "2",
		name: "Mechanical Keyboard",
		price: 89.99,
		stock: 23,
		status: "active",
		category: "electronics",
		createdAt: "2024-01-14T14:20:00Z",
	},
	{
		id: "3",
		name: "USB-C Cable",
		price: 12.99,
		stock: 150,
		status: "active",
		category: "electronics",
		createdAt: "2024-01-13T09:15:00Z",
	},
	{
		id: "4",
		name: "Cotton T-Shirt",
		price: 19.99,
		stock: 8,
		status: "active",
		category: "clothing",
		createdAt: "2024-01-12T16:45:00Z",
	},
	{
		id: "5",
		name: "Denim Jeans",
		price: 49.99,
		stock: 0,
		status: "inactive",
		category: "clothing",
		createdAt: "2024-01-11T11:30:00Z",
	},
	{
		id: "6",
		name: "Office Chair",
		price: 249.99,
		stock: 12,
		status: "active",
		category: "furniture",
		createdAt: "2024-01-10T08:00:00Z",
	},
	{
		id: "7",
		name: "Desk Lamp",
		price: 34.99,
		stock: 28,
		status: "active",
		category: "furniture",
		createdAt: "2024-01-09T13:20:00Z",
	},
	{
		id: "8",
		name: "Organic Coffee",
		price: 15.99,
		stock: 67,
		status: "active",
		category: "food",
		createdAt: "2024-01-08T10:10:00Z",
	},
	{
		id: "9",
		name: "Green Tea",
		price: 9.99,
		stock: 5,
		status: "active",
		category: "food",
		createdAt: "2024-01-07T15:30:00Z",
	},
	{
		id: "10",
		name: "Vintage Radio",
		price: 79.99,
		stock: 3,
		status: "discontinued",
		category: "electronics",
		createdAt: "2023-12-15T12:00:00Z",
	},
	{
		id: "11",
		name: "Running Shoes",
		price: 89.99,
		stock: 42,
		status: "active",
		category: "clothing",
		createdAt: "2024-01-06T09:45:00Z",
	},
	{
		id: "12",
		name: "Bookshelf",
		price: 129.99,
		stock: 8,
		status: "active",
		category: "furniture",
		createdAt: "2024-01-05T14:15:00Z",
	},
	{
		id: "13",
		name: "Protein Bar Pack",
		price: 24.99,
		stock: 95,
		status: "active",
		category: "food",
		createdAt: "2024-01-04T11:25:00Z",
	},
	{
		id: "14",
		name: "Laptop Stand",
		price: 39.99,
		stock: 0,
		status: "inactive",
		category: "electronics",
		createdAt: "2024-01-03T16:50:00Z",
	},
	{
		id: "15",
		name: "Yoga Mat",
		price: 29.99,
		stock: 31,
		status: "active",
		category: "furniture",
		createdAt: "2024-01-02T08:30:00Z",
	},
]

// Basic columns
const basicColumns: DataTableColumnDef<Product>[] = [
	{
		accessorKey: "name",
		header: "Product Name",
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => {
			const price = row.getValue("price") as number
			return <span className="font-medium">${price.toFixed(2)}</span>
		},
	},
	{
		accessorKey: "stock",
		header: "Stock",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			return <span className="capitalize">{status}</span>
		},
	},
]

// Columns with filters
const columnsWithFilters: DataTableColumnDef<Product>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
		filterConfig: {
			type: "text",
			operators: ["contains", "equals", "startsWith"],
			placeholder: "Search products...",
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
		cell: ({ row }) => {
			const price = row.getValue("price") as number
			return <span className="font-medium">${price.toFixed(2)}</span>
		},
		filterConfig: {
			type: "number",
			min: 0,
			max: 1000,
			step: 0.01,
		},
		meta: {
			align: "right",
		},
	},
	{
		accessorKey: "stock",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
		filterConfig: {
			type: "number",
			min: 0,
		},
		meta: {
			align: "right",
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			const colors = {
				active: "bg-green-500",
				inactive: "bg-gray-500",
				discontinued: "bg-red-500",
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
				{ label: "Discontinued", value: "discontinued" },
			],
		},
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			const category = row.getValue("category") as string
			return <span className="capitalize">{category}</span>
		},
		filterConfig: {
			type: "select",
			options: [
				{ label: "Electronics", value: "electronics" },
				{ label: "Clothing", value: "clothing" },
				{ label: "Food", value: "food" },
				{ label: "Furniture", value: "furniture" },
			],
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"))
			return (
				<span>
					{date.toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</span>
			)
		},
		filterConfig: {
			type: "date",
		},
	},
]

// Default views
const defaultViews: DataTableView[] = [
	{
		id: "all",
		name: "All Products",
		isSystem: true,
		isDefault: true,
		filters: { id: "root", operator: "AND", conditions: [] },
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
					type: "select",
				},
			],
		},
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
					type: "number",
				},
			],
		},
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
					type: "select",
				},
			],
		},
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
					type: "select",
				},
			],
		},
	},
]

// Row actions
const rowActions: RowAction<Product>[] = [
	{
		id: "edit",
		label: "Edit",
		icon: Edit,
		handler: (row) => {
			console.log("Edit product:", row.original)
			alert(`Edit: ${row.original.name}`)
		},
	},
	{
		id: "duplicate",
		label: "Duplicate",
		icon: Copy,
		handler: (row) => {
			console.log("Duplicate product:", row.original)
			alert(`Duplicate: ${row.original.name}`)
		},
	},
	{
		id: "delete",
		label: "Delete",
		icon: Trash,
		variant: "destructive",
		separator: true,
		requireConfirmation: true,
		confirmationMessage: (row) =>
			`Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`,
		handler: (row) => {
			console.log("Delete product:", row.original)
			alert(`Deleted: ${row.original.name}`)
		},
		hidden: (row) => row.original.status === "discontinued",
	},
]

// Bulk actions
const bulkActions: BulkAction<Product>[] = [
	{
		id: "activate",
		label: "Activate Selected",
		icon: CheckCircle,
		handler: (rows) => {
			const ids = rows.map((r) => r.original.id)
			console.log("Activate products:", ids)
			alert(`Activated ${rows.length} product(s)`)
		},
		disabled: (rows) => rows.every((r) => r.original.status === "active"),
	},
	{
		id: "export",
		label: "Export Selected",
		icon: Send,
		handler: (rows) => {
			console.log(
				"Export products:",
				rows.map((r) => r.original)
			)
			alert(`Exported ${rows.length} product(s)`)
		},
	},
	{
		id: "delete",
		label: "Delete Selected",
		icon: Trash,
		variant: "destructive",
		requireConfirmation: true,
		confirmationMessage: (count) =>
			`Are you sure you want to delete ${count} product(s)? This action cannot be undone.`,
		handler: (rows) => {
			const ids = rows.map((r) => r.original.id)
			console.log("Delete products:", ids)
			alert(`Deleted ${rows.length} product(s)`)
		},
	},
]

const meta = {
	title: "Features/DataTable",
	component: DataTable,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "lined", "striped"],
		},
		density: {
			control: "select",
			options: ["compact", "default", "comfortable"],
		},
		enableSorting: {
			control: "boolean",
		},
		enablePagination: {
			control: "boolean",
		},
		enableRowSelection: {
			control: "boolean",
		},
		enableGlobalSearch: {
			control: "boolean",
		},
		enableFiltering: {
			control: "boolean",
		},
		enableAdvancedFilters: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

// 1. Basic table with minimal configuration
export const Basic: Story = {
	args: {
		data: sampleProducts.slice(0, 5),
		columns: basicColumns,
	},
}

// 2. With filters enabled
export const WithFilters: Story = {
	args: {
		data: sampleProducts,
		columns: columnsWithFilters,
		enableFiltering: true,
		enableAdvancedFilters: true,
		enableGlobalSearch: true,
	},
}

// 3. With views
export const WithViews: Story = {
	render: () => {
		const ViewsExample = () => {
			const { views, activeView, setActiveView } = useDataTableViews({
				storageKey: "storybook-products-views",
				defaultViews,
			})

			return (
				<DataTable
					data={sampleProducts}
					columns={columnsWithFilters}
					enableFiltering
					enableAdvancedFilters
					views={views}
					activeView={activeView}
					onViewChange={setActiveView}
					enableCustomViews
				/>
			)
		}

		return <ViewsExample />
	},
}

// 4. With actions (row and bulk)
export const WithActions: Story = {
	args: {
		data: sampleProducts,
		columns: columnsWithFilters,
		enableRowSelection: true,
		rowActions,
		bulkActions,
	},
}

// 5. With selection
export const WithSelection: Story = {
	args: {
		data: sampleProducts,
		columns: columnsWithFilters,
		enableRowSelection: true,
		enableSelectAll: true,
	},
}

// 6. Full-featured table
export const FullFeatured: Story = {
	render: () => {
		const FullFeaturedExample = () => {
			const { views, activeView, setActiveView } = useDataTableViews({
				storageKey: "storybook-full-featured-views",
				defaultViews,
			})

			return (
				<DataTable
					data={sampleProducts}
					columns={columnsWithFilters}
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
						pageSize: 10,
						pageSizeOptions: [5, 10, 25, 50],
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

		return <FullFeaturedExample />
	},
}

// 7. Shopify-style with tabs
export const ShopifyStyle: Story = {
	render: () => {
		const ShopifyStyleExample = () => {
			const { views, activeView, setActiveView } = useDataTableViews({
				storageKey: "storybook-shopify-views",
				defaultViews,
			})

			return (
				<div className="rounded-lg border border-border bg-background">
					<DataTableViewTabs views={views} activeView={activeView} onViewChange={setActiveView} />
					<div className="px-4">
						<DataTable
							data={sampleProducts}
							columns={columnsWithFilters}
							enableSorting
							enablePagination
							enableRowSelection
							enableGlobalSearch={false}
							hideToolbar
							views={views}
							activeView={activeView}
							onViewChange={setActiveView}
							pagination={{
								pageSize: 10,
								pageSizeOptions: [10, 25, 50],
							}}
							variant="lined"
							density="comfortable"
						/>
					</div>
				</div>
			)
		}

		return <ShopifyStyleExample />
	},
}

// 8. All variants showcase
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<div>
				<h3 className="text-lg font-semibold mb-2">Default Variant</h3>
				<DataTable
					data={sampleProducts.slice(0, 5)}
					columns={basicColumns}
					variant="default"
					enablePagination={false}
				/>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-2">Lined Variant</h3>
				<DataTable
					data={sampleProducts.slice(0, 5)}
					columns={basicColumns}
					variant="lined"
					enablePagination={false}
				/>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-2">Striped Variant</h3>
				<DataTable
					data={sampleProducts.slice(0, 5)}
					columns={basicColumns}
					variant="striped"
					enablePagination={false}
				/>
			</div>
		</div>
	),
}

// 9. All density levels
export const AllDensities: Story = {
	args: {
		enableFiltering: true,
	},

	render: () => (
		<div className="flex flex-col gap-8">
			<div>
				<h3 className="text-lg font-semibold mb-2">Compact Density</h3>
				<DataTable
					data={sampleProducts.slice(0, 5)}
					columns={basicColumns}
					density="compact"
					enablePagination={false}
				/>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-2">Default Density</h3>
				<DataTable
					data={sampleProducts.slice(0, 5)}
					columns={basicColumns}
					density="default"
					enablePagination={false}
				/>
			</div>

			<div>
				<h3 className="text-lg font-semibold mb-2">Comfortable Density</h3>
				<DataTable
					data={sampleProducts.slice(0, 5)}
					columns={basicColumns}
					density="comfortable"
					enablePagination={false}
				/>
			</div>
		</div>
	),
}

// 10. Loading state
export const LoadingState: Story = {
	args: {
		data: [],
		columns: basicColumns,
		isLoading: true,
	},
}

// 11. Empty state
export const EmptyState: Story = {
	args: {
		data: [],
		columns: basicColumns,
	},
}

// 12. Custom empty state
export const CustomEmptyState: Story = {
	args: {
		data: [],
		columns: basicColumns,
		emptyComponent: (
			<div className="flex flex-col items-center justify-center py-12">
				<Package className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No products found</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Get started by creating your first product
				</p>
			</div>
		),
	},
}
