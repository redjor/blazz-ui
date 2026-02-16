# DataTable Evolution — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the DataTable into a polyvalent table framework with 16 new cell types, grouping, row expand, column pinning, and advanced inline editing — all behind an ergonomic `col.*` namespace delivering <50 lines DX.

**Architecture:** Hybrid approach — declarative `col.*` builders as default, `cell` override escape hatch on every builder. Extends the existing factory pattern (`createBaseColumn` → `createXxxColumn`) without breaking changes. New features are opt-in via `enableXxx` props.

**Tech Stack:** TanStack Table (grouping/expand/pinning APIs), React 19, Tailwind v4, CSS sticky positioning, oklch design tokens.

**Design Doc:** `docs/plans/2026-02-16-datatable-evolution-design.md`

---

## Phase 1: Foundation — `col` Namespace & Types

### Task 1.1: Create the `col` namespace

**Files:**
- Create: `components/features/data-table/factories/col.ts`
- Modify: `components/features/data-table/factories/index.ts`
- Modify: `components/features/data-table/index.ts`

**Step 1: Create `col.ts`**

This is a thin facade that re-exports existing factories under short names. Start with only the existing 7 column builders + selection + actions.

```typescript
// components/features/data-table/factories/col.ts
import type { DataTableColumnDef } from '../data-table.types';
import {
  createTextColumn, type TextColumnConfig,
  createStatusColumn, type StatusColumnConfig,
  createNumericColumn, type NumericColumnConfig,
  createCurrencyColumn, type CurrencyColumnConfig,
  createDateColumn, type DateColumnConfig,
  createSelectColumn, type SelectColumnConfig,
  createImageTextColumn, type ImageTextColumnConfig,
} from './column-builders';
import {
  createEditableTextColumn, type EditableTextColumnConfig,
  createEditableNumberColumn, type EditableNumberColumnConfig,
  createEditableCurrencyColumn, type EditableCurrencyColumnConfig,
  createEditableSelectColumn, type EditableSelectColumnConfig,
  createEditableDateColumn, type EditableDateColumnConfig,
} from './editable-column-builders';
import { DataTableRowSelection } from '../data-table-row-selection';
import { DataTableColumnHeader } from '../data-table-column-header';

/**
 * Shorthand column builder namespace.
 * Each method wraps an existing factory, accepting `accessorKey` as first arg.
 *
 * @example
 * ```tsx
 * const columns = [
 *   col.selection(),
 *   col.text("name", { title: "Name" }),
 *   col.status("stage", { title: "Stage", statusMap: { ... } }),
 *   col.currency("amount", { title: "Amount" }),
 * ]
 * ```
 */
export const col = {
  // Selection checkbox column
  selection: (): DataTableColumnDef<any> => ({
    id: 'select',
    header: ({ table }) => <DataTableRowSelection table={table} type="header" />,
    cell: ({ row }) => <DataTableRowSelection row={row} type="cell" />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }),

  // Existing builders (shorthand)
  text: <TData,>(key: string, opts?: Omit<TextColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createTextColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  status: <TData,>(key: string, opts: Omit<StatusColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createStatusColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  numeric: <TData,>(key: string, opts?: Omit<NumericColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createNumericColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  currency: <TData,>(key: string, opts?: Omit<CurrencyColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createCurrencyColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  date: <TData,>(key: string, opts?: Omit<DateColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createDateColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  select: <TData,>(key: string, opts: Omit<SelectColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createSelectColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  imageText: <TData,>(key: string, opts: Omit<ImageTextColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createImageTextColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  // Editable builders (shorthand)
  editableText: <TData,>(key: string, opts: Omit<EditableTextColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createEditableTextColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  editableNumber: <TData,>(key: string, opts: Omit<EditableNumberColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createEditableNumberColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  editableCurrency: <TData,>(key: string, opts: Omit<EditableCurrencyColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createEditableCurrencyColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  editableSelect: <TData,>(key: string, opts: Omit<EditableSelectColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createEditableSelectColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),

  editableDate: <TData,>(key: string, opts: Omit<EditableDateColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
    createEditableDateColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),
} as const;

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.replace(/([A-Z])/g, ' $1').slice(1);
}
```

