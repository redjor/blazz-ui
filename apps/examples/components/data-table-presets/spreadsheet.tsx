"use client"

import { cn } from "@blazz/ui/lib/utils"
import type { DataTableColumnDef } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"
import { col } from "../factories/col"
import { cellShared } from "../factories/editable-column-builders"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpreadsheetColumnDef {
	accessorKey: string
	title: string
	type: "text" | "number" | "currency" | "select" | "date"
	/** Whether the cell is editable (default: true) */
	editable?: boolean
	/** Options for 'select' type columns */
	options?: Array<{ label: string; value: string }>
	/** Currency code for 'currency' type (default: 'EUR') */
	currency?: string
	/** Locale for 'currency' type (default: 'fr-FR') */
	locale?: string
	/** Min value for 'number' type */
	min?: number
	/** Max value for 'number' type */
	max?: number
	/** Step value for 'number' type */
	step?: number
	/** Placeholder for 'text' type */
	placeholder?: string
	/** Enable column sorting (default: true) */
	enableSorting?: boolean
}

export interface SpreadsheetPresetConfig<_TData> {
	columns: SpreadsheetColumnDef[]
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a generic spreadsheet preset from a declarative column definition.
 *
 * Use with `variant="spreadsheet"` and `density="compact"` on DataTable.
 */
export function createSpreadsheetPreset<TData>(config: SpreadsheetPresetConfig<TData>): {
	columns: DataTableColumnDef<TData>[]
} {
	const { columns: colDefs, onCellEdit } = config

	const columns = colDefs.map((colDef): DataTableColumnDef<TData> => {
		const editable = colDef.editable !== false

		if (!editable) {
			const align =
				colDef.type === "number" || colDef.type === "currency" ? "text-right" : "text-left"
			return {
				accessorKey: colDef.accessorKey,
				header: ({ column }) => <DataTableColumnHeader column={column} title={colDef.title} />,
				cell: ({ row }) => {
					const value = row.getValue(colDef.accessorKey) as string
					return <span className={cn(cellShared, align, "cursor-default")}>{value}</span>
				},
				enableSorting: colDef.enableSorting ?? true,
			} as DataTableColumnDef<TData>
		}

		switch (colDef.type) {
			case "text":
				return col.editableText<TData>(colDef.accessorKey, {
					title: colDef.title,
					placeholder: colDef.placeholder,
					enableSorting: colDef.enableSorting,
					onCellEdit,
				})

			case "number":
				return col.editableNumber<TData>(colDef.accessorKey, {
					title: colDef.title,
					min: colDef.min,
					max: colDef.max,
					step: colDef.step,
					enableSorting: colDef.enableSorting,
					onCellEdit,
				})

			case "currency":
				return col.editableCurrency<TData>(colDef.accessorKey, {
					title: colDef.title,
					currency: colDef.currency,
					locale: colDef.locale,
					enableSorting: colDef.enableSorting,
					onCellEdit,
				})

			case "select":
				return col.editableSelect<TData>(colDef.accessorKey, {
					title: colDef.title,
					options: colDef.options ?? [],
					enableSorting: colDef.enableSorting,
					onCellEdit,
				})

			case "date":
				return col.editableDate<TData>(colDef.accessorKey, {
					title: colDef.title,
					enableSorting: colDef.enableSorting,
					onCellEdit,
				})
		}
	})

	return { columns }
}
