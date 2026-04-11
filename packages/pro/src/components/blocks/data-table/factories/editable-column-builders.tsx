"use client"

import { cn, DateSelector, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@blazz/ui"
import { AlertTriangle, Info, XCircle } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import type { DataTableColumnDef } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Validation result returned by a cell validate function */
export interface CellValidationResult {
	level: "error" | "warning" | "info"
	message: string
}

export interface EditableCellConfig {
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	/** Validation function — return null when valid */
	validate?: (value: unknown) => CellValidationResult | null
	/** When to run validation: on blur (default) or on every change */
	validateOn?: "blur" | "change"
}

export interface EditableTextColumnConfig<_TData> extends EditableCellConfig {
	accessorKey: string
	title: string
	placeholder?: string
	className?: string
	enableSorting?: boolean
}

export interface EditableNumberColumnConfig<_TData> extends EditableCellConfig {
	accessorKey: string
	title: string
	min?: number
	max?: number
	step?: number
	className?: string
	enableSorting?: boolean
}

export interface EditableCurrencyColumnConfig<_TData> extends EditableCellConfig {
	accessorKey: string
	title: string
	currency?: string
	locale?: string
	className?: string
	enableSorting?: boolean
}

export interface EditableSelectColumnConfig<_TData> extends EditableCellConfig {
	accessorKey: string
	title: string
	options: Array<{ label: string; value: string }>
	className?: string
	enableSorting?: boolean
}

export interface EditableDateColumnConfig<_TData> extends EditableCellConfig {
	accessorKey: string
	title: string
	className?: string
	enableSorting?: boolean
}

// ---------------------------------------------------------------------------
// Shared hook for editable cells (blur-to-save + Enter-to-blur pattern)
// ---------------------------------------------------------------------------

function useEditableCell<T>({
	value,
	rowId,
	columnId,
	onCellEdit,
	parse,
	validate,
	validateOn = "blur",
}: {
	value: T
	rowId: string
	columnId: string
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	parse?: (raw: string) => T | undefined
	validate?: (value: unknown) => CellValidationResult | null
	validateOn?: "blur" | "change"
}) {
	const [localValue, setLocalValue] = useState(String(value ?? ""))
	const [validationResult, setValidationResult] = useState<CellValidationResult | null>(null)

	const runValidation = useCallback(
		(val: unknown): CellValidationResult | null => {
			if (!validate) return null
			const result = validate(val)
			setValidationResult(result)
			return result
		},
		[validate]
	)

	const handleBlur = useCallback(() => {
		const parsed = parse ? parse(localValue) : localValue
		if (parsed === undefined) return

		const vResult = validateOn === "blur" ? runValidation(parsed) : validationResult

		// If validation returns an error, restore the previous value
		if (vResult?.level === "error") {
			setLocalValue(String(value ?? ""))
			return
		}

		if (parsed !== value) {
			onCellEdit(rowId, columnId, parsed)
		}
	}, [localValue, value, rowId, columnId, onCellEdit, parse, validateOn, runValidation, validationResult])

	const handleChange = useCallback(
		(newValue: string) => {
			setLocalValue(newValue)
			if (validateOn === "change" && validate) {
				const parsed = parse ? parse(newValue) : newValue
				if (parsed !== undefined) runValidation(parsed)
			}
		},
		[parse, validate, validateOn, runValidation]
	)

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			;(e.target as HTMLInputElement).blur()
		}
	}, [])

	return { localValue, setLocalValue: handleChange, handleBlur, handleKeyDown, validationResult }
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

/** Wrapper class for editable cells — negative margins eat the td padding so the
 *  button/input fills the entire cell edge-to-edge (ring visible at cell borders). */
export const cellWrapper = "relative -m-3"

/** Shared base for both idle button and editing input — identical box model = zero layout shift.
 *  Padding matches the td density default so text stays aligned with non-editable cells. */
export const cellShared = "w-full px-3 py-3 text-body-md text-fg rounded-none bg-transparent transition-all duration-150"

/** Idle (read) state — subtle indicator that cell is editable */
const idleCell = `${cellShared} cursor-text text-left hover:bg-muted/30`

/** Active edit state */
const editInput = `${cellShared} min-w-0 h-auto border-0 outline-none ring-2 ring-inset ring-brand`

