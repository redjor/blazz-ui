# Design — Documentation des patterns App Shell

**Date:** 2026-02-28
**Scope:** Groupe "App Shell" dans `apps/docs/src/routes/_docs/docs/components/patterns/`
**Statut:** Approuvé

---

## Contexte

Les 18 pages de documentation des patterns sont toutes des stubs ("Documentation coming soon."). Ce design couvre le premier groupe à documenter : **App Shell** (6 composants).

## Composants couverts

| Composant | Fichier source | Page docs |
|---|---|---|
| AppFrame | `packages/ui/src/components/patterns/app-frame.tsx` | `patterns/app-frame.tsx` |
| AppSidebar | `packages/ui/src/components/patterns/app-sidebar.tsx` | `patterns/app-sidebar.tsx` |
| AppTopBar | `packages/ui/src/components/patterns/app-top-bar.tsx` | `patterns/app-top-bar.tsx` |
| TopBar | `packages/ui/src/components/patterns/top-bar.tsx` | `patterns/top-bar.tsx` |
| DashboardLayout | `packages/ui/src/components/patterns/dashboard-layout.tsx` | `patterns/dashboard-layout.tsx` |
| LayoutFrame | `packages/ui/src/components/patterns/layout-frame.tsx` | `patterns/layout-frame.tsx` |

## Format retenu : Format léger

Chaque page suit ce template :

```
DocPage (title, subtitle, toc)
├── DocSection id="usage"
│   └── DocExampleClient (code + syntaxe highlight, sans live preview interactif)
│       ├── Snippet basique (usage minimal)
│       └── Snippet avec options avancées
├── DocSection id="props"
│   └── DocPropsTable
└── DocSection id="related"
    └── DocRelated (links vers les autres patterns du groupe)
```

- Le loader TanStack (`loader: async`) est utilisé pour le highlight code (même pattern que `button.tsx`)
- Pas de `DocHero` ni de live preview interactif — les patterns App Shell sont des layouts complets
- `DocExampleClient` affiche le code avec syntaxe highlighting uniquement (pas de rendu live)

## Contenu détaillé par composant

### App Frame
- **Subtitle:** "Shell d'application complet : sidebar + top bar + gestion mobile. Point d'entrée recommandé pour la plupart des apps."
- **Snippets:**
  1. Usage basique avec `sidebarConfig`
  2. Avec `sections`, `onOpenCommandPalette`, `minimalTopBar`, `sidebarHeader`
- **Props (`AppFrameProps`):** navigation, sidebarConfig, children, sidebarHeader, sidebarFooter, tabBar, onOpenCommandPalette, activeSection, sections, minimalTopBar
- **Related:** App Sidebar, App Top Bar, Layout Frame

### App Sidebar
- **Subtitle:** "Sidebar hiérarchique pilotée par un objet SidebarConfig. Supporte sections, sous-items, et footer utilisateur."
- **Snippets:**
  1. Usage avec config basique (sections + items)
  2. Avec `header` slot (ex: OrgSwitcher)
- **Props (`AppSidebarProps`):** config (SidebarConfig), header (ReactNode), + Sidebar props passthrough
- **Related:** App Frame, Layout Frame

### App Top Bar
- **Subtitle:** "Header global de l'application : logo, navigation de sections, barre de recherche, thème, notifications, user menu."
- **Snippets:**
  1. Usage basique
  2. Avec `sections` et mode `minimal`
- **Props (`AppTopBarProps`):** onOpenCommandPalette, onOpenMobileMenu, className, activeSection, sections (TopBarSection[]), minimal, user
- **Related:** App Frame, Top Bar

### Top Bar
- **Subtitle:** "Header de zone de contenu : breadcrumbs contextuels et actions. Complémentaire à AppTopBar."
- **Snippets:**
  1. Avec breadcrumbs
  2. Avec title + actions
- **Props (`TopBarProps`):** breadcrumbs, actions, title, className, onToggleSidebar
- **Related:** App Frame, App Top Bar

### Dashboard Layout
- **Subtitle:** "Layout alternatif bas niveau avec navbar, sidebar optionnel et style rounded-top. Alternative à AppFrame."
- **Snippets:**
  1. Usage complet avec sidebar
  2. Sans sidebar (`showSidebar={false}`)
- **Props (`DashboardLayoutProps`):** navbar, sidebar, children, showSidebar, sidebarWidth, className, bgColor
- **Related:** App Frame, Layout Frame

### Layout Frame
- **Subtitle:** "Layout flexbox bas niveau : topBar fixe + sidebar + main scrollable. Brique de base pour layouts personnalisés."
- **Snippets:**
  1. Usage simple
- **Props (`LayoutFrameProps`):** children, topBar, sidebar, className
- **Related:** App Frame, Dashboard Layout

## Décisions techniques

- **Highlight code:** Utiliser `highlightCode` via loader (serveur), exactement comme les pages UI existantes
- **DocExampleClient:** Utilisé en mode "code only" — le `children` est omis ou réduit à un placeholder visuel simple (ex: div grise avec texte)
- **TOC:** `[{ id: "usage", title: "Usage" }, { id: "props", title: "Props" }, { id: "related", title: "Related" }]`
- **Pas de DocDoDont** pour ce groupe — les patterns shell sont architecturaux, les guidelines Do/Don't ajoutent peu de valeur ici

## Fichiers à modifier

- `apps/docs/src/routes/_docs/docs/components/patterns/app-frame.tsx` — remplacer stub
- `apps/docs/src/routes/_docs/docs/components/patterns/app-sidebar.tsx` — remplacer stub
- `apps/docs/src/routes/_docs/docs/components/patterns/app-top-bar.tsx` — remplacer stub
- `apps/docs/src/routes/_docs/docs/components/patterns/top-bar.tsx` — remplacer stub
- `apps/docs/src/routes/_docs/docs/components/patterns/dashboard-layout.tsx` — remplacer stub
- `apps/docs/src/routes/_docs/docs/components/patterns/layout-frame.tsx` — remplacer stub
