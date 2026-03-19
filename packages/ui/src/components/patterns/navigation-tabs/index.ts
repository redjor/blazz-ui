// Re-export from @blazz/tabs for backwards compatibility
export {
	type Tab as NavigationTab,
	type TabsConfig as NavigationTabsConfig,
	type TabsContextValue as NavigationTabsContextValue,
	TabsInterceptor as NavigationTabsInterceptor,
	TabsProvider as NavigationTabsProvider,
	useTabs as useNavigationTabs,
	useTabTitle as useNavigationTabTitle,
	useTabUrlSync as useNavigationTabUrlSync,
} from "@blazz/tabs"
export { TabsBar as NavigationTabsBar, TabsItem as NavigationTabsItem } from "@blazz/tabs/ui"
