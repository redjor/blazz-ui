# CRM In-App Tab System - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a browser-like tab system to the CRM section so users can keep multiple pages open simultaneously, with localStorage persistence and keyboard shortcuts.

**Architecture:** Client-side tab manager layered on top of Next.js router. A `TabsProvider` context manages tab state (add/close/switch). The `TabBar` UI appears when 2+ tabs are open. The URL always reflects the active tab via `router.push()`. Inactive tabs store their URL but their content is not mounted.

**Tech Stack:** React 19 Context + useReducer, Next.js `useRouter`/`usePathname`, localStorage, Tailwind v4, Vitest + React Testing Library

**Design doc:** `docs/plans/2026-02-14-crm-tabs-design.md`

---

## Task 1: TabsContext — Core State Management

**Files:**
- Create: `components/layout/tabs-context.tsx`
- Create: `components/layout/tabs-context.test.tsx`

**Step 1: Write the failing tests**

Create `components/layout/tabs-context.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { TabsProvider, useTabs } from "./tabs-context"

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}))

function wrapper({ children }: { children: React.ReactNode }) {
  return <TabsProvider>{children}</TabsProvider>
}

describe("useTabs", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("starts with no tabs", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    expect(result.current.tabs).toEqual([])
    expect(result.current.activeTabId).toBeNull()
  })

  it("adds a tab", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Marie Dupont" })
    })
    expect(result.current.tabs).toHaveLength(1)
    expect(result.current.tabs[0].url).toBe("/contacts/1")
    expect(result.current.tabs[0].title).toBe("Marie Dupont")
  })

  it("does not duplicate an existing URL — activates instead", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Marie" })
      result.current.addTab({ url: "/deals/1", title: "Deal A" })
    })
    expect(result.current.tabs).toHaveLength(2)
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Marie" })
    })
    expect(result.current.tabs).toHaveLength(2)
    expect(result.current.activeTabId).toBe(result.current.tabs[0].id)
  })

  it("closes a tab and activates the previous one", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
      result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
      result.current.addTab({ url: "/contacts/3", title: "Tab 3" })
    })
    const tabToClose = result.current.tabs[2] // Tab 3 is active
    act(() => {
      result.current.closeTab(tabToClose.id)
    })
    expect(result.current.tabs).toHaveLength(2)
    expect(result.current.activeTabId).toBe(result.current.tabs[1].id) // Tab 2
  })

  it("closes the first tab and activates the next one", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
      result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
    })
    // Activate Tab 1
    act(() => {
      result.current.activateTab(result.current.tabs[0].id)
    })
    act(() => {
      result.current.closeTab(result.current.tabs[0].id)
    })
    expect(result.current.tabs).toHaveLength(1)
    expect(result.current.activeTabId).toBe(result.current.tabs[0].id) // Tab 2
  })

  it("switches active tab", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
      result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
    })
    act(() => {
      result.current.activateTab(result.current.tabs[0].id)
    })
    expect(result.current.activeTabId).toBe(result.current.tabs[0].id)
  })

  it("updates the active tab URL on navigation", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts", title: "Contacts" })
    })
    act(() => {
      result.current.updateActiveTabUrl("/contacts/1")
    })
    expect(result.current.tabs[0].url).toBe("/contacts/1")
  })

  it("updates a tab title", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Loading..." })
    })
    act(() => {
      result.current.updateTabTitle(result.current.tabs[0].id, "Marie Dupont")
    })
    expect(result.current.tabs[0].title).toBe("Marie Dupont")
  })

  it("showTabBar is false with 0-1 tabs", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    expect(result.current.showTabBar).toBe(false)
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
    })
    expect(result.current.showTabBar).toBe(false)
  })

  it("showTabBar is true with 2+ tabs", () => {
    const { result } = renderHook(() => useTabs(), { wrapper })
    act(() => {
      result.current.addTab({ url: "/contacts/1", title: "Tab 1" })
      result.current.addTab({ url: "/contacts/2", title: "Tab 2" })
    })
    expect(result.current.showTabBar).toBe(true)
  })
})
```

**Step 2: Run tests to verify they fail**

Run: `pnpm vitest run components/layout/tabs-context.test.tsx`
Expected: FAIL — module not found

**Step 3: Implement TabsProvider**

Create `components/layout/tabs-context.tsx`:

```tsx
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
          t.id === action.payload.id
            ? { ...t, title: action.payload.title }
            : t
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

  const addTab = React.useCallback(
    (payload: { url: string; title: string; icon?: string }) => {
      dispatch({ type: "ADD_TAB", payload })
    },
    []
  )

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
```

