import type { DataTableColumnDef } from "@blazz/pro/components/blocks/data-table"
import { col, DataTable } from "@blazz/pro/components/blocks/data-table"
import { createFileRoute } from "@tanstack/react-router"
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
	{
		id: "7",
		name: "Adapter USB-C",
		category: "Accessories",
		price: 19,
		stock: 89,
		status: "draft",
	},
	{ id: "8", name: "Display 4K", category: "Electronics", price: 599, stock: 3, status: "active" },
]

const toc = [
	{ id: "grouping", title: "Grouping" },
	{ id: "group-header", title: "Group Header" },
	{ id: "row-expansion", title: "Row Expansion" },
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/grouping")({
	component: GroupingPage,
})

function GroupingPage() {
	const columns: DataTableColumnDef<Product>[] = [
		col.text<Product>("name", { title: "Produit" }),
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

	const expandColumns: DataTableColumnDef<Product>[] = [
		col.expand<Product>(),
		col.text<Product>("name", { title: "Produit" }),
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
	]

	return (
		<DocPage
			title="Grouping & Expansion"
			subtitle="Regroupement de lignes, aggregations et panels de detail."
			toc={toc}
		>
			<DocHero>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={products}
						columns={columns}
						enableSorting
						enableGrouping
						defaultGrouping={["category"]}
						defaultExpanded
						groupAggregations={{
							price: "sum",
							stock: "sum",
						}}
						enablePagination={false}
						locale="fr"
						getRowId={(row) => row.id}
					/>
				</div>
			</DocHero>

			<DocSection id="grouping" title="Grouping">
				<p className="text-fg-muted mb-4">
					Activez <code>enableGrouping</code> pour permettre le regroupement de lignes par colonne.
					Utilisez <code>defaultGrouping</code> pour grouper par defaut et{" "}
					<code>defaultExpanded</code>
					pour ouvrir tous les groupes au chargement.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  enableGrouping
  defaultGrouping={["category"]}
  defaultExpanded       // Tous les groupes ouverts
  onGroupingChange={(grouping) => {
    console.log(grouping) // ["category"]
  }}
/>`}
				</pre>

				<p className="text-fg-muted mt-6 mb-4">
					La prop <code>groupAggregations</code> ajoute des valeurs agregees dans le header de
					chaque groupe. Types disponibles : <code>sum</code>, <code>avg</code>, <code>min</code>,{" "}
					<code>max</code>, <code>count</code>, <code>range</code>, ou une fonction custom.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  enableGrouping
  defaultGrouping={["category"]}
  groupAggregations={{
    price: "sum",    // Somme des prix du groupe
    stock: "avg",    // Moyenne du stock
    score: "count",  // Nombre de valeurs non-null

    // Fonction custom
    revenue: (values) => {
      const total = values.reduce((sum, v) => sum + (v as number), 0)
      return <span className="font-medium">{formatCurrency(total)}</span>
    },
  }}
/>`}
				</pre>
			</DocSection>

			<DocSection id="group-header" title="Group Header">
				<p className="text-fg-muted mb-4">
					Par defaut, le header de groupe affiche : un chevron expand/collapse, le rendu de la
					cellule de la colonne groupee, un pill avec le nombre de lignes, et les valeurs
					d'agregation.
				</p>
				<p className="text-fg-muted mb-4">Deux render props permettent de customiser le header :</p>
				<ul className="text-fg-muted text-sm space-y-2 mb-4 list-disc list-inside">
					<li>
						<code>renderGroupHeader</code> — remplacement total du group header (recoit la row + le
						contenu par defaut)
					</li>
					<li>
						<code>renderGroupHeaderContent</code> — remplace uniquement le contenu central (entre le
						chevron et les agregations)
					</li>
				</ul>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`// Remplacement du contenu central uniquement
renderGroupHeaderContent={({ row, groupValue, subRowCount, aggregations }) => (
  <span className="flex items-center gap-2">
    <CategoryIcon category={groupValue} />
    <span className="font-medium">{groupValue}</span>
    <span className="text-xs text-fg-muted">({subRowCount} items)</span>
  </span>
)}

// Remplacement total
renderGroupHeader={(row, defaultContent) => (
  <div className="flex items-center justify-between w-full">
    {defaultContent}
    <Button size="sm" variant="ghost">Action</Button>
  </div>
)}`}
				</pre>
				<p className="text-fg-muted mt-4 text-sm">
					Priorite : <code>renderGroupHeader</code> {">"} <code>renderGroupHeaderContent</code>{" "}
					{">"} rendu par defaut. Voir la page <strong>Composition & Slots</strong> pour plus de
					details.
				</p>
			</DocSection>

			<DocSection id="row-expansion" title="Row Expansion">
				<p className="text-fg-muted mb-4">
					Le row expansion est independant du grouping — il ajoute un panel de detail sous chaque
					ligne. Activez-le avec <code>enableRowExpand</code> et fournissez{" "}
					<code>renderExpandedRow</code>.
				</p>
				<div className="rounded-lg border border-separator overflow-hidden mb-4">
					<DataTable
						data={products}
						columns={expandColumns}
						enableRowExpand
						expandMode="single"
						renderExpandedRow={(row) => (
							<div className="grid grid-cols-3 gap-4 p-4 text-sm">
								<div>
									<p className="text-fg-muted text-xs mb-1">Categorie</p>
									<p className="text-fg font-medium">{row.original.category}</p>
								</div>
								<div>
									<p className="text-fg-muted text-xs mb-1">Prix unitaire</p>
									<p className="text-fg font-medium">{row.original.price} EUR</p>
								</div>
								<div>
									<p className="text-fg-muted text-xs mb-1">Valeur stock</p>
									<p className="text-fg font-medium">
										{row.original.price * row.original.stock} EUR
									</p>
								</div>
							</div>
						)}
						enablePagination={false}
						hideToolbar
						locale="fr"
						getRowId={(row) => row.id}
					/>
				</div>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  enableRowExpand
  expandMode="single"    // "single" (accordion) ou "multiple"
  defaultExpanded={false} // false (tout ferme), true (tout ouvert), ou ["row-1", "row-3"]
  renderExpandedRow={(row) => (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div>
        <p className="text-fg-muted text-xs">Categorie</p>
        <p className="font-medium">{row.original.category}</p>
      </div>
      <div>
        <p className="text-fg-muted text-xs">Prix</p>
        <p className="font-medium">{row.original.price} EUR</p>
      </div>
    </div>
  )}
/>`}
				</pre>
				<p className="text-fg-muted mt-4 mb-4">
					Ajoutez <code>col.expand()</code> dans vos colonnes pour afficher le chevron de toggle.
					Sinon, le toggle se fait via <code>onRowClick</code> ou programmatiquement.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
					{`const columns = [
  col.expand<Product>(),  // Chevron en premiere colonne
  col.text<Product>("name", { title: "Produit" }),
  col.currency<Product>("price", { title: "Prix" }),
]`}
				</pre>
			</DocSection>
		</DocPage>
	)
}
