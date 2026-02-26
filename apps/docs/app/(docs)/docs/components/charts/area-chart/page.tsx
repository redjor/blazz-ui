"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import { AreaChartBlock } from "@blazz/ui/components/blocks/area-chart-block"
import type { ChartConfig } from "@blazz/ui/components/ui/chart"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const areaChartProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Area Chart"',
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
		name: "stacked",
		type: "boolean",
		default: "false",
		description: "Stack the areas on top of each other instead of overlaying.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the card wrapper.",
	},
]

const trafficData = [
	{ month: "Jan", organic: 3200, paid: 1800 },
	{ month: "Fév", organic: 4100, paid: 2400 },
	{ month: "Mar", organic: 3800, paid: 2100 },
	{ month: "Avr", organic: 5200, paid: 3100 },
	{ month: "Mai", organic: 4700, paid: 2800 },
	{ month: "Juin", organic: 6100, paid: 3500 },
]

const trafficConfig = {
	organic: { label: "Organique", color: "hsl(var(--chart-1))" },
	paid: { label: "Payant", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export default function AreaChartPage() {
	return (
		<DocPage
			title="Area Chart"
			subtitle="Courbes remplies pour visualiser des volumes et tendances cumulées. Basé sur Recharts et les primitives shadcn Chart."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-lg">
					<AreaChartBlock title="Sources de trafic" description="Organique vs payant" data={trafficData} config={trafficConfig} />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="Le composant fonctionne sans props avec des données de démo."
					code={`<AreaChartBlock />`}
				>
					<div className="max-w-lg">
						<AreaChartBlock />
					</div>
				</DocExample>

				<DocExample
					title="Overlay"
					description="Par défaut, les aires se superposent avec transparence."
					code={`<AreaChartBlock
  title="Sources de trafic"
  description="Organique vs payant"
  data={data}
  config={config}
/>`}
				>
					<div className="max-w-lg">
						<AreaChartBlock title="Sources de trafic" description="Organique vs payant" data={trafficData} config={trafficConfig} />
					</div>
				</DocExample>

				<DocExample
					title="Stacked"
					description="Empiler les aires pour montrer le total cumulé."
					code={`<AreaChartBlock
  title="Sources de trafic"
  description="Vue cumulée"
  data={data}
  config={config}
  stacked
/>`}
				>
					<div className="max-w-lg">
						<AreaChartBlock title="Sources de trafic" description="Vue cumulée" data={trafficData} config={trafficConfig} stacked />
					</div>
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={areaChartProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{ title: "Line Chart", href: "/docs/components/charts/line-chart", description: "Courbes sans remplissage." },
						{ title: "Bar Chart", href: "/docs/components/charts/bar-chart", description: "Barres pour comparer des valeurs." },
						{ title: "Pie Chart", href: "/docs/components/charts/pie-chart", description: "Camembert pour répartitions." },
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
