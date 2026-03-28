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
		key: "breadcrumbs",
		code: `import { TopBar } from "@blazz/ui/components/patterns/top-bar"

export function MyTopBar() {
  return (
    <TopBar
      left={
        <>
          <TopBar.SidebarToggle />
          <TopBar.Breadcrumbs items={[
            { label: "Contacts", href: "/contacts" },
            { label: "Jane Dupont" },
          ]} />
        </>
      }
    />
  )
}`,
	},
	{
		key: "with-actions",
		code: `import { TopBar } from "@blazz/ui/components/patterns/top-bar"
import { Button } from "@blazz/ui/components/ui/button"

export function MyTopBarWithActions() {
  return (
    <TopBar
      left={
        <>
          <TopBar.SidebarToggle />
          <TopBar.Breadcrumbs items={[{ label: "Contacts" }]} />
        </>
      }
      right={
        <>
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">Add Contact</Button>
        </>
      }
    />
  )
}`,
	},
	{
		key: "children",
		code: `import { TopBar } from "@blazz/ui/components/patterns/top-bar"

// Pour un contrôle total, passer children au lieu de left/right
export function CustomTopBar() {
  return (
    <TopBar>
      <TopBar.SidebarToggle />
      <h2 className="text-sm font-medium">Page title</h2>
      <div className="ml-auto flex gap-2">
        <Button size="sm">Action</Button>
      </div>
    </TopBar>
  )
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "props", title: "Props" },
	{ id: "compound", title: "Compound Components" },
	{ id: "related", title: "Related" },
]

const topBarProps: DocProp[] = [
	{
		name: "left",
		type: "React.ReactNode",
		description: "Contenu aligné à gauche (typiquement SidebarToggle + Breadcrumbs). Occupe flex-1.",
	},
	{
		name: "right",
		type: "React.ReactNode",
		description: "Contenu aligné à droite (boutons d'action). Flex shrink-0.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Pour un contrôle total du contenu. Si fourni, left/right sont ignorés.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires.",
	},
]

const compoundComponents: DocProp[] = [
	{
		name: "TopBar.SidebarToggle",
		type: "compound",
		description:
			"Bouton PanelLeft qui toggle la sidebar. S'affiche uniquement quand la sidebar est collapsed (utilise useSidebarSafe). Supporte le peek au hover. Alternative : SidebarTrigger de @blazz/ui/components/ui/sidebar (toujours visible).",
	},
	{
		name: "TopBar.Breadcrumbs",
		type: "compound",
		description: "Fil d'Ariane. Accepte items en prop ou lit automatiquement les breadcrumbs du FrameContext. Le dernier item est rendu sans lien.",
	},
]

function ContentBarPlaceholder() {
	return (
		<div className="h-12 rounded border border-dashed border-edge-subtle bg-card flex items-center px-4 text-xs text-fg-muted gap-2">
			<div className="size-6 rounded border border-dashed border-edge-subtle flex items-center justify-center">&#9776;</div>
			<span>Contacts</span>
			<span>/</span>
			<span className="font-medium text-fg">Jane Dupont</span>
			<div className="ml-auto flex gap-2">
				<div className="h-7 w-16 rounded border border-dashed border-edge-subtle flex items-center justify-center">Export</div>
				<div className="h-7 w-24 rounded bg-brand/20 flex items-center justify-center">Add Contact</div>
			</div>
		</div>
	)
}

export default function TopBarPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Top Bar"
			subtitle="Header composable de zone de contenu avec slots left/right. Inclut TopBar.SidebarToggle pour réafficher la sidebar et TopBar.Breadcrumbs pour le fil d'Ariane."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Avec SidebarToggle et breadcrumbs"
					description="Le SidebarToggle apparaît automatiquement quand la sidebar est collapsed. Passer dans le slot header du Frame."
					code={examples[0].code}
					highlightedCode={html("breadcrumbs")}
				>
					<ContentBarPlaceholder />
				</DocExampleClient>
				<DocExampleClient title="Avec actions" description="Le slot right accueille les boutons d'action, alignés à droite." code={examples[1].code} highlightedCode={html("with-actions")}>
					<ContentBarPlaceholder />
				</DocExampleClient>
				<DocExampleClient
					title="Avec children (contrôle total)"
					description="Passer children pour un layout libre. Les slots left/right sont ignorés."
					code={examples[2].code}
					highlightedCode={html("children")}
				>
					<ContentBarPlaceholder />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props">
				<DocPropsTable props={topBarProps} />
			</DocSection>
			<DocSection id="compound" title="Compound Components">
				<DocPropsTable props={compoundComponents} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "App Frame",
							href: "/docs/blocks/app-frame",
							description: "Shell complet qui compose TopBar avec sidebar et navigation.",
						},
						{
							title: "Frame",
							href: "/docs/components/patterns/layout-frame",
							description: "Brique flexbox bas niveau — le header slot est l'emplacement du TopBar.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
