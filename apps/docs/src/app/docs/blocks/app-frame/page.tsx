"use client"

import { use } from "react"
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
		code: `import { AppFrame } from "@blazz/pro/components/blocks/app-frame"
import { LayoutDashboard, Users, Settings } from "lucide-react"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame
      logo={<span className="text-lg font-bold">Acme</span>}
      navItems={navItems}
    >
      {children}
    </AppFrame>
  )
}`,
	},
	{
		key: "with-groups",
		code: `import { AppFrame } from "@blazz/pro/components/blocks/app-frame"
import { LayoutDashboard, Users, FileText, Settings, Bell } from "lucide-react"

const navItems = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Clients", url: "/clients", icon: Users, badge: 12 },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Invoices", url: "/invoices", icon: FileText },
      { title: "Notifications", url: "/notifications", icon: Bell, badge: "3" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame
      logo={<span className="text-lg font-bold">Acme</span>}
      navItems={navItems}
      sidebarCollapsible="icon"
    >
      {children}
    </AppFrame>
  )
}`,
	},
	{
		key: "with-tabs",
		code: `import { AppFrame } from "@blazz/pro/components/blocks/app-frame"

// Browser-style tabs — each page opens in a tab, persisted in localStorage
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame
      logo={<span className="text-lg font-bold">Acme</span>}
      navItems={navItems}
      tabs={{
        storageKey: "acme-tabs",
        defaultTab: { url: "/dashboard", title: "Dashboard" },
        alwaysShow: true,
      }}
      rounded
    >
      {children}
    </AppFrame>
  )
}`,
	},
	{
		key: "use-app-top-bar",
		code: `import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Button } from "@blazz/ui/components/ui/button"
import { Plus } from "lucide-react"

// Inside any page rendered within AppFrame
export default function ClientsPage() {
  useAppTopBar(
    [
      { label: "Home", href: "/" },
      { label: "Clients" },
    ],
    <Button>
      <Plus className="size-4" data-icon="inline-start" />
      Add client
    </Button>
  )

  return <div>...</div>
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

// ---------------------------------------------------------------------------
// Props definitions
// ---------------------------------------------------------------------------

const appFrameProps: DocProp[] = [
	{
		name: "logo",
		type: "React.ReactNode",
		description: "Logo affiché en haut de la sidebar. Texte, image ou composant custom.",
	},
	{
		name: "navItems",
		type: "NavItem[] | NavGroup[]",
		required: true,
		description: "Items de navigation. Liste plate de NavItem ou groupes NavGroup avec label optionnel.",
	},
	{
		name: "sidebarFooter",
		type: "React.ReactNode",
		description: "Contenu fixé en bas de la sidebar. Typiquement un user menu ou un bouton upgrade.",
	},
	{
		name: "sidebarCollapsible",
		type: '"offcanvas" | "icon" | "none"',
		default: '"offcanvas"',
		description: 'Mode de collapse de la sidebar. "icon" réduit aux icônes, "offcanvas" cache complètement, "none" désactive le collapse.',
	},
	{
		name: "tabs",
		type: "TabsConfig",
		description: "Active les browser-style tabs. Voir TabsConfig ci-dessous.",
	},
	{
		name: "rounded",
		type: "boolean",
		description: "Ajoute des coins arrondis au conteneur principal pour un look desktop app.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires sur le conteneur racine.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Contenu principal rendu dans la zone scrollable.",
	},
]

const navItemProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		required: true,
		description: "Label affiché dans la sidebar.",
	},
	{
		name: "url",
		type: "string",
		required: true,
		description: "URL de destination du lien.",
	},
	{
		name: "icon",
		type: "ComponentType<{ className?: string }>",
		description: "Icône Lucide ou custom affichée avant le label.",
	},
	{
		name: "children",
		type: "NavItem[]",
		description: "Sous-items pour créer un menu collapsible.",
	},
	{
		name: "badge",
		type: "string | number",
		description: "Badge affiché à droite du label. Compteur, statut, etc.",
	},
]

const navGroupProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Label de section affiché au-dessus du groupe. Si omis, les items sont rendus sans header.",
	},
	{
		name: "items",
		type: "NavItem[]",
		required: true,
		description: "Liste de NavItem dans ce groupe.",
	},
]

const tabsConfigProps: DocProp[] = [
	{
		name: "storageKey",
		type: "string",
		required: true,
		description: "Clé localStorage pour persister les tabs ouverts entre les sessions.",
	},
	{
		name: "alwaysShow",
		type: "boolean",
		description: "Affiche la barre de tabs même avec un seul tab ouvert. Par défaut, la barre est masquée quand il n'y a qu'un tab.",
	},
	{
		name: "defaultTab",
		type: "{ url: string; title: string }",
		required: true,
		description: "Tab par défaut ouvert au premier chargement. Typiquement le dashboard.",
	},
]

const useAppTopBarProps: DocProp[] = [
	{
		name: "items",
		type: "BreadcrumbItem[] | null",
		required: true,
		description: "Liste de breadcrumbs à afficher dans le top bar. Chaque item a un label et un href optionnel. Passer null pour masquer les breadcrumbs.",
	},
	{
		name: "actions",
		type: "React.ReactNode",
		description: "Actions affichées à droite du top bar (boutons, menus). Slot libre.",
	},
]

// ---------------------------------------------------------------------------
// Layout diagram placeholder
// ---------------------------------------------------------------------------

function LayoutDiagram() {
	return (
		<div className="flex h-52 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
			<div className="w-32 shrink-0 bg-muted/30 flex flex-col border-r border-dashed border-edge-subtle">
				<div className="h-8 shrink-0 border-b border-dashed border-edge-subtle flex items-center px-3 font-medium">Logo</div>
				<div className="flex-1 flex flex-col gap-1 p-2">
					<div className="px-2 py-0.5 text-[10px] font-medium text-fg-muted/60 uppercase tracking-wider">Group label</div>
					<div className="px-2 py-1 rounded bg-accent/10 text-fg text-[10px]">Nav item</div>
					<div className="px-2 py-1 text-[10px]">Nav item</div>
					<div className="px-2 py-1 text-[10px]">Nav item</div>
				</div>
				<div className="h-8 shrink-0 border-t border-dashed border-edge-subtle flex items-center px-3">Footer</div>
			</div>
			<div className="flex-1 flex flex-col">
				<div className="h-8 shrink-0 border-b border-dashed border-edge-subtle bg-card flex items-center px-3 gap-2">
					<span className="size-4 rounded border border-dashed border-edge-subtle flex items-center justify-center text-[8px]">&#9776;</span>
					<span>Top Bar (breadcrumbs + actions via useAppTopBar)</span>
				</div>
				<div className="h-6 shrink-0 border-b border-dashed border-edge-subtle bg-muted/20 flex items-center px-3 gap-2">
					<span className="px-2 py-0.5 rounded-t bg-card text-[10px] border border-b-0 border-dashed border-edge-subtle">Tab 1</span>
					<span className="px-2 py-0.5 text-[10px]">Tab 2</span>
				</div>
				<div className="flex-1 bg-card flex items-center justify-center">children (main content)</div>
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Live preview placeholder (AppFrame can't render in a doc example)
// ---------------------------------------------------------------------------

function AppFramePlaceholder({ label }: { label?: string }) {
	return (
		<div className="flex h-40 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
			<div className="w-28 shrink-0 bg-muted/30 flex flex-col">
				<div className="h-8 shrink-0 border-b border-dashed border-edge-subtle flex items-center px-3 font-medium">Logo</div>
				<div className="flex-1 flex items-center justify-center">Sidebar</div>
			</div>
			<div className="flex-1 flex flex-col">
				<div className="h-8 shrink-0 border-b border-dashed border-edge-subtle bg-card flex items-center px-3">Top Bar</div>
				<div className="flex-1 bg-card flex items-center justify-center">{label ?? "Main content"}</div>
			</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AppFrameDocPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="App Frame" subtitle="Application shell with sidebar navigation, breadcrumb top bar, and optional browser-style tabs. The main entry point for pro applications." toc={toc}>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Basic"
					description="Usage minimal avec une liste plate de NavItem. Le top bar avec breadcrumbs est inclus automatiquement."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<AppFramePlaceholder />
				</DocExampleClient>

				<DocExampleClient
					title="With groups"
					description="Organiser la navigation en groupes avec des labels de section. Le mode sidebarCollapsible='icon' réduit la sidebar aux icônes."
					code={examples[1].code}
					highlightedCode={html("with-groups")}
				>
					<AppFramePlaceholder label="Grouped navigation" />
				</DocExampleClient>

				<DocExampleClient
					title="With tabs"
					description="Active les browser-style tabs persistés en localStorage. Chaque page ouverte crée un tab. Le prop rounded ajoute des coins arrondis."
					code={examples[2].code}
					highlightedCode={html("with-tabs")}
				>
					<AppFramePlaceholder label="With browser tabs" />
				</DocExampleClient>

				<DocExampleClient
					title="useAppTopBar"
					description="Hook pour que chaque page controle les breadcrumbs et les actions du top bar. Appelé dans les pages rendues a l'interieur de AppFrame."
					code={examples[3].code}
					highlightedCode={html("use-app-top-bar")}
				>
					<AppFramePlaceholder label="Page with breadcrumbs + actions" />
				</DocExampleClient>
			</DocSection>

			<DocSection id="layout" title="Layout">
				<div className="space-y-3">
					<p className="text-sm text-fg-muted">
						AppFrame compose internement un Frame (sidebar + main area), un TopBar (breadcrumbs + actions), et optionnellement une TabBar. Le diagramme ci-dessous montre la structure :
					</p>
					<LayoutDiagram />
					<pre className="rounded-lg bg-muted/30 p-4 text-xs text-fg-muted font-mono leading-relaxed overflow-x-auto">
						{`+------------------+---------------------------------------------+
|                  |  Top Bar (breadcrumbs + actions)             |
|   Sidebar        +---------------------------------------------+
|                  |  Tab Bar (optional, browser-style tabs)      |
|   - Logo         +---------------------------------------------+
|   - NavGroups    |                                              |
|   - NavItems     |              children                        |
|   - Footer       |          (main content area)                 |
|                  |                                              |
+------------------+---------------------------------------------+`}
					</pre>
				</div>
			</DocSection>

			<DocSection id="props" title="Props">
				<h3 className="text-sm font-semibold mb-2">AppFrameProps</h3>
				<DocPropsTable props={appFrameProps} />

				<h3 className="text-sm font-semibold mt-8 mb-2">NavItem</h3>
				<DocPropsTable props={navItemProps} />

				<h3 className="text-sm font-semibold mt-8 mb-2">NavGroup</h3>
				<DocPropsTable props={navGroupProps} />

				<h3 className="text-sm font-semibold mt-8 mb-2">TabsConfig</h3>
				<DocPropsTable props={tabsConfigProps} />

				<h3 className="text-sm font-semibold mt-8 mb-2">useAppTopBar(items, actions?)</h3>
				<DocPropsTable props={useAppTopBarProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Frame (patterns)",
							href: "/docs/components/patterns/layout-frame",
							description: "Brique flexbox bas niveau utilisee internement par AppFrame. Pour un controle total du layout.",
						},
						{
							title: "Top Bar (patterns)",
							href: "/docs/components/patterns/top-bar",
							description: "Header composable avec breadcrumbs, sidebar toggle et actions. Utilise par AppFrame.",
						},
						{
							title: "Page Header",
							href: "/docs/blocks/page-header",
							description: "Header de page composable pour le contenu principal a l'interieur de AppFrame.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
