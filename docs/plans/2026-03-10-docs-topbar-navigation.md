# Docs Top-Bar Navigation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the monolithic 204-item sidebar with a 4-tab top-bar navigation (Composants, Blocks, AI, Guide) + contextual sidebar per section.

**Architecture:** The top-bar gets 4 nav tabs between logo and actions. The `sidebarConfig` is restructured into 4 named section configs. `DocsSidebar` and `DocsMobileSheet` receive a `sectionId` prop to filter which section to render. The active section is derived from the current URL pathname.

**Tech Stack:** TanStack Router, @blazz/ui Sidebar components, Tailwind CSS

---

### Task 1: Restructure navigation config

**Files:**
- Modify: `apps/docs/src/config/navigation.ts`

**Step 1: Merge UI + Patterns into "components" section and create "guide" section**

Replace the 6 sections (ui, patterns, blocks, ai, utils, outils) with 4 sections:

```typescript
export const sidebarConfig: SidebarConfig = {
  user: { ... }, // unchanged
  navigation: [
    {
      id: "components",
      title: "Composants",
      items: [
        // All items from current "ui" section (comp-layout, comp-actions, comp-forms, comp-feedback, comp-overlays, comp-navigation, comp-data-display, comp-foundations)
        // + All items from current "patterns" section (pat-app-shell, pat-navigation, pat-forms, pat-media, pat-utilities)
      ],
    },
    {
      id: "blocks",
      title: "Blocks",
      items: [
        // All items from current "blocks" section — unchanged
      ],
    },
    {
      id: "ai",
      title: "AI",
      items: [
        // All items from current "ai" section — unchanged
      ],
    },
    {
      id: "guide",
      title: "Guide",
      items: [
        {
          id: "guide-foundations",
          title: "Foundations",
          url: "/docs/components/colors",
          icon: Palette,
          items: [
            { title: "Colors", url: "/docs/components/colors", keywords: ["palette", "theme", "tokens", "design tokens", "oklch"] },
            { title: "Typography", url: "/docs/components/typography", keywords: ["fonts", "text styles", "headings", "font size", "typeface"] },
            { title: "Text", url: "/docs/components/ui/text", keywords: ["paragraph", "prose", "body text", "text component"] },
          ],
        },
        {
          id: "guide-concepts",
          title: "Concepts",
          url: "/docs/components/layout/inset",
          icon: Layers2,
          items: [
            { title: "Inset", url: "/docs/components/layout/inset", keywords: ["padding", "container", "wrapper", "density", "spacing", "token"] },
          ],
        },
        {
          id: "guide-tools",
          title: "Outils",
          url: "/docs/mcp",
          icon: Wrench,
          items: [
            { title: "MCP Server", url: "/docs/mcp", keywords: ["mcp", "model context protocol", "ai", "claude", "cursor"] },
            { title: "Sandbox", url: "/docs/sandbox", keywords: ["sandbox", "playground", "test"] },
          ],
        },
        {
          id: "guide-utils",
          title: "Utils",
          url: "/docs/utils/unsaved-changes-bar",
          icon: Save,
          items: [
            { title: "Unsaved Changes Bar", url: "/docs/utils/unsaved-changes-bar", keywords: ["unsaved", "dirty", "form guard"] },
            { title: "Quick Login", url: "/docs/utils/quick-login", keywords: ["dev", "test accounts", "quick login"] },
          ],
        },
      ],
    },
  ],
}
```

Key changes:
- Move `comp-foundations` (Colors, Typography, Text) from UI to Guide > Foundations
- Move Inset from UI > Layout to Guide > Concepts
- Merge Utils + Outils into Guide > Outils and Guide > Utils
- Remove Layout > Inset from components section (moved to guide)
- Remove Foundations category from components section (moved to guide)

**Step 2: Add a helper to get section by ID and a section-to-URL mapping**

