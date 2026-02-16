"use client"

import { useMemo } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/blocks/page-header"
import { DataTable, createCandidatesPreset } from "@/components/features/data-table"
import { Box } from "@/components/ui/box"
import { candidates } from "@/lib/talentflow-data"

export default function CandidatesPage() {
	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createCandidatesPreset({
				onView: (candidate) => toast.info(`Profil de ${candidate.firstName} ${candidate.lastName}`),
				onBulkArchive: (items) => toast.success(`${items.length} candidat(s) archivé(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} candidat(s) supprimé(s)`),
			}),
		[],
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Candidats"
				description="Suivez vos candidatures en cours"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/talentflow/dashboard" },
					{ label: "Candidats" },
				]}
			/>

			<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={candidates}
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
					searchPlaceholder="Rechercher par nom, poste, source..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
