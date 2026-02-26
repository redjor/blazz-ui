// Block components — high-level, opinionated components for CRM/backoffice pages
// Imported as @/components/blocks/[component-name]

export { PageHeader } from "./page-header"
export type { PageHeaderProps, PageHeaderAction, PageHeaderBreadcrumb } from "./page-header"

export { Empty } from "../ui/empty"
export type { EmptyAction } from "../ui/empty"

export { ErrorState } from "./error-state"
export type { ErrorStateProps } from "./error-state"

export { StatsGrid } from "./stats-grid"
export type { StatsGridProps, StatItem } from "./stats-grid"

export { StatsStrip } from "./stats-strip"
export type { StatsStripProps, StatsStripItem } from "./stats-strip"

export { FieldGrid, Field } from "./field-grid"
export type { FieldGridProps, FieldProps } from "./field-grid"

export { DetailPanel } from "./detail-panel"
export type {
	DetailPanelProps,
	DetailPanelHeaderProps,
	DetailPanelSectionProps,
	DetailPanelAction,
} from "./detail-panel"

export { ActivityTimeline } from "./activity-timeline"
export type { ActivityTimelineProps, TimelineEvent } from "./activity-timeline"

export { StatusFlow } from "./status-flow"
export type { StatusFlowProps, StatusDefinition, StatusTransition } from "./status-flow"

export { FormSection } from "./form-section"
export type { FormSectionProps } from "./form-section"

export { FormField } from "./form-field"
export type { FormFieldProps, FormFieldOption } from "./form-field"

export { BulkActionBar } from "./bulk-action-bar"
export type { BulkActionBarProps, BulkAction } from "./bulk-action-bar"

export { AreaChartBlock } from "./area-chart-block"
export type { AreaChartBlockProps } from "./area-chart-block"

export { BarChartBlock } from "./bar-chart-block"
export type { BarChartBlockProps } from "./bar-chart-block"

export { ChartCard } from "./chart-card"
export type { ChartCardProps } from "./chart-card"

export { LineChartBlock } from "./line-chart-block"
export type { LineChartBlockProps } from "./line-chart-block"

export { PieChartBlock } from "./pie-chart-block"
export type { PieChartBlockProps } from "./pie-chart-block"

export { RadarChartBlock } from "./radar-chart-block"
export type { RadarChartBlockProps } from "./radar-chart-block"

export { DataGrid } from "./data-grid"
export type { DataGridProps, ColumnDef, RowAction, DataGridBulkAction } from "./data-grid"

export { FilterBar } from "./filter-bar"
export type { FilterBarProps, FilterConfig, SearchFilterConfig, SelectFilterConfig, DateFilterConfig } from "./filter-bar"

export { MultiStepForm } from "./multi-step-form"
export type { MultiStepFormProps, FormStep, StepComponentProps } from "./multi-step-form"

export { SplitView } from "./split-view"
export type { SplitViewProps } from "./split-view"

export { NotificationCenter, NotificationList, NotificationGroup, NotificationItem, NotificationTrigger } from "./notification-center"
export type {
	NotificationCenterProps,
	NotificationListProps,
	NotificationGroupProps,
	NotificationItemProps,
	NotificationTriggerProps,
	Notification,
	NotificationAction,
} from "./notification-center"

export { OrgMenu } from "./org-menu"
export type { OrgMenuProps, Organization } from "./org-menu"

export { PropertyCard } from "./property-card"
export type { PropertyCardProps, PropertyCardItemProps } from "./property-card"
