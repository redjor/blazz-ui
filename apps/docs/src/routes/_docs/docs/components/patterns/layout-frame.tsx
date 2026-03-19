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
		code: `import { Frame } from "@blazz/ui/components/patterns/frame"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { TopBar } from "@blazz/ui/components/patterns/top-bar"

// Layout sans top bar globale — la sidebar occupe toute la hauteur
// Le logo est dans le SidebarHeader, le SidebarTrigger dans le header
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Frame
        navigation={<MySidebar />}
        header={
          <TopBar
            left={
              <>
                <TopBar.SidebarToggle />
                <TopBar.Breadcrumbs items={[{ label: "Dashboard" }]} />
              </>
            }
          />
        }
      >
        {children}
      </Frame>
    </SidebarProvider>
  )
}`,
	},
	{
		key: "with-topbar",
		code: `import { Frame } from "@blazz/ui/components/patterns/frame"

// Layout avec top bar globale — la sidebar commence sous la top bar
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Frame
      topBar={<AppTopBar />}
      navigation={<AppSidebar config={sidebarConfig} />}
    >
      {children}
    </Frame>
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/layout-frame")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: LayoutFramePage,
})

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const layoutFrameProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "Contenu principal (zone scrollable via ScrollArea).",
	},
	{
		name: "topBar",
		type: "React.ReactNode",
		description:
			"Header fixe pleine largeur en haut (position fixed, z-20). Optionnel — si omis, la sidebar occupe toute la hauteur.",
	},
	{
		name: "navigation",
		type: "React.ReactNode",
		required: true,
		description:
			"Sidebar placée dans le flex container. La sidebar gère sa propre largeur (240px) et son collapse/peek.",
	},
	{
		name: "header",
		type: "React.ReactNode",
		description:
			"Slot rendu au-dessus du contenu scrollable, dans la zone main. Typiquement un TopBar avec breadcrumbs et actions.",
	},
	{
		name: "tabBar",
		type: "React.ReactNode",
		description: "Barre de navigation secondaire entre la sidebar et le contenu principal.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires appliquées au conteneur racine.",
	},
]

function LayoutPlaceholder() {
	return (
		<div className="flex h-40 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
			<div className="w-28 shrink-0 bg-surface-3/30 flex flex-col">
				<div className="h-8 shrink-0 border-b border-dashed border-edge-subtle flex items-center px-3 font-medium">
					Logo
				</div>
				<div className="flex-1 flex items-center justify-center">Nav items</div>
			</div>
			<div className="flex-1 flex flex-col">
				<div className="h-8 shrink-0 border-l border-t border-dashed border-edge-subtle bg-surface flex items-center px-3 gap-2 rounded-tl-lg">
					<span className="size-4 rounded border border-dashed border-edge-subtle flex items-center justify-center text-[8px]">
						&#9776;
					</span>
					<span>Header (TopBar + SidebarToggle)</span>
				</div>
				<div className="flex-1 border-l border-dashed border-edge-subtle bg-surface flex items-center justify-center">
					Main content (ScrollArea)
				</div>
			</div>
		</div>
	)
}

function LayoutFramePage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/layout-frame" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Frame"
			subtitle="Brique flexbox bas niveau : sidebar (navigation) + header slot + main scrollable. Top bar globale optionnelle."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Sans top bar (recommandé)"
					description="La sidebar occupe toute la hauteur. Le logo va dans SidebarHeader, le SidebarTrigger dans le header slot. Nécessite SidebarProvider en parent pour le collapse/peek."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<LayoutPlaceholder />
				</DocExampleClient>
				<DocExampleClient
					title="Avec top bar globale"
					description="La top bar est fixée pleine largeur en haut. La sidebar commence sous la top bar (pt-[--topbar-height])."
					code={examples[1].code}
					highlightedCode={html("with-topbar")}
				>
					<LayoutPlaceholder />
				</DocExampleClient>
			</DocSection>
			<DocSection id="props" title="Props">
				<DocPropsTable props={layoutFrameProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "App Frame",
							href: "/docs/components/patterns/app-frame",
							description: "Shell complet recommandé — intègre sidebar, top bar et gestion mobile.",
						},
						{
							title: "Top Bar",
							href: "/docs/components/patterns/top-bar",
							description:
								"Header composable pour le header slot — avec SidebarToggle et breadcrumbs.",
						},
						{
							title: "App Sidebar",
							href: "/docs/components/patterns/app-sidebar",
							description: "Sidebar hiérarchique pilotée par SidebarConfig.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
