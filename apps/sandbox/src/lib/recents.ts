const STORAGE_KEY = "sandbox:recents"
const MAX_RECENTS = 5

export function getRecents(): string[] {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
	} catch {
		return []
	}
}

export function addRecent(slug: string): void {
	const recents = getRecents().filter((s) => s !== slug)
	recents.unshift(slug)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)))
}
