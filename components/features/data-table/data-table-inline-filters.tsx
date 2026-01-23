"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { FilterGroup } from "./data-table-filter.types"
import type { DataTableColumnDef } from "./data-table.types"
import type { DataTableLocale } from "./data-table.i18n"
import { useDataTableTranslations } from "./data-table.i18n"
import { FilterDropdown } from "./data-table-inline-filter-dropdown"
import { InlineFilterBadge } from "./data-table-inline-filter-badge"
import { useInlineFilterState } from "./hooks/use-inline-filter-state"
import { formatFilterValue, getColumnKey, getFilterLabel } from "./data-table.utils"

export interface DataTableInlineFiltersProps<TData> {
	columns: DataTableColumnDef<TData, any>[]
	filterGroup: FilterGroup | null
	onFilterChange: (filterGroup: FilterGroup | null) => void
	locale?: DataTableLocale
	className?: string
}

/**
 * Inline filters component for DataTable
 *
 * Displays filters as dropdown buttons with badges for active values.
 * Supports default filters (always visible) and additional filters (via "Ajouter un filtre" dropdown).
 *
 * Features:
 * - Multi-select with checkboxes for select filters
 * - Debounced text input
 * - Typed inputs for number/date
 * - Active filter badges with "Filtre avec: value"
 * - Remove filters via X button
 *
 * @example
 * ```tsx
 * <DataTableInlineFilters
 *   columns={columns}
 *   filterGroup={filterGroup}
 *   onFilterChange={setFilterGroup}
 *   locale="fr"
 * />
 * ```
 */
export function DataTableInlineFilters<TData>({
	columns,
	filterGroup,
	onFilterChange,
	locale = "fr",
	className,
}: DataTableInlineFiltersProps<TData>) {
	const t = useDataTableTranslations(locale)

	const {
		defaultFilters,
		additionalFilters,
		activeAdditionalFilters,
		currentFilterValues,
		handleAddFilter,
		handleFilterChange,
		handleClearFilter,
	} = useInlineFilterState({ columns, filterGroup, onFilterChange })

	// If no filters configured, don't render anything
	if (defaultFilters.length === 0 && additionalFilters.length === 0) {
		return null
	}

	// Render a default filter (dropdown when inactive, badge when active)
	const renderDefaultFilter = (column: DataTableColumnDef<TData, any>) => {
		const columnKey = getColumnKey(column)
		if (!columnKey) return null

		const value = currentFilterValues[columnKey]
		const hasValue = value !== undefined && value !== null && value !== ""

		// If active, show badge cliquable with count and chevron
		if (hasValue) {
			return (
				<InlineFilterBadge
					key={columnKey}
					column={column}
					value={value}
					onChange={(newValue) => handleFilterChange(column, newValue)}
					onRemove={() => handleClearFilter(column)}
					locale={locale}
					isDefaultFilter={true}
				/>
			)
		}

		// If inactive, show dropdown
		return (
			<FilterDropdown
				key={columnKey}
				column={column}
				value={value}
				onChange={(newValue) => handleFilterChange(column, newValue)}
				onClear={() => handleClearFilter(column)}
				locale={locale}
			/>
		)
	}

	// Render an additional filter (dropdown when just added, badge when has value)
	const renderAdditionalFilter = (column: DataTableColumnDef<TData, any>) => {
		const columnKey = getColumnKey(column)
		if (!columnKey) return null

		const value = currentFilterValues[columnKey]
		const hasValue = value !== undefined && value !== null && value !== ""

		// Si pas de valeur, afficher dropdown pour permettre la saisie
		if (!hasValue) {
			return (
				<FilterDropdown
					key={columnKey}
					column={column}
					value={value}
					onChange={(newValue) => handleFilterChange(column, newValue)}
					onClear={() => handleClearFilter(column)}
					locale={locale}
				/>
			)
		}

		// Badge cliquable avec dropdown intégré quand il y a une valeur
		return (
			<InlineFilterBadge
				key={columnKey}
				column={column}
				value={value}
				onChange={(newValue) => handleFilterChange(column, newValue)}
				onRemove={() => handleClearFilter(column)}
				locale={locale}
				isDefaultFilter={false}
			/>
		)
	}

	// Check if there are any active filters
	const hasActiveFilters = Object.keys(currentFilterValues).some((key) => {
		const value = currentFilterValues[key]
		return value !== undefined && value !== null && value !== ""
	})

	// Handler to clear all filters
	const handleClearAll = () => {
		onFilterChange(null)
	}

	return (
		<div
			className={cn("flex flex-wrap items-center gap-2 px-4 py-3 border-b", className)}
			data-slot="data-table-inline-filters"
		>
			{/* Default filters (always visible) */}
			{defaultFilters.map((column) => renderDefaultFilter(column))}

			{/* Active additional filters */}
			{Array.from(activeAdditionalFilters).map((columnKey) => {
				const column = columns.find((col) => getColumnKey(col) === columnKey)
				if (!column) return null
				return renderAdditionalFilter(column)
			})}

			{/* "Ajouter un filtre" dropdown */}
			{additionalFilters.length > 0 && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
							<Plus className="h-4 w-4" />
							{t.addFilter}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{additionalFilters.map((column) => {
							const columnKey = getColumnKey(column)
							if (!columnKey) return null

							return (
								<DropdownMenuItem
									key={columnKey}
									onClick={() => handleAddFilter(column)}
									className="cursor-pointer"
								>
									{getFilterLabel(column)}
								</DropdownMenuItem>
							)
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			)}

			{/* "Tout effacer" button - only show when there are active filters */}
			{hasActiveFilters && (
				<Button
					variant="outline"
					size="sm"
					className="h-8 gap-1 border-dashed"
					onClick={handleClearAll}
				>
					<X className="h-4 w-4" />
					{t.clearAll}
				</Button>
			)}

			{/* Empty state when all additional filters are active */}
			{additionalFilters.length === 0 &&
				activeAdditionalFilters.size > 0 &&
				defaultFilters.length === 0 && (
					<div className="text-sm text-muted-foreground">{t.noMoreFilters}</div>
				)}
		</div>
	)
}
