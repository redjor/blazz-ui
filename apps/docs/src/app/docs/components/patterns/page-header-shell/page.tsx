"use client"

import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "basic",
		code: `import { PageHeader } from "@blazz/ui/components/patterns/page-header-shell"

export function ProductsPage() {
  return (
    <PageHeader
      title="Produits"
      description="Gérez votre catalogue de produits."
    />
  )
}`,
	},
	{
		key: "with-actions",
		code: `import { PageHeader } from "@blazz/ui/components/patterns/page-header-shell"
import { Button } from "@blazz/ui/components/ui/button"
import { Plus } from "lucide-react"

export function ProductsPage() {
  return (
    <PageHeader
      title="Produits"
      description="Gérez votre catalogue de produits."
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </>
      }
    />
  )
}`,
	},
	{
		key: "with-breadcrumbs",
		code: `import { PageHeader } from "@blazz/ui/components/patterns/page-header-shell"
import { Button } from "@blazz/ui/components/ui/button"

export function ProductDetailPage({ product }) {
  return (
    <PageHeader
      breadcrumbs={[
        { label: "Produits", href: "/products" },
        { label: product.name },   // dernier item = sans href → rendu en BreadcrumbPage
      ]}
      title={product.name}
      actions={
        <Button variant="outline">Modifier</Button>
      }
    />
  )
}`,
	},
	{
		key: "title-only",
		code: `import { PageHeader } from "@blazz/ui/components/patterns/page-header-shell"

// Titre seul — sans breadcrumbs ni actions
export function SimplePage() {
  return <PageHeader title="Paramètres" />
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const pageHeaderProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "Titre principal de la page (h1, 2xl bold). Affiché uniquement si fourni.",
	},
	{
		name: "description",
		type: "string",
		description: "Sous-titre descriptif sous le titre. 14px, text-muted.",
	},
	{
		name: "breadcrumbs",
		type: "BreadcrumbItemType[]",
		description:
			"Fil d'Ariane affiché au-dessus du titre. Le dernier item sans href est rendu en BreadcrumbPage (non-cliquable). Les items avec href sont des liens.",
	},
	{
		name: "actions",
		type: "React.ReactNode",
		description:
			"Slot libre pour les boutons d'action, alignés à droite du titre. Utiliser un fragment React pour plusieurs boutons.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires sur le conteneur.",
	},
]

const breadcrumbItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		required: true,
		description: "Texte affiché dans le breadcrumb.",
	},
	{
		name: "href",
		type: "string",
		description:
			"Si fourni, l'item est rendu comme un lien. Si omis (dernier item), rendu en BreadcrumbPage (texte simple, non-cliquable).",
	},
]

function PageHeaderPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="border-b border-edge-subtle bg-white dark:bg-card px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-fg">Produits</h1>
						<p className="mt-1 text-sm text-fg-muted">Gérez votre catalogue de produits.</p>
					</div>
				</div>
			</div>
		</div>
	)
}

function PageHeaderActionsPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="border-b border-edge-subtle bg-white dark:bg-card px-6 py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-fg">Produits</h1>
						<p className="mt-1 text-sm text-fg-muted">Gérez votre catalogue de produits.</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex h-8 items-center rounded border border-edge-subtle px-3 text-sm text-fg-secondary">
							Export
						</div>
						<div className="flex h-8 items-center gap-1.5 rounded bg-brand px-3 text-sm text-white">
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Ajouter un produit
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function PageHeaderBreadcrumbPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="border-b border-edge-subtle bg-white dark:bg-card px-6 py-4">
				<nav className="mb-2 flex items-center gap-1 text-sm">
					<span className="text-brand hover:underline cursor-pointer">Produits</span>
					<svg
						className="h-4 w-4 text-fg-muted"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
					<span className="text-fg-muted">MacBook Pro</span>
				</nav>
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold tracking-tight text-fg">MacBook Pro</h1>
					<div className="flex h-8 items-center rounded border border-edge-subtle px-3 text-sm text-fg-secondary">
						Modifier
					</div>
				</div>
			</div>
		</div>
	)
}

export default function PageHeaderShellPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Page Header Shell"
			subtitle="Header de page générique avec breadcrumbs, titre, description et un slot libre pour les actions. Version pattern (actions = ReactNode). Pour une API déclarative avec tableau d'actions, voir PageHeader dans blocks."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Titre et description"
					description="Usage minimal — titre et sous-titre descriptif."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<PageHeaderPreview />
				</DocExampleClient>
				<DocExampleClient
					title="Avec actions"
					description="Le slot actions accepte n'importe quel ReactNode aligné à droite du titre. Composer les boutons dans un fragment."
					code={examples[1].code}
					highlightedCode={html("with-actions")}
				>
					<PageHeaderActionsPreview />
				</DocExampleClient>
				<DocExampleClient
					title="Avec breadcrumbs"
					description="Les breadcrumbs sont affichés au-dessus du titre. Le dernier item sans href est rendu en BreadcrumbPage (non-cliquable)."
					code={examples[2].code}
					highlightedCode={html("with-breadcrumbs")}
				>
					<PageHeaderBreadcrumbPreview />
				</DocExampleClient>
				<DocExampleClient
					title="Titre seul"
					description="Tous les props sont optionnels — seul title est couramment utilisé seul."
					code={examples[3].code}
					highlightedCode={html("title-only")}
				>
					<div className="rounded border border-edge-subtle overflow-hidden">
						<div className="border-b border-edge-subtle bg-white dark:bg-card px-6 py-4">
							<h1 className="text-2xl font-bold tracking-tight text-fg">Paramètres</h1>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props — PageHeader">
				<DocPropsTable props={pageHeaderProps} />
			</DocSection>
			<DocSection id="breadcrumb-props" title="Props — BreadcrumbItemType">
				<DocPropsTable props={breadcrumbItemProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Page Header (blocks)",
							href: "/docs/blocks/page-header",
							description:
								"Version métier avec actions déclaratives (tableau PageHeaderAction) et slot actionsSlot.",
						},
						{
							title: "Top Bar",
							href: "/docs/components/patterns/top-bar",
							description:
								"Header de zone de contenu avec breadcrumbs contextuels fournis par AppFrame.",
						},
						{
							title: "Breadcrumb",
							href: "/docs/components/ui/breadcrumb",
							description: "Composant primitif de fil d'Ariane utilisé en interne.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
