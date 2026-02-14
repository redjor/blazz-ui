"use client"

import { Suspense } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DataGrid, type ColumnDef } from "@/components/blocks/data-grid"
import { EmptyState } from "@/components/blocks/empty-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { quotes, formatCurrency, formatDate, type Quote } from "@/lib/sample-data"
import { useSearchParams } from "next/navigation"

const statusVariant: Record<string, "success" | "info" | "warning" | "critical" | "outline" | "default"> = {
	draft: "outline",
	sent: "info",
	accepted: "success",
	rejected: "critical",
	expired: "warning",
}

const statusLabel: Record<string, string> = {
	draft: "Brouillon",
	sent: "Envoyé",
	accepted: "Accepté",
	rejected: "Rejeté",
	expired: "Expiré",
}

const columns: ColumnDef<Quote>[] = [
	{
		id: "reference",
		header: "Référence",
		sortable: true,
		cell: (row) => (
			<a href={`/quotes/${row.id}`} className="font-medium hover:underline">
				{row.reference}
			</a>
		),
	},
	{ id: "dealTitle", header: "Deal", sortable: true, cell: (row) => row.dealTitle },
	{ id: "companyName", header: "Entreprise", sortable: true, cell: (row) => row.companyName },
	{
		id: "total",
		header: "Montant",
		sortable: true,
		cell: (row) => <span className="font-medium">{formatCurrency(row.total)}</span>,
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
	{
		id: "validUntil",
		header: "Valide jusqu'au",
		sortable: true,
		cell: (row) => formatDate(row.validUntil),
	},
]

function QuotesContent() {
	const searchParams = useSearchParams()
	const page = Number(searchParams.get("page")) || 1

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Devis"
				description="Gérez vos devis et propositions commerciales"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Devis" },
				]}
				actions={[
					{ label: "Nouveau devis", href: "/quotes/new", icon: Plus },
				]}
			/>

			<DataGrid
				columns={columns}
				data={quotes}
				totalCount={quotes.length}
				currentPage={page}
				pageSize={25}
				emptyState={
					<EmptyState
						title="Aucun devis"
						description="Créez votre premier devis"
						action={{ label: "Nouveau devis", href: "/quotes/new" }}
					/>
				}
			/>
		</div>
	)
}

export default function QuotesPage() {
	return (
		<Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
			<QuotesContent />
		</Suspense>
	)
}
