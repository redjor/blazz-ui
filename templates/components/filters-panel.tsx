/**
 * Pattern: Filters Panel
 *
 * Panel de filtres réutilisable pour tables et listes.
 * Cas d'usage: DataTables, search interfaces, advanced filtering
 *
 * Features:
 * - Multiples types de filtres (select, checkbox, date, range)
 * - Filtres actifs avec badges
 * - Reset filters
 * - Collapsible sections
 * - Responsive (drawer mobile)
 * - State management
 */

'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Filter,
	X,
	ChevronDown,
	ChevronUp,
	SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Type de filtre
 */
export type FilterType =
	| 'select'
	| 'multiselect'
	| 'checkbox'
	| 'date'
	| 'daterange'
	| 'number'
	| 'numberrange'
	| 'text'

/**
 * Définition d'un filtre
 */
export interface FilterDefinition {
	/** ID unique du filtre */
	id: string
	/** Label affiché */
	label: string
	/** Type de filtre */
	type: FilterType
	/** Options pour select/multiselect */
	options?: Array<{ value: string; label: string }>
	/** Placeholder pour inputs */
	placeholder?: string
	/** Section/groupe (optionnel) */
	section?: string
}

/**
 * Valeur d'un filtre
 */
export type FilterValue =
	| string
	| string[]
	| number
	| { min?: number; max?: number }
	| { from?: Date; to?: Date }
	| boolean

/**
 * État des filtres (map ID -> valeur)
 */
export type FiltersState = Record<string, FilterValue | undefined>

export interface FiltersPanelProps {
	/** Définitions des filtres */
	filters: FilterDefinition[]
	/** État actuel des filtres */
	values: FiltersState
	/** Handler changement valeur */
	onChange: (filterId: string, value: FilterValue | undefined) => void
	/** Handler reset tous les filtres */
	onReset: () => void
	/** Afficher le panel en mode sidebar ou drawer mobile */
	mode?: 'sidebar' | 'drawer'
	/** Classes CSS additionnelles */
	className?: string
}

/**
 * Panel de filtres réutilisable
 *
 * @example
 * ```tsx
 * const filters: FilterDefinition[] = [
 *   {
 *     id: 'status',
 *     label: 'Statut',
 *     type: 'select',
 *     options: [
 *       { value: 'active', label: 'Actif' },
 *       { value: 'inactive', label: 'Inactif' },
 *     ],
 *   },
 *   {
 *     id: 'category',
 *     label: 'Catégorie',
 *     type: 'multiselect',
 *     options: [...],
 *     section: 'Classification',
 *   },
 * ]
 *
 * <FiltersPanel
 *   filters={filters}
 *   values={filterValues}
 *   onChange={(id, value) => setFilterValues({ ...filterValues, [id]: value })}
 *   onReset={() => setFilterValues({})}
 * />
 * ```
 */
export function FiltersPanel({
	filters,
	values,
	onChange,
	onReset,
	mode = 'sidebar',
	className,
}: FiltersPanelProps) {
	const activeFiltersCount = Object.values(values).filter(
		(v) => v !== undefined && v !== null && v !== ''
	).length

	const content = (
		<div className={cn('space-y-4', className)}>
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold">Filtres</h3>
					{activeFiltersCount > 0 && (
						<Badge variant="secondary">{activeFiltersCount}</Badge>
					)}
				</div>
				{activeFiltersCount > 0 && (
					<Button variant="ghost" size="sm" onClick={onReset}>
						Réinitialiser
					</Button>
				)}
			</div>

			<Separator />

			{/* Filters */}
			<ScrollArea className="h-full">
				<div className="space-y-4 pr-4">
					{renderFiltersBySection(filters, values, onChange)}
				</div>
			</ScrollArea>

			{/* Active Filters */}
			{activeFiltersCount > 0 && (
				<>
					<Separator />
					<div className="space-y-2">
						<p className="text-sm font-medium">Filtres actifs</p>
						<div className="flex flex-wrap gap-2">
							{Object.entries(values)
								.filter(([_, value]) => value !== undefined && value !== null && value !== '')
								.map(([filterId, value]) => {
									const filter = filters.find((f) => f.id === filterId)
									if (!filter) return null

									return (
										<Badge
											key={filterId}
											variant="secondary"
											className="gap-1"
										>
											{filter.label}: {formatFilterValue(filter, value)}
											<button
												type="button"
												onClick={() => onChange(filterId, undefined)}
												className="ml-1 hover:bg-destructive/20 rounded-full"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									)
								})}
						</div>
					</div>
				</>
			)}
		</div>
	)

	if (mode === 'drawer') {
		return (
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="sm">
						<SlidersHorizontal className="mr-2 h-4 w-4" />
						Filtres
						{activeFiltersCount > 0 && (
							<Badge variant="default" className="ml-2">
								{activeFiltersCount}
							</Badge>
						)}
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-80">
					<SheetHeader>
						<SheetTitle>Filtres</SheetTitle>
					</SheetHeader>
					<div className="mt-6">{content}</div>
				</SheetContent>
			</Sheet>
		)
	}

	return content
}

