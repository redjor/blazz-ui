# Design: Hierarchical Surface Layers

**Date:** 2026-03-14
**Status:** Approved

## Problem

The current token system mixes semantic and zone-specific surface tokens (`--bg-app`, `--bg-surface`, `--bg-raised`, `--bg-overlay`, `--top-background`, `--main-background`, `--sidebar-background`). This creates confusion: `--bg-surface` is used for both sidebar and cards even though they sit at different visual hierarchy levels. Adding a new theme means defining 7+ surface tokens manually.

## Design

### Concept: Semantic layers by importance

5 surface levels (`surface-0` to `surface-4`) ordered by visual importance — lower numbers are more recessive (navigation chrome), higher numbers are more prominent (content, nested elements).

| Level | Role | Example |
|-------|------|---------|
| `surface-0` | Nav shell (sidebar + topbar) | Most recessive, framing chrome |
| `surface-1` | Main area background | Content backdrop |
| `surface-2` | Card, section, panel | Primary content container |
| `surface-3` | Nested element (table, input group) | Element inside a card |
| `surface-4` | Deep nesting, overlay | Popover, dialog, deeply nested |

### Implementation: color-mix scale

Each theme defines only 2 anchor values. The 3 intermediate levels are computed via `color-mix(in oklch)`.

```css
:root {
  --surface-base: oklch(0.94 0 0);
  --surface-top:  oklch(1.0 0 0);

  --surface-0: var(--surface-base);
  --surface-1: color-mix(in oklch, var(--surface-base) 75%, var(--surface-top));
  --surface-2: color-mix(in oklch, var(--surface-base) 50%, var(--surface-top));
  --surface-3: color-mix(in oklch, var(--surface-base) 25%, var(--surface-top));
  --surface-4: var(--surface-top);
}

html.dark {
  --surface-base: oklch(0.145 0.005 285);
  --surface-top:  oklch(0.28 0.005 285);
}
```

### Tailwind utilities

```css
@theme inline {
  --color-surface-0: var(--surface-0);
  --color-surface-1: var(--surface-1);
  --color-surface-2: var(--surface-2);
  --color-surface-3: var(--surface-3);
  --color-surface-4: var(--surface-4);
}
```

Usage: `bg-surface-0`, `bg-surface-1`, `text-surface-3`, etc.

### Theme definitions

Each theme = 2 values only (`--surface-base` + `--surface-top`):

```css
/* Default (Indigo/Violet) */
:root            { --surface-base: oklch(0.94 0 0);      --surface-top: oklch(1.0 0 0); }
html.dark        { --surface-base: oklch(0.145 0.005 285); --surface-top: oklch(0.28 0.005 285); }

/* Corporate */
html[data-theme="corporate"]      { --surface-base: oklch(0.94 0 0);    --surface-top: oklch(1.0 0 0); }
html[data-theme="corporate"].dark { --surface-base: oklch(0.145 0 0);   --surface-top: oklch(0.28 0 0); }

/* Warm */
html[data-theme="warm"]           { --surface-base: oklch(0.93 0.01 75);  --surface-top: oklch(0.995 0.005 75); }
html[data-theme="warm"].dark      { --surface-base: oklch(0.155 0.01 60); --surface-top: oklch(0.28 0.01 60); }
```

### Backward compatibility

Old tokens become aliases pointing to the new scale:

```css
@theme inline {
  --color-surface: var(--surface-2);
  --color-raised: var(--surface-3);
  --color-panel: var(--surface-4);
  --color-background: var(--surface-1);
  --color-muted: var(--surface-3);
  --color-secondary: var(--surface-3);
  --color-accent: var(--surface-3);
  --color-popover: var(--surface-4);
}
```

### Tokens deprecated (to remove after migration)

| Old token | Replaced by |
|-----------|-------------|
| `--bg-app` | `--surface-0` or `--surface-1` |
| `--bg-surface` | `--surface-2` |
| `--bg-raised` | `--surface-3` |
| `--bg-overlay` | `--surface-4` |
| `--top-background` | `--surface-0` |
| `--main-background` | `--surface-1` |
| `--sidebar-background` | `--surface-0` |

## Migration strategy

1. **Phase 1** — Add new tokens + compat aliases (nothing breaks)
2. **Phase 2** — Migrate `packages/ui` components to `bg-surface-N`
3. **Phase 3** — Migrate apps (`docs`, `examples`, `ops`)
4. **Phase 4** — Remove old tokens

## Key decisions

- **5 levels (0-4):** 4 is enough for 95% of cases, 5th for rare deep nesting and future-proofing
- **Unified surface-0:** Sidebar and topbar share the same level (no more separate `--top-background`)
- **color-mix approach:** 2 values per theme instead of 5+, perceptually uniform progression via oklch interpolation
- **Semantic model (B):** Levels represent importance, not DOM depth
