# Component Reorganization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 5-folder structure (`ui/`, `blocks/`, `layout/`, `features/`, `ai/`) with a clean 4-layer taxonomy (`ui/`, `patterns/`, `blocks/`, `ai/`) where the folder structure is the single source of truth for both the package API and the docs navigation.

**Architecture:** `layout/` and `features/` are dissolved — layout components and generic feature compositions move to a new `patterns/` folder, the data-table system moves to `blocks/`, and 4 generic items (`form-field`, `form-section`, `field-grid`, `error-state`) move from `blocks/` to `patterns/`. The main barrel `index.ts`, all sub-barrels, docs navigation, and docs route files are updated accordingly.

**Tech Stack:** TypeScript, pnpm workspaces, Turborepo, TanStack Start (docs app), tsup (build)

**Design doc:** `docs/plans/2026-02-27-component-reorganization-design.md`

---

## Task 1: Investigate the page-header conflict

There are two `page-header` files: `layout/page-header.tsx` and `blocks/page-header.tsx`. Before moving anything, determine if they are the same component or different.

**Files:**
- Read: `packages/ui/src/components/layout/page-header.tsx`
- Read: `packages/ui/src/components/blocks/page-header.tsx`

**Step 1: Read both files side by side**

```bash
cat packages/ui/src/components/layout/page-header.tsx
cat packages/ui/src/components/blocks/page-header.tsx
```

**Step 2: Decide**

- If they are effectively the same → keep `blocks/page-header.tsx`, delete `layout/page-header.tsx`, move the kept one to `patterns/page-header.tsx` in Task 2.
- If they are different → rename `layout/page-header.tsx` to `layout/page-header-shell.tsx` before moving, so there is no collision.

Note the decision for Tasks 2 and 6.

**Step 3: Commit**

```bash
git add -p
git commit -m "chore: document page-header conflict resolution decision"
```

---

## Task 2: Move `layout/` → `patterns/`

**Files:**
- Move: all 21 files from `packages/ui/src/components/layout/`
- Create: `packages/ui/src/components/patterns/` (new folder)

**Step 1: Create patterns/ and git-move all layout files**

```bash
mkdir -p packages/ui/src/components/patterns

# Move all files individually to preserve git history
git mv packages/ui/src/components/layout/app-frame.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/app-sidebar.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/app-top-bar.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/dashboard-layout.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/frame.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/frame-context.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/layout-frame.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/layout-top-bar.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/mobile-sidebar-sheet.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/nav-tabs.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/navbar.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/notification-sheet.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/sidebar-exports.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/sidebar-search.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/sidebar-user.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/tab-bar.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/theme-palette-switcher.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/theme-toggle.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/top-bar.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/layout/user-menu.tsx packages/ui/src/components/patterns/
```

For `page-header.tsx`, apply the decision from Task 1:
- If same component: `git mv packages/ui/src/components/layout/page-header.tsx packages/ui/src/components/patterns/` (then delete `blocks/page-header.tsx` in Task 4)
- If different: `git mv packages/ui/src/components/layout/page-header.tsx packages/ui/src/components/patterns/page-header-shell.tsx`

Also move the layout index:
```bash
git mv packages/ui/src/components/layout/index.ts packages/ui/src/components/patterns/index.ts
```

**Step 2: Verify the move**

```bash
ls packages/ui/src/components/patterns/
# Expected: 21 .tsx files + index.ts
ls packages/ui/src/components/layout/
# Expected: empty
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/patterns/ packages/ui/src/components/layout/
git commit -m "refactor(ui): move layout/ into patterns/"
```

---

## Task 3: Move `features/command-palette`, `features/image-upload`, `features/navigation-tabs` → `patterns/`

**Files:**
- Move: `packages/ui/src/components/features/command-palette/`
- Move: `packages/ui/src/components/features/image-upload/`
- Move: `packages/ui/src/components/features/navigation-tabs/`

**Step 1: Git-move the three folders**

```bash
git mv packages/ui/src/components/features/command-palette packages/ui/src/components/patterns/command-palette
git mv packages/ui/src/components/features/image-upload packages/ui/src/components/patterns/image-upload
git mv packages/ui/src/components/features/navigation-tabs packages/ui/src/components/patterns/navigation-tabs
```

**Step 2: Verify**

```bash
ls packages/ui/src/components/patterns/
# Expected: all previous files + command-palette/ image-upload/ navigation-tabs/ subfolders
ls packages/ui/src/components/features/
# Expected: data-table/ only
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/patterns/ packages/ui/src/components/features/
git commit -m "refactor(ui): move features/command-palette, image-upload, navigation-tabs into patterns/"
```

