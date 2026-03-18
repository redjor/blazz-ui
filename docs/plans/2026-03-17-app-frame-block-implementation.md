# AppFrame Block — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a batteries-included `AppFrame` block in `@blazz/pro` that packages sidebar + tabs + top bar + breadcrumbs + scroll area into a single component, then migrate `apps/ops` to use it.

**Architecture:** `AppFrame` wraps `TabsProvider` (@blazz/tabs) → `SidebarProvider` (@blazz/ui) → `Frame` (@blazz/ui/patterns). Internal sub-components generate sidebar nav from a config array, wire up tab bar with D&D + URL sync, and expose a `useAppTopBar()` hook for pages to set breadcrumbs/actions.

**Tech Stack:** React 19, @blazz/ui (Frame, TopBar, Sidebar), @blazz/tabs (TabsProvider, TabsBar, NextTabsInterceptor), Next.js navigation, @dnd-kit

---

## Task 1: Create types.ts

**Files:**
- Create: `packages/pro/src/components/blocks/app-frame/types.ts`

**Step 1: Write the types file**

```ts
import type { ComponentType, ReactNode } from "react"

export interface NavItem {
  title: string
  url: string
  icon?: ComponentType<{ className?: string }>
  children?: NavItem[]
  badge?: string | number
}

export interface TabsConfig {
  storageKey: string
  alwaysShow?: boolean
  defaultTab: { url: string; title: string }
}

export interface AppFrameProps {
  logo?: ReactNode
  navItems: NavItem[]
  sidebarFooter?: ReactNode
  sidebarCollapsible?: "offcanvas" | "icon" | "none"
  tabs?: TabsConfig
  rounded?: boolean
  className?: string
  children: ReactNode
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface AppTopBarState {
  breadcrumbs: BreadcrumbItem[] | null
  actions: ReactNode
}
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/app-frame/types.ts
git commit -m "feat(app-frame): add type definitions"
```

---

## Task 2: Create app-frame-sidebar.tsx

**Files:**
- Create: `packages/pro/src/components/blocks/app-frame/app-frame-sidebar.tsx`

This component generates the full sidebar from `navItems` config. It's an extraction of `OpsSidebar` from `apps/ops/components/ops-frame.tsx:77-164`, made generic (no feature flags — those are filtered before passing `navItems`).

**Step 1: Write the sidebar component**

```tsx
"use client"

import {
  Sidebar,
  SidebarCollapsible,
  SidebarCollapsibleContent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuCollapsibleTrigger,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarResizeHandle,
} from "@blazz/ui/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import type { NavItem } from "./types"

interface AppFrameSidebarProps {
  logo?: ReactNode
  navItems: NavItem[]
  footer?: ReactNode
  collapsible?: "offcanvas" | "icon" | "none"
}

export function AppFrameSidebar({ logo, navItems, footer, collapsible = "offcanvas" }: AppFrameSidebarProps) {
  const pathname = usePathname()

  const isActive = (url?: string) => {
    if (!pathname || !url) return false
    if (url === "/") return pathname === "/"
    return pathname.startsWith(url)
  }

  const hasActiveChild = (items?: NavItem[]) =>
    items?.some((sub) => isActive(sub.url)) ?? false

  return (
    <Sidebar collapsible={collapsible} className="gap-2">
      {logo && (
        <SidebarHeader className="h-12 justify-center px-5">
          <Link href="/" className="flex items-center">
            {logo}
          </Link>
        </SidebarHeader>
      )}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.children?.length) {
                  const isParentActive = isActive(item.url) && !hasActiveChild(item.children)
                  return (
                    <SidebarCollapsible
                      key={item.url}
                      open={isActive(item.url) || hasActiveChild(item.children)}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuCollapsibleTrigger
                          spacing="compact"
                          asChild
                          isActive={isParentActive}
                        >
                          <Link href={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuCollapsibleTrigger>
                        <SidebarCollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((sub) => (
                              <SidebarMenuSubItem key={sub.url} isActive={isActive(sub.url)}>
                                <SidebarMenuSubButton asChild isActive={isActive(sub.url)}>
                                  <Link href={sub.url}>{sub.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </SidebarCollapsibleContent>
                      </SidebarMenuItem>
                    </SidebarCollapsible>
                  )
                }
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
      <SidebarResizeHandle />
    </Sidebar>
  )
}
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/app-frame/app-frame-sidebar.tsx
git commit -m "feat(app-frame): add sidebar component"
```

