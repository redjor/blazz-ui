// Block components — high-level, opinionated components for CRM/backoffice pages
// Imported as @/components/blocks/[component-name]

export type { EmptyAction } from "@blazz/ui"
export { Empty } from "@blazz/ui"
export type { ActivityTimelineProps, TimelineEvent } from "./activity-timeline"
export { ActivityTimeline } from "./activity-timeline"
export type { AreaChartBlockProps } from "./area-chart-block"
export { AreaChartBlock } from "./area-chart-block"
export type { BarChartBlockProps } from "./bar-chart-block"
export { BarChartBlock } from "./bar-chart-block"
export type { BulkAction, BulkActionBarProps } from "./bulk-action-bar"
export { BulkActionBar } from "./bulk-action-bar"
export type { ChartCardProps } from "./chart-card"
export { ChartCard } from "./chart-card"
export type {
	DetailPanelAction,
	DetailPanelHeaderProps,
	DetailPanelProps,
	DetailPanelSectionProps,
} from "./detail-panel"
export { DetailPanel } from "./detail-panel"
export type {
	DateFilterConfig,
	FilterBarProps,
	FilterConfig,
	SearchFilterConfig,
	SelectFilterConfig,
} from "./filter-bar"
export { FilterBar } from "./filter-bar"
export type {
	InboxActionType,
	InboxAuthor,
	InboxDetailEmptyProps,
	InboxDetailProps,
	InboxFilters,
	InboxHeaderProps,
	InboxItemProps,
	InboxListProps,
	InboxMenuAction,
	InboxNotification,
	InboxPanelProps,
	InboxPriority,
	InboxProps,
	InboxReadFilter,
	InboxSidebarProps,
	InboxStatusVariant,
} from "./inbox"
export {
	filterInboxItems,
	Inbox,
	InboxDetail,
	InboxDetailEmpty,
	InboxHeader,
	InboxItem,
	InboxList,
	InboxPanel,
	InboxSidebar,
} from "./inbox"
export type { LineChartBlockProps } from "./line-chart-block"
export { LineChartBlock } from "./line-chart-block"
export type { FormStep, MultiStepFormProps, StepComponentProps } from "./multi-step-form"
export { MultiStepForm } from "./multi-step-form"
export type {
	Notification,
	NotificationAction,
	NotificationCenterProps,
	NotificationGroupProps,
	NotificationItemProps,
	NotificationListProps,
	NotificationTriggerProps,
} from "./notification-center"
export {
	NotificationCenter,
	NotificationGroup,
	NotificationItem,
	NotificationList,
	NotificationTrigger,
} from "./notification-center"
export type { Organization, OrgMenuProps } from "./org-menu"
export { OrgMenu } from "./org-menu"
export type { PageHeaderAction, PageHeaderBreadcrumb, PageHeaderProps } from "./page-header"
export { PageHeader } from "./page-header"
export type { PieChartBlockProps } from "./pie-chart-block"
export { PieChartBlock } from "./pie-chart-block"
export type { PropertyCardItemProps, PropertyCardProps } from "./property-card"
export { PropertyCard } from "./property-card"
export type { RadarChartBlockProps } from "./radar-chart-block"
export { RadarChartBlock } from "./radar-chart-block"
export type { SplitViewProps } from "./split-view"
export { SplitView } from "./split-view"
export type { StatItem, StatsGridProps } from "./stats-grid"
export { StatsGrid } from "./stats-grid"
export type { StatsStripItem, StatsStripProps } from "./stats-strip"
export { StatsStrip } from "./stats-strip"
export type { StatusDefinition, StatusFlowProps, StatusTransition } from "./status-flow"
export { StatusFlow } from "./status-flow"

// ── Data Table ─────────────────────────────────
// DataTable barrel has naming conflicts (BulkAction, RowAction, FilterGroup, FilterOperator)
// Import DataTable from "@blazz/ui/components/blocks/data-table"
