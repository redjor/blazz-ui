# @blazz/tabs — Standalone Tabs Package

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract the navigation-tabs system from `@blazz/ui` into a standalone `@blazz/tabs` package with a headless core, optional styled UI components, and a Next.js adapter.

**Architecture:** Three-layer package — headless core (pure React, zero framework deps), optional Tailwind-styled UI (`@blazz/tabs/ui`), and framework adapters (`@blazz/tabs/adapters/next`). Storage is injectable (localStorage default). The old code in `packages/ui/src/components/patterns/navigation-tabs/` gets replaced by a re-export from `@blazz/tabs`.

**Tech Stack:** React 19, TypeScript strict, Tailwind v4, tsup (ESM build), pnpm workspace, Next.js adapter (peer dep)

---

## Task 1: Scaffold `packages/tabs/` package

**Files:**
- Create: `packages/tabs/package.json`
- Create: `packages/tabs/tsconfig.json`
- Create: `packages/tabs/tsup.config.ts`
- Create: `packages/tabs/src/index.ts` (empty barrel)

**Step 1: Create `packages/tabs/package.json`**

```json
{
  "name": "@blazz/tabs",
  "version": "0.1.0",
  "private": false,
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*",
    "./ui": "./src/ui/index.ts",
    "./adapters/next": "./src/adapters/next/index.ts"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": { "optional": true }
  },
  "dependencies": {
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19",
    "lucide-react": "^0.562.0",
    "next": "^16.1.6",
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

Note: `lucide-react` and `next` are devDeps only (used by optional UI/adapter layers, not core).

**Step 2: Create `packages/tabs/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "incremental": false
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create `packages/tabs/tsup.config.ts`**

```ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/ui/index.ts",
    "src/adapters/next/index.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss", "lucide-react"],
  treeshake: true,
})
```

**Step 4: Create empty `packages/tabs/src/index.ts`**

```ts
// Core exports — populated in Task 2
```

**Step 5: Run `pnpm install` to register the new workspace package**

Run: `pnpm install`

**Step 6: Commit**

```bash
git add packages/tabs/
git commit -m "chore(tabs): scaffold @blazz/tabs package"
```

---

## Task 2: Implement headless core

**Files:**
- Create: `packages/tabs/src/core/tabs.types.ts`
- Create: `packages/tabs/src/core/tabs-reducer.ts`
- Create: `packages/tabs/src/core/tabs-provider.tsx`
- Create: `packages/tabs/src/core/use-tabs.ts`
- Create: `packages/tabs/src/core/use-tab-title.ts`
- Create: `packages/tabs/src/core/use-tab-url-sync.ts`
- Create: `packages/tabs/src/core/tabs-interceptor.tsx`
- Create: `packages/tabs/src/core/index.ts`
- Modify: `packages/tabs/src/index.ts`

Port from `packages/ui/src/components/patterns/navigation-tabs/` with these changes:
- Remove ALL `next/navigation` imports (pure React)
- Extract reducer logic into its own file
- Make storage injectable via `TabsProvider` prop
- `useTabUrlSync` receives `pathname: string` as parameter instead of calling `usePathname()`
- `TabsInterceptor` receives `pathname: string` and `onNavigate: (url: string) => void` props

**Step 1: Create `packages/tabs/src/core/tabs.types.ts`**

```ts
export interface Tab {
  id: string
  url: string
  title: string
  icon?: string
}

export interface TabsStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface TabsConfig {
  /** localStorage key for persistence */
  storageKey: string
  /** Custom storage adapter (default: localStorage) */
  storage?: TabsStorage
  /** Tab opened on first visit when no tabs are persisted */
  defaultTab?: { url: string; title: string; icon?: string }
}
```

**Step 2: Create `packages/tabs/src/core/tabs-reducer.ts`**

Extract the reducer, action types, validation, and `resolveActiveTabAfterClose` from the existing provider. Same logic, just isolated.

```ts
import type { Tab } from "./tabs.types"

export interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}

export type TabsAction =
  | { type: "ADD_TAB"; payload: { url: string; title: string; icon?: string } }
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
```

**Step 3: Create `packages/tabs/src/core/tabs-provider.tsx`**

