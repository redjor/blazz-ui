"use client"

import { DollarSign, Users, TrendingUp, BarChart3, CalendarPlus, MessageCircle } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { MetricCard } from "@/components/ai/generative/metric-card"
import { StatsRow } from "@/components/ai/generative/stats-row"
import { MiniChart } from "@/components/ai/generative/mini-chart"
import { ComparisonTable } from "@/components/ai/generative/comparison-table"
import { ProgressCard } from "@/components/ai/generative/progress-card"
import { DataList } from "@/components/ai/generative/data-list"
import { CandidateCard } from "@/components/ai/generative/candidate-card"
import { Button } from "@/components/ui/button"

const toc = [
	{ id: "metric-card", title: "Metric Card" },
	{ id: "stats-row", title: "Stats Row" },
	{ id: "mini-chart", title: "Mini Chart" },
	{ id: "comparison-table", title: "Comparison Table" },
	{ id: "progress-card", title: "Progress Card" },
	{ id: "data-list", title: "Data List" },
	{ id: "candidate-card", title: "Candidate Card" },
]

const sparklineData = [3, 7, 4, 9, 6, 11, 8, 14, 12, 16]

export default function GenerativeUiPage() {
	return (
		<DocPage
			title="Generative UI"
			subtitle="Structured data blocks that render inline in AI chat messages — KPIs, charts, tables, and more."
			toc={toc}
		>
			{/* Hero: simulated AI message with multiple blocks */}
			<DocHero className="flex-col items-start gap-4 px-6 py-8">
				<p className="text-sm text-fg-muted">
					Here is a summary of Q4 performance:
				</p>
				<div className="grid w-full gap-3 sm:grid-cols-2">
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
				<StatsRow
					className="w-full"
					items={[
						{ label: "Deals Won", value: "47", trend: 8.5 },
						{ label: "Avg Deal Size", value: "$26.4K", trend: -3.2 },
						{ label: "Win Rate", value: "34%", trend: 5.1 },
					]}
				/>
				<ProgressCard
					label="Q4 Target"
					value={78}
					description="$1.24M of $1.6M target reached"
				/>
			</DocHero>

			{/* Section: Metric Card */}
			<DocSection id="metric-card" title="Metric Card">
				<DocExample
					title="Single KPI"
					description="A standalone metric with trend indicator."
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
			</DocSection>

			{/* Section: Stats Row */}
			<DocSection id="stats-row" title="Stats Row">
				<DocExample
					title="Horizontal KPIs"
					description="2-4 metrics in a compact row with dividers."
					code={`<StatsRow
  items={[
    { label: "Contacts", value: "1,204", trend: 4.3 },
    { label: "Deals Open", value: "39" },
    { label: "Revenue", value: "$284K", trend: 12.1 },
    { label: "Win Rate", value: "34%", trend: -2.5 },
  ]}
/>`}
				>
					<StatsRow
						items={[
							{ label: "Contacts", value: "1,204", trend: 4.3 },
							{ label: "Deals Open", value: "39" },
							{ label: "Revenue", value: "$284K", trend: 12.1 },
							{ label: "Win Rate", value: "34%", trend: -2.5 },
						]}
					/>
				</DocExample>
			</DocSection>

			{/* Section: Mini Chart */}
			<DocSection id="mini-chart" title="Mini Chart">
				<DocExample
					title="Sparkline"
					description="A compact area chart with label and current value."
					code={`<MiniChart
  label="Weekly Signups"
  data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]}
  value="16"
/>`}
				>
					<div className="max-w-sm">
						<MiniChart
							label="Weekly Signups"
							data={sparklineData}
							value="16"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Side by Side"
					description="Multiple sparklines for quick comparison."
					code={`<div className="grid grid-cols-2 gap-3">
  <MiniChart label="MRR" data={[10,12,11,15,18,20]} value="$20K" />
  <MiniChart label="Churn" data={[5,4,6,3,4,2]} value="2%" />
</div>`}
				>
					<div className="grid grid-cols-2 gap-3">
						<MiniChart
							label="MRR"
							data={[10, 12, 11, 15, 18, 20]}
							value="$20K"
						/>
						<MiniChart
							label="Churn"
							data={[5, 4, 6, 3, 4, 2]}
							value="2%"
						/>
					</div>
				</DocExample>
			</DocSection>

			{/* Section: Comparison Table */}
			<DocSection id="comparison-table" title="Comparison Table">
				<DocExample
					title="Plan Comparison"
					description="A lightweight table for side-by-side comparison data."
					code={`<ComparisonTable
  title="Plan Comparison"
  columns={["Feature", "Starter", "Pro", "Enterprise"]}
  rows={[
    ["Users", "5", "25", "Unlimited"],
    ["Storage", "10 GB", "100 GB", "1 TB"],
    ["Support", "Email", "Priority", "Dedicated"],
  ]}
/>`}
				>
					<ComparisonTable
						title="Plan Comparison"
						columns={["Feature", "Starter", "Pro", "Enterprise"]}
						rows={[
							["Users", "5", "25", "Unlimited"],
							["Storage", "10 GB", "100 GB", "1 TB"],
							["Support", "Email", "Priority", "Dedicated"],
						]}
					/>
				</DocExample>
			</DocSection>

			{/* Section: Progress Card */}
			<DocSection id="progress-card" title="Progress Card">
				<DocExample
					title="Target Progress"
					description="A labeled progress bar with description."
					code={`<ProgressCard
  label="Q4 Revenue Target"
  value={78}
  description="$1.24M of $1.6M target reached"
/>`}
				>
					<div className="max-w-sm">
						<ProgressCard
							label="Q4 Revenue Target"
							value={78}
							description="$1.24M of $1.6M target reached"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Multiple Progress Bars"
					description="Stack several progress cards for pipeline or milestone views."
					code={`<div className="space-y-3">
  <ProgressCard label="Prospecting" value={100} />
  <ProgressCard label="Qualification" value={65} />
  <ProgressCard label="Proposal" value={30} />
  <ProgressCard label="Negotiation" value={10} />
</div>`}
				>
					<div className="max-w-sm space-y-3">
						<ProgressCard label="Prospecting" value={100} />
						<ProgressCard label="Qualification" value={65} />
						<ProgressCard label="Proposal" value={30} />
						<ProgressCard label="Negotiation" value={10} />
					</div>
				</DocExample>
			</DocSection>

			{/* Section: Data List */}
			<DocSection id="data-list" title="Data List">
				<DocExample
					title="Key-Value List"
					description="Vertical list of labeled values with optional badges."
					code={`<DataList
  title="Deal Summary"
  items={[
    { label: "Company", value: "Acme Corp" },
    { label: "Amount", value: "$48,000" },
    { label: "Stage", value: "Negotiation", badge: { text: "Active", variant: "success" } },
    { label: "Close Date", value: "Mar 15, 2026" },
    { label: "Probability", value: "75%", badge: { text: "High", variant: "warning" } },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<DataList
							title="Deal Summary"
							items={[
								{ label: "Company", value: "Acme Corp" },
								{ label: "Amount", value: "$48,000" },
								{
									label: "Stage",
									value: "Negotiation",
									badge: { text: "Active", variant: "success" },
								},
								{ label: "Close Date", value: "Mar 15, 2026" },
								{
									label: "Probability",
									value: "75%",
									badge: { text: "High", variant: "warning" },
								},
							]}
						/>
					</div>
				</DocExample>
			</DocSection>

			{/* Section: Candidate Card */}
			<DocSection id="candidate-card" title="Candidate Card">
				<DocExample
					title="Full Profile"
					description="Entity card with avatar, status, skills and match score."
					code={`<CandidateCard
  name="Sarah Connor"
  avatar="https://i.pravatar.cc/150?u=sarah"
  role="Senior Frontend Engineer"
  company="Cyberdyne Systems"
  location="Los Angeles, CA"
  status="available"
  matchScore={92}
  skills={["React", "TypeScript", "Node.js"]}
/>`}
				>
					<div className="max-w-sm">
						<CandidateCard
							name="Sarah Connor"
							avatar="https://i.pravatar.cc/150?u=sarah"
							role="Senior Frontend Engineer"
							company="Cyberdyne Systems"
							location="Los Angeles, CA"
							status="available"
							matchScore={92}
							skills={["React", "TypeScript", "Node.js"]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="With Actions"
					description="Pass action buttons via the actions slot."
					code={`<CandidateCard
  name="Marie Curie"
  role="Data Scientist"
  company="CNRS"
  status="available"
  matchScore={87}
  skills={["Python", "ML", "PyTorch"]}
  actions={
    <>
      <Button size="xs">
        <CalendarPlus className="size-3.5" /> Schedule
      </Button>
      <Button size="xs" variant="outline">
        <MessageCircle className="size-3.5" /> Message
      </Button>
    </>
  }
/>`}
				>
					<div className="max-w-sm">
						<CandidateCard
							name="Marie Curie"
							avatar="https://i.pravatar.cc/150?u=marie"
							role="Data Scientist"
							company="CNRS"
							status="available"
							matchScore={87}
							skills={["Python", "ML", "PyTorch"]}
							actions={
								<>
									<Button size="xs">
										<CalendarPlus className="size-3.5" /> Schedule
									</Button>
									<Button size="xs" variant="outline">
										<MessageCircle className="size-3.5" /> Message
									</Button>
								</>
							}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
