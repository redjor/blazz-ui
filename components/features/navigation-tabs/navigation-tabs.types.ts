export interface NavigationTab {
	id: string
	url: string
	title: string
	icon?: string
}

export interface NavigationTabsConfig {
	storageKey: string
	defaultTab?: { url: string; title: string }
}
