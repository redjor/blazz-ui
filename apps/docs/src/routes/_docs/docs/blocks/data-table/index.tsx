import { Page } from "@blazz/ui/components/ui/page"
import { createFileRoute } from "@tanstack/react-router"
import { Columns3, Filter, Grid3X3, Keyboard, Layers, LayoutList, Puzzle, Settings2, Table2 } from "lucide-react"
import { ComponentSection } from "~/components/docs/component-card"

const subPages = [
	{
		title: "Getting Started",
		href: "/docs/blocks/data-table/getting-started",
		description: "Installation, usage basique, col.* factories pour des colonnes en une ligne.",
		icon: Table2,
		thumbnail: "data-table",
	},
	{
		title: "Flat Mode",
		href: "/docs/blocks/data-table/flat-mode",
		description: "Variant flat, renderRow, grouping par statut — le style Linear.",
		icon: LayoutList,
		thumbnail: "data-table",
	},
	{
		title: "Toolbar & Views",
		href: "/docs/blocks/data-table/toolbar",
		description: "Stacked/classic layout, vues prefaites, search, toolbar slots.",
		icon: Settings2,
		thumbnail: "data-table",
	},
	{
		title: "Filtering",
		href: "/docs/blocks/data-table/filtering",
		description: "Filtres avances, filtres inline, filterConfig par colonne.",
		icon: Filter,
		thumbnail: "data-table",
	},
	{
		title: "Columns",
		href: "/docs/blocks/data-table/columns",
		description: "col.* factories, cells reutilisables, colonnes custom.",
		icon: Columns3,
		thumbnail: "data-table",
	},
	{
		title: "Inline Editing",
		href: "/docs/blocks/data-table/editing",
		description: "Edition inline, undo/redo (Ctrl+Z), navigation clavier entre cellules.",
		icon: Keyboard,
		thumbnail: "data-table",
	},
	{
		title: "Composition & Slots",
		href: "/docs/blocks/data-table/composition",
		description: "renderGroupHeader, renderRowActions, renderPagination, toolbar slots, footerSlot.",
		icon: Puzzle,
		thumbnail: "data-table",
	},
	{
		title: "Grouping & Expansion",
		href: "/docs/blocks/data-table/grouping",
		description: "Grouping par colonne, agregations, row expand avec panels custom.",
		icon: Layers,
		thumbnail: "data-table",
	},
	{
		title: "API Reference",
		href: "/docs/blocks/data-table/api",
		description: "Reference complete de tous les props, types et interfaces.",
		icon: Grid3X3,
		thumbnail: "data-table",
	},
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/")({
	component: DataTableIndexPage,
})

function DataTableIndexPage() {
	return (
		<Page
			title="Data Table"
			subtitle="Composant de table de donnees avance base sur TanStack Table. Sorting, filtering, grouping, pagination, vues, inline editing, et composition via render props."
		>
			<ComponentSection components={subPages} />
		</Page>
	)
}
