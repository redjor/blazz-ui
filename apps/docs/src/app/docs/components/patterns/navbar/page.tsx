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
		code: `import { Navbar } from "@blazz/ui/components/patterns/navbar"
import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { BarChart3, Building2, LayoutDashboard, Users } from "lucide-react"

const tabs = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Companies",  href: "/companies",  icon: <Building2 className="h-4 w-4" /> },
  { label: "Contacts",  href: "/contacts",  icon: <Users className="h-4 w-4" /> },
  { label: "Reports",   href: "/reports",   icon: <BarChart3 className="h-4 w-4" /> },
]

export function AppNavbar() {
  return (
    <Navbar
      left={<span className="font-bold text-white">MyApp</span>}
      center={<NavTabs tabs={tabs} />}
      right={<UserMenu />}
    />
  )
}`,
	},
	{
		key: "custom-bg",
		code: `import { Navbar } from "@blazz/ui/components/patterns/navbar"

// Surcharger la couleur de fond avec bgColor
export function AppNavbar() {
  return (
    <Navbar
      bgColor="bg-slate-900"
      left={<Logo />}
      center={<NavTabs tabs={tabs} />}
      right={<UserMenu />}
    />
  )
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const navbarProps: DocProp[] = [
	{
		name: "left",
		type: "React.ReactNode",
		description: "Section gauche — logo, nom de l'app. Aligne les éléments flex-start.",
	},
	{
		name: "center",
		type: "React.ReactNode",
		description:
			"Section centrale — NavTabs ou navigation principale. Centré via une grille 3-colonnes Shopify-style : le centre est toujours parfaitement au milieu quelle que soit la largeur du gauche/droite.",
	},
	{
		name: "right",
		type: "React.ReactNode",
		description: "Section droite — UserMenu, notifications, datetime. Aligne les éléments flex-end.",
	},
	{
		name: "bgColor",
		type: "string",
		default: '"bg-bb-dark-green"',
		description: "Classe Tailwind pour la couleur de fond. Passer n'importe quelle classe bg-* pour surcharger le vert Blazz par défaut.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires sur l'élément <nav>.",
	},
]

function NavbarPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="bg-[#1a3c2e] grid grid-cols-[minmax(min-content,1fr)_auto_minmax(min-content,1fr)] items-center gap-4 px-6 py-3">
				<div className="flex items-center">
					<span className="font-bold text-white text-sm">MyApp</span>
				</div>
				<div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
					<span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#1a3c2e]">Dashboard</span>
					<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">Companies</span>
					<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">Contacts</span>
					<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">Reports</span>
				</div>
				<div className="flex items-center justify-end gap-3">
					<div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-medium">JD</div>
				</div>
			</div>
		</div>
	)
}

function NavbarCustomBgPreview() {
	return (
		<div className="rounded border border-edge-subtle overflow-hidden">
			<div className="bg-slate-900 grid grid-cols-[minmax(min-content,1fr)_auto_minmax(min-content,1fr)] items-center gap-4 px-6 py-3">
				<div className="flex items-center">
					<span className="font-bold text-white text-sm">MyApp</span>
				</div>
				<div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
					<span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-slate-900">Dashboard</span>
					<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">Companies</span>
					<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">Contacts</span>
				</div>
				<div className="flex items-center justify-end gap-3">
					<div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-medium">JD</div>
				</div>
			</div>
		</div>
	)
}

export default function NavbarPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Navbar"
			subtitle="Barre de navigation globale en 3 colonnes (Shopify-style) : logo à gauche, tabs au centre, actions à droite. Le centre est toujours parfaitement centré quelle que soit la largeur des sections latérales."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Navbar avec NavTabs"
					description="Composition standard : logo + NavTabs + UserMenu. La grille CSS garantit que les tabs restent au centre absolu de la navbar."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<NavbarPreview />
				</DocExampleClient>
				<DocExampleClient
					title="Fond personnalisé"
					description="Utiliser bgColor pour surcharger le fond vert Blazz par défaut avec n'importe quelle classe bg-*."
					code={examples[1].code}
					highlightedCode={html("custom-bg")}
				>
					<NavbarCustomBgPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props">
				<DocPropsTable props={navbarProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Nav Tabs",
							href: "/docs/components/patterns/nav-tabs",
							description: "Tabs pill-style pour le centre de la Navbar.",
						},
						{
							title: "User Menu",
							href: "/docs/components/patterns/user-menu",
							description: "Menu utilisateur pour la section droite.",
						},
						{
							title: "App Frame",
							href: "/docs/blocks/app-frame",
							description: "Shell complet avec sidebar, top bar et browser tabs.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