// ---------------------------------------------------------------------------
// Validation feedback component
// ---------------------------------------------------------------------------

const validationRingColor: Record<CellValidationResult["level"], string> = {
	error: "ring-red-500",
	warning: "ring-amber-500",
	info: "ring-blue-500",
}

const ValidationIcon = ({ level }: { level: CellValidationResult["level"] }) => {
	switch (level) {
		case "error":
			return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
		case "warning":
			return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
		case "info":
			return <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" />
	}
}

function ValidationFeedback({ result }: { result: CellValidationResult | null }) {
	if (!result) return null

	return (
		<TooltipProvider delay={200}>
			<Tooltip>
				<TooltipTrigger render={<span className="absolute right-1 top-1/2 -translate-y-1/2" />}>
					<ValidationIcon level={result.level} />
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-60 text-xs">
					{result.message}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

// ---------------------------------------------------------------------------
// Internal cell components
// ---------------------------------------------------------------------------

interface EditableTextCellProps {
	value: string
	rowId: string
	columnId: string
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	placeholder?: string
	className?: string
	validate?: (value: unknown) => CellValidationResult | null
	validateOn?: "blur" | "change"
}

function EditableTextCell({ value, rowId, columnId, onCellEdit, placeholder, className, validate, validateOn }: EditableTextCellProps) {
	const [editing, setEditing] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const {
		localValue,
		setLocalValue,
		handleBlur: hookBlur,
		handleKeyDown,
		validationResult,
	} = useEditableCell({
		value,
		rowId,
		columnId,
		onCellEdit,
		validate,
		validateOn,
	})

	const handleBlur = useCallback(() => {
		setEditing(false)
		hookBlur()
	}, [hookBlur])

	if (!editing) {
		return (
			<div className={cellWrapper}>
				<button
					type="button"
					className={cn(idleCell, className)}
					onClick={() => {
						setLocalValue(String(value ?? ""))
						setEditing(true)
					}}
				>
					{value || <span className="text-fg-muted">{placeholder}</span>}
				</button>
				<ValidationFeedback result={validationResult} />
			</div>
		)
	}

	return (
		<div className={cellWrapper}>
			<input
				ref={inputRef}
				autoFocus
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className={cn(editInput, validationResult && validationRingColor[validationResult.level], className)}
			/>
			<ValidationFeedback result={validationResult} />
		</div>
	)
}

// ---------------------------------------------------------------------------

interface EditableNumberCellProps {
	value: number
	rowId: string
	columnId: string
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	min?: number
	max?: number
	step?: number
	className?: string
	validate?: (value: unknown) => CellValidationResult | null
	validateOn?: "blur" | "change"
}

const parseNumber = (raw: string): number | undefined => {
	const n = Number(raw)
	return Number.isNaN(n) ? undefined : n
}

function EditableNumberCell({ value, rowId, columnId, onCellEdit, min, max, step, className, validate, validateOn }: EditableNumberCellProps) {
	const [editing, setEditing] = useState(false)
	const {
		localValue,
		setLocalValue,
		handleBlur: hookBlur,
		handleKeyDown,
		validationResult,
	} = useEditableCell({
		value,
		rowId,
		columnId,
		onCellEdit,
		parse: parseNumber,
		validate,
		validateOn,
	})

	const handleBlur = useCallback(() => {
		setEditing(false)
		hookBlur()
	}, [hookBlur])

	if (!editing) {
		return (
			<div className={cellWrapper}>
				<button
					type="button"
					className={cn(idleCell, "text-right", className)}
					onClick={() => {
						setLocalValue(String(value ?? ""))
						setEditing(true)
					}}
				>
					{value != null ? String(value) : ""}
				</button>
				<ValidationFeedback result={validationResult} />
			</div>
		)
	}

	return (
		<div className={cellWrapper}>
			<input
				type="text"
				inputMode="decimal"
				autoFocus
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				className={cn(editInput, "text-right", validationResult && validationRingColor[validationResult.level], className)}
			/>
			<ValidationFeedback result={validationResult} />
		</div>
	)
}

// ---------------------------------------------------------------------------

interface EditableCurrencyCellProps {
	value: number
	rowId: string
	columnId: string
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	currency: string
	locale: string
	className?: string
	validate?: (value: unknown) => CellValidationResult | null
	validateOn?: "blur" | "change"
}

function EditableCurrencyCell({ value, rowId, columnId, onCellEdit, currency, locale, className, validate, validateOn }: EditableCurrencyCellProps) {
	const [editing, setEditing] = useState(false)
	const {
		localValue,
		setLocalValue,
		handleBlur: hookBlur,
		handleKeyDown,
		validationResult,
	} = useEditableCell({
		value,
		rowId,
		columnId,
		onCellEdit,
		parse: parseNumber,
		validate,
		validateOn,
	})

	const formatted = new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(value)

	const handleBlur = useCallback(() => {
		setEditing(false)
		hookBlur()
	}, [hookBlur])

	if (!editing) {
		return (
			<div className={cellWrapper}>
				<button
					type="button"
					className={cn(idleCell, "text-right", className)}
					onClick={() => {
						setLocalValue(String(value ?? ""))
						setEditing(true)
					}}
				>
					{formatted}
				</button>
				<ValidationFeedback result={validationResult} />
			</div>
		)
	}

	return (
		<div className={cellWrapper}>
			<input
				type="text"
				inputMode="decimal"
				autoFocus
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				className={cn(editInput, "text-right", validationResult && validationRingColor[validationResult.level], className)}
			/>
			<ValidationFeedback result={validationResult} />
		</div>
	)
}

// ---------------------------------------------------------------------------

interface EditableSelectCellProps {
	value: string
	rowId: string
	columnId: string
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	options: Array<{ label: string; value: string }>
	className?: string
	validate?: (value: unknown) => CellValidationResult | null
	validateOn?: "blur" | "change"
}

function EditableSelectCell({ value, rowId, columnId, onCellEdit, options, className, validate }: EditableSelectCellProps) {
	const [editing, setEditing] = useState(false)
	const [validationResult, setValidationResult] = useState<CellValidationResult | null>(null)
	const selectedOption = options.find((opt) => opt.value === value)

	const handleChange = useCallback(
		(newValue: string | null) => {
			if (newValue != null && newValue !== value) {
				// Run validation before committing
				if (validate) {
					const result = validate(newValue)
					setValidationResult(result)
					if (result?.level === "error") {
						setEditing(false)
						return
					}
				}
				onCellEdit(rowId, columnId, newValue)
			}
			setEditing(false)
		},
		[value, rowId, columnId, onCellEdit, validate]
	)

	if (!editing) {
		return (
			<div className={cellWrapper}>
				<button type="button" className={cn(idleCell, className)} onClick={() => setEditing(true)}>
					{selectedOption?.label ?? value}
				</button>
				<ValidationFeedback result={validationResult} />
			</div>
		)
	}

	return (
		<div className={cellWrapper}>
			<Select
				value={value ?? ""}
				onValueChange={handleChange}
				open
				onOpenChange={(open) => {
					if (!open) setEditing(false)
				}}
			>
				<SelectTrigger className={cn(editInput, "!h-auto !rounded-none !border-0 !bg-transparent shadow-none", validationResult && validationRingColor[validationResult.level], className)}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent alignItemWithTrigger={false} side="bottom">
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

// ---------------------------------------------------------------------------

interface EditableDateCellProps {
	value: string
	rowId: string
	columnId: string
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
	className?: string
	validate?: (value: unknown) => CellValidationResult | null
	validateOn?: "blur" | "change"
}

function formatDateDisplay(value: string): string {
	if (!value) return ""
	try {
		const d = new Date(value)
		return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
	} catch {
		return value
	}
}

function EditableDateCell({ value, rowId, columnId, onCellEdit, className, validate }: EditableDateCellProps) {
	const [editing, setEditing] = useState(false)
	const [validationResult, setValidationResult] = useState<CellValidationResult | null>(null)

	const dateValue = value ? new Date(value) : undefined

	const handleChange = useCallback(
		(date: Date | undefined) => {
			const newValue = date ? date.toISOString().split("T")[0] : ""
			if (validate) {
				const result = validate(newValue)
				setValidationResult(result)
				if (result?.level === "error") {
					setEditing(false)
					return
				}
			}
			onCellEdit(rowId, columnId, newValue)
			setEditing(false)
		},
		[rowId, columnId, onCellEdit, validate]
	)

	if (!editing) {
		return (
			<div className={cellWrapper}>
				<button type="button" className={cn(idleCell, className)} onClick={() => setEditing(true)}>
					{value ? formatDateDisplay(value) : <span className="text-fg-muted">—</span>}
				</button>
				<ValidationFeedback result={validationResult} />
			</div>
		)
	}

	return (
		<div className={cellWrapper}>
			<DateSelector
				value={dateValue}
				onValueChange={handleChange}
				placeholder="—"
				formatStr="dd/MM/yyyy"
				className={cn(editInput, "!h-auto !rounded-none !border-0 !bg-transparent shadow-none", validationResult && validationRingColor[validationResult.level], className)}
			/>
			<ValidationFeedback result={validationResult} />
		</div>
	)
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/**
 * Creates an editable text column.
 * Displays plain text when idle; shows an Input on click.
 */
export function createEditableTextColumn<TData>(config: EditableTextColumnConfig<TData>): DataTableColumnDef<TData> {
	const { accessorKey, title, placeholder, className, enableSorting = true, onCellEdit, validate, validateOn } = config

	return {
		accessorKey,
		header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			const rowId = row.id

			return <EditableTextCell value={value} rowId={rowId} columnId={accessorKey} onCellEdit={onCellEdit} placeholder={placeholder} className={className} validate={validate} validateOn={validateOn} />
		},
		enableSorting,
	} as DataTableColumnDef<TData>
}

/**
 * Creates an editable number column.
 * Displays the number as plain text when idle; shows an Input on click.
 */
export function createEditableNumberColumn<TData>(config: EditableNumberColumnConfig<TData>): DataTableColumnDef<TData> {
	const { accessorKey, title, min, max, step, className, enableSorting = true, onCellEdit, validate, validateOn } = config

	return {
		accessorKey,
		header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			const rowId = row.id

			return (
				<EditableNumberCell
					value={value}
					rowId={rowId}
					columnId={accessorKey}
					onCellEdit={onCellEdit}
					min={min}
					max={max}
					step={step}
					className={className}
					validate={validate}
					validateOn={validateOn}
				/>
			)
		},
		enableSorting,
		meta: {
			align: "right",
		},
	} as DataTableColumnDef<TData>
}

/**
 * Creates an editable currency column.
 * Displays formatted currency when idle; shows a raw number input when editing.
 */
export function createEditableCurrencyColumn<TData>(config: EditableCurrencyColumnConfig<TData>): DataTableColumnDef<TData> {
	const { accessorKey, title, currency = "EUR", locale = "fr-FR", className, enableSorting = true, onCellEdit, validate, validateOn } = config

	return {
		accessorKey,
		header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			const rowId = row.id

			return (
				<EditableCurrencyCell
					value={value}
					rowId={rowId}
					columnId={accessorKey}
					onCellEdit={onCellEdit}
					currency={currency}
					locale={locale}
					className={className}
					validate={validate}
					validateOn={validateOn}
				/>
			)
		},
		enableSorting,
		meta: {
			align: "right",
		},
	} as DataTableColumnDef<TData>
}

/**
 * Creates an editable select column.
 * Displays the selected option label when idle; opens a Select on click.
 */
export function createEditableSelectColumn<TData>(config: EditableSelectColumnConfig<TData>): DataTableColumnDef<TData> {
	const { accessorKey, title, options, className, enableSorting = true, onCellEdit, validate, validateOn } = config

	return {
		accessorKey,
		header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			const rowId = row.id

			return <EditableSelectCell value={value} rowId={rowId} columnId={accessorKey} onCellEdit={onCellEdit} options={options} className={className} validate={validate} validateOn={validateOn} />
		},
		enableSorting,
	} as DataTableColumnDef<TData>
}

/**
 * Creates an editable date column.
 * Displays a formatted date when idle; shows an Input[type=date] on click.
 */
export function createEditableDateColumn<TData>(config: EditableDateColumnConfig<TData>): DataTableColumnDef<TData> {
	const { accessorKey, title, className, enableSorting = true, onCellEdit, validate, validateOn } = config

	return {
		accessorKey,
		header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			const rowId = row.id

			return <EditableDateCell value={value} rowId={rowId} columnId={accessorKey} onCellEdit={onCellEdit} className={className} validate={validate} validateOn={validateOn} />
		},
		enableSorting,
	} as DataTableColumnDef<TData>
}