```typescript
export type SectionId = "components" | "blocks" | "ai" | "guide"

export const sectionTabs: { id: SectionId; label: string; defaultUrl: string }[] = [
  { id: "components", label: "Composants", defaultUrl: "/docs/components/layout" },
  { id: "blocks", label: "Blocks", defaultUrl: "/docs/components/blocks/charts" },
  { id: "ai", label: "AI", defaultUrl: "/docs/components/ai/chat/conversation" },
  { id: "guide", label: "Guide", defaultUrl: "/docs/components/colors" },
]

export function getSectionForPathname(pathname: string): SectionId {
  if (pathname.startsWith("/docs/components/ai/")) return "ai"
  if (pathname.startsWith("/docs/components/blocks/")) return "blocks"
  if (pathname.startsWith("/docs/mcp") || pathname.startsWith("/docs/sandbox") || pathname.startsWith("/docs/utils/")) return "guide"
  if (pathname.startsWith("/docs/components/colors") || pathname.startsWith("/docs/components/typography")) return "guide"
  if (pathname.startsWith("/docs/components/layout/inset")) return "guide"
  if (pathname.startsWith("/docs/components/ui/text")) return "guide"
  return "components"
}

export function getSectionNavigation(sectionId: SectionId): NavigationSection | undefined {
  return sidebarConfig.navigation.find((s) => s.id === sectionId)
}
```

**Step 3: Verify navigation.ts compiles**

Run: `cd apps/docs && pnpm tsc --noEmit 2>&1 | head -30`
Expected: No errors related to navigation.ts

**Step 4: Commit**

```bash
git add apps/docs/src/config/navigation.ts
git commit -m "refactor(docs): restructure navigation into 4 sections (components, blocks, ai, guide)"
```

---

### Task 2: Add top-bar section tabs

**Files:**
- Modify: `apps/docs/src/routes/_docs.tsx`

**Step 1: Import helpers and add tabs to the top-bar**

Add section tabs between the logo and the right-side actions:

```tsx
import { sectionTabs, getSectionForPathname } from "~/config/navigation"

// Inside DocsLayout:
const { pathname } = useLocation()
const activeSectionId = getSectionForPathname(pathname)

// In the header, between logo div and actions div, add:
<nav className="hidden lg:flex items-center gap-1 ml-6">
  {sectionTabs.map((tab) => (
    <Link
      key={tab.id}
      to={tab.defaultUrl}
      className={cn(
        "px-3 py-1.5 text-sm rounded-md transition-colors",
        activeSectionId === tab.id
          ? "text-fg font-medium bg-raised"
          : "text-fg-muted hover:text-fg hover:bg-raised"
      )}
    >
      {tab.label}
    </Link>
  ))}
</nav>
```

Import `cn` from `@blazz/ui/lib/cn` (or wherever it's exported from).

**Step 2: Pass activeSectionId to sidebar components**

```tsx
<DocsSidebar sectionId={activeSectionId} />
// ...
<DocsMobileSheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} sectionId={activeSectionId} />
```

**Step 3: Verify it compiles (will have type errors until task 3)**

Run: `cd apps/docs && pnpm tsc --noEmit 2>&1 | head -30`

**Step 4: Commit**

```bash
git add apps/docs/src/routes/_docs.tsx
git commit -m "feat(docs): add section tabs to top-bar"
```

---

### Task 3: Update DocsSidebar to filter by section

**Files:**
- Modify: `apps/docs/src/components/docs/docs-sidebar.tsx`

**Step 1: Accept sectionId prop and filter navigation**

```tsx
import { getSectionNavigation } from "~/config/navigation"
import type { SectionId } from "~/config/navigation"

export function DocsSidebar({ sectionId }: { sectionId: SectionId }) {
  const { pathname } = useLocation()
  const [openItemId, setOpenItemId] = React.useState<string | null>(null)

  const section = getSectionNavigation(sectionId)

  // ... isActive stays the same

  React.useEffect(() => {
    if (!section) return
    const activeParentId = findActiveParentItemId([section], pathname)
    if (activeParentId) setOpenItemId(activeParentId)
  }, [pathname, section])

  if (!section) return null

  return (
    <Sidebar collapsible="none" className="hidden lg:flex rounded-lg overflow-hidden border border-container">
      <SidebarContent>
        {/* Render single section directly — no section title needed since top-bar shows it */}
        <NavSection
          section={section}
          isActive={isActive}
          openItemId={openItemId}
          setOpenItemId={setOpenItemId}
        />
      </SidebarContent>
    </Sidebar>
  )
}
```

**Step 2: Verify it compiles**

Run: `cd apps/docs && pnpm tsc --noEmit 2>&1 | head -30`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/docs/src/components/docs/docs-sidebar.tsx
git commit -m "feat(docs): filter sidebar by active section"
```

---

### Task 4: Update DocsMobileSheet to filter by section

**Files:**
- Modify: `apps/docs/src/components/docs/docs-mobile-sheet.tsx`

**Step 1: Accept sectionId and show section tabs + filtered sidebar**

The mobile sheet should show the 4 section tabs at the top (since the top-bar tabs are hidden on mobile), followed by the filtered sidebar content for the active section.

```tsx
import { sectionTabs, getSectionNavigation } from "~/config/navigation"
import type { SectionId } from "~/config/navigation"

interface DocsMobileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionId: SectionId
}