---

## Task 4: Move 4 generic items from `blocks/` → `patterns/`

`form-field`, `form-section`, `field-grid`, and `error-state` have no business context and belong in `patterns/`.

**Files:**
- Move: `packages/ui/src/components/blocks/form-field.tsx`
- Move: `packages/ui/src/components/blocks/form-section.tsx`
- Move: `packages/ui/src/components/blocks/field-grid.tsx`
- Move: `packages/ui/src/components/blocks/error-state.tsx`
- Also handle `blocks/page-header.tsx` per Task 1 decision

**Step 1: Git-move the 4 files**

```bash
git mv packages/ui/src/components/blocks/form-field.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/blocks/form-section.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/blocks/field-grid.tsx packages/ui/src/components/patterns/
git mv packages/ui/src/components/blocks/error-state.tsx packages/ui/src/components/patterns/
```

If Task 1 concluded page-header is the same → also delete the now-redundant one:
```bash
git rm packages/ui/src/components/blocks/page-header.tsx
```
If they were different → leave `blocks/page-header.tsx` in place.

**Step 2: Verify**

```bash
ls packages/ui/src/components/patterns/ | grep -E "form-field|form-section|field-grid|error-state"
# Expected: 4 files listed
```

**Step 3: Commit**

```bash
git add packages/ui/src/components/patterns/ packages/ui/src/components/blocks/
git commit -m "refactor(ui): move form-field, form-section, field-grid, error-state from blocks/ to patterns/"
```

---

## Task 5: Move `features/data-table` → `blocks/data-table`

The data-table system (71 files, 7 subfolders) is business-specific and belongs in `blocks/`.

**Files:**
- Move: `packages/ui/src/components/features/data-table/` → `packages/ui/src/components/blocks/data-table/`

**Step 1: Git-move the entire data-table folder**

```bash
git mv packages/ui/src/components/features/data-table packages/ui/src/components/blocks/data-table
```

**Step 2: Verify**

```bash
ls packages/ui/src/components/blocks/data-table/
# Expected: adapters/ cells/ config/ factories/ hooks/ presets/ + root .tsx/.ts files
ls packages/ui/src/components/features/
# Expected: empty
```

**Step 3: Remove empty features/ folder**

```bash
rmdir packages/ui/src/components/features/
git add packages/ui/src/components/features/
```

**Step 4: Commit**

```bash
git add packages/ui/src/components/blocks/ packages/ui/src/components/features/
git commit -m "refactor(ui): move features/data-table into blocks/ and remove empty features/"
```

---

## Task 6: Update `patterns/index.ts`

The moved `layout/index.ts` only re-exported a subset. Rebuild it to export everything in `patterns/`.

**Files:**
- Modify: `packages/ui/src/components/patterns/index.ts`

**Step 1: Read the current file**

```bash
cat packages/ui/src/components/patterns/index.ts
```

**Step 2: Replace with full patterns barrel**

The new `patterns/index.ts` should export from every file/folder in patterns/:

```typescript
// ── App Shell ──────────────────────────────────
export * from "./app-frame"
export * from "./app-sidebar"
export * from "./app-top-bar"
export * from "./dashboard-layout"
export { type FrameProps } from "./frame"
export { type Breadcrumb as FrameBreadcrumb, FrameProvider, useFrame, useBreadcrumbs } from "./frame-context"
export * from "./layout-frame"
export * from "./layout-top-bar"
export * from "./mobile-sidebar-sheet"
export * from "./notification-sheet"
export * from "./sidebar-exports"
export * from "./sidebar-search"
export * from "./sidebar-user"
export * from "./top-bar"
export * from "./user-menu"

// ── Navigation ─────────────────────────────────
export * from "./nav-tabs"
export * from "./navbar"
export * from "./tab-bar"
export * from "./navigation-tabs"

// ── Forms ──────────────────────────────────────
export * from "./form-field"
export * from "./form-section"
export { FieldGrid, type FieldGridProps } from "./field-grid"

// ── Media ──────────────────────────────────────
export * from "./image-upload/image-upload"
export * from "./image-upload/image-preview"

// ── Utilities ──────────────────────────────────
export * from "./command-palette/command-palette"
export * from "./error-state"
export * from "./theme-toggle"
export * from "./theme-palette-switcher"

// ── Page Header ────────────────────────────────
export { type BreadcrumbItemType } from "./page-header"
```

