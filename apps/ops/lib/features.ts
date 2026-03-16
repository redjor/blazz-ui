export const features = {
	dashboard: true,
	today: true,
	projects: true,
	clients: true,
	time: true,
	recap: true,
	todos: true,
	chat: true,
	packages: true,
	licenses: true,
	invoicing: false,
} as const satisfies Record<string, boolean>

export type FeatureFlag = keyof typeof features

export function isEnabled(flag: FeatureFlag): boolean {
	return features[flag]
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
}

export function routeToFlag(pathname: string): FeatureFlag | null {
	if (pathname in routeMap) return routeMap[pathname]
	for (const [route, flag] of Object.entries(routeMap)) {
		if (route !== "/" && pathname.startsWith(`${route}/`)) return flag
	}
	return null
}