**Step 4: Run tests to verify they pass**

Run: `pnpm vitest run components/layout/tabs-context.test.tsx`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add components/layout/tabs-context.tsx components/layout/tabs-context.test.tsx
git commit -m "feat(tabs): add TabsProvider context with state management and tests"
```

---

## Task 2: useTabTitle Hook

**Files:**
- Create: `lib/use-tab-title.ts`
- Create: `lib/use-tab-title.test.ts`

**Step 1: Write the failing test**

Create `lib/use-tab-title.test.ts`:

```tsx
import { renderHook } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useTabTitle } from "./use-tab-title"

const mockUpdateTabTitle = vi.fn()
const mockActiveTabId = "tab-1"

vi.mock("@/components/layout/tabs-context", () => ({
  useTabs: () => ({
    activeTabId: mockActiveTabId,
    updateTabTitle: mockUpdateTabTitle,
  }),
}))

describe("useTabTitle", () => {
  it("calls updateTabTitle with activeTabId and title", () => {
    renderHook(() => useTabTitle("Marie Dupont"))
    expect(mockUpdateTabTitle).toHaveBeenCalledWith("tab-1", "Marie Dupont")
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run lib/use-tab-title.test.ts`
Expected: FAIL — module not found

**Step 3: Implement the hook**

Create `lib/use-tab-title.ts`:

```ts
"use client"

import { useEffect } from "react"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Hook for CRM pages to set the title of their active tab.
 * Call this in any page component to update the tab title dynamically.
 *
 * @example
 * useTabTitle(contact.name) // "Marie Dupont"
 */
export function useTabTitle(title: string) {
  const { activeTabId, updateTabTitle } = useTabs()

  useEffect(() => {
    if (activeTabId && title) {
      updateTabTitle(activeTabId, title)
    }
  }, [activeTabId, title, updateTabTitle])
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run lib/use-tab-title.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/use-tab-title.ts lib/use-tab-title.test.ts
git commit -m "feat(tabs): add useTabTitle hook for dynamic tab titles"
```

---

## Task 3: TabBar & TabItem UI Components

**Files:**
- Create: `components/layout/tab-bar.tsx`
- Create: `components/layout/tab-item.tsx`

**Step 1: Implement TabItem**

Create `components/layout/tab-item.tsx`:

```tsx
"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabItemProps {
  title: string
  isActive: boolean
  onClick: () => void
  onClose: () => void
}

export function TabItem({ title, isActive, onClick, onClose }: TabItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex h-9 shrink-0 items-center gap-2 border-b-2 px-3 text-sm transition-colors",
        "max-w-[180px] min-w-[100px]",
        isActive
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <span className="truncate">{title}</span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation()
            onClose()
          }
        }}
        className={cn(
          "ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors",
          "hover:bg-muted-foreground/20",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        aria-label={`Close ${title}`}
      >
        <X className="h-3 w-3" />
      </span>
    </button>
  )
}
```

**Step 2: Implement TabBar**

Create `components/layout/tab-bar.tsx`:

```tsx
"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTabs } from "@/components/layout/tabs-context"
import { TabItem } from "@/components/layout/tab-item"

export function TabBar() {
  const { tabs, activeTabId, showTabBar, activateTab, closeTab, addTab } = useTabs()
  const router = useRouter()

  if (!showTabBar) return null

  function handleActivate(tabId: string, url: string) {
    activateTab(tabId)
    router.push(url)
  }

  function handleClose(tabId: string) {
    const closingTab = tabs.find((t) => t.id === tabId)
    const isActive = tabId === activeTabId

    closeTab(tabId)

    // If closing the active tab, navigate to the new active tab
    if (isActive) {
      const index = tabs.findIndex((t) => t.id === tabId)
      const remaining = tabs.filter((t) => t.id !== tabId)
      if (remaining.length > 0) {
        const nextTab = index > 0 ? remaining[index - 1] : remaining[0]
        router.push(nextTab.url)
      }
    }
  }

  function handleAddTab() {
    addTab({ url: "/dashboard", title: "Dashboard" })
    router.push("/dashboard")
  }

  return (
    <div className="flex h-9 items-center border-b border-border bg-(--main-background) overflow-x-auto hidden md:flex">
      <div className="flex items-center">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            title={tab.title}
            isActive={tab.id === activeTabId}
            onClick={() => handleActivate(tab.id, tab.url)}
            onClose={() => handleClose(tab.id)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddTab}
        className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
        aria-label="Open new tab"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
```

**Step 3: Verify lint passes**

Run: `pnpm biome check components/layout/tab-bar.tsx components/layout/tab-item.tsx`
Expected: No errors

**Step 4: Commit**

```bash
git add components/layout/tab-bar.tsx components/layout/tab-item.tsx
git commit -m "feat(tabs): add TabBar and TabItem visual components"
```

---

## Task 4: Integrate TabBar into Frame Layout

**Files:**
- Modify: `components/layout/frame.tsx` (lines 7-11, 25-43)
- Modify: `components/layout/app-frame.tsx` (lines 11-17, 47-58)

**Step 1: Add `tabBar` slot to Frame**

In `components/layout/frame.tsx`, add an optional `tabBar` prop and render it inside `<main>` before `<ScrollArea>`:

```tsx
// frame.tsx — updated FrameProps
export interface FrameProps {
  topBar: React.ReactNode
  navigation: React.ReactNode
  tabBar?: React.ReactNode   // NEW
  children: React.ReactNode
  className?: string
}
```

Update the Frame component's `<main>` section:

```tsx
<main className="flex-1 mt-(--topbar-height) md:pl-(--sidebar-width)">
  {tabBar}
  <ScrollArea className="h-full w-full rounded-tr-(--main-radius) bg-(--main-background)">
    {children}
  </ScrollArea>
</main>
```

When `tabBar` is `null` (no tabs or < 2 tabs), nothing renders — no layout shift.

**Step 2: Pass TabBar from AppFrame**

In `components/layout/app-frame.tsx`, import `TabBar` and pass it to `Frame`:

```tsx
import { TabBar } from "@/components/layout/tab-bar"

// Inside the AppFrame return:
<Frame
  topBar={
    <AppTopBar
      onOpenCommandPalette={onOpenCommandPalette}
      onOpenMobileMenu={() => setMobileSheetOpen((prev) => !prev)}
      activeSection={activeSection}
    />
  }
  navigation={<AppSidebar config={config} />}
  tabBar={<TabBar />}
>
  {children}
</Frame>
```

**Step 3: Verify the app compiles**

Run: `pnpm build`
Expected: Build succeeds (TabBar will not render yet — TabsProvider not added, useTabs will throw. That's Task 5.)

Note: The build might fail because `TabBar` calls `useTabs()` which requires `TabsProvider`. If so, make TabBar defensive: wrap the useTabs call or skip this verification and proceed to Task 5.

**Step 4: Commit**

```bash
git add components/layout/frame.tsx components/layout/app-frame.tsx
git commit -m "feat(tabs): integrate TabBar slot into Frame layout"
```

---

## Task 5: Wire TabsProvider into CRM Layout

**Files:**
- Modify: `app/(dashboard)/layout.tsx` (lines 1-37)

**Step 1: Add TabsProvider to the CRM layout**

In `app/(dashboard)/layout.tsx`, wrap `CrmLayoutInner` with `TabsProvider`:

```tsx
import { TabsProvider } from "@/components/layout/tabs-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <FrameProvider>
      <TabsProvider>
        <CrmLayoutInner>{children}</CrmLayoutInner>
      </TabsProvider>
    </FrameProvider>
  )
}
```

`TabsProvider` goes inside `FrameProvider` (it doesn't depend on it, but respects the existing hierarchy).

**Step 2: Verify the app runs**

Run: `pnpm dev` — navigate to `/dashboard`
Expected: Page loads normally. No tab bar visible (0 tabs).

**Step 3: Commit**

```bash
git add app/(dashboard)/layout.tsx
git commit -m "feat(tabs): wire TabsProvider into CRM dashboard layout"
```

---

## Task 6: URL Sync — Track Navigation in Active Tab

**Files:**
- Create: `lib/use-tab-url-sync.ts`
- Modify: `app/(dashboard)/layout.tsx`

**Step 1: Implement URL sync hook**

Create `lib/use-tab-url-sync.ts`:

```ts
"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Syncs the current URL (pathname) with the active tab.
 * When the user navigates within a tab (e.g., from /contacts to /contacts/123),
 * the active tab's URL is updated to reflect the new page.
 *
 * Also handles direct URL access: if the URL matches an existing tab, activate it.
 * If no tab exists for the URL and there are tabs open, create one.
 */
export function useTabUrlSync() {
  const pathname = usePathname()
  const { tabs, activeTabId, updateActiveTabUrl, activateTab, addTab } = useTabs()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (!pathname) return

    // On initial mount with restored tabs, just activate the matching tab
    if (isInitialMount.current) {
      isInitialMount.current = false
      const existing = tabs.find((t) => t.url === pathname)
      if (existing && existing.id !== activeTabId) {
        activateTab(existing.id)
      }
      return
    }

    // Check if the new URL matches an existing tab
    const existing = tabs.find((t) => t.url === pathname)
    if (existing) {
      if (existing.id !== activeTabId) {
        activateTab(existing.id)
      }
      return
    }

    // Otherwise update the active tab's URL
    if (activeTabId) {
      updateActiveTabUrl(pathname)
    }
  }, [pathname]) // Intentionally minimal deps — we read tabs/activeTabId from current state
}
```

**Step 2: Use the hook in CRM layout**

In `app/(dashboard)/layout.tsx`, inside `CrmLayoutInner`:

```tsx
import { useTabUrlSync } from "@/lib/use-tab-url-sync"

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
  const { setCommandPaletteOpen } = useFrame()
  useFrameLayout()
  useTabUrlSync() // NEW

  return (
    // ... unchanged
  )
}
```

**Step 3: Verify manually**

Run: `pnpm dev`
1. Open `/dashboard` — no tab bar
2. Open browser console, run: `localStorage.setItem('blazz-crm-tabs', JSON.stringify({ tabs: [{ id: '1', url: '/dashboard', title: 'Dashboard' }, { id: '2', url: '/contacts', title: 'Contacts' }], activeTabId: '1' }))`
3. Refresh — tab bar should appear with 2 tabs

**Step 4: Commit**

```bash
git add lib/use-tab-url-sync.ts app/(dashboard)/layout.tsx
git commit -m "feat(tabs): add URL sync hook to track navigation in active tab"
```

---

## Task 7: Cmd+Click Interception for New Tabs

**Files:**
- Create: `components/layout/tab-link-interceptor.tsx`
- Modify: `app/(dashboard)/layout.tsx`

**Step 1: Implement click interceptor**

This component intercepts clicks on `<a>` tags within the CRM. When Cmd/Ctrl is held, instead of following the link, it adds a new tab.

Create `components/layout/tab-link-interceptor.tsx`:

```tsx
"use client"