Adjust if Task 1 renamed `page-header` to `page-header-shell`.

**Step 3: Verify TypeScript compilation**

```bash
cd packages/ui && pnpm tsc --noEmit 2>&1 | head -30
```

Expected: no errors about missing exports from patterns/.

**Step 4: Commit**

```bash
git add packages/ui/src/components/patterns/index.ts
git commit -m "refactor(ui): create patterns/index.ts barrel"
```

---

## Task 7: Update `blocks/index.ts`

Remove the 4 items moved to `patterns/` and add `data-table` exports.

**Files:**
- Modify: `packages/ui/src/components/blocks/index.ts`

**Step 1: Read the current file**

```bash
cat packages/ui/src/components/blocks/index.ts
```

**Step 2: Remove these lines**

```typescript
// REMOVE these 4 lines:
export * from "./error-state"
export { FieldGrid, type FieldGridProps } from "./field-grid"
export * from "./form-field"
export * from "./form-section"
// Also remove page-header if deleted in Task 4
export * from "./page-header"  // remove if merged into patterns
```

**Step 3: Add data-table exports at the end of the blocks section**

```typescript
// ── Data Table ─────────────────────────────────
// DataTable barrel has naming conflicts (BulkAction, RowAction, FilterGroup, FilterOperator)
// Import DataTable from "@blazz/ui/components/blocks/data-table"
```

Note: keep data-table as a direct-import-only block (no barrel export) to avoid naming conflicts — same pattern as before, just new path.

**Step 4: Verify**

```bash
cd packages/ui && pnpm tsc --noEmit 2>&1 | head -30
```

**Step 5: Commit**

```bash
git add packages/ui/src/components/blocks/index.ts
git commit -m "refactor(ui): update blocks/index.ts — remove moved items, reference data-table new path"
```

---

## Task 8: Update the main barrel `packages/ui/src/index.ts`

Replace the `// ── Layout ──` and `// ── Features ──` sections with `// ── Patterns ──`, and update the data-table comment.

**Files:**
- Modify: `packages/ui/src/index.ts`

**Step 1: Read the current file**

```bash
cat packages/ui/src/index.ts
```

**Step 2: Replace the Layout + Features sections**

Remove everything under `// ── Features ──` and `// ── Layout ──` (lines 108–148 approximately).

Replace with:

```typescript
// ── Patterns ───────────────────────────────────
export * from "./components/patterns"
```

**Step 3: Update the Blocks section comment for data-table**

Change:
```typescript
// DataTable barrel has naming conflicts (BulkAction, RowAction, FilterGroup, FilterOperator)
// Import DataTable from "@blazz/ui/components/features/data-table"
```

To:
```typescript
// DataTable barrel has naming conflicts (BulkAction, RowAction, FilterGroup, FilterOperator)
// Import DataTable from "@blazz/ui/components/blocks/data-table"
```

**Step 4: Verify TypeScript compilation**

```bash
cd packages/ui && pnpm tsc --noEmit 2>&1 | head -50
```

Expected: no errors. All previous exports still available via patterns barrel.

