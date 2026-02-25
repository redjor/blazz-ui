# Pro UI Kit — Contexte projet

## Pitch
Kit de composants React/Next.js AI-native pour apps pro data-heavy.
Cible : Lead Techs qui veulent vibe coder des apps internes au lieu
de payer Salesforce/SAP.

## Architecture — Turborepo Monorepo

```
blazz/
├── packages/ui/              ← @blazz/ui (npm package)
│   ├── src/components/ui/    ← 70+ primitives (button, input, dialog...)
│   ├── src/components/blocks/ ← 27 business blocks (DataGrid, KanbanBoard...)
│   ├── src/components/ai/    ← AI/generative (chat, reasoning, tools)
│   ├── src/components/features/ ← data-table, command-palette, image-upload, navigation-tabs
│   ├── src/components/layout/ ← reusable layout shells (frame, sidebar, top-bar)
│   ├── src/hooks/            ← reusable hooks
│   ├── src/lib/              ← utilities (cn, theme-context, formatters)
│   ├── src/types/            ← shared types
│   ├── styles/tokens.css     ← 25 oklch design tokens
│   └── src/index.ts          ← barrel exports
├── apps/docs/                ← Documentation + playground + landing
│   ├── app/(docs)/           ← 39+ component doc pages
│   ├── app/playground/       ← token editor
│   ├── components/           ← docs-specific (thumbnails, playground, landing)
│   └── config/               ← navigation, components-navigation
├── apps/examples/            ← CRM, StockBase, TalentFlow demos
│   ├── app/(examples)/       ← CRM routes
│   ├── app/(stockbase)/      ← StockBase routes
│   ├── app/(talentflow)/     ← TalentFlow routes
│   ├── components/           ← data-table presets, user-management
│   ├── prisma/               ← DB schema + client
│   └── lib/                  ← actions, schemas, mock data
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── biome.json
```

## Stack
Next.js 16, React 19, TypeScript strict, Tailwind v4, shadcn/ui,
react-hook-form + zod, TanStack Table, @dnd-kit, Recharts,
Prisma + PostgreSQL, Biome (lint/format), Turborepo, pnpm workspaces,
tsup (ESM build), Changesets (versioning)

## Key Commands
- `pnpm dev` → Start all apps
- `pnpm dev:docs` → Docs app only (port 3100)
- `pnpm dev:examples` → Examples app only (port 3200)
- `pnpm build` → Build all
- `pnpm lint` → Lint all

## Conventions
- Kit components import: `@blazz/ui/components/ui/button`
- App-local imports: `@/` (maps to each app root)
- Lire ai/rules.md avant de coder
- Server Components par défaut, Client uniquement pour interactivité
- Formulaires = react-hook-form + zod TOUJOURS
- 4 états obligatoires : loading (Skeleton), empty, error, success

## Priorité actuelle
Phase 3 : Stabiliser le monorepo, publier @blazz/ui sur npm
