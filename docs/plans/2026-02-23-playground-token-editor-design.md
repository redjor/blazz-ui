# Playground Token Editor — Design

## Summary

Replace the current playground page (`app/playground/page.tsx`) with a full-screen token editor featuring a left sidebar for editing design tokens and a main preview area showing live component previews.

## Layout

```
+--sidebar (280px, scroll)------+--main area (rest)------------------------------+
|                               |  topbar: [Search component...] [active chips]  |
| Preset: [Slate|Corp|Warm]     |                                                |
| Mode:   [Light|Dark]          |  +-- section: Button ----------------------+   |
|                               |  | [Default] [Outline] [Ghost] [Destruct] |   |
| --- Surfaces ----             |  +----------------------------------------+   |
| bg-app      [swatch][oklch]   |                                                |
| bg-surface  [swatch][oklch]   |  +-- section: Badge -----------------------+   |
| bg-raised   [swatch][oklch]   |  | Default | Success | Warning | Critical  |   |
| bg-overlay  [swatch][oklch]   |  +----------------------------------------+   |
|                               |                                                |
| --- Text --------             |  +-- section: Card ------------------------+   |
| text-primary  [swatch][oklch] |  | Card with header, content, footer       |   |
| text-secondary[swatch][oklch] |  +----------------------------------------+   |
| text-muted    [swatch][oklch] |                                                |
|                               |  ... (scrollable)                              |
| --- Borders ------            |                                                |
| ...                           |                                                |
|                               |                                                |
| --- Density ------            |                                                |
| Row Height    [=====] 40px    |                                                |
| Cell Padding  [=====] 12px   |                                                |
|                               |                                                |
| [Export CSS]                  |                                                |
+-------------------------------+------------------------------------------------+
```

## Components

### New files

1. **`app/playground/page.tsx`** — Rewritten page with sidebar + preview layout
2. **`components/features/playground/playground-sidebar.tsx`** — Token editing sidebar
3. **`components/features/playground/playground-preview.tsx`** — Main preview area with topbar search
4. **`components/features/playground/token-color-input.tsx`** — Atomic: color swatch + oklch text input
5. **`components/features/playground/preview-registry.ts`** — Registry of previewable components
6. **`components/features/playground/previews/*.tsx`** — Individual preview components (ButtonPreview, BadgePreview, etc.)

### Reused from existing

- `theme-presets.ts` — Types (`OklchColor`, `TokenKey`, `TokenValues`, `PresetName`, `DensityToken`, etc.)
- `theme-presets.ts` — Preset data (`PRESETS`, `TOKEN_GROUPS`, `DENSITY_TOKENS`)
- `theme-presets.ts` — Helpers (`oklchToString`, `tokensToInlineStyles`, `densityToInlineStyles`, `generateExportCss`)

## Token Editing UX

Each color token shows:
- **Color swatch** (clickable, opens native `<input type="color">` via popover)
- **Text input** with oklch value (editable, synced with picker)
- Conversion: hex ↔ oklch for color picker compatibility

Density tokens use simple range sliders (same as existing).

## Preview Area UX

- **Search bar** (top): cmdk-style search filtering the component registry
- **Active chips**: toggle components on/off, shown as removable chips
- **Preview grid**: each active component renders in a bordered section with its variants
- Default active components: Button, Badge, Card, Input, Table

## State Management

- Local `useState` in the page component
- Tokens injected via CSS `style={{...}}` on the preview container
- No persistence (reset on refresh)
- Export CSS as primary output workflow

## What We Don't Do

- No iframe for preview (same DOM)
- No localStorage persistence
- No "apply globally" mode
- No route/layout changes beyond the page itself