import { useCallback, useEffect } from "react"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Intercepts Cmd/Ctrl+click on links within the CRM to open them as new tabs.
 * Attaches a single event listener on the document (event delegation).
 */
export function TabLinkInterceptor() {
  const { addTab } = useTabs()

  const handleClick = useCallback(
    (e: MouseEvent) => {
      // Only intercept Cmd+click (Mac) or Ctrl+click (Win/Linux)
      if (!e.metaKey && !e.ctrlKey) return

      // Find the closest <a> tag
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // Only intercept internal CRM links
      if (!href.startsWith("/") || href.startsWith("/docs") || href.startsWith("/showcase")) return

      // Prevent default navigation
      e.preventDefault()
      e.stopPropagation()

      // Derive a title from the link text or URL
      const title = anchor.textContent?.trim() || href.split("/").pop() || "New Tab"

      addTab({ url: href, title })
    },
    [addTab]
  )

  useEffect(() => {
    document.addEventListener("click", handleClick, true) // capture phase
    return () => document.removeEventListener("click", handleClick, true)
  }, [handleClick])

  return null
}
```

**Step 2: Add to CRM layout**

In `app/(dashboard)/layout.tsx`, inside `CrmLayoutInner`:

```tsx
import { TabLinkInterceptor } from "@/components/layout/tab-link-interceptor"

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
  // ...
  return (
    <SidebarProvider>
      <AppFrame
        navigation={crmNavigationConfig}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        activeSection="crm"
      >
        {children}
      </AppFrame>
      <TabLinkInterceptor />
      <CommandPalette navigation={crmNavigationConfig} />
      <Toaster />
    </SidebarProvider>
  )
}
```

**Step 3: Verify manually**

Run: `pnpm dev`
1. Navigate to `/contacts`
2. Cmd+click on a contact name link
3. Tab bar should appear with 2 tabs (Contacts + the contact)

**Step 4: Commit**

```bash
git add components/layout/tab-link-interceptor.tsx app/(dashboard)/layout.tsx
git commit -m "feat(tabs): add Cmd+click interception to open links as new tabs"
```

---

## Task 8: Keyboard Shortcut — Cmd+W to Close Active Tab

**Files:**
- Modify: `components/layout/tab-link-interceptor.tsx`

**Step 1: Add Cmd+W handler**

In `tab-link-interceptor.tsx`, add a keydown listener:

```tsx
const { addTab, closeTab, activeTabId, tabs } = useTabs()

