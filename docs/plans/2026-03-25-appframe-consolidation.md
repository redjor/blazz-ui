# AppFrame Consolidation — pro only

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the unused `AppFrame` (+ `AppSidebar`, `AppTopBar`, `MobileSidebarSheet`) from `@blazz/ui/patterns` and create a single doc page for the pro `AppFrame` block.

**Architecture:** The pro `AppFrame` in `packages/pro/src/components/blocks/app-frame/` is the real implementation used by apps. The ui version has zero consumers. We delete the ui version, migrate the doc to point at `@blazz/pro`, and clean up navigation + registry.

**Tech Stack:** React, Next.js, TypeScript

---

### Task 1: Delete ui AppFrame and sub-components

**Files:**
- Delete: `packages/ui/src/components/patterns/app-frame.tsx`
- Delete: `packages/ui/src/components/patterns/app-sidebar.tsx`
- Delete: `packages/ui/src/components/patterns/app-top-bar.tsx`
- Delete: `packages/ui/src/components/patterns/mobile-sidebar-sheet.tsx`

**Step 1: Verify no other imports exist**

Run: `grep -r "patterns/app-frame\|patterns/app-sidebar\|patterns/app-top-bar\|patterns/mobile-sidebar" packages/ --include="*.ts" --include="*.tsx" | grep -v node_modules`
Expected: Only hits in the files we're deleting (self-imports between them). No external consumers.

**Step 2: Delete the 4 files**

```bash
rm packages/ui/src/components/patterns/app-frame.tsx
rm packages/ui/src/components/patterns/app-sidebar.tsx
rm packages/ui/src/components/patterns/app-top-bar.tsx
rm packages/ui/src/components/patterns/mobile-sidebar-sheet.tsx
```

**Step 3: Check for barrel exports referencing deleted files**

Run: `grep -n "app-frame\|app-sidebar\|app-top-bar\|mobile-sidebar" packages/ui/src/index.ts`
Expected: No matches (confirmed during brainstorming — not barrel-exported).

**Step 4: Commit**

```bash
git add -A packages/ui/src/components/patterns/
git commit -m "refactor(ui): remove unused AppFrame, AppSidebar, AppTopBar, MobileSidebarSheet patterns"
```

---

### Task 2: Delete old doc pages for ui AppFrame/AppSidebar/AppTopBar

**Files:**
- Delete: `apps/docs/src/app/docs/components/patterns/app-frame/` (directory)
- Delete: `apps/docs/src/app/docs/components/patterns/app-sidebar/` (directory)
- Delete: `apps/docs/src/app/docs/components/patterns/app-top-bar/` (directory)

**Step 1: Delete the 3 doc page directories**

```bash
rm -rf apps/docs/src/app/docs/components/patterns/app-frame
rm -rf apps/docs/src/app/docs/components/patterns/app-sidebar
rm -rf apps/docs/src/app/docs/components/patterns/app-top-bar
```

**Step 2: Commit**

```bash
git add -A apps/docs/src/app/docs/components/patterns/
git commit -m "docs: remove old ui AppFrame/AppSidebar/AppTopBar doc pages"
```

---

### Task 3: Update registry — remove old data files, update app-frame data for pro

**Files:**
- Delete: `apps/docs/src/data/components/app-sidebar.ts`
- Delete: `apps/docs/src/data/components/app-top-bar.ts`
- Modify: `apps/docs/src/data/components/app-frame.ts`
- Modify: `apps/docs/src/data/registry.ts`

**Step 1: Rewrite `app-frame.ts` to point at pro**

```ts
// apps/docs/src/data/components/app-frame.ts
import type { ComponentData } from "../types"

export const appFrameData: ComponentData = {
	name: "AppFrame",
	category: "blocks",
	description:
		"Application shell with sidebar, top bar, breadcrumbs, and optional browser-style tabs.",
	docPath: "/docs/blocks/app-frame",
	imports: {
		path: "@blazz/pro/components/blocks/app-frame",
		named: ["AppFrame", "useAppTopBar"],
	},
	props: [
		{
			name: "navItems",
			type: "NavItem[] | NavGroup[]",
			required: true,
			description: "Navigation items — flat array or grouped.",
		},
		{
			name: "logo",
			type: "React.ReactNode",
			description: "Logo rendered in the sidebar header.",
		},
		{
			name: "sidebarFooter",
			type: "React.ReactNode",
			description: "Content rendered at the bottom of the sidebar.",
		},
		{
			name: "sidebarCollapsible",
			type: '"offcanvas" | "icon" | "none"',
			default: '"offcanvas"',
			description: "Sidebar collapse behavior.",
		},
		{
			name: "tabs",
			type: "TabsConfig",
			description: "Enable browser-style tabs. Pass { storageKey, alwaysShow? }.",
		},
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Page content.",
		},
	],
	gotchas: [
		"Import from @blazz/pro/components/blocks/app-frame — requires @blazz/pro",
		"Use useAppTopBar(breadcrumbs, actions?) in page components to set the top bar",
		"navItems accepts NavItem[] (auto-wrapped in one group) or NavGroup[] (multiple sections)",
		"tabs prop enables browser-style tabs — requires @blazz/tabs peer dependency",
	],
	canonicalExample: `import { AppFrame } from "@blazz/pro/components/blocks/app-frame"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Contacts", url: "/contacts", icon: Users },
]

