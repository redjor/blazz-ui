"use client"

import { use } from "react"
import { TodosDataTable } from "@/components/todos-data-table"
import type { Id } from "@/convex/_generated/dataModel"

export default function ProjectTodosPage({
	params,
}: { params: Promise<{ pid: string }> }) {
	const { pid } = use(params)

	return <TodosDataTable projectId={pid as Id<"projects">} />
}
