# Design — Migration apps/docs de TanStack Start vers Next.js 16

**Date** : 2026-03-20
**Statut** : Validé

## Contexte

L'app `apps/docs` actuelle utilise TanStack Start + Nitro (alpha 3.0.1) + Vite 7.
Le framework est instable : builds cassés, hot reload lent, hydration bugs, Nitro alpha.
3 shims de compatibilité Next.js existent déjà (`next/link`, `next/image`, `next/navigation`),
signe que le code a été pensé pour Next.js à la base.

## Décisions

1. **Full SSG** — `output: "export"` dans next.config. Toutes les pages statiques.
2. **2 apps** au lieu de 1 :
   - `apps/docs` — Landing + Documentation (SSG, Next.js 16)
   - `apps/sandbox` — Playground interactif (hors scope de cette migration)
3. **URLs inchangées** — `/docs/components/ui/button`, `/docs/blocks/data-table`, etc.
4. **Approche progressive** — nouvelle app `apps/docs-next` à côté, migration par passes, suppression de l'ancienne à la fin.

## Structure cible

```
apps/docs-next/
├── src/
│   ├── app/                          ← App Router (Next.js 16)
│   │   ├── layout.tsx                ← Root layout (ThemeProvider, fonts, meta)
│   │   ├── page.tsx                  ← Landing (hero, pricing, FAQ, footer)
│   │   ├── license/page.tsx
│   │   └── docs/
│   │       ├── layout.tsx            ← Docs layout (sidebar, command palette)
│   │       ├── page.tsx              ← /docs overview
│   │       ├── components/
│   │       │   ├── ui/               (52 pages)
│   │       │   ├── layout/           (11 pages)
│   │       │   └── patterns/         (9 pages)
│   │       ├── blocks/               (37 pages)
│   │       ├── ai/                   (18 pages)
│   │       ├── guide/
│   │       └── utils/
│   ├── components/                   ← Repris tel quel
│   │   ├── docs/                     (DocPage, DocHero, DocExample, etc.)
│   │   └── landing/                  (Navbar, Hero, Pricing, etc.)
│   ├── config/                       (navigation.ts, app.config.ts)
│   ├── data/                         (31 fichiers metadata + registry)
│   ├── lib/
│   └── styles/globals.css
├── scripts/                          (generate-llms.ts, generate-thumbnails.ts)
├── public/                           (thumbnails, logos, llms.txt)
├── next.config.mjs                   ← output: "export"
├── tsconfig.json
└── package.json
```

## Ce qui est réutilisé vs réécrit

### Réutilisé (copié tel quel)
- 29 composants (`components/docs/` + `components/landing/`)
- 31 fichiers metadata (`data/components/`)
- Config navigation (`config/navigation.ts`)
- Scripts (`generate-llms.ts`, `generate-thumbnails.ts`)
- Assets (`public/thumbnails/`, logos, `llms.txt`)
- Styles (`globals.css` + tokens oklch)

### Réécrit
- Root layout : `__root.tsx` → `app/layout.tsx`
- Docs layout : `_docs.tsx` → `app/docs/layout.tsx`
- 211 routes : convention TanStack (`createFileRoute`) → Next.js App Router (`page.tsx`)
- Theme : ServerFn cookie → `next-themes` côté client (suffisant pour static)

### Supprimé
- `routeTree.gen.ts` (4 673 lignes)
- Shims `src/compat/` (next/link, next/image, next/navigation)
- Config Nitro + Vite
- Dépendances TanStack (`@tanstack/react-router`, `@tanstack/react-start`, `nitro`)

## Plan de passes

### Passe 1 — Squelette
- Créer `apps/docs-next` avec Next.js 16 + `output: "export"`
- Root layout (ThemeProvider, fonts, globals.css)
- Copier `components/`, `config/`, `data/`, `lib/`, `scripts/`, `public/`
- Landing page (`/`) fonctionnelle
- Dev server sur port 3101

### Passe 2 — Docs layout + premières pages
- Docs layout avec sidebar + command palette
- Pages index (`/docs`, `/docs/components`, `/docs/blocks`, `/docs/ai`)
- 5-10 pages composants UI pour valider le pattern

### Passe 3 — Migration bulk des routes
- ~200 pages restantes (pattern répétitif, parallélisable)
- Chaque route : extraire JSX du `Route.component` → `page.tsx`

### Passe 4 — Finalisation
- Vérifier toutes les URLs
- `pnpm build` — valider le static export
- Supprimer `apps/docs` (ancienne app TanStack)
- Renommer `apps/docs-next` → `apps/docs`
- Mettre à jour `turbo.json` et `pnpm-workspace.yaml`
