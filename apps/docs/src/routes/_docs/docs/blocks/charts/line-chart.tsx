"use client"

import { LineChartBlock } from "@blazz/pro/components/blocks/line-chart-block"
import type { ChartConfig } from "@blazz/ui/components/ui/chart"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleSync } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"

export const Route = createFileRoute("/_docs/docs/blocks/charts/line-chart")({
	component: LineChartPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const lineChartProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Line Chart"',
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
		description: "Array of data points.",
	},
	{
		name: "config",
		type: "ChartConfig",
		description: "Chart configuration mapping data keys to labels and colors.",
	},
	{
		name: "xKey",
		type: "string",
		default: '"month"',
		description: "The key in each data object used for the X axis.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the card wrapper.",
	},
]

const trendData = [
	{ month: "Jan", visitors: 1200, pageViews: 4800 },
	{ month: "Fév", visitors: 1900, pageViews: 6200 },
	{ month: "Mar", visitors: 1600, pageViews: 5100 },
	{ month: "Avr", visitors: 2400, pageViews: 7800 },
	{ month: "Mai", visitors: 2100, pageViews: 6900 },
	{ month: "Juin", visitors: 2800, pageViews: 9200 },
]

const trendConfig = {
	visitors: { label: "Visiteurs", color: "hsl(var(--chart-1))" },
	pageViews: { label: "Pages vues", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const singleData = [
	{ month: "Jan", revenue: 32000 },
	{ month: "Fév", revenue: 41000 },
	{ month: "Mar", revenue: 38000 },
	{ month: "Avr", revenue: 52000 },
	{ month: "Mai", revenue: 47000 },
	{ month: "Juin", revenue: 61000 },
]

const singleConfig = {
	revenue: { label: "Revenu", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

function LineChartPage() {
	return (
		<DocPage
			title="Line Chart"
			subtitle="Courbes pour visualiser des tendances temporelles. Basé sur Recharts et les primitives shadcn Chart."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-lg">
					<LineChartBlock
						title="Trafic web"
						description="Visiteurs et pages vues"
						data={trendData}
						config={trendConfig}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleSync
					title="Default"
					description="Le composant fonctionne sans props avec des données de démo."
					code={`<LineChartBlock />`}
				>
					<div className="max-w-lg">
						<LineChartBlock />
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Single Line"
					description="Une seule courbe pour suivre une métrique."
					code={`const config = {
  revenue: { label: "Revenu", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

<LineChartBlock
  title="Revenu mensuel"
  data={data}
  config={config}
/>`}
				>
					<div className="max-w-lg">
						<LineChartBlock title="Revenu mensuel" data={singleData} config={singleConfig} />
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Multi Lines"
					description="Plusieurs courbes pour comparer des tendances."
					code={`const config = {
  visitors: { label: "Visiteurs", color: "hsl(var(--chart-1))" },
  pageViews: { label: "Pages vues", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

<LineChartBlock
  title="Trafic web"
  description="Visiteurs et pages vues"
  data={data}
  config={config}
/>`}
				>
					<div className="max-w-lg">
						<LineChartBlock
							title="Trafic web"
							description="Visiteurs et pages vues"
							data={trendData}
							config={trendConfig}
						/>
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={lineChartProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Bar Chart",
							href: "/docs/components/charts/bar-chart",
							description: "Barres pour comparer des valeurs.",
						},
						{
							title: "Area Chart",
							href: "/docs/components/charts/area-chart",
							description: "Courbes remplies pour volumes.",
						},
						{
							title: "Radar Chart",
							href: "/docs/components/charts/radar-chart",
							description: "Radar pour comparer des dimensions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
