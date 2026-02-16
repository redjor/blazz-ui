# Theme Palettes — Design Document

> **Date:** 2026-02-16
> **Status:** Approved
> **Goal:** Add Corporate and Warm theme palettes alongside the existing Slate theme.

---

## Architecture

### Two independent axes

1. **Palette** (`data-theme` attribute on `<html>`): Slate (default), Corporate, Warm
2. **Mode** (`.dark` class via next-themes): light, dark

Each palette defines values for both light and dark modes. The mode toggle remains independent — users can combine any palette with any mode.

### Recommended pairings (applied on palette selection)

| Palette | Default mode | Accent | Vibe |
|---------|-------------|--------|------|
| Slate | Dark | Indigo/Violet | Linear, Vercel |
| Corporate | Light | Navy blue | Stripe, Notion |
| Warm | Light | Amber/Miel | Intercom, HelpScout |

---

## Color Palettes

### Slate (existing, unchanged)

**Light:**
```css
--accent: oklch(0.50 0.22 275);
--accent-hover: oklch(0.44 0.22 275);
--bg-app: oklch(0.97 0 0);
--bg-surface: oklch(1 0 0);
--bg-raised: oklch(0.94 0 0);
/* Neutral surfaces, slight blue tint (hue 0) */
```

**Dark:**
```css
--accent: oklch(0.585 0.22 275);
--accent-hover: oklch(0.52 0.22 275);
--bg-app: oklch(0.145 0.005 285);
--bg-surface: oklch(0.178 0.005 285);
--bg-raised: oklch(0.215 0.005 285);
/* Cool blue-tinted surfaces (hue 285) */
```

### Corporate (new)

**Light:**
```css
--accent: oklch(0.40 0.18 250);
--accent-hover: oklch(0.35 0.18 250);
--accent-foreground: oklch(0.985 0 0);
--bg-app: oklch(0.965 0 0);
--bg-surface: oklch(1 0 0);
--bg-raised: oklch(0.945 0 0);
--bg-overlay: oklch(1 0 0);
--border-default: oklch(0.88 0 0);
--border-subtle: oklch(0.93 0 0);
--text-primary: oklch(0.15 0 0);
--text-secondary: oklch(0.40 0 0);
--text-muted: oklch(0.55 0 0);
/* Pure neutral surfaces (hue 0), deep navy accent */
```

**Dark:**
```css
--accent: oklch(0.55 0.18 250);
--accent-hover: oklch(0.48 0.18 250);
--accent-foreground: oklch(0.985 0 0);
--bg-app: oklch(0.145 0 0);
--bg-surface: oklch(0.178 0 0);
--bg-raised: oklch(0.215 0 0);
--bg-overlay: oklch(0.25 0 0);
--border-default: oklch(0.35 0 0 / 0.6);
--border-subtle: oklch(0.35 0 0 / 0.3);
--text-primary: oklch(0.985 0 0);
--text-secondary: oklch(0.65 0 0);
--text-muted: oklch(0.50 0 0);
/* Pure neutral dark surfaces (hue 0), brighter navy accent */
```

### Warm (new)

**Light:**
```css
--accent: oklch(0.55 0.17 70);
--accent-hover: oklch(0.48 0.17 70);
--accent-foreground: oklch(0.985 0 0);
--bg-app: oklch(0.96 0.01 75);
--bg-surface: oklch(0.995 0.005 75);
--bg-raised: oklch(0.935 0.01 75);
--bg-overlay: oklch(0.995 0.005 75);
--border-default: oklch(0.86 0.01 75);
--border-subtle: oklch(0.91 0.008 75);
--text-primary: oklch(0.18 0.01 60);
--text-secondary: oklch(0.42 0.02 60);
--text-muted: oklch(0.55 0.015 60);
/* Warm cream surfaces (hue 75), amber accent */
```

**Dark:**
```css
--accent: oklch(0.70 0.15 70);
--accent-hover: oklch(0.63 0.15 70);
--accent-foreground: oklch(0.15 0 0);
--bg-app: oklch(0.155 0.01 60);
--bg-surface: oklch(0.19 0.01 60);
--bg-raised: oklch(0.225 0.01 60);
--bg-overlay: oklch(0.26 0.01 60);
--border-default: oklch(0.35 0.01 60 / 0.6);
--border-subtle: oklch(0.35 0.01 60 / 0.3);
--text-primary: oklch(0.97 0.01 75);
--text-secondary: oklch(0.65 0.015 60);
--text-muted: oklch(0.50 0.01 60);
/* Warm dark surfaces (hue 60), bright amber accent, dark text on accent */
```

---

## CSS Implementation

Themes are pure CSS overrides using `data-theme` attribute selectors. No `data-theme` attribute = Slate (backward compatible).

```css
/* Corporate — Light */
html[data-theme="corporate"] { ... }

/* Corporate — Dark */
html[data-theme="corporate"].dark { ... }

/* Warm — Light */
html[data-theme="warm"] { ... }

/* Warm — Dark */
html[data-theme="warm"].dark { ... }
```

Semantic tokens (`--success`, `--warning`, `--destructive`, `--info`) and density tokens (`--row-height`, `--cell-padding-x`, etc.) remain unchanged across themes — only surface, text, border, and accent colors change.

---

## Theme Provider

### `lib/theme-context.tsx`

React context that manages the `data-theme` attribute independently from next-themes.

```tsx
// API
const { palette, setPalette } = useThemePalette()
// palette: "slate" | "corporate" | "warm"
```

- Reads/writes `localStorage("theme-palette")`
- On mount: applies `data-theme` attribute to `<html>`
- On change: updates attribute + sets recommended mode via next-themes `setTheme()`
  - Slate → dark, Corporate → light, Warm → light

### Provider hierarchy

```
<ThemePaletteProvider>      ← new, manages data-theme
  <ThemeProvider>            ← next-themes, manages .dark
    <App />
  </ThemeProvider>
</ThemePaletteProvider>
```

---

## UI — Palette Switcher

### `components/layout/theme-palette-switcher.tsx`

Dropdown button in the top bar, next to the existing Sun/Moon toggle.

**Trigger:** Small button with a palette icon (Paintbrush or Palette from Lucide).

**Dropdown items (3):**
- Slate — indigo dot + "Slate" label
- Corporate — navy dot + "Corporate" label
- Warm — amber dot + "Warm" label

Active item gets a checkmark. On selection: `setPalette("corporate")` which sets `data-theme` + switches to recommended mode.

---

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| `app/globals.css` | Modify | Add ~60 lines: Corporate + Warm theme blocks (light + dark each) |
| `lib/theme-context.tsx` | Create | Theme palette context + provider + hook |
| `components/layout/theme-palette-switcher.tsx` | Create | Dropdown UI for palette selection |
| `components/layout/app-top-bar.tsx` | Modify | Add palette switcher next to theme toggle |
| `app/layout.tsx` | Modify | Wrap with ThemePaletteProvider |

Zero changes to existing components — they already use design tokens.
