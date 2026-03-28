"use client"

import type { DataTableColumnDef } from "@blazz/pro/components/blocks/data-table"
import { col, DataTable } from "@blazz/pro/components/blocks/data-table"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"

interface Product {
	id: string
	name: string
	category: string
	price: number
	stock: number
	status: "active" | "draft" | "archived"
	inStock: boolean
	createdAt: string
}

const products: Product[] = [
	{
		id: "1",
		name: "Widget Pro",
		category: "Hardware",
		price: 299,
		stock: 42,
		status: "active",
		inStock: true,
		createdAt: "2026-01-15",
	},
	{
		id: "2",
		name: "Gadget X",
		category: "Electronics",
		price: 149,
		stock: 18,
		status: "active",
		inStock: true,
		createdAt: "2026-02-20",
	},
	{
		id: "3",
		name: "Tool Kit",
		category: "Hardware",
		price: 89,
		stock: 7,
		status: "draft",
		inStock: true,
		createdAt: "2026-03-01",
	},
	{
		id: "4",
		name: "Sensor V2",
		category: "Electronics",
		price: 459,
		stock: 0,
		status: "archived",
		inStock: false,
		createdAt: "2025-11-10",
	},
	{
		id: "5",
		name: "Cable Pack",
		category: "Accessories",
		price: 29,
		stock: 156,
		status: "active",
		inStock: true,
		createdAt: "2026-02-05",
	},
	{
		id: "6",
		name: "Mount Bracket",
		category: "Hardware",
		price: 45,
		stock: 23,
		status: "active",
		inStock: true,
		createdAt: "2026-01-28",
	},
	{
		id: "7",
		name: "Adapter USB-C",
		category: "Accessories",
		price: 19,
		stock: 89,
		status: "draft",
		inStock: true,
		createdAt: "2026-03-10",
	},
	{
		id: "8",
		name: "Display 4K",
		category: "Electronics",
		price: 599,
		stock: 3,
		status: "active",
		inStock: true,
		createdAt: "2025-12-15",
	},
]

const toc = [
	{ id: "filter-config", title: "filterConfig" },
	{ id: "advanced-filters", title: "Advanced Filters" },
	{ id: "inline-filters", title: "Inline Filters" },
	{ id: "filter-operators", title: "Filter Operators" },
]

