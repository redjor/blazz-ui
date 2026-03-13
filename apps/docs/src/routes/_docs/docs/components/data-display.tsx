import { Page } from "@blazz/ui/components/ui/page"
import { createFileRoute } from "@tanstack/react-router"
import {
	BarChart3,
	Clock,
	CreditCard,
	FolderTree,
	Grid3X3,
	List,
	Table,
	Table2,
	User,
} from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

export const Route = createFileRoute("/_docs/docs/components/data-display")({
	component: DataDisplayPage,
})

const dataDisplayComponents = [
	{
		title: "Avatar",
		href: "/docs/components/ui/avatar",
		description:
			"Display user profile images with fallback support for initials or icons in various sizes.",
		icon: User,
		thumbnail: "avatar",
	},
	{
		title: "Cell Types",
		href: "/docs/components/ui/cells",
		description:
			"15 specialized cell renderers for DataTable: tags, progress, rating, sparkline, avatar group, and more.",
		icon: Grid3X3,
		thumbnail: "cells",
	},
	{
		title: "Data Table",
		href: "/docs/blocks/data-table",
		description:
			"Enterprise-grade data table with advanced filtering, sorting, pagination, and bulk actions.",
		icon: Table2,
		thumbnail: "data-table",
	},
	{
		title: "Property",
		href: "/docs/components/ui/property",
		description:
			"Label-value pair component for displaying structured data in detail views and sidebars.",
		icon: List,
		thumbnail: "property",
	},
	{
		title: "Property Card",
		href: "/docs/blocks/property-card",
		description:
			"Card component for grouping related properties with header, actions, and structured layout.",
		icon: CreditCard,
		thumbnail: "property-card",
	},
	{
		title: "Stats Strip",
		href: "/docs/blocks/stats-strip",
		description:
			"Horizontal strip of key metrics with labels, values, trends, and optional sparklines.",
		icon: BarChart3,
		thumbnail: "stats-strip",
	},
	{
		title: "Table",
		href: "/docs/components/ui/table",
		description:
			"Display data in rows and columns with semantic HTML table elements for simple tabular layouts.",
		icon: Table,
		thumbnail: "table",
	},
	{
		title: "Timeline",
		href: "/docs/components/ui/timeline",
		description:
			"Vertical activity feed for displaying chronological events, history logs, and status updates.",
		icon: Clock,
		thumbnail: "timeline",
	},
	{
		title: "Tree View",
		href: "/docs/components/ui/tree-view",
		description:
			"Hierarchical tree component for displaying nested structures like file systems and directories.",
		icon: FolderTree,
		thumbnail: "tree-view",
	},
]

function DataDisplayPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Data Display"
				description="Data display components help users understand and interact with information. They present data in structured, scannable formats that make patterns and relationships clear."
			/>
			<ComponentSection components={dataDisplayComponents} />
		</Page>
	)
}
