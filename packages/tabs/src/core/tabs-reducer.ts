import type { Tab } from "./tabs.types"

export interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}

export type TabsAction =
  | { type: "ADD_TAB"; payload: { url: string; title: string; icon?: string; deduplicate?: boolean } }
  | { type: "CLOSE_TAB"; payload: { id: string } }
  | { type: "ACTIVATE_TAB"; payload: { id: string } }
  | { type: "UPDATE_ACTIVE_URL"; payload: { url: string } }
  | { type: "UPDATE_TAB_TITLE"; payload: { id: string; title: string } }
  | { type: "RESTORE"; payload: TabsState }

function generateId(): string {
  return crypto.randomUUID()
}

function resolveActiveTabAfterClose(
  tabs: Tab[],
  closedIndex: number,
  closedId: string,
  currentActiveId: string | null
): string | null {
  if (currentActiveId !== closedId) return currentActiveId
  if (tabs.length === 0) return null
  if (closedIndex > 0) return tabs[closedIndex - 1].id
  return tabs[0].id
}

export function tabsReducer(state: TabsState, action: TabsAction): TabsState {
  switch (action.type) {
    case "ADD_TAB": {
      const deduplicate = action.payload.deduplicate ?? true
      if (deduplicate) {
        const existing = state.tabs.find((t) => t.url === action.payload.url)
        if (existing) {
          return { ...state, activeTabId: existing.id }
        }
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

export function isValidTabsState(data: unknown): data is TabsState {
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

export const initialTabsState: TabsState = { tabs: [], activeTabId: null }
