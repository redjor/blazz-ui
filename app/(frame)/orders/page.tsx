"use client"

import { useMemo } from "react"
import {
	Ban,
	CheckCircle,
	Clock,
	Edit,
	Eye,
	Package,
	ShoppingCart,
	Truck,
	XCircle,
} from "lucide-react"
import {
	type BulkAction,
	DataTable,
	type DataTableColumnDef,
	DataTableColumnHeader,
	type DataTableView,
	type RowAction,
} from "@/components/features/data-table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/ui/page"
import { useDataTableViews } from "@/hooks/use-data-table-views"

interface Order {
	id: string
	orderNumber: string
	customerName: string
	email: string
	total: number
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
	items: number
	date: string
}

const orders: Order[] = [
	{
		id: "1",
		orderNumber: "ORD-001",
		customerName: "John Doe",
		email: "john@example.com",
		total: 299.99,
		status: "delivered",
		items: 3,
		date: "2024-01-15",
	},
	{
		id: "2",
		orderNumber: "ORD-002",
		customerName: "Jane Smith",
		email: "jane@example.com",
		total: 149.5,
		status: "shipped",
		items: 2,
		date: "2024-01-16",
	},
	{
		id: "3",
		orderNumber: "ORD-003",
		customerName: "Bob Johnson",
		email: "bob@example.com",
		total: 89.99,
		status: "processing",
		items: 1,
		date: "2024-01-17",
	},
	{
		id: "4",
		orderNumber: "ORD-004",
		customerName: "Alice Brown",
		email: "alice@example.com",
		total: 449.0,
		status: "pending",
		items: 5,
		date: "2024-01-17",
	},
	{
		id: "5",
		orderNumber: "ORD-005",
		customerName: "Charlie Wilson",
		email: "charlie@example.com",
		total: 199.99,
		status: "delivered",
		items: 2,
		date: "2024-01-18",
	},
	{
		id: "6",
		orderNumber: "ORD-006",
		customerName: "Diana Miller",
		email: "diana@example.com",
		total: 75.5,
		status: "cancelled",
		items: 1,
		date: "2024-01-18",
	},
	{
		id: "7",
		orderNumber: "ORD-007",
		customerName: "Frank Davis",
		email: "frank@example.com",
		total: 329.99,
		status: "shipped",
		items: 4,
		date: "2024-01-19",
	},
	{
		id: "8",
		orderNumber: "ORD-008",
		customerName: "Grace Lee",
		email: "grace@example.com",
		total: 159.0,
		status: "processing",
		items: 2,
		date: "2024-01-19",
	},
	{
		id: "9",
		orderNumber: "ORD-009",
		customerName: "Henry Taylor",
		email: "henry@example.com",
		total: 499.99,
		status: "pending",
		items: 6,
		date: "2024-01-20",
	},
	{
		id: "10",
		orderNumber: "ORD-010",
		customerName: "Ivy Martinez",
		email: "ivy@example.com",
		total: 129.5,
		status: "delivered",
		items: 2,
		date: "2024-01-20",
	},
	{
		id: "11",
		orderNumber: "ORD-011",
		customerName: "Jack Anderson",
		email: "jack@example.com",
		total: 249.99,
		status: "processing",
		items: 3,
		date: "2024-01-21",
	},
	{
		id: "12",
		orderNumber: "ORD-012",
		customerName: "Kate Thomas",
		email: "kate@example.com",
		total: 89.99,
		status: "shipped",
		items: 1,
		date: "2024-01-21",
	},
	{
		id: "13",
		orderNumber: "ORD-013",
		customerName: "Leo Jackson",
		email: "leo@example.com",
		total: 379.0,
		status: "delivered",
		items: 4,
		date: "2024-01-22",
	},
	{
		id: "14",
		orderNumber: "ORD-014",
		customerName: "Mia White",
		email: "mia@example.com",
		total: 99.5,
		status: "cancelled",
		items: 1,
		date: "2024-01-22",
	},
	{
		id: "15",
		orderNumber: "ORD-015",
		customerName: "Noah Harris",
		email: "noah@example.com",
		total: 219.99,
		status: "pending",
		items: 3,
		date: "2024-01-23",
	},
]

const columns: DataTableColumnDef<Order>[] = [
	{
		accessorKey: "orderNumber",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Order #" />,
		cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("orderNumber")}</span>,
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Search order number...",
		},
	},
	{
		accessorKey: "customerName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Search customer...",
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("email")}</span>,
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Search email...",
		},
	},
	{
		accessorKey: "total",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
		cell: ({ row }) => {
			const total = row.getValue("total") as number
			return <span className="font-medium">${total.toFixed(2)}</span>
		},
		enableSorting: true,
		meta: {
			align: "right",
		},
		filterConfig: {
			type: "number",
			min: 0,
			max: 1000,
			step: 50,
			placeholder: "Enter amount...",
		},
	},
	{
		accessorKey: "items",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
		cell: ({ row }) => {
			const items = row.getValue("items") as number
			return (
				<span>
					{items} {items === 1 ? "item" : "items"}
				</span>
			)
		},
		enableSorting: true,
		meta: {
			align: "center",
		},
		filterConfig: {
			type: "number",
			min: 1,
			max: 10,
			step: 1,
			placeholder: "Number of items...",
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			const variants: Record<string, "default" | "secondary" | "outline"> = {
				delivered: "default",
				shipped: "default",
				processing: "secondary",
				pending: "outline",
				cancelled: "secondary",
			}
			return <Badge variant={variants[status] || "outline"}>{status}</Badge>
		},
		enableSorting: true,
		filterConfig: {
			type: "select",
			options: [
				{ label: "Pending", value: "pending" },
				{ label: "Processing", value: "processing" },
				{ label: "Shipped", value: "shipped" },
				{ label: "Delivered", value: "delivered" },
				{ label: "Cancelled", value: "cancelled" },
			],
		},
	},
	{
		accessorKey: "date",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
		cell: ({ row }) => {
			const date = new Date(row.getValue("date"))
			// Use consistent date format to avoid hydration mismatch
			return (
				<span>
					{date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" })}
				</span>
			)
		},
		enableSorting: true,
		filterConfig: {
			type: "date",
			placeholder: "Select date...",
		},
	},
]