**Step 5: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "refactor(ui): update main barrel — replace layout/features with patterns"
```

---

## Task 9: Remove empty `layout/` directory

**Files:**
- Delete: `packages/ui/src/components/layout/` (should be empty after Task 2)

**Step 1: Check the folder is empty**

```bash
ls packages/ui/src/components/layout/
# Expected: empty or only .gitkeep
```

**Step 2: Remove**

```bash
rmdir packages/ui/src/components/layout/
git add packages/ui/src/components/layout/
```

**Step 3: Commit**

```bash
git commit -m "chore(ui): remove empty layout/ folder"
```

---

## Task 10: Update imports in `apps/examples/` (13 files)

Every file that imports from `@blazz/ui/components/layout/` or `@blazz/ui/components/features/` must be updated.

**Files to update:**
- `apps/examples/app/(examples)/layout.tsx`
- `apps/examples/app/(examples)/examples/crm/companies/page.tsx`
- `apps/examples/app/(examples)/examples/crm/contacts/page.tsx`
- `apps/examples/app/(examples)/examples/crm/deals/page.tsx`
- `apps/examples/app/(examples)/examples/crm/inventory/page.tsx`
- `apps/examples/app/(examples)/examples/crm/products/page.tsx`
- `apps/examples/app/(examples)/examples/crm/quotes/page.tsx`
- `apps/examples/app/(stockbase)/examples/stockbase/layout.tsx`
- `apps/examples/app/(stockbase)/examples/stockbase/inventory/page.tsx`
- `apps/examples/app/(stockbase)/examples/stockbase/movements/page.tsx`
- `apps/examples/app/(talentflow)/examples/talentflow/layout.tsx`
- `apps/examples/app/(talentflow)/examples/talentflow/candidates/page.tsx`
- `apps/examples/app/(talentflow)/examples/talentflow/jobs/page.tsx`

**Step 1: Find all remaining layout/features imports**

```bash
grep -r "@blazz/ui/components/layout\|@blazz/ui/components/features" apps/examples/ --include="*.tsx" --include="*.ts" -l
```

**Step 2: Bulk replace layout paths**

```bash
find apps/examples -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/layout/|@blazz/ui/components/patterns/|g'
```

**Step 3: Bulk replace features paths**

```bash
find apps/examples -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/command-palette/|@blazz/ui/components/patterns/command-palette/|g' && \
find apps/examples -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/image-upload/|@blazz/ui/components/patterns/image-upload/|g' && \
find apps/examples -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/navigation-tabs|@blazz/ui/components/patterns/navigation-tabs|g' && \
find apps/examples -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/data-table|@blazz/ui/components/blocks/data-table|g'
```

**Step 4: Verify no old paths remain**

```bash
grep -r "@blazz/ui/components/layout\|@blazz/ui/components/features" apps/examples/ --include="*.tsx" --include="*.ts"
# Expected: no output
```

**Step 5: Verify TypeScript in examples app**

```bash
cd apps/examples && pnpm tsc --noEmit 2>&1 | head -50
```

**Step 6: Commit**

```bash
git add apps/examples/
git commit -m "refactor(examples): update imports layout/ → patterns/, features/ → patterns/ or blocks/"
```

---

## Task 11: Update imports in `apps/docs/` component pages

Doc pages that import layout/features components directly must be updated.

**Step 1: Find all layout/features imports in docs**

```bash
grep -r "@blazz/ui/components/layout\|@blazz/ui/components/features" apps/docs/src/ --include="*.tsx" --include="*.ts" -l
```

**Step 2: Apply same bulk replacements as Task 10**

```bash
find apps/docs/src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/layout/|@blazz/ui/components/patterns/|g'

find apps/docs/src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/command-palette/|@blazz/ui/components/patterns/command-palette/|g'

find apps/docs/src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/navigation-tabs|@blazz/ui/components/patterns/navigation-tabs|g'