**Step 2: Export from factories/index.ts**

Add to `components/features/data-table/factories/index.ts`:
```typescript
export { col } from './col';
```

**Step 3: Export from main index.ts**

The `col` namespace is already exported via `export * from './factories'` but verify it works.

**Step 4: Verify build**

Run: `npx next build` (or `pnpm build`)
Expected: No errors.

**Step 5: Commit**

```bash
git add components/features/data-table/factories/col.ts components/features/data-table/factories/index.ts
git commit -m "feat(datatable): add col namespace as shorthand for column builders"
```

---

### Task 1.2: Create `definePreset` utility

**Files:**
- Create: `components/features/data-table/factories/preset-builder.ts`
- Modify: `components/features/data-table/factories/index.ts`

**Step 1: Create `preset-builder.ts`**

```typescript
// components/features/data-table/factories/preset-builder.ts
import type { DataTableProps } from '../data-table.types';

/**
 * Defines a reusable DataTable preset configuration.
 * The returned object can be spread into <DataTable {...preset} />.
 *
 * @example
 * ```tsx
 * const dealsPreset = definePreset<Deal>({
 *   columns: [col.text("name"), col.currency("amount")],
 *   enableRowSelection: true,
 *   views: [views.system("All", {})],
 * });
 *
 * <DataTable {...dealsPreset} data={deals} />
 * ```
 */
export function definePreset<TData, TValue = unknown>(
  config: Omit<DataTableProps<TData, TValue>, 'data'>
): Omit<DataTableProps<TData, TValue>, 'data'> {
  return config;
}
```

**Step 2: Export from factories/index.ts**

```typescript
export { definePreset } from './preset-builder';
```

**Step 3: Commit**

```bash
git add components/features/data-table/factories/preset-builder.ts components/features/data-table/factories/index.ts
git commit -m "feat(datatable): add definePreset utility for typed preset configs"
```

---

### Task 1.3: Extend `DataTableView` type for grouping

**Files:**
- Modify: `components/features/data-table/data-table-view.types.ts`

**Step 1: Add grouping fields to DataTableView**

Add after `pinnedColumns` (line ~76):

```typescript
  /** Grouping columns (optional) */
  grouping?: string[];

  /** Expanded group IDs by default (optional) */
  expandedGroups?: string[];

  /** Aggregation config per column (optional) */
  aggregations?: Record<string, AggregationType>;
```

And add the `AggregationType` at the top of the file:

```typescript
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'range' | ((values: unknown[]) => React.ReactNode);
```

**Step 2: Commit**

```bash
git add components/features/data-table/data-table-view.types.ts
git commit -m "feat(datatable): extend DataTableView type with grouping fields"
```

---

## Phase 2: Tier 1 Cell Types (7 builders)

Each builder follows the same pattern: Config interface → internal cell component → factory function → register in `col` namespace. I'll show the full pattern for `tags`, then the remaining 6 follow the same structure.

### Task 2.1: Create `createTagsColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-tags.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

**Step 1: Create cell component**

Create directory `components/features/data-table/cells/` for all new cell renderers.

```tsx
// components/features/data-table/cells/cell-tags.tsx
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface CellTagsProps {
  items: string[];
  colorMap?: Record<string, string>;   // tag value → tailwind class or badge variant
  max?: number;                         // max visible before +N overflow
  variant?: 'badge' | 'dot';           // display style
  className?: string;
}

export function CellTags({ items, colorMap, max = 3, variant = 'badge', className }: CellTagsProps) {
  if (!items || items.length === 0) return <span className="text-fg-muted">—</span>;

  const visible = items.slice(0, max);
  const overflow = items.length - max;

  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {visible.map((tag) => {
        const tagClass = colorMap?.[tag];
        if (variant === 'dot') {
          return (
            <span key={tag} className="flex items-center gap-1 text-body-sm">
              <span className={cn('h-2 w-2 rounded-full bg-fg-muted', tagClass)} />
              {tag}
            </span>
          );
        }
        return (
          <Badge key={tag} variant="secondary" className={cn('text-xs', tagClass)}>
            {tag}
          </Badge>
        );
      })}
      {overflow > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="text-body-sm text-fg-muted hover:text-fg">
              +{overflow}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-wrap gap-1">
              {items.slice(max).map((tag) => {
                const tagClass = colorMap?.[tag];
                return (
                  <Badge key={tag} variant="secondary" className={cn('text-xs', tagClass)}>
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
```

