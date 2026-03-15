// Re-export from @blazz/tabs for backwards compatibility
export {
	TabsProvider as NavigationTabsProvider,
	TabsInterceptor as NavigationTabsInterceptor,
	useTabs as useNavigationTabs,
	useTabTitle as useNavigationTabTitle,
	useTabUrlSync as useNavigationTabUrlSync,
	type Tab as NavigationTab,
	type TabsContextValue as NavigationTabsContextValue,
	type TabsConfig as NavigationTabsConfig,
} from "@blazz/tabs"

export { TabsBar as NavigationTabsBar } from "@blazz/tabs/ui"
export { TabsItem as NavigationTabsItem } from "@blazz/tabs/ui"
