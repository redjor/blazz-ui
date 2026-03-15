import { createFileRoute } from "@tanstack/react-router"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { type DocPropGroup, DocPropsTable } from "~/components/docs/doc-props-table"

const toc = [
	{ id: "core", title: "Core Props" },
	{ id: "features", title: "Feature Flags" },
	{ id: "styling", title: "Styling" },
	{ id: "slots", title: "Composition Slots" },
	{ id: "actions", title: "Actions" },
	{ id: "callbacks", title: "Callbacks" },
]

const propGroups: DocPropGroup[] = [
	{
		title: "Core",
		props: [
			{ name: "data", type: "TData[]", required: true, description: "Array of row data" },
			{ name: "columns", type: "DataTableColumnDef<TData>[]", required: true, description: "Column definitions — use col.* factories" },
			{ name: "getRowId", type: "(row: TData) => string", description: "Custom row ID extractor" },
			{ name: "locale", type: '"fr" | "en"', default: '"fr"', description: "Internationalization locale" },
		],
	},
	{
		title: "Feature Flags",
		props: [
			{ name: "enableSorting", type: "boolean", default: "true", description: "Enable column sorting" },
			{ name: "enableMultiSort", type: "boolean", default: "false", description: "Allow multi-column sort" },
			{ name: "enablePagination", type: "boolean", default: "true", description: "Enable pagination" },
			{ name: "enableRowSelection", type: "boolean", default: "false", description: "Enable row checkboxes" },
			{ name: "enableGlobalSearch", type: "boolean", default: "true", description: "Enable search input" },
			{ name: "enableAdvancedFilters", type: "boolean", default: "false", description: "Enable filter builder" },
			{ name: "enableCustomViews", type: "boolean", default: "false", description: "Allow creating/saving views" },
			{ name: "enableGrouping", type: "boolean", default: "false", description: "Enable row grouping" },
			{ name: "enableRowExpand", type: "boolean", default: "false", description: "Enable row expansion" },
			{ name: "enableColumnPinning", type: "boolean", default: "false", description: "Enable sticky columns" },
			{ name: "enableCellEditing", type: "boolean", default: "false", description: "Enable inline cell editing" },
		],
	},
	{
		title: "Styling",
		props: [
			{ name: "variant", type: '"default" | "lined" | "striped" | "flat" | "editable" | "spreadsheet"', default: '"lined"', description: "Visual variant" },
			{ name: "density", type: '"compact" | "default" | "comfortable"', default: '"default"', description: "Row density" },
			{ name: "toolbarLayout", type: '"classic" | "stacked"', default: '"classic"', description: "Toolbar layout mode" },
			{ name: "hideToolbar", type: "boolean", default: "false", description: "Hide the toolbar entirely" },
			{ name: "hideHeaders", type: "boolean", default: "false", description: "Hide column headers (automatic in flat variant)" },
			{ name: "className", type: "string", description: "CSS class on the <table> element" },
		],
	},
	{
		title: "Composition Slots",
		props: [
			{ name: "renderRow", type: "(row: Row<TData>) => ReactNode", description: "Custom row layout — replaces cell-based rendering. Checkbox and actions auto-injected." },
			{ name: "renderExpandedRow", type: "(row: Row<TData>) => ReactNode", description: "Content for expanded row panel" },
			{ name: "renderGroupHeader", type: "(row: Row<TData>, defaultContent: ReactNode) => ReactNode", description: "Full replacement of group header row" },
			{ name: "renderGroupHeaderContent", type: "(info: { row, groupValue, subRowCount, aggregations }) => ReactNode", description: "Replace only central content of group header" },
			{ name: "renderRowActions", type: "(row: Row<TData>) => ReactNode", description: "Replace the ... dropdown with custom actions" },
			{ name: "renderPagination", type: "(info: PaginationInfo) => ReactNode", description: "Replace default pagination with custom UI" },
			{ name: "groupRowStyle", type: "(row: Row<TData>) => CSSProperties", description: "Inline styles for group header cells" },
			{ name: "toolbarLeadingSlot", type: "ReactNode", description: "Content before view pills in toolbar" },
			{ name: "toolbarTrailingSlot", type: "ReactNode", description: "Content after icon actions in toolbar" },
			{ name: "toolbarBelowSlot", type: "ReactNode", description: "Content between toolbar and table" },
			{ name: "footerSlot", type: "ReactNode", description: "Content after table and pagination" },
			{ name: "loadingComponent", type: "ReactNode", description: "Custom loading state" },
			{ name: "emptyComponent", type: "ReactNode", description: "Custom empty state" },
		],
	},
	{
		title: "Actions",
		props: [
			{ name: "rowActions", type: "RowAction<TData>[]", description: "Dropdown menu actions per row" },
			{ name: "bulkActions", type: "BulkAction<TData>[]", description: "Actions when rows are selected" },
			{ name: "onRowClick", type: "(row: TData) => void", description: "Row click handler" },
		],
	},
	{
		title: "Callbacks",
		props: [
			{ name: "onSortingChange", type: "(sorting: SortingState) => void", description: "Called when sort changes" },
			{ name: "onPaginationChange", type: "(pagination) => void", description: "Called when page changes" },
			{ name: "onRowSelectionChange", type: "(selection) => void", description: "Called when selection changes" },
			{ name: "onGroupingChange", type: "(grouping: string[]) => void", description: "Called when grouping changes" },
			{ name: "onSearchChange", type: "(search: string) => void", description: "Called when search changes (server-side)" },
			{ name: "onCellEdit", type: "(rowId, columnId, value, previousValue) => void", description: "Called when a cell is edited" },
			{ name: "onFilterGroupChange", type: "(filterGroup) => void", description: "Called when advanced filter changes" },
		],
	},
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table/api")({
	component: ApiPage,
})

function ApiPage() {
	return (
		<DocPage title="API Reference" subtitle="Reference complete des props, types et interfaces du DataTable." toc={toc}>
			{propGroups.map((group) => (
				<DocSection key={group.title} id={group.title.toLowerCase()} title={group.title}>
					<DocPropsTable groups={[group]} />
				</DocSection>
			))}
		</DocPage>
	)
}
