import type { Metadata } from "next"
import NotesPageClient from "./_client"

export const metadata: Metadata = {
	title: "Notes",
}

export default function NotesPage() {
	return <NotesPageClient />
}
