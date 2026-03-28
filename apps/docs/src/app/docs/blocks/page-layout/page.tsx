"use client"

import { Page, PageSection, PageWrapper } from "@blazz/pro/components/blocks/page"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage as BreadcrumbPageItem, BreadcrumbSeparator } from "@blazz/ui/components/ui/breadcrumb"
import { Button } from "@blazz/ui/components/ui/button"
import { Plus } from "lucide-react"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

/* ------------------------------------------------------------------ */
/*  Examples                                                           */
/* ------------------------------------------------------------------ */

const examples = [
	{
		key: "basic",
		code: `<Page header={<PageHeader title="Produits" actions={<Button>Ajouter</Button>} />}>
  <p>Contenu de la page</p>
</Page>`,
	},
	{
		key: "with-breadcrumbs",
		code: `<Page
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
  header={
    <PageHeader
      title="MacBook Pro"
      afterTitle={<Badge variant="outline">Active</Badge>}
      actions={<Button>Modifier</Button>}
    />
  }
>
  <p>Détail du produit</p>
</Page>`,
	},
	{
		key: "with-nav",
		code: `<Page
  header={
    <PageHeader
      title="Clients"
      actions={<Button><Plus className="size-4" /> Ajouter</Button>}
    />
  }
  nav={
    <NavTabs
      basePath="/clients"
      tabs={[
        { label: "Tous", href: "" },
        { label: "Actifs", href: "/active" },
        { label: "Archivés", href: "/archived" },
      ]}
    />
  }
>
  <p>Table clients ici</p>
</Page>`,
	},
	{
		key: "no-separator",
		code: `<Page
  header={<PageHeader title="Dashboard" />}
  separator={false}
>
  <p>Pas de bordure entre le header et le contenu</p>
</Page>`,
	},
	{
		key: "wrapper-card",
		code: `<Page header={<PageHeader title="Nouveau client" />}>
  <PageWrapper size="sm" card>
    <p>Formulaire dans un card</p>
  </PageWrapper>
</Page>`,
	},
	{
		key: "wrapper-sizes",
		code: `<Page header={<PageHeader title="Comparaison" />} separator={false}>
  <PageWrapper size="sm">sm — max-w-2xl</PageWrapper>
  <PageWrapper size="md">md — max-w-4xl</PageWrapper>
  <PageWrapper size="lg">lg — max-w-6xl</PageWrapper>
  <PageWrapper size="full">full — pas de limite</PageWrapper>
</Page>`,
	},
	{
		key: "sections",
		code: `<Page header={<PageHeader title="Paramètres" />}>
  <PageWrapper size="sm">
    <PageSection title="Général" description="Infos de base">
      <p>Champs ici</p>
    </PageSection>
    <PageSection title="Notifications" description="Préférences">
      <p>Champs ici</p>
    </PageSection>
  </PageWrapper>
</Page>`,
	},
	{
		key: "full",
		code: `<Page
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
  header={
    <PageHeader
      title="INV0012"
      afterTitle={<Badge variant="critical">Impayée</Badge>}
      actions={<Button>Envoyer</Button>}
    />
  }
>
  <PageWrapper size="sm" card>
    <PageSection title="Détails" description="Informations de la facture">
      <p>Lignes de facture...</p>
    </PageSection>
    <PageSection title="Paiement">
      <p>Infos de paiement...</p>
    </PageSection>
  </PageWrapper>
</Page>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

/* ------------------------------------------------------------------ */
/*  TOC                                                                */
/* ------------------------------------------------------------------ */

const toc = [
	{ id: "page-examples", title: "Page" },
	{ id: "nav-slot", title: "Nav Slot" },
	{ id: "page-wrapper", title: "PageWrapper" },
	{ id: "page-section", title: "PageSection" },
	{ id: "composition", title: "Composition" },
	{ id: "page-props", title: "Page Props" },
	{ id: "wrapper-props", title: "PageWrapper Props" },
	{ id: "section-props", title: "PageSection Props" },
	{ id: "related", title: "Related" },
]

/* ------------------------------------------------------------------ */
/*  Props tables                                                       */
/* ------------------------------------------------------------------ */

const pageProps: DocProp[] = [
	{
		name: "top",
		type: "React.ReactNode",
		description: "Slot au-dessus du header — breadcrumbs, back link.",
	},
	{
		name: "header",
		type: "React.ReactNode",
		description: "Header slot — typiquement un <PageHeader />.",
	},
	{
		name: "separator",
		type: "boolean",
		default: "true",
		description: "Bordure entre le header et le contenu. Désactivée automatiquement si nav est présent.",
	},
	{
		name: "nav",
		type: "React.ReactNode",
		description: "Slot entre le header et le contenu — full-width, sans padding. Idéal pour NavTabs. Ajoute sa propre bordure.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS sur le conteneur racine.",
	},
	{
		name: "headerClassName",
		type: "string",
		description: "Classes CSS sur la zone header.",
	},
	{
		name: "contentClassName",
		type: "string",
		description: "Classes CSS sur la zone contenu.",
	},
]

const wrapperProps: DocProp[] = [
	{
		name: "size",
		type: '"sm" | "md" | "lg" | "full"',
		default: '"md"',
		description: "Preset de max-width. sm = max-w-2xl, md = max-w-4xl, lg = max-w-6xl, full = aucune limite.",
	},
	{
		name: "card",
		type: "boolean",
		default: "false",
		description: "Ajoute background, border, border-radius et padding (look card).",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires.",
	},
]

const sectionProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "Titre de la section (h2).",
	},
	{
		name: "description",
		type: "string",
		description: "Description sous le titre.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires.",
	},
]

/* ------------------------------------------------------------------ */
/*  Previews                                                           */
/* ------------------------------------------------------------------ */

function BasicPreview() {
	return (
		<Page header={<PageHeader title="Produits" actions={<Button size="sm">Ajouter</Button>} />}>
			<p className="text-sm text-fg-muted">Contenu de la page</p>
		</Page>
	)
}

function BreadcrumbsPreview() {
	return (
		<Page
			top={
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/products">Produits</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPageItem>MacBook Pro</BreadcrumbPageItem>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			}
			header={<PageHeader title="MacBook Pro" afterTitle={<Badge variant="outline">Active</Badge>} actions={<Button size="sm">Modifier</Button>} />}
		>
			<p className="text-sm text-fg-muted">Détail du produit</p>
		</Page>
	)
}

function NavPreview() {
	return (
		<Page
			header={
				<PageHeader
					title="Clients"
					actions={
						<Button size="sm">
							<Plus className="size-4" data-icon="inline-start" />
							Ajouter
						</Button>
					}
				/>
			}
			nav={
				<NavTabs
					basePath="/clients"
					tabs={[
						{ label: "Tous", href: "" },
						{ label: "Actifs", href: "/active" },
						{ label: "Archivés", href: "/archived" },
					]}
				/>
			}
		>
			<p className="text-sm text-fg-muted">Table clients ici</p>
		</Page>
	)
}

function NoSeparatorPreview() {
	return (
		<Page header={<PageHeader title="Dashboard" />} separator={false}>
			<p className="text-sm text-fg-muted">Pas de bordure entre le header et le contenu</p>
		</Page>
	)
}

function WrapperCardPreview() {
	return (
		<Page header={<PageHeader title="Nouveau client" />}>
			<PageWrapper size="sm" card>
				<p className="text-sm text-fg-muted">Formulaire dans un card</p>
			</PageWrapper>
		</Page>
	)
}

function WrapperSizesPreview() {
	return (
		<Page header={<PageHeader title="Comparaison" />} separator={false}>
			<div className="space-y-3">
				<PageWrapper size="sm">
					<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">sm — max-w-2xl</div>
				</PageWrapper>
				<PageWrapper size="md">
					<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">md — max-w-4xl (default)</div>
				</PageWrapper>
				<PageWrapper size="lg">
					<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">lg — max-w-6xl</div>
				</PageWrapper>
				<PageWrapper size="full">
					<div className="rounded border border-dashed border-edge px-3 py-2 text-xs text-fg-muted">full — pas de limite</div>
				</PageWrapper>
			</div>
		</Page>
	)
}

function SectionsPreview() {
	return (
		<Page header={<PageHeader title="Paramètres" />}>
			<PageWrapper size="sm">
				<div className="space-y-8">
					<PageSection title="Général" description="Infos de base">
						<p className="text-sm text-fg-muted">Champs ici</p>
					</PageSection>
					<PageSection title="Notifications" description="Préférences">
						<p className="text-sm text-fg-muted">Champs ici</p>
					</PageSection>
				</div>
			</PageWrapper>
		</Page>
	)
}

function FullPreview() {
	return (
		<Page
			top={
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/invoices">Factures</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPageItem>INV0012</BreadcrumbPageItem>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			}
			header={<PageHeader title="INV0012" afterTitle={<Badge variant="critical">Impayée</Badge>} actions={<Button size="sm">Envoyer</Button>} />}
		>
			<PageWrapper size="sm" card>
				<div className="space-y-8">
					<PageSection title="Détails" description="Informations de la facture">
						<p className="text-sm text-fg-muted">Lignes de facture...</p>
					</PageSection>
					<PageSection title="Paiement">
						<p className="text-sm text-fg-muted">Infos de paiement...</p>
					</PageSection>
				</div>
			</PageWrapper>
		</Page>
	)
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PageLayoutDocPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Page"
			subtitle="Layout full-width avec zones header, nav et content. Composez un <PageHeader /> dans le slot header, des NavTabs dans nav, et structurez le contenu avec PageWrapper et PageSection."
			toc={toc}
		>
			{/* ============================================================ */}
			{/*  PAGE                                                        */}
			{/* ============================================================ */}
			<DocSection id="page-examples" title="Page">
				<DocExampleClient
					title="Basique"
					description="Le slot header reçoit un <PageHeader /> composé librement. Page gère le padding et le separator."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<BasicPreview />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Avec breadcrumbs et metadata"
					description="Les breadcrumbs vont dans le slot top de Page, pas dans PageHeader. Chaque zone a un rôle clair."
					code={examples[1].code}
					highlightedCode={html("with-breadcrumbs")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<BreadcrumbsPreview />
					</div>
				</DocExampleClient>

				<DocExampleClient title="Sans séparateur" description="separator=false supprime la bordure entre le header et le contenu." code={examples[3].code} highlightedCode={html("no-separator")}>
					<div className="rounded-lg border border-edge bg-muted">
						<NoSeparatorPreview />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  NAV SLOT                                                    */}
			{/* ============================================================ */}
			<DocSection id="nav-slot" title="Nav Slot">
				<DocExampleClient
					title="NavTabs"
					description="Le slot nav se place entre le header et le contenu, full-width sans padding. Utilisez NavTabs (pill-style, route-based). Le slot ajoute sa propre bordure et désactive le separator du header."
					code={examples[2].code}
					highlightedCode={html("with-nav")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<NavPreview />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PAGEWRAPPER                                                 */}
			{/* ============================================================ */}
			<DocSection id="page-wrapper" title="PageWrapper">
				<DocExampleClient title="Card mode" description="card ajoute background, border et padding. Centré par défaut (mx-auto)." code={examples[4].code} highlightedCode={html("wrapper-card")}>
					<div className="rounded-lg border border-edge bg-muted">
						<WrapperCardPreview />
					</div>
				</DocExampleClient>

				<DocExampleClient title="Comparaison des tailles" description="4 presets de largeur maximale, tous centrés." code={examples[5].code} highlightedCode={html("wrapper-sizes")}>
					<div className="rounded-lg border border-edge bg-muted">
						<WrapperSizesPreview />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PAGESECTION                                                 */}
			{/* ============================================================ */}
			<DocSection id="page-section" title="PageSection">
				<DocExampleClient
					title="Sections titrées"
					description="PageSection groupe le contenu avec un titre h2 et une description optionnelle."
					code={examples[6].code}
					highlightedCode={html("sections")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<SectionsPreview />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  COMPOSITION                                                 */}
			{/* ============================================================ */}
			<DocSection id="composition" title="Composition">
				<DocExampleClient
					title="Page + PageHeader + PageWrapper + PageSection"
					description="Composition complète : PageHeader avec breadcrumbs et badge dans le slot header, contenu dans un card avec sections."
					code={examples[7].code}
					highlightedCode={html("full")}
				>
					<div className="rounded-lg border border-edge bg-muted">
						<FullPreview />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* ============================================================ */}
			{/*  PROPS TABLES                                                */}
			{/* ============================================================ */}
			<DocSection id="page-props" title="Page Props">
				<DocPropsTable props={pageProps} />
			</DocSection>

			<DocSection id="wrapper-props" title="PageWrapper Props">
				<DocPropsTable props={wrapperProps} />
			</DocSection>

			<DocSection id="section-props" title="PageSection Props">
				<DocPropsTable props={sectionProps} />
			</DocSection>

			{/* ============================================================ */}
			{/*  RELATED                                                     */}
			{/* ============================================================ */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "PageHeader",
							href: "/docs/blocks/page-header",
							description: "Header composable avec 4 slots (top, afterTitle, actions, bottom) — se pose dans le slot header de Page.",
						},
						{
							title: "NavTabs",
							href: "/docs/components/patterns/nav-tabs",
							description: "Tabs pill-style liées aux routes Next.js — se pose dans le slot nav de Page.",
						},
						{
							title: "AppFrame",
							href: "/docs/blocks/app-frame",
							description: "Shell applicatif avec sidebar, topbar et zone de contenu.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