---

## Task 3: Create app-frame-tab-bar.tsx

**Files:**
- Create: `packages/pro/src/components/blocks/app-frame/app-frame-tab-bar.tsx`

Extraction of `OpsTabBar` + `MobileHeader` from `apps/ops/components/ops-frame.tsx:208-284`. Wires up TabsBar with D&D, sidebar trigger when collapsed, and mobile header.

**Step 1: Write the tab bar component**

```tsx
"use client"

import { useTabs } from "@blazz/tabs"
import { TabsBar, TabsItem, TabsItemOverlay } from "@blazz/tabs/ui"
import { SidebarTrigger, useSidebar } from "@blazz/ui/components/ui/sidebar"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

/** Shared mutable ref — set to true when a tab click triggers navigation */
export const tabClickNavRef = { current: false }

interface AppFrameTabBarProps {
  mobileLogo?: ReactNode
  defaultNewTabUrl?: string
  defaultNewTabTitle?: string
}

export function AppFrameTabBar({
  mobileLogo,
  defaultNewTabUrl = "/",
  defaultNewTabTitle = "Dashboard",
}: AppFrameTabBarProps) {
  const { tabs, activeTabId, showTabBar, activateTab, closeTab, addTab, reorderTabs } = useTabs()
  const sidebar = useSidebar()
  const router = useRouter()

  return (
    <>
      {/* Mobile header */}
      <div className="flex md:hidden h-10 items-center gap-2 border-b border-edge-subtle bg-surface-3 px-3">
        <SidebarTrigger />
        {mobileLogo}
      </div>

      {/* Tab bar */}
      {showTabBar && (
        <div className="flex items-center bg-surface-0">
          {sidebar.state === "collapsed" && (
            <SidebarTrigger className="ml-1 mr-1 shrink-0" />
          )}
          <TabsBar
            className="flex-1 border-t-0 bg-surface-0"
            tabIds={tabs.map((t) => t.id)}
            onReorder={reorderTabs}
            renderDragOverlay={(dragId) => {
              const tab = tabs.find((t) => t.id === dragId)
              if (!tab) return null
              return (
                <TabsItemOverlay
                  title={tab.title}
                  isActive={tab.id === activeTabId}
                  className="bg-surface-1 text-fg-secondary"
                  activeClassName="bg-surface-2 text-fg"
                />
              )
            }}
            onAddTab={() => {
              addTab({ url: defaultNewTabUrl, title: defaultNewTabTitle, deduplicate: false })
              router.push(defaultNewTabUrl)
            }}
          >
            {tabs.map((tab) => (
              <TabsItem
                key={tab.id}
                id={tab.id}
                title={tab.title}
                isActive={tab.id === activeTabId}
                onClick={() => {
                  tabClickNavRef.current = true
                  activateTab(tab.id)
                  router.push(tab.url)
                }}
                onClose={tabs.length > 1 ? () => {
                  const index = tabs.findIndex((t) => t.id === tab.id)
                  const remaining = tabs.filter((t) => t.id !== tab.id)
                  closeTab(tab.id)
                  if (tab.id === activeTabId && remaining.length > 0) {
                    const next = index > 0 ? remaining[index - 1] : remaining[0]
                    tabClickNavRef.current = true
                    router.push(next.url)
                  }
                } : undefined}
                className="bg-surface-1 text-fg-secondary hover:bg-surface-2 hover:text-fg"
                activeClassName="bg-surface-2 text-fg"
              />
            ))}
          </TabsBar>
        </div>
      )}
    </>
  )
}
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/app-frame/app-frame-tab-bar.tsx
git commit -m "feat(app-frame): add tab bar component with D&D"
```