**Step 2: Add factory in column-builders.tsx**

Add at the end of `column-builders.tsx`:

```typescript
import { CellTags, type CellTagsProps } from '../cells/cell-tags';

export interface TagsColumnConfig<_TData> {
  accessorKey: string;
  title: string;
  colorMap?: Record<string, string>;
  max?: number;
  variant?: 'badge' | 'dot';
  enableSorting?: boolean;
  showInlineFilter?: boolean;
  defaultInlineFilter?: boolean;
  filterLabel?: string;
  filterOptions?: Array<{ label: string; value: string }>;
  size?: number;
  cellRenderer?: (items: string[], row: _TData) => React.ReactNode;
}

export function createTagsColumn<TData>(config: TagsColumnConfig<TData>): DataTableColumnDef<TData> {
  const {
    accessorKey, title, colorMap, max = 3, variant = 'badge',
    enableSorting = false, showInlineFilter = false, defaultInlineFilter = false,
    filterLabel, filterOptions, size, cellRenderer,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    size,
    cell: ({ row }) => {
      const items = row.getValue(accessorKey) as string[];
      if (cellRenderer) return cellRenderer(items, row.original);
      return <CellTags items={items} colorMap={colorMap} max={max} variant={variant} />;
    },
    ...(filterOptions && {
      filterConfig: {
        type: 'select' as const,
        options: filterOptions,
        showInlineFilter,
        defaultInlineFilter,
        filterLabel: filterLabel || title,
      },
    }),
  });
}
```

**Step 3: Register in col namespace**

Add to `col.ts`:
```typescript
tags: <TData,>(key: string, opts?: Omit<TagsColumnConfig<TData>, 'accessorKey'> & { title?: string }) =>
  createTagsColumn<TData>({ accessorKey: key, title: opts?.title ?? capitalize(key), ...opts }),
```

**Step 4: Verify build**

**Step 5: Commit**

```bash
git commit -m "feat(datatable): add tags cell type with badge/dot variants and overflow popover"
```

---

### Task 2.2: Create `createValidationColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-validation.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Cell component renders an icon (CheckCircle2/AlertTriangle/XCircle/Info) with color and tooltip. Config accepts `rules: Array<(row: TData) => ValidationResult | null>` where `ValidationResult = { level: 'success' | 'warning' | 'error' | 'info', message: string }`.

The cell evaluates rules in order, displays the first matching result's icon. Tooltip shows the message on hover.

```tsx
// Key elements of cell-validation.tsx
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

const iconMap = {
  success: { icon: CheckCircle2, className: 'text-green-500' },
  warning: { icon: AlertTriangle, className: 'text-amber-500' },
  error:   { icon: XCircle, className: 'text-red-500' },
  info:    { icon: Info, className: 'text-blue-500' },
};
```

Register in `col.ts` as `col.validation(key, opts)`.

**Commit:** `feat(datatable): add validation cell type with status icons and tooltips`

---

### Task 2.3: Create `createProgressColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-progress.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Cell component renders a mini progress bar (height 6px, rounded, bg-raised track, bg-brand fill) with optional percentage label. Value is 0-100 number.

Options: `showLabel: boolean`, `colorThresholds?: { warn: number, danger: number }` to change bar color at thresholds.

Filter config: `type: 'number'` with `min: 0, max: 100`.

Register in `col.ts` as `col.progress(key, opts)`.

**Commit:** `feat(datatable): add progress cell type with mini bar and threshold colors`

---

### Task 2.4: Create `createRatingColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-rating.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Cell component renders filled/empty stars (or dots). Config: `max: number` (default 5), `variant: 'star' | 'dot'`.

Uses `Star` from lucide-react (filled = `fill-current text-amber-400`, empty = `text-fg-muted/30`).

Register in `col.ts` as `col.rating(key, opts)`.

**Commit:** `feat(datatable): add rating cell type with star/dot variants`

---

### Task 2.5: Create `createLinkColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-link.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Cell component renders a truncated link with optional ExternalLink icon. Config: `type: 'url' | 'email' | 'tel'`, `maxWidth?: number`, `showIcon?: boolean`.

