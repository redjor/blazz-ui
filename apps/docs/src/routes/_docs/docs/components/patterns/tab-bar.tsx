import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "setup",
		code: `// 1. Wrapper le layout avec NavigationTabsProvider
// apps/my-app/app/layout.tsx

import { NavigationTabsProvider } from "@blazz/ui/components/patterns/navigation-tabs"
import { TabBar } from "@blazz/ui/components/patterns/tab-bar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationTabsProvider storageKey="crm-tabs">
      <div className="flex flex-col h-screen">
        <Navbar left={<Logo />} center={<MainNav />} right={<UserMenu />} />
        <TabBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </NavigationTabsProvider>
  )
}`,
	},
	{
		key: "route-map",
		code: `// TabBar (pré-configuré pour le CRM) résout automatiquement
// l'icône et le label de section depuis l'URL du tab.
//
// Route map interne :
// /examples/crm/dashboard → LayoutDashboard, "CRM"
// /examples/crm/companies → Building2, "Entreprises"
// /examples/crm/contacts  → Users, "Contacts"
// /examples/crm/deals     → Handshake, "Pipeline"
// /examples/crm/quotes    → FileText, "Devis"
// /examples/crm/products  → Package, "Produits"
// /examples/crm/reports   → BarChart3, "Rapports"
//
// Le titre affiché : "Section > Title" (ex: "Contacts > Jane Dupont")
// Si tab.title === label de la section → affiche juste "Contacts"

import { TabBar } from "@blazz/ui/components/patterns/tab-bar"

export function CrmLayout({ children }) {
  return (
    <NavigationTabsProvider storageKey="crm-tabs">
      <TabBar />
      {children}
    </NavigationTabsProvider>
  )
}`,
	},
	{
		key: "custom",
		code: `// Pour un contexte non-CRM, construire TabBar manuellement
// avec NavigationTabsBar + NavigationTabsItem + useNavigationTabs

"use client"
import { useRouter } from "next/navigation"
import {
  NavigationTabsBar,
  NavigationTabsItem,
  useNavigationTabs,
} from "@blazz/ui/components/patterns/navigation-tabs"
import { FileText, LayoutDashboard } from "lucide-react"

const routeMap = [
  { prefix: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { prefix: "/docs",      icon: FileText,        label: "Docs" },
]

function getIcon(url: string) {
  return routeMap.find((r) => url.startsWith(r.prefix))?.icon ?? LayoutDashboard
}

export function CustomTabBar() {
  const { tabs, activeTabId, activateTab, closeTab, addTab } = useNavigationTabs()
  const router = useRouter()

  function handleActivate(id: string, url: string) {
    activateTab(id)
    router.push(url)
  }

  function handleClose(id: string) {
    closeTab(id)
    const remaining = tabs.filter((t) => t.id !== id)
    if (id === activeTabId && remaining.length > 0) {
      router.push(remaining.at(-1)!.url)
    }
  }

  return (
    <NavigationTabsBar onAddTab={() => addTab({ url: "/dashboard", title: "Dashboard" })}>
      {tabs.map((tab) => (
        <NavigationTabsItem
          key={tab.id}
          title={tab.title}
          icon={getIcon(tab.url)}
          isActive={tab.id === activeTabId}
          onClick={() => handleActivate(tab.id, tab.url)}
          onClose={() => handleClose(tab.id)}
        />
      ))}
    </NavigationTabsBar>
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/tab-bar")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: TabBarPage,
})

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "custom", title: "Version personnalisée" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const tabBarProps: DocProp[] = [
	{
		name: "(aucune)",
		type: "—",
		description:
			"TabBar ne prend pas de props. Il se connecte automatiquement au NavigationTabsContext via useNavigationTabs(). Il doit être rendu à l'intérieur d'un NavigationTabsProvider.",
	},
]

const navigationTabsBarProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Les NavigationTabsItem à afficher dans la barre.",
	},
	{
		name: "onAddTab",
		type: "() => void",
		description:
			'Si fourni, affiche le bouton "+" à droite de la barre pour ouvrir un nouvel onglet.',
	},
	{
		name: "addButtonLabel",
		type: "string",
		default: '"Open new tab"',
		description: "aria-label du bouton + (pour l'accessibilité).",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires.",
	},
]

const navigationTabsItemProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		required: true,
		description: "Texte du tab. Tronqué avec ellipsis si trop long.",
	},
	{
		name: "icon",
		type: "LucideIcon",
		description: "Icône Lucide affichée à gauche du titre (3.5×3.5, opacity 60%).",
	},
	{
		name: "isActive",
		type: "boolean",
		required: true,
		description: "Applique le style actif (background accent, font-semibold).",
	},
	{
		name: "onClick",
		type: "() => void",
		required: true,
		description: "Handler d'activation du tab.",
	},
	{
		name: "onClose",
		type: "() => void",
		required: true,
		description:
			"Handler de fermeture. Le bouton × est masqué par défaut et apparaît au hover (toujours visible sur le tab actif).",
	},
]

function TabBarPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="flex h-9 items-center border-t border-edge-subtle bg-surface">
				<div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
					{/* Tab actif */}
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs bg-raised text-fg font-semibold">
						<div className="flex h-7 items-center gap-1.5 truncate pl-2 pr-1 cursor-pointer">
							<svg className="h-3.5 w-3.5 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
							</svg>
							<span className="truncate">Dashboard</span>
						</div>
						<div className="mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm hover:bg-edge-subtle">
							<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
					</div>
					{/* Tab inactif */}
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs text-fg-muted hover:bg-raised/50">
						<div className="flex h-7 items-center gap-1.5 truncate pl-2 pr-1 cursor-pointer">
							<svg className="h-3.5 w-3.5 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
							</svg>
							<span className="truncate">Contacts &gt; Jane Dupont</span>
						</div>
						<div className="mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-edge-subtle">
							<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
					</div>
					{/* Tab inactif 2 */}
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs text-fg-muted hover:bg-raised/50">
						<div className="flex h-7 items-center gap-1.5 truncate pl-2 pr-1 cursor-pointer">
							<svg className="h-3.5 w-3.5 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<span className="truncate">Pipeline &gt; Acme Corp</span>
						</div>
						<div className="mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-edge-subtle">
							<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
					</div>
				</div>
				{/* Bouton + */}
				<button
					type="button"
					className="flex h-9 w-9 shrink-0 items-center justify-center border-l border-edge-subtle text-fg-muted hover:bg-raised"
					aria-label="Open new tab"
				>
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>
		</div>
	)
}

function TabBarPage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/tab-bar" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Tab Bar"
			subtitle="Barre de tabs navigateur (browser-like) positionnée sous la Navbar. Affiche les pages ouvertes avec icône de section, titre, et bouton de fermeture. Construite sur le système NavigationTabs."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Setup avec NavigationTabsProvider"
					description="TabBar se connecte automatiquement au contexte NavigationTabs. Il suffit de le placer à l'intérieur d'un NavigationTabsProvider. La barre est masquée si moins de 2 tabs sont ouverts."
					code={examples[0].code}
					highlightedCode={html("setup")}
				>
					<TabBarPreview />
				</DocExampleClient>
				<DocExampleClient
					title="Route map CRM"
					description={'TabBar inclut une résolution automatique des icônes et labels de section pour les routes CRM. Le titre du tab est formaté "Section › Titre de la page".'}
					code={examples[1].code}
					highlightedCode={html("route-map")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="custom" title="Version personnalisée">
				<DocExampleClient
					title="TabBar personnalisé avec NavigationTabsBar + NavigationTabsItem"
					description="Pour un contexte non-CRM, composer manuellement avec les primitives NavigationTabsBar et NavigationTabsItem et le hook useNavigationTabs."
					code={examples[2].code}
					highlightedCode={html("custom")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props — TabBar">
				<DocPropsTable props={tabBarProps} />
			</DocSection>
			<DocSection id="props-bar" title="Props — NavigationTabsBar">
				<DocPropsTable props={navigationTabsBarProps} />
			</DocSection>
			<DocSection id="props-item" title="Props — NavigationTabsItem">
				<DocPropsTable props={navigationTabsItemProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Navigation Tabs",
							href: "/docs/components/patterns/navigation-tabs",
							description:
								"Système complet : Provider, hooks, Interceptor, URL sync.",
						},
						{
							title: "Navbar",
							href: "/docs/components/patterns/navbar",
							description: "Navbar globale au-dessus du TabBar.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
