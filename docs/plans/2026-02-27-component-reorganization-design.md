# Component Reorganization Design
**Date:** 2026-02-27
**Status:** Approved

## Objective

Impose a strict 4-layer taxonomy across `packages/ui/src/components/` and the docs navigation, ensuring the folder structure is the single source of truth for both the public API and the documentation.

## Taxonomy Contract

| Layer | Contract | Exclusion criterion |
|-------|----------|---------------------|
| `ui/` | Primitives with no business context, internal state only | Knows a business domain (CRM, finance…) |
| `patterns/` | Generic reusable compositions in any app | Specific to a vertical or workflow |
| `blocks/` | Components with explicit business context | Generic without domain |
| `ai/` | Generative/chat components — isolated namespace | — |

## What Moves

### `layout/` → dissolved into `patterns/`

```
app-frame, layout-frame, dashboard-layout, frame-context → patterns/
app-sidebar, app-top-bar, top-bar, sidebar-* → patterns/
navbar, nav-tabs, tab-bar → patterns/
mobile-sidebar-sheet, notification-sheet → patterns/
theme-toggle, theme-palette-switcher, user-menu → patterns/
```

**Conflict to resolve:** `layout/page-header` + `blocks/page-header` → merge into `patterns/page-header` (generic), remove or rename the one in `blocks/`.

### `features/` → dissolved

```
command-palette → patterns/
image-upload, image-preview → patterns/
navigation-tabs (full system) → patterns/
data-table (full system) → blocks/   ← business-heavy
```

### `blocks/` → loses generic items to `patterns/`

```
form-field, form-section, field-grid, error-state → patterns/
```

All other blocks stay in `blocks/`.

### `ui/` — unchanged (72 primitives)

### `ai/` — unchanged

## Target Import Paths

```ts
// Before
import { AppFrame } from "@blazz/ui/components/layout/app-frame"
import { DataTable } from "@blazz/ui/components/features/data-table"
import { CommandPalette } from "@blazz/ui/components/features/command-palette"

// After
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import { CommandPalette } from "@blazz/ui/components/patterns/command-palette"
```

Naming conflicts in the barrel (`DataGrid`, `Timeline`, etc.) are resolved — `blocks/data-grid` and `ai/data-grid` live in distinct namespaces without ambiguity.

## Target Docs Navigation

```
UI
  ├── Layout (bleed, box, grid, inline-stack…)
  ├── Actions (button, dropdown-menu…)
  ├── Inputs (input, select, combobox…)
  ├── Feedback (alert, badge, skeleton…)
  ├── Overlays (dialog, sheet, popover…)
  ├── Navigation (breadcrumb, tabs, pagination…)
  ├── Display (card, table, avatar…)
  └── Foundations

Patterns
  ├── App Shell (frame, sidebar, top-bar, dashboard-layout)
  ├── Navigation (navbar, nav-tabs, navigation-tabs)
  ├── Forms (form-field, form-section, field-grid)
  ├── Media (image-upload, image-preview)
  └── Utilities (command-palette, error-state, theme-toggle)

Blocks
  ├── Charts (chart-card, area/bar/line/pie/radar/funnel/forecast)
  ├── Data (data-table, data-grid, filter-bar, bulk-action-bar)
  └── Business (kanban, activity-timeline, stats-*, detail-panel, inline-edit…)

AI
  └── (unchanged — 8 categories)
```

`components-navigation.ts` remains a direct derivation of `navigation.ts` — same mechanism, new categories.

## Barrel Export Changes

- Remove `layout/` and `features/` sections from `index.ts`
- Add `patterns/` section
- `data-table` moves to `blocks/` section — naming conflicts eliminated
- AI barrel comment updated (conflicts no longer apply to data-grid/timeline)

## Out of Scope

- No changes to `ai/` structure
- No changes to `ui/` component implementations
- No changes to `apps/examples/` (imports will be updated but no logic changes)