For email: `mailto:` prefix. For tel: `tel:` prefix. For url: opens in new tab.

Register in `col.ts` as `col.link(key, opts)`.

**Commit:** `feat(datatable): add link cell type with url/email/tel variants`

---

### Task 2.6: Create `createBooleanColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-boolean.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Cell component renders a checkbox (disabled, display only), a badge (Yes/No), or a toggle icon. Config: `variant: 'checkbox' | 'badge' | 'icon'`, `labels?: { true: string, false: string }`.

Filter config: `type: 'boolean'`.

Register in `col.ts` as `col.boolean(key, opts)`.

**Commit:** `feat(datatable): add boolean cell type with checkbox/badge/icon variants`

---

### Task 2.7: Create `createAvatarGroupColumn` builder

**Files:**
- Create: `components/features/data-table/cells/cell-avatar-group.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Cell component renders overlapping circular avatars using `Avatar`/`AvatarFallback` from `components/ui/avatar`. Config: `max: number` (default 4), `size: 'sm' | 'md'`.

Data shape: `Array<{ name: string, avatar?: string }>`. Overflow shows `+N` circle. Tooltip on hover shows full names.

Register in `col.ts` as `col.avatarGroup(key, opts)`.

**Commit:** `feat(datatable): add avatarGroup cell type with overlapping stack`

---

### Phase 2 Batch Commit

After all 7 Tier 1 types are created, run build verification:

```bash
pnpm build
```

---

## Phase 3: Tier 2 Cell Types (6 builders)

### Task 3.1: Create `createRelativeDateColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-relative-date.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Uses `Intl.RelativeTimeFormat` for "3h ago", "In 2 days". Tooltip shows exact date via `Tooltip` component. Filter config: `type: 'date'`.

Register as `col.relativeDate(key, opts)`.

**Commit:** `feat(datatable): add relativeDate cell type with tooltip exact date`

---

### Task 3.2: Create `createUserColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-user.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Renders Avatar + name + optional subtitle (email, role). Config: `accessor: (row: TData) => { name: string, avatar?: string, subtitle?: string }` or `nameKey + avatarKey + subtitleKey` string accessors.

Register as `col.user(key, opts)`.

**Commit:** `feat(datatable): add user cell type with avatar and subtitle`

---

### Task 3.3: Create `createDurationColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-duration.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Input: number (minutes or seconds, configurable). Output: smart format "2h 30m", "3 days", "45s". Config: `unit: 'seconds' | 'minutes' | 'hours'`.

Register as `col.duration(key, opts)`.

**Commit:** `feat(datatable): add duration cell type with smart format`

---

### Task 3.4: Create `createColorDotColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-color-dot.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Simple: colored dot + label text. Config: `colorMap: Record<string, string>` mapping values to Tailwind classes or hex colors.

Register as `col.colorDot(key, opts)`.

**Commit:** `feat(datatable): add colorDot cell type`

---

### Task 3.5: Create `createImageColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-image.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Renders thumbnail with `next/image` (40x40 rounded). Config: `size?: number`, `rounded?: 'sm' | 'md' | 'full'`. Click opens a larger preview via Dialog/Popover.

Register as `col.image(key, opts)`.

**Commit:** `feat(datatable): add image cell type with thumbnail and preview`

---

### Task 3.6: Create `createSparklineColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-sparkline.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Renders a mini SVG line chart or bar chart (no external lib — pure SVG, ~30 lines). Config: `type: 'line' | 'bar'`, `color?: string`, `height?: number` (default 24), `width?: number` (default 80).

Data: `number[]` array of values. SVG viewBox auto-scales to min/max.

Register as `col.sparkline(key, opts)`.

**Commit:** `feat(datatable): add sparkline cell type with SVG line/bar variants`

---

## Phase 4: Tier 3 Cell Types (2 builders)

### Task 4.1: Create `createTwoLinesColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-two-lines.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Renders main line + sub-line. Config: `mainKey: string`, `subKey: string` or `accessor: (row) => { main: string, sub: string }`.

```tsx
<div className="flex flex-col">
  <span className="text-body-md text-fg">{main}</span>
  <span className="text-body-sm text-fg-muted">{sub}</span>
</div>
```