// =============================================================================
// HELPERS
// =============================================================================

function renderFiltersBySection(
	filters: FilterDefinition[],
	values: FiltersState,
	onChange: (id: string, value: FilterValue | undefined) => void
) {
	// Grouper par section
	const sections = new Map<string, FilterDefinition[]>()

	filters.forEach((filter) => {
		const sectionName = filter.section || 'Général'
		if (!sections.has(sectionName)) {
			sections.set(sectionName, [])
		}
		sections.get(sectionName)!.push(filter)
	})

	return Array.from(sections.entries()).map(([sectionName, sectionFilters]) => (
		<FilterSection
			key={sectionName}
			title={sectionName}
			filters={sectionFilters}
			values={values}
			onChange={onChange}
		/>
	))
}

function FilterSection({
	title,
	filters,
	values,
	onChange,
}: {
	title: string
	filters: FilterDefinition[]
	values: FiltersState
	onChange: (id: string, value: FilterValue | undefined) => void
}) {
	const [isOpen, setIsOpen] = React.useState(true)

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger asChild>
				<Button
					variant="ghost"
					className="w-full justify-between p-0 hover:bg-transparent"
				>
					<span className="text-sm font-medium">{title}</span>
					{isOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-3 pt-3">
				{filters.map((filter) => (
					<FilterField
						key={filter.id}
						filter={filter}
						value={values[filter.id]}
						onChange={(value) => onChange(filter.id, value)}
					/>
				))}
			</CollapsibleContent>
		</Collapsible>
	)
}

function FilterField({
	filter,
	value,
	onChange,
}: {
	filter: FilterDefinition
	value: FilterValue | undefined
	onChange: (value: FilterValue | undefined) => void
}) {
	switch (filter.type) {
		case 'select':
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<Select
						value={value as string | undefined}
						onValueChange={(v) => onChange(v || undefined)}
					>
						<SelectTrigger>
							<SelectValue placeholder={filter.placeholder || 'Sélectionner'} />
						</SelectTrigger>
						<SelectContent>
							{filter.options?.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)

		case 'multiselect':
			const selectedValues = (value as string[] | undefined) || []
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<div className="space-y-2">
						{filter.options?.map((option) => (
							<div key={option.value} className="flex items-center space-x-2">
								<Checkbox
									id={`${filter.id}-${option.value}`}
									checked={selectedValues.includes(option.value)}
									onCheckedChange={(checked) => {
										const newValues = checked
											? [...selectedValues, option.value]
											: selectedValues.filter((v) => v !== option.value)
										onChange(newValues.length > 0 ? newValues : undefined)
									}}
								/>
								<label
									htmlFor={`${filter.id}-${option.value}`}
									className="text-sm"
								>
									{option.label}
								</label>
							</div>
						))}
					</div>
				</div>
			)

		case 'checkbox':
			return (
				<div className="flex items-center space-x-2">
					<Checkbox
						id={filter.id}
						checked={!!value}
						onCheckedChange={(checked) => onChange(checked || undefined)}
					/>
					<label htmlFor={filter.id} className="text-sm">
						{filter.label}
					</label>
				</div>
			)

		case 'text':
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<Input
						type="text"
						placeholder={filter.placeholder}
						value={(value as string) || ''}
						onChange={(e) => onChange(e.target.value || undefined)}
					/>
				</div>
			)

		case 'number':
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<Input
						type="number"
						placeholder={filter.placeholder}
						value={(value as number) || ''}
						onChange={(e) =>
							onChange(e.target.value ? Number(e.target.value) : undefined)
						}
					/>
				</div>
			)

		case 'numberrange':
			const rangeValue = (value as { min?: number; max?: number }) || {}
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<div className="grid grid-cols-2 gap-2">
						<Input
							type="number"
							placeholder="Min"
							value={rangeValue.min || ''}
							onChange={(e) =>
								onChange({
									...rangeValue,
									min: e.target.value ? Number(e.target.value) : undefined,
								})
							}
						/>
						<Input
							type="number"
							placeholder="Max"
							value={rangeValue.max || ''}
							onChange={(e) =>
								onChange({
									...rangeValue,
									max: e.target.value ? Number(e.target.value) : undefined,
								})
							}
						/>
					</div>
				</div>
			)

		case 'date':
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<Input
						type="date"
						value={value ? (value as Date).toISOString().split('T')[0] : ''}
						onChange={(e) =>
							onChange(e.target.value ? new Date(e.target.value) : undefined)
						}
					/>
				</div>
			)

		case 'daterange':
			const dateRangeValue = (value as { from?: Date; to?: Date }) || {}
			return (
				<div className="space-y-2">
					<Label>{filter.label}</Label>
					<div className="grid grid-cols-2 gap-2">
						<Input
							type="date"
							placeholder="De"
							value={
								dateRangeValue.from
									? dateRangeValue.from.toISOString().split('T')[0]
									: ''
							}
							onChange={(e) =>
								onChange({
									...dateRangeValue,
									from: e.target.value ? new Date(e.target.value) : undefined,
								})
							}
						/>
						<Input
							type="date"
							placeholder="À"
							value={
								dateRangeValue.to
									? dateRangeValue.to.toISOString().split('T')[0]
									: ''
							}
							onChange={(e) =>
								onChange({
									...dateRangeValue,
									to: e.target.value ? new Date(e.target.value) : undefined,
								})
							}
						/>
					</div>
				</div>
			)

		default:
			return null
	}
}

