"use client"

import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
	List,
	LayoutGrid,
	Columns3,
	Rows3,
	ArrowUpDown,
	ListFilter,
	Calendar,
	Kanban,
	Table,
} from "lucide-react"
import {
	ViewConfigPanel,
	ViewConfigTabs,
	ViewConfigSection,
	ViewConfigDivider,
	ViewConfigFilterRow,
	ViewConfigToggle,
	ViewConfigPropertyToggles,
	ViewConfigFooter,
	ViewConfigFooterAction,
} from "@blazz/ui/components/blocks/view-config-panel"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@blazz/ui/components/ui/select"
import { Button } from "@blazz/ui/components/ui/button"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleSync } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocPropGroup } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"

export const Route = createFileRoute("/_docs/docs/blocks/view-config-panel")({
	component: ViewConfigPanelPage,
})

/* ─── TOC ─── */

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "basic", title: "Basic" },
	{ id: "board-config", title: "Board config" },
	{ id: "minimal", title: "Minimal" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

/* ─── Code examples ─── */

const codeBasic = `import {
  ViewConfigPanel, ViewConfigTabs, ViewConfigSection,
  ViewConfigDivider, ViewConfigFilterRow, ViewConfigToggle,
  ViewConfigPropertyToggles, ViewConfigFooter, ViewConfigFooterAction,
} from "@blazz/ui/components/blocks/view-config-panel"
import { List, LayoutGrid, Columns3, Rows3, ArrowUpDown } from "lucide-react"

const [view, setView] = useState("list")
const [activeProps, setActiveProps] = useState(["status", "assignee", "priority"])

<ViewConfigPanel>
  <ViewConfigTabs
    tabs={[
      { value: "list", label: "List", icon: List },
      { value: "board", label: "Board", icon: LayoutGrid },
    ]}
    value={view}
    onValueChange={setView}
  />

  <ViewConfigSection>
    <ViewConfigFilterRow icon={Columns3} label="Columns">
      <Select items={[...]} value="status" onValueChange={...}>...</Select>
    </ViewConfigFilterRow>
    <ViewConfigFilterRow icon={Rows3} label="Rows">
      <Select items={[...]} value="none" onValueChange={...}>...</Select>
    </ViewConfigFilterRow>
    <ViewConfigFilterRow icon={ArrowUpDown} label="Ordering">
      <Select items={[...]} value="updated" onValueChange={...}>...</Select>
    </ViewConfigFilterRow>
  </ViewConfigSection>

  <ViewConfigDivider />

  <ViewConfigSection>
    <ViewConfigToggle label="Order completed by recency" />
    <ViewConfigToggle label="Show sub-issues" defaultChecked />
  </ViewConfigSection>

  <ViewConfigDivider />

  <ViewConfigSection title="Display properties">
    <ViewConfigPropertyToggles
      properties={[
        { value: "status", label: "Status" },
        { value: "assignee", label: "Assignee" },
        { value: "priority", label: "Priority" },
      ]}
      value={activeProps}
      onValueChange={setActiveProps}
    />
  </ViewConfigSection>

  <ViewConfigFooter>
    <ViewConfigFooterAction>Reset</ViewConfigFooterAction>
    <ViewConfigFooterAction variant="accent">Set default for everyone</ViewConfigFooterAction>
  </ViewConfigFooter>
</ViewConfigPanel>`

const codeBoardConfig = `<ViewConfigPanel>
  <ViewConfigTabs
    tabs={[
      { value: "list", label: "List", icon: List },
      { value: "board", label: "Board", icon: LayoutGrid },
    ]}
    value="board"
    onValueChange={setView}
  />

  <ViewConfigSection>
    <ViewConfigFilterRow icon={Columns3} label="Columns">
      <Select ...>Status</Select>
    </ViewConfigFilterRow>
    <ViewConfigFilterRow icon={Rows3} label="Rows">
      <Select ...>No grouping</Select>
    </ViewConfigFilterRow>
  </ViewConfigSection>

  <ViewConfigDivider />

  <ViewConfigSection title="Board options">
    <ViewConfigToggle label="Show empty columns" />
    <ViewConfigToggle label="Show column totals" defaultChecked />
  </ViewConfigSection>

  <ViewConfigSection title="Display properties">
    <ViewConfigPropertyToggles
      properties={properties}
      value={activeProps}
      onValueChange={setActiveProps}
    />
  </ViewConfigSection>
</ViewConfigPanel>`

const codeMinimal = `<ViewConfigPanel width={240}>
  <ViewConfigSection>
    <ViewConfigToggle label="Compact mode" />
    <ViewConfigToggle label="Show avatars" defaultChecked />
    <ViewConfigToggle label="Wrap text" />
  </ViewConfigSection>

  <ViewConfigDivider />

  <ViewConfigSection title="Visible columns">
    <ViewConfigPropertyToggles
      properties={columns}
      value={visibleColumns}
      onValueChange={setVisibleColumns}
    />
  </ViewConfigSection>
</ViewConfigPanel>`

/* ─── Props ─── */

const propGroups: DocPropGroup[] = [
	{
		title: "ViewConfigPanel",
		props: [
			{
				name: "width",
				type: "number",
				default: "280",
				description: "Panel width in pixels.",
			},
			{
				name: "className",
				type: "string",
				description: "Additional CSS classes on the root container.",
			},
		],
	},
	{
		title: "ViewConfigTabs",
		props: [
			{
				name: "tabs",
				type: "ViewConfigTab[]",
				description:
					'Array of tabs: { value: string, label: string, icon: LucideIcon }.',
				required: true,
			},
			{
				name: "value",
				type: "string",
				description: "Currently active tab value.",
				required: true,
			},
			{
				name: "onValueChange",
				type: "(value: string) => void",
				description: "Callback when the active tab changes.",
				required: true,
			},
		],
	},
	{
		title: "ViewConfigSection",
		props: [
			{
				name: "title",
				type: "string",
				description:
					'Optional section heading (e.g. "Board options", "Display properties").',
			},
		],
	},
	{
		title: "ViewConfigFilterRow",
		props: [
			{
				name: "icon",
				type: "LucideIcon",
				description: "Leading icon for the row.",
			},
			{
				name: "label",
				type: "string",
				description: "Row label displayed before the control slot.",
				required: true,
			},
			{
				name: "children",
				type: "ReactNode",
				description:
					"Control(s) rendered on the right side (Select, Button, etc.).",
			},
		],
	},
	{
		title: "ViewConfigToggle",
		props: [
			{
				name: "label",
				type: "string",
				description: "Toggle label.",
				required: true,
			},
			{
				name: "checked",
				type: "boolean",
				description: "Controlled checked state.",
			},
			{
				name: "defaultChecked",
				type: "boolean",
				description: "Initial checked state (uncontrolled).",
			},
			{
				name: "onCheckedChange",
				type: "(checked: boolean) => void",
				description: "Callback when the toggle changes.",
			},
			{
				name: "disabled",
				type: "boolean",
				default: "false",
				description: "Disable the toggle.",
			},
		],
	},
	{
		title: "ViewConfigPropertyToggles",
		props: [
			{
				name: "properties",
				type: "{ value: string, label: string }[]",
				description: "All available properties to display as chips.",
				required: true,
			},
			{
				name: "value",
				type: "string[]",
				description: "Currently active property values.",
				required: true,
			},
			{
				name: "onValueChange",
				type: "(value: string[]) => void",
				description: "Callback when a property is toggled.",
			},
		],
	},
	{
		title: "ViewConfigFooterAction",
		props: [
			{
				name: "variant",
				type: '"default" | "accent"',
				default: '"default"',
				description:
					"Visual variant. Use accent for the primary action.",
			},
		],
	},
]

/* ─── Shared demo data ─── */

const allProperties = [
	{ value: "id", label: "ID" },
	{ value: "status", label: "Status" },
	{ value: "assignee", label: "Assignee" },
	{ value: "priority", label: "Priority" },
	{ value: "project", label: "Project" },
	{ value: "due_date", label: "Due date" },
	{ value: "milestone", label: "Milestone" },
	{ value: "labels", label: "Labels" },
	{ value: "links", label: "Links" },
	{ value: "time_in_status", label: "Time in status" },
	{ value: "created", label: "Created" },
	{ value: "updated", label: "Updated" },
]

const columnItems = [
	{ value: "status", label: "Status" },
	{ value: "priority", label: "Priority" },
	{ value: "assignee", label: "Assignee" },
	{ value: "project", label: "Project" },
]

const rowItems = [
	{ value: "none", label: "No grouping" },
	{ value: "status", label: "Status" },
	{ value: "priority", label: "Priority" },
	{ value: "assignee", label: "Assignee" },
]

const orderItems = [
	{ value: "updated", label: "Updated" },
	{ value: "created", label: "Created" },
	{ value: "priority", label: "Priority" },
	{ value: "status", label: "Status" },
]

/* ─── Interactive demos ─── */

function FullDemo() {
	const [view, setView] = React.useState("board")
	const [columns, setColumns] = React.useState("status")
	const [rows, setRows] = React.useState("none")
	const [ordering, setOrdering] = React.useState("updated")
	const [activeProps, setActiveProps] = React.useState([
		"id",
		"status",
		"assignee",
		"priority",
		"project",
		"due_date",
	])

	return (
		<ViewConfigPanel>
			<ViewConfigTabs
				tabs={[
					{ value: "list", label: "List", icon: List },
					{ value: "board", label: "Board", icon: LayoutGrid },
				]}
				value={view}
				onValueChange={setView}
			/>

			<ViewConfigSection>
				<ViewConfigFilterRow icon={Columns3} label="Columns">
					<Select
						items={columnItems}
						value={columns}
						onValueChange={setColumns}
					>
						<SelectTrigger size="sm" className="h-7 flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{columnItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ViewConfigFilterRow>
				<ViewConfigFilterRow icon={Rows3} label="Rows">
					<Select
						items={rowItems}
						value={rows}
						onValueChange={setRows}
					>
						<SelectTrigger size="sm" className="h-7 flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{rowItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ViewConfigFilterRow>
				<ViewConfigFilterRow icon={ArrowUpDown} label="Ordering">
					<Select
						items={orderItems}
						value={ordering}
						onValueChange={setOrdering}
					>
						<SelectTrigger size="sm" className="h-7 flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{orderItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button variant="ghost" size="icon-xs">
						<ListFilter className="size-3.5" />
					</Button>
				</ViewConfigFilterRow>
			</ViewConfigSection>

			<ViewConfigDivider />

			<ViewConfigSection>
				<ViewConfigToggle label="Order completed by recency" />
				<ViewConfigToggle label="Show sub-issues" defaultChecked />
			</ViewConfigSection>

			<ViewConfigDivider />

			<ViewConfigSection title="Board options">
				<ViewConfigToggle label="Show empty columns" />
			</ViewConfigSection>

			<ViewConfigSection title="Display properties">
				<ViewConfigPropertyToggles
					properties={allProperties}
					value={activeProps}
					onValueChange={setActiveProps}
				/>
			</ViewConfigSection>

			<ViewConfigFooter>
				<ViewConfigFooterAction
					onClick={() =>
						setActiveProps([
							"id",
							"status",
							"assignee",
							"priority",
							"project",
							"due_date",
						])
					}
				>
					Reset
				</ViewConfigFooterAction>
				<ViewConfigFooterAction variant="accent">
					Set default for everyone
				</ViewConfigFooterAction>
			</ViewConfigFooter>
		</ViewConfigPanel>
	)
}

function BoardConfigDemo() {
	const [view, setView] = React.useState("board")
	const [activeProps, setActiveProps] = React.useState([
		"status",
		"priority",
		"assignee",
	])

	return (
		<ViewConfigPanel>
			<ViewConfigTabs
				tabs={[
					{ value: "list", label: "List", icon: List },
					{ value: "board", label: "Board", icon: LayoutGrid },
				]}
				value={view}
				onValueChange={setView}
			/>

			<ViewConfigSection>
				<ViewConfigFilterRow icon={Columns3} label="Columns">
					<Select
						items={columnItems}
						value="status"
						onValueChange={() => {}}
					>
						<SelectTrigger size="sm" className="h-7 flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{columnItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ViewConfigFilterRow>
				<ViewConfigFilterRow icon={Rows3} label="Rows">
					<Select
						items={rowItems}
						value="none"
						onValueChange={() => {}}
					>
						<SelectTrigger size="sm" className="h-7 flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{rowItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ViewConfigFilterRow>
			</ViewConfigSection>

			<ViewConfigDivider />

			<ViewConfigSection title="Board options">
				<ViewConfigToggle label="Show empty columns" />
				<ViewConfigToggle label="Show column totals" defaultChecked />
			</ViewConfigSection>

			<ViewConfigSection title="Display properties">
				<ViewConfigPropertyToggles
					properties={allProperties.slice(0, 8)}
					value={activeProps}
					onValueChange={setActiveProps}
				/>
			</ViewConfigSection>
		</ViewConfigPanel>
	)
}

function MinimalDemo() {
	const columns = [
		{ value: "name", label: "Name" },
		{ value: "status", label: "Status" },
		{ value: "owner", label: "Owner" },
		{ value: "date", label: "Date" },
		{ value: "amount", label: "Amount" },
		{ value: "source", label: "Source" },
	]
	const [visible, setVisible] = React.useState([
		"name",
		"status",
		"owner",
		"date",
	])

	return (
		<ViewConfigPanel width={240}>
			<ViewConfigSection>
				<ViewConfigToggle label="Compact mode" />
				<ViewConfigToggle label="Show avatars" defaultChecked />
				<ViewConfigToggle label="Wrap text" />
			</ViewConfigSection>

			<ViewConfigDivider />

			<ViewConfigSection title="Visible columns">
				<ViewConfigPropertyToggles
					properties={columns}
					value={visible}
					onValueChange={setVisible}
				/>
			</ViewConfigSection>
		</ViewConfigPanel>
	)
}

/* ─── Page ─── */

function ViewConfigPanelPage() {
	return (
		<DocPage
			title="View Config Panel"
			subtitle="Panneau de configuration de vue pour tables et boards. Inspiré de Linear, permet de switcher de vue, configurer les filtres, toggles et propriétés affichées."
			toc={toc}
		>
			<DocHero>
				<div className="flex justify-center">
					<FullDemo />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples" />

			<DocSection id="basic" title="Basic">
				<DocExampleSync
					title="Full configuration"
					description="Panel complet avec tabs, filtres, toggles, propriétés et footer."
					code={codeBasic}
				>
					<div className="flex justify-center">
						<FullDemo />
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="board-config" title="Board config">
				<DocExampleSync
					title="Board-specific options"
					description="Configuration orientée kanban board avec options spécifiques."
					code={codeBoardConfig}
				>
					<div className="flex justify-center">
						<BoardConfigDemo />
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="minimal" title="Minimal">
				<DocExampleSync
					title="Toggles + column picker"
					description="Version allégée : uniquement des toggles et un sélecteur de colonnes visibles."
					code={codeMinimal}
				>
					<div className="flex justify-center">
						<MinimalDemo />
					</div>
				</DocExampleSync>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable groups={propGroups} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Filter Bar",
							href: "/docs/blocks/filter-bar",
							description:
								"URL-driven filter bar for search, select and date filters.",
						},
						{
							title: "Filter Panel",
							href: "/docs/components/ui/filter-panel",
							description:
								"Faceted filter panel with checkboxes and tree items.",
						},
						{
							title: "Data Table",
							href: "/docs/blocks/data-table",
							description:
								"Full-featured data table with views, sorting, filtering and more.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
