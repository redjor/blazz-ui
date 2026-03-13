import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "basic",
		code: `import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { sidebarConfig } from "@/config/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame sidebarConfig={sidebarConfig}>
      {children}
    </AppFrame>
  )
}`,
	},
	{
		key: "full",
		code: `import * as React from "react"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { sidebarConfig } from "@/config/navigation"

const sections = [
  { id: "showcase", label: "Showcase", href: "/showcase" },
  { id: "crm", label: "CRM", href: "/crm" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = React.useState(false)

  return (
    <AppFrame
      sidebarConfig={sidebarConfig}
      sections={sections}
      activeSection="showcase"
      onOpenCommandPalette={() => setCmdOpen(true)}
      minimalTopBar={false}
      sidebarHeader={<OrgSwitcher />}
    >
      {children}
    </AppFrame>
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/app-frame")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: AppFramePage,
})

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const appFrameProps: DocProp[] = [
	{
		name: "sidebarConfig",
		type: "SidebarConfig",
		description:
			"Configuration complète de la sidebar (user, navigation). Requis si navigation n'est pas fourni.",
	},
	{
		name: "navigation",
		type: "NavigationSection[]",
		description: "Shortcut pour passer uniquement la navigation sans le reste du SidebarConfig.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Contenu principal de l'application.",
	},
	{
		name: "sidebarHeader",
		type: "React.ReactNode",
		description:
			"Slot rendu en haut de la sidebar, avant la navigation. Typiquement un OrgSwitcher.",
	},
	{
		name: "tabBar",
		type: "React.ReactNode",
		description: "Barre de navigation bas de page (mobile).",
	},
	{
		name: "sections",
		type: "TopBarSection[]",
		description: "Liens de navigation de sections affichés dans la top bar.",
	},
	{
		name: "activeSection",
		type: "string",
		description: "ID de la section active — surligne le bon lien dans la top bar.",
	},
	{
		name: "onOpenCommandPalette",
		type: "() => void",
		description:
			"Callback déclenché au clic sur la barre de recherche. Connecter à CommandPalette.",
	},
	{
		name: "minimalTopBar",
		type: "boolean",
		default: "false",
		description: "Masque les notifications et le user menu dans la top bar.",
	},
]

function LayoutPlaceholder() {
	return (
		<div className="flex h-32 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
			<div className="w-32 shrink-0 border-r border-dashed border-edge-subtle bg-raised/50 flex items-center justify-center">
				Sidebar
			</div>
			<div className="flex-1 flex items-center justify-center bg-surface">Main content</div>
		</div>
	)
}

function AppFramePage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/app-frame" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="App Frame"
			subtitle="Shell d'application complet : sidebar + top bar + gestion mobile. Point d'entrée recommandé pour la plupart des applications."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Usage basique"
					description="Passer un SidebarConfig suffit pour avoir une app fonctionnelle."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<LayoutPlaceholder />
				</DocExampleClient>
				<DocExampleClient
					title="Avec sections et command palette"
					description="Activer la navigation multi-sections dans la top bar et connecter la command palette."
					code={examples[1].code}
					highlightedCode={html("full")}
				>
					<LayoutPlaceholder />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props">
				<DocPropsTable props={appFrameProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "App Sidebar",
							href: "/docs/components/patterns/app-sidebar",
							description: "Sidebar hiérarchique utilisée en interne par AppFrame.",
						},
						{
							title: "App Top Bar",
							href: "/docs/components/patterns/app-top-bar",
							description: "Header global utilisé en interne par AppFrame.",
						},
						{
							title: "Layout Frame",
							href: "/docs/components/patterns/layout-frame",
							description: "Brique flexbox bas niveau si vous avez besoin d'un layout custom.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