function formatFilterValue(
	filter: FilterDefinition,
	value: FilterValue | undefined
): string {
	if (value === undefined || value === null) return ''

	switch (filter.type) {
		case 'select':
			const option = filter.options?.find((o) => o.value === value)
			return option?.label || String(value)

		case 'multiselect':
			const values = value as string[]
			return values.length > 0 ? `${values.length} sélectionné(s)` : ''

		case 'checkbox':
			return value ? 'Oui' : 'Non'

		case 'numberrange':
			const range = value as { min?: number; max?: number }
			return `${range.min || '∞'} - ${range.max || '∞'}`

		case 'daterange':
			const dateRange = value as { from?: Date; to?: Date }
			const from = dateRange.from
				? dateRange.from.toLocaleDateString('fr-FR')
				: '∞'
			const to = dateRange.to ? dateRange.to.toLocaleDateString('fr-FR') : '∞'
			return `${from} - ${to}`

		default:
			return String(value)
	}
}

// =============================================================================
// EXEMPLE D'UTILISATION
// =============================================================================

export function FiltersPanelExample() {
	const [filterValues, setFilterValues] = React.useState<FiltersState>({})

	const filters: FilterDefinition[] = [
		{
			id: 'status',
			label: 'Statut',
			type: 'select',
			options: [
				{ value: 'active', label: 'Actif' },
				{ value: 'inactive', label: 'Inactif' },
				{ value: 'pending', label: 'En attente' },
			],
			section: 'Général',
		},
		{
			id: 'category',
			label: 'Catégorie',
			type: 'multiselect',
			options: [
				{ value: 'tech', label: 'Technologie' },
				{ value: 'finance', label: 'Finance' },
				{ value: 'health', label: 'Santé' },
			],
			section: 'Classification',
		},
		{
			id: 'priceRange',
			label: 'Prix',
			type: 'numberrange',
			placeholder: 'Min - Max',
			section: 'Prix',
		},
		{
			id: 'dateRange',
			label: 'Période',
			type: 'daterange',
			section: 'Dates',
		},
		{
			id: 'inStock',
			label: 'En stock uniquement',
			type: 'checkbox',
			section: 'Disponibilité',
		},
	]

	return (
		<div className="grid grid-cols-4 gap-4">
			<div className="col-span-1">
				<FiltersPanel
					filters={filters}
					values={filterValues}
					onChange={(id, value) =>
						setFilterValues({ ...filterValues, [id]: value })
					}
					onReset={() => setFilterValues({})}
				/>
			</div>
			<div className="col-span-3 p-4 border rounded-lg">
				<p className="text-sm text-muted-foreground">Contenu filtré ici</p>
				<pre className="mt-4 text-xs">
					{JSON.stringify(filterValues, null, 2)}
				</pre>
			</div>
		</div>
	)
}
