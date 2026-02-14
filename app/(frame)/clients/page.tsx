"use client"

import { Suspense, useMemo } from "react"
import { DataTable, createCRMContactPreset } from "@/components/features/data-table"
import type { CRMContact } from "@/components/features/data-table"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/ui/page"
import { Skeleton } from "@/components/ui/skeleton"
import { useDataTableUrlState } from "@/hooks/use-data-table-url-state"

// Sample clients data matching CRMContact preset interface
const clients: CRMContact[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		company: "Acme Corp",
		status: "active",
		lastContact: "2024-01-20",
		createdAt: "2023-06-15",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		phone: "+1 (555) 234-5678",
		company: "Tech Solutions Inc",
		status: "active",
		lastContact: "2024-01-22",
		createdAt: "2023-03-22",
		tags: ["vip", "enterprise"],
	},
	{
		id: "3",
		name: "Bob Johnson",
		email: "bob@example.com",
		phone: "+1 (555) 345-6789",
		company: "Johnson & Co",
		status: "active",
		lastContact: "2024-01-18",
		createdAt: "2023-08-10",
	},
	{
		id: "4",
		name: "Alice Brown",
		email: "alice@example.com",
		phone: "+1 (555) 456-7890",
		company: "Brown Industries",
		status: "inactive",
		lastContact: "2023-12-15",
		createdAt: "2023-11-05",
	},
	{
		id: "5",
		name: "Charlie Wilson",
		email: "charlie@example.com",
		phone: "+1 (555) 567-8901",
		company: "Wilson Enterprises",
		status: "active",
		lastContact: "2024-01-23",
		createdAt: "2022-12-18",
		tags: ["vip"],
	},
	{
		id: "6",
		name: "Diana Miller",
		email: "diana@example.com",
		phone: "+1 (555) 678-9012",
		company: "Miller Associates",
		status: "active",
		lastContact: "2024-01-19",
		createdAt: "2023-09-12",
	},
	{
		id: "7",
		name: "Frank Davis",
		email: "frank@example.com",
		phone: "+1 (555) 789-0123",
		company: "Davis Group",
		status: "inactive",
		lastContact: "2023-11-30",
		createdAt: "2023-05-20",
	},
	{
		id: "8",
		name: "Grace Lee",
		email: "grace@example.com",
		phone: "+1 (555) 890-1234",
		company: "Lee Consulting",
		status: "active",
		lastContact: "2024-01-21",
		createdAt: "2023-07-08",
	},
	{
		id: "9",
		name: "Henry Taylor",
		email: "henry@example.com",
		phone: "+1 (555) 901-2345",
		company: "Taylor Ventures",
		status: "active",
		lastContact: "2024-01-17",
		createdAt: "2023-10-14",
		tags: ["partner"],
	},
	{
		id: "10",
		name: "Ivy Martinez",
		email: "ivy@example.com",
		phone: "+1 (555) 012-3456",
		company: "Martinez Holdings",
		status: "archived",
		lastContact: "2023-09-05",
		createdAt: "2023-04-25",
	},
	{
		id: "11",
		name: "Jack Anderson",
		email: "jack@example.com",
		phone: "+1 (555) 123-4568",
		company: "Anderson LLC",
		status: "active",
		lastContact: "2024-01-16",
		createdAt: "2023-08-30",
	},
	{
		id: "12",
		name: "Kate Thomas",
		email: "kate@example.com",
		phone: "+1 (555) 234-5679",
		company: "Thomas Retail",
		status: "inactive",
		lastContact: "2024-01-10",
		createdAt: "2023-11-22",
	},
	{
		id: "13",
		name: "Leo Jackson",
		email: "leo@example.com",
		phone: "+1 (555) 345-6780",
		company: "Jackson Motors",
		status: "active",
		lastContact: "2024-01-22",
		createdAt: "2023-02-14",
	},
	{
		id: "14",
		name: "Mia White",
		email: "mia@example.com",
		phone: "+1 (555) 456-7891",
		company: "White Design Studio",
		status: "active",
		lastContact: "2024-01-15",
		createdAt: "2023-09-05",
	},
	{
		id: "15",
		name: "Noah Harris",
		email: "noah@example.com",
		phone: "+1 (555) 567-8902",
		company: "Harris Tech",
		status: "active",
		lastContact: "2024-01-23",
		createdAt: "2023-06-28",
		tags: ["enterprise"],
	},
]

export default function ClientsPage() {
	return (
		<Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
			<ClientsPageContent />
		</Suspense>
	)
}

function ClientsPageContent() {
	// Create preset with all configuration (replaces 400+ lines of manual setup)
	const preset = useMemo(
		() =>
			createCRMContactPreset({
				locale: "en",
				companies: [
					{ label: "Acme Corp", value: "Acme Corp" },
					{ label: "Tech Solutions Inc", value: "Tech Solutions Inc" },
					{ label: "Johnson & Co", value: "Johnson & Co" },
					{ label: "Brown Industries", value: "Brown Industries" },
					{ label: "Wilson Enterprises", value: "Wilson Enterprises" },
					{ label: "Miller Associates", value: "Miller Associates" },
					{ label: "Davis Group", value: "Davis Group" },
					{ label: "Lee Consulting", value: "Lee Consulting" },
					{ label: "Taylor Ventures", value: "Taylor Ventures" },
					{ label: "Martinez Holdings", value: "Martinez Holdings" },
					{ label: "Anderson LLC", value: "Anderson LLC" },
					{ label: "Thomas Retail", value: "Thomas Retail" },
					{ label: "Jackson Motors", value: "Jackson Motors" },
					{ label: "White Design Studio", value: "White Design Studio" },
					{ label: "Harris Tech", value: "Harris Tech" },
				],
				onView: (contact) => {
					alert(`Viewing contact: ${contact.name}`)
				},
				onEdit: (contact) => {
					alert(`Editing contact: ${contact.name}`)
				},
				onArchive: async (contact) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Archived contact: ${contact.name}`)
				},
				onBulkActivate: async (contacts) => {
					await new Promise((resolve) => setTimeout(resolve, 500))
					alert(`Activated ${contacts.length} contacts`)
				},
				onBulkArchive: async (contacts) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Archived ${contacts.length} contacts`)
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
			title="Clients"
			subtitle="Manage customer contacts and relationships"
			fullWidth
		>
			<Card className="p-0">
				<DataTable
					data={clients}
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
					searchPlaceholder="Search clients..."
					pagination={{
						pageSize: 15,
						pageSizeOptions: [10, 15, 25, 50],
					}}
					variant="lined"
					density="default"
				/>
			</Card>
		</Page>
	)
}