```tsx
"use client"

import * as React from "react"
import { initialTabsState, isValidTabsState, tabsReducer } from "./tabs-reducer"
import type { TabsStorage } from "./tabs.types"

export interface TabsContextValue {
  tabs: import("./tabs.types").Tab[]
  activeTabId: string | null
  showTabBar: boolean
  addTab: (payload: { url: string; title: string; icon?: string }) => void
  closeTab: (id: string) => void
  activateTab: (id: string) => void
  updateActiveTabUrl: (url: string) => void
  updateTabTitle: (id: string, title: string) => void
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const defaultStorage: TabsStorage = typeof window !== "undefined"
  ? { getItem: (k) => localStorage.getItem(k), setItem: (k, v) => localStorage.setItem(k, v) }
  : { getItem: () => null, setItem: () => {} }

interface TabsProviderProps {
  storageKey: string
  storage?: TabsStorage
  defaultTab?: { url: string; title: string; icon?: string }
  children: React.ReactNode
}

export function TabsProvider({ storageKey, storage = defaultStorage, defaultTab, children }: TabsProviderProps) {
  const [state, dispatch] = React.useReducer(tabsReducer, initialTabsState)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = storage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (isValidTabsState(parsed) && parsed.tabs.length > 0) {
          dispatch({ type: "RESTORE", payload: parsed })
          setHydrated(true)
          return
        }
      }
    } catch {
      // ignore corrupt storage
    }
    if (defaultTab) {
      dispatch({ type: "ADD_TAB", payload: defaultTab })
    }
    setHydrated(true)
  }, [storageKey, storage, defaultTab])

  React.useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      try {
        storage.setItem(storageKey, JSON.stringify(state))
      } catch {
        // ignore storage errors
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [state, hydrated, storageKey, storage])

  const addTab = React.useCallback(
    (payload: { url: string; title: string; icon?: string }) => {
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
```

**Step 4: Create `packages/tabs/src/core/use-tabs.ts`**

```ts
"use client"

import { useContext } from "react"
import type { TabsContextValue } from "./tabs-provider"
import { TabsContext } from "./tabs-provider"

export type { TabsContextValue }

export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider")
  }
  return context
}
```

**Step 5: Create `packages/tabs/src/core/use-tab-title.ts`**

```ts
"use client"

import { useEffect } from "react"
import { useTabs } from "./use-tabs"

export function useTabTitle(title: string) {
  const { activeTabId, updateTabTitle } = useTabs()

  useEffect(() => {
    if (activeTabId && title) {
      updateTabTitle(activeTabId, title)
    }
  }, [activeTabId, title, updateTabTitle])
}
```

**Step 6: Create `packages/tabs/src/core/use-tab-url-sync.ts`**

Framework-agnostic: receives `pathname` as parameter.

```ts
"use client"

import { useEffect, useRef } from "react"
import { useTabs } from "./use-tabs"

/**
 * Syncs the current pathname with the active tab.
 * Framework-agnostic — pass `pathname` from your router.
 */
export function useTabUrlSync(pathname: string, titleResolver: (pathname: string) => string) {
  const { tabs, activeTabId, updateActiveTabUrl, updateTabTitle, activateTab } = useTabs()
  const isInitialMount = useRef(true)

  const tabsRef = useRef(tabs)
  tabsRef.current = tabs
  const activeTabIdRef = useRef(activeTabId)
  activeTabIdRef.current = activeTabId

  useEffect(() => {
    if (!pathname) return

    const currentTabs = tabsRef.current
    const currentActiveTabId = activeTabIdRef.current

    if (isInitialMount.current) {
      isInitialMount.current = false
      const existing = currentTabs.find((t) => t.url === pathname)
      if (existing && existing.id !== currentActiveTabId) {
        activateTab(existing.id)
      }
      return
    }

    const existing = currentTabs.find((t) => t.url === pathname)
    if (existing) {
      if (existing.id !== currentActiveTabId) {
        activateTab(existing.id)
      }
      return
    }

    if (currentActiveTabId) {
      updateActiveTabUrl(pathname)
      updateTabTitle(currentActiveTabId, titleResolver(pathname))
    }
  }, [pathname, activateTab, updateActiveTabUrl, updateTabTitle, titleResolver])
}
```

