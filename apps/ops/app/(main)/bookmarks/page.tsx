import type { Metadata } from "next"
import BookmarksPageClient from "./_client"

export const metadata: Metadata = {
	title: "Bookmarks",
}

export default function BookmarksPage() {
	return <BookmarksPageClient />
}
