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
		code: `import { LayoutFrame } from "@blazz/ui/components/patterns/layout-frame"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutFrame
      topBar={<MyTopBar />}
      sidebar={<MySidebar />}
    >
      {children}
    </LayoutFrame>
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
		description: "Contenu principal (zone scrollable).",
	},
	{
		name: "topBar",
		type: "React.ReactNode",
		required: true,
		description: "Header fixe en haut — ne scrolle jamais.",
	},
	{
		name: "sidebar",
		type: "React.ReactNode",
		required: true,
		description: "Sidebar à largeur fixe (240px) avec scroll indépendant.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires appliquées à la zone main.",
	},
]

function LayoutPlaceholder() {
	return (
		<div className="flex flex-col h-32 overflow-hidden rounded border border-dashed border-edge-subtle text-xs text-fg-muted">
			<div className="h-8 shrink-0 border-b border-dashed border-edge-subtle bg-surface-3/50 flex items-center px-3">
				Top bar
			</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="w-28 shrink-0 border-r border-dashed border-edge-subtle bg-surface-3/30 flex items-center justify-center">
					Sidebar
				</div>
				<div className="flex-1 flex items-center justify-center bg-surface">Main content</div>
			</div>
		</div>
	)
}

function LayoutFramePage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/layout-frame" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Layout Frame"
			subtitle="Brique flexbox bas niveau : topBar fixe + sidebar + main scrollable indépendamment. Utilisez AppFrame pour la plupart des cas."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Usage simple"
					description="Structure h-screen avec topBar, sidebar et main. Chaque zone scrolle indépendamment."
					code={examples[0].code}
					highlightedCode={html("basic")}
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
							title: "Dashboard Layout",
							href: "/docs/components/patterns/dashboard-layout",
							description: "Layout alternatif avec navbar + sidebar + style rounded.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