---

## Task 4: Create app-frame-top-bar.tsx

**Files:**
- Create: `packages/pro/src/components/blocks/app-frame/app-frame-top-bar.tsx`

Extraction of `OpsTopBarContent` from `apps/ops/components/ops-frame.tsx:290-300`.

**Step 1: Write the top bar component**

```tsx
"use client"

import { TopBar } from "@blazz/ui/components/patterns/top-bar"
import type { AppTopBarState } from "./types"

interface AppFrameTopBarProps {
  state: AppTopBarState
}

export function AppFrameTopBar({ state }: AppFrameTopBarProps) {
  if (!state.breadcrumbs) return null

  return (
    <TopBar
      className="bg-surface-1 border-b border-edge-subtle"
      left={<TopBar.Breadcrumbs items={state.breadcrumbs} />}
      right={state.actions}
    />
  )
}
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/app-frame/app-frame-top-bar.tsx
git commit -m "feat(app-frame): add top bar component"
```

---

## Task 5: Create app-frame.tsx (main component + provider + hook)

**Files:**
- Create: `packages/pro/src/components/blocks/app-frame/app-frame.tsx`

This is the main orchestrator. Extraction of `OpsFrame` + `OpsFrameInner` from `apps/ops/components/ops-frame.tsx:306-382` + the `useOpsTopBar` hook (lines 177-184) + the `titleFromPathname` helper (lines 190-199).

**Step 1: Write the main component**

