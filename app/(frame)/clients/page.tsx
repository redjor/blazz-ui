"use client"

import { useMemo } from "react"
import {
	Building2,
	CheckCircle,
	Edit,
	Eye,
	Mail,
	Phone,
	Star,
	UserCheck,
	Users,
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

interface Client {
	id: string
	name: string
	email: string
	phone: string
	company: string
	status: "active" | "inactive" | "vip"
	totalSpent: number
	ordersCount: number
	createdAt: string
}

const clients: Client[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		company: "Acme Corp",
		status: "active",
		totalSpent: 15299.99,
		ordersCount: 23,
		createdAt: "2023-06-15",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		phone: "+1 (555) 234-5678",
		company: "Tech Solutions Inc",
		status: "vip",
		totalSpent: 45780.5,
		ordersCount: 67,
		createdAt: "2023-03-22",
	},
	{
		id: "3",
		name: "Bob Johnson",
		email: "bob@example.com",
		phone: "+1 (555) 345-6789",
		company: "Johnson & Co",
		status: "active",
		totalSpent: 8950.0,
		ordersCount: 15,
		createdAt: "2023-08-10",
	},
	{
		id: "4",
		name: "Alice Brown",
		email: "alice@example.com",
		phone: "+1 (555) 456-7890",
		company: "Brown Industries",
		status: "inactive",
		totalSpent: 2340.0,
		ordersCount: 4,
		createdAt: "2023-11-05",
	},
	{
		id: "5",
		name: "Charlie Wilson",
		email: "charlie@example.com",
		phone: "+1 (555) 567-8901",
		company: "Wilson Enterprises",
		status: "vip",
		totalSpent: 67890.25,
		ordersCount: 102,
		createdAt: "2022-12-18",
	},
	{
		id: "6",
		name: "Diana Miller",
		email: "diana@example.com",
		phone: "+1 (555) 678-9012",
		company: "Miller Group",
		status: "active",
		totalSpent: 12450.75,
		ordersCount: 28,
		createdAt: "2023-07-03",
	},
	{
		id: "7",
		name: "Frank Davis",
		email: "frank@example.com",
		phone: "+1 (555) 789-0123",
		company: "Davis & Partners",
		status: "active",
		totalSpent: 18765.0,
		ordersCount: 34,
		createdAt: "2023-05-14",
	},
	{
		id: "8",
		name: "Grace Lee",
		email: "grace@example.com",
		phone: "+1 (555) 890-1234",
		company: "Lee Corporation",
		status: "vip",
		totalSpent: 52100.5,
		ordersCount: 89,
		createdAt: "2023-01-28",
	},
	{
		id: "9",
		name: "Henry Taylor",
		email: "henry@example.com",
		phone: "+1 (555) 901-2345",
		company: "Taylor Systems",
		status: "active",
		totalSpent: 9875.25,
		ordersCount: 19,
		createdAt: "2023-09-12",
	},
	{
		id: "10",
		name: "Ivy Martinez",
		email: "ivy@example.com",
		phone: "+1 (555) 012-3456",
		company: "Martinez LLC",
		status: "inactive",
		totalSpent: 1250.0,
		ordersCount: 2,
		createdAt: "2024-01-05",
	},
	{
		id: "11",
		name: "Jack Anderson",
		email: "jack@example.com",
		phone: "+1 (555) 123-4568",
		company: "Anderson Tech",
		status: "active",
		totalSpent: 14320.0,
		ordersCount: 26,
		createdAt: "2023-04-20",
	},
	{
		id: "12",
		name: "Kate Thomas",
		email: "kate@example.com",
		phone: "+1 (555) 234-5679",
		company: "Thomas Industries",
		status: "active",
		totalSpent: 7650.5,
		ordersCount: 13,
		createdAt: "2023-10-08",
	},
]

