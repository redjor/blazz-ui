"use client"

import { X } from "lucide-react"
import * as React from "react"
import { Button } from "../../ui/button"
import { DEFAULT_I18N, type Filter, type FilterI18nConfig, Filters } from "../../ui/filters"
import { columnsToFilterFields } from "./adapters/reui-config-adapter"
import { filterGroupToReuiFilters, reuiFiltersToFilterGroup } from "./adapters/reui-filters-adapter"
import type { DataTableLocale } from "./data-table.i18n"
import type { DataTableColumnDef } from "./data-table.types"
import type { FilterGroup, FilterType } from "./data-table-filter.types"

export interface DataTableReUIFiltersProps<TData> {
	columns: DataTableColumnDef<TData, any>[]
	filterGroup: FilterGroup | null
	onFilterChange: (filterGroup: FilterGroup | null) => void
	locale?: DataTableLocale
	variant?: "outline" | "solid"
	size?: "sm" | "md" | "lg"
	radius?: "md" | "full"
	className?: string
}

/**
 * French i18n configuration for ReUI Filters
 */
const FRENCH_I18N: Partial<FilterI18nConfig> = {
	addFilter: "Ajouter un filtre",
	searchFields: "Rechercher des champs...",
	noFieldsFound: "Aucun champ trouvé.",
	noResultsFound: "Aucun résultat trouvé.",
	select: "Sélectionner...",
	true: "Vrai",
	false: "Faux",
	min: "Min",
	max: "Max",
	to: "à",
	typeAndPressEnter: "Tapez et appuyez sur Entrée pour ajouter",
	selected: "sélectionné(s)",
	selectedCount: "sélectionné(s)",
	addFilterTitle: "Ajouter un filtre",

	operators: {
		is: "est",
		isNot: "n'est pas",
		isAnyOf: "est parmi",
		isNotAnyOf: "n'est pas parmi",
		includesAll: "inclut tous",
		excludesAll: "exclut tous",
		before: "avant",
		after: "après",
		between: "entre",
		notBetween: "pas entre",
		contains: "contient",
		notContains: "ne contient pas",
		startsWith: "commence par",
		endsWith: "se termine par",
		isExactly: "est exactement",
		equals: "égal à",
		notEquals: "différent de",
		greaterThan: "supérieur à",
		lessThan: "inférieur à",
		overlaps: "chevauche",
		includes: "inclut",
		excludes: "exclut",
		includesAllOf: "inclut tous",
		includesAnyOf: "inclut au moins un",
		empty: "est vide",
		notEmpty: "n'est pas vide",
	},

	placeholders: {
		enterField: (fieldType: string) => `Saisir ${fieldType}...`,
		selectField: "Sélectionner...",
		searchField: (fieldName: string) => `Rechercher ${fieldName.toLowerCase()}...`,
		enterKey: "Saisir la clé...",
		enterValue: "Saisir la valeur...",
	},

	helpers: {
		formatOperator: (operator: string) => operator.replace(/_/g, " "),
	},

	validation: {
		invalidEmail: "Format d'email invalide",
		invalidUrl: "Format d'URL invalide",
		invalidTel: "Format de téléphone invalide",
		invalid: "Format invalide",
	},
}

/**
 * DataTable ReUI Filters Component
 *
 * Wrapper around the ReUI Filters component that integrates with the DataTable's
 * FilterGroup-based filtering system. Provides bidirectional conversion between
 * the two filter formats.
 *
 * Features:
 * - Converts FilterGroup to/from ReUI Filter[] format
 * - Supports all DataTable filter types (text, number, date, boolean, select)
 * - i18n support (fr/en)
 * - Modern UI with ReUI design system
 * - Maintains compatibility with existing DataTable features (views, FilterBuilder)
 *
 * @example
 * ```tsx
 * <DataTableReUIFilters
 *   columns={columns}
 *   filterGroup={filterGroup}
 *   onFilterChange={setFilterGroup}
 *   locale="fr"
 *   variant="outline"
 *   size="sm"
 * />
 * ```
 */
export function DataTableReUIFilters<TData>({
	columns,
	filterGroup,
	onFilterChange,
	locale = "fr",
	variant = "outline",
	size = "sm",
	radius = "md",
	className,
}: DataTableReUIFiltersProps<TData>) {
	// Convert columns to ReUI FilterFieldConfig[]
	const fields = React.useMemo(() => columnsToFilterFields(columns), [columns])

	// Convert FilterGroup to ReUI Filter[]
	const reuiFilters = React.useMemo(() => filterGroupToReuiFilters(filterGroup), [filterGroup])

	// Handle filter changes from ReUI component
	const handleChange = React.useCallback(
		(filters: Filter[]) => {
			// Convert to FilterGroup
			// Pass columns with proper type casting for the adapter
			const newFilterGroup = reuiFiltersToFilterGroup(
				filters,
				columns as Array<{
					id?: string
					accessorKey?: string
					filterConfig?: { type: FilterType }
				}>
			)

			onFilterChange(newFilterGroup)
		},
		[columns, onFilterChange]
	)

	// Merge i18n configuration based on locale
	const i18nConfig = React.useMemo(() => {
		if (locale === "fr") {
			return {
				...DEFAULT_I18N,
				...FRENCH_I18N,
				operators: {
					...DEFAULT_I18N.operators,
					...FRENCH_I18N.operators,
				},
				placeholders: {
					...DEFAULT_I18N.placeholders,
					...FRENCH_I18N.placeholders,
				},
				helpers: {
					...DEFAULT_I18N.helpers,
					...FRENCH_I18N.helpers,
				},
				validation: {
					...DEFAULT_I18N.validation,
					...FRENCH_I18N.validation,
				},
			} as FilterI18nConfig
		}
		return DEFAULT_I18N
	}, [locale])

	// Clear all filters handler
	const handleClearAll = React.useCallback(() => {
		onFilterChange(null)
	}, [onFilterChange])

	// Don't render if no filterable columns
	if (fields.length === 0) {
		return null
	}

	const hasActiveFilters = reuiFilters.length > 0

	return (
		<div className="border-b">
			<div className="p-2 flex items-start gap-2.5">
				<div className="flex-1">
					<Filters
						filters={reuiFilters}
						fields={fields}
						onChange={handleChange}
						variant={variant}
						size={size}
						radius={radius}
						i18n={i18nConfig}
						showAddButton={true}
						allowMultiple={true}
						className={className}
					/>
				</div>

				{/* Clear all button */}
				{hasActiveFilters && (
					<Button
						variant="outline"
						size={size === "md" ? "default" : size}
						onClick={handleClearAll}
						className="gap-1.5 shrink-0"
					>
						<X className="h-4 w-4" />
						{locale === "fr" ? "Tout effacer" : "Clear all"}
					</Button>
				)}
			</div>
		</div>
	)
}
