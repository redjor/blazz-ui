# Turborepo Monorepo Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the single Next.js app into a Turborepo monorepo with `packages/ui` (@blazz/ui), `apps/docs`, and `apps/examples`.

**Architecture:** Turborepo + pnpm workspaces. `@blazz/ui` is a publishable npm package consumed by two Next.js apps via `workspace:*` and `transpilePackages`. Changesets handles versioning.

**Tech Stack:** Turborepo, pnpm workspaces, tsup (ESM build), Changesets, Next.js 16, Tailwind v4

**Design doc:** `docs/plans/2026-02-24-turborepo-monorepo-design.md`

---

## Important Context

### Import patterns
- ALL components currently use `@/*` path alias (maps to project root)
- Example: `import { cn } from "@/lib/utils"`, `import { Button } from "@/components/ui/button"`
- After migration:
  - **Inside `packages/ui`**: `@/` → relative imports (`../ui/button`, `../../lib/utils`)
  - **Inside `apps/docs` and `apps/examples`**: `@/components/ui/button` → `@blazz/ui/button` for kit components, `@/` for app-local files

### File counts
| Destination | Files |
|---|---|
| `packages/ui` | ~200 (components/ui, blocks, ai, features/data-table, features/command-palette, features/image-upload, features/navigation-tabs, layout, hooks, lib/utils, types, styles) |
| `apps/docs` | ~150 (docs routes, thumbnails, playground, landing, configs) |
| `apps/examples` | ~80 (CRM/StockBase/TalentFlow routes, Prisma, actions, schemas, presets, user-management) |

### Dependencies to be aware of
- `components/layout/` imports from `@/types/navigation` → move `types/navigation.ts` to `packages/ui/types/`
- `components/layout/` imports from `@/lib/theme-context` → move to `packages/ui/lib/`
- `components/layout/notification-sheet.tsx` imports from `@/components/blocks/notification-center` → internal relative import in package
- Data-table presets (14 files in `presets/`) import CRM types → move to `apps/examples`

---

## Task 1: Scaffold Monorepo Root

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Modify: `package.json` (root)

**Step 1: Create pnpm-workspace.yaml**

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

**Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Step 3: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true
  },
  "exclude": ["node_modules"]
}
```

**Step 4: Update root package.json**

Replace the current `package.json` with a root workspace config. Move ALL dependencies to their respective packages later.

```json
{
  "name": "blazz",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "dev:docs": "turbo dev --filter=docs",
    "dev:examples": "turbo dev --filter=examples",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "type-check": "turbo type-check",
    "format": "biome format --write .",
    "check": "biome check --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.11",
    "turbo": "^2"
  },
  "packageManager": "pnpm@9.15.0"
}
```

**Step 5: Install turbo**

Run: `pnpm add -Dw turbo`

**Step 6: Create workspace directories**

Run: `mkdir -p packages/ui apps/docs apps/examples`

**Step 7: Commit**

```bash
git add pnpm-workspace.yaml turbo.json tsconfig.base.json package.json
git commit -m "chore: scaffold Turborepo monorepo root"
```

---

## Task 2: Create @blazz/ui Package

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/tsup.config.ts`
- Create: `packages/ui/src/index.ts` (barrel export — created after moving files)

**Step 1: Create packages/ui/package.json**

