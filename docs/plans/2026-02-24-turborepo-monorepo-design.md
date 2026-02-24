# Turborepo Monorepo Migration — Design

**Date:** 2026-02-24
**Status:** Validated
**Timing:** Plan now, execute in coming days

## Context

The Blazz UI Kit project is a single Next.js app with 5+ route groups, ~41k LOC of components, 3 demo apps (CRM, StockBase, TalentFlow), documentation, a playground, and a landing page. A separate `pro-ui-kit/` directory duplicates components for a future npm package.

### Pain points

1. **Publishing the UI kit** — no clean way to publish `@blazz/ui` as an npm package
2. **Separation of concerns** — docs, examples, kit, and landing are all mixed
3. **Independent deployment** — can't deploy docs and examples separately

## Decision: Turborepo monorepo (Approach A revised)

### Structure

```
blazz/
├── packages/
│   └── ui/                          ← @blazz/ui (npm private scope)
│       ├── components/
│       │   ├── ui/                  ← 48+ primitives (button, input, dialog...)
│       │   ├── blocks/              ← 23 business blocks (DataGrid, KanbanBoard...)
│       │   ├── ai/                  ← AI/generative (chat, reasoning, tools)
│       │   ├── features/            ← advanced composites
│       │   │   ├── data-table/      ← TanStack Table (generic, NO CRM presets)
│       │   │   ├── command-palette/ ← cmdk-based search
│       │   │   ├── image-upload/    ← dropzone file upload
│       │   │   └── navigation-tabs/ ← tabs component
│       │   └── layout/              ← reusable layout shells
│       │       ├── app-frame.tsx
│       │       ├── sidebar-nav.tsx
│       │       └── top-bar.tsx
│       ├── hooks/
│       ├── lib/                     ← utilities (cn, formatters)
│       ├── styles/globals.css       ← 25 oklch design tokens
│       ├── types/
│       ├── tsup.config.ts           ← ESM build (for npm publish only)
│       └── package.json
├── apps/
│   ├── docs/                        ← Documentation + playground + landing
│   │   ├── app/(docs)/              ← 39+ component doc pages
│   │   ├── app/playground/          ← token editor
│   │   ├── app/page.tsx             ← landing page (for now)
│   │   ├── components/              ← docs-specific (thumbnails, playground editor)
│   │   ├── config/                  ← navigation.ts, components-navigation.ts, thumbnail-registry.ts
│   │   └── package.json
│   └── examples/                    ← CRM, StockBase, TalentFlow demos
│       ├── app/(crm)/
│       ├── app/(stockbase)/
│       ├── app/(talentflow)/
│       ├── app/(auth)/
│       ├── components/              ← app-specific (user-management, CRM presets)
│       ├── prisma/                  ← DB schema + client
│       ├── lib/
│       │   ├── actions/             ← server actions
│       │   ├── schemas/             ← Zod schemas
│       │   └── mock-data/
│       ├── config/                  ← crm-navigation.ts, stockbase-navigation.ts, talentflow-navigation.ts
│       └── package.json
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json               ← shared TS config
├── biome.json                        ← shared lint/format
└── package.json                      ← root scripts
```

## Key decisions

### 1. Package contents

**In `@blazz/ui`:**
- `components/ui/` — all primitives
- `components/blocks/` — all business blocks
- `components/ai/` — AI/generative components
- `components/features/` — data-table (generic), command-palette, image-upload, navigation-tabs
- `components/layout/` — reusable layout shells (app-frame, sidebar-nav, top-bar)
- `hooks/`, `lib/utils`, `types/`, `styles/`

**NOT in `@blazz/ui`:**
- CRM data-table presets (contacts-columns, deals-columns) → `apps/examples`
- Docs components (thumbnails, component cards) → `apps/docs`
- Playground editor → `apps/docs`
- User management components → `apps/examples`
- Prisma, server actions, mock data → `apps/examples`
- Landing page components → `apps/docs` (for now)

### 2. Versioning strategy