find apps/docs/src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@blazz/ui/components/features/data-table|@blazz/ui/components/blocks/data-table|g'
```

**Step 3: Verify no old paths remain**

```bash
grep -r "@blazz/ui/components/layout\|@blazz/ui/components/features" apps/docs/src/ --include="*.tsx" --include="*.ts"
# Expected: no output
```

**Step 4: Commit**

```bash
git add apps/docs/src/
git commit -m "refactor(docs): update component imports layout/ → patterns/, features/ → blocks/"
```

---

## Task 12: Update `navigation.ts` — restructure to 4 top-level sections

**Files:**
- Modify: `apps/docs/src/config/navigation.ts`

**Step 1: Read the current file**

```bash
cat apps/docs/src/config/navigation.ts
```

**Step 2: Restructure**

The top-level sections change from `["components", "ai"]` to `["ui", "patterns", "blocks", "ai"]`.

- `"components"` section → split into `"ui"` (same subcategories) + `"patterns"` (new) + `"blocks"` (new)
- `"ai"` section → unchanged

New `"patterns"` section items:
```typescript
{
  id: "patterns",
  title: "Patterns",
  items: [
    {
      title: "App Shell",
      items: [
        { title: "App Frame", href: "/docs/components/patterns/app-frame" },
        { title: "Dashboard Layout", href: "/docs/components/patterns/dashboard-layout" },
        { title: "App Sidebar", href: "/docs/components/patterns/app-sidebar" },
        { title: "App Top Bar", href: "/docs/components/patterns/app-top-bar" },
        { title: "Top Bar", href: "/docs/components/patterns/top-bar" },
        { title: "Layout Frame", href: "/docs/components/patterns/layout-frame" },
      ]
    },
    {
      title: "Navigation",
      items: [
        { title: "Navbar", href: "/docs/components/patterns/navbar" },
        { title: "Nav Tabs", href: "/docs/components/patterns/nav-tabs" },
        { title: "Tab Bar", href: "/docs/components/patterns/tab-bar" },
        { title: "Navigation Tabs", href: "/docs/components/patterns/navigation-tabs" },
      ]
    },
    {
      title: "Forms",
      items: [
        { title: "Form Field", href: "/docs/components/patterns/form-field" },
        { title: "Form Section", href: "/docs/components/patterns/form-section" },
        { title: "Field Grid", href: "/docs/components/patterns/field-grid" },
      ]
    },
    {
      title: "Media",
      items: [
        { title: "Image Upload", href: "/docs/components/patterns/image-upload" },
      ]
    },
    {
      title: "Utilities",
      items: [
        { title: "Command Palette", href: "/docs/components/patterns/command-palette" },
        { title: "Error State", href: "/docs/components/patterns/error-state" },
        { title: "Theme Toggle", href: "/docs/components/patterns/theme-toggle" },
        { title: "Page Header", href: "/docs/components/patterns/page-header" },
      ]
    },
  ]
}
```

New `"blocks"` section items (migrated from old "Charts" + business blocks that were scattered):
```typescript
{
  id: "blocks",
  title: "Blocks",
  items: [
    {
      title: "Charts",
      items: [
        { title: "Chart Card", href: "/docs/components/blocks/chart-card" },
        { title: "Area Chart", href: "/docs/components/blocks/area-chart" },
        { title: "Bar Chart", href: "/docs/components/blocks/bar-chart" },
        { title: "Line Chart", href: "/docs/components/blocks/line-chart" },
        { title: "Pie Chart", href: "/docs/components/blocks/pie-chart" },
        { title: "Radar Chart", href: "/docs/components/blocks/radar-chart" },
        { title: "Funnel Chart", href: "/docs/components/blocks/funnel-chart" },
        { title: "Forecast Chart", href: "/docs/components/blocks/forecast-chart" },
      ]
    },
    {
      title: "Data",
      items: [
        { title: "Data Table", href: "/docs/components/blocks/data-table" },
        { title: "Data Grid", href: "/docs/components/blocks/data-grid" },
        { title: "Filter Bar", href: "/docs/components/blocks/filter-bar" },
        { title: "Bulk Action Bar", href: "/docs/components/blocks/bulk-action-bar" },
      ]
    },
    {
      title: "Business",
      items: [
        { title: "Activity Timeline", href: "/docs/components/blocks/activity-timeline" },
        { title: "Detail Panel", href: "/docs/components/blocks/detail-panel" },
        { title: "Deal Lines Editor", href: "/docs/components/blocks/deal-lines-editor" },
        { title: "Inline Edit", href: "/docs/components/blocks/inline-edit" },
        { title: "Kanban Board", href: "/docs/components/blocks/kanban-board" },
        { title: "Multi Step Form", href: "/docs/components/blocks/multi-step-form" },
        { title: "Notification Center", href: "/docs/components/blocks/notification-center" },
        { title: "Org Menu", href: "/docs/components/blocks/org-menu" },
        { title: "Property Card", href: "/docs/components/blocks/property-card" },
        { title: "Quick Log Activity", href: "/docs/components/blocks/quick-log-activity" },
        { title: "Quote Preview", href: "/docs/components/blocks/quote-preview" },
        { title: "Split View", href: "/docs/components/blocks/split-view" },
        { title: "Stats Grid", href: "/docs/components/blocks/stats-grid" },
        { title: "Stats Strip", href: "/docs/components/blocks/stats-strip" },
        { title: "Status Flow", href: "/docs/components/blocks/status-flow" },
      ]
    },
  ]
}
```

**Step 3: Commit**

```bash
git add apps/docs/src/config/navigation.ts
git commit -m "refactor(docs): restructure navigation to ui/patterns/blocks/ai"
```

---

## Task 13: Update `components-navigation.ts`

This file derives from `navigation.ts`. Update the section IDs and descriptions to match the new structure.

**Files:**
- Modify: `apps/docs/src/config/components-navigation.ts`

**Step 1: Read the current file**

```bash
cat apps/docs/src/config/components-navigation.ts
```

**Step 2: Update section IDs and descriptions**

Add new sections for `"patterns"` and `"blocks"` with appropriate descriptions and icons. Update the filter to include `["ui", "patterns", "blocks", "ai"]` instead of `["components", "ai"]`.

Example additions:
```typescript
{
  id: "comp-patterns",
  title: "Patterns",
  description: "Generic reusable compositions for app shells, navigation, forms, and utilities.",
  icon: Layers,
  items: [/* derived from navigation.ts */]
},
{
  id: "comp-blocks",
  title: "Blocks",
  description: "Business-specific components for charts, data tables, and domain workflows.",
  icon: LayoutGrid,
  items: [/* derived from navigation.ts */]
},
```

**Step 3: Commit**

```bash
git add apps/docs/src/config/components-navigation.ts
git commit -m "refactor(docs): update components-navigation to reflect ui/patterns/blocks/ai structure"
```

---

## Task 14: Create/move docs route files for `patterns/` and `blocks/`

The docs use TanStack Start file-based routing. Each nav entry needs a corresponding route file.

**Files:**
- Create dir: `apps/docs/src/routes/_docs/docs/components/patterns/`
- Create dir: `apps/docs/src/routes/_docs/docs/components/blocks/`
- Move misplaced files (e.g., `components/ui/stats-strip.tsx` → `components/blocks/stats-strip.tsx`)

**Step 1: Audit which route files exist vs what nav expects**

```bash
ls apps/docs/src/routes/_docs/docs/components/
# Check: ui/, blocks/, patterns/, charts/, layout/ folders and their contents
```

```bash
# Find misplaced block docs currently under ui/
ls apps/docs/src/routes/_docs/docs/components/ui/ | grep -E "stats-strip|data-grid|kanban|activity"
```

**Step 2: Create patterns/ and blocks/ route directories**

```bash
mkdir -p apps/docs/src/routes/_docs/docs/components/patterns
mkdir -p apps/docs/src/routes/_docs/docs/components/blocks
```

**Step 3: Move misplaced block docs out of ui/**

For each block doc found in `ui/` (e.g., `stats-strip.tsx`):
```bash
git mv apps/docs/src/routes/_docs/docs/components/ui/stats-strip.tsx \
       apps/docs/src/routes/_docs/docs/components/blocks/stats-strip.tsx
