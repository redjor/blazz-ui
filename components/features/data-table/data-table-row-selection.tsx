"use client"

import * as React from "react"
import type { Table, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableRowSelectionProps<TData> {
  row?: Row<TData>
  table?: Table<TData>
  type?: "header" | "cell"
}

export function DataTableRowSelection<TData>({
  row,
  table,
  type = "cell",
}: DataTableRowSelectionProps<TData>) {
  if (type === "header" && table) {
    const isAllSelected = table.getIsAllPageRowsSelected()
    const isSomeSelected = table.getIsSomePageRowsSelected()

    return (
      <div className="flex items-center" data-slot="data-table-row-selection-header">
        <Checkbox
          checked={isAllSelected}
          indeterminate={!isAllSelected && isSomeSelected}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows"
        />
      </div>
    )
  }

  if (type === "cell" && row) {
    return (
      <div className="flex items-center" data-slot="data-table-row-selection-cell">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    )
  }

  return null
}