Register as `col.twoLines(key, opts)`.

**Commit:** `feat(datatable): add twoLines cell type`

---

### Task 4.2: Create `createKeyValueColumn`

**Files:**
- Create: `components/features/data-table/cells/cell-key-value.tsx`
- Modify: `components/features/data-table/factories/column-builders.tsx`
- Modify: `components/features/data-table/factories/col.ts`

Renders `Label: Value` inline. Config: `labelKey`, `valueKey` or `accessor`.

Register as `col.keyValue(key, opts)`.

**Step: Commit all Tier 3**

```bash
git commit -m "feat(datatable): add twoLines and keyValue cell types"
```

---

### Task 4.3: Create cells barrel export

**Files:**
- Create: `components/features/data-table/cells/index.ts`

Export all cell components for standalone use (composable approach):

```typescript
export { CellTags } from './cell-tags';
export { CellValidation } from './cell-validation';
export { CellProgress } from './cell-progress';
// ... all cell components
```

Add to main `index.ts`: `export * from './cells';`

**Commit:** `feat(datatable): add cells barrel export for composable usage`

---

## Phase 5: Column Pinning

### Task 5.1: Add column pinning state to DataTable

**Files:**
- Modify: `components/features/data-table/data-table.types.ts` (add props)
- Modify: `components/features/data-table/data-table.tsx` (wire TanStack pinning)

**Step 1: Add props to DataTableProps**

```typescript
// In DataTableProps interface
enableColumnPinning?: boolean;
defaultColumnPinning?: { left?: string[]; right?: string[] };
onColumnPinningChange?: (pinning: { left: string[]; right: string[] }) => void;
```

**Step 2: Wire TanStack Table pinning**

In `data-table.tsx`, add:
- Import `type ColumnPinningState` from `@tanstack/react-table`
- Add `columnPinning` state initialized from `defaultColumnPinning`
- Pass `enableColumnPinning`, `state.columnPinning`, `onColumnPinningChange` to `useReactTable`

**Step 3: Commit**

```bash
git commit -m "feat(datatable): wire TanStack Table column pinning state"
```

---

### Task 5.2: Add pinning CSS to table cells

**Files:**
- Modify: `components/features/data-table/data-table.tsx`

**Step 1: Add pinning styles to header and body cells**

In the render loop for headers and cells, compute `position: sticky`, `left`/`right` offsets, `z-index`, and `background` based on `header.column.getIsPinned()` / `cell.column.getIsPinned()`.

Key implementation: use `style` prop on `TableHead`/`TableCell`:

```tsx
const pinned = header.column.getIsPinned();
const isLastLeftPinned = pinned === 'left' && header.column.getIsLastColumn('left');
const isFirstRightPinned = pinned === 'right' && header.column.getIsFirstColumn('right');

const pinStyle: React.CSSProperties = pinned ? {
  position: 'sticky',
  left: pinned === 'left' ? header.column.getStart('left') : undefined,
  right: pinned === 'right' ? header.column.getAfter('right') : undefined,
  zIndex: 1,
} : {};
```

**Step 2: Add shadow pseudo-elements**

Add CSS classes for the shadow effect on the last left-pinned and first right-pinned columns. Use `data-pinned-border` attribute and Tailwind classes:

```css
/* In globals.css or data-table.styles.ts */
[data-pinned-border="left"] {
  box-shadow: inset -4px 0 4px -4px oklch(0 0 0 / 0.08);
}
[data-pinned-border="right"] {
  box-shadow: inset 4px 0 4px -4px oklch(0 0 0 / 0.08);
}
```

**Step 3: Set opaque background on pinned cells**

Pinned cells need `bg-surface` to mask scrolling content behind them. Apply via className when `pinned` is truthy.

**Step 4: Commit**

```bash
git commit -m "feat(datatable): add CSS sticky positioning and shadow for pinned columns"
```

---

### Task 5.3: Add pin/unpin column builder support

**Files:**
- Modify: `components/features/data-table/factories/column-builders.tsx`

Add `pinned?: 'left' | 'right' | false` and `enablePinning?: boolean` to `BaseColumnConfig` and all public Config interfaces. When `pinned` is set, include it in `meta` so the DataTable can read it for `defaultColumnPinning`.

