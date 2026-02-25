import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
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
export default function InlineGridPage() {
	return (
		<DocPage
			title="Inline Grid"
			subtitle="Use to lay out children horizontally with equal gap between columns. Based on CSS Grid."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
					<DocExample
						title="Gap"
						description="Use the gap prop to set the amount of space between columns."
						code={`<InlineGrid gap="400" columns={3}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</InlineGrid>`}
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
					</DocExample>
					<DocExample
						title="Number of Columns"
						description="Set the number of columns using a number value."
						code={`<InlineGrid columns={2} gap="400">...</InlineGrid>
<InlineGrid columns={3} gap="400">...</InlineGrid>
<InlineGrid columns={4} gap="400">...</InlineGrid>`}
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
					</DocExample>
				<DocExample
					title="Different Gap Sizes"
					description="Compare different gap sizes."
					code={`<InlineGrid gap="100" columns={3}>...</InlineGrid>
<InlineGrid gap="400" columns={3}>...</InlineGrid>
<InlineGrid gap="800" columns={3}>...</InlineGrid>`}
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
				</DocExample>
				<DocExample
					title="Named Column Widths"
					description='Use named widths like "oneThird", "oneHalf", or "twoThirds".'
					code={`<InlineGrid columns="oneHalf" gap="400">
  <div>Half</div>
  <div>Half</div>
</InlineGrid>
<InlineGrid columns="oneThird" gap="400">
  <div>Third</div>
  <div>Third</div>
  <div>Third</div>
</InlineGrid>`}
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
				</DocExample>
				<DocExample
					title="Align Items"
					description="Control vertical alignment of children."
					code={`<InlineGrid columns={3} gap="400" alignItems="center">
  <div style={{ height: 40 }}>Short</div>
  <div style={{ height: 80 }}>Tall</div>
  <div style={{ height: 60 }}>Medium</div>
</InlineGrid>`}
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
				</DocExample>
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
