const PREFIX = "sandbox:"

interface PersistedState {
	code: string
	props: Record<string, unknown>
}

export function loadState(slug: string): PersistedState | null {
	try {
		const raw = localStorage.getItem(`${PREFIX}${slug}`)
		return raw ? JSON.parse(raw) : null
	} catch {
		return null
	}
}

export function saveState(slug: string, state: PersistedState): void {
	localStorage.setItem(`${PREFIX}${slug}`, JSON.stringify(state))
}

export function clearState(slug: string): void {
	localStorage.removeItem(`${PREFIX}${slug}`)
}

export function hasPersistedState(slug: string): boolean {
	return localStorage.getItem(`${PREFIX}${slug}`) !== null
}