**Commit:** `feat(datatable): add pinned and enablePinning options to column builders`

---

### Task 5.4: Integrate pinning with views

**Files:**
- Modify: `components/features/data-table/hooks/use-data-table-views.ts`

The `DataTableView` type already has `pinnedColumns`. Wire it so that when a view is activated, its `pinnedColumns` state is applied to the table.

**Commit:** `feat(datatable): persist column pinning state in views`

---

## Phase 6: Row Expand

### Task 6.1: Add expand column and sub-component rendering

**Files:**
- Modify: `components/features/data-table/data-table.types.ts`
- Modify: `components/features/data-table/data-table.tsx`
- Modify: `components/features/data-table/factories/col.ts`

**Step 1: Add props to DataTableProps**

```typescript
enableRowExpand?: boolean;
renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
expandMode?: 'single' | 'multiple';
defaultExpanded?: boolean | string[];
```

**Step 2: Add expanded state to DataTable**

```typescript
import { type ExpandedState, getExpandedRowModel } from '@tanstack/react-table';

const [expanded, setExpanded] = React.useState<ExpandedState>(
  defaultExpanded === true ? true : {}
);
```

Pass to `useReactTable`: `state.expanded`, `onExpandedChange`, `getExpandedRowModel()`, `getRowCanExpand: () => true`.

For `expandMode: 'single'`, wrap `onExpandedChange` to clear other expanded rows.

**Step 3: Add expand column to tableColumns**

When `enableRowExpand` is true, insert an expand column before other columns (after select if present):

```tsx
{
  id: 'expand',
  header: () => null,
  cell: ({ row }) => (
    <button
      type="button"
      onClick={row.getToggleExpandedHandler()}
      className="p-1 text-fg-muted hover:text-fg"
    >
      <ChevronRight className={cn('h-4 w-4 transition-transform', row.getIsExpanded() && 'rotate-90')} />
    </button>
  ),
  enableSorting: false,
  enableHiding: false,
  size: 32,
}
```

**Step 4: Render expanded row content**

After each `<TableRow>`, if `row.getIsExpanded()` and `renderExpandedRow`:

```tsx
{row.getIsExpanded() && renderExpandedRow && (
  <TableRow>
    <TableCell colSpan={row.getVisibleCells().length} className="bg-muted/30 p-4">
      {renderExpandedRow(row)}
    </TableCell>
  </TableRow>
)}
```

**Step 5: Add `col.expand()` to namespace**

```typescript
expand: (): DataTableColumnDef<any> => ({
  id: 'expand',
  header: () => null,
  cell: ({ row }) => { /* chevron button */ },
  enableSorting: false,
  enableHiding: false,
  size: 32,
}),
```

**Step 6: Commit**

```bash
git commit -m "feat(datatable): add row expand with single/multiple modes"
```

---

### Task 6.2: Create expanded row helper components

**Files:**
- Create: `components/features/data-table/cells/expanded-row-grid.tsx`
- Create: `components/features/data-table/cells/expanded-row-tabs.tsx`
- Create: `components/features/data-table/cells/expanded-row-sub-table.tsx`

**ExpandedRowGrid:** Renders a 2-3 column grid of key-value pairs.

```tsx
interface ExpandedRowGridProps {
  items: Array<{ label: string; value: React.ReactNode }>;
  columns?: 2 | 3;
}
```

**ExpandedRowTabs:** Uses existing `Tabs` UI component for tabbed panel content.

**ExpandedRowSubTable:** Renders a simplified, read-only DataTable (no toolbar, no pagination, compact density).

Export from `cells/index.ts`.

**Commit:** `feat(datatable): add expanded row helper components (Grid, Tabs, SubTable)`

---

## Phase 7: Grouping

### Task 7.1: Wire TanStack Table grouping model

**Files:**
- Modify: `components/features/data-table/data-table.types.ts`
- Modify: `components/features/data-table/data-table.tsx`

**Step 1: Add grouping props to DataTableProps**

```typescript
enableGrouping?: boolean;
defaultGrouping?: string[];
onGroupingChange?: (grouping: string[]) => void;
groupAggregations?: Record<string, AggregationType>;
```

**Step 2: Wire TanStack Table**

