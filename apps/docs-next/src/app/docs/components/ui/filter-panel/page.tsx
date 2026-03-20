
import {
import { DefaultExample, MinimalExample, MultiSectionExample } from "./demos"
	FilterPanel,
	FilterPanelAction,
	FilterPanelActions,
	FilterPanelCheckboxItem,
	FilterPanelHeader,
	FilterPanelSection,
	FilterPanelTabs,
	FilterPanelTreeItem,
} from "@blazz/ui/components/ui/filter-panel"
import {
	Activity,
	BarChart3,
	CircleDot,
	CircleOff,
	Layers,
	Percent,
	Repeat,
	Search,
	Settings2,
} from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const highlightedPromise = highlightExamples(examples as any)

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

export default async function FilterPanelPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