const columns: DataTableColumnDef<Client>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
		cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Search by name...",
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Mail className="h-4 w-4 text-muted-foreground" />
				<span className="text-muted-foreground">{row.getValue("email")}</span>
			</div>
		),
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Search by email...",
		},
	},
	{
		accessorKey: "phone",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Phone className="h-4 w-4 text-muted-foreground" />
				<span className="text-muted-foreground">{row.getValue("phone")}</span>
			</div>
		),
		enableSorting: false,
	},
	{
		accessorKey: "company",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Company" />,
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Building2 className="h-4 w-4 text-muted-foreground" />
				<span>{row.getValue("company")}</span>
			</div>
		),
		enableSorting: true,
		filterConfig: {
			type: "text",
			placeholder: "Search by company...",
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			const variants: Record<string, "default" | "secondary" | "outline"> = {
				active: "default",
				inactive: "secondary",
				vip: "default",
			}
			return (
				<Badge
					variant={variants[status] || "outline"}
					className={
						status === "vip"
							? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
							: status === "active"
								? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
								: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"
					}
				>
					{status === "vip" && <Star className="mr-1 h-3 w-3" />}
					{status.toUpperCase()}
				</Badge>
			)
		},
		enableSorting: true,
		filterConfig: {
			type: "select",
			options: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
				{ label: "VIP", value: "vip" },
			],
		},
	},
	{
		accessorKey: "totalSpent",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Total Spent" />,
		cell: ({ row }) => {
			const total = row.getValue("totalSpent") as number
			return (
				<span className="font-medium">
					${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
				</span>
			)
		},
		enableSorting: true,
		meta: {
			align: "right",
		},
		filterConfig: {
			type: "number",
			min: 0,
			max: 100000,
			step: 5000,
			placeholder: "Enter amount...",
		},
	},
	{
		accessorKey: "ordersCount",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Orders" />,
		cell: ({ row }) => {
			const orders = row.getValue("ordersCount") as number
			return (
				<span className="text-muted-foreground">
					{orders} {orders === 1 ? "order" : "orders"}
				</span>
			)
		},
		enableSorting: true,
		meta: {
			align: "center",
		},
		filterConfig: {
			type: "number",
			min: 0,
			max: 200,
			step: 10,
			placeholder: "Number of orders...",
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Customer Since" />,
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"))
			return (
				<span className="text-muted-foreground">
					{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
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

// Default views for clients
const defaultViews: DataTableView[] = [
	{
		id: "all",
		name: "All Clients",
		icon: Users,
		isSystem: true,
		isDefault: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [],
		},
	},
	{
		id: "active",
		name: "Active",
		icon: UserCheck,
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
		id: "vip",
		name: "VIP Clients",
		icon: Star,
		isSystem: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: "status-vip",
					column: "status",
					operator: "equals",
					value: "vip",
					type: "select",
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
]

export default function ClientsPage() {
	// Views management
	const {
		views,
		activeView: activeViewId,
		setActiveView,
	} = useDataTableViews({
		storageKey: "clients-table-views",
		defaultViews,
	})

	// Find the actual view object from the ID
	const activeView = useMemo(
		() => (activeViewId ? views.find((v) => v.id === activeViewId) || null : null),
		[activeViewId, views]
	)

	// Row actions
	const rowActions: RowAction<Client>[] = [
		{
			id: "view",
			label: "View Details",
			icon: Eye,
			handler: (row) => {
				alert(`Viewing client: ${row.original.name}`)
			},
		},
		{
			id: "edit",
			label: "Edit Client",
			icon: Edit,
			handler: (row) => {
				alert(`Editing client: ${row.original.name}`)
			},
		},
		{
			id: "deactivate",
			label: "Deactivate",
			icon: XCircle,
			variant: "destructive",
			separator: true,
			requireConfirmation: true,
			confirmationMessage: (row) => `Are you sure you want to deactivate ${row.original.name}?`,
			handler: async (row) => {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				alert(`Deactivated client: ${row.original.name}`)
			},
			hidden: (row) => row.original.status === "inactive",
		},
	]

	// Bulk actions
	const bulkActions: BulkAction<Client>[] = [
		{
			id: "activate",
			label: "Activate Clients",
			icon: CheckCircle,
			variant: "default",
			handler: async (rows) => {
				await new Promise((resolve) => setTimeout(resolve, 500))
				alert(`Activated ${rows.length} clients`)
			},
		},
		{
			id: "set-vip",
			label: "Set as VIP",
			icon: Star,
			variant: "default",
			handler: async (rows) => {
				await new Promise((resolve) => setTimeout(resolve, 500))
				alert(`Set ${rows.length} clients as VIP`)
			},
		},
		{
			id: "deactivate",
			label: "Deactivate Clients",
			icon: XCircle,
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (count) =>
				`Are you sure you want to deactivate ${count} clients? This action can be reversed later.`,
			handler: async (rows) => {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				alert(`Deactivated ${rows.length} clients`)
			},
		},
	]

	return (
		<Page
			title="Clients"
			subtitle="Manage your customer relationships and track client activity"
			fullWidth
		>
			<Card className="p-0">
				<DataTable
					data={clients}
					columns={columns}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					searchPlaceholder="Search clients..."
					views={views}
					activeView={activeView}
					onViewChange={(view) => setActiveView(view?.id || null)}
					pagination={{
						pageSize: 10,
						pageSizeOptions: [5, 10, 15, 20, 25],
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
