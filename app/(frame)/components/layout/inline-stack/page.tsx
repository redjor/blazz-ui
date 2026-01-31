"use client"

import { Page } from "@/components/ui/page"
import { InlineStack } from "@/components/ui/inline-stack"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const inlineStackProps: PropDefinition[] = [
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
			className="flex h-10 items-center justify-center rounded-md bg-primary/10 px-4 text-sm"
			style={{ width }}
		>
			{width}
		</div>
	)
}

export default function InlineStackPage() {
	return (
		<Page
			title="Inline Stack"
			subtitle="Use to display children horizontally in a row. Based on CSS Flexbox."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Gap"
						description="Control the horizontal space between children using the gap prop."
						code={`<InlineStack gap="400">
  <Button>Action 1</Button>
  <Button variant="outline">Action 2</Button>
</InlineStack>`}
					>
						<Card>
							<CardContent>
								<InlineStack gap="400">
									<Button>Action 1</Button>
									<Button variant="outline">Action 2</Button>
								</InlineStack>
							</CardContent>
						</Card>
					</ComponentExample>

					<ComponentExample
						title="Align"
						description="Control horizontal alignment of children."
						code={`<InlineStack align="space-between">
  <Button>Left</Button>
  <Button variant="outline">Right</Button>
</InlineStack>`}
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
					</ComponentExample>

					<ComponentExample
						title="Block Align"
						description="Control vertical alignment of children with different heights."
						code={`<InlineStack blockAlign="center" gap="200">
  <div style={{ height: 40 }}>Short</div>
  <div style={{ height: 80 }}>Tall</div>
</InlineStack>`}
					>
						<div className="grid grid-cols-3 gap-4">
							<div>
								<p className="mb-2 text-xs font-medium">blockAlign="start"</p>
								<Card>
									<CardContent>
										<InlineStack blockAlign="start" gap="200">
											<div className="flex h-10 w-16 items-center justify-center rounded bg-primary/10 text-xs">
												40px
											</div>
											<div className="flex h-20 w-16 items-center justify-center rounded bg-primary/10 text-xs">
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
											<div className="flex h-10 w-16 items-center justify-center rounded bg-primary/10 text-xs">
												40px
											</div>
											<div className="flex h-20 w-16 items-center justify-center rounded bg-primary/10 text-xs">
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
											<div className="flex h-10 w-16 items-center justify-center rounded bg-primary/10 text-xs">
												40px
											</div>
											<div className="flex h-20 w-16 items-center justify-center rounded bg-primary/10 text-xs">
												80px
											</div>
										</InlineStack>
									</CardContent>
								</Card>
							</div>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Non-wrapping"
						description="Prevent items from wrapping to the next line using wrap={false}."
						code={`<InlineStack wrap={false} gap="200">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</InlineStack>`}
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
					</ComponentExample>

					<ComponentExample
						title="Direction"
						description="Reverse the direction of items using direction='row-reverse'."
						code={`<InlineStack direction="row-reverse" gap="200">
  <Badge>First</Badge>
  <Badge>Second</Badge>
  <Badge>Third</Badge>
</InlineStack>`}
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
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={inlineStackProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>To create the large-scale structure of pages, use the InlineGrid component</li>
						<li>To display elements vertically, use the BlockStack component</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
