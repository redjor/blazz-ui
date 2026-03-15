"use client"

import { DataTable } from "../data-table"
import type { DataTableColumnDef } from "../data-table.types"

interface ExpandedRowSubTableProps<TData> {
	data: TData[]
	columns: DataTableColumnDef<TData>[]
}

export function ExpandedRowSubTable<TData>({ data, columns }: ExpandedRowSubTableProps<TData>) {
	return (
		<DataTable
			data={data}
			columns={columns}
			hideToolbar
			enablePagination={false}
			density="compact"
			variant="lined"
		/>
	)
}
