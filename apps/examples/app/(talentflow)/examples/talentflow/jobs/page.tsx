"use client"

import { useMemo } from "react"
import { toast } from "sonner"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { DataTable, createJobsPreset } from "@blazz/ui/components/blocks/data-table"
import { Box } from "@blazz/ui/components/ui/box"
import { jobs } from "@/lib/talentflow-data"

export default function JobsPage() {
	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createJobsPreset({
				onView: (job) => toast.info(`Offre : ${job.title}`),
				onEdit: (job) => toast.info(`Modifier : ${job.title}`),
				onBulkArchive: (items) => toast.success(`${items.length} offre(s) archivée(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} offre(s) supprimée(s)`),
			}),
		[],
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Offres d'emploi"
				description="Gérez vos offres de recrutement"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/talentflow/dashboard" },
					{ label: "Offres d'emploi" },
				]}
			/>

			<Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={jobs}
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
					searchPlaceholder="Rechercher par poste, département..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
