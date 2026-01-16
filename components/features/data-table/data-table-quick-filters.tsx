"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import type { DataTableColumnDef, FilterGroup } from "./data-table.types"
import { useDataTableTranslations } from "./data-table.i18n"

export interface DataTableQuickFiltersProps<TData> {
	columns: DataTableColumnDef<TData, any>[]
	filterGroup: FilterGroup | null
	onFilterChange: (filterGroup: FilterGroup | null) => void
	onOpenFilterBuilder: () => void
	locale?: "fr" | "en"
}

export function DataTableQuickFilters<TData>({
	columns,
	filterGroup,
	onFilterChange,
	onOpenFilterBuilder,
	locale = "fr",
}: DataTableQuickFiltersProps<TData>) {
	const t = useDataTableTranslations(locale)

	// Helper to get column key
	const getColumnKey = (col: DataTableColumnDef<TData, any>): string | undefined => {
		return "accessorKey" in col ? (col.accessorKey as string) : undefined
	}

	// Extract columns with showQuickFilter enabled
	const quickFilterColumns = React.useMemo(
		() =>
			columns.filter(
				(col) => col.filterConfig?.showQuickFilter === true && getColumnKey(col) !== undefined
			),
		[columns]
	)

	// Track selected values for each quick filter column
	const [quickFilterValues, setQuickFilterValues] = React.useState<Record<string, any>>({})

	// Sync with current filterGroup
	React.useEffect(() => {
		if (filterGroup) {
			const values: Record<string, any> = {}
			filterGroup.conditions.forEach((condition) => {
				if ("column" in condition) {
					values[condition.column] = condition.value
				}
			})
			setQuickFilterValues(values)
		} else {
			setQuickFilterValues({})
		}
	}, [filterGroup])

	// Handle filter change for a specific column
	const handleQuickFilterChange = React.useCallback(
		(column: string, value: any) => {
			// Remove existing condition for this column
			const newConditions =
				filterGroup?.conditions.filter((c) => !("column" in c) || c.column !== column) || []

			// Add new condition if value is not empty
			if (value !== null && value !== undefined && value !== "") {
				const columnDef = columns.find((col) => getColumnKey(col) === column)
				const filterType = columnDef?.filterConfig?.type || "text"

				newConditions.push({
					id: `quick-${column}-${Date.now()}`,
					column,
					operator: filterType === "select" ? "equals" : "contains",
					value,
					type: filterType,
				})
			}

			// Update filter group
			if (newConditions.length > 0) {
				onFilterChange({
					id: "root",
					operator: "AND",
					conditions: newConditions,
				})
			} else {
				onFilterChange(null)
			}
		},
		[filterGroup, columns, onFilterChange]
	)

	// Clear all filters
	const handleClearAll = React.useCallback(() => {
		onFilterChange(null)
	}, [onFilterChange])

	// Get column label from header
	const getColumnLabel = (column: DataTableColumnDef<TData, any>): string => {
		if (typeof column.header === "string") {
			return column.header
		}
		return getColumnKey(column) || "Filter"
	}

	// Don't render if no quick filter columns
	if (quickFilterColumns.length === 0) {
		return null
	}

	const hasActiveFilters = filterGroup && filterGroup.conditions.length > 0

	return (
		<div className="flex items-center gap-2 border-y border-border px-4 py-3">
			{/* Quick filter dropdowns/inputs */}
			{quickFilterColumns.map((column) => {
				const columnKey = getColumnKey(column)!
				const config = column.filterConfig!
				const currentValue = quickFilterValues[columnKey]

				if (config.type === "select") {
					return (
						<Select
							key={columnKey}
							value={currentValue || ""}
							onValueChange={(value) => handleQuickFilterChange(columnKey, value)}
						>
							<SelectTrigger className="h-8 w-[180px]">
								<SelectValue placeholder={getColumnLabel(column)} />
							</SelectTrigger>
							<SelectContent>
								{config.options?.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)
				}

				// Text filters with debounce
				return (
					<Input
						key={columnKey}
						type="text"
						placeholder={config.placeholder || getColumnLabel(column)}
						value={currentValue || ""}
						onChange={(e) => handleQuickFilterChange(columnKey, e.target.value)}
						className="h-8 w-[180px]"
					/>
				)
			})}

			{/* Add Filter button */}
			<Button variant="ghost" size="sm" onClick={onOpenFilterBuilder} className="h-8 px-3 text-xs">
				<Plus className="mr-1 h-3 w-3" />
				{t.addFilter}
			</Button>

			{/* Clear All button - only show when filters exist */}
			{hasActiveFilters && (
				<Button variant="ghost" size="sm" onClick={handleClearAll} className="h-8 px-3 text-xs">
					<X className="mr-1 h-3 w-3" />
					{t.clearAll}
				</Button>
			)}
		</div>
	)
}
