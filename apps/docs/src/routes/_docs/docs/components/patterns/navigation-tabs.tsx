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
		code: `// Layout racine — envelopper avec TabsProvider
import { TabsProvider } from "@blazz/tabs"
import { NextTabsInterceptor } from "@blazz/tabs/adapters/next"
import { TabsBar, TabsItem } from "@blazz/tabs/ui"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <TabsProvider storageKey="app-tabs">
      {/* Intercepte Cmd/Ctrl+clic pour ouvrir un nouveau tab */}
      <NextTabsInterceptor
        titleResolver={(url) => url.split("/").pop() ?? "Tab"}
      />
      <div className="flex flex-col h-screen">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TabsProvider>
  )
}`,
	},
	{
		key: "use-tabs",
		code: `// Acceder au contexte dans n'importe quel composant enfant
"use client"
import { useTabs } from "@blazz/tabs"
import { useRouter } from "next/navigation"

export function OpenTabButton({ href, title }: { href: string; title: string }) {
  const { addTab } = useTabs()
  const router = useRouter()

  function handleOpen() {
    addTab({ url: href, title })
    router.push(href)
  }

  return <button type="button" onClick={handleOpen}>Ouvrir dans un onglet</button>
}`,
	},
	{
		key: "url-sync-next",
		code: `// Next.js adapter — sync automatique avec useNextTabSync
"use client"
import { useNextTabSync } from "@blazz/tabs/adapters/next"

// Placer dans le layout, a l'interieur du Provider
export function TabTitleSync() {
  useNextTabSync((pathname) => {
    if (pathname.startsWith("/contacts/")) return "Contact"
    if (pathname.startsWith("/companies/")) return "Entreprise"
    return pathname.split("/").pop() ?? "Page"
  })
  return null
}`,
	},
	{
		key: "url-sync-generic",
		code: `// Framework-agnostic — passer le pathname manuellement
"use client"
import { useTabUrlSync } from "@blazz/tabs"

// Pass pathname from your router
export function TabTitleSync({ pathname }: { pathname: string }) {
  useTabUrlSync(pathname, (p) => p.split("/").pop() ?? "Page")
  return null
}`,
	},
	{
		key: "update-title",
		code: `// Mettre a jour le titre du tab actif depuis une page
"use client"
import { useTabTitle } from "@blazz/tabs"

export function ContactDetailPage({ contact }: { contact: Contact }) {
  // Met a jour le titre du tab actif des que contact.name change
  useTabTitle(contact.name)

  return <div>{contact.name}</div>
}`,
	},
	{
		key: "interceptor",
		code: `// Framework-agnostic — TabsInterceptor
import { TabsInterceptor } from "@blazz/tabs"

<TabsInterceptor
  pathname={pathname}
  onNavigate={(url) => router.push(url)}
  excludePaths={["/api", "/auth"]}
  titleResolver={(url) => {
    const segment = url.split("/").pop() ?? "Tab"
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }}
/>

// Next.js adapter (simpler — auto-reads pathname + uses next/navigation)
import { NextTabsInterceptor } from "@blazz/tabs/adapters/next"

<NextTabsInterceptor
  excludePaths={["/api", "/auth"]}
  titleResolver={(url) => url.split("/").pop() ?? "Tab"}
/>`,
	},
	{
		key: "custom-tab-bar",
		code: `// Construire un TabBar personnalise avec les primitives
"use client"
import { useRouter } from "next/navigation"
import { useTabs } from "@blazz/tabs"
import { TabsBar, TabsItem } from "@blazz/tabs/ui"
import { FileText, LayoutDashboard } from "lucide-react"

const routeMap = [
  { prefix: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { prefix: "/docs",      icon: <FileText />,        label: "Docs" },
]

function getIcon(url: string) {
  return routeMap.find((r) => url.startsWith(r.prefix))?.icon ?? <LayoutDashboard />
}

export function CustomTabBar() {
  const { tabs, activeTabId, activateTab, closeTab, addTab } = useTabs()
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
    <TabsBar
      onAddTab={() => addTab({ url: "/dashboard", title: "Dashboard" })}
      className="rounded-tr-lg"
    >
      {tabs.map((tab) => (
        <TabsItem
          key={tab.id}
          title={tab.title}
          icon={getIcon(tab.url)}
          isActive={tab.id === activeTabId}
          onClick={() => handleActivate(tab.id, tab.url)}
          onClose={() => handleClose(tab.id)}
        />
      ))}
    </TabsBar>
  )
}`,
	},
	{
		key: "storage",
		code: `// Custom storage adapter — ex: sessionStorage, IndexedDB wrapper, etc.
import { TabsProvider, type TabsStorage } from "@blazz/tabs"

// TabsStorage implements the same API as Web Storage (getItem/setItem)
const sessionAdapter: TabsStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
}

// Or a custom backend wrapper (must be synchronous)
const customStorage: TabsStorage = {
  getItem: (key) => {
    const cache = myCache.get(key)
    return cache ?? null
  },
  setItem: (key, value) => {
    myCache.set(key, value)
  },
}

<TabsProvider storageKey="app-tabs" storage={sessionAdapter}>
  {children}
</TabsProvider>`,
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
	{ id: "custom-tab-bar", title: "TabBar personnalise" },
	{ id: "storage", title: "Storage" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const providerProps: DocProp[] = [
	{
		name: "storageKey",
		type: "string",
		required: true,
		description:
			"Cle de persistance des tabs entre rechargements. Utilisee comme cle dans le storage (localStorage par defaut). Chaque app ou section doit utiliser une cle unique.",
	},
	{
		name: "storage",
		type: "TabsStorage",
		description:
			"Adaptateur de stockage personnalise. Doit implementer getItem(key) et setItem(key, value), meme API que Web Storage. Par defaut : localStorage.",
	},
	{
		name: "defaultTab",
		type: "{ url: string; title: string }",
		description:
			"Tab ouvert par defaut quand le store est vide (premier chargement). Si omis, aucun tab n'est cree automatiquement.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description:
			"Arbre React enfant. Tous les composants et hooks @blazz/tabs doivent etre dans cet arbre.",
	},
]

const contextValueProps: DocProp[] = [
	{
		name: "tabs",
		type: "Tab[]",
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
		description: "true si >= 2 tabs sont ouverts. Utiliser pour conditionner l'affichage de TabsBar.",
	},
	{
		name: "addTab",
		type: "(payload: { url: string; title: string; icon?: string }) => void",
		description:
			"Ouvre un tab sur l'URL donnee. Si un tab avec la meme URL existe deja, l'active simplement.",
	},
	{
		name: "closeTab",
		type: "(id: string) => void",
		description:
			"Ferme un tab. Si c'est le tab actif, active automatiquement le tab precedent ou suivant.",
	},
	{
		name: "activateTab",
		type: "(id: string) => void",
		description:
			"Active un tab existant sans naviguer (la navigation doit etre faite separement via router.push).",
	},
	{
		name: "updateActiveTabUrl",
		type: "(url: string) => void",
		description:
			"Met a jour l'URL enregistree du tab actif (appele automatiquement par useTabUrlSync).",
	},
	{
		name: "updateTabTitle",
		type: "(id: string, title: string) => void",
		description: "Met a jour le titre d'un tab specifique.",
	},
]

const interceptorProps: DocProp[] = [
	{
		name: "pathname",
		type: "string",
		description:
			"Pathname courant du router (requis pour TabsInterceptor generique). Non requis pour NextTabsInterceptor qui le lit automatiquement.",
	},
	{
		name: "onNavigate",
		type: "(url: string) => void",
		description:
			"Callback de navigation (requis pour TabsInterceptor generique). Non requis pour NextTabsInterceptor qui utilise next/navigation.",
	},
	{
		name: "excludePaths",
		type: "string[]",
		default: "[]",
		description:
			'Chemins exclus de l\'interception Cmd+clic. Les liens dont le href commence par un de ces chemins sont ignores (ex: ["/api", "/auth"]).',
	},
	{
		name: "titleResolver",
		type: "(url: string) => string",
		description:
			"Fonction pour determiner le titre d'un tab cree via Cmd+clic. Par defaut, utilise le dernier segment du chemin ou le texte du lien.",
	},
]

const urlSyncProps: DocProp[] = [
	{
		name: "pathname",
		type: "string",
		description:
			"Pathname courant (requis pour useTabUrlSync). Non requis pour useNextTabSync qui le lit automatiquement via usePathname().",
	},
	{
		name: "titleResolver",
		type: "(pathname: string) => string",
		description:
			"Fonction appelee a chaque changement de pathname pour determiner le titre du tab actif. Si omis, le titre n'est pas mis a jour automatiquement.",
	},
]

const barProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Les TabsItem a afficher dans la barre.",
	},
	{
		name: "onAddTab",
		type: "() => void",
		description:
			'Si fourni, affiche le bouton "+" a droite de la barre pour ouvrir un nouvel onglet.',
	},
	{
		name: "addButtonLabel",
		type: "string",
		default: '"Open new tab"',
		description: "aria-label du bouton + (pour l'accessibilite).",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplementaires sur le conteneur de la barre.",
	},
	{
		name: "addButtonClassName",
		type: "string",
		description: "Classes CSS supplementaires sur le bouton + (add tab).",
	},
]

const itemProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		required: true,
		description: "Texte du tab. Tronque avec ellipsis si trop long.",
	},
	{
		name: "icon",
		type: "React.ReactNode",
		description:
			"Icone affichee a gauche du titre. Accepte tout ReactNode (Lucide, SVG, emoji...). Les SVG enfants sont redimensionnes a 3.5x3.5 automatiquement.",
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
			"Handler de fermeture. Le bouton x est masque par defaut et apparait au hover (toujours visible sur le tab actif).",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplementaires sur le conteneur du tab.",
	},
	{
		name: "activeClassName",
		type: "string",
		description: "Classes CSS supplementaires appliquees uniquement quand isActive est true. Fusionne avec les styles actifs par defaut.",
	},
	{
		name: "closeButtonClassName",
		type: "string",
		description: "Classes CSS supplementaires sur le bouton de fermeture.",
	},
]

function TabBarPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="flex h-9 items-center border-t border-edge-subtle bg-surface">
				<div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
					<div className="group relative flex shrink-0 items-center rounded-lg text-xs bg-surface-3 text-fg font-semibold">
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
			subtitle="Standalone package @blazz/tabs — systeme complet de tabs navigateur (browser-like) avec persistance, interception Cmd/Ctrl+clic, synchronisation URL, et adaptateurs framework (Next.js). Compose de TabsProvider, TabsBar, TabsItem, TabsInterceptor et hooks."
			toc={toc}
		>
			<DocSection id="overview" title="Overview">
				<div className="rounded border border-edge-subtle bg-surface p-4 text-sm text-fg-secondary space-y-3">
					<p className="font-medium text-fg">Architecture du systeme</p>
					<p className="text-xs text-fg-muted">
						Package standalone <code className="font-mono text-brand">@blazz/tabs</code> avec 3
						entry points : <code className="font-mono">@blazz/tabs</code> (core),{" "}
						<code className="font-mono">@blazz/tabs/ui</code> (styled components),{" "}
						<code className="font-mono">@blazz/tabs/adapters/next</code> (Next.js adapter).
					</p>
					<div className="grid grid-cols-1 gap-2 text-xs">
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">TabsProvider</span>
							<span className="text-fg-muted">
								— Context React + reducer + persistance (localStorage ou custom)
							</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">TabsBar</span>
							<span className="text-fg-muted">— Conteneur de tabs avec bouton "+"</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">TabsItem</span>
							<span className="text-fg-muted">
								— Tab individuel avec icone, titre tronque, bouton x
							</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">TabsInterceptor</span>
							<span className="text-fg-muted">— Intercepte Cmd+clic et Cmd+W (renderless, framework-agnostic)</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">NextTabsInterceptor</span>
							<span className="text-fg-muted">— Interceptor pre-cable pour Next.js (auto pathname + navigation)</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useTabs()</span>
							<span className="text-fg-muted">— Hook d'acces au contexte complet</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useTabUrlSync()</span>
							<span className="text-fg-muted">— Sync pathname + titre du tab actif (framework-agnostic)</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useNextTabSync()</span>
							<span className="text-fg-muted">— Sync auto pour Next.js (lit usePathname())</span>
						</div>
						<div className="flex gap-3">
							<span className="font-mono text-brand shrink-0">useTabTitle()</span>
							<span className="text-fg-muted">
								— Met a jour le titre du tab actif depuis une page
							</span>
						</div>
					</div>
				</div>
			</DocSection>
			<DocSection id="provider" title="Provider">
				<DocExampleClient
					title="Setup dans le layout racine"
					description="TabsProvider gere l'etat global des tabs et persiste dans localStorage (par defaut). NextTabsInterceptor (renderless) ecoute les evenements clavier/clic sur tout le document."
					code={examples[0].code}
					highlightedCode={html("provider-setup")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="hooks" title="Hooks">
				<DocExampleClient
					title="useTabs — ouvrir un tab manuellement"
					description="Utiliser addTab pour ouvrir programmatiquement un nouveau tab depuis n'importe quel composant enfant du Provider."
					code={examples[1].code}
					highlightedCode={html("use-tabs")}
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
					title="useNextTabSync — sync automatique (Next.js)"
					description="Adaptateur Next.js : lit usePathname() automatiquement et met a jour le titre du tab actif a chaque navigation."
					code={examples[2].code}
					highlightedCode={html("url-sync-next")}
				>
					<TabBarPreview />
				</DocExampleClient>
				<DocExampleClient
					title="useTabUrlSync — sync framework-agnostic"
					description="Version generique : passer le pathname manuellement depuis votre router."
					code={examples[3].code}
					highlightedCode={html("url-sync-generic")}
				>
					<TabBarPreview />
				</DocExampleClient>
				<DocExampleClient
					title="useTabTitle — titre depuis une page de detail"
					description="Quand le nom de la ressource est charge depuis l'API, utiliser ce hook pour mettre a jour le titre du tab actif."
					code={examples[4].code}
					highlightedCode={html("update-title")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="interceptor" title="Interceptor">
				<DocExampleClient
					title="TabsInterceptor + NextTabsInterceptor"
					description="TabsInterceptor (generique) necessite pathname et onNavigate. NextTabsInterceptor (Next.js) les resout automatiquement. Les deux interceptent Cmd/Ctrl+Clic et Cmd/Ctrl+W."
					code={examples[5].code}
					highlightedCode={html("interceptor")}
				>
					<div className="grid grid-cols-2 gap-3 text-xs">
						<div className="flex items-center gap-2 rounded border border-edge-subtle bg-surface p-3">
							<kbd className="rounded border border-edge-subtle bg-surface-3 px-1.5 py-0.5 font-mono text-fg">
								Cmd Clic
							</kbd>
							<span className="text-fg-muted">Ouvre dans un nouveau tab</span>
						</div>
						<div className="flex items-center gap-2 rounded border border-edge-subtle bg-surface p-3">
							<kbd className="rounded border border-edge-subtle bg-surface-3 px-1.5 py-0.5 font-mono text-fg">
								Cmd W
							</kbd>
							<span className="text-fg-muted">Ferme le tab actif</span>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>
			<DocSection id="custom-tab-bar" title="TabBar personnalise">
				<DocExampleClient
					title="Construire avec TabsBar + TabsItem"
					description="Composer manuellement avec les primitives TabsBar et TabsItem depuis @blazz/tabs/ui et le hook useTabs."
					code={examples[6].code}
					highlightedCode={html("custom-tab-bar")}
				>
					<TabBarPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="storage" title="Storage">
				<DocExampleClient
					title="Adaptateur de stockage personnalise"
					description="Par defaut, TabsProvider utilise localStorage. Passer un objet TabsStorage (meme API que Web Storage : getItem/setItem) pour personnaliser la persistance."
					code={examples[7].code}
					highlightedCode={html("storage")}
				>
					<div className="rounded border border-edge-subtle bg-surface p-4 text-xs text-fg-muted space-y-2">
						<p>
							<code className="font-mono text-brand">TabsStorage</code> interface :
						</p>
						<div className="font-mono text-fg-secondary">
							<div>{"getItem(key: string): string | null"}</div>
							<div>{"setItem(key: string, value: string): void"}</div>
						</div>
						<p className="text-fg-muted">
							Meme API que Web Storage (localStorage/sessionStorage).
						</p>
					</div>
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props — TabsProvider">
				<DocPropsTable props={providerProps} />
			</DocSection>
			<DocSection id="context-value" title="Context value — useTabs()">
				<DocPropsTable props={contextValueProps} />
			</DocSection>
			<DocSection id="interceptor-props" title="Props — TabsInterceptor / NextTabsInterceptor">
				<DocPropsTable props={interceptorProps} />
			</DocSection>
			<DocSection id="url-sync-props" title="Props — useTabUrlSync() / useNextTabSync()">
				<DocPropsTable props={urlSyncProps} />
			</DocSection>
			<DocSection id="bar-props" title="Props — TabsBar">
				<DocPropsTable props={barProps} />
			</DocSection>
			<DocSection id="item-props" title="Props — TabsItem">
				<DocPropsTable props={itemProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Navbar",
							href: "/docs/components/patterns/navbar",
							description: "Navbar globale complementaire au TabsBar.",
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
