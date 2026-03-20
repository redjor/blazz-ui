"use client"

import { use } from "react"
import { StatsStrip } from "@blazz/pro/components/blocks/stats-strip"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "stats-strip-props", title: "StatsStrip Props" },
	{ id: "stats-strip-item", title: "StatsStripItem Type" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const trendStats = [
	{ label: "Revenus", value: "€45 200", chart: [30, 32, 35, 38, 42, 44, 50] },
	{ label: "Taux de rebond", value: "61 %", chart: [48, 52, 55, 58, 60, 62, 61] },
	{
		label: "Commandes",
		value: "128",
		chart: [140, 135, 128, 122, 118, 115, 112],
		trend: "down" as const,
	},
	{ label: "Satisfaction", value: "4.8 / 5", chart: [4.5, 4.5, 4.6, 4.6, 4.7, 4.8, 4.8] },
]

const heroStats = [
	{ label: "Visites", value: "39", chart: [12, 18, 14, 22, 30, 28, 39] },
	{ label: "Ventes attribuées au marketing", value: "0 €", chart: [0, 0, 0, 0, 0, 0, 0] },
	{ label: "Commandes attribuées au marketing", value: "0", chart: [0, 0, 0, 0, 0, 0, 0] },
	{ label: "Taux de conversion", value: "0 %", chart: [0, 0, 0, 0, 0, 0, 0] },
]

const basicStats = [
	{ label: "Revenus", value: "€45 200" },
	{ label: "Commandes", value: "128" },
	{ label: "Clients", value: "847" },
	{ label: "Panier moyen", value: "€353" },
]

const sparklineStats = [
	{ label: "Visites", value: "12 847", chart: [800, 920, 1100, 980, 1250, 1400, 1300] },
	{ label: "Taux de rebond", value: "34 %", chart: [42, 38, 36, 40, 35, 33, 34] },
	{ label: "Durée moyenne", value: "2m 45s", chart: [120, 135, 150, 140, 165, 170, 165] },
	{ label: "Pages / session", value: "4.2", chart: [3.1, 3.5, 3.8, 4.0, 3.9, 4.1, 4.2] },
]

const manyStats = [
	{ label: "Revenus", value: "€45 200", chart: [30, 35, 28, 42, 38, 45, 45] },
	{ label: "Commandes", value: "128", chart: [80, 95, 100, 110, 105, 120, 128] },
	{ label: "Clients actifs", value: "847" },
	{ label: "Panier moyen", value: "€353" },
	{ label: "Taux de conversion", value: "3.2 %", chart: [2.8, 3.0, 2.9, 3.1, 3.0, 3.2, 3.2] },
	{ label: "Retours", value: "12", chart: [5, 8, 3, 6, 4, 7, 12] },
	{ label: "NPS", value: "72" },
	{ label: "Tickets ouverts", value: "23" },
]

const statsStripProps: DocProp[] = [
	{
		name: "stats",
		type: "StatsStripItem[]",
		description: "Array of metrics to display.",
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		description: "Show skeleton loading state.",
	},
	{
		name: "loadingCount",
		type: "number",
		default: "4",
		description:
			"Number of skeleton items to render while loading. Set this to match the expected number of stats.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the card container.",
	},
]

const statsStripItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Metric label.",
	},
	{
		name: "value",
		type: "string | number",
		description: "Formatted metric value.",
	},
	{
		name: "chart",
		type: "number[]",
		description: "Sparkline data points (minimum 2). Rendered as a mini line chart.",
	},
	{
		name: "trend",
		type: '"up" | "down" | "neutral"',
		description:
			'Override the sparkline color. Without this prop, trend is auto-detected by comparing chart[0] vs chart[last]. "up" → green, "down" → red, "neutral" → muted.',
	},
]

