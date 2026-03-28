"use client"

import type { DataTableColumnDef, DataTableView, RowAction } from "@blazz/pro/components/blocks/data-table"
import { col, createStatusViews, DataTable } from "@blazz/pro/components/blocks/data-table"
import { ArrowRight, Columns3, Filter, Grid3X3, Keyboard, Layers, LayoutList, Pencil, Puzzle, Settings2, Table2, Trash2 } from "lucide-react"
import Link from "next/link"
import React, { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

interface Deal {
	id: string
	company: string
	contact: string
	amount: number
	stage: "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
	probability: number
	createdAt: number
}

const deals: Deal[] = [
	{
		id: "1",
		company: "Acme Corp",
		contact: "Jean Dupont",
		amount: 45000,
		stage: "negotiation",
		probability: 80,
		createdAt: Date.now() - 2 * 86400000,
	},
	{
		id: "2",
		company: "Globex Inc",
		contact: "Marie Martin",
		amount: 28000,
		stage: "proposal",
		probability: 60,
		createdAt: Date.now() - 5 * 86400000,
	},
	{
		id: "3",
		company: "Initech",
		contact: "Pierre Durand",
		amount: 92000,
		stage: "won",
		probability: 100,
		createdAt: Date.now() - 10 * 86400000,
	},
	{
		id: "4",
		company: "Umbrella Ltd",
		contact: "Sophie Moreau",
		amount: 15000,
		stage: "lead",
		probability: 20,
		createdAt: Date.now() - 1 * 86400000,
	},
	{
		id: "5",
		company: "Stark Industries",
		contact: "Lucas Bernard",
		amount: 67000,
		stage: "qualified",
		probability: 40,
		createdAt: Date.now() - 3 * 86400000,
	},
	{
		id: "6",
		company: "Wayne Enterprises",
		contact: "Emma Petit",
		amount: 120000,
		stage: "negotiation",
		probability: 75,
		createdAt: Date.now() - 7 * 86400000,
	},
	{
		id: "7",
		company: "Cyberdyne",
		contact: "Thomas Leroy",
		amount: 8500,
		stage: "lost",
		probability: 0,
		createdAt: Date.now() - 14 * 86400000,
	},
	{
		id: "8",
		company: "Oscorp",
		contact: "Camille Roux",
		amount: 34000,
		stage: "proposal",
		probability: 50,
		createdAt: Date.now() - 4 * 86400000,
	},
]

// ---------------------------------------------------------------------------
// Stage config for flat mode
// ---------------------------------------------------------------------------

const _stageLabels: Record<string, string> = {
	lead: "Lead",
	qualified: "Qualifie",
	proposal: "Proposition",
	negotiation: "Negociation",
	won: "Gagne",
	lost: "Perdu",
}

const stageTint: Record<string, string> = {
	lead: "oklch(0.95 0.02 250)",
	qualified: "oklch(0.95 0.02 200)",
	proposal: "oklch(0.95 0.02 60)",
	negotiation: "oklch(0.95 0.02 30)",
	won: "oklch(0.95 0.03 145)",
	lost: "oklch(0.95 0.02 15)",
}

const stageEmoji: Record<string, string> = {
	lead: "🔵",
	qualified: "🟣",
	proposal: "🟡",
	negotiation: "🟠",
	won: "🟢",
	lost: "🔴",
}

function formatCurrency(value: number) {
	return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
}

// ---------------------------------------------------------------------------
// Sub-pages
// ---------------------------------------------------------------------------

const subPages = [
	{
		title: "Getting Started",
		href: "/docs/blocks/data-table/getting-started",
		description: "Installation, usage basique, col.* factories pour des colonnes en une ligne.",
		icon: Table2,
	},
	{
		title: "Flat Mode",
		href: "/docs/blocks/data-table/flat-mode",
		description: "Variant flat, renderRow, grouping par statut — le style Linear.",
		icon: LayoutList,
	},
	{
		title: "Toolbar & Views",
		href: "/docs/blocks/data-table/toolbar",
		description: "Stacked/classic layout, vues prefaites, search, toolbar slots.",
		icon: Settings2,
	},
	{
		title: "Filtering",
		href: "/docs/blocks/data-table/filtering",
		description: "Filtres avances, filtres inline, filterConfig par colonne.",
		icon: Filter,
	},
	{
		title: "Columns",
		href: "/docs/blocks/data-table/columns",
		description: "col.* factories, cells reutilisables, colonnes custom.",
		icon: Columns3,
	},
	{
		title: "Inline Editing",
		href: "/docs/blocks/data-table/editing",
		description: "Edition inline, undo/redo (Ctrl+Z), navigation clavier entre cellules.",
		icon: Keyboard,
	},
	{
		title: "Composition & Slots",
		href: "/docs/blocks/data-table/composition",
		description: "renderGroupHeader, renderRowActions, renderPagination, toolbar slots, footerSlot.",
		icon: Puzzle,
	},
	{
		title: "Grouping & Expansion",
		href: "/docs/blocks/data-table/grouping",
		description: "Grouping par colonne, agregations, row expand avec panels custom.",
		icon: Layers,
	},
	{
		title: "API Reference",
		href: "/docs/blocks/data-table/api",
		description: "Reference complete de tous les props, types et interfaces.",
		icon: Grid3X3,
	},
]

// ---------------------------------------------------------------------------
// Code examples
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "quick-start",
		code: `import { DataTable, col } from "@blazz/pro/components/blocks/data-table"

const columns = [
  col.text<Deal>("company", { title: "Entreprise" }),
  col.currency<Deal>("amount", { title: "Montant", currency: "EUR" }),
  col.select<Deal>("stage", {
    title: "Etape",
    options: [
      { label: "Lead", value: "lead" },
      { label: "Qualifie", value: "qualified" },
      { label: "Gagne", value: "won" },
      { label: "Perdu", value: "lost" },
    ],
  }),
  col.relativeDate<Deal>("createdAt", { title: "Cree" }),
]

<DataTable
  data={deals}
  columns={columns}
  enableSorting
  enablePagination
  locale="fr"
  getRowId={(row) => row.id}
/>`,
	},
	{
		key: "stacked-toolbar",
		code: `import { DataTable, col, createStatusViews } from "@blazz/pro/components/blocks/data-table"

const views = createStatusViews({
  column: "stage",
  statuses: [
    { id: "lead", name: "Leads", value: "lead" },
    { id: "qualified", name: "Qualifies", value: "qualified" },
    { id: "won", name: "Gagnes", value: "won" },
    { id: "lost", name: "Perdus", value: "lost" },
  ],
  allViewName: "Tous",
})

<DataTable
  data={deals}
  columns={columns}
  views={views}
  toolbarLayout="stacked"
  enableGlobalSearch
  enableAdvancedFilters
  enableCustomViews
  enableRowSelection
  searchPlaceholder="Rechercher..."
  locale="fr"
  getRowId={(row) => row.id}
/>`,
	},
	{
		key: "flat-mode",
		code: `<DataTable
  data={deals}
  columns={columns}
  variant="flat"
  enableGrouping
  defaultGrouping={["stage"]}
  defaultExpanded
  groupRowStyle={(row) => ({
    background: stageTint[row.getValue("stage")],
  })}
  renderRow={(row) => (
    <>
      <div className="flex flex-1 items-center gap-3">
        <span>{stageEmoji[row.original.stage]}</span>
        <span className="font-medium">{row.original.company}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-fg-muted">
          {formatCurrency(row.original.amount)}
        </span>
      </div>
    </>
  )}
  getRowId={(row) => row.id}
/>`,
	},
]

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

