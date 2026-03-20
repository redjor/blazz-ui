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
	{
		key: "no-topbar",
		code: `import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { sidebarConfig } from "@/config/navigation"

// Sans top bar — layout simplifié (sidebar pleine hauteur)
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame
      sidebarConfig={sidebarConfig}
      noTopBar
    >
      {children}
    </AppFrame>
  )
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "layout", title: "Layout" },
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
	{
		name: "noTopBar",
		type: "boolean",
		default: "false",
		description: "Supprime complètement la top bar. La sidebar commence à top-0.",
	},
	{
		name: "sidebarFooter",
		type: "React.ReactNode",
		description: "Slot rendu en bas de la sidebar, après la navigation.",
	},
]

function LayoutPlaceholder() {
	return (
		<div className="flex h-32 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
			<div className="w-32 shrink-0 border-r border-dashed border-edge-subtle bg-surface-3/50 flex items-center justify-center">
				Sidebar
			</div>
			<div className="flex-1 flex items-center justify-center bg-surface">Main content</div>
		</div>
	)
}

export default function AppFramePage() {
	const highlighted = use(highlightedPromise)
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
				<DocExampleClient
					title="Sans top bar"
					description="La sidebar occupe toute la hauteur. Utile pour les apps avec sidebar navigation uniquement."
					code={examples[2].code}
					highlightedCode={html("no-topbar")}
				>
					<LayoutPlaceholder />
				</DocExampleClient>
			</DocSection>
			<DocSection id="layout" title="Layout">
				<div className="space-y-4">
					<p className="text-sm text-fg-muted">
						Deux patterns de layout sont supportés selon que vous passez ou non une top bar globale.
					</p>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="rounded-lg border border-edge-subtle bg-surface p-4">
							<p className="text-xs font-medium text-fg mb-2">Sans top bar globale (recommandé)</p>
							<div className="text-xs text-fg-muted font-mono whitespace-pre leading-relaxed">
								{`┌──────────┬───────────────────┐
│ Logo     │ Tab bar (opt.)    │
│          ├───────────────────┤
│ Sidebar  │ Header (TopBar)   │
│ (240px)  ├───────────────────┤
│          │ Content (scroll)  │
│          │ rounded-tl-xl     │
└──────────┴───────────────────┘
La sidebar occupe toute la hauteur.
Le logo est dans SidebarHeader.
SidebarTrigger dans le tab bar
quand la sidebar est collapsed.`}
							</div>
						</div>
						<div className="rounded-lg border border-edge-subtle bg-surface p-4">
							<p className="text-xs font-medium text-fg mb-2">Avec top bar globale</p>
							<div className="text-xs text-fg-muted font-mono whitespace-pre leading-relaxed">
								{`┌─────────────────────────────┐
│ AppTopBar (fixed, z-20)     │
├──────────┬──────────────────┤
│          │ Header (TopBar)  │
│ Sidebar  ├──────────────────┤
│ (240px)  │ Content (scroll) │
│          │ rounded-tl-xl    │
└──────────┴──────────────────┘
La top bar est pleine largeur.
La sidebar commence sous la
top bar (top: --topbar-height).`}
							</div>
						</div>
					</div>
					<div className="rounded-lg border border-edge-subtle bg-surface p-3 text-xs text-fg-muted">
						<p className="font-medium text-fg mb-1">Sidebar features :</p>
						<ul className="list-disc list-inside space-y-0.5">
							<li>
								Collapse/expand via <code className="text-fg">⌘B</code> ou SidebarRail drag
							</li>
							<li>Peek on hover quand collapsed (700ms delay)</li>
							<li>
								<code className="text-fg">TopBar.SidebarToggle</code> ou{" "}
								<code className="text-fg">SidebarTrigger</code> pour réafficher
							</li>
							<li>Cookie persistence de l'état (7 jours)</li>
						</ul>
					</div>
				</div>
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
							title: "Frame",
							href: "/docs/components/patterns/layout-frame",
							description: "Brique flexbox bas niveau si vous avez besoin d'un layout custom.",
						},
						{
							title: "Top Bar",
							href: "/docs/components/patterns/top-bar",
							description:
								"Header composable de zone de contenu avec SidebarToggle et breadcrumbs.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
