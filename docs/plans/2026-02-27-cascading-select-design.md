# Cascading Select — Design Doc

**Date:** 2026-02-27
**Status:** Approved

## Overview

Drill-down select component for hierarchical data (product categories, geographies, org charts). User navigates level by level via a popover panel with breadcrumb header and chevron arrows.

## Files

```
packages/ui/src/components/ui/cascading-select.tsx     ← UI primitive
packages/ui/src/components/blocks/category-select.tsx  ← Form block
apps/docs/src/routes/_docs/docs/components/ui/cascading-select.tsx  ← Doc page
```

## Data Structure

```ts
interface CascadingSelectNode {
  id: string
  label: string
  children?: CascadingSelectNode[]
}
```

Recursive tree, unlimited depth. No flat/parentId format needed.

## API

### Primitive: `<CascadingSelect>`

```tsx
interface CascadingSelectProps {
  nodes: CascadingSelectNode[]       // root-level nodes
  value?: string                      // selected node id
  onValueChange?: (id: string) => void
  placeholder?: string
  className?: string
}
```

### Block: `<CategorySelect>`

```tsx
interface CategorySelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  label: string
  control: Control<TFieldValues>
  nodes: CascadingSelectNode[]
  placeholder?: string
  description?: string
  required?: boolean
}
```

## Internal State (primitive)

```ts
path: CascadingSelectNode[]   // navigation stack [root → ... → current level]
open: boolean                  // popover open/closed
```

- `path = []` → showing root-level nodes
- `path[path.length - 1].children` → current level's items
- Drill down: push node to `path`
- Breadcrumb click: slice `path` to that index

## UX Behavior

### Trigger (closed)
- Style: matches `Combobox` (border-field, bg-surface, h-8, rounded-lg, full width)
- Selected: displays full path `Boissons > Alcools > Apéritifs` (resolved from `value` by walking tree)
- Empty: shows `placeholder`
- Right icon: `ChevronDown`

### Panel (open)
**Header breadcrumb** (visible when `path.length > 0`):
- Format: `Pôles > **Boissons**` — current level bold, parent levels clickable to navigate up
- Separator: `>` or `ChevronRight` icon

**Item list** (children of current path node, or root if `path = []`):
- Each row: `[label]` + `[ChevronRight]` only if node has children
- **Click label** → `onValueChange(node.id)`, close popover
- **Click `>`** → push node to `path`, stay open, show children
- Selected node: check icon or accent background

### Closing
- Click outside popover
- Escape key

## Path Resolution

```ts
function findPath(nodes: CascadingSelectNode[], id: string): CascadingSelectNode[] | null
```

Walks the tree to build the path array for a given `id`. Used to render the trigger label.

## Exports

```ts
// packages/ui/src/index.ts
export { CascadingSelect } from './components/ui/cascading-select'
export type { CascadingSelectNode, CascadingSelectProps } from './components/ui/cascading-select'
export { CategorySelect } from './components/blocks/category-select'
export type { CategorySelectProps } from './components/blocks/category-select'
```

## Doc Page

- Route: `/docs/components/ui/cascading-select`
- Examples: product categories, geographical zones (country > region > city)
- Added to `config/components-navigation.ts` under "Form" section
