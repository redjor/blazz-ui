"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, Loader2, Pin, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { api } from "@/convex/_generated/api"

export function ProjectNotesList({ projectId }: { projectId: string }) {
	const notes = useQuery(api.notes.listByEntity, {
		entityType: "project",
		entityId: projectId,
	})
	const createNote = useMutation(api.notes.create)
	const [isCreating, setIsCreating] = useState(false)

	async function handleCreate() {
		setIsCreating(true)
		try {
			const id = await createNote({
				entityType: "project",
				entityId: projectId,
				title: "Nouvelle note",
			})
			window.open(`/notes/${id}`, "_blank")
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<BlockStack gap="200">
			<InlineStack align="space-between" blockAlign="center">
				<h2 className="text-sm font-medium text-fg">
					Notes{notes && notes.length > 0 ? ` (${notes.length})` : ""}
				</h2>
				<Button
					size="sm"
					variant="outline"
					onClick={() => void handleCreate()}
					disabled={isCreating}
				>
					{isCreating ? (
						<Loader2 className="size-3.5 mr-1 animate-spin" />
					) : (
						<Plus className="size-3.5 mr-1" />
					)}
					Nouvelle note
				</Button>
			</InlineStack>

			{notes === undefined ? (
				<div className="space-y-1.5">
					{[1, 2].map((i) => (
						<div key={i} className="h-9 animate-pulse rounded-md bg-card" />
					))}
				</div>
			) : notes.length === 0 ? (
				<Empty
					size="sm"
					icon={FileText}
					title="Aucune note projet"
					description="Centralise ici tes décisions, pistes et comptes-rendus."
					action={{
						label: "Créer une note",
						onClick: () => void handleCreate(),
					}}
				/>
			) : (
				<BlockStack gap="050">
					{notes.map((note) => (
						<Link
							key={note._id}
							href={`/notes/${note._id}`}
							className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-card"
						>
							{note.pinned ? (
								<Pin className="size-3.5 shrink-0 text-amber-500" />
							) : (
								<FileText className="size-3.5 shrink-0 text-fg-muted" />
							)}
							<span className="min-w-0 flex-1 truncate font-medium text-fg">
								{note.title.trim() || "Nouvelle note"}
							</span>
							<span className="shrink-0 text-xs text-fg-muted">
								{formatDistanceToNow(note.updatedAt, {
									addSuffix: true,
									locale: fr,
								})}
							</span>
						</Link>
					))}
				</BlockStack>
			)}
		</BlockStack>
	)
}
