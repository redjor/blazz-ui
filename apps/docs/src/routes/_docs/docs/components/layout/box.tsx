import { Box } from "@blazz/ui/components/ui/box"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "background",
		code: `<Box background="raised" padding="4">
  <p>Content with raised background</p>
</Box>`,
	},
	{
		key: "padding",
		code: `<Box padding="4" background="raised" borderRadius="md">
  <p>Padding 4</p>
</Box>`,
	},
	{
		key: "border",
		code: `<Box border="default" padding="4" borderRadius="md">
  <p>Box with border</p>
</Box>`,
	},
	{
		key: "border-radius",
		code: `<Box background="raised" padding="4" borderRadius="lg">
  Large radius
</Box>`,
	},
	{
		key: "shadow",
		code: `<Box shadow="md" padding="4" background="surface" borderRadius="lg">
  Medium shadow
</Box>`,
	},
	{
		key: "shadow-card",
		code: `<Box shadow="card" padding="4" background="surface" borderRadius="lg">
  Card shadow
</Box>`,
	},
	{
		key: "polymorphic",
		code: `<Box as="section" background="raised" padding="4" borderRadius="md">
  <p>Rendered as a section element</p>
</Box>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/box")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: BoxPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const boxProps: DocProp[] = [
	{
		name: "as",
		type: "React.ElementType",
		default: '"div"',
		description: "The HTML element type to render.",
	},
	{
		name: "padding",
		type: '"0" | "2" | "4" | "6" | "8"',
		default: '"0"',
		description: "Padding around the content.",
	},
	{
		name: "background",
		type: '"transparent" | "app" | "surface" | "raised" | "overlay"',
		default: '"transparent"',
		description:
			"Background color of the box. Follows the surface hierarchy: app < surface < raised < overlay.",
	},
	{
		name: "border",
		type: '"none" | "default"',
		default: '"none"',
		description: "Border style of the box.",
	},
	{
		name: "borderRadius",
		type: '"none" | "sm" | "md" | "lg" | "xl"',
		default: '"none"',
		description: "Border radius of the box.",
	},
	{
		name: "shadow",
		type: '"none" | "sm" | "md" | "lg" | "card" | "card-elevated"',
		default: '"none"',
		description:
			"Shadow applied to the box. 'card' and 'card-elevated' use theme-aware shadows with inner glow in dark mode.",
	},
]

function BoxPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Box"
			subtitle="Box is the most primitive layout component. It's a way to access design tokens for background, padding, border, and shadow."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Background"
					description="Use different background levels. The hierarchy is: app < surface < raised < overlay."
					code={examples[0].code}
					highlightedCode={html("background")}
				>
					<div className="flex gap-4">
						<Box background="app" padding="4" borderRadius="md">
							<p className="text-sm">App</p>
						</Box>
						<Box background="surface" padding="4" borderRadius="md" border="default">
							<p className="text-sm">Surface</p>
						</Box>
						<Box background="raised" padding="4" borderRadius="md">
							<p className="text-sm">Raised</p>
						</Box>
						<Box background="overlay" padding="4" borderRadius="md" border="default">
							<p className="text-sm">Overlay</p>
						</Box>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Padding"
					description="Apply different padding values."
					code={examples[1].code}
					highlightedCode={html("padding")}
				>
					<div className="flex items-start gap-4">
						<Box padding="2" background="raised" borderRadius="md">
							<p className="text-sm">p-2</p>
						</Box>
						<Box padding="4" background="raised" borderRadius="md">
							<p className="text-sm">p-4</p>
						</Box>
						<Box padding="6" background="raised" borderRadius="md">
							<p className="text-sm">p-6</p>
						</Box>
						<Box padding="8" background="raised" borderRadius="md">
							<p className="text-sm">p-8</p>
						</Box>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Border"
					description="Add borders to the box."
					code={examples[2].code}
					highlightedCode={html("border")}
				>
					<Box border="default" padding="4" borderRadius="md">
						<p className="text-sm text-fg-muted">Box with border</p>
					</Box>
				</DocExampleClient>

				<DocExampleClient
					title="Border Radius"
					description="Different border radius options."
					code={examples[3].code}
					highlightedCode={html("border-radius")}
				>
					<div className="flex items-start gap-4">
						<Box background="raised" padding="4" borderRadius="sm">
							<p className="text-sm">sm</p>
						</Box>
						<Box background="raised" padding="4" borderRadius="md">
							<p className="text-sm">md</p>
						</Box>
						<Box background="raised" padding="4" borderRadius="lg">
							<p className="text-sm">lg</p>
						</Box>
						<Box background="raised" padding="4" borderRadius="xl">
							<p className="text-sm">xl</p>
						</Box>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Shadow"
					description="Apply different shadow levels."
					code={examples[4].code}
					highlightedCode={html("shadow")}
				>
					<div className="flex items-start gap-4 p-4">
						<Box shadow="sm" padding="4" background="surface" borderRadius="lg">
							<p className="text-sm">sm</p>
						</Box>
						<Box shadow="md" padding="4" background="surface" borderRadius="lg">
							<p className="text-sm">md</p>
						</Box>
						<Box shadow="lg" padding="4" background="surface" borderRadius="lg">
							<p className="text-sm">lg</p>
						</Box>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Card Shadow"
					description="Theme-aware card shadows with inner glow in dark mode. Use 'card' for flat cards and 'card-elevated' for raised panels."
					code={examples[5].code}
					highlightedCode={html("shadow-card")}
				>
					<div className="flex items-start gap-4 p-4">
						<Box shadow="card" padding="4" background="surface" borderRadius="lg">
							<p className="text-sm">card</p>
						</Box>
						<Box shadow="card-elevated" padding="4" background="surface" borderRadius="lg">
							<p className="text-sm">card-elevated</p>
						</Box>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Polymorphic"
					description="Render as different HTML elements using the 'as' prop."
					code={examples[6].code}
					highlightedCode={html("polymorphic")}
				>
					<Box as="section" background="raised" padding="4" borderRadius="md">
						<p className="text-sm text-fg-muted">Rendered as a section element</p>
					</Box>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={boxProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Card",
							href: "/docs/components/layout/card",
							description: "For more specific use cases, use the Card component.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
