"use client"

import type { DataTableColumnDef } from "@blazz/pro/components/blocks/data-table"
import { col, DataTable } from "@blazz/pro/components/blocks/data-table"
import { ArrowRight, Check, LayoutTemplate, SlidersHorizontal } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { use } from "react"
import { highlightExamples } from "~/lib/highlight-examples"

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
	{ id: "start-here", title: "Start Here" },
	{ id: "basic", title: "Basic Usage" },
	{ id: "recipe", title: "Recommended Recipe" },
	{ id: "col-factories", title: "col.* Factories" },
	{ id: "variants", title: "Variants" },
	{ id: "density", title: "Density" },
]

const factoryGroups = [
	{
		title: "Lecture simple",
		items: [
			{ name: "col.text", desc: "Texte, label, inline filter" },
			{ name: "col.numeric", desc: "Nombre aligne a droite" },
			{ name: "col.currency", desc: "Montant formate" },
			{ name: "col.date", desc: "Date formatee" },
			{ name: "col.relativeDate", desc: '"Il y a 2h"' },
		],
	},
	{
		title: "Statut & categorisation",
		items: [
			{ name: "col.status", desc: "Badge colore" },
			{ name: "col.select", desc: "Dropdown filtrable" },
			{ name: "col.boolean", desc: "Etat vrai/faux" },
			{ name: "col.tags", desc: "Chips inline" },
			{ name: "col.colorDot", desc: "Dot + label" },
		],
	},
	{
		title: "Cells enrichies",
		items: [
			{ name: "col.user", desc: "Avatar + nom" },
			{ name: "col.link", desc: "Lien cliquable" },
			{ name: "col.twoLines", desc: "Titre + sous-titre" },
			{ name: "col.progress", desc: "Barre 0-100" },
			{ name: "col.sparkline", desc: "Mini graphique SVG" },
		],
	},
]

const gettingStartedCode = `import { DataTable, col } from "@blazz/pro/components/blocks/data-table"

type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

const columns = [
  col.text<Product>("name", { title: "Produit" }),
  col.currency<Product>("price", { title: "Prix", currency: "EUR" }),
  col.numeric<Product>("stock", { title: "Stock" }),
]

<DataTable
  data={products}
  columns={columns}
  enableSorting
  enablePagination
  getRowId={(row) => row.id}
/>`

const recipeCode = `<DataTable
  data={products}
  columns={columns}
  enableSorting
  enablePagination
  enableGlobalSearch
  locale="fr"
  variant="lined"
  density="default"
  searchPlaceholder="Rechercher un produit..."
  getRowId={(row) => row.id}
/>`

const examples = [
	{ key: "basic", code: gettingStartedCode },
	{ key: "recipe", code: recipeCode },
] as const

const highlightedPromise = highlightExamples(examples as any)


