"use client"

import { useMemo } from "react"
import { DataTable, createOrderManagementPreset } from "@/components/features/data-table"
import type { Order } from "@/components/features/data-table"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/ui/page"
import { useDataTableUrlState } from "@/hooks/use-data-table-url-state"

// Sample orders data matching Order preset interface
const orders: Order[] = [
	{
		id: "1",
		orderNumber: "ORD-001",
		customer: "John Doe",
		customerEmail: "john@example.com",
		total: 299.99,
		status: "delivered",
		createdAt: "2024-01-15",
		deliveredAt: "2024-01-18",
	},
	{
		id: "2",
		orderNumber: "ORD-002",
		customer: "Jane Smith",
		customerEmail: "jane@example.com",
		total: 149.5,
		status: "shipped",
		createdAt: "2024-01-16",
		shippedAt: "2024-01-17",
	},
	{
		id: "3",
		orderNumber: "ORD-003",
		customer: "Bob Johnson",
		customerEmail: "bob@example.com",
		total: 89.99,
		status: "processing",
		createdAt: "2024-01-17",
	},
	{
		id: "4",
		orderNumber: "ORD-004",
		customer: "Alice Brown",
		customerEmail: "alice@example.com",
		total: 449.0,
		status: "pending",
		createdAt: "2024-01-17",
	},
	{
		id: "5",
		orderNumber: "ORD-005",
		customer: "Charlie Wilson",
		customerEmail: "charlie@example.com",
		total: 199.99,
		status: "delivered",
		createdAt: "2024-01-18",
		deliveredAt: "2024-01-21",
	},
	{
		id: "6",
		orderNumber: "ORD-006",
		customer: "Diana Miller",
		customerEmail: "diana@example.com",
		total: 75.5,
		status: "cancelled",
		createdAt: "2024-01-18",
	},
	{
		id: "7",
		orderNumber: "ORD-007",
		customer: "Frank Davis",
		customerEmail: "frank@example.com",
		total: 329.99,
		status: "shipped",
		createdAt: "2024-01-19",
		shippedAt: "2024-01-20",
	},
	{
		id: "8",
		orderNumber: "ORD-008",
		customer: "Grace Lee",
		customerEmail: "grace@example.com",
		total: 159.0,
		status: "processing",
		createdAt: "2024-01-19",
	},
	{
		id: "9",
		orderNumber: "ORD-009",
		customer: "Henry Taylor",
		customerEmail: "henry@example.com",
		total: 499.99,
		status: "pending",
		createdAt: "2024-01-20",
	},
	{
		id: "10",
		orderNumber: "ORD-010",
		customer: "Ivy Martinez",
		customerEmail: "ivy@example.com",
		total: 129.5,
		status: "delivered",
		createdAt: "2024-01-20",
		deliveredAt: "2024-01-23",
	},
	{
		id: "11",
		orderNumber: "ORD-011",
		customer: "Jack Anderson",
		customerEmail: "jack@example.com",
		total: 249.99,
		status: "processing",
		createdAt: "2024-01-21",
	},
	{
		id: "12",
		orderNumber: "ORD-012",
		customer: "Kate Thomas",
		customerEmail: "kate@example.com",
		total: 89.99,
		status: "shipped",
		createdAt: "2024-01-21",
		shippedAt: "2024-01-22",
	},
	{
		id: "13",
		orderNumber: "ORD-013",
		customer: "Leo Jackson",
		customerEmail: "leo@example.com",
		total: 379.0,
		status: "delivered",
		createdAt: "2024-01-22",
		deliveredAt: "2024-01-25",
	},
	{
		id: "14",
		orderNumber: "ORD-014",
		customer: "Mia White",
		customerEmail: "mia@example.com",
		total: 99.5,
		status: "cancelled",
		createdAt: "2024-01-22",
	},
	{
		id: "15",
		orderNumber: "ORD-015",
		customer: "Noah Harris",
		customerEmail: "noah@example.com",
		total: 219.99,
		status: "pending",
		createdAt: "2024-01-23",
	},
]

export default function OrdersPage() {
	// Create preset with all configuration (replaces 400+ lines of manual setup)
	const preset = useMemo(
		() =>
			createOrderManagementPreset({
				locale: "en",
				currency: "USD",
				onView: (order) => {
					alert(`Viewing order: ${order.orderNumber}`)
				},
				onEdit: (order) => {
					alert(`Editing order: ${order.orderNumber}`)
				},
				onCancel: async (order) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Cancelled order: ${order.orderNumber}`)
				},
				onRefund: async (order) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Refunded order: ${order.orderNumber}`)
				},
				onBulkCancel: async (orders) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Cancelled ${orders.length} orders`)
				},
				onBulkRefund: async (orders) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Refunded ${orders.length} orders`)
				},
			}),
		[]
	)

	const { activeView, setActiveView } = useDataTableUrlState({
		views: preset.views,
		defaultView: preset.views[0],
	})

	return (
		<Page
			title="Orders"
			subtitle="Manage and track customer orders with advanced filtering and views"
			fullWidth
		>
			<Card className="p-0">
				<DataTable
					data={orders}
					columns={preset.columns}
					views={preset.views}
					activeView={activeView}
					onViewChange={setActiveView}
					rowActions={preset.rowActions}
					bulkActions={preset.bulkActions}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					searchPlaceholder="Search orders..."
					pagination={{
						pageSize: 10,
						pageSizeOptions: [5, 10, 15, 20],
					}}
					variant="lined"
					density="default"
				/>
			</Card>
		</Page>
	)
}
