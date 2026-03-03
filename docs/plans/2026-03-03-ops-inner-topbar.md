# Ops Inner Topbar — Breadcrumb Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une topbar sticky en haut du contenu principal sur toutes les pages ops sauf le dashboard, affichant la breadcrumb de navigation.

**Architecture:** Option A — `OpsFrame` reçoit un prop `topBar?: ReactNode` injecté dans le slot `tabBar` de `Frame` (déjà sticky, hors `ScrollArea`). Un composant `OpsBreadcrumb` accepte un tableau d'items `{ label, href? }` et rend la navigation hiérarchique.

**Tech Stack:** React, Next.js, Tailwind v4, lucide-react, @blazz/ui tokens

---

### Task 1 : Créer le composant `OpsBreadcrumb`

**Files:**
- Create: `apps/ops/components/ops-breadcrumb.tsx`

**Step 1 : Écrire le composant**

```tsx
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@blazz/ui/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface OpsBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function OpsBreadcrumb({ items, className }: OpsBreadcrumbProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1.5 border-b border-edge-subtle bg-raised px-6 rounded-tr-(--main-radius)",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-fg-muted shrink-0" />
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "text-sm",
                  isLast
                    ? "font-medium text-fg"
                    : "text-fg-subtle",
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-sm text-fg-subtle transition-colors hover:text-fg hover:underline"
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

**Step 2 : Vérifier visuellement**

Lancer `pnpm dev:ops` et aller sur `/clients` (après la task suivante).

**Step 3 : Commit**

```bash
git add apps/ops/components/ops-breadcrumb.tsx
git commit -m "feat(ops): add OpsBreadcrumb component"
```

---

### Task 2 : Modifier `OpsFrame` pour accepter `topBar`

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1 : Ajouter le prop `topBar`**

Modifier l'interface et le JSX de `OpsFrame` :

```tsx
interface OpsFrameProps {
  children: ReactNode
  topBar?: ReactNode
}

export function OpsFrame({ children, topBar }: OpsFrameProps) {
  return (
    <SidebarProvider>
      <AppFrame sidebarConfig={opsSidebarConfig} noTopBar sidebarHeader={sidebarLogo} tabBar={topBar}>
        {children}
      </AppFrame>
    </SidebarProvider>
  )
}
```

**Step 2 : Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add topBar prop to OpsFrame"
```

---

### Task 3 : Ajouter la breadcrumb sur `/clients`

**Files:**
- Modify: `apps/ops/app/clients/page.tsx`

**Step 1 : Importer `OpsBreadcrumb`**

En haut du fichier, ajouter :
```tsx
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"
```

**Step 2 : Passer le `topBar` à `OpsFrame`**

Chercher le `return (` de la page et modifier :

```tsx
return (
  <OpsFrame topBar={<OpsBreadcrumb items={[{ label: "Clients" }]} />}>
    {/* contenu existant inchangé */}
  </OpsFrame>
)
```

**Step 3 : Vérifier visuellement**

Aller sur `/clients` : la topbar doit apparaître avec "Clients" en `font-medium text-fg`, sticky, avec `border-b` subtil.

**Step 4 : Commit**

```bash
git add apps/ops/app/clients/page.tsx
git commit -m "feat(ops): add breadcrumb to clients list page"
```

---

### Task 4 : Ajouter la breadcrumb sur `/clients/[id]`

**Files:**
- Modify: `apps/ops/app/clients/[id]/page.tsx`

**Step 1 : Importer `OpsBreadcrumb`**

```tsx
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"
```

**Step 2 : Passer le `topBar` à `OpsFrame`**

La page a déjà une query Convex pour le client (`client`). Le nom est disponible via `client?.name`. Le breadcrumb doit afficher "Clients › Nom du client". Pendant le loading, utiliser un fallback vide ou `"..."`.

