# Empty Component — Full Redesign

## Context

Two overlapping components exist:
- `components/ui/empty.tsx` — Compositional primitive, legacy tokens, 0 usages
- `components/blocks/empty-state.tsx` — Props-based block, correct tokens, 1 usage (notification-center)

`ai/design.md` defines two types of empty states: "no data" (never had data) vs "no results" (filters too restrictive).

## Decision

Unify into a single `components/ui/empty.tsx` with a props-based API as the primary interface and sub-components exported for advanced composition.

## API

### Props-based (primary)

```tsx
<Empty
  icon={Building}
  title="No companies"
  description="Create your first company to get started."
  action={{ label: "Add", href: "/companies/new", icon: Plus }}
  size="default"
/>
```

### Compositional (escape hatch)

```tsx
<Empty size="lg">
  <EmptyIcon><Rocket className="size-8" /></EmptyIcon>
  <EmptyTitle>Welcome to Forge CRM</EmptyTitle>
  <EmptyDescription>Start by importing your data.</EmptyDescription>
  <EmptyActions>
    <Button>Import CSV</Button>
    <Button variant="outline">Create manually</Button>
  </EmptyActions>
</Empty>
```

## Sub-components

| Component | Role | Key classes |
|-----------|------|-------------|
| `Empty` | Container, accepts size + shorthand props | flex col, items-center, text-center |
| `EmptyIcon` | Icon wrapper with circular bg | bg-raised, rounded-full, text-fg-muted |
| `EmptyTitle` | Title text | text-sm font-medium text-fg |
| `EmptyDescription` | Description text | text-sm text-fg-muted, max-w-sm |
| `EmptyActions` | Button container | flex row, gap-2 |

## Size variants (CVA)

| Size | Padding | Icon container | Icon size |
|------|---------|---------------|-----------|
| `sm` | `py-6` | `size-8 p-1.5` | `size-4` |
| `default` | `py-12` | `size-10 p-2.5` | `size-5` |
| `lg` | `py-20` | `size-12 p-3` | `size-6` |

## Design tokens

- `bg-raised` — icon circle background
- `text-fg-muted` — icon color, description
- `text-fg` — title
- No legacy tokens (bg-muted, text-foreground, text-muted-foreground, text-primary)

## EmptyAction type

```tsx
interface EmptyAction {
  label: string
  href?: string
  onClick?: () => void
  icon?: LucideIcon
}
```

## Migration

1. Rewrite `components/ui/empty.tsx`
2. Delete `components/blocks/empty-state.tsx`
3. Update `components/blocks/notification-center.tsx` import
4. Create doc page at `app/(docs)/docs/components/ui/empty/page.tsx`
5. Add to navigation config (Feedback Indicators section)
6. Add to feedback index page

## Doc page sections

- Hero
- Examples: basic, with description, with action, no results variant, compact (sm), full page (lg), compositional
- Props tables: Empty, EmptyAction
- Design tokens
- Guidelines (no data vs no results, always provide action, etc.)
- Related: Banner, Alert, Skeleton
