# Migration Docs App : Next.js → TanStack Start

**Date** : 2026-02-26
**Scope** : `apps/docs/`
**Approche** : Big Bang Migration

## Motivations

- **Performance/SSG** : Meilleur controle sur le static generation et streaming SSR
- **Routing type-safe** : TanStack Router avec loaders/actions type-safe
- **Independance** : Quitter l'ecosysteme Vercel/Next.js pour un framework plus leger et open
- **Deploiement** : Agnostique (Cloudflare, Vercel, Netlify — a decider plus tard)

## Etat actuel

- Next.js 16 App Router, React 19, Tailwind v4
- 139 pages docs (TSX pur, pas de MDX)
- Shiki server-side pour syntax highlighting
- `next-themes` pour dark/light toggle
- Command palette, sidebar navigation, table of contents
- Static generation pour toutes les pages
- Zero backend/API — purement frontend showcase

## Architecture cible

### Structure du projet

```
apps/docs/
├── src/
│   ├── routes/
│   │   ├── __root.tsx              ← Root route (HTML shell + theme)
│   │   ├── index.tsx               ← Landing page
│   │   ├── _docs.tsx               ← Pathless layout (AppFrame + sidebar)
│   │   ├── _docs/
│   │   │   └── docs/
│   │   │       └── components/
│   │   │           ├── index.tsx
│   │   │           ├── ui/
│   │   │           │   ├── button.tsx
│   │   │           │   ├── card.tsx
│   │   │           │   └── ...
│   │   │           ├── ai/
│   │   │           │   ├── chat/
│   │   │           │   │   ├── conversation.tsx
│   │   │           │   │   └── ...
│   │   │           │   └── ...
│   │   │           └── ...
│   │   └── thumbnail/
│   │       └── $slug.tsx           ← Dynamic route
│   ├── components/                 ← Migration directe
│   ├── config/                     ← Migration directe
│   ├── lib/                        ← Migration directe
│   ├── styles/
│   │   └── globals.css             ← Tailwind v4 + design tokens
│   ├── router.tsx                  ← Router config
│   ├── entry-client.tsx            ← Client hydration
│   └── entry-server.tsx            ← SSR entry
├── vite.config.ts                  ← Remplace next.config
├── tsconfig.json
└── package.json
```

### Mapping routing Next.js → TanStack

| Next.js | TanStack Start |
|---------|---------------|
| `app/layout.tsx` | `routes/__root.tsx` |
| `app/page.tsx` | `routes/index.tsx` |
| `app/(docs)/layout.tsx` | `routes/_docs.tsx` (pathless layout) |
| `app/(docs)/docs/components/ui/button/page.tsx` | `routes/_docs/docs/components/ui/button.tsx` |
| `app/thumbnail/[slug]/page.tsx` | `routes/thumbnail/$slug.tsx` |
| `{children}` | `<Outlet />` |
| `generateStaticParams()` | `prerender.routes` dans vite.config |

### Entry points

**`vite.config.ts`** :
- TanStack Start plugin avec prerendering (`crawlLinks: true`)
- Tailwind CSS v4 via `@tailwindcss/vite`
- `vite-tsconfig-paths` pour les aliases
- Port 3100 (meme qu'actuel)

**`__root.tsx`** :
- `HeadContent` avec meta tags, stylesheet link, favicon
- Script inline anti-flash pour le theme
- `<html lang="fr">` + `<Outlet />`

**`router.tsx`** :
- `createRouter` avec `scrollRestoration: true`
- Import du `routeTree.gen` auto-genere

### Data loading & Shiki

**Server function** (`lib/highlight.server.ts`) :
- `createServerFn({ method: 'GET' })` qui encapsule Shiki
- Input : `{ code: string, lang: string }`
- Output : HTML string highlighte
- Meme singleton Shiki que l'actuel

**Pattern par page** :
- Chaque page definit ses exemples comme un tableau `{ title, code, lang }`
- Le `loader` de la route highlight tous les exemples en parallele via `Promise.all`
- Le composant recoit le HTML pre-highlight via `useLoaderData()`
- `DocExample` devient un composant client simple (plus besoin d'etre async Server Component)

### Theming (cookie-based)

Remplace `next-themes` :

1. **Cookie `theme`** : stocke `'light'` ou `'dark'` (defaut: dark)
2. **Script inline** dans `__root.tsx` head : lit le cookie et applique `.dark` avant le paint (anti-flash)
3. **Server function `setTheme`** : POST qui set le cookie avec `Max-Age=31536000`
4. **`ThemeToggle` composant** : toggle la classe `.dark` immediatement + appelle `setTheme` en arriere-plan
5. **SSR** : Le cookie est lu cote serveur pour rendre avec la bonne classe

### Prerendering (SSG)

```ts
prerender: {
  routes: ['/', ...thumbnailRegistry.map(t => `/thumbnail/${t.slug}`)],
  crawlLinks: true,  // decouvre automatiquement toutes les pages docs
}
```

- `crawlLinks` crawle la navigation et les liens pour prerender sans lister manuellement
- Thumbnails explicitement listes car pas forcemment lies dans la nav

## Dependencies

### Retirees
- `next`
- `next-themes`
- `@next/font` (si present)

### Ajoutees
- `@tanstack/react-start`
- `@tanstack/react-router`
- `@tanstack/react-router-devtools`
- `vite`
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- `vite-tsconfig-paths`

### Inchangees
- `@blazz/ui` (zero modification)
- `shiki`, `streamdown`, `lucide-react`, `motion`, `sonner`
- `ai`, `date-fns`, `react-day-picker`, `class-variance-authority`

## Scope de migration

| Element | Effort | Details |
|---------|--------|---------|
| Entry points & config | Moyen | vite.config, root, router, entries |
| Theme system | Moyen | Cookie-based remplace next-themes |
| Docs layout | Leger | `_docs.tsx` quasi identique |
| `DocExample` | Leger | Server Component → client avec HTML pre-highlight |
| `lib/shiki.ts` | Leger | Wrapper `createServerFn` |
| 139 pages routes | Gros volume | Restructuration routing + loaders (contenu JSX inchange) |
| Landing page | Leger | Juste routing wrapper |
| Thumbnails | Leger | `[slug]` → `$slug` + prerender config |
| `components/` | Aucun | React pur, migration directe |
| `config/` | Leger | `NEXT_PUBLIC_` → `VITE_` |
| `lib/sample-data.ts` | Aucun | Donnees statiques |

## Risques

- **Volume** : 139 pages a restructurer (mais contenu JSX inchange)
- **Shiki perf** : Verifier que le highlighting dans les loaders est assez rapide pour le prerendering
- **@blazz/ui compat** : Certains composants utilisent-ils des APIs Next.js specifiques ? (a verifier — a priori non)
- **Streamdown** : Verifier compatibilite avec Vite/SSR