export default function GettingStartedPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((item) => item.key === key)?.html ?? ""

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
		<DocPage
			title="Getting Started"
			subtitle="La route la plus courte pour mettre un DataTable propre en production: une base TanStack Table, un schema type, quelques factories col.*, puis le bon variant visuel."
			toc={toc}
		>
			<DocHero className="px-4 py-4 sm:px-6 sm:py-6">
				<div className="w-full overflow-hidden rounded-xl border border-separator bg-background shadow-sm">
					<DataTable
						data={products}
						columns={basicColumns}
						enableSorting
						enablePagination
						enableGlobalSearch
						searchPlaceholder="Rechercher un produit..."
						locale="fr"
						variant="lined"
						getRowId={(row) => row.id}
					/>
				</div>
			</DocHero>

			<DocSection id="start-here" title="Start Here">
				<div className="max-w-3xl space-y-3">
					<p className="text-sm leading-6 text-fg-muted">
						Commencez simple, puis enrichissez la table par couches: definir des colonnes lisibles,
						activer les interactions essentielles, puis choisir un rendu adapte a votre produit.
					</p>
					<p className="text-sm leading-6 text-fg-muted">
						Sous le capot, le composant s'appuie sur{" "}
						<strong className="text-fg">TanStack Table</strong>
						pour le moteur de colonnes, de tri et de pagination.
					</p>
				</div>
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
					<div className="rounded-xl border border-separator bg-background p-5">
						<div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg">
							<Check className="size-4 text-brand" />
							Checklist minimum viable
						</div>
						<div className="grid gap-3">
							{[
								"Modelez vos colonnes avec col.* au lieu d'ecrire des cells custom trop tot.",
								"Passez toujours un getRowId stable si vos donnees ont un id metier.",
								"Activez d'abord sorting + pagination, puis search et filtres selon le besoin reel.",
							].map((item) => (
								<div key={item} className="flex items-start gap-3 rounded-lg bg-surface-3/60 p-3">
									<Check className="mt-0.5 size-4 shrink-0 text-brand" />
									<p className="text-sm leading-6 text-fg-muted">{item}</p>
								</div>
							))}
						</div>
					</div>

					<div className="rounded-xl border border-separator bg-surface-3/40 p-5">
						<div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg">
							<SlidersHorizontal className="size-4 text-brand" />
							Quand ajouter plus
						</div>
						<div className="space-y-3 text-sm text-fg-muted">
							<p>
								<strong className="text-fg">Toolbar & Views</strong>: quand plusieurs personas
								consomment la meme table.
							</p>
							<p>
								<strong className="text-fg">Filtering</strong>: quand la recherche plein texte ne
								suffit plus.
							</p>
							<p>
								<strong className="text-fg">Composition</strong>: quand vous devez injecter stats,
								actions ou panels custom.
							</p>
						</div>
					</div>
				</div>
			</DocSection>

			<DocSection id="basic" title="Usage basique">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
					<div className="space-y-4">
						<p className="text-fg-muted">
							Le DataTable prend deux props obligatoires: <code>data</code> et <code>columns</code>.
							La meilleure entree de gamme consiste a partir de 3 a 5 colonnes creees avec{" "}
							<code>col.*</code>, puis d'ajouter les comportements standards. Le socle
							comportemental repose deja sur <code>TanStack Table</code>, donc vous recupererez ses
							primitives mentales habituelles autour des colonnes et des row models.
						</p>
						<div className="rounded-xl border border-separator bg-background p-4">
							<p className="mb-2 text-sm font-medium text-fg">
								Ce setup couvre deja la plupart des cas CRUD
							</p>
							<div className="space-y-2 text-sm text-fg-muted">
								<p className="flex items-center gap-2">
									<ArrowRight className="size-4 text-brand" /> Colonnes lisibles et typees
								</p>
								<p className="flex items-center gap-2">
									<ArrowRight className="size-4 text-brand" /> Tri et pagination integres
								</p>
								<p className="flex items-center gap-2">
									<ArrowRight className="size-4 text-brand" /> Identifiant de ligne stable
								</p>
							</div>
						</div>
					</div>
					<DocExampleClient
						code={gettingStartedCode}
						highlightedCode={html("basic")}
						defaultExpanded
						className="rounded-xl border border-separator bg-surface-3/40"
						previewClassName="hidden"
					>
						{null}
					</DocExampleClient>
				</div>
			</DocSection>

			<DocSection id="recipe" title="Recommended Recipe">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
					<DocExampleClient
						code={recipeCode}
						highlightedCode={html("recipe")}
						defaultExpanded
						className="rounded-xl border border-separator bg-surface-3/40"
						previewClassName="hidden"
					>
						{null}
					</DocExampleClient>
					<div className="rounded-xl border border-separator bg-background p-5">
						<div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg">
							<LayoutTemplate className="size-4 text-brand" />
							Pourquoi cette recette
						</div>
						<div className="space-y-3 text-sm leading-6 text-fg-muted">
							<p>
								<code>variant="lined"</code> fonctionne bien dans une doc, un back-office ou une app
								B2B dense.
							</p>
							<p>
								<code>enableGlobalSearch</code> donne un point d'entree unique avant d'introduire
								des filtres plus riches.
							</p>
							<p>
								<code>locale="fr"</code> garde des labels et formatages coherents si votre UI est
								francophone.
							</p>
						</div>
					</div>
				</div>
			</DocSection>

			<DocSection id="col-factories" title="col.* Factories">
				<p className="text-fg-muted">
					Les factories eliminent le boilerplate. Chaque factory derive le titre depuis la cle et
					fournit un rendu, un tri et souvent une configuration de filtre adaptes.
				</p>
				<div className="grid gap-4 lg:grid-cols-3">
					{factoryGroups.map((group) => (
						<div key={group.title} className="rounded-xl border border-separator bg-background p-4">
							<p className="mb-3 text-sm font-medium text-fg">{group.title}</p>
							<div className="space-y-2">
								{group.items.map((f) => (
									<div key={f.name} className="rounded-lg bg-surface-3/60 p-3">
										<code className="text-xs font-mono text-brand">{f.name}</code>
										<p className="mt-1 text-xs text-fg-muted">{f.desc}</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</DocSection>

			<DocSection id="variants" title="Variants">
				<p className="text-fg-muted mb-4">
					Choisissez le variant selon la tonalite de l'interface. Ne partez pas sur{" "}
					<code>editable</code> ou <code>spreadsheet</code> sans besoin produit explicite.
				</p>
				<div className="space-y-6">
					{(["default", "lined", "striped", "flat", "editable", "spreadsheet"] as const).map(
						(v) => (
							<div key={v}>
								<div className="mb-2 flex items-center justify-between gap-3">
									<p className="text-sm font-medium">
										<code>variant="{v}"</code>
									</p>
									<p className="text-xs text-fg-muted">
										{v === "default" && "Equilibre neutre pour la plupart des listes"}
										{v === "lined" && "Le plus propre pour des donnees denses"}
										{v === "striped" && "Lecture de ligne plus guidee"}
										{v === "flat" && "Aspect plus produit, moins grille"}
										{v === "editable" && "Pour edition frequente au clavier"}
										{v === "spreadsheet" && "Quand la table devient quasi un tableur"}
									</p>
								</div>
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
						)
					)}
				</div>
			</DocSection>

			<DocSection id="density" title="Density">
				<p className="text-fg-muted mb-4">
					La densite ajuste le rythme visuel. <code>compact</code> pour les outils experts,{" "}
					<code>default</code> pour un bon compromis, <code>comfortable</code> pour des ecrans plus
					explicatifs.
				</p>
				<div className="space-y-6">
					{(["compact", "default", "comfortable"] as const).map((d) => (
						<div key={d}>
							<div className="mb-2 flex items-center justify-between gap-3">
								<p className="text-sm font-medium">
									<code>density="{d}"</code>
								</p>
								<p className="text-xs text-fg-muted">
									{d === "compact" && "Maximum d'information visible"}
									{d === "default" && "Base recommandee"}
									{d === "comfortable" && "Plus d'air et de separation"}
								</p>
							</div>
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
