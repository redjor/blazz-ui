import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "basic",
		code: `import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { BarChart3, Building2, LayoutDashboard, Users } from "lucide-react"

const tabs = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Companies",  href: "/companies",  icon: <Building2 className="h-4 w-4" /> },
  { label: "Contacts",  href: "/contacts",  icon: <Users className="h-4 w-4" /> },
  { label: "Reports",   href: "/reports",   icon: <BarChart3 className="h-4 w-4" /> },
]

export function AppNav() {
  return <NavTabs tabs={tabs} />
}`,
	},
	{
		key: "badges",
		code: `import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { Building2, Users } from "lucide-react"

// badge: number → affiche le count (max "9+")
// badge: "loading" → spinner animé
const tabs = [
  {
    label: "Companies",
    href: "/companies",
    icon: <Building2 className="h-4 w-4" />,
    badge: 12,          // badge numérique
  },
  {
    label: "Contacts",
    href: "/contacts",
    icon: <Users className="h-4 w-4" />,
    badge: "loading",   // badge loading
  },
]

export function AppNavWithBadges() {
  return <NavTabs tabs={tabs} />
}`,
	},
	{
		key: "disabled",
		code: `import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"
import { BarChart3, Building2 } from "lucide-react"

const tabs = [
  { label: "Companies", href: "/companies", icon: <Building2 className="h-4 w-4" /> },
  {
    label: "Reports",
    href: "/reports",
    icon: <BarChart3 className="h-4 w-4" />,
    disabled: true,   // opacity 50%, non-cliquable
  },
]

export function AppNavWithDisabled() {
  return <NavTabs tabs={tabs} />
}`,
	},
	{
		key: "no-preserve",
		code: `import { NavTabs } from "@blazz/ui/components/patterns/nav-tabs"

// Par défaut, preserveQueryParams=true conserve les searchParams
// lors de la navigation entre tabs (utile pour les filtres actifs)
export function AppNav() {
  return (
    <NavTabs
      tabs={tabs}
      preserveQueryParams={false}  // navigation sans paramètres
    />
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/nav-tabs")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: NavTabsPage,
})

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "badges", title: "Badges" },
	{ id: "props", title: "Props" },
	{ id: "navtab-props", title: "NavTab props" },
	{ id: "related", title: "Related" },
]

const navTabsProps: DocProp[] = [
	{
		name: "tabs",
		type: "NavTab[]",
		required: true,
		description: "Liste des onglets à afficher. Voir NavTab ci-dessous.",
	},
	{
		name: "preserveQueryParams",
		type: "boolean",
		default: "true",
		description:
			"Si true, conserve les searchParams de l'URL courante lors des navigations entre tabs. Utile pour préserver les filtres actifs.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires sur le conteneur des tabs.",
	},
]

const navTabItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		required: true,
		description: "Texte affiché dans l'onglet.",
	},
	{
		name: "href",
		type: "string",
		required: true,
		description:
			"URL de destination. L'onglet est actif si pathname.startsWith(href). Pour la racine, utiliser '/'.",
	},
	{
		name: "icon",
		type: "React.ReactNode",
		required: true,
		description: "Icône affichée à gauche du label. Utiliser Lucide à 16px (h-4 w-4).",
	},
	{
		name: "badge",
		type: 'number | "loading"',
		description:
			"Badge affiché à droite du label. number → count (affiche \"9+\" si > 9). \"loading\" → spinner Loader2 animé. Ignoré si 0 ou undefined.",
	},
	{
		name: "disabled",
		type: "boolean",
		description: "Désactive le tab : opacity 50%, pointeur non-interactif.",
	},
]

function NavTabsPreview() {
	return (
		<div className="flex items-center justify-center rounded border border-edge-subtle bg-[#1a3c2e] p-4">
			<div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
				<span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#1a3c2e]">
					Dashboard
				</span>
				<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">
					Companies
				</span>
				<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">
					Contacts
				</span>
				<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80">
					Reports
				</span>
			</div>
		</div>
	)
}

function NavTabsBadgePreview() {
	return (
		<div className="flex items-center justify-center rounded border border-edge-subtle bg-[#1a3c2e] p-4">
			<div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
				<span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#1a3c2e]">
					Dashboard
				</span>
				<span className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/80">
					Companies
					<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold text-white">
						12
					</span>
				</span>
				<span className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-white/80">
					Contacts
					<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1">
						<svg
							className="h-3 w-3 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
					</span>
				</span>
			</div>
		</div>
	)
}

function NavTabsDisabledPreview() {
	return (
		<div className="flex items-center justify-center rounded border border-edge-subtle bg-[#1a3c2e] p-4">
			<div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
				<span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#1a3c2e]">
					Companies
				</span>
				<span className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80 opacity-50">
					Reports
				</span>
			</div>
		</div>
	)
}

function NavTabsPage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/nav-tabs" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Nav Tabs"
			subtitle="Tabs de navigation horizontaux style pill pour le centre d'une Navbar. Conçus pour les fonds sombres avec état actif en blanc. Gèrent les badges numériques, les états loading et la préservation des query params."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Base"
					description="Chaque tab nécessite un label, un href et une icône. L'onglet actif est détecté automatiquement via pathname.startsWith(href)."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<NavTabsPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="badges" title="Badges">
				<DocExampleClient
					title="Badges numériques et loading"
					description={'badge: number affiche un count ("9+" si supérieur à 9). badge: "loading" affiche un spinner — utile quand les données du tab sont en cours de chargement.'}
					code={examples[1].code}
					highlightedCode={html("badges")}
				>
					<NavTabsBadgePreview />
				</DocExampleClient>
				<DocExampleClient
					title="Tab désactivé"
					description="disabled rend le tab non-cliquable avec une opacité réduite. Utiliser pour les sections inaccessibles ou en développement."
					code={examples[2].code}
					highlightedCode={html("disabled")}
				>
					<NavTabsDisabledPreview />
				</DocExampleClient>
				<DocExampleClient
					title="Sans préservation des paramètres"
					description="Par défaut, les searchParams sont préservés lors de la navigation (utile pour conserver les filtres). Passer preserveQueryParams={false} pour naviguer sans paramètres."
					code={examples[3].code}
					highlightedCode={html("no-preserve")}
				>
					<NavTabsPreview />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props — NavTabs">
				<DocPropsTable props={navTabsProps} />
			</DocSection>
			<DocSection id="navtab-props" title="Props — NavTab (item)">
				<DocPropsTable props={navTabItemProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Navbar",
							href: "/docs/components/patterns/navbar",
							description: "Conteneur 3-colonnes qui accueille NavTabs au centre.",
						},
						{
							title: "Tabs",
							href: "/docs/components/ui/tabs",
							description: "Composant primitif pour les tabs de contenu (UI layer).",
						},
						{
							title: "Navigation Tabs",
							href: "/docs/components/patterns/navigation-tabs",
							description: "Système de tabs navigateur (browser-like) avec persistance.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
