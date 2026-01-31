"use client"

import { Page } from "@/components/ui/page"
import { InlineGrid } from "@/components/ui/inline-grid"
import { Card, CardContent } from "@/components/ui/card"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const inlineGridProps: PropDefinition[] = [
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
			className="flex items-center justify-center rounded-lg bg-primary/10 text-sm font-medium"
			style={{ height }}
		>
			{label || height}
		</div>
	)
}

export default function InlineGridPage() {
	return (
		<Page
			title="Inline Grid"
			subtitle="Use to lay out children horizontally with equal gap between columns. Based on CSS Grid."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={inlineGridProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For more control over padding and widths, use the Box component</li>
						<li>
							To lay out a set of smaller components horizontally, use the InlineStack
							component
						</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