```tsx
"use client"

import { TabsProvider, useTabs } from "@blazz/tabs"
import { NextTabsInterceptor } from "@blazz/tabs/adapters/next"
import { Frame } from "@blazz/ui/components/patterns/frame"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { AppFrameSidebar } from "./app-frame-sidebar"
import { AppFrameTabBar, tabClickNavRef } from "./app-frame-tab-bar"
import { AppFrameTopBar } from "./app-frame-top-bar"
import type { AppFrameProps, AppTopBarState, BreadcrumbItem } from "./types"

// ── Context ──────────────────────────────────────────────────

const AppTopBarCtx = createContext<Dispatch<SetStateAction<AppTopBarState>>>(() => {})

/**
 * Hook for pages to set breadcrumbs and top-bar actions.
 *
 * @example
 * useAppTopBar([{ label: "Clients" }], <Button>New</Button>)
 * useAppTopBar([{ label: "Clients", href: "/clients" }, { label: name }])
 */
export function useAppTopBar(items: BreadcrumbItem[] | null, actions?: ReactNode) {
  const set = useContext(AppTopBarCtx)
  useEffect(() => {
    set({ breadcrumbs: items, actions: actions ?? null })
    return () => set({ breadcrumbs: null, actions: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set, items, actions])
}

// ── Title resolver ───────────────────────────────────────────

function makeTitleResolver(navItems: AppFrameProps["navItems"]) {
  return (pathname: string) => {
    const flat = navItems.flatMap((item) => [item, ...(item.children ?? [])])
    const match = flat.find((item) => {
      if (item.url === "/") return pathname === "/"
      return pathname.startsWith(item.url)
    })
    if (match) return match.title
    const last = pathname.split("/").filter(Boolean).pop()
    return last ? last.charAt(0).toUpperCase() + last.slice(1) : "Dashboard"
  }
}

// ── AppFrame ─────────────────────────────────────────────────

export function AppFrame({
  logo,
  navItems,
  sidebarFooter,
  sidebarCollapsible = "offcanvas",
  tabs,
  rounded = true,
  className,
  children,
}: AppFrameProps) {
  const pathname = usePathname()
  const titleResolver = useMemo(() => makeTitleResolver(navItems), [navItems])

  // Stable ref — only captures the pathname at first mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultTab = useMemo(
    () => tabs?.defaultTab ?? { url: pathname, title: titleResolver(pathname) },
    []
  )

  const inner = (
    <AppFrameInner
      logo={logo}
      navItems={navItems}
      sidebarFooter={sidebarFooter}
      sidebarCollapsible={sidebarCollapsible}
      rounded={rounded}
      titleResolver={titleResolver}
      className={className}
    >
      {children}
    </AppFrameInner>
  )

  if (tabs) {
    return (
      <TabsProvider
        storageKey={tabs.storageKey}
        alwaysShowTabBar={tabs.alwaysShow}
        defaultTab={defaultTab}
      >
        {inner}
      </TabsProvider>
    )
  }

  return inner
}

// ── Inner shell (inside TabsProvider) ────────────────────────

interface AppFrameInnerProps {
  logo?: ReactNode
  navItems: AppFrameProps["navItems"]
  sidebarFooter?: ReactNode
  sidebarCollapsible: NonNullable<AppFrameProps["sidebarCollapsible"]>
  rounded: boolean
  titleResolver: (pathname: string) => string
  className?: string
  children: ReactNode
}

function AppFrameInner({
  logo,
  navItems,
  sidebarFooter,
  sidebarCollapsible,
  rounded,
  titleResolver,
  className,
  children,
}: AppFrameInnerProps) {
  const pathname = usePathname()
  const [topBar, setTopBar] = useState<AppTopBarState>({
    breadcrumbs: null,
    actions: null,
  })

  // URL ↔ tab sync (only when tabs are enabled)
  let hasTabs = false
  try {
    const tabsCtx = useTabs()
    hasTabs = true
    useUrlTabSync(pathname, tabsCtx, titleResolver)
    useBreadcrumbTitleSync(topBar, tabsCtx)
  } catch {
    // No TabsProvider — tabs disabled, skip sync
  }

  const mobileLogo = logo ? (
    <Link href="/" className="flex items-center">
      {logo}
    </Link>
  ) : undefined

  return (
    <AppTopBarCtx.Provider value={setTopBar}>
      <SidebarProvider>
        <Frame
          className={className}
          navigation={
            <AppFrameSidebar
              logo={logo}
              navItems={navItems}
              footer={sidebarFooter}
              collapsible={sidebarCollapsible}
            />
          }
          tabBar={hasTabs ? (
            <>
              <div className="flex md:hidden h-10 items-center gap-2 border-b border-edge-subtle bg-surface-3 px-3">
                <span />
                {mobileLogo}
              </div>
              <AppFrameTabBar mobileLogo={mobileLogo} />
            </>
          ) : undefined}
          header={<AppFrameTopBar state={topBar} />}
        >
          {hasTabs && <NextTabsInterceptor titleResolver={titleResolver} />}
          {children}
        </Frame>
      </SidebarProvider>
    </AppTopBarCtx.Provider>
  )
}

// ── URL ↔ Tab sync hook ──────────────────────────────────────

function useUrlTabSync(
  pathname: string,
  { activeTabId, updateActiveTabUrl, updateTabTitle }: Pick<
    ReturnType<typeof useTabs>,
    "activeTabId" | "updateActiveTabUrl" | "updateTabTitle"
  >,
  titleResolver: (pathname: string) => string
) {
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    if (!pathname || !activeTabId) return

    if (tabClickNavRef.current) {
      tabClickNavRef.current = false
      return
    }

    if (pathname !== prevPathnameRef.current) {
      updateActiveTabUrl(pathname)
      updateTabTitle(activeTabId, titleResolver(pathname))
    }
    prevPathnameRef.current = pathname
  }, [pathname, activeTabId, updateActiveTabUrl, updateTabTitle, titleResolver])
}

// ── Breadcrumb → tab title sync ──────────────────────────────

function useBreadcrumbTitleSync(
  topBar: AppTopBarState,
  { updateTabTitle }: Pick<ReturnType<typeof useTabs>, "updateTabTitle">
) {
  const activeTabIdRef = useRef<string | null>(null)
  try {
    const { activeTabId } = useTabs()
    activeTabIdRef.current = activeTabId
  } catch {
    // no tabs context
  }

  useEffect(() => {
    const tabId = activeTabIdRef.current
    if (!tabId || !topBar.breadcrumbs || topBar.breadcrumbs.length === 0) return
    const last = topBar.breadcrumbs[topBar.breadcrumbs.length - 1]
    if (last.label) {
      updateTabTitle(tabId, last.label)
    }
  }, [topBar.breadcrumbs, updateTabTitle])
}
```

