"use client"

import { useMemo } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/blocks/page-header"
import { DataTable, createMovementsPreset } from "@/components/features/data-table"
import { Box } from "@/components/ui/box"
import { stockMovements } from "@/lib/stockbase-data"

export default function MovementsPage() {
	const { columns, views, rowActions } = useMemo(
		() =>
			createMovementsPreset({
				onView: (movement) => toast.info(`Mouvement : ${movement.itemName} (${movement.reason})`),
			}),
		[],
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Mouvements"
				description="Historique des mouvements de stock"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/stockbase/dashboard" },
					{ label: "Mouvements" },
				]}
			/>

			<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={stockMovements}
					columns={columns}
					views={views}
					rowActions={rowActions}
					getRowId={(row) => row.id}
					enableSorting
					enablePagination
					enableGlobalSearch
					enableAdvancedFilters
					combineSearchAndFilters
					searchPlaceholder="Rechercher par article, type, operateur..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
