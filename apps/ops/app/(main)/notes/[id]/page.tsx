import type { Metadata } from "next"
import NotesDetailClient from "./_client"

export const metadata: Metadata = {
	title: "Notes",
}

export default async function NotesDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return <NotesDetailClient noteId={id} />
}
