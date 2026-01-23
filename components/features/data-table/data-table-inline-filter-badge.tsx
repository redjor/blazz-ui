"use client"

import * as React from "react"
import { ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { DataTableColumnDef } from "./data-table.types"
import type { DataTableLocale } from "./data-table.i18n"
import { useDataTableTranslations } from "./data-table.i18n"
import { formatFilterValue, getFilterLabel } from "./data-table.utils"

export interface InlineFilterBadgeProps<TData> {
	column: DataTableColumnDef<TData, any>
	value: any
	onChange: (value: any) => void
	onRemove: () => void
	locale?: DataTableLocale
	/** Show count and chevron for default filters */
	isDefaultFilter?: boolean
}

/**
 * Badge cliquable pour filtres additionnels et par défaut
 * Combine badge + dropdown en un seul élément
 */
export function InlineFilterBadge<TData>({
	column,
	value,
	onChange,
	onRemove,
	locale = "fr",
	isDefaultFilter = false,
}: InlineFilterBadgeProps<TData>) {
	const [open, setOpen] = React.useState(false)
	const filterType = column.filterConfig?.type

	if (!filterType) return null

	// Calculer le comptage pour les filtres par défaut
	const count = isDefaultFilter
		? Array.isArray(value)
			? value.length
			: value
				? 1
				: 0
		: 0

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			{/* Badge cliquable comme trigger */}
			<DropdownMenuTrigger asChild>
				<Badge
					variant="outline"
					className="gap-1 pr-1 font-normal h-8 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors bg-background"
				>
					<span className="text-xs">
						{getFilterLabel(column)}: {formatFilterValue(value, column.filterConfig!)}
						{isDefaultFilter && count > 0 && ` (${count})`}
					</span>
					{isDefaultFilter && <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />}
					{/* X pour supprimer */}
					<button
						type="button"
						className="h-4 w-4 inline-flex items-center justify-center rounded-sm hover:bg-transparent transition-colors"
						onClick={(e) => {
							e.stopPropagation() // Empêcher l'ouverture du dropdown
							onRemove()
						}}
						aria-label="Supprimer le filtre"
					>
						<X className="h-3 w-3" />
					</button>
				</Badge>
			</DropdownMenuTrigger>

			{/* Dropdown pour modifier la valeur */}
			<DropdownMenuContent align="start">
				{filterType === "select" && (
					<SelectFilterContent
						column={column}
						value={value}
						onChange={onChange}
						locale={locale}
						onClear={onRemove}
					/>
				)}
				{filterType === "text" && (
					<TextFilterContent column={column} value={value} onChange={onChange} locale={locale} onClear={onRemove} />
				)}
				{filterType === "number" && (
					<NumberFilterContent column={column} value={value} onChange={onChange} locale={locale} onClear={onRemove} />
				)}
				{filterType === "date" && (
					<DateFilterContent column={column} value={value} onChange={onChange} locale={locale} onClear={onRemove} />
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

/**
 * Contenu du dropdown pour filtres select
 */
function SelectFilterContent<TData>({
	column,
	value,
	onChange,
	locale,
	onClear,
}: {
	column: DataTableColumnDef<TData, any>
	value: any
	onChange: (value: any) => void
	locale: DataTableLocale
	onClear: () => void
}) {
	const t = useDataTableTranslations(locale)
	const [selectedValues, setSelectedValues] = React.useState<string[]>(
		Array.isArray(value) ? value : value ? [String(value)] : []
	)

	// Sync with external value changes
	React.useEffect(() => {
		const newValues = Array.isArray(value) ? value : value ? [String(value)] : []
		setSelectedValues(newValues)
	}, [value])

	const handleToggle = (optionValue: string) => {
		const newValues = selectedValues.includes(optionValue)
			? selectedValues.filter((v) => v !== optionValue)
			: [...selectedValues, optionValue]

		setSelectedValues(newValues)

		// Update filter immediately
		if (newValues.length > 0) {
			onChange(newValues.length === 1 ? newValues[0] : newValues)
		} else {
			// Si aucune valeur, on ne fait rien (le badge reste visible avec la valeur précédente)
			// L'utilisateur doit cliquer sur X pour supprimer complètement
		}
	}

	const options = column.filterConfig?.options || []

	return (
		<>
			{options.length > 0 ? (
				<>
					{options.map((option) => (
						<DropdownMenuCheckboxItem
							key={String(option.value)}
							checked={selectedValues.includes(String(option.value))}
							onCheckedChange={() => handleToggle(String(option.value))}
							onSelect={(e) => e.preventDefault()}
						>
							{option.label}
						</DropdownMenuCheckboxItem>
					))}
					{selectedValues.length > 0 && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onClear}>
								<X className="mr-2 h-4 w-4" />
								{t.clearFilter}
							</DropdownMenuItem>
						</>
					)}
				</>
			) : (
				<div className="px-2 py-1.5 text-sm text-muted-foreground">No options</div>
			)}
		</>
	)
}

/**
 * Contenu du dropdown pour filtres text
 */
function TextFilterContent<TData>({
	column,
	value,
	onChange,
	locale,
	onClear,
}: {
	column: DataTableColumnDef<TData, any>
	value: any
	onChange: (value: any) => void
	locale: DataTableLocale
	onClear: () => void
}) {
	const t = useDataTableTranslations(locale)
	const [inputValue, setInputValue] = React.useState(value || "")

	// Sync with external value changes
	React.useEffect(() => {
		setInputValue(value || "")
	}, [value])

	// Debounce the onChange call
	React.useEffect(() => {
		const timer = setTimeout(() => {
			if (inputValue) {
				onChange(inputValue)
			}
		}, 300)

		return () => clearTimeout(timer)
	}, [inputValue, onChange])

	return (
		<>
			<div className="p-2">
				<Input
					type="text"
					placeholder={column.filterConfig?.placeholder || "Rechercher..."}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					autoFocus
					className="h-8"
				/>
			</div>
			{inputValue && (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onClear}>
						<X className="mr-2 h-4 w-4" />
						{t.clearFilter}
					</DropdownMenuItem>
				</>
			)}
		</>
	)
}

/**
 * Contenu du dropdown pour filtres number
 */
function NumberFilterContent<TData>({
	column,
	value,
	onChange,
	locale,
	onClear,
}: {
	column: DataTableColumnDef<TData, any>
	value: any
	onChange: (value: any) => void
	locale: DataTableLocale
	onClear: () => void
}) {
	const t = useDataTableTranslations(locale)
	const [inputValue, setInputValue] = React.useState(value !== undefined ? String(value) : "")

	// Sync with external value changes
	React.useEffect(() => {
		setInputValue(value !== undefined ? String(value) : "")
	}, [value])

	const handleApply = () => {
		if (inputValue !== "") {
			const numValue = Number(inputValue)
			if (!Number.isNaN(numValue)) {
				onChange(numValue)
			}
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleApply()
		}
	}

	return (
		<>
			<div className="p-2">
				<Input
					type="number"
					min={column.filterConfig?.min}
					max={column.filterConfig?.max}
					step={column.filterConfig?.step}
					placeholder={column.filterConfig?.placeholder || "Nombre..."}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={handleApply}
					onKeyDown={handleKeyDown}
					autoFocus
					className="h-8"
				/>
			</div>
			{inputValue && (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onClear}>
						<X className="mr-2 h-4 w-4" />
						{t.clearFilter}
					</DropdownMenuItem>
				</>
			)}
		</>
	)
}

/**
 * Contenu du dropdown pour filtres date
 */
function DateFilterContent<TData>({
	column,
	value,
	onChange,
	locale,
	onClear,
}: {
	column: DataTableColumnDef<TData, any>
	value: any
	onChange: (value: any) => void
	locale: DataTableLocale
	onClear: () => void
}) {
	const t = useDataTableTranslations(locale)
	const [inputValue, setInputValue] = React.useState(value || "")

	// Sync with external value changes
	React.useEffect(() => {
		setInputValue(value || "")
	}, [value])

	const handleApply = () => {
		if (inputValue) {
			onChange(inputValue)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleApply()
		}
	}

	return (
		<>
			<div className="p-2">
				<Input
					type="date"
					placeholder={column.filterConfig?.placeholder || "Date..."}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={handleApply}
					onKeyDown={handleKeyDown}
					autoFocus
					className="h-8"
				/>
			</div>
			{inputValue && (
				<>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={onClear}>
						<X className="mr-2 h-4 w-4" />
						{t.clearFilter}
					</DropdownMenuItem>
				</>
			)}
		</>
	)
}