- **Internal consumption:** `workspace:*` protocol — apps see changes instantly in dev, no publish cycle needed
- **npm publish:** Changesets for automated version bumps, changelogs, and npm publishing
- **Exports:** Explicit barrel files, NOT wildcards

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./button": "./src/components/ui/button.tsx",
    "./data-table": "./src/components/features/data-table/index.ts",
    "./styles": "./styles/globals.css"
  }
}
```

### 3. Tailwind v4 strategy

**Problem:** Tailwind v4 scans source files for class names. tsup compiles to JS, losing class information.

**Solution:** Dual strategy
- **Internal (dev/build):** `transpilePackages: ["@blazz/ui"]` in Next.js config. Apps consume TypeScript source directly. Tailwind scans source via `@source`.
- **npm publish:** tsup builds to ESM. Source files included in package for Tailwind scanning.

```css
/* apps/docs/app/globals.css */
@import "@blazz/ui/styles";
@import "tailwindcss";
@source "../../packages/ui";
```

### 4. Turborepo pipeline

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

### 5. Root scripts

```json
{
  "scripts": {
    "dev": "turbo dev",
    "dev:docs": "turbo dev --filter=docs",
    "dev:examples": "turbo dev --filter=examples",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "type-check": "turbo type-check"
  }
}
```

### 6. Landing page

Stays in `apps/docs` as a route for now. Can be extracted to `apps/web` later when marketing needs diverge from docs.

### 7. Prisma

Lives in `apps/examples` only. No `packages/db` — YAGNI.

### 8. Storybook

Decision deferred. Can stay at root or move to `packages/ui` later.

## Migration plan (6 steps)

### Step 1: Scaffold monorepo
- Create `turbo.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`
- Create workspace directories: `packages/ui`, `apps/docs`, `apps/examples`
- Initialize `package.json` for each workspace
- Validate `pnpm install` works

### Step 2: Extract `@blazz/ui`
- Move `components/ui/`, `components/blocks/`, `components/ai/` → `packages/ui/components/`
- Move `components/features/data-table/`, `command-palette/`, `image-upload/`, `navigation-tabs/`
- Move `components/layout/app-frame.tsx`, `sidebar-nav.tsx`, `top-bar.tsx`
- Move reusable hooks, lib/utils, types
- Extract design tokens to `packages/ui/styles/globals.css`
- Setup tsup config
- Create barrel exports
- Validate package compiles

### Step 3: Migrate `apps/docs`
- Move route group `(docs)` pages
- Move `components/features/docs/`, `components/features/playground/`
- Move `components/thumbnails/`, `components/landing/`
- Move playground route
- Move landing page (root page.tsx)
- Move relevant configs: `navigation.ts`, `components-navigation.ts`, `thumbnail-registry.ts`
- Setup `next.config` with `transpilePackages`
- Adjust all imports to `@blazz/ui`
- Validate `pnpm dev --filter=docs`

### Step 4: Migrate `apps/examples`
- Move route groups `(crm)`, `(stockbase)`, `(talentflow)`, `(auth)`
- Move Prisma schema, db client, server actions, Zod schemas, mock data
- Move `components/features/user-management/`
- Move CRM data-table presets
- Move relevant configs: `crm-navigation.ts`, `stockbase-navigation.ts`, `talentflow-navigation.ts`
- Setup `next.config` with `transpilePackages`
- Adjust all imports to `@blazz/ui`
- Validate `pnpm dev --filter=examples`

### Step 5: Setup Changesets
- Install `@changesets/cli`
- Configure `.changeset/config.json`
- Add publish workflow

### Step 6: Cleanup
- Delete `pro-ui-kit/` directory (replaced by `packages/ui`)
- Remove orphan files at root
- Update `CLAUDE.md`, `README.md`
- Update CI/CD if any
- Run full `turbo build` to validate everything
- Commit

## Risks

| Risk | Mitigation |
|---|---|
| Import breakage (200+ files) | Migrate one app at a time, validate at each step |
| Tailwind class scanning | Use `@source` + `transpilePackages`, test both dev and build |
| Dev server slowdown | Turbopack handles monorepo well, `--filter` for single app |
| Overhead for solo dev | Only 2 apps (docs + examples) + 1 package — manageable |
| Path alias changes | `@/*` becomes `@blazz/ui` for kit imports, keep `@/*` for app-local |

## What this does NOT include

- Separate `apps/web` for landing (deferred)
- `packages/db` for Prisma (YAGNI)
- `packages/config` for shared configs (root is enough)
- Remote caching (setup when deploying to Vercel)
- CI/CD pipeline changes (no CI yet)
