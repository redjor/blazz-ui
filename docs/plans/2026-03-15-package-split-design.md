# Package Split Design — @blazz/ui + @blazz/pro

**Date:** 2026-03-15
**Status:** Approved

## Objectif

Séparer `@blazz/ui` en deux packages :
- **`@blazz/ui`** — open-source, npm public, primitives UI + patterns (105 composants)
- **`@blazz/pro`** — payant, npm privé, blocks + AI (101 composants)

## Stratégie commerciale

- `@blazz/ui` gratuit = acquisition (attirer les devs, crédibilité open-source)
- `@blazz/pro` payant = monétisation (valeur ajoutée enterprise : data-table, charts, kanban, AI)
- Distribution pro via npm org `@blazz` avec restricted access (token npm pour clients payants)

## Décisions validées

| Décision | Choix |
|----------|-------|
| Frontière gratuit/payant | ui/ + patterns/ (gratuit) vs blocks/ + ai/ (payant) |
| Naming | `@blazz/ui` + `@blazz/pro` |
| Protection pro | Registry npm privé |
| Structure repo | Monorepo unique (packages/ui + packages/pro) |
| Deps pro | Split strict — chaque package n'embarque que ses deps |
| Import pro → ui | peerDependency `@blazz/ui`, import depuis barrel |
| Presets data-table | Virés du package, refaits plus tard |

## Structure cible

```
packages/
├── ui/                          ← @blazz/ui (npm public)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              ← 80 primitives
│   │   │   └── patterns/        ← 25 patterns
│   │   ├── hooks/               ← use-debounced, use-command-palette, use-navigation-with-params
│   │   ├── lib/                 ← cn, utils, theme-context
│   │   ├── types/               ← navigation, user-management
│   │   └── index.ts             ← barrel: ui/ + patterns/ + hooks + lib
│   ├── styles/tokens.css
│   ├── package.json
│   └── tsup.config.ts
│
├── pro/                         ← @blazz/pro (npm privé)
│   ├── src/
│   │   ├── components/
│   │   │   ├── blocks/          ← 88 composants (data-table, charts, kanban...)
│   │   │   └── ai/             ← 13 composants (chat, reasoning, tools)
│   │   ├── hooks/               ← use-data-table-url-state, use-data-table-views, use-block-navigation
│   │   ├── lib/                 ← license-context, with-pro-guard
│   │   └── index.ts             ← barrel: blocks/ + ai/ + hooks + lib
│   ├── package.json
│   └── tsup.config.ts
```

## Dépendances

### @blazz/ui — dependencies (~14)

```
@base-ui/react, lucide-react, motion, tailwind-merge,
class-variance-authority, nanoid, sonner, next-themes, cmdk,
date-fns, react-day-picker, embla-carousel-react,
react-dropzone, react-phone-number-input
```

### @blazz/ui — peerDependencies

```
react ^19, react-dom ^19, tailwindcss ^4
```

### @blazz/ui — optionalPeerDependencies

```
react-hook-form ^7, zod ^4, @hookform/resolvers ^5
```

### @blazz/pro — dependencies (~10)

```
recharts, @tanstack/react-table, @dnd-kit/*,
ai, @streamdown/*, streamdown,
use-stick-to-bottom, tokenlens
```

### @blazz/pro — peerDependencies

```
@blazz/ui ^0.1.0, react ^19, react-dom ^19, tailwindcss ^4
```

## Sub-path exports

```jsonc
// @blazz/ui package.json
"exports": {
  ".": "./dist/index.js",
  "./components/ui/*": "./dist/components/ui/*/index.js",
  "./components/patterns/*": "./dist/components/patterns/*/index.js",
  "./styles/*": "./styles/*"
}

// @blazz/pro package.json
"exports": {
  ".": "./dist/index.js",
  "./components/blocks/*": "./dist/components/blocks/*/index.js",
  "./components/ai/*": "./dist/components/ai/*/index.js"
}
```

## Build (tsup multi-entry)

```ts
// packages/ui/tsup.config.ts
entry: [
  "src/index.ts",
  "src/components/ui/*/index.ts",
  "src/components/patterns/*/index.ts",
]

// packages/pro/tsup.config.ts
entry: [
  "src/index.ts",
  "src/components/blocks/*/index.ts",
  "src/components/ai/*/index.ts",
]
```

## Publication

| Package | Registry | Accès | Versioning |
|---------|----------|-------|------------|
| `@blazz/ui` | npm public | Tout le monde | Changesets, indépendant |
| `@blazz/pro` | npm private (org @blazz restricted) | Token npm clients | Changesets, indépendant |

`@blazz/pro` déclare `@blazz/ui` en peerDep avec range semver (`^0.1.0`).
Major bump de `@blazz/ui` → release de `@blazz/pro` nécessaire.

## Migration des imports (apps)

```ts
// AVANT
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import { ChatMessage } from "@blazz/ui/components/ai/chat"
import { StatsStrip } from "@blazz/ui"

// APRÈS
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { ChatMessage } from "@blazz/pro/components/ai/chat"
import { StatsStrip } from "@blazz/pro"
```

Apps impactées : docs, examples, ops.

## Fichiers à supprimer de packages/ui/

- `src/components/blocks/` (déplacé vers pro)
- `src/components/ai/` (déplacé vers pro)
- `src/hooks/use-data-table-url-state.ts`
- `src/hooks/use-data-table-views.ts`
- `src/hooks/use-block-navigation.ts`
- `src/lib/license-context.tsx`
- `src/lib/with-pro-guard.tsx`
- `src/lib/linear-data.ts`, `sample-data.ts`, `stockbase-data.ts`, `talentflow-data.ts`
- Les 15 presets data-table (virés, refaits plus tard)

## CI (GitHub Actions)

```
PR → lint + typecheck + build les deux packages
Merge main → Changesets crée une PR de release
Merge release PR → publish @blazz/ui (npm public) + @blazz/pro (npm private)
```
