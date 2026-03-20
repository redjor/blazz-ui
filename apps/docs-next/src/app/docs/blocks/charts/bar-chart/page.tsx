"use client"

"use client"

import { BarChartBlock } from "@blazz/pro/components/blocks/bar-chart-block"
import type { ChartConfig } from "@blazz/ui/components/ui/chart"
import { DocExampleSync } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const barChartProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Bar Chart"',
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
		description:
			"Array of data points. Each object should contain the xKey field and one field per series defined in config.",
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

const revenueData = [
	{ month: "Jan", recurring: 4200, oneTime: 1800 },
	{ month: "Fév", recurring: 5100, oneTime: 2200 },
	{ month: "Mar", recurring: 4800, oneTime: 1500 },
	{ month: "Avr", recurring: 6200, oneTime: 2800 },
	{ month: "Mai", recurring: 5900, oneTime: 2100 },
	{ month: "Juin", recurring: 7100, oneTime: 3200 },
]

const revenueConfig = {
	recurring: { label: "Récurrent", color: "hsl(var(--chart-1))" },
	oneTime: { label: "Ponctuel", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

const singleData = [
	{ month: "Jan", sales: 42 },
	{ month: "Fév", sales: 58 },
	{ month: "Mar", sales: 35 },
	{ month: "Avr", sales: 71 },
	{ month: "Mai", sales: 49 },
	{ month: "Juin", sales: 63 },
]

const singleConfig = {
	sales: { label: "Ventes", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

export default function BarChartPage() {
	return (
		<DocPage
			title="Bar Chart"
			subtitle="Barres verticales pour comparer des valeurs par catégorie. Basé sur Recharts et les primitives shadcn Chart."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-lg">
					<BarChartBlock
						title="Revenus mensuels"
						description="Récurrent vs ponctuel"
						data={revenueData}
						config={revenueConfig}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleSync
					title="Default"
					description="Le composant fonctionne sans props — il affiche des données de démo."
					code={`<BarChartBlock />`}
				>
					<div className="max-w-lg">
						<BarChartBlock />
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Single Series"
					description="Un seul dataKey dans le config pour un bar chart simple."
					code={`const data = [
  { month: "Jan", sales: 42 },
  { month: "Fév", sales: 58 },
  { month: "Mar", sales: 35 },
]

const config = {
  sales: { label: "Ventes", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

<BarChartBlock
  title="Ventes"
  data={data}
  config={config}
/>`}
				>
					<div className="max-w-lg">
						<BarChartBlock title="Ventes" data={singleData} config={singleConfig} />
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Multi Series"
					description="Plusieurs dataKeys pour comparer des séries côte à côte."
					code={`const config = {
  recurring: { label: "Récurrent", color: "hsl(var(--chart-1))" },
  oneTime: { label: "Ponctuel", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

<BarChartBlock
  title="Revenus mensuels"
  description="Récurrent vs ponctuel"
  data={revenueData}
  config={config}
/>`}
				>
					<div className="max-w-lg">
						<BarChartBlock
							title="Revenus mensuels"
							description="Récurrent vs ponctuel"
							data={revenueData}
							config={revenueConfig}
						/>
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={barChartProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Line Chart",
							href: "/docs/components/charts/line-chart",
							description: "Courbes pour tendances temporelles.",
						},
						{
							title: "Area Chart",
							href: "/docs/components/charts/area-chart",
							description: "Courbes remplies pour volumes.",
						},
						{
							title: "Pie Chart",
							href: "/docs/components/charts/pie-chart",
							description: "Camembert pour répartitions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