export default function Layout({ children }) {
  return (
    <AppFrame navItems={navItems} logo={<Logo />}>
      {children}
    </AppFrame>
  )
}`,
}
```

**Step 2: Delete `app-sidebar.ts` and `app-top-bar.ts`**

```bash
rm apps/docs/src/data/components/app-sidebar.ts
rm apps/docs/src/data/components/app-top-bar.ts
```

**Step 3: Update `registry.ts` — remove old imports, move appFrameData to Blocks section**

In `apps/docs/src/data/registry.ts`:
- Remove: `import { appSidebarData } from "./components/app-sidebar"`
- Remove: `import { appTopBarData } from "./components/app-top-bar"`
- In the registry array, remove `appSidebarData` and `appTopBarData` entries
- Move `appFrameData` from the "Patterns" section to the "Blocks" section

**Step 4: Commit**

```bash
git add apps/docs/src/data/
git commit -m "docs: migrate AppFrame registry data to @blazz/pro blocks"
```

---

### Task 4: Update docs navigation — move AppFrame to blocks, remove AppSidebar/AppTopBar

**Files:**
- Modify: `apps/docs/src/config/navigation.ts`

**Step 1: Remove items from the "App Shell" group (lines ~460-484)**

Remove the `App Frame`, `App Sidebar`, and `App Top Bar` entries from the "App Shell" pattern group. Keep `Dashboard Layout`, `Top Bar`, and `Layout Frame` in that group.

If the group's first item was "App Frame", update the group's `url` to point to the next remaining item (e.g. `Dashboard Layout`).

**Step 2: Add AppFrame to the blocks "Layout" group (line ~590)**

In the `block-layout` group, add an entry:

```ts
{
	title: "App Frame",
	url: "/docs/blocks/app-frame",
	keywords: ["app shell", "layout wrapper", "frame", "application frame", "sidebar", "tabs"],
},
```

**Step 3: Commit**

```bash
git add apps/docs/src/config/navigation.ts
git commit -m "docs: move AppFrame nav entry from patterns to blocks"
```

---

### Task 5: Create new pro AppFrame doc page

**Files:**
- Create: `apps/docs/src/app/docs/blocks/app-frame/page.tsx`

**Step 1: Create the doc page**

Create `apps/docs/src/app/docs/blocks/app-frame/page.tsx` with:
- Title: "App Frame"
- Subtitle: "Application shell with sidebar navigation, breadcrumb top bar, and optional browser-style tabs. The main entry point for pro applications."
- Sections: Usage (basic, with groups, with tabs, useAppTopBar), Layout diagram, Props (AppFrameProps, NavItem, NavGroup, TabsConfig, useAppTopBar), Related (Frame, Top Bar)
- Import path: `@blazz/pro/components/blocks/app-frame`
- Follow the exact same doc page pattern as the existing `app-frame/page.tsx` (use `DocPage`, `DocSection`, `DocExampleClient`, `DocPropsTable`, `DocRelated`)
- Code examples should reflect the **pro** API: `navItems`, `logo`, `tabs`, `useAppTopBar`

Key examples to include:

1. **Basic** — minimal AppFrame with flat navItems
2. **With groups** — navItems as NavGroup[] with labels
3. **With tabs** — passing `tabs={{ storageKey: "my-app" }}`
4. **useAppTopBar** — page-level breadcrumbs + actions

**Step 2: Verify the page builds**

Run: `cd apps/docs && pnpm build` (or `pnpm dev:docs` and navigate to `/docs/blocks/app-frame`)

**Step 3: Commit**

```bash
git add apps/docs/src/app/docs/blocks/app-frame/
git commit -m "docs: add pro AppFrame block documentation page"
```

---

### Task 6: Verify and clean up

**Step 1: Search for any remaining references to deleted files**

Run: `grep -r "patterns/app-frame\|patterns/app-sidebar\|patterns/app-top-bar\|patterns/mobile-sidebar" apps/ packages/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v .next`
Expected: No matches.

**Step 2: Build check**

Run: `pnpm build`
Expected: Clean build, no broken imports.

**Step 3: Commit if any fixups needed**

```bash
git commit -m "chore: clean up stale references after AppFrame consolidation"
```
