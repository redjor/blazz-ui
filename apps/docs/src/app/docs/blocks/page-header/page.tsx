"use client"

import { use } from "react"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
import { Button } from "@blazz/ui/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { Download, MoreHorizontal, Plus, Send } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { PageHeader } from "@blazz/pro/components/blocks/page-header"

<PageHeader title="Produits" />`,
	},
	{
		key: "with-actions",
		code: `import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Button } from "@blazz/ui/components/ui/button"
import { Plus } from "lucide-react"

<PageHeader
  title="Produits"
  actions={
    <>
      <Button variant="outline">Export</Button>
      <Button>
        <Plus className="size-4" data-icon="inline-start" />
        Ajouter
      </Button>
    </>
  }
/>`,
	},
	{
		key: "with-after-title",
		code: `import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { MoreHorizontal, Download, Send } from "lucide-react"

<PageHeader
  title="INV0012"
  afterTitle={<Badge variant="critical">Unpaid</Badge>}
  actions={
    <>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="size-4" />
      </Button>
      <Button variant="outline">
        <Download className="size-4" data-icon="inline-start" />
        Export
      </Button>
      <Button>
        <Send className="size-4" data-icon="inline-start" />
        Send
      </Button>
    </>
  }
/>`,
	},
	{
		key: "with-top",
		code: `import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@blazz/ui/components/ui/breadcrumb"
import { Button } from "@blazz/ui/components/ui/button"

<PageHeader
  title="MacBook Pro"
  top={
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Produits</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>MacBook Pro</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
  actions={<Button variant="outline">Modifier</Button>}
/>`,
	},
	{
		key: "with-bottom",
		code: `import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Tabs, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"

<PageHeader
  title="Clients"
  bottom={
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="active">Actifs</TabsTrigger>
        <TabsTrigger value="archived">Archivés</TabsTrigger>
      </TabsList>
    </Tabs>
  }
/>`,
	},
	{
		key: "full",
		code: `import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@blazz/ui/components/ui/breadcrumb"
import { Button } from "@blazz/ui/components/ui/button"

<PageHeader
  title="INV0012"
  top={
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/invoices">Factures</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>INV0012</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
  afterTitle={<Badge variant="critical">Unpaid</Badge>}
  actions={<Button>Envoyer</Button>}
  bottom={<p className="text-sm text-fg-muted">Reçue le 29 mars 2025</p>}
/>`,
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
		required: true,
		description: "Titre principal de la page (h1, text-lg font-semibold).",
	},
	{
		name: "top",
		type: "React.ReactNode",
		description:
			"Slot au-dessus de la ligne titre. Typiquement des breadcrumbs ou un lien retour.",
	},
	{
		name: "afterTitle",
		type: "React.ReactNode",
		description:
			"Slot inline après le titre. Badge de statut, metadata, compteur.",
	},
	{
		name: "actions",
		type: "React.ReactNode",
		description:
			"Slot à droite de la ligne titre (justify-between). Boutons d'action, menu ⋯.",
	},
	{
		name: "bottom",
		type: "React.ReactNode",
		description:
			"Slot sous la ligne titre. Description, tabs, filtres.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires sur le conteneur racine.",
	},
]

// ---------------------------------------------------------------------------
// Live previews
// ---------------------------------------------------------------------------

function BasicPreview() {
	return <PageHeader title="Produits" />
}

function ActionsPreview() {
	return (
		<PageHeader
			title="Produits"
			actions={
				<>
					<Button variant="outline">Export</Button>
					<Button>
						<Plus className="size-4" data-icon="inline-start" />
						Ajouter
					</Button>
				</>
			}
		/>
	)
}

function AfterTitlePreview() {
	return (
		<PageHeader
			title="INV0012"
			afterTitle={<Badge variant="critical">Unpaid</Badge>}
			actions={
				<>
					<Button variant="ghost" size="icon">
						<MoreHorizontal className="size-4" />
					</Button>
					<Button variant="outline">
						<Download className="size-4" data-icon="inline-start" />
						Export
					</Button>
					<Button>
						<Send className="size-4" data-icon="inline-start" />
						Send
					</Button>
				</>
			}
		/>
	)
}

function TopPreview() {
	return (
		<PageHeader
			title="MacBook Pro"
			top={
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/products">Produits</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>MacBook Pro</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			}
			actions={<Button variant="outline">Modifier</Button>}
		/>
	)
}

function BottomPreview() {
	return (
		<PageHeader
			title="Clients"
			bottom={
				<Tabs defaultValue="all">
						<TabsList>
							<TabsTrigger value="all">Tous</TabsTrigger>
							<TabsTrigger value="active">Actifs</TabsTrigger>
							<TabsTrigger value="archived">Archivés</TabsTrigger>
						</TabsList>
					</Tabs>
			}
		/>
	)
}

function FullPreview() {
	return (
		<PageHeader
			title="INV0012"
			top={
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/invoices">Factures</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>INV0012</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			}
			afterTitle={<Badge variant="critical">Unpaid</Badge>}
			actions={<Button>Envoyer</Button>}
			bottom={<p className="text-sm text-fg-muted">Reçue le 29 mars 2025</p>}
		/>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PageHeaderDocPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Page Header"
			subtitle="Header de page composable avec 4 slots (top, afterTitle, actions, bottom) et un titre. Naked — aucun style visuel imposé, uniquement du layout."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Titre seul"
					description="Usage minimal — juste un titre."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicPreview />
				</DocExampleClient>

				<DocExampleClient
					title="Avec actions"
					description="Le slot actions accepte n'importe quel ReactNode, aligné à droite."
					code={examples[1].code}
					highlightedCode={html("with-actions")}
				>
					<ActionsPreview />
				</DocExampleClient>

				<DocExampleClient
					title="Avec afterTitle"
					description="Badge de statut, metadata ou compteur inline après le titre. Reproduit le pattern document header (facture, deal, etc.)."
					code={examples[2].code}
					highlightedCode={html("with-after-title")}
				>
					<AfterTitlePreview />
				</DocExampleClient>

				<DocExampleClient
					title="Avec breadcrumbs (top)"
					description="Le slot top est idéal pour les breadcrumbs. Le consumer compose librement avec les primitives Breadcrumb."
					code={examples[3].code}
					highlightedCode={html("with-top")}
				>
					<TopPreview />
				</DocExampleClient>

				<DocExampleClient
					title="Avec tabs (bottom)"
					description="Le slot bottom accueille des tabs, filtres, ou une description. Ici avec NavigationTabs."
					code={examples[4].code}
					highlightedCode={html("with-bottom")}
				>
					<BottomPreview />
				</DocExampleClient>

				<DocExampleClient
					title="Tous les slots"
					description="Exemple complet avec les 4 slots remplis."
					code={examples[5].code}
					highlightedCode={html("full")}
				>
					<FullPreview />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={pageHeaderProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Page Header Shell (patterns)",
							href: "/docs/components/patterns/page-header-shell",
							description:
								"Version open-source avec breadcrumbs et description intégrés.",
						},
						{
							title: "Breadcrumb",
							href: "/docs/components/ui/breadcrumb",
							description: "Primitif de fil d'Ariane pour le slot top.",
						},
						{
							title: "Tabs",
							href: "/docs/components/ui/tabs",
							description: "Composant Tabs pour le slot bottom.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
