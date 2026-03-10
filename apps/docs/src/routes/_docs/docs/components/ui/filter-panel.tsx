"use client"

import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
	Search,
	Settings2,
	Repeat,
	BarChart3,
	Percent,
	Activity,
	Layers,
	CircleDot,
	CircleOff,
} from "lucide-react"
import {
	FilterPanel,
	FilterPanelHeader,
	FilterPanelTabs,
	FilterPanelActions,
	FilterPanelAction,
	FilterPanelSection,
	FilterPanelCheckboxItem,
	FilterPanelTreeItem,
} from "@blazz/ui/components/ui/filter-panel"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "filter-panel-props", title: "FilterPanel Props" },
	{ id: "tree-item-props", title: "TreeItem Props" },
	{ id: "checkbox-item-props", title: "CheckboxItem Props" },
	{ id: "guidelines", title: "Guidelines" },
]

const filterPanelProps: DocProp[] = [
	{
		name: "width",
		type: "number",
		default: "340",
		description: "Width of the panel in pixels.",
	},
]

const treeItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Text label for the collapsible parent.",
	},
	{
		name: "count",
		type: "number",
		description: "Optional count displayed on the right side.",
	},
	{
		name: "icon",
		type: "ReactNode",
		description: "Icon rendered before the label.",
	},
	{
		name: "open",
		type: "boolean",
		description: "Controlled open state.",
	},
	{
		name: "defaultOpen",
		type: "boolean",
		default: "true",
		description: "Default open state (uncontrolled).",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Callback when the open state changes.",
	},
]

const checkboxItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Text label for the checkbox item.",
	},
	{
		name: "count",
		type: "number",
		description: "Optional count displayed on the right side.",
	},
	{
		name: "checked",
		type: "boolean",
		description: "Controlled checked state.",
	},
	{
		name: "defaultChecked",
		type: "boolean",
		description: "Default checked state (uncontrolled).",
	},
	{
		name: "onCheckedChange",
		type: "(checked: boolean) => void",
		description: "Callback when the checkbox state changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Disable the checkbox item.",
	},
	{
		name: "depth",
		type: "number",
		default: "0",
		description: "Nesting depth for tree indentation (0 = root, 1 = child, etc.).",
	},
	{
		name: "icon",
		type: "ReactNode",
		description: "Icon rendered before the checkbox.",
	},
]

