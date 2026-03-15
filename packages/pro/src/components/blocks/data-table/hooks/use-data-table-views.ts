import type {
	ColumnPinningState,
	GroupingState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table"
import * as React from "react"
import type { DataTableView, FilterGroup } from "../data-table.types"

export interface UseDataTableViewsOptions {
	views?: DataTableView[]
	externalActiveView?: DataTableView | null
	defaultFilterGroup?: FilterGroup | null
	onViewChange?: (view: DataTableView) => void
	onViewSave?: (view: DataTableView) => void
	onViewUpdate?: (viewId: string, updates: Partial<DataTableView>) => void
	onViewDelete?: (viewId: string) => void
	onCreateView?: () => void
	onFilterGroupChange?: (filterGroup: FilterGroup | null) => void
	enableCustomViews?: boolean
	setSorting: (sorting: SortingState) => void
	setColumnVisibility: (vis: VisibilityState) => void
	setColumnPinning?: (pinning: ColumnPinningState) => void
	setGrouping?: (grouping: GroupingState) => void
}

export interface UseDataTableViewsReturn {
	activeView: DataTableView | null
	filterGroup: FilterGroup | null
	isFilterBuilderOpen: boolean
	setIsFilterBuilderOpen: (open: boolean) => void
	showInlineFilters: boolean
	setShowInlineFilters: (show: boolean) => void
	showSaveViewDialog: boolean
	setShowSaveViewDialog: (show: boolean) => void
	showRenameViewDialog: boolean
	setShowRenameViewDialog: (show: boolean) => void
	viewToRename: DataTableView | null
	handleViewChange: (view: DataTableView) => void
	handleFilterGroupChange: (fg: FilterGroup | null) => void
	handleCreateView: () => void
	handleSaveView: (viewData: Omit<DataTableView, "id" | "createdAt" | "updatedAt">) => void
	handleDuplicateView: (viewId: string) => void
	handleRenameView: (viewId: string) => void
	handleOverwriteView: (viewId: string) => void
	handleSaveRename: (viewId: string, newName: string) => void
}

export function useDataTableViews(
	options: UseDataTableViewsOptions,
	sorting: SortingState,
	columnVisibility: VisibilityState,
	columnPinning?: ColumnPinningState,
	grouping?: GroupingState
): UseDataTableViewsReturn {
	const {
		views,
		externalActiveView,
		defaultFilterGroup,
		onViewChange,
		onViewSave,
		onViewUpdate,
		onCreateView,
		onFilterGroupChange,
		setSorting,
		setColumnVisibility,
		setColumnPinning,
		setGrouping,
	} = options

	// Advanced filter state
	const [filterGroup, setFilterGroup] = React.useState<FilterGroup | null>(
		defaultFilterGroup || null
	)
	const [isFilterBuilderOpen, setIsFilterBuilderOpen] = React.useState(false)
	const [showInlineFilters, setShowInlineFilters] = React.useState(false)

	// Internal active view state (if not controlled externally)
	const [internalActiveView, setInternalActiveView] = React.useState<DataTableView | null>(
		externalActiveView ||
			(views && views.length > 0 ? views.find((v) => v.isDefault) || views[0] : null)
	)

	// Use external activeView if provided, otherwise use internal state
	const activeView = externalActiveView !== undefined ? externalActiveView : internalActiveView

	// Save view dialog state
	const [showSaveViewDialog, setShowSaveViewDialog] = React.useState(false)

	// Rename view dialog state
	const [showRenameViewDialog, setShowRenameViewDialog] = React.useState(false)
	const [viewToRename, setViewToRename] = React.useState<DataTableView | null>(null)

	// Apply view when it changes — always reset ALL state to defaults for missing properties
	React.useEffect(() => {
		if (!activeView) return

		// Always apply filters (default to empty)
		setFilterGroup(activeView.filters ?? { id: "root", operator: "AND", conditions: [] })

		// Auto-open/close inline filters based on whether the view has active conditions
		if (activeView.filters?.conditions?.length && activeView.filters.conditions.length > 0) {
			setShowInlineFilters(true)
		} else {
			setShowInlineFilters(false)
		}

		// Always apply sorting (default to empty)
		setSorting(activeView.sorting ?? [])

		// Always apply column visibility (default to empty = all visible)
		setColumnVisibility(activeView.columnVisibility ?? {})

		// Always apply column pinning (default to none)
		if (setColumnPinning) {
			setColumnPinning(
				activeView.pinnedColumns
					? { left: activeView.pinnedColumns.left ?? [], right: activeView.pinnedColumns.right ?? [] }
					: { left: [], right: [] }
			)
		}

		// Always apply grouping (default to none)
		if (setGrouping) {
			setGrouping(activeView.grouping ?? [])
		}
	}, [activeView, setSorting, setColumnVisibility, setColumnPinning, setGrouping])

	// Handle view change
	const handleViewChange = React.useCallback(
		(view: DataTableView) => {
			if (onViewChange) {
				onViewChange(view)
			} else {
				setInternalActiveView(view)
			}
		},
		[onViewChange]
	)

	// Handle filter group changes
	const handleFilterGroupChange = React.useCallback(
		(newFilterGroup: FilterGroup | null) => {
			setFilterGroup(newFilterGroup)
			if (onFilterGroupChange) {
				onFilterGroupChange(newFilterGroup)
			}
		},
		[onFilterGroupChange]
	)

	// Handle create view
	const handleCreateView = React.useCallback(() => {
		if (onCreateView) {
			onCreateView()
		} else {
			setShowSaveViewDialog(true)
		}
	}, [onCreateView])

	// Generate unique view ID
	const generateViewId = React.useCallback((name: string): string => {
		const slug = name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
		return `custom-${slug}-${Date.now()}`
	}, [])

	// Handle save view
	const handleSaveView = React.useCallback(
		(viewData: Omit<DataTableView, "id" | "createdAt" | "updatedAt">) => {
			const newView: DataTableView = {
				...viewData,
				id: generateViewId(viewData.name),
				filters: filterGroup || { id: "root", operator: "AND", conditions: [] },
				sorting,
				columnVisibility,
				pinnedColumns: columnPinning
					? { left: columnPinning.left ?? [], right: columnPinning.right ?? [] }
					: undefined,
				grouping: grouping && grouping.length > 0 ? grouping : undefined,
				isSystem: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			if (onViewSave) {
				onViewSave(newView)
			}

			// Si vue par défaut, mettre à jour toutes les autres vues
			if (viewData.isDefault && views && onViewUpdate) {
				for (const v of views) {
					if (v.isDefault && v.id !== newView.id) {
						onViewUpdate(v.id, { isDefault: false })
					}
				}
			}

			// Activer la nouvelle vue
			handleViewChange(newView)
			setShowSaveViewDialog(false)
			setShowInlineFilters(false)
		},
		[
			generateViewId,
			filterGroup,
			sorting,
			columnVisibility,
			columnPinning,
			grouping,
			onViewSave,
			handleViewChange,
			views,
			onViewUpdate,
		]
	)

	// Handle duplicate view
	const handleDuplicateView = React.useCallback(
		(viewId: string) => {
			const viewToDuplicate = views?.find((v) => v.id === viewId)
			if (!viewToDuplicate || !onViewSave) return

			// Create a copy with a new name
			const duplicateNumber =
				views?.filter((v) => v.name.startsWith(viewToDuplicate.name)).length || 1
			const newName = `${viewToDuplicate.name} (${duplicateNumber})`

			const duplicatedView: DataTableView = {
				...viewToDuplicate,
				id: generateViewId(newName),
				name: newName,
				isSystem: false,
				isDefault: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			onViewSave(duplicatedView)
			handleViewChange(duplicatedView)
		},
		[views, onViewSave, generateViewId, handleViewChange]
	)

	// Handle rename view (open dialog)
	const handleRenameView = React.useCallback(
		(viewId: string) => {
			const view = views?.find((v) => v.id === viewId)
			if (!view) return

			setViewToRename(view)
			setShowRenameViewDialog(true)
		},
		[views]
	)

	// Handle overwrite view (save current filters/sorting to existing view)
	const handleOverwriteView = React.useCallback(
		(viewId: string) => {
			if (!onViewUpdate) return

			onViewUpdate(viewId, {
				filters: filterGroup || { id: "root", operator: "AND", conditions: [] },
				sorting,
				columnVisibility,
				pinnedColumns: columnPinning
					? { left: columnPinning.left ?? [], right: columnPinning.right ?? [] }
					: undefined,
				grouping: grouping && grouping.length > 0 ? grouping : undefined,
				updatedAt: new Date(),
			})
		},
		[onViewUpdate, filterGroup, sorting, columnVisibility, columnPinning, grouping]
	)

	// Handle save rename
	const handleSaveRename = React.useCallback(
		(viewId: string, newName: string) => {
			if (!onViewUpdate) return

			onViewUpdate(viewId, {
				name: newName,
				updatedAt: new Date(),
			})
			setShowRenameViewDialog(false)
			setViewToRename(null)
		},
		[onViewUpdate]
	)

	return {
		activeView,
		filterGroup,
		isFilterBuilderOpen,
		setIsFilterBuilderOpen,
		showInlineFilters,
		setShowInlineFilters,
		showSaveViewDialog,
		setShowSaveViewDialog,
		showRenameViewDialog,
		setShowRenameViewDialog,
		viewToRename,
		handleViewChange,
		handleFilterGroupChange,
		handleCreateView,
		handleSaveView,
		handleDuplicateView,
		handleRenameView,
		handleOverwriteView,
		handleSaveRename,
	}
}
