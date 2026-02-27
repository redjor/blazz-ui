# Docs Layout Simplification

**Date:** 2026-02-27
**Status:** Approved

## Objectif

Remplacer le layout docs basé sur `AppFrame` (et ses providers) par un layout HTML/Tailwind minimal : topbar fixe + sidebar fixe + main scrollable.

## Supprimés

- `AppFrame` de `@blazz/ui/components/patterns/app-frame`
- `FrameProvider` / `useFrame` de `@blazz/ui/components/patterns/frame-context`
- `SidebarProvider` de `@blazz/ui/components/ui/sidebar`
- `useFrameLayout` de `@blazz/ui/lib/use-frame-layout`
- `sidebarConfig` complexe (user profile, nested sections) de `~/config/navigation`

## Structure

```
<header class="fixed top-0 h-14 w-full border-b bg-surface z-50">
  Logo (gauche) | Search · ThemeToggle · Lien Examples (droite)
</header>

<div class="flex h-screen pt-14">
  <aside class="w-64 shrink-0 border-r overflow-y-auto">
    DocsSidebar — catégories collapsables UI/Patterns/Blocks/AI
  </aside>
  <main class="flex-1 overflow-y-auto">
    <Outlet />
  </main>
</div>
```

## Topbar (droite)

Ordre : **Search** (ouvre CommandPalette) · **ThemeToggle** · **Examples** (lien externe)

- Search : bouton iconique + raccourci clavier affiché (⌘K), `useState` local pour `commandPaletteOpen`
- ThemeToggle : composant existant `~/components/theme-toggle`
- Examples : `<a>` simple vers `examplesUrl`

## Sidebar

Reprend la logique de `ComponentsSidebar` existant (`apps/docs/src/components/docs/components-sidebar.tsx`) :
- Catégories collapsables avec chevron
- Auto-open de la catégorie active
- Highlight du lien actif
- `ScrollArea` interne

La navigation est lue depuis `~/config/components-navigation` (pas `~/config/navigation` qui était pour AppFrame).

## Fichiers modifiés

- `apps/docs/src/routes/_docs.tsx` — layout réécrit, providers supprimés
- `apps/docs/src/components/docs/components-sidebar.tsx` — déjà prêt, aucun changement nécessaire

## Fichiers non touchés

- `~/config/navigation.ts` — peut rester (utilisé par CommandPalette)
- `~/config/components-navigation.ts` — inchangé
- Toutes les routes docs — inchangées
