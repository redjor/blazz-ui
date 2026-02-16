import { Grid } from "@/components/ui/grid"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "grid-props", title: "Grid Props" },
	{ id: "grid-cell-props", title: "Grid.Cell Props" },
	{ id: "related", title: "Related" },
]
const gridProps: DocProp[] = [
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
const gridCellProps: DocProp[] = [
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
		<div className="flex h-24 items-center justify-center rounded-lg bg-brand/10 text-sm font-medium">
			{label}
		</div>
	)
}
export default function GridPage() {
	return (
		<DocPage
			title="Grid"
			subtitle="Create complex layouts based on CSS Grid."
			toc={toc}
		>
			<DocSection id="examples" title="Examples">
					<DocExample
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
										<p className="text-sm text-fg-muted">
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
										<p className="text-sm text-fg-muted">
											View a summary of your store's orders
										</p>
									</CardContent>
								</Card>
							</Grid.Cell>
						</Grid>
					</DocExample>
					<DocExample
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
					</DocExample>
					<DocExample
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
					</DocExample>
					<DocExample
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
					</DocExample>
				<DocExample
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
				</DocExample>
			</DocSection>
			<DocSection id="grid-props" title="Grid Props">
				<DocPropsTable props={gridProps} />
			</DocSection>
			<DocSection id="grid-cell-props" title="Grid.Cell Props">
				<DocPropsTable props={gridCellProps} />
			</DocSection>
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Inline Stack",
							href: "/docs/components/layout/inline-stack",
							description: "Lay out a set of smaller components in a row.",
						},
						{
							title: "Inline Grid",
							href: "/docs/components/layout/inline-grid",
							description: "Lay out children horizontally with equal gap between columns.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
