import { createFileRoute } from "@tanstack/react-router"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "gap",
		code: `<InlineStack gap="400">
  <Button>Action 1</Button>
  <Button variant="outline">Action 2</Button>
</InlineStack>`,
	},
	{
		key: "non-wrapping",
		code: `<InlineStack wrap={false} gap="200">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</InlineStack>`,
	},
	{
		key: "align",
		code: `<InlineStack align="space-between">
  <Button>Left</Button>
  <Button variant="outline">Right</Button>
</InlineStack>`,
	},
	{
		key: "block-align",
		code: `<InlineStack blockAlign="center" gap="200">
  <div style={{ height: 40 }}>Short</div>
  <div style={{ height: 80 }}>Tall</div>
</InlineStack>`,
	},
	{
		key: "direction",
		code: `<InlineStack direction="row-reverse" gap="200">
  <Badge>First</Badge>
  <Badge>Second</Badge>
  <Badge>Third</Badge>
</InlineStack>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/layout/inline-stack")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: InlineStackPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const inlineStackProps: DocProp[] = [
	{
		name: "as",
		type: '"div" | "span" | "li" | "ol" | "ul"',
		default: '"div"',
		description: "HTML Element type to render.",
	},
	{
		name: "gap",
		type: '"0" | "050" | "100" | ... | "1600"',
		default: '"0"',
		description: "The spacing between elements.",
	},
	{
		name: "align",
		type: '"start" | "center" | "end" | "space-around" | "space-between" | "space-evenly"',
		default: '"start"',
		description: "Horizontal alignment of children.",
	},
	{
		name: "blockAlign",
		type: '"start" | "center" | "end" | "baseline" | "stretch"',
		default: '"center"',
		description: "Vertical alignment of children.",
	},
	{
		name: "direction",
		type: '"row" | "row-reverse"',
		default: '"row"',
		description: "Horizontal direction in which children are laid out.",
	},
	{
		name: "wrap",
		type: "boolean",
		default: "true",
		description: "Wrap stack elements to additional rows as needed on small screens.",
	},
]

function Placeholder({ width = "auto" }: { width?: string }) {
	return (
		<div
			className="flex h-10 items-center justify-center rounded-md bg-brand/10 px-4 text-sm"
			style={{ width }}
		>
			{width}
		</div>
	)
}

function InlineStackPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Inline Stack"
			subtitle="Use to display children horizontally in a row. Based on CSS Flexbox."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Gap"
					description="Control the horizontal space between children using the gap prop."
					code={examples[0].code}
					highlightedCode={html("gap")}
				>
					<Card>
						<CardContent>
							<InlineStack gap="400">
								<Button>Action 1</Button>
								<Button variant="outline">Action 2</Button>
							</InlineStack>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Non-wrapping"
					description="Prevent items from wrapping to the next line using wrap={false}."
					code={examples[1].code}
					highlightedCode={html("non-wrapping")}
				>
					<Card>
						<CardContent className="overflow-x-auto">
							<InlineStack wrap={false} gap="200">
								<Placeholder width="100px" />
								<Placeholder width="100px" />
								<Placeholder width="100px" />
								<Placeholder width="100px" />
								<Placeholder width="100px" />
							</InlineStack>
						</CardContent>
					</Card>
				</DocExampleClient>

				<DocExampleClient
					title="Align"
					description="Control horizontal alignment of children."
					code={examples[2].code}
					highlightedCode={html("align")}
				>
					<div className="space-y-4">
						<div>
							<p className="mb-2 text-xs font-medium">align="start"</p>
							<Card>
								<CardContent>
									<InlineStack align="start" gap="200">
										<Badge>Tag 1</Badge>
										<Badge>Tag 2</Badge>
										<Badge>Tag 3</Badge>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">align="center"</p>
							<Card>
								<CardContent>
									<InlineStack align="center" gap="200">
										<Badge>Tag 1</Badge>
										<Badge>Tag 2</Badge>
										<Badge>Tag 3</Badge>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">align="end"</p>
							<Card>
								<CardContent>
									<InlineStack align="end" gap="200">
										<Badge>Tag 1</Badge>
										<Badge>Tag 2</Badge>
										<Badge>Tag 3</Badge>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">align="space-between"</p>
							<Card>
								<CardContent>
									<InlineStack align="space-between" gap="200">
										<Badge>Tag 1</Badge>
										<Badge>Tag 2</Badge>
										<Badge>Tag 3</Badge>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Block Align"
					description="Control vertical alignment of children with different heights."
					code={examples[3].code}
					highlightedCode={html("block-align")}
				>
					<div className="grid grid-cols-3 gap-4">
						<div>
							<p className="mb-2 text-xs font-medium">blockAlign="start"</p>
							<Card>
								<CardContent>
									<InlineStack blockAlign="start" gap="200">
										<div className="flex h-10 w-16 items-center justify-center rounded bg-brand/10 text-xs">
											40px
										</div>
										<div className="flex h-20 w-16 items-center justify-center rounded bg-brand/10 text-xs">
											80px
										</div>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">blockAlign="center"</p>
							<Card>
								<CardContent>
									<InlineStack blockAlign="center" gap="200">
										<div className="flex h-10 w-16 items-center justify-center rounded bg-brand/10 text-xs">
											40px
										</div>
										<div className="flex h-20 w-16 items-center justify-center rounded bg-brand/10 text-xs">
											80px
										</div>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">blockAlign="end"</p>
							<Card>
								<CardContent>
									<InlineStack blockAlign="end" gap="200">
										<div className="flex h-10 w-16 items-center justify-center rounded bg-brand/10 text-xs">
											40px
										</div>
										<div className="flex h-20 w-16 items-center justify-center rounded bg-brand/10 text-xs">
											80px
										</div>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Direction"
					description="Reverse the direction of items using direction='row-reverse'."
					code={examples[4].code}
					highlightedCode={html("direction")}
				>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="mb-2 text-xs font-medium">direction="row"</p>
							<Card>
								<CardContent>
									<InlineStack direction="row" gap="200">
										<Badge>First</Badge>
										<Badge>Second</Badge>
										<Badge>Third</Badge>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">direction="row-reverse"</p>
							<Card>
								<CardContent>
									<InlineStack direction="row-reverse" gap="200">
										<Badge>First</Badge>
										<Badge>Second</Badge>
										<Badge>Third</Badge>
									</InlineStack>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={inlineStackProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Inline Grid",
							href: "/docs/components/layout/inline-grid",
							description: "Create the large-scale structure of pages with CSS Grid.",
						},
						{
							title: "Grid",
							href: "/docs/components/layout/grid",
							description: "Create complex responsive layouts based on CSS Grid.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
