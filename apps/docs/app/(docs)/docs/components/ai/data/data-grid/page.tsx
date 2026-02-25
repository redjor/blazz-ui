"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { DataGrid } from "@blazz/ui/components/ai/generative/data/data-grid"

const toc = [{ id: "examples", title: "Examples" }]

export default function DataGridPage() {
	return (
		<DocPage
			title="Data Grid"
			subtitle="A typed data table with avatar, badge and trend cells — renders inline in conversations."
			toc={toc}
		>
			<DocHero>
				<DataGrid
					title="Top Candidates"
					columns={[
						{ key: "candidate", label: "Candidate" },
						{ key: "role", label: "Role" },
						{ key: "status", label: "Status" },
						{ key: "match", label: "Match", align: "right", sorted: "desc" },
					]}
					rows={[
						{
							candidate: { type: "avatar", name: "Sarah Connor", src: "https://i.pravatar.cc/150?u=sarah", subtitle: "Cyberdyne" },
							role: "Frontend Engineer",
							status: { type: "badge", value: "Available", variant: "success" },
							match: { type: "trend", value: 92, suffix: "%" },
						},
						{
							candidate: { type: "avatar", name: "John Doe", src: "https://i.pravatar.cc/150?u=john", subtitle: "Acme Corp" },
							role: "Product Designer",
							status: { type: "badge", value: "In Process", variant: "info" },
							match: { type: "trend", value: 87, suffix: "%" },
						},
						{
							candidate: { type: "avatar", name: "Marie Curie", src: "https://i.pravatar.cc/150?u=marie", subtitle: "CNRS" },
							role: "Data Scientist",
							status: { type: "badge", value: "Available", variant: "success" },
							match: { type: "trend", value: 81, suffix: "%" },
						},
					]}
				/>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Simple Text Table"
					description="Basic table with plain string values."
					code={`<DataGrid
  title="Q4 Revenue by Region"
  columns={[
    { key: "region", label: "Region" },
    { key: "revenue", label: "Revenue", align: "right" },
    { key: "deals", label: "Deals", align: "right" },
  ]}
  rows={[
    { region: "North America", revenue: "$840K", deals: 24 },
    { region: "Europe", revenue: "$312K", deals: 15 },
    { region: "Asia Pacific", revenue: "$96K", deals: 8 },
  ]}
  caption="Source: CRM data, Jan–Dec 2025"
/>`}
				>
					<DataGrid
						title="Q4 Revenue by Region"
						columns={[
							{ key: "region", label: "Region" },
							{ key: "revenue", label: "Revenue", align: "right" },
							{ key: "deals", label: "Deals", align: "right" },
						]}
						rows={[
							{ region: "North America", revenue: "$840K", deals: 24 },
							{ region: "Europe", revenue: "$312K", deals: 15 },
							{ region: "Asia Pacific", revenue: "$96K", deals: 8 },
						]}
						caption="Source: CRM data, Jan–Dec 2025"
					/>
				</DocExample>

				<DocExample
					title="With Avatars & Badges"
					description="Avatar cells for people, badge cells for status."
					code={`<DataGrid
  columns={[
    { key: "person", label: "Person" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ]}
  rows={[
    {
      person: { type: "avatar", name: "Alice Martin", subtitle: "Engineering" },
      role: "Tech Lead",
      status: { type: "badge", value: "Active", variant: "success" },
    },
    {
      person: { type: "avatar", name: "Bob Chen", subtitle: "Design" },
      role: "Senior Designer",
      status: { type: "badge", value: "On Leave", variant: "warning" },
    },
  ]}
/>`}
				>
					<DataGrid
						columns={[
							{ key: "person", label: "Person" },
							{ key: "role", label: "Role" },
							{ key: "status", label: "Status" },
						]}
						rows={[
							{
								person: { type: "avatar", name: "Alice Martin", src: "https://i.pravatar.cc/150?u=alice", subtitle: "Engineering" },
								role: "Tech Lead",
								status: { type: "badge", value: "Active", variant: "success" },
							},
							{
								person: { type: "avatar", name: "Bob Chen", src: "https://i.pravatar.cc/150?u=bob", subtitle: "Design" },
								role: "Senior Designer",
								status: { type: "badge", value: "On Leave", variant: "warning" },
							},
						]}
					/>
				</DocExample>

				<DocExample
					title="With Trend Cells"
					description="Trend cells show positive/negative values with arrows."
					code={`<DataGrid
  title="Monthly Metrics"
  columns={[
    { key: "metric", label: "Metric" },
    { key: "value", label: "Value", align: "right" },
    { key: "change", label: "Change", align: "right" },
  ]}
  rows={[
    { metric: "MRR", value: "$48.2K", change: { type: "trend", value: 12.3 } },
    { metric: "Churn", value: "3.1%", change: { type: "trend", value: -0.8 } },
    { metric: "NPS", value: "72", change: { type: "trend", value: 5, suffix: "pts" } },
  ]}
/>`}
				>
					<DataGrid
						title="Monthly Metrics"
						columns={[
							{ key: "metric", label: "Metric" },
							{ key: "value", label: "Value", align: "right" },
							{ key: "change", label: "Change", align: "right" },
						]}
						rows={[
							{ metric: "MRR", value: "$48.2K", change: { type: "trend", value: 12.3 } },
							{ metric: "Churn", value: "3.1%", change: { type: "trend", value: -0.8 } },
							{ metric: "NPS", value: "72", change: { type: "trend", value: 5, suffix: "pts" } },
						]}
					/>
				</DocExample>

				<DocExample
					title="Sorted Column"
					description="Mark a column as sorted to show a direction arrow in the header."
					code={`<DataGrid
  columns={[
    { key: "product", label: "Product" },
    { key: "revenue", label: "Revenue", align: "right", sorted: "desc" },
  ]}
  rows={[
    { product: "Enterprise Plan", revenue: "$124K" },
    { product: "Pro Plan", revenue: "$86K" },
    { product: "Starter Plan", revenue: "$32K" },
  ]}
/>`}
				>
					<DataGrid
						columns={[
							{ key: "product", label: "Product" },
							{ key: "revenue", label: "Revenue", align: "right", sorted: "desc" },
						]}
						rows={[
							{ product: "Enterprise Plan", revenue: "$124K" },
							{ product: "Pro Plan", revenue: "$86K" },
							{ product: "Starter Plan", revenue: "$32K" },
						]}
					/>
				</DocExample>
				<DocExample
					title="Clickable Rows"
					description="Add href to each row to make it a navigable link. Rows get a hover state and are keyboard accessible."
					code={`<DataGrid
  title="Team Members"
  columns={[
    { key: "person", label: "Person" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ]}
  rows={[
    {
      href: "/contacts/1",
      person: { type: "avatar", name: "Alice Martin", subtitle: "Engineering" },
      role: "Tech Lead",
      status: { type: "badge", value: "Active", variant: "success" },
    },
    {
      href: "/contacts/2",
      person: { type: "avatar", name: "Bob Chen", subtitle: "Design" },
      role: "Senior Designer",
      status: { type: "badge", value: "On Leave", variant: "warning" },
    },
    {
      href: "/contacts/3",
      person: { type: "avatar", name: "Clara Diaz", subtitle: "Product" },
      role: "PM",
      status: { type: "badge", value: "Active", variant: "success" },
    },
  ]}
/>`}
				>
					<DataGrid
						title="Team Members"
						columns={[
							{ key: "person", label: "Person" },
							{ key: "role", label: "Role" },
							{ key: "status", label: "Status" },
						]}
						rows={[
							{
								href: "#",
								person: { type: "avatar", name: "Alice Martin", src: "https://i.pravatar.cc/150?u=alice", subtitle: "Engineering" },
								role: "Tech Lead",
								status: { type: "badge", value: "Active", variant: "success" },
							},
							{
								href: "#",
								person: { type: "avatar", name: "Bob Chen", src: "https://i.pravatar.cc/150?u=bob", subtitle: "Design" },
								role: "Senior Designer",
								status: { type: "badge", value: "On Leave", variant: "warning" },
							},
							{
								href: "#",
								person: { type: "avatar", name: "Clara Diaz", src: "https://i.pravatar.cc/150?u=clara", subtitle: "Product" },
								role: "PM",
								status: { type: "badge", value: "Active", variant: "success" },
							},
						]}
					/>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
