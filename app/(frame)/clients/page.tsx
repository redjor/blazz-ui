"use client"

import { Suspense, useMemo } from "react"
import { DataTable, createContactsPreset } from "@/components/features/data-table"
import type { Contact } from "@/lib/sample-data"
import { Box } from "@/components/ui/box"
import { Page } from "@/components/ui/page"
import { Skeleton } from "@/components/ui/skeleton"
import { useDataTableUrlState } from "@/hooks/use-data-table-url-state"

// Sample clients data matching Contact interface from sample-data
const clients: Contact[] = [
	{
		id: "1",
		firstName: "John",
		lastName: "Doe",
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		jobTitle: "CEO",
		isPrimary: true,
		companyId: "c1",
		companyName: "Acme Corp",
		status: "active",
		createdAt: "2023-06-15",
	},
	{
		id: "2",
		firstName: "Jane",
		lastName: "Smith",
		email: "jane@example.com",
		phone: "+1 (555) 234-5678",
		jobTitle: "CTO",
		isPrimary: true,
		companyId: "c2",
		companyName: "Tech Solutions Inc",
		status: "active",
		createdAt: "2023-03-22",
	},
	{
		id: "3",
		firstName: "Bob",
		lastName: "Johnson",
		email: "bob@example.com",
		phone: "+1 (555) 345-6789",
		jobTitle: "Sales Director",
		isPrimary: false,
		companyId: "c3",
		companyName: "Johnson & Co",
		status: "active",
		createdAt: "2023-08-10",
	},
	{
		id: "4",
		firstName: "Alice",
		lastName: "Brown",
		email: "alice@example.com",
		phone: "+1 (555) 456-7890",
		jobTitle: "Marketing Manager",
		isPrimary: true,
		companyId: "c4",
		companyName: "Brown Industries",
		status: "inactive",
		createdAt: "2023-11-05",
	},
	{
		id: "5",
		firstName: "Charlie",
		lastName: "Wilson",
		email: "charlie@example.com",
		phone: "+1 (555) 567-8901",
		jobTitle: "VP Sales",
		isPrimary: true,
		companyId: "c5",
		companyName: "Wilson Enterprises",
		status: "active",
		createdAt: "2022-12-18",
	},
	{
		id: "6",
		firstName: "Diana",
		lastName: "Miller",
		email: "diana@example.com",
		phone: "+1 (555) 678-9012",
		jobTitle: "Account Manager",
		isPrimary: false,
		companyId: "c6",
		companyName: "Miller Associates",
		status: "active",
		createdAt: "2023-09-12",
	},
	{
		id: "7",
		firstName: "Frank",
		lastName: "Davis",
		email: "frank@example.com",
		phone: "+1 (555) 789-0123",
		jobTitle: "CFO",
		isPrimary: true,
		companyId: "c7",
		companyName: "Davis Group",
		status: "inactive",
		createdAt: "2023-05-20",
	},
	{
		id: "8",
		firstName: "Grace",
		lastName: "Lee",
		email: "grace@example.com",
		phone: "+1 (555) 890-1234",
		jobTitle: "Consultant",
		isPrimary: true,
		companyId: "c8",
		companyName: "Lee Consulting",
		status: "active",
		createdAt: "2023-07-08",
	},
	{
		id: "9",
		firstName: "Henry",
		lastName: "Taylor",
		email: "henry@example.com",
		phone: "+1 (555) 901-2345",
		jobTitle: "Partner",
		isPrimary: true,
		companyId: "c9",
		companyName: "Taylor Ventures",
		status: "active",
		createdAt: "2023-10-14",
	},
	{
		id: "10",
		firstName: "Ivy",
		lastName: "Martinez",
		email: "ivy@example.com",
		phone: "+1 (555) 012-3456",
		jobTitle: "Operations Manager",
		isPrimary: false,
		companyId: "c10",
		companyName: "Martinez Holdings",
		status: "archived",
		createdAt: "2023-04-25",
	},
	{
		id: "11",
		firstName: "Jack",
		lastName: "Anderson",
		email: "jack@example.com",
		phone: "+1 (555) 123-4568",
		jobTitle: "Product Manager",
		isPrimary: true,
		companyId: "c11",
		companyName: "Anderson LLC",
		status: "active",
		createdAt: "2023-08-30",
	},
	{
		id: "12",
		firstName: "Kate",
		lastName: "Thomas",
		email: "kate@example.com",
		phone: "+1 (555) 234-5679",
		jobTitle: "Retail Manager",
		isPrimary: true,
		companyId: "c12",
		companyName: "Thomas Retail",
		status: "inactive",
		createdAt: "2023-11-22",
	},
	{
		id: "13",
		firstName: "Leo",
		lastName: "Jackson",
		email: "leo@example.com",
		phone: "+1 (555) 345-6780",
		jobTitle: "Fleet Manager",
		isPrimary: false,
		companyId: "c13",
		companyName: "Jackson Motors",
		status: "active",
		createdAt: "2023-02-14",
	},
	{
		id: "14",
		firstName: "Mia",
		lastName: "White",
		email: "mia@example.com",
		phone: "+1 (555) 456-7891",
		jobTitle: "Creative Director",
		isPrimary: true,
		companyId: "c14",
		companyName: "White Design Studio",
		status: "active",
		createdAt: "2023-09-05",
	},
	{
		id: "15",
		firstName: "Noah",
		lastName: "Harris",
		email: "noah@example.com",
		phone: "+1 (555) 567-8902",
		jobTitle: "Engineering Lead",
		isPrimary: true,
		companyId: "c15",
		companyName: "Harris Tech",
		status: "active",
		createdAt: "2023-06-28",
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
	const preset = useMemo(
		() =>
			createContactsPreset({
				onView: (contact) => {
					alert(`Viewing contact: ${contact.firstName} ${contact.lastName}`)
				},
				onEdit: (contact) => {
					alert(`Editing contact: ${contact.firstName} ${contact.lastName}`)
				},
				onArchive: async (contact) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Archived contact: ${contact.firstName} ${contact.lastName}`)
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
			<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={clients}
					columns={preset.columns}
					views={preset.views}
					activeView={activeView}
					onViewChange={setActiveView}
					rowActions={preset.rowActions}
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
			</Box>
		</Page>
	)
}
