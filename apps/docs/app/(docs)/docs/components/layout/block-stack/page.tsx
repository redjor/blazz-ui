import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocExample } from "@/components/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const blockStackProps: DocProp[] = [
	{
		name: "as",
		type: '"div" | "span" | "ul" | "ol" | "li" | "fieldset"',
		default: '"div"',
		description: "HTML Element type to render.",
	},
	{
		name: "gap",
		type: '"0" | "050" | "100" | ... | "1600"',
		default: '"0"',
		description: "The spacing between children.",
	},
	{
		name: "align",
		type: '"start" | "center" | "end" | "space-around" | "space-between" | "space-evenly"',
		default: '"start"',
		description: "Vertical alignment of children.",
	},
	{
		name: "inlineAlign",
		type: '"start" | "center" | "end" | "baseline" | "stretch"',
		default: '"stretch"',
		description: "Horizontal alignment of children.",
	},
	{
		name: "reverseOrder",
		type: "boolean",
		default: "false",
		description: "Reverse the render order of child items.",
	},
]

function Placeholder({ label }: { label: string }) {
	return (
		<div className="flex h-12 items-center justify-center rounded-md bg-brand/10 px-4 text-sm">
			{label}
		</div>
	)
}

export default function BlockStackPage() {
	return (
		<DocPage
			title="Block Stack"
			subtitle="Use to display children vertically with full width by default. Based on CSS Flexbox."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Gap"
					description="Control the vertical space between children using the gap prop."
					code={`<BlockStack gap="400">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</BlockStack>`}
				>
					<Card>
						<CardContent>
							<BlockStack gap="400">
								<Placeholder label="Item 1" />
								<Placeholder label="Item 2" />
								<Placeholder label="Item 3" />
							</BlockStack>
						</CardContent>
					</Card>
				</DocExample>

				<DocExample
					title="Different Gap Sizes"
					description="Compare different gap sizes side by side."
					code={`<div className="grid grid-cols-3 gap-8">
  <BlockStack gap="100">...</BlockStack>
  <BlockStack gap="400">...</BlockStack>
  <BlockStack gap="800">...</BlockStack>
</div>`}
				>
					<div className="grid grid-cols-3 gap-8">
						<div>
							<p className="mb-2 text-xs font-medium">gap="100"</p>
							<BlockStack gap="100">
								<Placeholder label="1" />
								<Placeholder label="2" />
								<Placeholder label="3" />
							</BlockStack>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">gap="400"</p>
							<BlockStack gap="400">
								<Placeholder label="1" />
								<Placeholder label="2" />
								<Placeholder label="3" />
							</BlockStack>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">gap="800"</p>
							<BlockStack gap="800">
								<Placeholder label="1" />
								<Placeholder label="2" />
								<Placeholder label="3" />
							</BlockStack>
						</div>
					</div>
				</DocExample>

				<DocExample
					title="Align"
					description="Control the vertical alignment of children."
					code={`<BlockStack align="center" className="h-64">
  <div>Centered vertically</div>
</BlockStack>`}
				>
					<div className="grid grid-cols-3 gap-8">
						<div>
							<p className="mb-2 text-xs font-medium">align="start"</p>
							<Card className="h-48">
								<CardContent className="h-full">
									<BlockStack align="start" gap="200" className="h-full">
										<Placeholder label="1" />
										<Placeholder label="2" />
									</BlockStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">align="center"</p>
							<Card className="h-48">
								<CardContent className="h-full">
									<BlockStack align="center" gap="200" className="h-full">
										<Placeholder label="1" />
										<Placeholder label="2" />
									</BlockStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">align="end"</p>
							<Card className="h-48">
								<CardContent className="h-full">
									<BlockStack align="end" gap="200" className="h-full">
										<Placeholder label="1" />
										<Placeholder label="2" />
									</BlockStack>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExample>

				<DocExample
					title="Inline Align"
					description="Control the horizontal alignment of children."
					code={`<BlockStack inlineAlign="center" gap="200">
  <div className="w-24">Narrow</div>
  <div className="w-32">Medium</div>
</BlockStack>`}
				>
					<div className="grid grid-cols-3 gap-8">
						<div>
							<p className="mb-2 text-xs font-medium">inlineAlign="start"</p>
							<Card>
								<CardContent>
									<BlockStack inlineAlign="start" gap="200">
										<div className="h-8 w-24 rounded bg-brand/10" />
										<div className="h-8 w-32 rounded bg-brand/10" />
										<div className="h-8 w-20 rounded bg-brand/10" />
									</BlockStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">inlineAlign="center"</p>
							<Card>
								<CardContent>
									<BlockStack inlineAlign="center" gap="200">
										<div className="h-8 w-24 rounded bg-brand/10" />
										<div className="h-8 w-32 rounded bg-brand/10" />
										<div className="h-8 w-20 rounded bg-brand/10" />
									</BlockStack>
								</CardContent>
							</Card>
						</div>
						<div>
							<p className="mb-2 text-xs font-medium">inlineAlign="end"</p>
							<Card>
								<CardContent>
									<BlockStack inlineAlign="end" gap="200">
										<div className="h-8 w-24 rounded bg-brand/10" />
										<div className="h-8 w-32 rounded bg-brand/10" />
										<div className="h-8 w-20 rounded bg-brand/10" />
									</BlockStack>
								</CardContent>
							</Card>
						</div>
					</div>
				</DocExample>

				<DocExample
					title="Reverse Order"
					description="Reverse the order of children."
					code={`<BlockStack reverseOrder gap="200">
  <div>First (will appear last)</div>
  <div>Second</div>
  <div>Third (will appear first)</div>
</BlockStack>`}
				>
					<Card>
						<CardContent>
							<BlockStack reverseOrder gap="200">
								<Placeholder label="First (appears last)" />
								<Placeholder label="Second" />
								<Placeholder label="Third (appears first)" />
							</BlockStack>
						</CardContent>
					</Card>
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={blockStackProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Inline Stack",
							href: "/docs/components/layout/inline-stack",
							description: "Display elements horizontally in a row.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
