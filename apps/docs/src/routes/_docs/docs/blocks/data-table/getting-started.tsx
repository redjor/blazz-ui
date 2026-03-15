import { DataTable, col } from "@blazz/pro/components/blocks/data-table"
import type { DataTableColumnDef } from "@blazz/pro/components/blocks/data-table"
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
	{ id: "basic", title: "Basic Usage" },
	{ id: "col-factories", title: "col.* Factories" },
	{ id: "variants", title: "Variants" },
	{ id: "density", title: "Density" },
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/getting-started")({
	component: GettingStartedPage,
})

function GettingStartedPage() {
	const basicColumns: DataTableColumnDef<Product>[] = [
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

	return (
		<DocPage title="Getting Started" subtitle="Installation et usage basique du DataTable." toc={toc}>
			<DocHero>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={products}
						columns={basicColumns}
						enableSorting
						enablePagination
						locale="fr"
						getRowId={(row) => row.id}
					/>
				</div>
			</DocHero>

			<DocSection id="basic" title="Usage basique">
				<p className="text-fg-muted mb-4">
					Le DataTable prend deux props obligatoires : <code>data</code> (tableau d'objets) et{" "}
					<code>columns</code> (definitions de colonnes). Utilisez les factories <code>col.*</code>{" "}
					pour creer des colonnes en une ligne.
				</p>
				<pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`import { DataTable, col } from "@blazz/pro/components/blocks/data-table"

const columns = [
  col.text<Product>("name", { title: "Produit" }),
  col.currency<Product>("price", { title: "Prix", currency: "EUR" }),
  col.numeric<Product>("stock", { title: "Stock" }),
]

<DataTable data={products} columns={columns} enableSorting enablePagination />`}
				</pre>
			</DocSection>

			<DocSection id="col-factories" title="col.* Factories">
				<p className="text-fg-muted mb-4">
					Les factories eliminent le boilerplate. Chaque factory derive le titre du nom de la cle
					(<code>"companyName"</code> → <code>"Company Name"</code>).
				</p>
				<div className="grid grid-cols-2 gap-3">
					{[
						{ name: "col.text", desc: "Texte avec filtre" },
						{ name: "col.numeric", desc: "Nombre aligne a droite" },
						{ name: "col.currency", desc: "Montant formate (EUR, $)" },
						{ name: "col.date", desc: "Date formatee" },
						{ name: "col.relativeDate", desc: "\"Il y a 2h\"" },
						{ name: "col.status", desc: "Badge colore" },
						{ name: "col.select", desc: "Dropdown filtrable" },
						{ name: "col.boolean", desc: "Checkbox / badge" },
						{ name: "col.tags", desc: "Chips inline" },
						{ name: "col.progress", desc: "Barre 0-100" },
						{ name: "col.user", desc: "Avatar + nom" },
						{ name: "col.link", desc: "Lien cliquable" },
						{ name: "col.twoLines", desc: "Titre + sous-titre" },
						{ name: "col.sparkline", desc: "Mini graphique SVG" },
						{ name: "col.duration", desc: "2h 30m" },
						{ name: "col.colorDot", desc: "Dot + label" },
					].map((f) => (
						<div key={f.name} className="flex items-baseline gap-2 text-sm">
							<code className="text-brand font-mono text-xs">{f.name}</code>
							<span className="text-fg-muted text-xs">— {f.desc}</span>
						</div>
					))}
				</div>
			</DocSection>

			<DocSection id="variants" title="Variants">
				<p className="text-fg-muted mb-4">6 variants visuels :</p>
				<div className="space-y-6">
					{(["default", "lined", "striped", "flat", "editable", "spreadsheet"] as const).map((v) => (
						<div key={v}>
							<p className="text-sm font-medium mb-2"><code>variant="{v}"</code></p>
							<div className="rounded-lg border border-separator overflow-hidden">
								<DataTable
									data={products.slice(0, 3)}
									columns={[
										col.text<Product>("name", { title: "Produit" }),
										col.currency<Product>("price", { title: "Prix", currency: "EUR" }),
										col.numeric<Product>("stock", { title: "Stock" }),
									]}
									variant={v}
									enablePagination={false}
									hideToolbar
									getRowId={(row) => row.id}
								/>
							</div>
						</div>
					))}
				</div>
			</DocSection>

			<DocSection id="density" title="Density">
				<p className="text-fg-muted mb-4">3 niveaux de densite : compact, default, comfortable.</p>
				<div className="space-y-6">
					{(["compact", "default", "comfortable"] as const).map((d) => (
						<div key={d}>
							<p className="text-sm font-medium mb-2"><code>density="{d}"</code></p>
							<div className="rounded-lg border border-separator overflow-hidden">
								<DataTable
									data={products.slice(0, 3)}
									columns={[
										col.text<Product>("name", { title: "Produit" }),
										col.currency<Product>("price", { title: "Prix", currency: "EUR" }),
									]}
									density={d}
									enablePagination={false}
									hideToolbar
									getRowId={(row) => row.id}
								/>
							</div>
						</div>
					))}
				</div>
			</DocSection>
		</DocPage>
	)
}