```json
{
  "name": "@blazz/ui",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "src",
    "styles"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "type-check": "tsc --noEmit",
    "lint": "biome check ."
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  },
  "dependencies": {
    "@base-ui/react": "^1.0.0",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-use-controllable-state": "^1.2.2",
    "@tanstack/react-table": "^8.21.3",
    "ai": "^6.0.97",
    "class-variance-authority": "^0.7.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "lucide-react": "^0.562.0",
    "motion": "^12.29.0",
    "nanoid": "^5.1.6",
    "next-themes": "^0.4.6",
    "react-day-picker": "^9.13.2",
    "react-dropzone": "^14.3.8",
    "react-hook-form": "^7.71.1",
    "react-phone-number-input": "^3.4.14",
    "recharts": "2.15.4",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.4.0",
    "zod": "^4.3.5"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

**Step 2: Create packages/ui/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create packages/ui/tsup.config.ts**

```typescript
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss"],
  treeshake: true,
})
```

**Step 4: Commit**

```bash
git add packages/ui/
git commit -m "chore: create @blazz/ui package skeleton"
```

---

## Task 3: Move Components to @blazz/ui

This is the biggest task. Move all kit components from root to `packages/ui/src/`.

**Files to move:**
- `components/ui/*` → `packages/ui/src/components/ui/`
- `components/blocks/*` → `packages/ui/src/components/blocks/`
- `components/ai/*` → `packages/ui/src/components/ai/`
- `components/features/data-table/` → `packages/ui/src/components/features/data-table/` (WITHOUT `presets/` subdirectory)
- `components/features/command-palette/` → `packages/ui/src/components/features/command-palette/`
- `components/features/image-upload/` → `packages/ui/src/components/features/image-upload/`
- `components/features/navigation-tabs/` → `packages/ui/src/components/features/navigation-tabs/`
- `components/layout/*` → `packages/ui/src/components/layout/`
- `hooks/*` → `packages/ui/src/hooks/` (EXCEPT app-specific: `use-session.ts`, `use-csrf.ts`)
- `lib/utils.ts` → `packages/ui/src/lib/utils.ts`
- `lib/utils/*` → `packages/ui/src/lib/utils/`
- `lib/theme-context.tsx` → `packages/ui/src/lib/theme-context.tsx`
- `lib/use-frame-layout.ts` → `packages/ui/src/lib/use-frame-layout.ts`
- `lib/tab-utils.ts` → `packages/ui/src/lib/tab-utils.ts`
- `types/navigation.ts` → `packages/ui/src/types/navigation.ts`

**Files that stay (NOT moved):**
- `components/features/data-table/presets/` → stays, moves to `apps/examples` later
- `components/features/docs/` → stays, moves to `apps/docs` later
- `components/features/playground/` → stays, moves to `apps/docs` later
- `components/features/user-management/` → stays, moves to `apps/examples` later
- `components/thumbnails/` → stays, moves to `apps/docs` later
- `components/landing/` → stays, moves to `apps/docs` later
- `hooks/use-session.ts`, `hooks/use-csrf.ts` → `apps/examples`
- `lib/db.ts`, `lib/actions/`, `lib/schemas/`, `lib/mock-data/`, `lib/generated/` → `apps/examples`
- `lib/shiki.ts` → `apps/docs`
- `lib/linear-data.ts`, `lib/sample-data.ts`, `lib/stockbase-data.ts`, `lib/talentflow-data.ts` → `apps/examples`
- `types/product.ts`, `types/user-management.ts` → `apps/examples`

**Step 1: Create directory structure in packages/ui/src**

```bash
mkdir -p packages/ui/src/components/{ui,blocks,ai,features/{data-table,command-palette,image-upload,navigation-tabs},layout}
mkdir -p packages/ui/src/{hooks,lib/utils,types}
mkdir -p packages/ui/styles
```

**Step 2: Move UI primitives**

```bash
# Move all files from components/ui/ to packages/ui/src/components/ui/
cp -r components/ui/* packages/ui/src/components/ui/
```

**Step 3: Move blocks**

```bash
cp -r components/blocks/* packages/ui/src/components/blocks/
```

**Step 4: Move AI components**

```bash
cp -r components/ai/* packages/ui/src/components/ai/
```

**Step 5: Move features (data-table WITHOUT presets)**

```bash
# Copy data-table directory structure first
mkdir -p packages/ui/src/components/features/data-table/{cells,factories,config}

# Copy data-table files (NOT presets/)
cp components/features/data-table/data-table*.tsx packages/ui/src/components/features/data-table/
cp -r components/features/data-table/cells/* packages/ui/src/components/features/data-table/cells/
cp -r components/features/data-table/factories/* packages/ui/src/components/features/data-table/factories/
cp -r components/features/data-table/config/* packages/ui/src/components/features/data-table/config/

# Copy command-palette
cp -r components/features/command-palette/* packages/ui/src/components/features/command-palette/

# Copy image-upload
cp -r components/features/image-upload/* packages/ui/src/components/features/image-upload/

# Copy navigation-tabs
cp -r components/features/navigation-tabs/* packages/ui/src/components/features/navigation-tabs/
```

**Step 6: Move layout components**

```bash
cp -r components/layout/* packages/ui/src/components/layout/
```

**Step 7: Move hooks (kit-only)**

```bash
# Copy hooks that are kit-generic (NOT use-session, use-csrf)
cp hooks/index.ts packages/ui/src/hooks/
cp hooks/use-block-navigation.ts packages/ui/src/hooks/
cp hooks/use-command-palette.ts packages/ui/src/hooks/
cp hooks/use-data-table-url-state.ts packages/ui/src/hooks/
cp hooks/use-data-table-views.ts packages/ui/src/hooks/
cp hooks/use-debounced.ts packages/ui/src/hooks/
cp hooks/use-navigation-with-params.ts packages/ui/src/hooks/
```

**Step 8: Move lib utilities**

```bash
cp lib/utils.ts packages/ui/src/lib/utils.ts
cp -r lib/utils/* packages/ui/src/lib/utils/ 2>/dev/null || true
cp lib/theme-context.tsx packages/ui/src/lib/theme-context.tsx
cp lib/use-frame-layout.ts packages/ui/src/lib/use-frame-layout.ts
cp lib/tab-utils.ts packages/ui/src/lib/tab-utils.ts
```

**Step 9: Move types**

```bash
cp types/navigation.ts packages/ui/src/types/navigation.ts
```

**Step 10: Move styles (design tokens)**

Copy the globals.css to `packages/ui/styles/`. This file will need editing — extract ONLY the design tokens (CSS custom properties) and Tailwind theme config, NOT the `@source` directives (those are app-specific).

The file at `app/globals.css` contains:
1. `@import "tailwindcss"` + `@source` directives (lines 1-6) → app-specific, NOT in package
2. `@custom-variant dark` (line 7) → package
3. `@theme inline { ... }` (lines 9-84) → package (Tailwind utilities mapping)
4. `:root { ... }` light theme tokens (lines 90-149) → package
5. `html.dark { ... }` dark theme tokens → package
6. Theme variants (corporate, warm) → package
7. Custom animations/keyframes → package
8. Component-specific styles → package

Create `packages/ui/styles/tokens.css` with everything EXCEPT `@import "tailwindcss"` and `@source` directives. Apps will import this file.

**Step 11: Commit**

```bash
git add packages/ui/src/ packages/ui/styles/
git commit -m "feat: move 200+ component files to packages/ui"
```

---

## Task 4: Rewrite Imports Inside packages/ui

All files in `packages/ui/src/` still use `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/types/...` imports. These need to become relative imports OR use the package-internal `@/` alias (which maps to `packages/ui/src/`).

**Strategy:** Since `packages/ui/tsconfig.json` maps `@/*` to `./src/*`, we can keep the `@/` prefix BUT the paths change:

| Old import | New import |
|---|---|
| `@/lib/utils` | `@/lib/utils` (same — utils is now at `src/lib/utils.ts`) |
| `@/components/ui/button` | `@/components/ui/button` (same — button is now at `src/components/ui/button.tsx`) |
| `@/components/blocks/error-state` | `@/components/blocks/error-state` (same) |
| `@/types/navigation` | `@/types/navigation` (same) |
| `@/lib/theme-context` | `@/lib/theme-context` (same) |
| `@/config/navigation` | REMOVE — config is app-specific, not in package |

**Key insight:** Since the internal directory structure (`components/`, `lib/`, `hooks/`, `types/`) is preserved inside `packages/ui/src/`, and `@/*` maps to `src/*`, MOST imports inside the package don't need to change.

**Step 1: Audit imports that reference app-specific files**

Search for imports in `packages/ui/src/` that reference files NOT in the package:
- `@/config/*` → app-specific configs (navigation, etc.)
- `@/lib/schemas*` → app-specific Zod schemas
- `@/lib/actions/*` → server actions
- `@/lib/db*` → Prisma
- `@/lib/mock-data/*` → mock data
- `@/lib/sample-data` → sample data
- `@/lib/linear-data` → linear data
- `@/lib/shiki` → code highlighting (docs only)

Run: `grep -r 'from "@/config' packages/ui/src/ | head -20`
Run: `grep -r 'from "@/lib/schemas' packages/ui/src/ | head -20`
Run: `grep -r 'from "@/lib/actions' packages/ui/src/ | head -20`
Run: `grep -r 'from "@/lib/db' packages/ui/src/ | head -20`

**Step 2: Fix layout components that import config**

Files like `app-sidebar.tsx` import `@/config/navigation`. These layout components need to accept config as props instead of importing directly. Refactor:

- `app-sidebar.tsx`: Accept `sidebarConfig` as prop instead of importing from `@/config/navigation`
- `app-top-bar.tsx`: Same pattern — accept navigation config as prop
- `components-sidebar.tsx`: Accept config as prop

This is the main refactoring needed — make layout components configurable rather than hardcoded to specific configs.

**Step 3: Fix any remaining broken imports**

For each file with a broken import, either:
1. Move the dependency into the package (if it's generic)
2. Remove the import and accept it as a prop (if it's app-specific)
3. Create a type-only export if only types are needed

**Step 4: Verify TypeScript compiles**

Run: `cd packages/ui && pnpm tsc --noEmit`

Fix any remaining type errors.

**Step 5: Commit**

```bash
git add packages/ui/
git commit -m "refactor: rewrite imports inside @blazz/ui package"
```

---

## Task 5: Create Barrel Exports for @blazz/ui

**Files:**
- Create: `packages/ui/src/index.ts`

**Step 1: Create the main barrel export**

This file re-exports everything consumers need. Group by category:

```typescript
// packages/ui/src/index.ts

// ── UI Primitives ──────────────────────────────
export * from "./components/ui/alert"
export * from "./components/ui/avatar"
export * from "./components/ui/badge"
export * from "./components/ui/banner"
export * from "./components/ui/bleed"
export * from "./components/ui/block-stack"
export * from "./components/ui/box"
export * from "./components/ui/breadcrumb"
export * from "./components/ui/button"
export * from "./components/ui/button-group"
export * from "./components/ui/calendar"
export * from "./components/ui/card"
export * from "./components/ui/carousel"
export * from "./components/ui/chart"
export * from "./components/ui/checkbox"
export * from "./components/ui/collapsible"
export * from "./components/ui/combobox"
export * from "./components/ui/command"
export * from "./components/ui/confirmation-dialog"
export * from "./components/ui/date-selector"
export * from "./components/ui/dialog"
export * from "./components/ui/divider"
export * from "./components/ui/dropdown-menu"
export * from "./components/ui/empty"
export * from "./components/ui/field"
export * from "./components/ui/filters"
export * from "./components/ui/frame-panel"
export * from "./components/ui/grid"
export * from "./components/ui/hover-card"
export * from "./components/ui/input"
export * from "./components/ui/input-group"
export * from "./components/ui/inline-grid"
export * from "./components/ui/inline-stack"
export * from "./components/ui/label"
export * from "./components/ui/menu"
export * from "./components/ui/menubar"
export * from "./components/ui/nav-menu"
export * from "./components/ui/page"
export * from "./components/ui/phone-input"
export * from "./components/ui/popover"
export * from "./components/ui/progress"
export * from "./components/ui/property"
export * from "./components/ui/scroll-area"
export * from "./components/ui/select"
export * from "./components/ui/separator"
export * from "./components/ui/sheet"
export * from "./components/ui/sidebar"
export * from "./components/ui/skeleton"
export * from "./components/ui/spinner"
export * from "./components/ui/switch"
export * from "./components/ui/table"
export * from "./components/ui/tabs"
export * from "./components/ui/tags-input"
export * from "./components/ui/text"
export * from "./components/ui/textarea"
export * from "./components/ui/tooltip"

// ── Block Components ───────────────────────────
export * from "./components/blocks/activity-timeline"
export * from "./components/blocks/bulk-action-bar"
export * from "./components/blocks/chart-card"
export * from "./components/blocks/data-grid"
export * from "./components/blocks/deal-lines-editor"
export * from "./components/blocks/detail-panel"
export * from "./components/blocks/error-state"
export * from "./components/blocks/field-grid"
export * from "./components/blocks/filter-bar"
export * from "./components/blocks/form-field"
export * from "./components/blocks/form-section"
export * from "./components/blocks/forecast-chart"
export * from "./components/blocks/funnel-chart"
export * from "./components/blocks/inline-edit"
export * from "./components/blocks/kanban-board"
export * from "./components/blocks/multi-step-form"
export * from "./components/blocks/notification-center"
export * from "./components/blocks/org-menu"
export * from "./components/blocks/page-header"
export * from "./components/blocks/property-card"
export * from "./components/blocks/quick-log-activity"
export * from "./components/blocks/quote-preview"
export * from "./components/blocks/split-view"
export * from "./components/blocks/stats-grid"
export * from "./components/blocks/stats-strip"
export * from "./components/blocks/status-flow"

// ── AI Components ──────────────────────────────
export * from "./components/ai/index"

// ── Features ───────────────────────────────────
export * from "./components/features/data-table/data-table"
export * from "./components/features/command-palette/command-palette"
export * from "./components/features/image-upload/image-upload"
export * from "./components/features/image-upload/image-preview"
export * from "./components/features/navigation-tabs/navigation-tabs-bar"
export * from "./components/features/navigation-tabs/navigation-tabs-provider"
export * from "./components/features/navigation-tabs/navigation-tabs-item"
export * from "./components/features/navigation-tabs/navigation-tabs-interceptor"

// ── Layout ─────────────────────────────────────
export * from "./components/layout/app-frame"
export * from "./components/layout/app-sidebar"
export * from "./components/layout/app-top-bar"
export * from "./components/layout/frame"
export * from "./components/layout/layout-frame"
export * from "./components/layout/layout-top-bar"
export * from "./components/layout/mobile-sidebar-sheet"
export * from "./components/layout/nav-tabs"
export * from "./components/layout/navbar"
export * from "./components/layout/dashboard-layout"
export * from "./components/layout/notification-sheet"
export * from "./components/layout/page-header"
export * from "./components/layout/sidebar-exports"
export * from "./components/layout/sidebar-search"
export * from "./components/layout/sidebar-user"
export * from "./components/layout/theme-palette-switcher"
export * from "./components/layout/theme-toggle"
export * from "./components/layout/top-bar"
export * from "./components/layout/user-menu"

// ── Hooks ──────────────────────────────────────
export * from "./hooks/use-block-navigation"
export * from "./hooks/use-command-palette"
export * from "./hooks/use-data-table-url-state"
export * from "./hooks/use-data-table-views"
export * from "./hooks/use-debounced"
export * from "./hooks/use-navigation-with-params"

// ── Utilities ──────────────────────────────────
export { cn } from "./lib/utils"
export * from "./lib/theme-context"
export * from "./lib/use-frame-layout"
export * from "./lib/tab-utils"

// ── Types ──────────────────────────────────────
export * from "./types/navigation"
```

**Step 2: Verify barrel compiles**

Run: `cd packages/ui && pnpm tsc --noEmit`

**Step 3: Test tsup build**

Run: `cd packages/ui && pnpm build`

Expected: `dist/` directory created with `index.js` and `index.d.ts`

**Step 4: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat: create barrel exports for @blazz/ui"
```

---

## Task 6: Create apps/docs Workspace

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/tsconfig.json`
- Create: `apps/docs/next.config.mjs`
- Move: `app/(docs)/` → `apps/docs/app/(docs)/`
- Move: `app/playground/` → `apps/docs/app/playground/`
- Move: `app/page.tsx` → `apps/docs/app/page.tsx` (landing)
- Move: `app/layout.tsx` → `apps/docs/app/layout.tsx`
- Move: `app/globals.css` → `apps/docs/app/globals.css` (modified — imports tokens from @blazz/ui)
- Move: `app/thumbnail/` → `apps/docs/app/thumbnail/`
- Move: `components/features/docs/` → `apps/docs/components/docs/`
- Move: `components/features/playground/` → `apps/docs/components/playground/`
- Move: `components/thumbnails/` → `apps/docs/components/thumbnails/`
- Move: `components/landing/` → `apps/docs/components/landing/`
- Move: `config/navigation.ts` → `apps/docs/config/navigation.ts`
- Move: `config/components-navigation.ts` → `apps/docs/config/components-navigation.ts`
- Move: `config/thumbnail-registry.ts` → `apps/docs/config/thumbnail-registry.ts`
- Move: `config/app.config.ts` → `apps/docs/config/app.config.ts`
- Move: `lib/shiki.ts` → `apps/docs/lib/shiki.ts`
- Move: `scripts/generate-thumbnails.ts` → `apps/docs/scripts/generate-thumbnails.ts`
- Move: `public/` → `apps/docs/public/` (static assets for docs)

**Step 1: Create apps/docs/package.json**

```json
{
  "name": "docs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3100",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@blazz/ui": "workspace:*",
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "next-themes": "^0.4.6",
    "shiki": "^3.22.0",
    "streamdown": "^2.3.0",
    "@streamdown/cjk": "^1.0.2",
    "@streamdown/code": "^1.0.3",
    "@streamdown/math": "^1.0.2",
    "@streamdown/mermaid": "^1.0.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

**Step 2: Create apps/docs/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@blazz/ui": ["../../packages/ui/src"],
      "@blazz/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 3: Create apps/docs/next.config.mjs**

```javascript
/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["@blazz/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default config
```

**Step 4: Create apps/docs/postcss.config.mjs**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
```

**Step 5: Move route files**

```bash
# Create app structure
mkdir -p apps/docs/app

# Move docs routes
cp -r app/\(docs\)/ apps/docs/app/\(docs\)/

# Move playground
cp -r app/playground/ apps/docs/app/playground/ 2>/dev/null || true

# Move thumbnail route
cp -r app/thumbnail/ apps/docs/app/thumbnail/ 2>/dev/null || true

# Copy root layout and page (landing)
cp app/layout.tsx apps/docs/app/layout.tsx
cp app/page.tsx apps/docs/app/page.tsx
```

**Step 6: Move docs-specific components**

```bash
mkdir -p apps/docs/components/{docs,playground,thumbnails,landing}
mkdir -p apps/docs/{config,lib,scripts}

cp -r components/features/docs/* apps/docs/components/docs/
cp -r components/features/playground/* apps/docs/components/playground/
cp -r components/thumbnails/* apps/docs/components/thumbnails/
cp -r components/landing/* apps/docs/components/landing/

cp config/navigation.ts apps/docs/config/
cp config/components-navigation.ts apps/docs/config/
cp config/thumbnail-registry.ts apps/docs/config/
cp config/app.config.ts apps/docs/config/

cp lib/shiki.ts apps/docs/lib/

# Public assets
cp -r public/ apps/docs/public/
```

**Step 7: Create apps/docs/app/globals.css**

This file imports tokens from the package and adds app-specific source scanning:

```css
@import "tailwindcss";
@import "@blazz/ui/styles/tokens.css";

@source "../app/**/*.{js,ts,jsx,tsx}";
@source "../components/**/*.{js,ts,jsx,tsx}";
@source "../../packages/ui/src/**/*.{js,ts,jsx,tsx}";
@source "../node_modules/streamdown/dist/*.js";

