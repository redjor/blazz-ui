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
		code: `import { AppTopBar } from "@blazz/ui/components/patterns/app-top-bar"

export function MyTopBar() {
  return <AppTopBar />
}`,
	},
	{
		key: "with-sections",
		code: `import * as React from "react"
import { AppTopBar } from "@blazz/ui/components/patterns/app-top-bar"

const sections = [
  { id: "app", label: "App", href: "/app" },
  { id: "docs", label: "Docs", href: "/docs" },
]

export function MyTopBarWithNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <AppTopBar
      sections={sections}
      activeSection="app"
      onOpenCommandPalette={() => setOpen(true)}
      user={{ name: "Jane", email: "jane@acme.com", role: "Admin" }}
    />
  )
}`,
	},
	{
		key: "minimal",
		code: `import { AppTopBar } from "@blazz/ui/components/patterns/app-top-bar"

// Mode minimal : masque notifications et user menu
// Utile pour les pages docs, marketing, ou apps simples
export function MinimalTopBar() {
  return <AppTopBar minimal />
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const appTopBarProps: DocProp[] = [
	{
		name: "sections",
		type: "TopBarSection[]",
		description:
			"Navigation de sections affichée entre le logo et la barre de recherche. Chaque section a { id, label, href }.",
	},
	{
		name: "activeSection",
		type: "string",
		description: "ID de la section active — surligne le lien correspondant.",
	},
	{
		name: "onOpenCommandPalette",
		type: "() => void",
		description: "Callback au clic sur la barre de recherche.",
	},
	{
		name: "onOpenMobileMenu",
		type: "() => void",
		description: "Callback au clic sur le hamburger mobile.",
	},
	{
		name: "minimal",
		type: "boolean",
		default: "false",
		description: "Masque notifications et user menu. Conserve uniquement logo, sections et thème.",
	},
	{
		name: "notificationSlot",
		type: "React.ReactNode",
		description:
			"Slot pour les notifications (ex: NotificationSheet). Rendu entre le palette switcher et le user menu.",
	},
	{
		name: "user",
		type: "{ name: string; email: string; avatar?: string; role?: string }",
		description: "Données utilisateur affichées dans le user menu.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires.",
	},
]

function TopBarPlaceholder() {
	return (
		<div className="h-12 rounded border border-dashed border-edge-subtle bg-muted/50 flex items-center px-4 text-xs text-fg-muted gap-4">
			<span>Logo</span>
			<span className="flex gap-2 text-brand">App · Docs</span>
			<div className="flex-1 mx-4 h-7 rounded border border-dashed border-edge-subtle flex items-center px-3">
				Search...
			</div>
			<span>Theme · Notifs · User</span>
		</div>
	)
}

export default function AppTopBarPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="App Top Bar"
			subtitle="Header global de l'application : logo, navigation de sections, barre de recherche, thème, notifications et user menu."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Usage basique"
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<TopBarPlaceholder />
				</DocExampleClient>
				<DocExampleClient
					title="Avec sections"
					description="Afficher un switcher de sections entre le logo et la barre de recherche."
					code={examples[1].code}
					highlightedCode={html("with-sections")}
				>
					<TopBarPlaceholder />
				</DocExampleClient>
				<DocExampleClient
					title="Mode minimal"
					description="Masque les notifications et le user menu. Adapté aux pages docs ou marketing."
					code={examples[2].code}
					highlightedCode={html("minimal")}
				>
					<TopBarPlaceholder />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props">
				<DocPropsTable props={appTopBarProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "App Frame",
							href: "/docs/components/patterns/app-frame",
							description: "Shell complet qui compose AppTopBar avec AppSidebar.",
						},
						{
							title: "Top Bar",
							href: "/docs/components/patterns/top-bar",
							description: "Header de zone de contenu avec breadcrumbs et actions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
