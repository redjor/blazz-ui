"use client"

import { Suspense } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DataGrid, type ColumnDef } from "@/components/blocks/data-grid"
import { FilterBar, type FilterConfig } from "@/components/blocks/filter-bar"
import { EmptyState } from "@/components/blocks/empty-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { companies, formatCurrency, type Company } from "@/lib/sample-data"
import { useSearchParams } from "next/navigation"

const statusVariant: Record<string, "success" | "info" | "warning" | "critical" | "outline"> = {
	active: "success",
	prospect: "info",
	inactive: "outline",
	churned: "critical",
}

const statusLabel: Record<string, string> = {
	active: "Actif",
	prospect: "Prospect",
	inactive: "Inactif",
	churned: "Perdu",
}

const columns: ColumnDef<Company>[] = [
	{
		id: "name",
		header: "Entreprise",
		sortable: true,
		cell: (row) => (
			<a href={`/companies/${row.id}`} className="font-medium hover:underline">
				{row.name}
			</a>
		),
	},
	{
		id: "industry",
		header: "Secteur",
		sortable: true,
		cell: (row) => <span className="text-muted-foreground">{row.industry}</span>,
	},
	{
		id: "city",
		header: "Ville",
		sortable: true,
		cell: (row) => row.city ?? "—",
	},
	{
		id: "revenue",
		header: "CA",
		sortable: true,
		cell: (row) => (row.revenue ? formatCurrency(row.revenue) : "—"),
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
	{ id: "search", type: "search", placeholder: "Rechercher par nom..." },
	{
		id: "status",
		type: "select",
		label: "Statut",
		options: [
			{ value: "active", label: "Actif" },
			{ value: "prospect", label: "Prospect" },
			{ value: "inactive", label: "Inactif" },
			{ value: "churned", label: "Perdu" },
		],
	},
]

function CompaniesContent() {
	const searchParams = useSearchParams()
	const params = Object.fromEntries(searchParams.entries())

	let filtered = [...companies]

	if (params.search) {
		const q = params.search.toLowerCase()
		filtered = filtered.filter((c) => c.name.toLowerCase().includes(q))
	}
	if (params.status) {
		filtered = filtered.filter((c) => c.status === params.status)
	}

	const sortField = params.sortField
	const sortDir = params.sortDirection as "asc" | "desc" | undefined
	if (sortField) {
		filtered.sort((a, b) => {
			const aVal = (a as Record<string, unknown>)[sortField]
			const bVal = (b as Record<string, unknown>)[sortField]
			const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""), "fr", { numeric: true })
			return sortDir === "desc" ? -cmp : cmp
		})
	}

	const page = Number(params.page) || 1
	const pageSize = 25
	const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Entreprises"
				description="Gérez votre base d'entreprises"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Entreprises" },
				]}
				actions={[
					{ label: "Nouvelle entreprise", href: "/companies/new", icon: Plus },
				]}
			/>

			<FilterBar filters={filters} values={params} />

			<DataGrid
				columns={columns}
				data={paginated}
				totalCount={filtered.length}
				currentPage={page}
				pageSize={pageSize}
				sortField={sortField}
				sortDirection={sortDir}
				emptyState={
					<EmptyState
						title="Aucune entreprise"
						description="Ajoutez votre première entreprise pour commencer"
						action={{ label: "Nouvelle entreprise", href: "/companies/new" }}
					/>
				}
			/>
		</div>
	)
}

export default function CompaniesPage() {
	return (
		<Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
			<CompaniesContent />
		</Suspense>
	)
}
