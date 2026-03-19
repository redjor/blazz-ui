export const defaults = {
	dashboard: true,
	today: true,
	projects: true,
	clients: true,
	time: true,
	recap: true,
	todos: true,
	chat: false,
	packages: true,
	licenses: true,
	invoicing: true,
	finances: true,
	deployments: true,
	settings: true,
	notes: true,
	bookmarks: true,
	veille: true,
	notifications: true,
} as const satisfies Record<string, boolean>

export type FeatureFlag = keyof typeof defaults

/** @deprecated Use useFeatureFlags().isEnabled instead */
export function isEnabled(flag: FeatureFlag): boolean {
	return defaults[flag]
}

const routeMap: Record<string, FeatureFlag> = {
	"/": "dashboard",
	"/today": "today",
	"/projects": "projects",
	"/clients": "clients",
	"/time": "time",
	"/recap": "recap",
	"/todos": "todos",
	"/chat": "chat",
	"/packages": "packages",
	"/licenses": "licenses",
	"/invoices": "invoicing",
	"/finances": "finances",
	"/deployments": "deployments",
	"/settings": "settings",
	"/notes": "notes",
	"/bookmarks": "bookmarks",
	"/veille": "veille",
	"/notifications": "notifications",
}

export function routeToFlag(pathname: string): FeatureFlag | null {
	if (pathname in routeMap) return routeMap[pathname]
	for (const [route, flag] of Object.entries(routeMap)) {
		if (route !== "/" && pathname.startsWith(`${route}/`)) return flag
	}
	return null
}
