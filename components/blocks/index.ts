// Block components — high-level, opinionated components for CRM/backoffice pages
// Imported as @/components/blocks/[component-name]

export { PageHeader } from "./page-header"
export type { PageHeaderProps, PageHeaderAction, PageHeaderBreadcrumb } from "./page-header"

export { EmptyState } from "./empty-state"
export type { EmptyStateProps, EmptyStateAction } from "./empty-state"

export { ErrorState } from "./error-state"
export type { ErrorStateProps } from "./error-state"

export { StatsGrid } from "./stats-grid"
export type { StatsGridProps, StatItem } from "./stats-grid"

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

export { ChartCard } from "./chart-card"
export type { ChartCardProps } from "./chart-card"

export { DataGrid } from "./data-grid"
export type { DataGridProps, ColumnDef, RowAction, DataGridBulkAction } from "./data-grid"

export { FilterBar } from "./filter-bar"
export type { FilterBarProps, FilterConfig, SearchFilterConfig, SelectFilterConfig, DateFilterConfig } from "./filter-bar"

export { MultiStepForm } from "./multi-step-form"
export type { MultiStepFormProps, FormStep, StepComponentProps } from "./multi-step-form"

export { SplitView } from "./split-view"
export type { SplitViewProps } from "./split-view"
