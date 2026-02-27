# Docs Layout Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remplacer le layout `_docs.tsx` basé sur `AppFrame` + providers par un layout HTML/Tailwind minimal (topbar fixe + sidebar + main).

**Architecture:** Layout inline dans `_docs.tsx` — une `<header>` fixe h-14, un `<aside>` w-64 sticky avec scroll, un `<main>` flex-1. La sidebar réutilise `ComponentsSidebar` existant. La topbar contient : logo gauche, search + theme + examples à droite. `CommandPalette` reste avec un `useState` local.

**Tech Stack:** TanStack Router (file-based routes), React 19, Tailwind v4, Lucide icons, `~/components/theme-toggle`, `~/components/docs/components-sidebar`

---

### Task 1 : Réécrire `_docs.tsx`

**Files:**
- Modify: `apps/docs/src/routes/_docs.tsx`

**Step 1 : Lire le fichier actuel**

Vérifier le contenu exact de `apps/docs/src/routes/_docs.tsx` avant de le modifier.

**Step 2 : Réécrire le fichier**

Remplacer entièrement le contenu par :

```tsx
import { useState, useEffect } from "react"
import { createFileRoute, Outlet, useLocation, Link } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import { ComponentsSidebar } from "~/components/docs/components-sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { navigationConfig } from "~/config/navigation"
import { Toaster } from "sonner"

export const Route = createFileRoute("/_docs")({
  component: DocsLayout,
})

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

function useSyncDocTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const h1 = document.querySelector("h1")
      document.title = h1?.textContent
        ? `${h1.textContent} — Blazz UI`
        : "Blazz UI"
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])
}

function DocsLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  useSyncDocTitle()

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="fixed top-0 z-50 h-14 w-full border-b bg-surface">
        <div className="flex h-full items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-fg">
            <span className="text-sm font-bold tracking-tight">Blazz UI</span>
          </Link>

          {/* Actions droite */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border bg-raised px-3 py-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border bg-surface px-1.5 py-0.5 text-xs font-mono text-fg-muted">
                ⌘K
              </kbd>
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Examples link */}
            <a
              href={examplesUrl || "/examples"}
              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm text-fg-muted hover:text-fg hover:bg-raised transition-colors"
            >
              Examples
            </a>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex pt-14 h-screen">
        {/* Sidebar */}
        <ComponentsSidebar />

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <CommandPalette
        navigation={navigationConfig}
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      <Toaster />
    </div>
  )
}
```

**Step 3 : Vérifier que le dev server compile**

```bash
pnpm dev:docs
```

Ouvrir `http://localhost:3100`. Vérifier :
- Header visible et fixe au scroll
- Sidebar avec les catégories collapsables
- Contenu scrollable dans le main

**Step 4 : Commit**

```bash
git add apps/docs/src/routes/_docs.tsx
git commit -m "refactor(docs): replace AppFrame with simple topbar/sidebar/main layout"
```

---

### Task 2 : Ajuster `ComponentsSidebar` pour le nouveau layout

**Files:**
- Modify: `apps/docs/src/components/docs/components-sidebar.tsx`

**Context:** Le `ComponentsSidebar` actuel a `sticky top-14` et `h-[calc(100vh-3.5rem)]` hardcodé — ces valeurs sont correctes pour le nouveau layout (topbar h-14 = 3.5rem). Vérifier que le rendu est bon, sinon ajuster.

**Step 1 : Vérifier visuellement**

Ouvrir `http://localhost:3100/docs/components/ui/button`.

Check :
- Sidebar sticky au scroll de la page
- Catégorie active auto-ouverte
- Item actif highlighted
- Pas de double scrollbar

**Step 2 (si nécessaire) : Corriger la hauteur sidebar**

Si la sidebar déborde ou n'est pas sticky, modifier la ligne 38 de `components-sidebar.tsx` :

```tsx
// Avant
<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r bg-surface lg:block">

// Vérifier que top-14 et h-[calc(100vh-3.5rem)] correspondent à la topbar h-14
// Ces valeurs sont déjà correctes — aucun changement nécessaire si le layout est bon
```

**Step 3 : Commit si changement**

```bash
git add apps/docs/src/components/docs/components-sidebar.tsx
git commit -m "fix(docs): adjust sidebar height for new layout"
```

---

### Task 3 : Nettoyage — supprimer imports inutilisés

**Files:**
- Check: `apps/docs/src/config/navigation.ts` — gardé (utilisé par CommandPalette via `navigationConfig`)
- Delete (si plus utilisé): aucune suppression de fichier nécessaire pour l'instant

**Step 1 : Vérifier les imports orphelins**

```bash
pnpm lint
```

Corriger les éventuels warnings d'imports non utilisés dans `_docs.tsx`.

**Step 2 : Vérifier que toutes les routes docs fonctionnent**

Naviguer manuellement sur :
- `/` — landing page
- `/docs/components/ui/button`
- `/docs/components/blocks/data-table`
- `/docs/components/ai/chat/conversation`

**Step 3 : Commit final**

```bash
git add .
git commit -m "chore(docs): cleanup after layout simplification"
```