```typescript
import { type GroupingState, getGroupedRowModel } from '@tanstack/react-table';

const [grouping, setGrouping] = React.useState<GroupingState>(defaultGrouping ?? []);
```

Pass to `useReactTable`:
- `enableGrouping`
- `state.grouping`
- `onGroupingChange`
- `getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined`

**Step 3: Render group header rows**

In the body rendering, detect grouped rows (`row.getIsGrouped()`) and render them differently:

```tsx
{row.getIsGrouped() ? (
  <TableRow key={row.id} className="bg-raised/30 font-medium">
    <TableCell colSpan={row.getVisibleCells().length}>
      <button onClick={row.getToggleExpandedHandler()} className="flex items-center gap-2">
        <ChevronRight className={cn('h-4 w-4', row.getIsExpanded() && 'rotate-90')} />
        {/* Group value rendered with column's cell renderer */}
        {flexRender(row.getVisibleCells()[0].column.columnDef.cell, row.getVisibleCells()[0].getContext())}
        <span className="text-fg-muted">({row.subRows.length})</span>
      </button>
      {/* Aggregations rendered inline */}
    </TableCell>
  </TableRow>
) : (
  // Normal row rendering
)}
```

**Step 4: Commit**

```bash
git commit -m "feat(datatable): wire TanStack grouping model with group header rendering"
```

---

### Task 7.2: Add aggregation rendering in group headers

**Files:**
- Create: `components/features/data-table/data-table-group-aggregations.tsx`
- Modify: `components/features/data-table/data-table.tsx`

Compute aggregations per group based on `groupAggregations` config. For each column with an aggregation, calculate the value from `row.subRows` and display it in the group header row, aligned with the column.

Supported: `sum`, `avg`, `min`, `max`, `count`, `range`, `custom function`.

**Commit:** `feat(datatable): add aggregation calculations and rendering in group headers`

---

### Task 7.3: Add "Group by" toolbar control

**Files:**
- Create: `components/features/data-table/data-table-group-menu.tsx`
- Modify: `components/features/data-table/data-table-actions-bar.tsx`

Add a "Group by" button in the actions bar (next to Sort and Filter). Opens a dropdown listing groupable columns. Supports multi-level grouping with draggable chips to reorder.

Uses `DropdownMenu` + `Badge` chips with `×` remove button.

**Commit:** `feat(datatable): add Group By menu in toolbar with multi-level support`

---

### Task 7.4: Integrate grouping with views

**Files:**
- Modify: `components/features/data-table/hooks/use-data-table-views.ts`

When a view is activated, apply its `grouping` and `aggregations` state. When saving a view, persist current grouping state.

**Commit:** `feat(datatable): persist grouping state in views`

---

## Phase 8: Advanced Inline Editing

### Task 8.1: Add cell focus / navigation system

**Files:**
- Create: `components/features/data-table/hooks/use-cell-navigation.ts`
- Modify: `components/features/data-table/data-table.types.ts`
- Modify: `components/features/data-table/data-table.tsx`

**Step 1: Add `enableCellEditing` prop**

```typescript
enableCellEditing?: boolean;
onCellEdit?: (rowId: string, columnId: string, value: unknown, previousValue: unknown) => void;
editHistorySize?: number;
```

**Step 2: Create `useCellNavigation` hook**

Manages `activeCell: { rowId: string, columnId: string } | null` state. Handles keyboard events on the table container:

- Arrow keys: move focus between cells
- Tab/Shift+Tab: move to next/prev editable cell
- Enter: toggle edit mode
- Escape: exit edit mode or deselect

The hook returns `{ activeCell, isEditing, handlers }`.

**Step 3: Wire to DataTable**

Add `onKeyDown` handler on the table wrapper div. Add `data-row` and `data-col` attributes to `TableCell` for programmatic focus.

**Commit:** `feat(datatable): add cell focus and keyboard navigation system`

---

### Task 8.2: Add inline validation to editable cells

**Files:**
- Modify: `components/features/data-table/factories/editable-column-builders.tsx`

Add `validate` option to all editable column configs:

```typescript
validate?: (value: unknown) => { level: 'error' | 'warning' | 'info', message: string } | null;
validateOn?: 'change' | 'blur';
```

Modify editable cell components to:
1. Run validation on blur (or change)
2. Show border color + icon based on validation level
3. Show tooltip with message on icon hover
4. Block save for `error` level (restore previous value)