export function DocsMobileSheet({ open, onOpenChange, sectionId }: DocsMobileSheetProps) {
  const { pathname } = useLocation()
  const [openItemId, setOpenItemId] = React.useState<string | null>(null)
  const section = getSectionNavigation(sectionId)

  // ... rest same as before but filter to single section

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-(--sidebar-width) p-0 bg-surface" topOffset="var(--topbar-height)">
        <ScrollArea className="h-full">
          {/* Section tabs for mobile */}
          <div className="flex gap-1 p-3 border-b border-container">
            {sectionTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.defaultUrl}
                onClick={handleLinkClick}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  sectionId === tab.id
                    ? "text-fg font-medium bg-raised"
                    : "text-fg-muted hover:text-fg"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {/* Filtered sidebar content */}
          {section && (
            <SidebarContent>
              <NavSection
                section={section}
                isActive={isActive}
                onLinkClick={handleLinkClick}
                openItemId={openItemId}
                setOpenItemId={setOpenItemId}
              />
            </SidebarContent>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 2: Verify it compiles**

Run: `cd apps/docs && pnpm tsc --noEmit 2>&1 | head -30`
Expected: No errors

**Step 3: Commit**

```bash
git add apps/docs/src/components/docs/docs-mobile-sheet.tsx
git commit -m "feat(docs): update mobile sheet with section tabs and filtered sidebar"
```

---

### Task 5: Update components-navigation.ts if used

**Files:**
- Check: `apps/docs/src/config/components-navigation.ts`

**Step 1: Check if components-navigation.ts references the old section IDs**

Read the file. If it maps `sidebarConfig.navigation` by section IDs ("ui", "patterns", "blocks", "ai"), update the IDs to match the new structure ("components", "blocks", "ai", "guide").

**Step 2: Update mappings**

Replace old section ID references with new ones. The "components" section now contains what was both "ui" and "patterns".

**Step 3: Verify and commit**

Run: `cd apps/docs && pnpm tsc --noEmit 2>&1 | head -30`

```bash
git add apps/docs/src/config/components-navigation.ts
git commit -m "refactor(docs): update components-navigation to match new section IDs"
```

---

### Task 6: Visual verification and polish

**Step 1: Start the dev server**

Run: `cd /Users/jonathanruas/Development/blazz-ui-app && pnpm dev:docs`

**Step 2: Manual checks**

- [ ] Navigate to `/docs/components/ui/button` → "Composants" tab active, sidebar shows UI + Patterns categories
- [ ] Navigate to `/docs/components/blocks/data-table` → "Blocks" tab active, sidebar shows only Blocks categories
- [ ] Navigate to `/docs/components/ai/chat/conversation` → "AI" tab active, sidebar shows only AI categories
- [ ] Navigate to `/docs/components/colors` → "Guide" tab active, sidebar shows Guide categories
- [ ] Navigate to `/docs/mcp` → "Guide" tab active
- [ ] Navigate to `/docs/utils/quick-login` → "Guide" tab active
- [ ] Resize to mobile → tabs hidden in top-bar, hamburger opens sheet with section tabs
- [ ] `⌘K` command palette still searches all sections
- [ ] Click a different section tab → navigates to that section's first page

**Step 3: Fix any spacing/alignment issues in the top-bar**

Ensure the tabs don't push the right-side actions off-screen on smaller desktop viewports.

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix(docs): polish top-bar navigation spacing and alignment"
```
