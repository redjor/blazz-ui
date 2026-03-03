# Sonner Toast Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter un composant `<Toaster />` wrappant Sonner dans `packages/ui`, stylé avec les design tokens Blazz, et exporter `toast` pour l'API impérative.

**Architecture:** Wrapper minimal sur `sonner` (déjà dépendance de `packages/ui`). Le composant `Toaster` pre-configure position, theme système, richColors, et mappe les CSS variables Sonner sur les tokens Blazz (`--bg-overlay`, `--border-default`, `--text-primary`). Re-export de `toast` depuis sonner pour les appels impératifs.

**Tech Stack:** Sonner v2, React 19, TypeScript, Tailwind v4, tokens Blazz.

---

### Task 1: Créer le composant toast.tsx

**Files:**
- Create: `packages/ui/src/components/ui/toast.tsx`

**Step 1: Créer le fichier**

```tsx
"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="system"
      richColors
      gap={8}
      offset={16}
      toastOptions={{
        style: {
          "--normal-bg": "var(--bg-overlay)",
          "--normal-border": "var(--border-default)",
          "--normal-text": "var(--text-primary)",
          "--normal-description": "var(--text-secondary)",
        } as React.CSSProperties,
        className: "text-xs! shadow-lg",
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
```

**Step 2: Vérifier que le fichier compile**

```bash
cd packages/ui && npx tsc --noEmit
```

Expected: Pas d'erreur de type.

**Step 3: Commit**

```bash
git add packages/ui/src/components/ui/toast.tsx
git commit -m "feat(ui): add Sonner toast component with Blazz design tokens"
```

---

### Task 2: Exporter depuis le barrel index.ts

**Files:**
- Modify: `packages/ui/src/index.ts` — ajouter l'export après `export * from "./components/ui/tooltip"`

**Step 1: Ajouter l'export dans index.ts**

Dans `packages/ui/src/index.ts`, ajouter à la fin de la section UI Primitives (après `export * from "./components/ui/tooltip"`) :

```ts
export * from "./components/ui/toast"
```

**Step 2: Vérifier les exports**

```bash
cd packages/ui && grep -n "toast" src/index.ts
```

Expected: La ligne avec `./components/ui/toast` apparaît.

**Step 3: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export Toaster and toast from @blazz/ui barrel"
```

---

### Task 3: Intégrer dans apps/ops (smoke test)

**Files:**
- Modify: `apps/ops/app/layout.tsx` — ajouter `<Toaster />` dans le layout root

**Step 1: Lire le layout actuel**

Lire `apps/ops/app/layout.tsx` pour identifier où ajouter le Toaster.

**Step 2: Ajouter le Toaster**

Importer `Toaster` depuis `@blazz/ui` et l'ajouter juste avant `</body>` :

```tsx
import { Toaster } from "@blazz/ui";

// Dans le JSX, avant </body> :
<Toaster />
```

**Step 3: Tester avec un toast de test (optionnel)**

Dans n'importe quel composant client de apps/ops, ajouter temporairement un `useEffect` qui déclenche un `toast.success("Test")` pour vérifier le rendu visuel.

**Step 4: Commit**

```bash
git add apps/ops/app/layout.tsx
git commit -m "feat(ops): integrate Toaster from @blazz/ui in root layout"
```
