"use client"

import { Page } from "@/components/ui/page"
import { Grid } from "@/components/ui/grid"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const gridProps: PropDefinition[] = [
	{
		name: "columns",
		type: '{ xs?: number; sm?: number; md?: number; lg?: number; xl?: number }',
		default: '{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12 }',
		description: "Number of columns at each breakpoint.",
	},
	{
		name: "gap",
		type: '{ xs?: string; sm?: string; md?: string; lg?: string; xl?: string }',
		default: '"4"',
		description: "Gap between grid cells at each breakpoint.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Grid.Cell components to display in the grid.",
	},
]

const gridCellProps: PropDefinition[] = [
	{
		name: "columnSpan",
		type: '{ xs?: number; sm?: number; md?: number; lg?: number; xl?: number }',
		default: '{ xs: 6 }',
		description: "Number of columns to span at each breakpoint.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "Content to display in the cell.",
	},
]

function Placeholder({ label }: { label: string }) {
	return (
		<div className="flex h-24 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium">
			{label}
		</div>
	)
}

export default function GridPage() {
	return (
		<Page title="Grid" subtitle="Create complex layouts based on CSS Grid.">
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Two Column"
						description="A two column layout that wraps at a breakpoint and aligns to a twelve column grid."
						code={`<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
    <Card>Column 1</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
    <Card>Column 2</Card>
  </Grid.Cell>
</Grid>`}
					>
						<Grid>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
								<Card>
									<CardHeader>
										<CardTitle>Sales</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											View a summary of your store's sales
										</p>
									</CardContent>
								</Card>
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
								<Card>
									<CardHeader>
										<CardTitle>Orders</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											View a summary of your store's orders
										</p>
									</CardContent>
								</Card>
							</Grid.Cell>
						</Grid>
					</ComponentExample>

					<ComponentExample
						title="Two-thirds and One-third"
						description="An asymmetric layout with a main content area and a sidebar."
						code={`<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8 }}>
    <Card>Main Content (2/3)</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Sidebar (1/3)</Card>
  </Grid.Cell>
</Grid>`}
					>
						<Grid>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8 }}>
								<Placeholder label="Main Content (2/3)" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
								<Placeholder label="Sidebar (1/3)" />
							</Grid.Cell>
						</Grid>
					</ComponentExample>

					<ComponentExample
						title="Three Column"
						description="A three column layout for equal-width content sections."
						code={`<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Column 1</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Column 2</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Column 3</Card>
  </Grid.Cell>
</Grid>`}
					>
						<Grid>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
								<Placeholder label="Column 1" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
								<Placeholder label="Column 2" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
								<Placeholder label="Column 3" />
							</Grid.Cell>
						</Grid>
					</ComponentExample>

					<ComponentExample
						title="Four Column"
						description="A four column layout for dashboard-style content."
						code={`<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
    <Card>Stat 1</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
    <Card>Stat 2</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
    <Card>Stat 3</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
    <Card>Stat 4</Card>
  </Grid.Cell>
</Grid>`}
					>
						<Grid>
							<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
								<Placeholder label="Stat 1" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
								<Placeholder label="Stat 2" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
								<Placeholder label="Stat 3" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3 }}>
								<Placeholder label="Stat 4" />
							</Grid.Cell>
						</Grid>
					</ComponentExample>

					<ComponentExample
						title="Mixed Layout"
						description="Combine different column spans for complex layouts."
						code={`<Grid>
  <Grid.Cell columnSpan={{ xs: 6, md: 12, lg: 12 }}>
    <Card>Full Width Header</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 8, lg: 8 }}>
    <Card>Main Content</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 4, lg: 4 }}>
    <Card>Sidebar</Card>
  </Grid.Cell>
</Grid>`}
					>
						<Grid>
							<Grid.Cell columnSpan={{ xs: 6, md: 12, lg: 12 }}>
								<Placeholder label="Full Width Header" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, md: 8, lg: 8 }}>
								<Placeholder label="Main Content" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 6, md: 4, lg: 4 }}>
								<Placeholder label="Sidebar" />
							</Grid.Cell>
						</Grid>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Grid Props</h2>
					<PropsTable props={gridProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Grid.Cell Props</h2>
					<PropsTable props={gridCellProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>To lay out a set of smaller components in a row, use the InlineStack component</li>
						<li>To lay out form fields, use the FormLayout component</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