**Step 7: Create `packages/tabs/src/core/tabs-interceptor.tsx`**

Framework-agnostic: receives `pathname` and `onNavigate` as props.

```tsx
"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTabs } from "./use-tabs"

interface TabsInterceptorProps {
  /** Current pathname — from your router */
  pathname: string
  /** Called when the interceptor wants to navigate (e.g., after Cmd+W) */
  onNavigate?: (url: string) => void
  excludePaths?: string[]
  titleResolver?: (url: string) => string
}

/**
 * Intercepts Cmd/Ctrl+click on links to open them as new tabs.
 * Also handles Cmd+W to close the active tab.
 */
export function TabsInterceptor({
  pathname,
  onNavigate,
  excludePaths = [],
  titleResolver,
}: TabsInterceptorProps) {
  const { addTab, closeTab, activeTabId, tabs } = useTabs()

  const tabsRef = useRef(tabs)
  tabsRef.current = tabs
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!e.metaKey && !e.ctrlKey) return

      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/")) return
      if (excludePaths.some((path) => href.startsWith(path))) return

      e.preventDefault()
      e.stopPropagation()

      if (tabsRef.current.length === 0 && pathnameRef.current) {
        const currentTitle = titleResolver
          ? titleResolver(pathnameRef.current)
          : pathnameRef.current.split("/").pop() || "Tab"
        addTab({ url: pathnameRef.current, title: currentTitle })
      }

      const title = anchor.textContent?.trim() || href.split("/").pop() || "New Tab"
      addTab({ url: href, title })

      onNavigate?.(href)
    },
    [addTab, excludePaths, titleResolver, onNavigate]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "w") {
        if (activeTabId && tabs.length >= 2) {
          e.preventDefault()
          const index = tabsRef.current.findIndex((t) => t.id === activeTabId)
          const remaining = tabsRef.current.filter((t) => t.id !== activeTabId)
          closeTab(activeTabId)
          if (onNavigate && remaining.length > 0) {
            const nextTab = index > 0 ? remaining[index - 1] : remaining[0]
            onNavigate(nextTab.url)
          }
        }
      }
    },
    [activeTabId, closeTab, tabs.length, onNavigate]
  )

  useEffect(() => {
    document.addEventListener("click", handleClick, true)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("click", handleClick, true)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleClick, handleKeyDown])

  return null
}
```

**Step 8: Create `packages/tabs/src/core/index.ts`**

```ts
export * from "./tabs.types"
export { TabsProvider, type TabsContextValue } from "./tabs-provider"
export { TabsInterceptor } from "./tabs-interceptor"
export { useTabs } from "./use-tabs"
export { useTabTitle } from "./use-tab-title"
export { useTabUrlSync } from "./use-tab-url-sync"
```

**Step 9: Update `packages/tabs/src/index.ts`**

```ts
export * from "./core"
```

**Step 10: Type-check**

Run: `cd packages/tabs && pnpm type-check`
Expected: PASS (0 errors)

**Step 11: Commit**

```bash
git add packages/tabs/src/core/ packages/tabs/src/index.ts
git commit -m "feat(tabs): implement headless core with injectable storage"
```

---

## Task 3: Implement styled UI components

**Files:**
- Create: `packages/tabs/src/ui/tabs-bar.tsx`
- Create: `packages/tabs/src/ui/tabs-item.tsx`
- Create: `packages/tabs/src/ui/index.ts`

Port `navigation-tabs-bar.tsx` and `navigation-tabs-item.tsx`, replacing `cn` import with local `tailwind-merge`.

**Step 1: Create `packages/tabs/src/ui/tabs-bar.tsx`**