const handleKeyDown = useCallback(
  (e: KeyboardEvent) => {
    // Cmd+W or Ctrl+W to close active tab
    if ((e.metaKey || e.ctrlKey) && e.key === "w") {
      if (activeTabId && tabs.length >= 2) {
        e.preventDefault()
        closeTab(activeTabId)
      }
    }
  },
  [activeTabId, closeTab, tabs.length]
)

useEffect(() => {
  document.addEventListener("keydown", handleKeyDown)
  return () => document.removeEventListener("keydown", handleKeyDown)
}, [handleKeyDown])
```

**Step 2: Verify manually**

Run: `pnpm dev`
1. Open 2+ tabs via Cmd+click
2. Press Cmd+W — active tab should close
3. With only 1 tab remaining, Cmd+W should do nothing (browser handles it)

**Step 3: Commit**

```bash
git add components/layout/tab-link-interceptor.tsx
git commit -m "feat(tabs): add Cmd+W shortcut to close active tab"
```

---

## Task 9: CSS Variable for Tab Bar Height

**Files:**
- Modify: `app/globals.css` (near line 234)
- Modify: `components/layout/frame.tsx`

**Step 1: Add CSS variable**

In `app/globals.css`, after `--topbar-height: 56px;` (line 234), add:

```css
--tabbar-height: 36px;
```

**Step 2: Update Frame to use conditional height**

The tab bar already conditionally renders (returns null when < 2 tabs), so the layout automatically adjusts. No changes needed to the ScrollArea — it uses `h-full` which fills remaining space.

However, we need the `rounded-tr` on the tab bar when it's the first visible element, not on the ScrollArea. Update `frame.tsx`:

```tsx
<main className="flex-1 mt-(--topbar-height) md:pl-(--sidebar-width)">
  <div className="flex h-full flex-col rounded-tr-(--main-radius) bg-(--main-background)">
    {tabBar}
    <ScrollArea className="h-full w-full">
      {children}
    </ScrollArea>
  </div>
