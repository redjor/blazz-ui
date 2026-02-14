# CRM In-App Tab System - Design Document

## Overview

Add a browser-like tab system to the CRM section of the application. Tabs allow users to keep multiple pages open simultaneously (e.g., two product sheets, a contact and a deal) without relying on browser tabs. Inspired by Linear's desktop app and VS Code's tab bar.

## Scope

- CRM section only (`app/(dashboard)/`)
- Showcase and Docs sections are unaffected

## Data Model

```ts
interface Tab {
  id: string          // UUID
  url: string         // e.g. "/contacts/clu8x..."
  title: string       // e.g. "Marie Dupont"
  icon?: string       // e.g. "contact" | "deal" | "product"
  closable: boolean   // always true
}

interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}
```

## Behavior

### Tab Bar Visibility

- 0-1 tabs: bar hidden, page behaves as today
- 2+ tabs: bar appears between top bar and content

### Opening Tabs

| Action | Result |
|--------|--------|
| Normal click (sidebar or content) | Navigates in the current tab (updates its URL) |
| Cmd/Ctrl+click on any link | Opens a new tab with that URL (does not navigate) |
| "+" button in tab bar | Opens a new tab at `/dashboard` |

### Closing Tabs

| Scenario | Behavior |
|----------|----------|
| Close active tab | Activates the tab to the left (or right if first) |
| Close last remaining tab | Bar disappears, stay on current page |
| Cmd+W shortcut | Closes the active tab |

### Switching Tabs

- Click on a tab = `router.push()` to its URL, mark as active
- URL always reflects the active tab

### Edge Cases

| Scenario | Behavior |
|----------|----------|
| Page refresh with 3 tabs | Restores all 3, navigates to the active tab's URL |
| Direct URL `/contacts/123` | If a tab with that URL exists, activate it. Otherwise create a new tab |
| Cmd+click a URL already open | Activate the existing tab instead of creating a duplicate |
| Navigation within a tab | The tab's URL is updated to reflect the new page |

## Architecture

### Component Tree

```
FrameProvider (existing)
  TabsProvider (new context)
    AppFrame
      AppTopBar
      Frame
        Sidebar
        Main area
          TabBar (visible if 2+ tabs)
            TabItem (x N)
            AddTabButton (+)
          Page content (router children)
    localStorage sync
```

### New Files

| File | Purpose |
|------|---------|
| `components/layout/tabs-context.tsx` | Context + state management (add/close/switch tabs) |
| `components/layout/tab-bar.tsx` | Visual tab bar component |
| `components/layout/tab-item.tsx` | Individual tab (title + close button) |
| `lib/use-tab-title.ts` | Hook for pages to set their tab title/icon |

### Modified Files

| File | Change |
|------|--------|
| `app/(dashboard)/layout.tsx` | Wrap with `TabsProvider` |
| `components/layout/frame.tsx` | Add slot for `TabBar` between top bar and content |

## Visual Design

- Tab bar: horizontal, ~36px height, same background as content (`--main-background`)
- Active tab: lighter background, accent bottom border
- Inactive tabs: transparent background, muted text
- Each tab: icon + truncated title (max ~180px) + X button on hover
- Horizontal scroll if overflow
- "+" button at the right end of the bar

## Persistence

- Key: `blazz-crm-tabs`
- Format: `{ tabs: Tab[], activeTabId: string }` as JSON
- Debounce: 300ms after each change
- Restored on `TabsProvider` mount

## Responsive

- Tab bar hidden on mobile (< md breakpoint)
- Standard navigation on mobile

## Future Enhancements (NOT in v1)

- Drag & drop reordering (@dnd-kit ready)
- Keep-alive for tab content (preserve scroll/form state)
- Tab pinning
- Tab grouping by entity type
- Right-click context menu on tabs

## Approach

**Approach A: Client-side Tab Manager with Next.js Router** (selected)

Tabs are a UI layer on top of Next.js routing. The URL always reflects the active tab. Inactive tabs store their URL but their content is not mounted. Switching tabs triggers `router.push()`.

Pros: Simple, SSR/RSC compatible, URL stays in sync
Cons: Content reloads when switching tabs (mitigated by Next.js caching)
