"use client"

import { RadarChartBlock } from "@blazz/pro/components/blocks/radar-chart-block"
import type { ChartConfig } from "@blazz/ui/components/ui/chart"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleSync } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"

export const Route = createFileRoute("/_docs/docs/blocks/charts/radar-chart")({
	component: RadarChartPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const radarChartProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		default: '"Radar Chart"',
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
			"Array of data points. Each object should contain the angleKey and one field per series.",
	},
	{
		name: "config",
		type: "ChartConfig",
		description: "Chart configuration mapping data keys to labels and colors.",
	},
	{
		name: "angleKey",
		type: "string",
		default: '"skill"',
		description: "The key used for the angular axis labels.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the card wrapper.",
	},
]

const skillData = [
	{ area: "Communication", current: 90, target: 85 },
	{ area: "Technique", current: 75, target: 90 },
	{ area: "Leadership", current: 80, target: 70 },
	{ area: "Créativité", current: 65, target: 80 },
	{ area: "Organisation", current: 85, target: 75 },
	{ area: "Collaboration", current: 95, target: 88 },
]

const skillConfig = {
	current: { label: "Actuel", color: "hsl(var(--chart-1))" },
	target: { label: "Objectif", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

const singleData = [
	{ area: "React", score: 95 },
	{ area: "TypeScript", score: 88 },
	{ area: "CSS", score: 72 },
	{ area: "Node.js", score: 80 },
	{ area: "SQL", score: 65 },
	{ area: "DevOps", score: 55 },
]

const singleConfig = {
	score: { label: "Score", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

function RadarChartPage() {
	return (
		<DocPage
			title="Radar Chart"
			subtitle="Diagramme radar pour comparer des données multi-dimensionnelles. Basé sur Recharts et les primitives shadcn Chart."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<RadarChartBlock
						title="Compétences"
						description="Actuel vs objectif"
						data={skillData}
						config={skillConfig}
						angleKey="area"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleSync
					title="Default"
					description="Le composant fonctionne sans props avec des données de démo."
					code={`<RadarChartBlock />`}
				>
					<div className="max-w-sm">
						<RadarChartBlock />
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Single Series"
					description="Un seul dataKey pour un profil simple."
					code={`const config = {
  score: { label: "Score", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

<RadarChartBlock
  title="Stack technique"
  data={data}
  config={config}
  angleKey="area"
/>`}
				>
					<div className="max-w-sm">
						<RadarChartBlock
							title="Stack technique"
							data={singleData}
							config={singleConfig}
							angleKey="area"
						/>
					</div>
				</DocExampleSync>

				<DocExampleSync
					title="Comparison"
					description="Deux séries pour comparer actuel vs objectif."
					code={`const config = {
  current: { label: "Actuel", color: "hsl(var(--chart-1))" },
  target: { label: "Objectif", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

<RadarChartBlock
  title="Compétences"
  description="Actuel vs objectif"
  data={data}
  config={config}
  angleKey="area"
/>`}
				>
					<div className="max-w-sm">
						<RadarChartBlock
							title="Compétences"
							description="Actuel vs objectif"
							data={skillData}
							config={skillConfig}
							angleKey="area"
						/>
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={radarChartProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Pie Chart",
							href: "/docs/components/charts/pie-chart",
							description: "Camembert pour répartitions.",
						},
						{
							title: "Bar Chart",
							href: "/docs/components/charts/bar-chart",
							description: "Barres pour comparer des valeurs.",
						},
						{
							title: "Line Chart",
							href: "/docs/components/charts/line-chart",
							description: "Courbes pour tendances.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