```tsx
"use client"

import { Plus } from "lucide-react"
import type * as React from "react"
import { twMerge } from "tailwind-merge"

interface TabsBarProps {
  children: React.ReactNode
  onAddTab?: () => void
  addButtonLabel?: string
  className?: string
  addButtonClassName?: string
}

export function TabsBar({
  children,
  onAddTab,
  addButtonLabel = "Open new tab",
  className,
  addButtonClassName,
}: TabsBarProps) {
  return (
    <div
      className={twMerge(
        "flex h-9 shrink-0 items-center border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
        {children}
      </div>
      {onAddTab && (
        <button
          type="button"
          onClick={onAddTab}
          className={twMerge(
            "flex h-9 w-9 shrink-0 items-center justify-center border-l border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900",
            addButtonClassName
          )}
          aria-label={addButtonLabel}
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
```

**Step 2: Create `packages/tabs/src/ui/tabs-item.tsx`**

```tsx
"use client"

import { X } from "lucide-react"
import type * as React from "react"
import { twMerge } from "tailwind-merge"

interface TabsItemProps {
  title: string
  icon?: React.ReactNode
  isActive: boolean
  onClick: () => void
  onClose: () => void
  className?: string
  activeClassName?: string
  closeButtonClassName?: string
}

export function TabsItem({
  title,
  icon,
  isActive,
  onClick,
  onClose,
  className,
  activeClassName,
  closeButtonClassName,
}: TabsItemProps) {
  return (
    <div
      className={twMerge(
        "group relative flex shrink-0 items-center rounded-lg text-xs transition-colors",
        isActive
          ? twMerge("bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100", activeClassName)
          : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900",
        className
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex h-7 cursor-pointer items-center gap-1.5 truncate pl-2 pr-1"
      >
        {icon && <span className="shrink-0 opacity-60 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
        <span className="truncate">{title}</span>
      </button>
      <button
        type="button"
        onClick={onClose}
        className={twMerge(
          "mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          closeButtonClassName
        )}
        aria-label={`Close ${title}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
```

Note: `icon` is now `React.ReactNode` instead of `LucideIcon` — more flexible.

**Step 3: Create `packages/tabs/src/ui/index.ts`**

```ts
export { TabsBar } from "./tabs-bar"
export { TabsItem } from "./tabs-item"
```

**Step 4: Type-check**

Run: `cd packages/tabs && pnpm type-check`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/tabs/src/ui/
git commit -m "feat(tabs): add styled UI components (TabsBar, TabsItem)"
```

---

## Task 4: Implement Next.js adapter

**Files:**
- Create: `packages/tabs/src/adapters/next/use-next-tab-sync.ts`
- Create: `packages/tabs/src/adapters/next/next-tabs-interceptor.tsx`
- Create: `packages/tabs/src/adapters/next/index.ts`

**Step 1: Create `packages/tabs/src/adapters/next/use-next-tab-sync.ts`**

```ts
"use client"

import { usePathname } from "next/navigation"
import { useTabUrlSync } from "../../core/use-tab-url-sync"

/**
 * Next.js adapter for useTabUrlSync.
 * Reads pathname from next/navigation automatically.
 */
export function useNextTabSync(titleResolver: (pathname: string) => string) {
  const pathname = usePathname()
  useTabUrlSync(pathname, titleResolver)
}
```

**Step 2: Create `packages/tabs/src/adapters/next/next-tabs-interceptor.tsx`**

```tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { TabsInterceptor } from "../../core/tabs-interceptor"

interface NextTabsInterceptorProps {
  excludePaths?: string[]
  titleResolver?: (url: string) => string
}

/**
 * Next.js adapter for TabsInterceptor.
 * Reads pathname and provides navigation via next/navigation.
 */
export function NextTabsInterceptor({ excludePaths, titleResolver }: NextTabsInterceptorProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <TabsInterceptor
      pathname={pathname}
      onNavigate={(url) => router.push(url)}
      excludePaths={excludePaths}
      titleResolver={titleResolver}
    />
  )
}
```

**Step 3: Create `packages/tabs/src/adapters/next/index.ts`**

```ts
export { NextTabsInterceptor } from "./next-tabs-interceptor"
export { useNextTabSync } from "./use-next-tab-sync"
```

**Step 4: Type-check**