const examples = [
	{
		key: "default",
		code: `<FilterPanel>
  <FilterPanelHeader>
    <FilterPanelTabs
      tabs={["Market", "Insights", "Watchlist"]}
      value={tab}
      onValueChange={setTab}
    />
    <FilterPanelActions>
      <FilterPanelAction><Search className="size-4" /></FilterPanelAction>
      <FilterPanelAction><Settings2 className="size-4" /></FilterPanelAction>
    </FilterPanelActions>
  </FilterPanelHeader>
  <FilterPanelSection label="Market type">
    <FilterPanelTreeItem icon={<Repeat />} label="Perpetuals" count={45}>
      <FilterPanelCheckboxItem icon={<BarChart3 />} label="Open Interest" count={12} depth={1} checked />
      <FilterPanelCheckboxItem icon={<Percent />} label="Funding Rates" count={8} depth={1} />
    </FilterPanelTreeItem>
    <FilterPanelCheckboxItem icon={<Activity />} label="High Volatility" count={10} />
    <FilterPanelCheckboxItem icon={<Layers />} label="Options" count={3} />
    <FilterPanelCheckboxItem icon={<CircleDot />} label="Spot Only" count={42} />
    <FilterPanelCheckboxItem icon={<CircleOff />} label="No Active Market" count={8} />
  </FilterPanelSection>
</FilterPanel>`,
	},
	{
		key: "minimal",
		code: `<FilterPanel width={240}>
  <FilterPanelSection label="Status">
    <FilterPanelCheckboxItem label="Active" count={24} />
    <FilterPanelCheckboxItem label="Pending" count={7} />
    <FilterPanelCheckboxItem label="Archived" count={156} />
  </FilterPanelSection>
</FilterPanel>`,
	},
	{
		key: "multi-section",
		code: `<FilterPanel>
  <FilterPanelSection label="Category">
    <FilterPanelCheckboxItem label="Technology" count={89} />
    <FilterPanelCheckboxItem label="Finance" count={34} />
    <FilterPanelCheckboxItem label="Healthcare" count={21} />
  </FilterPanelSection>
  <FilterPanelSection label="Region">
    <FilterPanelCheckboxItem label="North America" count={56} />
    <FilterPanelCheckboxItem label="Europe" count={43} />
    <FilterPanelCheckboxItem label="Asia Pacific" count={28} />
  </FilterPanelSection>
</FilterPanel>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/filter-panel")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: FilterPanelPage,
})

function DefaultExample() {
	const [tab, setTab] = useState("Market")
	const [checked, setChecked] = useState<Record<string, boolean>>({
		"Open Interest": true,
	})

	const toggle = (key: string) => (value: boolean) =>
		setChecked((prev) => ({ ...prev, [key]: value }))

	return (
		<FilterPanel>
			<FilterPanelHeader>
				<FilterPanelTabs
					tabs={["Market", "Insights", "Watchlist"]}
					value={tab}
					onValueChange={setTab}
				/>
				<FilterPanelActions>
					<FilterPanelAction aria-label="Search">
						<Search className="size-4" />
					</FilterPanelAction>
					<FilterPanelAction aria-label="Settings">
						<Settings2 className="size-4" />
					</FilterPanelAction>
				</FilterPanelActions>
			</FilterPanelHeader>
			<FilterPanelSection label="Market type">
				<FilterPanelTreeItem icon={<Repeat className="size-3.5" />} label="Perpetuals" count={45}>
					<FilterPanelCheckboxItem
						icon={<BarChart3 className="size-3.5" />}
						label="Open Interest"
						count={12}
						depth={1}
						checked={checked["Open Interest"] ?? false}
						onCheckedChange={toggle("Open Interest")}
					/>
					<FilterPanelCheckboxItem
						icon={<Percent className="size-3.5" />}
						label="Funding Rates"
						count={8}
						depth={1}
						checked={checked["Funding Rates"] ?? false}
						onCheckedChange={toggle("Funding Rates")}
					/>
				</FilterPanelTreeItem>
				<FilterPanelCheckboxItem
					icon={<Activity className="size-3.5" />}
					label="High Volatility"
					count={10}
					checked={checked["High Volatility"] ?? false}
					onCheckedChange={toggle("High Volatility")}
				/>
				<FilterPanelCheckboxItem
					icon={<Layers className="size-3.5" />}
					label="Options"
					count={3}
					checked={checked["Options"] ?? false}
					onCheckedChange={toggle("Options")}
				/>
				<FilterPanelCheckboxItem
					icon={<CircleDot className="size-3.5" />}
					label="Spot Only"
					count={42}
					checked={checked["Spot Only"] ?? false}
					onCheckedChange={toggle("Spot Only")}
				/>
				<FilterPanelCheckboxItem
					icon={<CircleOff className="size-3.5" />}
					label="No Active Market"
					count={8}
					checked={checked["No Active Market"] ?? false}
					onCheckedChange={toggle("No Active Market")}
				/>
			</FilterPanelSection>
		</FilterPanel>
	)
}

function MinimalExample() {
	return (
		<FilterPanel width={240}>
			<FilterPanelSection label="Status">
				<FilterPanelCheckboxItem label="Active" count={24} defaultChecked />
				<FilterPanelCheckboxItem label="Pending" count={7} />
				<FilterPanelCheckboxItem label="Archived" count={156} />
			</FilterPanelSection>
		</FilterPanel>
	)
}

function MultiSectionExample() {
	return (
		<FilterPanel>
			<FilterPanelSection label="Category">
				<FilterPanelCheckboxItem label="Technology" count={89} defaultChecked />
				<FilterPanelCheckboxItem label="Finance" count={34} />
				<FilterPanelCheckboxItem label="Healthcare" count={21} />
			</FilterPanelSection>
			<FilterPanelSection label="Region">
				<FilterPanelCheckboxItem label="North America" count={56} />
				<FilterPanelCheckboxItem label="Europe" count={43} defaultChecked />
				<FilterPanelCheckboxItem label="Asia Pacific" count={28} />
			</FilterPanelSection>
		</FilterPanel>
	)
}

function FilterPanelPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Filter Panel"
			subtitle="A compact panel with tabs, sections, and checkbox filters. Ideal for faceted filtering in data-heavy interfaces."
			toc={toc}
		>
			<DocHero>
				<DefaultExample />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Tabs & Actions"
					description="Full filter panel with tab navigation, search and settings actions, and a checkbox list with counts."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<DefaultExample />
				</DocExampleClient>

				<DocExampleClient
					title="Minimal"
					description="Simple filter panel without tabs or header, just a section with checkboxes."
					code={examples[1].code}
					highlightedCode={html("minimal")}
				>
					<MinimalExample />
				</DocExampleClient>

				<DocExampleClient
					title="Multi-Section"
					description="Multiple filter sections for different facets."
					code={examples[2].code}
					highlightedCode={html("multi-section")}
				>
					<MultiSectionExample />
				</DocExampleClient>
			</DocSection>

			<DocSection id="filter-panel-props" title="FilterPanel Props">
				<DocPropsTable props={filterPanelProps} />
			</DocSection>

			<DocSection id="tree-item-props" title="TreeItem Props">
				<DocPropsTable props={treeItemProps} />
			</DocSection>

			<DocSection id="checkbox-item-props" title="CheckboxItem Props">
				<DocPropsTable props={checkboxItemProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use inside a Popover for dropdown filter behavior</li>
					<li>Keep sections to 5-9 items max (Miller's Law) — use search for larger lists</li>
					<li>Counts help users understand data distribution before filtering</li>
					<li>Tabs are optional — use FilterPanelSection alone for simpler use cases</li>
					<li>Compose with Popover + PopoverTrigger for a dropdown trigger pattern</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