// Default views for orders
const defaultViews: DataTableView[] = [
	{
		id: "all",
		name: "All Orders",
		icon: ShoppingCart,
		isSystem: true,
		isDefault: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [],
		},
	},
	{
		id: "pending",
		name: "Pending",
		icon: Clock,
		isSystem: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: "status-pending",
					column: "status",
					operator: "equals",
					value: "pending",
					type: "select",
				},
			],
		},
	},
	{
		id: "processing",
		name: "Processing",
		icon: Package,
		isSystem: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: "status-processing",
					column: "status",
					operator: "equals",
					value: "processing",
					type: "select",
				},
			],
		},
	},
	{
		id: "shipped",
		name: "Shipped",
		icon: Truck,
		isSystem: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: "status-shipped",
					column: "status",
					operator: "equals",
					value: "shipped",
					type: "select",
				},
			],
		},
	},
	{
		id: "delivered",
		name: "Delivered",
		icon: CheckCircle,
		isSystem: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: "status-delivered",
					column: "status",
					operator: "equals",
					value: "delivered",
					type: "select",
				},
			],
		},
	},
	{
		id: "cancelled",
		name: "Cancelled",
		icon: Ban,
		isSystem: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: "status-cancelled",
					column: "status",
					operator: "equals",
					value: "cancelled",
					type: "select",
				},
			],
		},
	},
]

export default function OrdersPage() {
	// Views management
	const { views, activeView: activeViewId, setActiveView } = useDataTableViews({
		storageKey: "orders-table-views",
		defaultViews,
	})

	// Find the actual view object from the ID
	const activeView = useMemo(
		() => (activeViewId ? views.find((v) => v.id === activeViewId) || null : null),
		[activeViewId, views]
	)

	// Row actions
	const rowActions: RowAction<Order>[] = [
		{
			id: "view",
			label: "View Details",
			icon: Eye,
			handler: (row) => {
				alert(`Viewing order: ${row.original.orderNumber}`)
			},
		},
		{
			id: "edit",
			label: "Edit",
			icon: Edit,
			handler: (row) => {
				alert(`Editing order: ${row.original.orderNumber}`)
			},
			disabled: (row) => row.original.status === "cancelled",
		},
		{
			id: "cancel",
			label: "Cancel Order",
			icon: XCircle,
			variant: "destructive",
			separator: true,
			requireConfirmation: true,
			confirmationMessage: (row) =>
				`Are you sure you want to cancel order ${row.original.orderNumber}?`,
			handler: async (row) => {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				alert(`Cancelled order: ${row.original.orderNumber}`)
			},
			hidden: (row) => ["cancelled", "delivered"].includes(row.original.status),
		},
	]

	// Bulk actions
	const bulkActions: BulkAction<Order>[] = [
		{
			id: "mark-shipped",
			label: "Mark as Shipped",
			icon: Truck,
			variant: "default",
			handler: async (rows) => {
				await new Promise((resolve) => setTimeout(resolve, 500))
				alert(`Marked ${rows.length} orders as shipped`)
			},
		},
		{
			id: "mark-delivered",
			label: "Mark as Delivered",
			icon: CheckCircle,
			variant: "default",
			handler: async (rows) => {
				await new Promise((resolve) => setTimeout(resolve, 500))
				alert(`Marked ${rows.length} orders as delivered`)
			},
		},
		{
			id: "cancel",
			label: "Cancel Orders",
			icon: XCircle,
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (count) =>
				`Are you sure you want to cancel ${count} orders? This action cannot be undone.`,
			handler: async (rows) => {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				alert(`Cancelled ${rows.length} orders`)
			},
		},
	]

	return (
		<Page
			title="Orders"
			subtitle="Manage and track customer orders with advanced filtering and views"
			fullWidth
		>
			<Card className="p-0">
				<DataTable
					data={orders}
					columns={columns}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					searchPlaceholder="Search orders..."
					views={views}
					activeView={activeView}
					onViewChange={(view) => setActiveView(view?.id || null)}
					pagination={{
						pageSize: 10,
						pageSizeOptions: [5, 10, 15, 20],
					}}
					rowActions={rowActions}
					bulkActions={bulkActions}
					variant="lined"
					density="default"
				/>
			</Card>
		</Page>
	)
}
