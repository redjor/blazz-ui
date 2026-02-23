"use client"

import { DollarSign, Users } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { MetricCard } from "@/components/ai/generative/data/metric-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function MetricCardPage() {
	return (
		<DocPage
			title="Metric Card"
			subtitle="A single KPI with label, formatted value, and optional trend indicator."
			toc={toc}
		>
			<DocHero>
				<div className="grid w-full max-w-md gap-3 sm:grid-cols-2">
					<MetricCard
						label="Revenue"
						value="$1.24M"
						trend={12.3}
						trendLabel="vs Q3"
						icon={<DollarSign className="size-4" />}
					/>
					<MetricCard
						label="Active Users"
						value="8,429"
						trend={-2.1}
						trendLabel="vs Q3"
						icon={<Users className="size-4" />}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Icon & Trend"
					description="Full metric card with icon, value, trend arrow and contextual label."
					code={`<MetricCard
  label="Revenue"
  value="$1.24M"
  trend={12.3}
  trendLabel="vs last quarter"
  icon={<DollarSign className="size-4" />}
/>`}
				>
					<div className="max-w-xs">
						<MetricCard
							label="Revenue"
							value="$1.24M"
							trend={12.3}
							trendLabel="vs last quarter"
							icon={<DollarSign className="size-4" />}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Negative Trend"
					description="Trend arrow and color flip when the value is negative."
					code={`<MetricCard
  label="Churn Rate"
  value="4.8%"
  trend={-1.2}
  trendLabel="vs last month"
/>`}
				>
					<div className="max-w-xs">
						<MetricCard
							label="Churn Rate"
							value="4.8%"
							trend={-1.2}
							trendLabel="vs last month"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Minimal"
					description="Just a label and value, no trend or icon."
					code={`<MetricCard label="Total Contacts" value="1,204" />`}
				>
					<div className="max-w-xs">
						<MetricCard label="Total Contacts" value="1,204" />
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
