import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { Grid } from "@blazz/ui/components/ui/grid"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "two-column",
		code: `<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
    <Card>Column 1</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
    <Card>Column 2</Card>
  </Grid.Cell>
</Grid>`,
	},
	{
		key: "two-thirds",
		code: `<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8 }}>
    <Card>Main Content (2/3)</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Sidebar (1/3)</Card>
  </Grid.Cell>
</Grid>`,
	},
	{
		key: "three-column",
		code: `<Grid>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Column 1</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Column 2</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
    <Card>Column 3</Card>
  </Grid.Cell>
</Grid>`,
	},
	{
		key: "four-column",
		code: `<Grid>
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
</Grid>`,
	},
	{
		key: "mixed",
		code: `<Grid>
  <Grid.Cell columnSpan={{ xs: 6, md: 12, lg: 12 }}>
    <Card>Full Width Header</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 8, lg: 8 }}>
    <Card>Main Content</Card>
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 6, md: 4, lg: 4 }}>
    <Card>Sidebar</Card>
  </Grid.Cell>
</Grid>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "grid-props", title: "Grid Props" },
	{ id: "grid-cell-props", title: "Grid.Cell Props" },
	{ id: "related", title: "Related" },
]

const gridProps: DocProp[] = [
	{
		name: "columns",
		type: "{ xs?: number; sm?: number; md?: number; lg?: number; xl?: number }",
		default: "{ xs: 6, sm: 6, md: 12, lg: 12, xl: 12 }",
		description: "Number of columns at each breakpoint.",
	},
	{
		name: "gap",
		type: "{ xs?: string; sm?: string; md?: string; lg?: string; xl?: string }",
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
		type: "{ xs?: number; sm?: number; md?: number; lg?: number; xl?: number }",
		default: "{ xs: 6 }",
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

export default async function GridPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Grid" subtitle="Create complex layouts based on CSS Grid." toc={toc}>
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Two Column"
					description="A two column layout that wraps at a breakpoint and aligns to a twelve column grid."
					code={examples[0].code}
					highlightedCode={html("two-column")}
				>
					<Grid>
						<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
							<Card>
								<CardHeader>
									<CardTitle>Sales</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-fg-muted">View a summary of your store's sales</p>
								</CardContent>
							</Card>
						</Grid.Cell>
						<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
							<Card>
								<CardHeader>
									<CardTitle>Orders</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-fg-muted">View a summary of your store's orders</p>
								</CardContent>
							</Card>
						</Grid.Cell>
					</Grid>
				</DocExampleClient>

				<DocExampleClient
					title="Two-thirds and One-third"
					description="An asymmetric layout with a main content area and a sidebar."
					code={examples[1].code}
					highlightedCode={html("two-thirds")}
				>
					<Grid>
						<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 8, lg: 8 }}>
							<Placeholder label="Main Content (2/3)" />
						</Grid.Cell>
						<Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4 }}>
							<Placeholder label="Sidebar (1/3)" />
						</Grid.Cell>
					</Grid>
				</DocExampleClient>

				<DocExampleClient
					title="Three Column"
					description="A three column layout for equal-width content sections."
					code={examples[2].code}
					highlightedCode={html("three-column")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Four Column"
					description="A four column layout for dashboard-style content."
					code={examples[3].code}
					highlightedCode={html("four-column")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Mixed Layout"
					description="Combine different column spans for complex layouts."
					code={examples[4].code}
					highlightedCode={html("mixed")}
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
				</DocExampleClient>
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