@custom-variant dark (&:is(.dark *));
```

**Step 8: Rewrite imports in docs files**

All `@/components/ui/*`, `@/components/blocks/*`, `@/components/ai/*`, `@/components/layout/*`, `@/components/features/data-table/*` imports in docs pages → replace with `@blazz/ui` imports.

Pattern:
- `import { Button } from "@/components/ui/button"` → `import { Button } from "@blazz/ui"`
  OR keep granular: `import { Button } from "@blazz/ui/components/ui/button"` (depending on exports strategy)
- `import { cn } from "@/lib/utils"` → `import { cn } from "@blazz/ui"`
- `@/components/features/docs/*` → `@/components/docs/*` (local to docs app)
- `@/config/navigation` → `@/config/navigation` (local to docs app)

**Step 9: Verify docs app starts**

Run: `pnpm dev --filter=docs`

Expected: Dev server starts on port 3100, doc pages render correctly.

**Step 10: Commit**

```bash
git add apps/docs/
git commit -m "feat: create apps/docs workspace with doc routes and components"
```

---

## Task 7: Create apps/examples Workspace

**Files:**
- Create: `apps/examples/package.json`
- Create: `apps/examples/tsconfig.json`
- Create: `apps/examples/next.config.mjs`
- Move: `app/(examples)/` → `apps/examples/app/(examples)/` (or flatten to route groups)
- Move: `app/(auth)/` → `apps/examples/app/(auth)/`
- Move: `app/(stockbase)/` → `apps/examples/app/(stockbase)/`
- Move: `app/(talentflow)/` → `apps/examples/app/(talentflow)/`
- Move: `app/api/` → `apps/examples/app/api/`
- Move: `app/print/` → `apps/examples/app/print/`
- Move: `components/features/data-table/presets/` → `apps/examples/components/data-table-presets/`
- Move: `components/features/user-management/` → `apps/examples/components/user-management/`
- Move: `prisma/` → `apps/examples/prisma/`
- Move: `lib/db.ts` → `apps/examples/lib/db.ts`
- Move: `lib/actions/` → `apps/examples/lib/actions/`
- Move: `lib/schemas/` → `apps/examples/lib/schemas/`
- Move: `lib/schemas.ts` → `apps/examples/lib/schemas.ts`
- Move: `lib/mock-data/` → `apps/examples/lib/mock-data/`
- Move: `lib/generated/` → `apps/examples/lib/generated/`
- Move: `lib/sample-data.ts` → `apps/examples/lib/sample-data.ts`
- Move: `lib/linear-data.ts` → `apps/examples/lib/linear-data.ts`
- Move: `lib/stockbase-data.ts` → `apps/examples/lib/stockbase-data.ts`
- Move: `lib/talentflow-data.ts` → `apps/examples/lib/talentflow-data.ts`
- Move: `config/crm-navigation.ts` → `apps/examples/config/crm-navigation.ts`
- Move: `config/stockbase-navigation.ts` → `apps/examples/config/stockbase-navigation.ts`
- Move: `config/talentflow-navigation.ts` → `apps/examples/config/talentflow-navigation.ts`
- Move: `hooks/use-session.ts` → `apps/examples/hooks/use-session.ts`
- Move: `hooks/use-csrf.ts` → `apps/examples/hooks/use-csrf.ts`
- Move: `types/product.ts` → `apps/examples/types/product.ts`
- Move: `types/user-management.ts` → `apps/examples/types/user-management.ts`

**Step 1: Create apps/examples/package.json**

```json
{
  "name": "examples",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 3200",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@blazz/ui": "workspace:*",
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "next-themes": "^0.4.6",
    "zod": "^4.3.5",
    "@hookform/resolvers": "^5.2.2",
    "react-hook-form": "^7.71.1",
    "sonner": "^2.0.7",
    "nanoid": "^5.1.6",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@prisma/client": "^7.4.0",
    "prisma": "^7.4.0",
    "@faker-js/faker": "^10.2.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4"
  }
}
```

**Step 2: Create apps/examples/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@blazz/ui": ["../../packages/ui/src"],
      "@blazz/ui/*": ["../../packages/ui/src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 3: Create apps/examples/next.config.mjs**

```javascript
/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["@blazz/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default config
```

**Step 4: Create apps/examples/postcss.config.mjs**

Same as docs.

**Step 5: Move route files**

```bash
mkdir -p apps/examples/app

# Move example route groups
cp -r app/\(examples\)/ apps/examples/app/\(examples\)/ 2>/dev/null || true
cp -r app/\(auth\)/ apps/examples/app/\(auth\)/ 2>/dev/null || true
cp -r app/\(stockbase\)/ apps/examples/app/\(stockbase\)/ 2>/dev/null || true
cp -r app/\(talentflow\)/ apps/examples/app/\(talentflow\)/ 2>/dev/null || true
cp -r app/api/ apps/examples/app/api/ 2>/dev/null || true
cp -r app/print/ apps/examples/app/print/ 2>/dev/null || true

# Create layout for examples app
# (will need its own layout.tsx similar to root layout)
```

**Step 6: Move app-specific components and data**

```bash
mkdir -p apps/examples/components/{data-table-presets,user-management}
mkdir -p apps/examples/{config,hooks,types}
mkdir -p apps/examples/lib/{actions,schemas,mock-data,generated}
mkdir -p apps/examples/prisma

# Data-table presets
cp -r components/features/data-table/presets/* apps/examples/components/data-table-presets/

# User management
cp -r components/features/user-management/* apps/examples/components/user-management/

# Prisma
cp -r prisma/* apps/examples/prisma/

# Lib files
cp lib/db.ts apps/examples/lib/
cp lib/schemas.ts apps/examples/lib/
cp lib/sample-data.ts apps/examples/lib/
cp lib/linear-data.ts apps/examples/lib/
cp lib/stockbase-data.ts apps/examples/lib/
cp lib/talentflow-data.ts apps/examples/lib/
cp -r lib/actions/* apps/examples/lib/actions/ 2>/dev/null || true
cp -r lib/schemas/* apps/examples/lib/schemas/ 2>/dev/null || true
cp -r lib/mock-data/* apps/examples/lib/mock-data/ 2>/dev/null || true
cp -r lib/generated/* apps/examples/lib/generated/ 2>/dev/null || true

# Hooks
cp hooks/use-session.ts apps/examples/hooks/
cp hooks/use-csrf.ts apps/examples/hooks/

# Types
cp types/product.ts apps/examples/types/
cp types/user-management.ts apps/examples/types/

# Config
cp config/crm-navigation.ts apps/examples/config/
cp config/stockbase-navigation.ts apps/examples/config/
cp config/talentflow-navigation.ts apps/examples/config/
```

**Step 7: Create apps/examples/app/globals.css**

```css
@import "tailwindcss";
@import "@blazz/ui/styles/tokens.css";

@source "../app/**/*.{js,ts,jsx,tsx}";
@source "../components/**/*.{js,ts,jsx,tsx}";
@source "../../packages/ui/src/**/*.{js,ts,jsx,tsx}";

