import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "provider-setup",
		code: `// Layout racine — envelopper avec NavigationTabsProvider
import {
  NavigationTabsProvider,
  NavigationTabsInterceptor,
} from "@blazz/ui/components/patterns/navigation-tabs"
import { TabBar } from "@blazz/ui/components/patterns/tab-bar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavigationTabsProvider storageKey="app-tabs">
      {/* Intercepte Cmd/Ctrl+clic pour ouvrir un nouveau tab */}
      <NavigationTabsInterceptor
        titleResolver={(url) => url.split("/").pop() ?? "Tab"}
      />
      <div className="flex flex-col h-screen">
        <Navbar />
        <TabBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </NavigationTabsProvider>
  )
}`,
	},
	{
		key: "use-navigation-tabs",
		code: `// Accéder au contexte dans n'importe quel composant enfant
"use client"
import { useNavigationTabs } from "@blazz/ui/components/patterns/navigation-tabs"
import { useRouter } from "next/navigation"

export function OpenTabButton({ href, title }: { href: string; title: string }) {
  const { addTab } = useNavigationTabs()
  const router = useRouter()

  function handleOpen() {
    addTab({ url: href, title })
    router.push(href)
  }

  return <button type="button" onClick={handleOpen}>Ouvrir dans un onglet</button>
}`,
	},
	{
		key: "url-sync",
		code: `// Synchroniser le titre du tab actif avec la page courante
"use client"
import { useNavigationTabUrlSync } from "@blazz/ui/components/patterns/navigation-tabs"

// Placer dans le layout ou la page, à l'intérieur du Provider
export function TabTitleSync() {
  useNavigationTabUrlSync({
    titleResolver: (pathname) => {
      // Retourner le titre souhaité à partir du pathname
      if (pathname.startsWith("/contacts/")) return "Contact"
      if (pathname.startsWith("/companies/")) return "Entreprise"
      return pathname.split("/").pop() ?? "Page"
    },
  })
  return null
}`,
	},
	{
		key: "update-title",
		code: `// Mettre à jour le titre du tab actif depuis une page
"use client"
import { useNavigationTabTitle } from "@blazz/ui/components/patterns/navigation-tabs"

export function ContactDetailPage({ contact }: { contact: Contact }) {
  // Met à jour le titre du tab actif dès que contact.name change
  useNavigationTabTitle(contact.name)

  return <div>{contact.name}</div>
}`,
	},
	{
		key: "interceptor",
		code: `// NavigationTabsInterceptor — comportements clavier
//
// Cmd/Ctrl+Clic sur un lien → ouvre dans un nouveau tab
// Cmd/Ctrl+W               → ferme le tab actif (si ≥ 2 tabs ouverts)
//
// excludePaths : chemins ignorés par l'interception
// titleResolver : détermine le titre du tab créé

import { NavigationTabsInterceptor } from "@blazz/ui/components/patterns/navigation-tabs"

<NavigationTabsInterceptor
  excludePaths={["/api", "/auth"]}
  titleResolver={(url) => {
    const segment = url.split("/").pop() ?? "Tab"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }}
/>`,
	},
	{
		key: "custom-tab-bar",
		code: `// Construire un TabBar personnalisé avec les primitives
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

export const Route = createFileRoute("/_docs/docs/components/patterns/navigation-tabs")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: NavigationTabsPage,
})

const toc = [
	{ id: "overview", title: "Overview" },
	{ id: "provider", title: "Provider" },
	{ id: "hooks", title: "Hooks" },
	{ id: "interceptor", title: "Interceptor" },
	{ id: "custom-tab-bar", title: "TabBar personnalisé" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const providerProps: DocProp[] = [
	{
		name: "storageKey",
		type: "string",
		required: true,
		description:
			"Clé localStorage pour la persistance des tabs entre rechargements. Chaque app ou section doit utiliser une clé unique.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description:
			"Arbre React enfant. Tous les composants et hooks navigation-tabs doivent être dans cet arbre.",
	},
]

const contextValueProps: DocProp[] = [
	{
		name: "tabs",
		type: "NavigationTab[]",
		description: "Liste des tabs ouverts. Chaque tab : { id, url, title, icon? }.",
	},
	{
		name: "activeTabId",
		type: "string | null",
		description: "ID du tab actif. null si aucun tab n'est ouvert.",
	},
	{
		name: "showTabBar",
		type: "boolean",
		description: "true si ≥ 2 tabs sont ouverts. Utiliser pour conditionner l'affichage de TabBar.",
	},
	{
		name: "addTab",
		type: "(payload: { url: string; title: string; icon?: string }) => void",
		description:
			"Ouvre un tab sur l'URL donnée. Si un tab avec la même URL existe déjà, l'active simplement.",
	},
	{
		name: "closeTab",
		type: "(id: string) => void",
		description:
			"Ferme un tab. Si c'est le tab actif, active automatiquement le tab précédent ou suivant.",
	},
	{
		name: "activateTab",
		type: "(id: string) => void",
		description:
			"Active un tab existant sans naviguer (la navigation doit être faite séparément via router.push).",
	},
	{
		name: "updateActiveTabUrl",
		type: "(url: string) => void",
		description:
			"Met à jour l'URL enregistrée du tab actif (appelé automatiquement par useNavigationTabUrlSync).",
	},
	{
		name: "updateTabTitle",
		type: "(id: string, title: string) => void",
		description: "Met à jour le titre d'un tab spécifique.",
	},
]

const interceptorProps: DocProp[] = [
	{
		name: "excludePaths",
		type: "string[]",
		default: "[]",
		description:
			'Chemins exclus de l\'interception Cmd+clic. Les liens dont le href commence par un de ces chemins sont ignorés (ex: ["/api", "/auth"]).',
	},
	{
		name: "titleResolver",
		type: "(url: string) => string",
		description:
			"Fonction pour déterminer le titre d'un tab créé via Cmd+clic. Par défaut, utilise le dernier segment du chemin ou le texte du lien.",
	},
]

const urlSyncProps: DocProp[] = [
	{
		name: "titleResolver",
		type: "(pathname: string) => string",
		description:
			"Fonction appelée à chaque changement de pathname pour déterminer le titre du tab actif. Si omis, le titre n'est pas mis à jour automatiquement.",
	},
]

const barProps: DocProp[] = [
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

const itemProps: DocProp[] = [
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
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs bg-raised text-fg font-semibold">
						<div className="flex h-7 items-center gap-1.5 truncate pl-2 pr-1 cursor-pointer">
							<svg
								className="h-3.5 w-3.5 shrink-0 opacity-60"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span className="truncate">Dashboard</span>
						</div>
						<div className="mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm hover:bg-edge-subtle">
							<svg
								className="h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</div>
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs text-fg-muted">
						<div className="flex h-7 items-center gap-1.5 truncate pl-2 pr-1 cursor-pointer">
							<svg
								className="h-3.5 w-3.5 shrink-0 opacity-60"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
								/>
							</svg>
							<span className="truncate">Contacts &gt; Jane Dupont</span>
						</div>
						<div className="mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-edge-subtle">
							<svg
								className="h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</div>
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs text-fg-muted">
						<div className="flex h-7 items-center gap-1.5 truncate pl-2 pr-1 cursor-pointer">
							<svg
								className="h-3.5 w-3.5 shrink-0 opacity-60"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							<span className="truncate">Rapports</span>
						</div>
						<div className="mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-edge-subtle">
							<svg
								className="h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
					</div>
				</div>
				<button
					type="button"
					className="flex h-9 w-9 shrink-0 items-center justify-center border-l border-edge-subtle text-fg-muted"
					aria-label="Open new tab"
				>
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>
		</div>
	)
}

function NavigationTabsPage() {
	const { highlighted } = useLoaderData({
		from: "/_docs/docs/components/patterns/navigation-tabs",
	})
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Navigation Tabs"
			subtitle="Système complet de tabs navigateur (browser-like) avec persistance localStorage, interception Cmd/Ctrl+clic, et synchronisation URL. Composé de NavigationTabsProvider, NavigationTabsBar, NavigationTabsItem, NavigationTabsInterceptor et 3 hooks."
			toc={toc}
		>
			<DocSection id="overview" title="Overview">
				<div className="rounded border border-edge-subtle bg-surface p-4 text-sm text-fg-secondary space-y-3">
					<p className="font-medium text-fg">Architecture du système</p>
					<div className="grid grid-cols-1 gap-2 text-xs">
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">NavigationTabsProvider</span>
							<span className="text-fg-muted">
								— Context React + reducer + persistance localStorage
							</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">NavigationTabsBar</span>
							<span className="text-fg-muted">— Conteneur de tabs avec bouton "+"</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">NavigationTabsItem</span>
							<span className="text-fg-muted">
								— Tab individuel avec icône, titre tronqué, bouton ×
							</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">NavigationTabsInterceptor</span>
							<span className="text-fg-muted">— Intercepte Cmd+clic et Cmd+W (renderless)</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useNavigationTabs()</span>
							<span className="text-fg-muted">— Hook d'accès au contexte complet</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useNavigationTabUrlSync()</span>
							<span className="text-fg-muted">— Sync pathname → titre + URL du tab actif</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useNavigationTabTitle()</span>
							<span className="text-fg-muted">
								— Met à jour le titre du tab actif depuis une page
							</span>
						</div>
					</div>
				</div>
			</DocSection>
			<DocSection id="provider" title="Provider">
				<DocExampleClient
					title="Setup dans le layout racine"
					description="NavigationTabsProvider gère l'état global des tabs et persiste dans localStorage. NavigationTabsInterceptor (renderless) écoute les événements clavier/clic sur tout le document."
					code={examples[0].code}
					highlightedCode={html("provider-setup")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="hooks" title="Hooks">
				<DocExampleClient
					title="useNavigationTabs — ouvrir un tab manuellement"
					description="Utiliser addTab pour ouvrir programmatiquement un nouveau tab depuis n'importe quel composant enfant du Provider."
					code={examples[1].code}
					highlightedCode={html("use-navigation-tabs")}
				>
					<div className="flex items-center gap-2 p-4 rounded border border-dashed border-edge-subtle text-sm text-fg-muted">
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
						Ouvrir dans un onglet
					</div>
				</DocExampleClient>
				<DocExampleClient
					title="useNavigationTabUrlSync — sync automatique du titre"
					description="Placer ce hook dans le layout pour que le titre du tab actif se mette à jour automatiquement à chaque navigation."
					code={examples[2].code}
					highlightedCode={html("url-sync")}
				>
					<TabBarPreview />
				</DocExampleClient>
				<DocExampleClient
					title="useNavigationTabTitle — titre depuis une page de détail"
					description="Quand le nom de la ressource est chargé depuis l'API, utiliser ce hook pour mettre à jour le titre du tab actif."
					code={examples[3].code}
					highlightedCode={html("update-title")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="interceptor" title="Interceptor">
				<DocExampleClient
					title="NavigationTabsInterceptor — raccourcis clavier"
					description="Composant renderless qui intercepte Cmd/Ctrl+Clic pour ouvrir les liens dans un nouveau tab, et Cmd/Ctrl+W pour fermer le tab actif."
					code={examples[4].code}
					highlightedCode={html("interceptor")}
				>
					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="flex items-center gap-2 rounded border border-edge-subtle bg-surface p-3">
							<kbd className="rounded border border-edge-subtle bg-raised px-1.5 py-0.5 font-mono text-fg">
								⌘ Clic
							</kbd>
							<span className="text-fg-muted">Ouvre dans un nouveau tab</span>
						</div>
						<div className="flex items-center gap-2 rounded border border-edge-subtle bg-surface p-3">
							<kbd className="rounded border border-edge-subtle bg-raised px-1.5 py-0.5 font-mono text-fg">
								⌘ W
							</kbd>
							<span className="text-fg-muted">Ferme le tab actif</span>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>
			<DocSection id="custom-tab-bar" title="TabBar personnalisé">
				<DocExampleClient
					title="Construire avec NavigationTabsBar + NavigationTabsItem"
					description="Pour un contexte non-CRM, composer manuellement avec les primitives Bar et Item et le hook useNavigationTabs. Le preset TabBar utilise cette même approche en interne."
					code={examples[5].code}
					highlightedCode={html("custom-tab-bar")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props — NavigationTabsProvider">
				<DocPropsTable props={providerProps} />
			</DocSection>
			<DocSection id="context-value" title="Context value — useNavigationTabs()">
				<DocPropsTable props={contextValueProps} />
			</DocSection>
			<DocSection id="interceptor-props" title="Props — NavigationTabsInterceptor">
				<DocPropsTable props={interceptorProps} />
			</DocSection>
			<DocSection id="url-sync-props" title="Props — useNavigationTabUrlSync()">
				<DocPropsTable props={urlSyncProps} />
			</DocSection>
			<DocSection id="bar-props" title="Props — NavigationTabsBar">
				<DocPropsTable props={barProps} />
			</DocSection>
			<DocSection id="item-props" title="Props — NavigationTabsItem">
				<DocPropsTable props={itemProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Tab Bar",
							href: "/docs/components/patterns/tab-bar",
							description: "TabBar pré-configuré pour le CRM, construit sur ce système.",
						},
						{
							title: "Navbar",
							href: "/docs/components/patterns/navbar",
							description: "Navbar globale complémentaire au TabBar.",
						},
						{
							title: "Nav Tabs",
							href: "/docs/components/patterns/nav-tabs",
							description: "Tabs de navigation statiques style pill pour la Navbar.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
