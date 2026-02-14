"use client"

import { Suspense } from "react"
import { Plus, Upload } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DataGrid, type ColumnDef } from "@/components/blocks/data-grid"
import { FilterBar, type FilterConfig } from "@/components/blocks/filter-bar"
import { EmptyState } from "@/components/blocks/empty-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { contacts, type Contact } from "@/lib/sample-data"
import { useSearchParams } from "next/navigation"

const statusVariant: Record<string, "success" | "outline" | "warning"> = {
	active: "success",
	inactive: "outline",
	archived: "warning",
}

const statusLabel: Record<string, string> = {
	active: "Actif",
	inactive: "Inactif",
	archived: "Archivé",
}

const columns: ColumnDef<Contact>[] = [
	{
		id: "lastName",
		header: "Nom",
		sortable: true,
		cell: (row) => (
			<a href={`/contacts/${row.id}`} className="font-medium hover:underline">
				{row.lastName} {row.firstName}
			</a>
		),
	},
	{
		id: "email",
		header: "Email",
		sortable: true,
		cell: (row) => <span className="text-muted-foreground">{row.email}</span>,
	},
	{
		id: "jobTitle",
		header: "Poste",
		sortable: false,
		cell: (row) => row.jobTitle ?? "—",
	},
	{
		id: "companyName",
		header: "Entreprise",
		sortable: true,
		cell: (row) => (
			<a href={`/companies/${row.companyId}`} className="hover:underline">
				{row.companyName}
			</a>
		),
	},
	{
		id: "status",
		header: "Statut",
		sortable: true,
		cell: (row) => (
			<Badge variant={statusVariant[row.status] ?? "outline"}>
				{statusLabel[row.status] ?? row.status}
			</Badge>
		),
	},
]

const filters: FilterConfig[] = [
	{ id: "search", type: "search", placeholder: "Rechercher par nom, email..." },
	{
		id: "status",
		type: "select",
		label: "Statut",
		options: [
			{ value: "active", label: "Actif" },
			{ value: "inactive", label: "Inactif" },
			{ value: "archived", label: "Archivé" },
		],
	},
]

function ContactsContent() {
	const searchParams = useSearchParams()
	const params = Object.fromEntries(searchParams.entries())

	let filtered = [...contacts]

	if (params.search) {
		const q = params.search.toLowerCase()
		filtered = filtered.filter(
			(c) =>
				c.lastName.toLowerCase().includes(q) ||
				c.firstName.toLowerCase().includes(q) ||
				c.email.toLowerCase().includes(q)
		)
	}
	if (params.status) {
		filtered = filtered.filter((c) => c.status === params.status)
	}

	const page = Number(params.page) || 1
	const pageSize = 25

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Contacts"
				description="Gérez vos contacts"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Contacts" },
				]}
				actions={[
					{ label: "Importer", href: "/contacts/import", icon: Upload, variant: "outline" },
					{ label: "Nouveau contact", href: "/contacts/new", icon: Plus },
				]}
			/>

			<FilterBar filters={filters} values={params} />

			<DataGrid
				columns={columns}
				data={filtered.slice((page - 1) * pageSize, page * pageSize)}
				totalCount={filtered.length}
				currentPage={page}
				pageSize={pageSize}
				selectable
				emptyState={
					<EmptyState
						title="Aucun contact"
						description="Ajoutez votre premier contact"
						action={{ label: "Nouveau contact", href: "/contacts/new" }}
					/>
				}
			/>
		</div>
	)
}

export default function ContactsPage() {
	return (
		<Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
			<ContactsContent />
		</Suspense>
	)
}
