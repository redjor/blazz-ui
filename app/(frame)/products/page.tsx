"use client"

import { DataTable, createEcommerceProductPreset } from "@/components/features/data-table"
import type { EcommerceProduct } from "@/components/features/data-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Page } from "@/components/ui/page"
import { useDataTableUrlState } from "@/hooks/use-data-table-url-state"
import Link from "next/link"
import { useMemo } from "react"

// Sample products data
const products: EcommerceProduct[] = [
	{
		id: "1",
		name: "The Collection Snowboard: Liquid",
		image: "🏂",
		status: "actif",
		stock: "50 en stock pour 4 variantes",
		stockCount: 50,
		category: "Sports d'hiver",
		channels: 1,
		catalogues: 1,
		price: 749.99,
		vendor: "Snowboard Co.",
		sku: "SB-LIQ-001",
		createdAt: "2024-01-15",
	},
	{
		id: "2",
		name: "The 3p Fulfilled Snowboard",
		image: "🏂",
		status: "actif",
		stock: "20 en stock",
		stockCount: 20,
		category: "Sports d'hiver",
		channels: 1,
		catalogues: 1,
		price: 649.99,
		vendor: "Snowboard Co.",
		sku: "SB-3PF-002",
		createdAt: "2024-01-20",
	},
	{
		id: "3",
		name: "The Multi-managed Snowboard",
		image: "🏂",
		status: "actif",
		stock: "100 en stock",
		stockCount: 100,
		category: "Sports d'hiver",
		channels: 2,
		catalogues: 1,
		price: 699.99,
		vendor: "Snowboard Co.",
		sku: "SB-MM-003",
		createdAt: "2024-02-01",
	},
	{
		id: "4",
		name: "The Collection Snowboard: Oxygen",
		image: "🏂",
		status: "actif",
		stock: "50 en stock",
		stockCount: 50,
		category: "Sports d'hiver",
		channels: 1,
		catalogues: 2,
		price: 759.99,
		vendor: "Snowboard Co.",
		sku: "SB-OXY-004",
		createdAt: "2024-02-10",
	},
	{
		id: "5",
		name: "The Multi-location Snowboard",
		image: "🏂",
		status: "actif",
		stock: "25 en stock",
		stockCount: 25,
		category: "Sports d'hiver",
		channels: 1,
		catalogues: 1,
		price: 629.99,
		vendor: "Snowboard Co.",
		sku: "SB-ML-005",
		createdAt: "2024-02-15",
	},
	{
		id: "6",
		name: "Snowboard Boots - Premium",
		image: "👢",
		status: "actif",
		stock: "75 en stock",
		stockCount: 75,
		category: "Accessoires",
		channels: 1,
		catalogues: 1,
		price: 299.99,
		vendor: "Boot Masters",
		sku: "BT-PRM-001",
		createdAt: "2024-03-01",
	},
	{
		id: "7",
		name: "Ski Goggles - Pro Vision",
		image: "🥽",
		status: "actif",
		stock: "150 en stock",
		stockCount: 150,
		category: "Accessoires",
		channels: 2,
		catalogues: 2,
		price: 179.99,
		vendor: "Vision Tech",
		sku: "GG-PRO-001",
		createdAt: "2024-03-05",
	},
	{
		id: "8",
		name: "Winter Jacket - Insulated",
		image: "🧥",
		status: "actif",
		stock: "40 en stock",
		stockCount: 40,
		category: "Vêtements",
		channels: 1,
		catalogues: 1,
		price: 449.99,
		vendor: "Outdoor Gear",
		sku: "JK-INS-001",
		createdAt: "2024-03-10",
	},
	{
		id: "9",
		name: "Thermal Base Layer Set",
		image: "👕",
		status: "actif",
		stock: "200 en stock",
		stockCount: 200,
		category: "Vêtements",
		channels: 2,
		catalogues: 1,
		price: 89.99,
		vendor: "Thermal Wear Co.",
		sku: "TH-BASE-001",
		createdAt: "2024-03-15",
	},
	{
		id: "10",
		name: "Snowboard Bindings - Elite",
		image: "🔗",
		status: "actif",
		stock: "60 en stock",
		stockCount: 60,
		category: "Équipement",
		channels: 1,
		catalogues: 2,
		price: 349.99,
		vendor: "Binding Specialists",
		sku: "BD-ELI-001",
		createdAt: "2024-03-20",
	},
	{
		id: "11",
		name: "Helmet - Safety First",
		image: "⛑️",
		status: "brouillon",
		stock: "0 en stock",
		stockCount: 0,
		category: "Équipement",
		channels: 0,
		catalogues: 0,
		price: 129.99,
		vendor: "Safety Gear Inc.",
		sku: "HM-SAF-001",
		createdAt: "2024-03-25",
	},
	{
		id: "12",
		name: "Gloves - Waterproof",
		image: "🧤",
		status: "actif",
		stock: "100 en stock",
		stockCount: 100,
		category: "Accessoires",
		channels: 1,
		catalogues: 1,
		price: 69.99,
		vendor: "Hand Warmers",
		sku: "GL-WP-001",
		createdAt: "2024-04-01",
	},
	{
		id: "13",
		name: "Ski Poles - Carbon Fiber",
		image: "🎿",
		status: "actif",
		stock: "80 en stock",
		stockCount: 80,
		category: "Équipement",
		channels: 1,
		catalogues: 1,
		price: 199.99,
		vendor: "Pole Crafters",
		sku: "PL-CF-001",
		createdAt: "2024-04-05",
	},
	{
		id: "14",
		name: "Backpack - Mountain Explorer",
		image: "🎒",
		status: "actif",
		stock: "45 en stock",
		stockCount: 45,
		category: "Accessoires",
		channels: 2,
		catalogues: 1,
		price: 159.99,
		vendor: "Adventure Bags",
		sku: "BP-ME-001",
		createdAt: "2024-04-10",
	},
	{
		id: "15",
		name: "Neck Warmer - Fleece",
		image: "🧣",
		status: "archivé",
		stock: "0 en stock",
		stockCount: 0,
		category: "Accessoires",
		channels: 0,
		catalogues: 0,
		price: 29.99,
		vendor: "Warm Essentials",
		sku: "NW-FL-001",
		createdAt: "2024-04-15",
	},
	{
		id: "16",
		name: "Carte Cadeau - 50€",
		image: "🎁",
		status: "cartes_cadeaux",
		stock: "Illimité",
		stockCount: 999,
		category: "Cartes Cadeaux",
		channels: 2,
		catalogues: 2,
		price: 50.0,
		vendor: "Blazz Store",
		sku: "GC-50-001",
		createdAt: "2024-04-20",
	},
	{
		id: "17",
		name: "Carte Cadeau - 100€",
		image: "🎁",
		status: "cartes_cadeaux",
		stock: "Illimité",
		stockCount: 999,
		category: "Cartes Cadeaux",
		channels: 2,
		catalogues: 2,
		price: 100.0,
		vendor: "Blazz Store",
		sku: "GC-100-001",
		createdAt: "2024-04-21",
	},
	{
		id: "18",
		name: "Carte Cadeau - 200€",
		image: "🎁",
		status: "cartes_cadeaux",
		stock: "Illimité",
		stockCount: 999,
		category: "Cartes Cadeaux",
		channels: 2,
		catalogues: 2,
		price: 200.0,
		vendor: "Blazz Store",
		sku: "GC-200-001",
		createdAt: "2024-04-22",
	},
]

