import { createFileRoute } from "@tanstack/react-router"
import { Page } from "@blazz/ui/components/ui/page"
import { ComponentSection } from "~/components/docs/component-card"
import { User, Table, Table2, Grid3X3, List, CreditCard, BarChart3 } from "lucide-react"

export const Route = createFileRoute("/_docs/docs/components/data-display")({
	component: DataDisplayPage,
})

const dataDisplayComponents = [
	{
		title: "Avatar",
		href: "/docs/components/ui/avatar",
		description: "Display user profile images with fallback support for initials or icons in various sizes.",
		icon: User,
		thumbnail: "avatar",
	},
	{
		title: "Cell Types",
		href: "/docs/components/ui/cells",
		description: "15 specialized cell renderers for DataTable: tags, progress, rating, sparkline, avatar group, and more.",
		icon: Grid3X3,
		thumbnail: "cells",
	},
	{
		title: "Data Table",
		href: "/docs/components/ui/data-table",
		description: "Enterprise-grade data table with advanced filtering, sorting, pagination, and bulk actions.",
		icon: Table2,
		thumbnail: "data-table",
	},
	{
		title: "Property",
		href: "/docs/components/ui/property",
		description: "Label-value pair component for displaying structured data in detail views and sidebars.",
		icon: List,
		thumbnail: "property",
	},
	{
		title: "Property Card",
		href: "/docs/components/ui/property-card",
		description: "Card component for grouping related properties with header, actions, and structured layout.",
		icon: CreditCard,
		thumbnail: "property-card",
	},
	{
		title: "Stats Strip",
		href: "/docs/components/ui/stats-strip",
		description: "Horizontal strip of key metrics with labels, values, trends, and optional sparklines.",
		icon: BarChart3,
		thumbnail: "stats-strip",
	},
	{
		title: "Table",
		href: "/docs/components/ui/table",
		description: "Display data in rows and columns with semantic HTML table elements for simple tabular layouts.",
		icon: Table,
		thumbnail: "table",
	},
]

function DataDisplayPage() {
	return (
		<Page
			title="Data Display"
			subtitle="Data display components help users understand and interact with information. They present data in structured, scannable formats that make patterns and relationships clear."
		>
			<ComponentSection components={dataDisplayComponents} />
		</Page>
	)
}
