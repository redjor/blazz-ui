# Pro UI Kit — Contexte projet

## Pitch
Kit de composants React/Next.js AI-native pour apps pro data-heavy.
Cible : Lead Techs qui veulent vibe coder des apps internes au lieu
de payer Salesforce/SAP.

## Architecture — Turborepo Monorepo

```
blazz/
├── packages/ui/              ← @blazz/ui (open-source, npm package)
│   ├── src/components/ui/    ← 70+ primitives (button, input, dialog...)
│   ├── src/components/patterns/ ← 35+ compositions (app-frame, form-field, page-header-shell...)
│   ├── src/hooks/            ← reusable hooks (use-command-palette, use-debounced...)
│   ├── src/lib/              ← utilities (cn, theme-context, formatters)
│   ├── src/types/            ← shared types
│   ├── styles/tokens.css     ← 25 oklch design tokens
│   └── src/index.ts          ← barrel exports
├── packages/pro/             ← @blazz/pro (paid, npm package)
│   ├── src/components/blocks/ ← 30+ business blocks (data-table, kanban-board, charts...)
│   ├── src/components/ai/    ← 50+ AI/generative (chat, reasoning, tools, generative)
│   ├── src/hooks/            ← pro hooks (use-data-table-url-state, use-data-table-views...)
│   ├── src/lib/              ← license system (license-context, with-pro-guard)
│   └── src/index.ts          ← barrel exports (blocks + hooks + lib, NOT ai)
├── apps/docs/                ← Documentation + playground + landing
│   ├── src/routes/_docs/     ← component doc pages
│   ├── src/components/       ← docs-specific (thumbnails, playground, landing)
│   └── src/config/           ← navigation, components-navigation
├── apps/examples/            ← CRM, StockBase, TalentFlow demos
│   ├── app/(examples)/       ← CRM routes
│   ├── app/(stockbase)/      ← StockBase routes
│   ├── app/(talentflow)/     ← TalentFlow routes
│   ├── components/           ← data-table presets, user-management
│   ├── prisma/               ← DB schema + client
│   └── lib/                  ← actions, schemas, mock data
├── apps/ops/                 ← Personal freelance app (time tracking, invoicing)
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── biome.json
```

## Two-package split

- **`@blazz/ui`** — Open-source. UI primitives (`components/ui/`) + patterns (`components/patterns/`).
- **`@blazz/pro`** — Paid. Blocks (`components/blocks/`) + AI (`components/ai/`) + license system.
- `@blazz/pro` declares `@blazz/ui` as `peerDependency`. Dependency is one-way: pro → ui (never reverse).
- AI components are NOT in the `@blazz/pro` barrel (naming conflicts) — import directly: `@blazz/pro/components/ai/chat`

### Import paths

```tsx
// UI primitives (open-source)
import { Button } from "@blazz/ui/components/ui/button"
import { Button, Input, Dialog } from "@blazz/ui"

// Patterns (open-source)
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"

// Blocks (pro)
import { DataTable, col } from "@blazz/pro/components/blocks/data-table"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { KanbanBoard } from "@blazz/pro/components/blocks/kanban-board"

// AI components (pro, direct import only)
import { ChatMessage } from "@blazz/pro/components/ai/chat"

// License (pro)
import { BlazzProvider } from "@blazz/pro"
```

## Stack
Next.js 16, React 19, TypeScript strict, Tailwind v4, shadcn/ui,
react-hook-form + zod, TanStack Table, @dnd-kit, Recharts,
Prisma + PostgreSQL, Biome (lint/format), Turborepo, pnpm workspaces,
tsup (ESM build), Changesets (versioning)

## Key Commands
- `pnpm dev` → Start all apps
- `pnpm dev:docs` → Docs app only (port 3100)
- `pnpm dev:examples` → Examples app only (port 3110)
- `pnpm build` → Build all
- `pnpm lint` → Lint all

## Conventions
- UI primitives: `@blazz/ui/components/ui/button`
- Blocks/AI: `@blazz/pro/components/blocks/data-table`
- App-local imports: `@/` (maps to each app root)
- Lire ai/rules.md avant de coder
- Server Components par défaut, Client uniquement pour interactivité
- Formulaires = react-hook-form + zod TOUJOURS
- 4 états obligatoires : loading (Skeleton), empty, error, success
- `packages/ui/AI.md` — composants @blazz/ui + @blazz/pro avec gotchas et exemples canoniques. A lire avant de generer du code UI.

## Regle critique — Ne pas toucher aux packages
**Si la tache concerne une app specifique** (`apps/ops`, `apps/examples`, `apps/docs`, etc.),
**ne jamais modifier `packages/ui/` ou `packages/pro/`** sauf si explicitement demande.
Travailler uniquement dans le repertoire de l'app concernee.
Les modifications des packages impactent toutes les apps et les packages npm publies.

## Priorite actuelle
Phase 3 : Stabiliser le monorepo, publier @blazz/ui + @blazz/pro sur npm