const toc = [
	{ id: "demo", title: "Demo" },
	{ id: "quick-start", title: "Quick Start" },
	{ id: "stacked-toolbar", title: "Stacked Toolbar" },
	{ id: "flat-mode", title: "Flat Mode" },
	{ id: "features", title: "Features" },
	{ id: "pages", title: "Documentation" },
]

export default function DataTableIndexPage() {
	const highlighted = use(highlightedPromise)
	const getHighlighted = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	// ----- Hero columns (full-featured) -----
	const heroColumns = React.useMemo<DataTableColumnDef<Deal>[]>(
		() => [
			col.text<Deal>("company", { title: "Entreprise", showInlineFilter: true }),
			col.currency<Deal>("amount", { title: "Montant", currency: "EUR", locale: "fr-FR" }),
			col.select<Deal>("stage", {
				title: "Etape",
				options: [
					{ label: "Lead", value: "lead" },
					{ label: "Qualifie", value: "qualified" },
					{ label: "Proposition", value: "proposal" },
					{ label: "Negociation", value: "negotiation" },
					{ label: "Gagne", value: "won" },
					{ label: "Perdu", value: "lost" },
				],
				showInlineFilter: true,
				defaultInlineFilter: true,
			}),
			col.relativeDate<Deal>("createdAt", { title: "Cree", locale: "fr-FR" }),
		],
		[]
	)

	const heroViews = React.useMemo<DataTableView[]>(
		() =>
			createStatusViews({
				column: "stage",
				statuses: [
					{ id: "lead", name: "Leads", value: "lead" },
					{ id: "qualified", name: "Qualifies", value: "qualified" },
					{ id: "proposal", name: "Propositions", value: "proposal" },
					{ id: "negotiation", name: "Negociation", value: "negotiation" },
					{ id: "won", name: "Gagnes", value: "won" },
					{ id: "lost", name: "Perdus", value: "lost" },
				],
				allViewName: "Tous",
			}),
		[]
	)

	const rowActions = React.useMemo<RowAction<Deal>[]>(
		() => [
			{ id: "edit", label: "Modifier", icon: Pencil, handler: () => {} },
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				separator: true,
				handler: () => {},
			},
		],
		[]
	)

	// ----- Basic columns (quick start) -----
	const basicColumns = React.useMemo<DataTableColumnDef<Deal>[]>(
		() => [
			col.text<Deal>("company", { title: "Entreprise" }),
			col.currency<Deal>("amount", { title: "Montant", currency: "EUR", locale: "fr-FR" }),
			col.select<Deal>("stage", {
				title: "Etape",
				options: [
					{ label: "Lead", value: "lead" },
					{ label: "Qualifie", value: "qualified" },
					{ label: "Proposition", value: "proposal" },
					{ label: "Negociation", value: "negotiation" },
					{ label: "Gagne", value: "won" },
					{ label: "Perdu", value: "lost" },
				],
			}),
			col.relativeDate<Deal>("createdAt", { title: "Cree", locale: "fr-FR" }),
		],
		[]
	)

	// ----- Stacked toolbar columns + views -----
	const stackedViews = React.useMemo<DataTableView[]>(
		() =>
			createStatusViews({
				column: "stage",
				statuses: [
					{ id: "lead", name: "Leads", value: "lead" },
					{ id: "qualified", name: "Qualifies", value: "qualified" },
					{ id: "won", name: "Gagnes", value: "won" },
					{ id: "lost", name: "Perdus", value: "lost" },
				],
				allViewName: "Tous",
			}),
		[]
	)

	// ----- Flat mode columns -----
	const flatColumns = React.useMemo<DataTableColumnDef<Deal>[]>(
		() => [
			col.text<Deal>("company", { title: "Entreprise" }),
			col.currency<Deal>("amount", { title: "Montant", currency: "EUR", locale: "fr-FR" }),
			col.select<Deal>("stage", {
				title: "Etape",
				options: [
					{ label: "Lead", value: "lead" },
					{ label: "Qualifie", value: "qualified" },
					{ label: "Proposition", value: "proposal" },
					{ label: "Negociation", value: "negotiation" },
					{ label: "Gagne", value: "won" },
					{ label: "Perdu", value: "lost" },
				],
			}),
			col.relativeDate<Deal>("createdAt", { title: "Cree", locale: "fr-FR" }),
		],
		[]
	)

	return (
		<DocPage
			title="Data Table"
			subtitle="Composant de table de donnees avance pour apps data-heavy. Base sur TanStack Table, concu pour le vibe coding — sorting, filtering, grouping, vues, inline editing, et composition via render props."
			toc={toc}
		>
			{/* ----------------------------------------------------------------- */}
			{/* Hero — full-featured demo */}
			{/* ----------------------------------------------------------------- */}
			<DocHero>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={deals}
						columns={heroColumns}
						views={heroViews}
						rowActions={rowActions}
						toolbarLayout="stacked"
						enableSorting
						enableGlobalSearch
						enableAdvancedFilters
						enableCustomViews
						enableRowSelection
						enablePagination
						pagination={{ pageSize: 5, pageSizeOptions: [5, 10, 25] }}
						searchPlaceholder="Rechercher un deal..."
						locale="fr"
						variant="lined"
						getRowId={(row) => row.id}
					/>
				</div>
			</DocHero>

			{/* ----------------------------------------------------------------- */}
			{/* Quick Start */}
			{/* ----------------------------------------------------------------- */}
			<DocSection id="quick-start" title="Quick Start">
				<DocExampleClient title="Usage minimal" description="Le minimum pour afficher un DataTable avec tri et pagination." code={examples[0].code} highlightedCode={getHighlighted("quick-start")}>
					<div className="rounded-lg border border-separator overflow-hidden">
						<DataTable data={deals} columns={basicColumns} enableSorting enablePagination locale="fr" getRowId={(row) => row.id} />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ----------------------------------------------------------------- */}
			{/* Stacked Toolbar */}
			{/* ----------------------------------------------------------------- */}
			<DocSection id="stacked-toolbar" title="Stacked Toolbar">
				<DocExampleClient
					title="Toolbar avec vues"
					description="Toolbar style Linear avec vues en tabs, recherche globale, filtres avances et selection."
					code={examples[1].code}
					highlightedCode={getHighlighted("stacked-toolbar")}
				>
					<div className="rounded-lg border border-separator overflow-hidden">
						<DataTable
							data={deals}
							columns={basicColumns}
							views={stackedViews}
							toolbarLayout="stacked"
							enableGlobalSearch
							enableAdvancedFilters
							enableCustomViews
							enableRowSelection
							enableSorting
							enablePagination
							searchPlaceholder="Rechercher..."
							locale="fr"
							getRowId={(row) => row.id}
						/>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ----------------------------------------------------------------- */}
			{/* Flat Mode */}
			{/* ----------------------------------------------------------------- */}
			<DocSection id="flat-mode" title="Flat Mode">
				<DocExampleClient
					title="Mode flat avec grouping"
					description="Remplace les lignes de table par un renderRow libre. Ideal pour les listes style Linear groupees par statut."
					code={examples[2].code}
					highlightedCode={getHighlighted("flat-mode")}
				>
					<DataTable
						data={deals}
						columns={flatColumns}
						variant="flat"
						enableGrouping
						defaultGrouping={["stage"]}
						defaultExpanded
						groupRowStyle={(row) => ({
							background: stageTint[row.getValue("stage") as string],
						})}
						renderRow={(row) => (
							<>
								<div className="flex flex-1 items-center gap-3">
									<span>{stageEmoji[row.original.stage]}</span>
									<span className="font-medium text-fg">{row.original.company}</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-fg-muted">{formatCurrency(row.original.amount)}</span>
								</div>
							</>
						)}
						getRowId={(row) => row.id}
					/>
				</DocExampleClient>
			</DocSection>

			{/* ----------------------------------------------------------------- */}
			{/* Features */}
			{/* ----------------------------------------------------------------- */}
			<DocSection id="features" title="Features">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{[
						{ title: "6 variants", desc: "default, lined, striped, flat, editable, spreadsheet" },
						{ title: "col.* factories", desc: "28 factories pour creer des colonnes en une ligne" },
						{
							title: "Stacked toolbar",
							desc: "Toolbar Linear-style avec vues en tabs, search, filtres",
						},
						{ title: "Views", desc: "Vues prefaites + vues custom sauvegardables" },
						{ title: "Advanced filters", desc: "Filter builder AND/OR avec 15 operateurs" },
						{ title: "Grouping", desc: "Grouping par colonne avec agregations (sum, avg, count)" },
						{ title: "Flat mode", desc: "renderRow pour des lignes composables style Linear" },
						{ title: "Inline editing", desc: "Edition cellule, undo/redo, navigation clavier" },
						{ title: "Composition", desc: "8 slots pour injecter du contenu custom partout" },
						{ title: "Row selection", desc: "Checkbox + bulk actions avec confirmation" },
						{ title: "Row expansion", desc: "Panel detail expandable (grid ou tabs)" },
						{ title: "Column pinning", desc: "Colonnes sticky gauche/droite" },
					].map((f) => (
						<div key={f.title} className="rounded-lg border border-separator p-3">
							<p className="text-sm font-medium text-fg">{f.title}</p>
							<p className="text-xs text-fg-muted mt-1">{f.desc}</p>
						</div>
					))}
				</div>
			</DocSection>

			{/* ----------------------------------------------------------------- */}
			{/* Documentation sub-pages */}
			{/* ----------------------------------------------------------------- */}
			<DocSection id="pages" title="Documentation">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{subPages.map((page) => {
						const Icon = page.icon
						return (
							<Link key={page.href} href={page.href} className="group rounded-lg border border-separator p-4 hover:border-brand/50 transition-colors">
								<div className="flex items-start gap-3">
									<div className="rounded-md bg-muted p-2 shrink-0">
										<Icon className="size-4 text-fg-muted group-hover:text-brand transition-colors" />
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium text-fg group-hover:text-brand transition-colors flex items-center gap-1">
											{page.title}
											<ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
										</p>
										<p className="text-xs text-fg-muted mt-1">{page.description}</p>
									</div>
								</div>
							</Link>
						)
					})}
				</div>
			</DocSection>
		</DocPage>
	)
}