**Important notes for implementer:**
- The conditional `useTabs()` inside `AppFrameInner` uses try/catch because when `tabs` prop is undefined, there's no `TabsProvider` parent. This is the cleanest way to make tabs optional without splitting into two separate component trees.
- `tabClickNavRef` is imported from `app-frame-tab-bar.tsx` — it's the shared mutable ref that prevents URL sync from interfering with tab click navigation (same pattern as OPS).

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/app-frame/app-frame.tsx
git commit -m "feat(app-frame): add main component with provider and useAppTopBar hook"
```

---

## Task 6: Create index.ts barrel + add to blocks barrel

**Files:**
- Create: `packages/pro/src/components/blocks/app-frame/index.ts`
- Modify: `packages/pro/src/components/blocks/index.ts`

**Step 1: Write the barrel**

`packages/pro/src/components/blocks/app-frame/index.ts`:
```ts
export { AppFrame, useAppTopBar } from "./app-frame"
export type { AppFrameProps, BreadcrumbItem, NavItem, TabsConfig } from "./types"
```

**Step 2: Add to blocks barrel**

Add to `packages/pro/src/components/blocks/index.ts` after the existing exports:

```ts
export type { AppFrameProps, BreadcrumbItem, NavItem, TabsConfig } from "./app-frame"
export { AppFrame, useAppTopBar } from "./app-frame"
```

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/app-frame/index.ts packages/pro/src/components/blocks/index.ts
git commit -m "feat(app-frame): add barrel exports"
```

---

## Task 7: Add @blazz/tabs as dependency of @blazz/pro

**Files:**
- Modify: `packages/pro/package.json`

**Step 1: Add dependency**

Add `@blazz/tabs` to `peerDependencies` in `packages/pro/package.json`:

```json
"peerDependencies": {
  "@blazz/tabs": "workspace:*",
  "@blazz/ui": "workspace:*",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "tailwindcss": "^4.0.0"
}
```

**Step 2: Run pnpm install to update lockfile**

```bash
pnpm install
```

**Step 3: Commit**

```bash
git add packages/pro/package.json pnpm-lock.yaml
git commit -m "feat(app-frame): add @blazz/tabs peer dependency to @blazz/pro"
```

---

## Task 8: Type-check the new package code

**Step 1: Run type check**

```bash
cd packages/pro && pnpm tsc --noEmit
```

Expected: no errors. Fix any issues before proceeding.

**Step 2: Commit fixes if any**

---

## Task 9: Migrate apps/ops to use AppFrame

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx`
- Modify: any file that imports `useOpsTopBar` → change to `useAppTopBar`

**Step 1: Find all useOpsTopBar consumers**

```bash
grep -r "useOpsTopBar" apps/ops/ --include="*.tsx" -l
```

**Step 2: Rewrite ops-frame.tsx**

Replace the entire `apps/ops/components/ops-frame.tsx` with:

```tsx
"use client"