export default function FilteringPage() {
	const columns: DataTableColumnDef<Product>[] = [
		col.text<Product>("name", {
			title: "Produit",
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		col.select<Product>("category", {
			title: "Categorie",
			options: [
				{ label: "Hardware", value: "Hardware" },
				{ label: "Electronics", value: "Electronics" },
				{ label: "Accessories", value: "Accessories" },
			],
			showInlineFilter: true,
		}),
		col.currency<Product>("price", { title: "Prix", currency: "EUR", locale: "fr-FR" }),
		col.numeric<Product>("stock", { title: "Stock" }),
		col.status<Product>("status", {
			title: "Statut",
			statusMap: {
				active: { label: "Actif", variant: "success" },
				draft: { label: "Brouillon", variant: "secondary" },
				archived: { label: "Archive", variant: "outline" },
			},
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		col.boolean<Product>("inStock", { title: "En stock" }),
		col.date<Product>("createdAt", { title: "Cree le" }),
	]

	return (
		<DocPage title="Filtering" subtitle="Configuration des filtres par colonne, filtres avances et operateurs disponibles." toc={toc}>
			<DocHero>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable data={products} columns={columns} toolbarLayout="stacked" enableSorting enableGlobalSearch enableAdvancedFilters enablePagination locale="fr" getRowId={(row) => row.id} />
				</div>
			</DocHero>

			<DocSection id="filter-config" title="filterConfig">
				<p className="text-fg-muted mb-4">
					Chaque colonne peut declarer un <code>filterConfig</code> qui determine comment elle apparait dans le filtre builder et les filtres inline. Les factories <code>col.*</code>
					generent automatiquement le bon <code>filterConfig</code>, mais vous pouvez le surcharger.
				</p>
				<p className="text-fg-muted mb-4">
					5 types disponibles : <code>text</code>, <code>number</code>, <code>date</code>, <code>boolean</code>, <code>select</code>.
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`// Text — recherche par contenu
col.text<Product>("name", {
  title: "Produit",
  showInlineFilter: true,     // Disponible dans les filtres inline
  defaultInlineFilter: true,  // Affiche par defaut (sans cliquer "Ajouter un filtre")
})

// Number — comparaisons numeriques
col.numeric<Product>("price", {
  title: "Prix",
  filterConfig: { type: "number", min: 0, max: 1000, step: 0.01 },
})

// Date — comparaisons de dates
col.date<Product>("createdAt", {
  title: "Cree le",
  filterConfig: { type: "date" },
})

// Boolean — vrai/faux
col.boolean<Product>("inStock", {
  title: "En stock",
  filterConfig: { type: "boolean" },
})

// Select — choix parmi des options predefinies
col.select<Product>("category", {
  title: "Categorie",
  options: [
    { label: "Hardware", value: "Hardware" },
    { label: "Electronics", value: "Electronics" },
  ],
  showInlineFilter: true,
  filterLabel: "Filtrer par categorie",  // Label custom dans le dropdown
})`}
				</pre>
			</DocSection>

			<DocSection id="advanced-filters" title="Advanced Filters">
				<p className="text-fg-muted mb-4">
					Activez <code>enableAdvancedFilters</code> pour afficher le filtre builder. Il permet de creer des conditions complexes avec logique AND/OR.
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  enableAdvancedFilters
  onFilterGroupChange={(filterGroup) => {
    // Pour le server-side filtering
    console.log(filterGroup)
  }}
/>`}
				</pre>
				<p className="text-fg-muted mt-4 mb-4">
					Le filtre est represente par un <code>FilterGroup</code> qui contient des <code>FilterCondition</code>
					et potentiellement des sous-groupes imbriques :
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`// (status = "active" OR status = "draft") AND price > 100
const filterGroup: FilterGroup = {
  id: "root",
  operator: "AND",
  conditions: [
    { id: "1", column: "price", operator: "greaterThan", value: 100, type: "number" },
  ],
  groups: [
    {
      id: "status-group",
      operator: "OR",
      conditions: [
        { id: "2", column: "status", operator: "equals", value: "active", type: "select" },
        { id: "3", column: "status", operator: "equals", value: "draft", type: "select" },
      ],
    },
  ],
}`}
				</pre>
			</DocSection>

			<DocSection id="inline-filters" title="Inline Filters">
				<p className="text-fg-muted mb-4">
					Les filtres inline apparaissent dans la troisieme ligne du toolbar <code>stacked</code>. Pour qu'une colonne soit disponible dans les filtres inline, ajoutez{" "}
					<code>showInlineFilter: true</code> dans son <code>filterConfig</code>.
				</p>
				<p className="text-fg-muted mb-4">
					Par defaut, les filtres inline sont caches derriere un bouton "Ajouter un filtre". Pour qu'un filtre soit visible immediatement, ajoutez <code>defaultInlineFilter: true</code>.
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`col.text<Product>("name", {
  showInlineFilter: true,     // Disponible dans le dropdown "Ajouter un filtre"
  defaultInlineFilter: true,  // Affiche directement sans cliquer
})

col.select<Product>("status", {
  options: [...],
  showInlineFilter: true,     // Disponible
  defaultInlineFilter: false, // Cache par defaut, l'utilisateur peut l'ajouter
})`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					Le dropdown "Ajouter un filtre" liste toutes les colonnes avec <code>showInlineFilter: true</code>
					qui ne sont pas deja affichees. Chaque sous-menu montre les operateurs disponibles pour le type de la colonne.
				</p>
			</DocSection>

			<DocSection id="filter-operators" title="Filter Operators">
				<p className="text-fg-muted mb-6">Chaque type de filtre dispose d'operateurs specifiques :</p>

				<div className="space-y-6">
					<div>
						<p className="text-sm font-medium mb-2">Text</p>
						<div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
							<p>contains, notContains, equals, notEquals, startsWith, endsWith, isEmpty, isNotEmpty</p>
						</div>
					</div>

					<div>
						<p className="text-sm font-medium mb-2">Number</p>
						<div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
							<p>equals, notEquals, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, between, isEmpty, isNotEmpty</p>
						</div>
					</div>

					<div>
						<p className="text-sm font-medium mb-2">Date</p>
						<div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
							<p>equals, notEquals, greaterThan (after), greaterThanOrEqual (on or after), lessThan (before), lessThanOrEqual (on or before), between, isEmpty, isNotEmpty</p>
						</div>
					</div>

					<div>
						<p className="text-sm font-medium mb-2">Select</p>
						<div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
							<p>equals, notEquals, in, notIn</p>
						</div>
					</div>

					<div>
						<p className="text-sm font-medium mb-2">Boolean</p>
						<div className="bg-muted rounded-lg p-4 text-sm font-mono space-y-1">
							<p>equals</p>
						</div>
					</div>
				</div>

				<p className="text-fg-muted mt-6 text-sm">
					Vous pouvez restreindre les operateurs disponibles via la prop <code>operators</code> dans le <code>filterConfig</code> :
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto mt-2">
					{`filterConfig: {
  type: "text",
  operators: ["contains", "equals"],  // Seuls ces 2 operateurs seront proposes
}`}
				</pre>
			</DocSection>
		</DocPage>
	)
}