export default function ProductsPage() {
	// Create preset with all configuration (replaces 700+ lines of manual setup)
	const preset = useMemo(
		() =>
			createEcommerceProductPreset({
				locale: "fr",
				currency: "EUR",
				categories: [
					{ label: "Sports d'hiver", value: "Sports d'hiver" },
					{ label: "Accessoires", value: "Accessoires" },
					{ label: "Vêtements", value: "Vêtements" },
					{ label: "Équipement", value: "Équipement" },
					{ label: "Cartes Cadeaux", value: "Cartes Cadeaux" },
				],
				vendors: [
					{ label: "Snowboard Co.", value: "Snowboard Co." },
					{ label: "Boot Masters", value: "Boot Masters" },
					{ label: "Vision Tech", value: "Vision Tech" },
					{ label: "Outdoor Gear", value: "Outdoor Gear" },
					{ label: "Thermal Wear Co.", value: "Thermal Wear Co." },
					{ label: "Binding Specialists", value: "Binding Specialists" },
					{ label: "Safety Gear Inc.", value: "Safety Gear Inc." },
					{ label: "Hand Warmers", value: "Hand Warmers" },
					{ label: "Pole Crafters", value: "Pole Crafters" },
					{ label: "Adventure Bags", value: "Adventure Bags" },
					{ label: "Warm Essentials", value: "Warm Essentials" },
					{ label: "Blazz Store", value: "Blazz Store" },
				],
				onView: (product) => {
					alert(`Viewing product: ${product.name}`)
				},
				onEdit: (product) => {
					alert(`Editing product: ${product.name}`)
				},
				onArchive: async (product) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Archived product: ${product.name}`)
				},
				onBulkActivate: async (products) => {
					await new Promise((resolve) => setTimeout(resolve, 500))
					alert(`Activated ${products.length} products`)
				},
				onBulkArchive: async (products) => {
					await new Promise((resolve) => setTimeout(resolve, 1000))
					alert(`Archived ${products.length} products`)
				},
			}),
		[]
	)

	const { activeView, setActiveView } = useDataTableUrlState({
		views: preset.views,
		defaultView: preset.views[0],
	})

	return (
		<Page
			title="Produits"
			fullWidth
			primaryAction={
				<Link href="/products/new" passHref>
					<Button>Ajouter un produit</Button>
				</Link>
			}
		>
			<Card className="p-0">
				<DataTable
					data={products}
					columns={preset.columns}
					views={preset.views}
					activeView={activeView}
					onViewChange={setActiveView}
					rowActions={preset.rowActions}
					bulkActions={preset.bulkActions}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					searchPlaceholder="Rechercher dans tous les produits..."
					pagination={{
						pageSize: 15,
						pageSizeOptions: [10, 15, 25, 50],
					}}
					variant="lined"
					density="default"
				/>
			</Card>
		</Page>
	)
}
