"use client"

import { use } from "react"
import { ProjectNotesList } from "@/components/project-notes-list"

export default function ProjectNotesPage({
	params,
}: { params: Promise<{ id: string; pid: string }> }) {
	const { pid } = use(params)

	return (
		<div className="p-6">
			<ProjectNotesList projectId={pid} />
		</div>
	)
}
