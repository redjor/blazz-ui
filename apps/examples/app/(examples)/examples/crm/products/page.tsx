"use client"

import { createProductsPreset, DataTable } from "@blazz/ui/components/blocks/data-table"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Box } from "@blazz/ui/components/ui/box"
import { Plus } from "lucide-react"
import { useMemo } from "react"
import { toast } from "sonner"
import { products } from "@/lib/sample-data"

export default function ProductsPage() {
	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createProductsPreset({
				onDuplicate: (product) => {
					console.log("Duplicate product", product.id)
				},
				onBulkDeactivate: (items) => toast.success(`${items.length} produit(s) désactivé(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} produit(s) supprimé(s)`),
			}),
		[]
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Produits"
				description="Catalogue de produits et services"
				breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Produits" }]}
				actions={[{ label: "Nouveau produit", href: "/products/new", icon: Plus }]}
			/>

			<Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={products}
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
					searchPlaceholder="Rechercher par nom, SKU..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
				/>
			</Box>
		</div>
	)
}
