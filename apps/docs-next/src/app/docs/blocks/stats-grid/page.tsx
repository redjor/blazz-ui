import type { StatItem } from "@blazz/pro/components/blocks/stats-grid"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import {
	Clock,
	CreditCard,
	DollarSign,
	Handshake,
	ShoppingCart,
	TrendingUp,
	Users,
} from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const heroStats: StatItem[] = [
	{
		label: "Chiffre d'affaires",
		value: "248 500 \u20ac",
		trend: 12.5,
		icon: DollarSign,
	},
	{
		label: "Deals en cours",
		value: 34,
		trend: 8.2,
		icon: Handshake,
	},
	{
		label: "Contacts actifs",
		value: 1247,
		trend: -2.1,
		icon: Users,
	},
	{
		label: "Taux de conversion",
		value: "24.8%",
		trend: 3.4,
		icon: TrendingUp,
	},
]

const threeColumnStats: StatItem[] = [
	{
		label: "Commandes ce mois",
		value: 186,
		trend: 15.3,
		icon: ShoppingCart,
	},
	{
		label: "Panier moyen",
		value: "342 \u20ac",
		trend: 4.7,
		icon: CreditCard,
	},
	{
		label: "Temps de traitement",
		value: "2.4 j",
		trend: -18.0,
		trendInverted: true,
		icon: Clock,
	},
]

const invertedStats: StatItem[] = [
	{
		label: "Co\u00fbt d'acquisition",
		value: "45 \u20ac",
		trend: -12.0,
		trendInverted: true,
		icon: DollarSign,
	},
	{
		label: "Taux de churn",
		value: "3.2%",
		trend: -8.5,
		trendInverted: true,
		icon: Users,
	},
	{
		label: "D\u00e9lai de livraison",
		value: "1.8 j",
		trend: -22.0,
		trendInverted: true,
		icon: Clock,
	},
	{
		label: "Tickets support",
		value: 12,
		trend: 15.0,
		trendInverted: true,
		icon: Handshake,
	},
]

// ---------------------------------------------------------------------------
// Examples (code strings for highlighting)
// ---------------------------------------------------------------------------

