export type NoteInput = {
	kind: "notes"
	title: string | undefined
	contentText: string | undefined
}

export type BookmarkInput = {
	kind: "bookmarks"
	title: string | undefined
	notes: string | undefined
	description: string | undefined
	url: string
}

export type IndexableInput = NoteInput | BookmarkInput

export function buildIndexableText(input: IndexableInput): string {
	if (input.kind === "notes") {
		// Trim each field individually, join with double newline separator
		const title = (input.title ?? "").trim()
		const content = (input.contentText ?? "").trim()
		return content ? `${title}\n\n${content}` : title
	}
	// Bookmarks: keep line structure even when fields are missing (4 lines fixed)
	const title = (input.title ?? "").trim()
	const notes = (input.notes ?? "").trim()
	const description = (input.description ?? "").trim()
	return `${title}\n${notes}\n${description}\nsource: ${input.url.trim()}`
}