@custom-variant dark (&:is(.dark *));
```

**Step 8: Create apps/examples/app/layout.tsx**

```tsx
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { ThemePaletteProvider } from "@blazz/ui"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blazz UI Examples",
  description: "CRM, StockBase, TalentFlow demo apps powered by @blazz/ui",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ThemePaletteProvider>
            {children}
          </ThemePaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 9: Rewrite imports in examples files**

Same pattern as docs:
- `@/components/ui/*` → `@blazz/ui` or `@blazz/ui/components/ui/*`
- `@/components/blocks/*` → `@blazz/ui`
- `@/components/layout/*` → `@blazz/ui`
- `@/lib/utils` → `@blazz/ui`
- App-local files: keep `@/` (maps to `apps/examples/`)

**Step 10: Verify examples app starts**

Run: `pnpm dev --filter=examples`

Expected: Dev server starts on port 3200, CRM pages render.

**Step 11: Commit**

```bash
git add apps/examples/
git commit -m "feat: create apps/examples workspace with CRM, StockBase, TalentFlow"
```

---

## Task 8: Setup Changesets

**Files:**
- Create: `.changeset/config.json`

**Step 1: Install changesets**

Run: `pnpm add -Dw @changesets/cli`

**Step 2: Initialize changesets**

Run: `pnpm changeset init`