```

**Step 4: Move chart docs from `charts/` into `blocks/charts/`**

If a `charts/` folder exists at root of components:
```bash
git mv apps/docs/src/routes/_docs/docs/components/charts \
       apps/docs/src/routes/_docs/docs/components/blocks/charts
```

**Step 5: Create stub route files for undocumented patterns**

For each item in the `patterns` nav section that has no route file yet, create a minimal stub:

```tsx
// apps/docs/src/routes/_docs/docs/components/patterns/app-frame.tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_docs/docs/components/patterns/app-frame")({
  component: AppFrameDoc,
})

function AppFrameDoc() {
  return <div>App Frame — documentation coming soon.</div>
}
```

Create one stub per missing patterns page. Check which stubs are needed:
```bash
# For each href in navigation.ts patterns section, check if the route file exists
ls apps/docs/src/routes/_docs/docs/components/patterns/
```

**Step 6: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/components/
git commit -m "refactor(docs): create patterns/ and blocks/ route folders, move misplaced docs"
```

---

## Task 15: Full build verification

Run a complete build to confirm no broken imports or TypeScript errors.

**Step 1: Run full build**

```bash
pnpm build 2>&1 | tail -50
```

Expected: all packages build without errors.

**Step 2: If TypeScript errors appear**

Read the error, find the file with the broken import, and fix the path. Common patterns:
- `Cannot find module '@blazz/ui/components/layout/...'` → update to `patterns/`
- `Cannot find module '@blazz/ui/components/features/...'` → update to `patterns/` or `blocks/data-table`

Re-run `pnpm build` after each fix.

**Step 3: Run the docs dev server and verify navigation**

```bash
pnpm dev:docs
```

Open http://localhost:3100 and verify:
- Sidebar shows UI / Patterns / Blocks / AI sections
- No broken links in nav
- A few component pages load correctly

**Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix(ui): resolve remaining import paths after reorganization"
```

---

## Task 16: Update MEMORY.md

Update persistent memory with the new folder structure so future sessions don't reference old paths.

**Files:**
- Modify: `~/.claude/projects/-Users-jonathanruas-Development-blazz-ui-app/memory/MEMORY.md`

**Step 1: Update the Architecture section**

Replace references to `layout/` and `features/` with the new taxonomy:
- `packages/ui/src/components/ui/` — 72 primitives
- `packages/ui/src/components/patterns/` — generic compositions (app shell, navigation, forms, media, utilities)
- `packages/ui/src/components/blocks/` — business components + data-table
- `packages/ui/src/components/ai/` — AI/generative

**Step 2: Commit**

```bash
git add -A
git commit -m "docs: update MEMORY with new component taxonomy"
```
