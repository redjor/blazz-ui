"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { EntityNotesPanel } from "@/components/entity-notes-panel"

export default function NotesDetailClient({ noteId }: { noteId: string }) {
	useAppTopBar([{ label: "Notes", href: "/notes" }, { label: "Note" }])

	return (
		<EntityNotesPanel
			scope="all"
			entityType="general"
			emptyTitle="Aucune note"
			emptyDescription="Crée une note générale ou ouvre une note liée à un projet depuis son espace."
			defaultCreateEntityType="general"
			initialNoteId={noteId}
		/>
	)
}