**Step 3: Configure .changeset/config.json**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["docs", "examples"]
}
```

`"access": "restricted"` = npm private scope.
`"ignore"` = don't version the apps, only `@blazz/ui`.

**Step 4: Add publish script to root package.json**

Add to root `package.json` scripts:
```json
{
  "changeset": "changeset",
  "version-packages": "changeset version",
  "release": "turbo build --filter=@blazz/ui && changeset publish"
}
```

**Step 5: Commit**

```bash
git add .changeset/ package.json
git commit -m "chore: setup Changesets for @blazz/ui versioning"
```

---

## Task 9: Cleanup and Validation

**Step 1: Delete old files from root**

Once both apps are working, remove the original files that were copied (not moved) to their new locations:

```bash
# Remove old component directories (now in packages/ui or apps/)
rm -rf components/
rm -rf hooks/
rm -rf types/

# Remove old app routes (now in apps/docs and apps/examples)
rm -rf app/

# Remove old lib files (split between packages/ui and apps/examples)
rm -rf lib/

# Remove old config (split between apps)
rm -rf config/

# Remove pro-ui-kit (replaced by packages/ui)
rm -rf pro-ui-kit/

# Remove old Next.js config (each app has its own)
rm -f next.config.mjs
rm -f postcss.config.mjs
rm -f tailwind.config.ts

