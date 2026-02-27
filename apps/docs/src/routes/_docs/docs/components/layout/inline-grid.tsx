import { createFileRoute } from "@tanstack/react-router"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "gap",
		code: `<InlineGrid gap="400" columns={3}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</InlineGrid>`,
	},
	{
		key: "columns",
		code: `<InlineGrid columns={2} gap="400">...</InlineGrid>
<InlineGrid columns={3} gap="400">...</InlineGrid>
<InlineGrid columns={4} gap="400">...</InlineGrid>`,
	},
	{
		key: "gap-sizes",
		code: `<InlineGrid gap="100" columns={3}>...</InlineGrid>
<InlineGrid gap="400" columns={3}>...</InlineGrid>
<InlineGrid gap="800" columns={3}>...</InlineGrid>`,
	},
	{
		key: "named-widths",
		code: `<InlineGrid columns="oneHalf" gap="400">
  <div>Half</div>
  <div>Half</div>
</InlineGrid>
<InlineGrid columns="oneThird" gap="400">
  <div>Third</div>
  <div>Third</div>
  <div>Third</div>
</InlineGrid>`,
	},
	{
		key: "align-items",
		code: `<InlineGrid columns={3} gap="400" alignItems="center">
  <div style={{ height: 40 }}>Short</div>
  <div style={{ height: 80 }}>Tall</div>
  <div style={{ height: 60 }}>Medium</div>
</InlineGrid>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/inline-grid")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: InlineGridPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const inlineGridProps: DocProp[] = [
	{
		name: "columns",
		type: 'number | string | "oneThird" | "oneHalf" | "twoThirds" | (number | string)[]',
		default: "2",
		description:
			"The number of columns to display. Accepts a number, a string, or an array of column values.",
	},
	{
		name: "gap",
		type: '"0" | "050" | "100" | ... | "1600"',
		default: '"400"',
		description: "The spacing between children.",
	},
	{
		name: "alignItems",
		type: '"start" | "center" | "end"',
		default: '"start"',
		description:
			"Vertical alignment of children. If not set, inline elements will stretch to the height of the parent.",
	},
]

function Placeholder({ height = "80px", label }: { height?: string; label?: string }) {
	return (
		<div
			className="flex items-center justify-center rounded-lg bg-brand/10 text-sm font-medium"
			style={{ height }}
		>
			{label || height}
		</div>
	)
}

function InlineGridPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Inline Grid"
			subtitle="Use to lay out children horizontally with equal gap between columns. Based on CSS Grid."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Gap"
					description="Use the gap prop to set the amount of space between columns."
					code={examples[0].code}
					highlightedCode={html("gap")}
				>
					<Card>
						<CardContent>
							<InlineGrid gap="400" columns={3}>
								<Placeholder label="1" />
								<Placeholder label="2" />
								<Placeholder label="3" />
							</InlineGrid>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Number of Columns"
					description="Set the number of columns using a number value."
					code={examples[1].code}
					highlightedCode={html("columns")}
				>
					<div className="space-y-6">
						<div>
							<p className="mb-2 text-xs font-medium">columns={2}</p>
							<Card>
								<CardContent>
									<InlineGrid columns={2} gap="400">
										<Placeholder label="1" />
										<Placeholder label="2" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">columns={3}</p>
							<Card>
								<CardContent>
									<InlineGrid columns={3} gap="400">
										<Placeholder label="1" />
										<Placeholder label="2" />
										<Placeholder label="3" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">columns={4}</p>
							<Card>
								<CardContent>
									<InlineGrid columns={4} gap="400">
										<Placeholder label="1" />
										<Placeholder label="2" />
										<Placeholder label="3" />
										<Placeholder label="4" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Different Gap Sizes"
					description="Compare different gap sizes."
					code={examples[2].code}
					highlightedCode={html("gap-sizes")}
				>
					<div className="space-y-6">
						<div>
							<p className="mb-2 text-xs font-medium">gap="100"</p>
							<Card>
								<CardContent>
									<InlineGrid gap="100" columns={3}>
										<Placeholder label="1" />
										<Placeholder label="2" />
										<Placeholder label="3" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">gap="400"</p>
							<Card>
								<CardContent>
									<InlineGrid gap="400" columns={3}>
										<Placeholder label="1" />
										<Placeholder label="2" />
										<Placeholder label="3" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">gap="800"</p>
							<Card>
								<CardContent>
									<InlineGrid gap="800" columns={3}>
										<Placeholder label="1" />
										<Placeholder label="2" />
										<Placeholder label="3" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Named Column Widths"
					description='Use named widths like "oneThird", "oneHalf", or "twoThirds".'
					code={examples[3].code}
					highlightedCode={html("named-widths")}
				>
					<div className="space-y-6">
						<div>
							<p className="mb-2 text-xs font-medium">columns="oneHalf"</p>
							<Card>
								<CardContent>
									<InlineGrid columns="oneHalf" gap="400">
										<Placeholder label="Half" />
										<Placeholder label="Half" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">columns="oneThird"</p>
							<Card>
								<CardContent>
									<InlineGrid columns="oneThird" gap="400">
										<Placeholder label="1/3" />
										<Placeholder label="1/3" />
										<Placeholder label="1/3" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">columns="twoThirds"</p>
							<Card>
								<CardContent>
									<InlineGrid columns="twoThirds" gap="400">
										<Placeholder label="2/3" />
										<Placeholder label="1/3" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Align Items"
					description="Control vertical alignment of children."
					code={examples[4].code}
					highlightedCode={html("align-items")}
				>
					<div className="space-y-6">
						<div>
							<p className="mb-2 text-xs font-medium">alignItems="start"</p>
							<Card>
								<CardContent>
									<InlineGrid columns={3} gap="400" alignItems="start">
										<Placeholder height="40px" />
										<Placeholder height="80px" />
										<Placeholder height="60px" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">alignItems="center"</p>
							<Card>
								<CardContent>
									<InlineGrid columns={3} gap="400" alignItems="center">
										<Placeholder height="40px" />
										<Placeholder height="80px" />
										<Placeholder height="60px" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">alignItems="end"</p>
							<Card>
								<CardContent>
									<InlineGrid columns={3} gap="400" alignItems="end">
										<Placeholder height="40px" />
										<Placeholder height="80px" />
										<Placeholder height="60px" />
									</InlineGrid>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={inlineGridProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Box",
							href: "/docs/components/layout/box",
							description: "For more control over padding and widths.",
						},
						{
							title: "Inline Stack",
							href: "/docs/components/layout/inline-stack",
							description: "Lay out a set of smaller components horizontally.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
