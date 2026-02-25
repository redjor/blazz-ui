"use client"

import { useMemo } from "react"
import { toast } from "sonner"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { DataTable, createInventoryPreset } from "@blazz/ui/components/features/data-table"
import { Box } from "@blazz/ui/components/ui/box"
import { inventoryItems } from "@/lib/stockbase-data"

export default function InventoryPage() {
	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createInventoryPreset({
				onView: (item) => toast.info(`Article : ${item.name}`),
				onEdit: (item) => toast.info(`Modifier : ${item.name}`),
				onRestock: (item) => toast.success(`Reapprovisionnement de ${item.name}`),
				onBulkExport: (items) => toast.success(`${items.length} article(s) exporte(s)`),
				onBulkAdjust: (items) => toast.success(`Stock ajuste pour ${items.length} article(s)`),
			}),
		[],
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Stock"
				description="Gerez votre inventaire"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/stockbase/dashboard" },
					{ label: "Stock" },
				]}
			/>

			<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={inventoryItems}
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
					searchPlaceholder="Rechercher par nom, SKU, categorie..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