**Commit:** `feat(datatable): add inline validation to editable cells`

---

### Task 8.3: Add undo/redo system

**Files:**
- Create: `components/features/data-table/hooks/use-edit-history.ts`
- Modify: `components/features/data-table/data-table.tsx`

**Step 1: Create `useEditHistory` hook**

```typescript
interface CellEdit {
  rowId: string;
  columnId: string;
  previousValue: unknown;
  newValue: unknown;
  timestamp: number;
}

function useEditHistory(maxSize: number = 50) {
  // Circular buffer of edits
  // undo() returns the edit to reverse
  // redo() returns the edit to reapply
  return { push, undo, redo, canUndo, canRedo };
}
```

**Step 2: Wire Ctrl+Z / Ctrl+Shift+Z**

In the table's `onKeyDown` handler, intercept these shortcuts and call `undo()`/`redo()`, which triggers `onCellEdit` with the reversed values.

**Commit:** `feat(datatable): add undo/redo system for cell edits`

---

## Phase 9: Presets v2 & Integration

### Task 9.1: Migrate CRM Deals preset to `col` namespace

**Files:**
- Modify: `components/features/data-table/presets/crm-deals.tsx`

Refactor `createDealsPreset` to use `col.*` builders instead of `createXxxColumn`. Add new cell types where applicable (e.g., `col.currency` instead of `createCurrencyColumn`, `col.relativeDate` for close date).

This is the proof-of-concept migration. The DX improvement should be immediately visible.

**Commit:** `refactor(datatable): migrate CRM Deals preset to col namespace`

---

### Task 9.2: Migrate remaining CRM presets

**Files:**
- Modify: `components/features/data-table/presets/crm-contacts.tsx`
- Modify: `components/features/data-table/presets/crm-companies.tsx`
- Modify: `components/features/data-table/presets/crm-quotes.tsx`
- Modify: `components/features/data-table/presets/crm-products.tsx`
- Modify: `components/features/data-table/presets/crm-deals-editable.tsx`

Migrate each to `col.*` namespace. Add new cell types where they make sense (e.g., `col.user` for contact columns, `col.tags` for labels, `col.progress` for probabilities).

**Commit:** `refactor(datatable): migrate all CRM presets to col namespace`

---

### Task 9.3: Migrate general presets

**Files:**
- Modify: `components/features/data-table/presets/users.tsx`
- Modify: `components/features/data-table/presets/orders.tsx`
- Modify: `components/features/data-table/presets/invitations.tsx`

**Commit:** `refactor(datatable): migrate general presets to col namespace`

---

### Task 9.4: Full build + smoke test

**Step 1:** Run `pnpm build` — expect zero errors.

**Step 2:** Run the dev server and manually navigate to CRM pages that use DataTable presets. Verify tables render correctly.

**Step 3:** Test new features on one CRM page:
- Add `enableColumnPinning` + `defaultColumnPinning` to Deals table
- Add `enableGrouping` + `defaultGrouping={["stage"]}` to Deals table
- Verify grouping and pinning work visually

**Step 4: Final commit**

```bash
git commit -m "feat(datatable): complete DataTable v2 evolution with all features"
```

---

## Execution Order Summary

| Phase | Tasks | Estimated Scope |
|-------|-------|-----------------|
| 1. Foundation | 1.1–1.3 | `col` namespace, `definePreset`, types |
| 2. Tier 1 Cells | 2.1–2.7 | 7 new cell types |
| 3. Tier 2 Cells | 3.1–3.6 | 6 new cell types |
| 4. Tier 3 Cells | 4.1–4.3 | 2 new cell types + barrel export |
| 5. Column Pinning | 5.1–5.4 | CSS sticky, views integration |
| 6. Row Expand | 6.1–6.2 | Expand column, helpers |
| 7. Grouping | 7.1–7.4 | TanStack grouping, aggregations, toolbar |
| 8. Inline Editing | 8.1–8.3 | Keyboard nav, validation, undo/redo |
| 9. Presets v2 | 9.1–9.4 | Migrate all presets, smoke test |

**Dependencies:** Phase 1 must complete before all others. Phases 2–4 (cell types) are independent of Phases 5–8 (features). Phase 9 depends on all others.
