"use client"

import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"
import { Grid } from "@blazz/ui/components/ui/grid"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"

<BudgetCard
  name="API Gateway v2"
  revenue={8400}
  daysConsumed={9.8}
  percent={9}
  budgetLabel="0.9 / 10j"
/>`,
	},
	{
		key: "auto-color",
		code: `import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"

// autoColor (default true): brand < 75%, caution 75-90%, negative > 90%
<BudgetCard name="Dashboard Analytics" revenue={12550} daysConsumed={17.9} percent={45} budgetLabel="budget \u20ac28 000" />
<BudgetCard name="ML Platform" revenue={8550} daysConsumed={10.7} percent={82} budgetLabel="budget \u20ac10 500" />
<BudgetCard name="Legacy Migration" revenue={4200} daysConsumed={6} percent={95} budgetLabel="budget \u20ac4 400" />`,
	},
	{
		key: "grid",
		code: `import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"
import { Grid } from "@blazz/ui/components/ui/grid"

<Grid>
  <Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 4 }}>
    <BudgetCard name="Dashboard Analytics" revenue={12550} daysConsumed={17.9} percent={45} budgetLabel="budget \u20ac28 000" />
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 4 }}>
    <BudgetCard name="API Gateway v2" revenue={8400} daysConsumed={9.8} percent={9} budgetLabel="0.9 / 10j" />
  </Grid.Cell>
  <Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 4 }}>
    <BudgetCard name="Site Vitrine" revenue={4773} daysConsumed={7.9} percent={66} budgetLabel="budget \u20ac7 200" />
  </Grid.Cell>
</Grid>`,
	},
	{
		key: "loading",
		code: `import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"

<BudgetCard name="" revenue={0} daysConsumed={0} percent={0} loading />`,
	},
	{
		key: "custom-format",
		code: `import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"

const formatUSD = (n: number) => \`$\${n.toLocaleString("en-US")}\`

<BudgetCard
  name="US Project"
  revenue={15200}
  daysConsumed={12}
  percent={72}
  budgetLabel="budget $21,000"
  formatCurrency={formatUSD}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const budgetCardProps: DocProp[] = [
	{
		name: "name",
		type: "string",
		required: true,
		description: "Project or item name displayed at the top of the card.",
	},
	{
		name: "revenue",
		type: "number",
		required: true,
		description: "Revenue amount (raw number). Formatted internally with formatCurrency.",
	},
	{
		name: "daysConsumed",
		type: "number",
		required: true,
		description: "Number of days consumed, displayed on the right side.",
	},
	{
		name: "percent",
		type: "number",
		required: true,
		description: "Budget consumption percentage (0-100+). Drives the segmented bar fill.",
	},
	{
		name: "budgetLabel",
		type: "string",
		description: 'Label below the bar (e.g. "0.9 / 10j" for TMA contracts, "budget \u20ac1 200" for forfaits). Defaults to non-breaking space if omitted.',
	},
	{
		name: "autoColor",
		type: "boolean",
		default: "true",
		description: "Auto-switch bar color based on percent: brand below 75%, caution 75-90%, negative above 90%.",
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		description: "Show skeleton loading state.",
	},
	{
		name: "formatCurrency",
		type: "(amount: number) => string",
		default: "Intl fr-FR EUR",
		description: "Custom currency formatter. Defaults to French EUR formatting (\u20acX XXX).",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root Card element.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function BudgetCardHeroDemo() {
	return (
		<div className="w-full max-w-2xl">
			<Grid>
				<Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
					<BudgetCard name="Dashboard Analytics" revenue={12550} daysConsumed={17.9} percent={45} budgetLabel="budget \u20ac28 000" />
				</Grid.Cell>
				<Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
					<BudgetCard name="API Gateway v2" revenue={8400} daysConsumed={0.9} percent={9} budgetLabel="0.9 / 10j" />
				</Grid.Cell>
				<Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
					<BudgetCard name="ML Platform" revenue={8550} daysConsumed={10.7} percent={82} budgetLabel="budget \u20ac10 500" />
				</Grid.Cell>
			</Grid>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BudgetCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	const formatUSD = (n: number) => `$${n.toLocaleString("en-US")}`

	return (
		<DocPage
			title="Budget Card"
			subtitle="A compact card displaying project name, revenue, days consumed, and a segmented progress bar with budget label. Ideal for dashboard grids showing project budget consumption."
			toc={toc}
		>
			<DocHero>
				<BudgetCardHeroDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic" description="A single budget card with TMA-style label showing days consumed vs allocated." code={examples[0].code} highlightedCode={html("basic")}>
					<div className="w-full max-w-xs">
						<BudgetCard name="API Gateway v2" revenue={8400} daysConsumed={9.8} percent={9} budgetLabel="0.9 / 10j" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Auto Color Thresholds"
					description="With autoColor (default), the bar color switches automatically: brand below 75%, caution between 75-90%, negative above 90%."
					code={examples[1].code}
					highlightedCode={html("auto-color")}
				>
					<div className="w-full max-w-2xl">
						<Grid>
							<Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
								<BudgetCard name="Dashboard Analytics" revenue={12550} daysConsumed={17.9} percent={45} budgetLabel="budget \u20ac28 000" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
								<BudgetCard name="ML Platform" revenue={8550} daysConsumed={10.7} percent={82} budgetLabel="budget \u20ac10 500" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 12, md: 4 }}>
								<BudgetCard name="Legacy Migration" revenue={4200} daysConsumed={6} percent={95} budgetLabel="budget \u20ac4 400" />
							</Grid.Cell>
						</Grid>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Dashboard Grid"
					description="Compose BudgetCard with Grid for a responsive project overview. Wrap with Link for clickable navigation."
					code={examples[2].code}
					highlightedCode={html("grid")}
				>
					<div className="w-full max-w-2xl">
						<Grid>
							<Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 4 }}>
								<BudgetCard name="Dashboard Analytics" revenue={12550} daysConsumed={17.9} percent={45} budgetLabel="budget \u20ac28 000" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 4 }}>
								<BudgetCard name="API Gateway v2" revenue={8400} daysConsumed={9.8} percent={9} budgetLabel="0.9 / 10j" />
							</Grid.Cell>
							<Grid.Cell columnSpan={{ xs: 12, sm: 6, md: 4 }}>
								<BudgetCard name="Site Vitrine" revenue={4773} daysConsumed={7.9} percent={66} budgetLabel="budget \u20ac7 200" />
							</Grid.Cell>
						</Grid>
					</div>
				</DocExampleClient>

				<DocExampleClient title="Loading State" description="Pass loading to display a skeleton placeholder while data is being fetched." code={examples[3].code} highlightedCode={html("loading")}>
					<div className="w-full max-w-xs">
						<BudgetCard name="" revenue={0} daysConsumed={0} percent={0} loading />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Currency"
					description="Override the default EUR formatter with a custom formatCurrency function."
					code={examples[4].code}
					highlightedCode={html("custom-format")}
				>
					<div className="w-full max-w-xs">
						<BudgetCard name="US Project" revenue={15200} daysConsumed={12} percent={72} budgetLabel="budget $21,000" formatCurrency={formatUSD} />
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={budgetCardProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Segmented Progress",
							href: "/docs/blocks/segmented-progress",
							description: "Standalone responsive dot-based progress bar used inside BudgetCard.",
						},
						{
							title: "Stats Grid",
							href: "/docs/blocks/stats-grid",
							description: "Responsive grid of KPI cards with trend indicators.",
						},
						{
							title: "Stats Strip",
							href: "/docs/blocks/stats-strip",
							description: "Horizontal row of key metrics with sparklines and trend indicators.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