# Remove old tsconfig (replaced by tsconfig.base.json + per-package configs)
rm -f tsconfig.json

# Keep at root: turbo.json, pnpm-workspace.yaml, tsconfig.base.json, biome.json, package.json
# Keep at root: .storybook/, stories/, tests/ (decide later)
# Keep at root: prisma.config.ts (if needed by apps/examples)
# Keep at root: ai/ documentation
# Keep at root: docs/ plans and documentation
```

**Step 2: Update CLAUDE.md**

Update the architecture section to reflect the monorepo structure.

**Step 3: Run full build**

Run: `turbo build`

Expected: All packages and apps build successfully.

**Step 4: Run lint**

Run: `turbo lint`

Fix any remaining issues.

**Step 5: Verify dev servers**

Run: `turbo dev`

Expected: Both apps start on their respective ports.

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: cleanup old root files after monorepo migration"
```

---

## Post-Migration Notes

### Publishing @blazz/ui to npm

```bash
pnpm changeset          # Create a changeset describing the change
pnpm version-packages   # Bump version + update changelog
pnpm release            # Build + publish to npm
```

### Adding new components

1. Create component in `packages/ui/src/components/`
2. Add export to `packages/ui/src/index.ts`
3. Run `pnpm dev` — apps see the change immediately via `workspace:*`

### Future extraction of apps/web (landing)

When ready:
1. `mkdir apps/web`
2. Move `apps/docs/components/landing/` → `apps/web/components/`
3. Move landing route from `apps/docs/app/page.tsx` → `apps/web/app/page.tsx`
4. Create `apps/web/package.json` with `@blazz/ui` dependency
