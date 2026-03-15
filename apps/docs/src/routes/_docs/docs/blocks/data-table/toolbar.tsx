import { DataTable, col, createStatusViews } from "@blazz/pro/components/blocks/data-table"
import type { DataTableColumnDef, DataTableView } from "@blazz/pro/components/blocks/data-table"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
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
}

const products: Product[] = [
	{ id: "1", name: "Widget Pro", category: "Hardware", price: 299, stock: 42, status: "active" },
	{ id: "2", name: "Gadget X", category: "Electronics", price: 149, stock: 18, status: "active" },
	{ id: "3", name: "Tool Kit", category: "Hardware", price: 89, stock: 7, status: "draft" },
	{ id: "4", name: "Sensor V2", category: "Electronics", price: 459, stock: 0, status: "archived" },
	{ id: "5", name: "Cable Pack", category: "Accessories", price: 29, stock: 156, status: "active" },
	{ id: "6", name: "Mount Bracket", category: "Hardware", price: 45, stock: 23, status: "active" },
	{ id: "7", name: "Adapter USB-C", category: "Accessories", price: 19, stock: 89, status: "draft" },
	{ id: "8", name: "Display 4K", category: "Electronics", price: 599, stock: 3, status: "active" },
]

const toc = [
	{ id: "stacked-vs-classic", title: "Stacked vs Classic" },
	{ id: "views", title: "Views" },
	{ id: "search", title: "Search" },
	{ id: "toolbar-slots", title: "Toolbar Slots" },
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/toolbar")({
	component: ToolbarPage,
})

function ToolbarPage() {
	const columns: DataTableColumnDef<Product>[] = [
		col.text<Product>("name", { title: "Produit", showInlineFilter: true }),
		col.select<Product>("category", {
			title: "Categorie",
			options: [
				{ label: "Hardware", value: "Hardware" },
				{ label: "Electronics", value: "Electronics" },
				{ label: "Accessories", value: "Accessories" },
			],
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
		}),
	]

	const views = React.useMemo<DataTableView[]>(
		() =>
			createStatusViews({
				column: "status",
				statuses: [
					{ id: "active", name: "Actif", value: "active" },
					{ id: "draft", name: "Brouillon", value: "draft" },
					{ id: "archived", name: "Archive", value: "archived" },
				],
				allViewName: "Tous",
			}),
		[]
	)

	return (
		<DocPage title="Toolbar & Views" subtitle="Configuration du toolbar, layouts, views et recherche." toc={toc}>
			<DocSection id="stacked-vs-classic" title="Stacked vs Classic">
				<p className="text-fg-muted mb-4">
					Le DataTable propose deux layouts de toolbar via la prop <code>toolbarLayout</code>.
					Le mode <strong>classic</strong> (defaut) affiche tout sur une seule ligne.
					Le mode <strong>stacked</strong> empile les view pills, la recherche et les filtres
					sur 3 lignes distinctes — style Linear.
				</p>

				<p className="text-sm font-medium mb-2"><code>toolbarLayout="stacked"</code></p>
				<div className="rounded-lg border border-separator overflow-hidden mb-6">
					<DataTable
						data={products}
						columns={columns}
						toolbarLayout="stacked"
						enableSorting
						enableGlobalSearch
						enablePagination
						views={views}
						locale="fr"
						getRowId={(row) => row.id}
					/>
				</div>

				<p className="text-sm font-medium mb-2"><code>toolbarLayout="classic"</code></p>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={products}
						columns={columns}
						toolbarLayout="classic"
						enableSorting
						enableGlobalSearch
						enablePagination
						views={views}
						locale="fr"
						getRowId={(row) => row.id}
					/>
				</div>

				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto mt-4">
{`<DataTable
  toolbarLayout="stacked"  // ou "classic" (defaut)
  enableGlobalSearch
  views={views}
  ...
/>`}
				</pre>
			</DocSection>

			<DocSection id="views" title="Views">
				<p className="text-fg-muted mb-4">
					Les <strong>views</strong> sont des presets de filtres affiches sous forme de pilules dans le toolbar.
					Passez un tableau de <code>DataTableView[]</code> via la prop <code>views</code>.
				</p>
				<p className="text-fg-muted mb-4">
					La factory <code>createStatusViews()</code> genere automatiquement une vue "All" + une vue par statut :
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`import { createStatusViews } from "@blazz/pro/components/blocks/data-table"

const views = createStatusViews({
  column: "status",
  statuses: [
    { id: "active", name: "Actif", value: "active" },
    { id: "draft", name: "Brouillon", value: "draft" },
    { id: "archived", name: "Archive", value: "archived" },
  ],
  allViewName: "Tous",
})`}
				</pre>
				<p className="text-fg-muted mt-4 mb-4">
					Pour permettre aux utilisateurs de creer leurs propres vues, activez <code>enableCustomViews</code>.
					Un bouton "+" apparait apres les pilules de vues existantes.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`<DataTable
  views={views}
  enableCustomViews
  onViewSave={(view) => saveToBackend(view)}
  onViewDelete={(viewId) => deleteFromBackend(viewId)}
/>`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					Vous pouvez aussi construire des vues manuellement avec le type <code>DataTableView</code> :
					chaque vue contient un <code>FilterGroup</code> avec des conditions, un tri optionnel,
					et une visibilite de colonnes optionnelle.
				</p>
			</DocSection>

			<DocSection id="search" title="Search">
				<p className="text-fg-muted mb-4">
					Activez la barre de recherche globale avec <code>enableGlobalSearch</code>.
					Par defaut, la recherche filtre cote client sur toutes les colonnes texte.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`// Recherche client (defaut)
<DataTable enableGlobalSearch searchPlaceholder="Rechercher un produit..." />

// Recherche server-side
<DataTable
  enableGlobalSearch
  searchPlaceholder="Rechercher..."
  onSearchChange={(search) => {
    // Appel API avec debounce
    fetchProducts({ search })
  }}
/>`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					Quand <code>onSearchChange</code> est fourni, le DataTable n'applique plus de filtre client —
					c'est a vous de filtrer les donnees cote serveur et de passer le nouveau <code>data</code>.
				</p>
			</DocSection>

			<DocSection id="toolbar-slots" title="Toolbar Slots">
				<p className="text-fg-muted mb-4">
					Trois positions d'injection permettent d'ajouter du contenu dans le toolbar sans le remplacer.
					Voir la page <strong>Composition & Slots</strong> pour le detail complet.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`<DataTable
  toolbarLeadingSlot={<MyLogo />}        // Avant les view pills
  toolbarTrailingSlot={<ExportButton />}  // Apres les icones
  toolbarBelowSlot={<StatsStrip />}       // Entre toolbar et table
/>`}
				</pre>
			</DocSection>
		</DocPage>
	)
}