const examples = [
	{
		key: "basic",
		code: `<StatsStrip stats={[
  { label: "Revenus", value: "€45 200" },
  { label: "Commandes", value: "128" },
  { label: "Clients", value: "847" },
  { label: "Panier moyen", value: "€353" },
]} />`,
	},
	{
		key: "sparklines",
		code: `<StatsStrip stats={[
  { label: "Visites", value: "12 847", chart: [800, 920, 1100, 980, 1250, 1400, 1300] },
  { label: "Taux de rebond", value: "34 %", chart: [42, 38, 36, 40, 35, 33, 34] },
  { label: "Durée moyenne", value: "2m 45s", chart: [120, 135, 150, 140, 165, 170, 165] },
  { label: "Pages / session", value: "4.2", chart: [3.1, 3.5, 3.8, 4.0, 3.9, 4.1, 4.2] },
]} />`,
	},
	{
		key: "scrollable",
		code: `<StatsStrip stats={[
  { label: "Revenus", value: "€45 200", chart: [...] },
  { label: "Commandes", value: "128", chart: [...] },
  // ... 8 items total — arrows appear automatically
]} />`,
	},
	{
		key: "loading",
		code: `// Default: 4 skeleton items
<StatsStrip stats={[]} loading />

// Match your expected number of stats
<StatsStrip stats={[]} loading loadingCount={6} />`,
	},
	{
		key: "trend",
		code: `// trend is auto-detected from chart data (first vs last value)
// Override with explicit trend prop when needed
<StatsStrip stats={[
  { label: "Revenus",      value: "€45 200", chart: [30, 32, 35, 38, 42, 44, 50] },      // ↑ green
  { label: "Taux rebond",  value: "61 %",    chart: [48, 52, 55, 58, 60, 62, 61] },      // ↑ green (last > first)
  { label: "Commandes",    value: "128",     chart: [140, 135, 128, 122, 118, 115, 112],
    trend: "down" },                                                                       // ↓ red (override)
  { label: "Satisfaction", value: "4.8 / 5", chart: [4.5, 4.5, 4.6, 4.6, 4.7, 4.8, 4.8] }, // ↑ green
]} />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

export default function StatsStripPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="StatsStrip"
			subtitle="A compact, horizontally scrollable bar of KPIs with optional sparklines. Ideal for dashboards and analytics headers."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-3xl">
					<StatsStrip stats={heroStats} />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="Simple KPIs without sparklines."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<StatsStrip stats={basicStats} />
				</DocExampleClient>

				<DocExampleClient
					title="With Sparklines"
					description="Each metric shows a mini trend line from the chart data points."
					code={examples[1].code}
					highlightedCode={html("sparklines")}
				>
					<StatsStrip stats={sparklineStats} />
				</DocExampleClient>

				<DocExampleClient
					title="Scrollable with Arrows"
					description="When metrics overflow, navigation arrows appear. Try scrolling or clicking the arrows."
					code={examples[2].code}
					highlightedCode={html("scrollable")}
				>
					<StatsStrip stats={manyStats} />
				</DocExampleClient>

				<DocExampleClient
					title="Loading"
					description="Skeleton state while data is being fetched. Use loadingCount to match the expected number of stats and avoid layout shift."
					code={examples[3].code}
					highlightedCode={html("loading")}
				>
					<StatsStrip stats={[]} loading loadingCount={4} />
				</DocExampleClient>

				<DocExampleClient
					title="Trend Colors"
					description="Sparkline color is auto-detected from chart data (green if trending up, red if trending down). Use the trend prop to override."
					code={examples[4].code}
					highlightedCode={html("trend")}
				>
					<StatsStrip stats={trendStats} />
				</DocExampleClient>
			</DocSection>

			<DocSection id="stats-strip-props" title="StatsStrip Props">
				<DocPropsTable props={statsStripProps} />
			</DocSection>

			<DocSection id="stats-strip-item" title="StatsStripItem Type">
				<DocPropsTable props={statsStripItemProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>
						Use for analytics headers and dashboard summaries — not as the main KPI display (use
						StatsGrid for that)
					</li>
					<li>Pre-format values before passing them (e.g. "€45 200", "3.2 %")</li>
					<li>Provide at least 7 data points for smooth sparklines</li>
					<li>Keep labels concise — long labels will be truncated with a tooltip</li>
					<li>4 metrics is the sweet spot for no-scroll; 5+ will show arrows</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "StatsGrid",
							href: "/docs/components/ui/stats-grid",
							description: "Grid layout for KPI cards with trends and icons.",
						},
						{
							title: "ChartCard",
							href: "/docs/components/ui/chart-card",
							description: "Full-size chart in a card container.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
