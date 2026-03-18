"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { EntityNotesPanel } from "@/components/entity-notes-panel"

export default function NotesPageClient() {
	useAppTopBar([{ label: "Notes" }])

	return (
		<EntityNotesPanel
			scope="all"
			entityType="general"
			emptyTitle="Aucune note"
			emptyDescription="Crée une note générale ou ouvre une note liée à un projet depuis son espace."
			defaultCreateEntityType="general"
		/>
	)
}
