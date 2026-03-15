"use client"

import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { createCompaniesPreset } from "@/components/data-table-presets"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Box } from "@blazz/ui/components/ui/box"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { toast } from "sonner"
import { companies } from "@/lib/sample-data"

export default function CompaniesPage() {
	const router = useRouter()

	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createCompaniesPreset({
				onView: (company) => router.push(`/companies/${company.id}`),
				onEdit: (company) => router.push(`/companies/${company.id}/edit`),
				onBulkArchive: (items) => toast.success(`${items.length} entreprise(s) archivée(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} entreprise(s) supprimée(s)`),
			}),
		[router]
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Entreprises"
				description="Gérez votre base d'entreprises"
				breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Entreprises" }]}
				actions={[{ label: "Nouvelle entreprise", href: "/companies/new", icon: Plus }]}
			/>

			<Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={companies}
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
					searchPlaceholder="Rechercher par nom..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
				/>
			</Box>
		</div>
	)
}
