"use client"

import * as React from "react"

export interface Tab {
	id: string
	url: string
	title: string
	icon?: string
}

interface TabsState {
	tabs: Tab[]
	activeTabId: string | null
}

type TabsAction =
	| { type: "ADD_TAB"; payload: { url: string; title: string; icon?: string } }
	| { type: "CLOSE_TAB"; payload: { id: string } }
	| { type: "ACTIVATE_TAB"; payload: { id: string } }
	| { type: "UPDATE_ACTIVE_URL"; payload: { url: string } }
	| { type: "UPDATE_TAB_TITLE"; payload: { id: string; title: string } }
	| { type: "RESTORE"; payload: TabsState }

function generateId(): string {
	return crypto.randomUUID()
}

function tabsReducer(state: TabsState, action: TabsAction): TabsState {
	switch (action.type) {
		case "ADD_TAB": {
			const existing = state.tabs.find((t) => t.url === action.payload.url)
			if (existing) {
				return { ...state, activeTabId: existing.id }
			}
			const newTab: Tab = {
				id: generateId(),
				url: action.payload.url,
				title: action.payload.title,
				icon: action.payload.icon,
			}
			return {
				tabs: [...state.tabs, newTab],
				activeTabId: newTab.id,
			}
		}
		case "CLOSE_TAB": {
			const index = state.tabs.findIndex((t) => t.id === action.payload.id)
			if (index === -1) return state
			const newTabs = state.tabs.filter((t) => t.id !== action.payload.id)
			let newActiveId = state.activeTabId
			if (state.activeTabId === action.payload.id) {
				if (newTabs.length === 0) {
					newActiveId = null
				} else if (index > 0) {
					newActiveId = newTabs[index - 1].id
				} else {
					newActiveId = newTabs[0].id
				}
			}
			return { tabs: newTabs, activeTabId: newActiveId }
		}
		case "ACTIVATE_TAB": {
			if (!state.tabs.find((t) => t.id === action.payload.id)) return state
			return { ...state, activeTabId: action.payload.id }
		}
		case "UPDATE_ACTIVE_URL": {
			if (!state.activeTabId) return state
			return {
				...state,
				tabs: state.tabs.map((t) =>
					t.id === state.activeTabId ? { ...t, url: action.payload.url } : t
				),
			}
		}
		case "UPDATE_TAB_TITLE": {
			return {
				...state,
				tabs: state.tabs.map((t) =>
					t.id === action.payload.id ? { ...t, title: action.payload.title } : t
				),
			}
		}
		case "RESTORE": {
			return action.payload
		}
		default:
			return state
	}
}

const STORAGE_KEY = "blazz-crm-tabs"

function loadTabsFromStorage(): TabsState | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw)
		if (parsed && Array.isArray(parsed.tabs)) return parsed as TabsState
	} catch {
		// ignore corrupt storage
	}
	return null
}

function saveTabsToStorage(state: TabsState): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
	} catch {
		// ignore storage errors
	}
}

interface TabsContextValue {
	tabs: Tab[]
	activeTabId: string | null
	showTabBar: boolean
	addTab: (payload: { url: string; title: string; icon?: string }) => void
	closeTab: (id: string) => void
	activateTab: (id: string) => void
	updateActiveTabUrl: (url: string) => void
	updateTabTitle: (id: string, title: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const initialState: TabsState = { tabs: [], activeTabId: null }

export function TabsProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = React.useReducer(tabsReducer, initialState)
	const [hydrated, setHydrated] = React.useState(false)

	// Restore from localStorage on mount
	React.useEffect(() => {
		const stored = loadTabsFromStorage()
		if (stored && stored.tabs.length > 0) {
			dispatch({ type: "RESTORE", payload: stored })
		}
		setHydrated(true)
	}, [])

	// Persist to localStorage on change (debounced)
	React.useEffect(() => {
		if (!hydrated) return
		const timer = setTimeout(() => saveTabsToStorage(state), 300)
		return () => clearTimeout(timer)
	}, [state, hydrated])

	const addTab = React.useCallback((payload: { url: string; title: string; icon?: string }) => {
		dispatch({ type: "ADD_TAB", payload })
	}, [])

	const closeTab = React.useCallback((id: string) => {
		dispatch({ type: "CLOSE_TAB", payload: { id } })
	}, [])

	const activateTab = React.useCallback((id: string) => {
		dispatch({ type: "ACTIVATE_TAB", payload: { id } })
	}, [])

	const updateActiveTabUrl = React.useCallback((url: string) => {
		dispatch({ type: "UPDATE_ACTIVE_URL", payload: { url } })
	}, [])

	const updateTabTitle = React.useCallback((id: string, title: string) => {
		dispatch({ type: "UPDATE_TAB_TITLE", payload: { id, title } })
	}, [])

	const value = React.useMemo<TabsContextValue>(
		() => ({
			tabs: state.tabs,
			activeTabId: state.activeTabId,
			showTabBar: state.tabs.length >= 2,
			addTab,
			closeTab,
			activateTab,
			updateActiveTabUrl,
			updateTabTitle,
		}),
		[state, addTab, closeTab, activateTab, updateActiveTabUrl, updateTabTitle]
	)

	return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}

export function useTabs() {
	const context = React.useContext(TabsContext)
	if (context === undefined) {
		throw new Error("useTabs must be used within a TabsProvider")
	}
	return context
}