const examples = [
	{
		key: "basic",
		code: `import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import type { StatItem } from "@blazz/pro/components/blocks/stats-grid"
import { DollarSign, Handshake, Users, TrendingUp } from "lucide-react"

const stats: StatItem[] = [
  {
    label: "Chiffre d'affaires",
    value: "248 500 \u20ac",
    trend: 12.5,
    icon: DollarSign,
  },
  {
    label: "Deals en cours",
    value: 34,
    trend: 8.2,
    icon: Handshake,
  },
  {
    label: "Contacts actifs",
    value: 1247,
    trend: -2.1,
    icon: Users,
  },
  {
    label: "Taux de conversion",
    value: "24.8%",
    trend: 3.4,
    icon: TrendingUp,
  },
]

<StatsGrid stats={stats} />`,
	},
	{
		key: "three-columns",
		code: `import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import type { StatItem } from "@blazz/pro/components/blocks/stats-grid"
import { ShoppingCart, CreditCard, Clock } from "lucide-react"

const stats: StatItem[] = [
  {
    label: "Commandes ce mois",
    value: 186,
    trend: 15.3,
    icon: ShoppingCart,
  },
  {
    label: "Panier moyen",
    value: "342 \u20ac",
    trend: 4.7,
    icon: CreditCard,
  },
  {
    label: "Temps de traitement",
    value: "2.4 j",
    trend: -18.0,
    trendInverted: true,
    icon: Clock,
  },
]

<StatsGrid stats={stats} columns={3} />`,
	},
	{
		key: "inverted",
		code: `import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import type { StatItem } from "@blazz/pro/components/blocks/stats-grid"
import { DollarSign, Users, Clock, Handshake } from "lucide-react"

const stats: StatItem[] = [
  {
    label: "Co\u00fbt d'acquisition",
    value: "45 \u20ac",
    trend: -12.0,
    trendInverted: true,
    icon: DollarSign,
  },
  {
    label: "Taux de churn",
    value: "3.2%",
    trend: -8.5,
    trendInverted: true,
    icon: Users,
  },
  {
    label: "D\u00e9lai de livraison",
    value: "1.8 j",
    trend: -22.0,
    trendInverted: true,
    icon: Clock,
  },
  {
    label: "Tickets support",
    value: 12,
    trend: 15.0,
    trendInverted: true,
    icon: Handshake,
  },
]

// trendInverted: lower values are better (green arrow when negative)
<StatsGrid stats={stats} />`,
	},
	{
		key: "loading",
		code: `import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"

<StatsGrid stats={[]} loading />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const statsGridProps: DocProp[] = [
	{
		name: "stats",
		type: "StatItem[]",
		description: "Array of stat items to display in the grid.",
	},
	{
		name: "columns",
		type: "2 | 3 | 4",
		default: "4",
		description:
			"Number of columns in the grid. Responsive: collapses to 2 on tablet, 1 on mobile.",
	},
	{
		name: "loading",
		type: "boolean",
		default: "false",
		description:
			"Show skeleton loading state. Renders placeholder cards matching the column count.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the root grid element.",
	},
]

const statItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: 'Label text displayed above the value (e.g. "Chiffre d\'affaires").',
	},
	{
		name: "value",
		type: "string | number",
		description: "The main KPI value to display prominently.",
	},
	{
		name: "trend",
		type: "number",
		description:
			"Percentage change vs previous period. Positive shows green up arrow, negative shows red down arrow.",
	},
	{
		name: "trendInverted",
		type: "boolean",
		description:
			"Invert trend colors: negative becomes green (good) and positive becomes red (bad). Use for cost-type metrics where lower is better.",
	},
	{
		name: "icon",
		type: "LucideIcon",
		description: "Optional Lucide icon displayed in the top-right corner of the card.",
	},
]

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "stats-grid-props", title: "StatsGrid Props" },
	{ id: "stat-item-type", title: "StatItem Type" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Hero demo
// ---------------------------------------------------------------------------

function StatsGridHeroDemo() {
	return (
		<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
			<StatsGrid stats={heroStats} />
		</div>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function StatsGridPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Stats Grid"
			subtitle="A responsive grid of KPI cards with trend indicators, icons, loading skeletons, and support for inverted metrics where lower is better."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<StatsGridHeroDemo />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A 4-column grid showing key CRM metrics. Each card displays a label, value, trend arrow with percentage, and an icon."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<StatsGrid stats={heroStats} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Three Columns"
					description="Use the columns prop to switch to a 3-column layout for fewer metrics."
					code={examples[1].code}
					highlightedCode={html("three-columns")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<StatsGrid stats={threeColumnStats} columns={3} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Inverted Trends"
					description="For cost-type metrics (acquisition cost, churn rate, delivery time), set trendInverted to true so a negative trend shows as green (improvement) and a positive trend shows as red."
					code={examples[2].code}
					highlightedCode={html("inverted")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<StatsGrid stats={invertedStats} />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Loading State"
					description="Pass the loading prop to display skeleton placeholder cards while data is being fetched. The number of skeletons matches the columns prop."
					code={examples[3].code}
					highlightedCode={html("loading")}
				>
					<div className="w-full max-w-2xl rounded-lg border border-edge bg-surface overflow-hidden p-4">
						<StatsGrid stats={[]} loading />
					</div>
				</DocExampleClient>
			</DocSection>

			{/* StatsGrid Props */}
			<DocSection id="stats-grid-props" title="StatsGrid Props">
				<DocPropsTable props={statsGridProps} />
			</DocSection>

			{/* StatItem Type */}
			<DocSection id="stat-item-type" title="StatItem Type">
				<DocPropsTable props={statItemProps} />
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Stats Strip",
							href: "/docs/blocks/stats-strip",
							description:
								"Horizontal row of key metrics with trend indicators and compact layout.",
						},
						{
							title: "Data Table",
							href: "/docs/blocks/data-table",
							description:
								"Full-featured data table with sorting, filtering, pagination, and row selection.",
						},
						{
							title: "Chart Card",
							href: "/docs/blocks/chart-card",
							description: "Chart container with title, description, and Recharts integration.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
