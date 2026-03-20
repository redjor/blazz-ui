"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { TodosDataTable } from "@/components/todos-data-table"

export default function TodosPageClient() {
	useAppTopBar([{ label: "Todos" }])

	return <TodosDataTable />
}
