# Design: Component Thumbnail Generation Script

**Date:** 2026-02-23
**Status:** Approved

## Goal

Generate 800x600 (4:3) thumbnail screenshots of every component in the kit
(UI + blocks + AI) for documentation preview, in both light and dark themes,
with a dots pattern background using design system tokens.

## Architecture

### Approach: Registry + Dynamic Route + Playwright

```
config/thumbnail-registry.ts   → lists all components + demo configs
app/thumbnail/[slug]/page.tsx   → renders component centered on dots bg
components/thumbnails/           → preview wrappers with demo props
scripts/generate-thumbnails.ts  → Playwright batch screenshot runner
public/thumbnails/{theme}/       → generated PNG output
```

### 1. Registry — `config/thumbnail-registry.ts`

```ts
type ThumbnailEntry = {
  slug: string                    // URL-safe id: "button"
  category: "ui" | "blocks" | "ai"
  label: string                   // Display name: "Button"
}
```

Flat array of ~65+ entries covering all components.

### 2. Dynamic Route — `app/thumbnail/[slug]/page.tsx`

- Looks up slug in registry
- Renders a 800x600 viewport wrapper:
  - Background: `bg-surface` token
  - Dots pattern: `radial-gradient(circle, var(--edge) 1px, transparent 1px)` at 24px spacing
  - Component centered via flexbox
- Query param `?theme=dark` forces dark class on html
- No shell (no sidebar, topbar) — bare component on dots background

### 3. Preview Components — `components/thumbnails/`

Each file exports preview wrappers with realistic demo props:

```tsx
// components/thumbnails/ui-previews.tsx
export function ButtonPreview() {
  return (
    <div className="flex gap-3">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

### 4. Playwright Script — `scripts/generate-thumbnails.ts`

```
pnpm thumbnails [--theme=light|dark|both] [--component=button]
```

- Starts or connects to Next.js dev server
- Iterates over registry entries
- For each component:
  - Visit `http://localhost:3000/thumbnail/{slug}` → screenshot to `public/thumbnails/light/{slug}.png`
  - Visit `http://localhost:3000/thumbnail/{slug}?theme=dark` → screenshot to `public/thumbnails/dark/{slug}.png`
- Supports `--component=slug` for single regeneration
- Logs summary with counts and any errors

### 5. Output Structure

```
public/thumbnails/
├── light/
│   ├── button.png
│   ├── input.png
│   ├── data-grid.png
│   └── ...
└── dark/
    ├── button.png
    ├── input.png
    ├── data-grid.png
    └── ...
```

### 6. Dots Pattern CSS

```css
background-image: radial-gradient(circle, var(--edge) 1px, transparent 1px);
background-size: 24px 24px;
```

Theme-aware via `--edge` token. Adapts automatically in light/dark.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Resolution | 800x600 | Good for doc cards, light file size |
| Aspect ratio | 4:3 | Requested format |
| Themes | Light + Dark | Both variants stored separately |
| Tool | Playwright | Already in dependencies |
| Approach | Registry + dynamic route | Single route, centralized config |
| Background | Dots on bg-surface | Theme-aware, uses design tokens |

## Scope

- ~26 block components
- ~39 UI components
- ~14 AI/generative components
- = ~79 components x 2 themes = ~158 thumbnails
