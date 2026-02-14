"use client"

import { Suspense } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { DataGrid, type ColumnDef } from "@/components/blocks/data-grid"
import { EmptyState } from "@/components/blocks/empty-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { products, formatCurrency, type Product } from "@/lib/sample-data"
import { useSearchParams } from "next/navigation"

const statusVariant: Record<string, "success" | "outline" | "critical"> = {
	active: "success",
	inactive: "outline",
	discontinued: "critical",
}

const statusLabel: Record<string, string> = {
	active: "Actif",
	inactive: "Inactif",
	discontinued: "Abandonné",
}

const columns: ColumnDef<Product>[] = [
	{
		id: "name",
		header: "Produit",
		sortable: true,
		cell: (row) => (
			<div>
				<p className="font-medium">{row.name}</p>
				<p className="text-xs text-muted-foreground">{row.sku}</p>
			</div>
		),
	},
	{ id: "category", header: "Catégorie", sortable: true, cell: (row) => row.category },
	{
		id: "unitPrice",
		header: "Prix unitaire",
		sortable: true,
		cell: (row) => (
			<span className="font-medium">
				{formatCurrency(row.unitPrice)}{row.category === "Licence" || row.category === "Support" || row.category === "Module" ? "/mois" : ""}
			</span>
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

function ProductsContent() {
	const searchParams = useSearchParams()
	const page = Number(searchParams.get("page")) || 1

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Produits"
				description="Catalogue de produits et services"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Produits" },
				]}
				actions={[
					{ label: "Nouveau produit", href: "/products/new", icon: Plus },
				]}
			/>

			<DataGrid
				columns={columns}
				data={products}
				totalCount={products.length}
				currentPage={page}
				pageSize={25}
				emptyState={
					<EmptyState
						title="Aucun produit"
						description="Ajoutez votre premier produit au catalogue"
					/>
				}
			/>
		</div>
	)
}

export default function ProductsPage() {
	return (
		<Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
			<ProductsContent />
		</Suspense>
	)
}
