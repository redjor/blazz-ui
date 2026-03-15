"use client"

import { createQuotesPreset, DataTable } from "@blazz/pro/components/blocks/data-table"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Box } from "@blazz/ui/components/ui/box"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { toast } from "sonner"
import { quotes } from "@/lib/sample-data"

export default function QuotesPage() {
	const router = useRouter()

	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createQuotesPreset({
				onView: (quote) => router.push(`/quotes/${quote.id}`),
				onDuplicate: (quote) => {
					// TODO: implement quote duplication
					console.log("Duplicate quote", quote.id)
				},
				onPrint: (quote) => {
					window.open(`/print/quote/${quote.id}`, "_blank")
				},
				onBulkDelete: (items) => toast.success(`${items.length} devis supprimé(s)`),
			}),
		[router]
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Devis"
				description="Gérez vos devis et propositions commerciales"
				breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Devis" }]}
				actions={[{ label: "Nouveau devis", href: "/quotes/new", icon: Plus }]}
			/>

			<Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={quotes}
					columns={columns}
					views={views}
					rowActions={rowActions}
					bulkActions={bulkActions}
					getRowId={(row) => row.id}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					combineSearchAndFilters
					searchPlaceholder="Rechercher par référence..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