import { type FeatureFlag, isEnabled } from "@/lib/features"
import { AppFrame, type NavItem } from "@blazz/pro/components/blocks/app-frame"
import {
  Banknote,
  CheckSquare,
  Clock,
  FolderOpen,
  Key,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  Sun,
  Users,
} from "lucide-react"
import type { ReactNode } from "react"
import { useMemo } from "react"
import { BlazzLogo } from "@/components/blazz-logo"
import { OpsUserMenu } from "./ops-user-menu"

interface NavItemWithFlag extends NavItem {
  flag?: FeatureFlag
  children?: NavItemWithFlag[]
}

const allNavItems: NavItemWithFlag[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, flag: "dashboard" },
  { title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
  { title: "Projets", url: "/projects", icon: FolderOpen, flag: "projects" },
  { title: "Clients", url: "/clients", icon: Users, flag: "clients" },
  {
    title: "Suivi de temps",
    url: "/time",
    icon: Clock,
    flag: "time",
    children: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
  },
  { title: "Finances", url: "/finances", icon: Banknote, flag: "finances" },
  { title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
  { title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
  { title: "Packages", url: "/packages", icon: Package, flag: "packages" },
  { title: "Licences", url: "/licenses", icon: Key, flag: "licenses" },
  { title: "Paramètres", url: "/settings", icon: Settings, flag: "settings" },
]

function filterByFlag(items: NavItemWithFlag[]): NavItem[] {
  return items
    .filter((item) => !item.flag || isEnabled(item.flag))
    .map((item) => {
      const { flag, children, ...rest } = item
      if (children?.length) {
        const filtered = filterByFlag(children)
        return filtered.length > 0 ? { ...rest, children: filtered } : rest
      }
      return rest
    })
}

export function OpsFrame({ children }: { children: ReactNode }) {
  const navItems = useMemo(() => filterByFlag(allNavItems), [])

  return (
    <AppFrame
      logo={<BlazzLogo className="text-fg" />}
      navItems={navItems}
      sidebarFooter={<OpsUserMenu />}
      tabs={{
        storageKey: "ops-tabs",
        alwaysShow: true,
        defaultTab: { url: "/", title: "Dashboard" },
      }}
    >
      {children}
    </AppFrame>
  )
}
```

**Step 3: Update all useOpsTopBar imports**

In every file found in Step 1, replace:
```tsx
import { useOpsTopBar } from "@/components/ops-frame"
```
with:
```tsx
import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
```

And rename all calls from `useOpsTopBar(...)` to `useAppTopBar(...)`.

**Step 4: Remove ops-breadcrumb.tsx if no longer imported anywhere**

Check if `apps/ops/components/ops-breadcrumb.tsx` is still imported anywhere. If not, delete it — the `BreadcrumbItem` type is now exported from `@blazz/pro/components/blocks/app-frame`.

**Step 5: Commit**

```bash
git add apps/ops/
git commit -m "refactor(ops): migrate to AppFrame block from @blazz/pro"
```

---

## Task 10: Verify the app runs

**Step 1: Start the dev server**

```bash
pnpm dev:ops
```

**Step 2: Manual verification checklist**

- [ ] App loads without errors
- [ ] Sidebar renders with all nav items (respecting feature flags)
- [ ] Sidebar collapse/expand works (click + Cmd+B)
- [ ] Sidebar peek on hover works when collapsed
- [ ] Tab bar visible with at least 1 tab
- [ ] Clicking sidebar nav updates active tab URL
- [ ] Tab D&D reorder works
- [ ] Opening new tab works (+ button)
- [ ] Closing tab works (X button)
- [ ] Cmd+Click opens link in new tab
- [ ] Breadcrumbs show on pages that call `useAppTopBar()`
- [ ] Top bar actions show (e.g., "Nouveau client" on Clients page)
- [ ] Mobile responsive (sidebar as sheet)
- [ ] Light/dark theme works

**Step 3: Fix any issues found**

**Step 4: Final commit**

```bash
git add .
git commit -m "fix(app-frame): address issues found during verification"
```
