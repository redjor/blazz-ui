"use client"

import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleSync } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { PieChartBlock } from "@blazz/ui/components/blocks/pie-chart-block"
import type { ChartConfig } from "@blazz/ui/components/ui/chart"

export const Route = createFileRoute("/_docs/docs/components/blocks/charts/pie-chart")({
	component: PieChartPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const pieChartProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Pie Chart"',
		description: "The title displayed in the card header.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description below the title.",
	},
	{
		name: "data",
		type: "Record<string, unknown>[]",
		description: "Array of data points. Each object should contain the dataKey, nameKey, and a fill field referencing var(--color-{key}).",
	},
	{
		name: "config",
		type: "ChartConfig",
		description: "Chart configuration mapping data keys to labels and colors.",
	},
	{
		name: "dataKey",
		type: "string",
		default: '"visitors"',
		description: "The key for the numerical value of each slice.",
	},
	{
		name: "nameKey",
		type: "string",
		default: '"browser"',
		description: "The key for the label of each slice.",
	},
	{
		name: "donut",
		type: "boolean",
		default: "false",
		description: "Render as a donut chart with a hollow center.",
	},
	{
		name: "showTotal",
		type: "boolean",
		default: "false",
		description: "Show the total value in the donut center. Only works when donut is true.",
	},
	{
		name: "totalLabel",
		type: "string",
		default: '"Total"',
		description: "Label displayed below the total value in the donut center.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the card wrapper.",
	},
]

const sourceData = [
	{ source: "direct", leads: 340, fill: "var(--color-direct)" },
	{ source: "referral", leads: 210, fill: "var(--color-referral)" },
	{ source: "organic", leads: 280, fill: "var(--color-organic)" },
	{ source: "social", leads: 150, fill: "var(--color-social)" },
	{ source: "email", leads: 120, fill: "var(--color-email)" },
]

const sourceConfig = {
	leads: { label: "Leads" },
	direct: { label: "Direct", color: "hsl(var(--chart-1))" },
	referral: { label: "Referral", color: "hsl(var(--chart-2))" },
	organic: { label: "Organique", color: "hsl(var(--chart-3))" },
	social: { label: "Social", color: "hsl(var(--chart-4))" },
	email: { label: "Email", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

function PieChartPage() {
	return (
		<DocPage
			title="Pie Chart"
			subtitle="Camembert et donut pour visualiser des répartitions en pourcentages. Basé sur Recharts et les primitives shadcn Chart."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<PieChartBlock
						title="Sources de leads"
						data={sourceData}
						config={sourceConfig}
						dataKey="leads"
						nameKey="source"
						donut
						showTotal
						totalLabel="Leads"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleSync
					title="Default (Pie)"
					description="Camembert classique avec données par défaut."
					code={`<PieChartBlock />`}
				>
					<div className="max-w-sm">
						<PieChartBlock />
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Donut"
					description="Version donut avec un centre creux."
					code={`<PieChartBlock
  title="Sources de leads"
  data={data}
  config={config}
  dataKey="leads"
  nameKey="source"
  donut
/>`}
				>
					<div className="max-w-sm">
						<PieChartBlock
							title="Sources de leads"
							data={sourceData}
							config={sourceConfig}
							dataKey="leads"
							nameKey="source"
							donut
						/>
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Donut with Total"
					description="Afficher le total au centre du donut."
					code={`<PieChartBlock
  title="Sources de leads"
  data={data}
  config={config}
  dataKey="leads"
  nameKey="source"
  donut
  showTotal
  totalLabel="Leads"
/>`}
				>
					<div className="max-w-sm">
						<PieChartBlock
							title="Sources de leads"
							data={sourceData}
							config={sourceConfig}
							dataKey="leads"
							nameKey="source"
							donut
							showTotal
							totalLabel="Leads"
						/>
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={pieChartProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{ title: "Bar Chart", href: "/docs/components/charts/bar-chart", description: "Barres pour comparer des valeurs." },
						{ title: "Radar Chart", href: "/docs/components/charts/radar-chart", description: "Radar pour comparer des dimensions." },
						{ title: "Stats Strip", href: "/docs/components/ui/stats-strip", description: "KPIs en ligne pour tableaux de bord." },
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
