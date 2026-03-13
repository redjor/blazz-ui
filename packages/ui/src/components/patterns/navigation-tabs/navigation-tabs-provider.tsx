"use client"

import * as React from "react"
import type { NavigationTab } from "./navigation-tabs.types"

interface NavigationTabsState {
	tabs: NavigationTab[]
	activeTabId: string | null
}

type NavigationTabsAction =
	| { type: "ADD_TAB"; payload: { url: string; title: string; icon?: string } }
	| { type: "CLOSE_TAB"; payload: { id: string } }
	| { type: "ACTIVATE_TAB"; payload: { id: string } }
	| { type: "UPDATE_ACTIVE_URL"; payload: { url: string } }
	| { type: "UPDATE_TAB_TITLE"; payload: { id: string; title: string } }
	| { type: "RESTORE"; payload: NavigationTabsState }

function generateId(): string {
	return crypto.randomUUID()
}

function resolveActiveTabAfterClose(
	tabs: NavigationTab[],
	closedIndex: number,
	closedId: string,
	currentActiveId: string | null
): string | null {
	if (currentActiveId !== closedId) return currentActiveId
	if (tabs.length === 0) return null
	if (closedIndex > 0) return tabs[closedIndex - 1].id
	return tabs[0].id
}

function tabsReducer(
	state: NavigationTabsState,
	action: NavigationTabsAction
): NavigationTabsState {
	switch (action.type) {
		case "ADD_TAB": {
			const existing = state.tabs.find((t) => t.url === action.payload.url)
			if (existing) {
				return { ...state, activeTabId: existing.id }
			}
			const newTab: NavigationTab = {
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
			return {
				tabs: newTabs,
				activeTabId: resolveActiveTabAfterClose(
					newTabs,
					index,
					action.payload.id,
					state.activeTabId
				),
			}
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

function isValidTabsState(data: unknown): data is NavigationTabsState {
	if (!data || typeof data !== "object") return false
	const obj = data as Record<string, unknown>
	if (!Array.isArray(obj.tabs)) return false
	if (obj.activeTabId !== null && typeof obj.activeTabId !== "string") return false
	return obj.tabs.every(
		(t: unknown) =>
			t &&
			typeof t === "object" &&
			typeof (t as Record<string, unknown>).id === "string" &&
			typeof (t as Record<string, unknown>).url === "string" &&
			typeof (t as Record<string, unknown>).title === "string"
	)
}

export interface NavigationTabsContextValue {
	tabs: NavigationTab[]
	activeTabId: string | null
	showTabBar: boolean
	addTab: (payload: { url: string; title: string; icon?: string }) => void
	closeTab: (id: string) => void
	activateTab: (id: string) => void
	updateActiveTabUrl: (url: string) => void
	updateTabTitle: (id: string, title: string) => void
}

export const NavigationTabsContext = React.createContext<NavigationTabsContextValue | undefined>(
	undefined
)

const initialState: NavigationTabsState = { tabs: [], activeTabId: null }

interface NavigationTabsProviderProps {
	storageKey: string
	children: React.ReactNode
}

export function NavigationTabsProvider({ storageKey, children }: NavigationTabsProviderProps) {
	const [state, dispatch] = React.useReducer(tabsReducer, initialState)
	const [hydrated, setHydrated] = React.useState(false)

	React.useEffect(() => {
		try {
			const raw = localStorage.getItem(storageKey)
			if (raw) {
				const parsed = JSON.parse(raw)
				if (isValidTabsState(parsed) && parsed.tabs.length > 0) {
					dispatch({ type: "RESTORE", payload: parsed })
				}
			}
		} catch {
			// ignore corrupt storage
		}
		setHydrated(true)
	}, [storageKey])

	React.useEffect(() => {
		if (!hydrated) return
		const timer = setTimeout(() => {
			try {
				localStorage.setItem(storageKey, JSON.stringify(state))
			} catch {
				// ignore storage errors
			}
		}, 300)
		return () => clearTimeout(timer)
	}, [state, hydrated, storageKey])

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

	const value = React.useMemo<NavigationTabsContextValue>(
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

	return <NavigationTabsContext.Provider value={value}>{children}</NavigationTabsContext.Provider>
}