```tsx
return (
  <OpsFrame
    topBar={
      <OpsBreadcrumb
        items={[
          { label: "Clients", href: "/clients" },
          { label: client?.name ?? "..." },
        ]}
      />
    }
  >
    {/* contenu existant inchangé */}
  </OpsFrame>
)
```

**Step 3 : Vérifier visuellement**

Aller sur `/clients/[id]` : "Clients" est un lien vers `/clients`, "Nom client" est en `font-medium`.

**Step 4 : Commit**

```bash
git add apps/ops/app/clients/[id]/page.tsx
git commit -m "feat(ops): add breadcrumb to client detail page"
```

---

### Task 5 : Ajouter la breadcrumb sur `/clients/[id]/projects/[pid]`

**Files:**
- Modify: `apps/ops/app/clients/[id]/projects/[pid]/page.tsx`

**Step 1 : Importer `OpsBreadcrumb`**

```tsx
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"
```

**Step 2 : Identifier les données disponibles**

La page a déjà des queries Convex pour `client` et `project`. Les noms sont `client?.name` et `project?.name`.

**Step 3 : Passer le `topBar` à `OpsFrame`**

```tsx
return (
  <OpsFrame
    topBar={
      <OpsBreadcrumb
        items={[
          { label: "Clients", href: "/clients" },
          { label: client?.name ?? "...", href: `/clients/${params.id}` },
          { label: project?.name ?? "..." },
        ]}
      />
    }
  >
    {/* contenu existant inchangé */}
  </OpsFrame>
)
```

Note : `params` est un `Promise` (Next.js 16), donc les ids sont déjà `use()`-resolus en haut de la page.

**Step 4 : Vérifier visuellement**

Aller sur un projet : "Clients › Nom client › Nom projet", les deux premiers sont des liens.

**Step 5 : Commit**

```bash
git add apps/ops/app/clients/[id]/projects/[pid]/page.tsx
git commit -m "feat(ops): add breadcrumb to project detail page"
```

---

### Task 6 : Ajouter la breadcrumb sur `/time`, `/recap`, `/todos`

**Files:**
- Modify: `apps/ops/app/time/page.tsx`
- Modify: `apps/ops/app/recap/page.tsx`
- Modify: `apps/ops/app/todos/page.tsx`

**Step 1 : `/time/page.tsx`**

```tsx
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"

// Dans le return :
<OpsFrame topBar={<OpsBreadcrumb items={[{ label: "Suivi de temps" }]} />}>
```

**Step 2 : `/recap/page.tsx`**

```tsx
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"

// Dans le return :
<OpsFrame topBar={<OpsBreadcrumb items={[{ label: "Récapitulatif" }]} />}>
```

**Step 3 : `/todos/page.tsx`**

```tsx
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"

// Dans le return :
<OpsFrame topBar={<OpsBreadcrumb items={[{ label: "Todos" }]} />}>
```

**Step 4 : Vérifier visuellement**

Naviguer sur les 3 pages et confirmer que la topbar s'affiche avec le bon label.

**Step 5 : Commit**

```bash
git add apps/ops/app/time/page.tsx apps/ops/app/recap/page.tsx apps/ops/app/todos/page.tsx
git commit -m "feat(ops): add breadcrumb to time, recap and todos pages"
```

---

## Notes d'implémentation

- **`rounded-tr-(--main-radius)`** : le `OpsBreadcrumb` porte ce radius car quand `tabBar` est présent, le `ScrollArea` dans `Frame` perd son propre `rounded-tr`. Voir `packages/ui/src/components/patterns/frame.tsx:40`.
- **Dashboard `/`** : aucune modification — `OpsFrame` sans `topBar` = pas de barre.
- **Token `bg-raised`** : background légèrement plus clair que `bg-surface`, défini dans `globals.css`. Convient pour séparer visuellement la topbar du contenu.
- **Skeleton loading** : utiliser `"..."` comme fallback pour les labels dynamiques en attendant la query Convex (pas de skeleton dédié, trop verbeux pour un label de 2 mots).