Run: `cd packages/tabs && pnpm type-check`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/tabs/src/adapters/
git commit -m "feat(tabs): add Next.js adapter (useNextTabSync, NextTabsInterceptor)"
```

---

## Task 5: Update `@blazz/ui` — re-export from `@blazz/tabs`

**Files:**
- Modify: `packages/ui/package.json` — add `@blazz/tabs` as dependency
- Modify: `packages/ui/src/components/patterns/navigation-tabs/index.ts` — re-export from `@blazz/tabs`
- Delete contents of: `packages/ui/src/components/patterns/navigation-tabs/` (keep only `index.ts`)
- Delete: `packages/ui/src/components/patterns/tab-bar.tsx` (dead CRM preset)

**Step 1: Add `@blazz/tabs` to `@blazz/ui` dependencies**

In `packages/ui/package.json`, add to `dependencies`:
```json
"@blazz/tabs": "workspace:*"
```

**Step 2: Replace `packages/ui/src/components/patterns/navigation-tabs/index.ts`**

Replace entire file:

```ts
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
```

**Step 3: Delete the old implementation files**

Delete these files from `packages/ui/src/components/patterns/navigation-tabs/`:
- `navigation-tabs-provider.tsx`
- `navigation-tabs-provider.test.tsx`
- `navigation-tabs-bar.tsx`
- `navigation-tabs-item.tsx`
- `navigation-tabs-interceptor.tsx`
- `navigation-tabs.types.ts`
- `use-navigation-tabs.ts`
- `use-navigation-tab-title.ts`
- `use-navigation-tab-title.test.ts`
- `use-navigation-tab-url-sync.ts`

**Step 4: Delete `packages/ui/src/components/patterns/tab-bar.tsx`**

This file references `/examples/crm/*` routes that no longer exist (apps/examples was deleted 15 mars 2026).

**Step 5: Remove `tab-bar` export from `packages/ui/src/components/patterns/index.ts`**

Remove line: `export * from "./tab-bar"`

**Step 6: Run `pnpm install` then type-check**

Run: `pnpm install && cd packages/ui && pnpm type-check`
Expected: PASS

**Step 7: Commit**

```bash
git add packages/ui/ packages/tabs/
git commit -m "refactor(ui): delegate navigation-tabs to @blazz/tabs, remove dead tab-bar"
```

---

## Task 6: Update docs page

**Files:**
- Modify: `apps/docs/src/routes/_docs/docs/components/patterns/navigation-tabs.tsx`

Update import paths in code examples from `@blazz/ui/components/patterns/navigation-tabs` to `@blazz/tabs` and `@blazz/tabs/ui`. Update the page subtitle to mention the standalone package. Keep the existing structure and props tables.

Key changes in code examples:
- `import { TabsProvider, TabsInterceptor } from "@blazz/tabs"` (was NavigationTabsProvider from @blazz/ui)
- `import { useTabs } from "@blazz/tabs"` (was useNavigationTabs)
- `import { useTabUrlSync } from "@blazz/tabs"` (was useNavigationTabUrlSync)
- `import { useTabTitle } from "@blazz/tabs"` (was useNavigationTabTitle)
- `import { TabsBar, TabsItem } from "@blazz/tabs/ui"` (was NavigationTabsBar/Item)
- `import { NextTabsInterceptor, useNextTabSync } from "@blazz/tabs/adapters/next"` (new)
- Remove references to `TabBar` preset (dead)
- Update Related section to remove tab-bar link

**Step 1: Update the doc page with new imports and examples**

Full rewrite of examples array and props tables to reflect the new API.

**Step 2: Delete doc pages for dead presets**

Delete: `apps/docs/src/routes/_docs/docs/components/patterns/tab-bar.tsx`

**Step 3: Commit**

```bash
git add apps/docs/
git commit -m "docs(tabs): update navigation-tabs docs to @blazz/tabs package"
```

---

## Task 7: Verify full build

**Step 1: Build the tabs package**

Run: `cd packages/tabs && pnpm build`
Expected: PASS — outputs `dist/index.js`, `dist/ui/index.js`, `dist/adapters/next/index.js`

**Step 2: Build all packages**

Run: `pnpm build`
Expected: PASS

**Step 3: Dev check**

Run: `pnpm dev:docs` — verify docs app starts without errors.

**Step 4: Final commit if any fixes needed**

```bash
git commit -m "fix(tabs): build fixes"
```