</main>
```

This wraps both `tabBar` and `ScrollArea` in a flex column with the background and rounded corner applied to the wrapper.

**Step 3: Verify visually**

Run: `pnpm dev`
- With 0-1 tabs: layout unchanged, rounded corner on content area
- With 2+ tabs: tab bar at top, content below, rounded corner on wrapper

**Step 4: Commit**

```bash
git add app/globals.css components/layout/frame.tsx
git commit -m "feat(tabs): add tabbar-height CSS variable and adjust frame layout"
```

---

## Task 10: Final Integration Test & Polish

**Files:**
- Run all tests
- Manual verification checklist

**Step 1: Run all tests**

Run: `pnpm vitest run`
Expected: ALL PASS

**Step 2: Run lint**

Run: `pnpm biome check .`
Expected: No errors in new files

**Step 3: Manual verification checklist**

1. [ ] Navigate to `/dashboard` — no tab bar visible
2. [ ] Cmd+click a link in the sidebar — tab bar appears with 2 tabs
3. [ ] Click between tabs — content switches, URL updates
4. [ ] Click X on a tab — tab closes, previous tab activates
5. [ ] Click "+" button — new Dashboard tab opens
6. [ ] Cmd+W — closes active tab (only when 2+ tabs)
7. [ ] Refresh the page — tabs are restored from localStorage
8. [ ] On mobile viewport — tab bar is hidden
9. [ ] Navigate within a tab (e.g., click contact in list) — tab URL updates
10. [ ] Cmd+click a URL that's already an open tab — activates existing tab, no duplicate

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(tabs): complete CRM in-app tab system v1"
```

---

## Summary

| Task | Description | New Files | Modified Files |
|------|-------------|-----------|----------------|
| 1 | TabsContext core state | `tabs-context.tsx`, `tabs-context.test.tsx` | — |
| 2 | useTabTitle hook | `use-tab-title.ts`, `use-tab-title.test.ts` | — |
| 3 | TabBar + TabItem UI | `tab-bar.tsx`, `tab-item.tsx` | — |
| 4 | Integrate TabBar into Frame | — | `frame.tsx`, `app-frame.tsx` |
| 5 | Wire TabsProvider into layout | — | `(dashboard)/layout.tsx` |
| 6 | URL sync hook | `use-tab-url-sync.ts` | `(dashboard)/layout.tsx` |
| 7 | Cmd+click interception | `tab-link-interceptor.tsx` | `(dashboard)/layout.tsx` |
| 8 | Cmd+W shortcut | — | `tab-link-interceptor.tsx` |
| 9 | CSS variable + Frame layout fix | — | `globals.css`, `frame.tsx` |
| 10 | Tests + manual verification | — | — |
