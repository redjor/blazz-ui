# Sandbox Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer une page `/docs/sandbox` dans apps/docs avec un split-view : panneau gauche = composant "cobaye" rendu en live, panneau droit = rapport blazz-audit affiché depuis un fichier markdown.

**Architecture:** Route TanStack Router `/_docs/docs/sandbox` avec un loader server-side qui lit `apps/docs/sandbox-report.md` via `node:fs/promises`. Layout deux colonnes `h-full` sans DocPage wrapper. Le fichier `sandbox-preview.tsx` est le composant réécrit par Claude pour chaque test.

**Tech Stack:** TanStack Router (createFileRoute), Node.js fs/promises, Tailwind v4 + design tokens oklch, `@blazz/ui/components/ui/badge`

---

## Contexte

- App: `apps/docs/` — TanStack Start / TanStack Router
- Layout parent: `apps/docs/src/routes/_docs.tsx` → `<Outlet />` avec `main` = `flex-1 overflow-y-auto min-w-0 bg-surface rounded-lg border border-container`
- Route à créer: `apps/docs/src/routes/_docs/docs/sandbox.tsx`
- Navigation: `apps/docs/src/config/navigation.ts` — ajouter une section "Outils" avec `Wrench` icon (déjà importé)
- Le loader lit le fichier depuis le disque à chaque navigation (pas de cache en dev)

## Chemin relatif pour `sandbox-report.md`

Depuis le fichier route `apps/docs/src/routes/_docs/docs/sandbox.tsx`, le fichier `apps/docs/sandbox-report.md` est à 4 niveaux au-dessus :
```
apps/docs/src/routes/_docs/docs/ → (../) → _docs/ → (../) → routes/ → (../) → src/ → (../) → apps/docs/
```
→ Chemin relatif : `../../../../sandbox-report.md`

---

## Task 1: Créer `sandbox-preview.tsx` (composant cobaye)

**Files:**
- Create: `apps/docs/src/components/docs/sandbox-preview.tsx`

**Step 1: Créer le fichier**

```tsx
import { Badge } from "@blazz/ui/components/ui/badge"

export function SandboxPreview() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <p className="text-sm text-fg-muted">Composant cobaye — Claude réécrit ce fichier pour les tests</p>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="positive">Positive</Badge>
        <Badge variant="negative">Negative</Badge>
        <Badge variant="caution">Caution</Badge>
        <Badge variant="inform">Inform</Badge>
      </div>
    </div>
  )
}
```

**Step 2: Vérifier que le fichier existe**

```bash
ls apps/docs/src/components/docs/sandbox-preview.tsx
```
Expected: le fichier est listé.

**Step 3: Commit**

```bash
git add apps/docs/src/components/docs/sandbox-preview.tsx
git commit -m "feat(docs): add sandbox-preview cobaye component"
```

---

## Task 2: Créer `sandbox-report.md` (rapport initial)

**Files:**
- Create: `apps/docs/sandbox-report.md`

**Step 1: Créer le fichier**

```md
# Rapport Blazz Audit

Aucun composant audité pour l'instant.

Lance `/blazz-audit apps/docs/src/components/docs/sandbox-preview.tsx` pour générer un rapport.
```

**Step 2: Vérifier**

```bash
ls apps/docs/sandbox-report.md
```
Expected: le fichier est listé.

**Step 3: Commit**

```bash
git add apps/docs/sandbox-report.md
git commit -m "feat(docs): add initial sandbox-report.md"
```

---

## Task 3: Créer la route sandbox avec split-view

**Files:**
- Create: `apps/docs/src/routes/_docs/docs/sandbox.tsx`

**Step 1: Créer la route**

```tsx
import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "node:fs/promises"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import { SandboxPreview } from "~/components/docs/sandbox-preview"

export const Route = createFileRoute("/_docs/docs/sandbox")({
  loader: async () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const reportPath = path.resolve(__dirname, "../../../../sandbox-report.md")
    const report = await fs.readFile(reportPath, "utf-8").catch(
      () => "Aucun rapport — lance `/blazz-audit` sur `sandbox-preview.tsx` d'abord."
    )
    return { report }
  },
  component: SandboxPage,
})

function SandboxPage() {
  const { report } = useLoaderData({ from: "/_docs/docs/sandbox" })

  return (
    <div className="flex h-full">
      {/* Panneau gauche — composant rendu */}
      <div className="flex-[3] overflow-y-auto border-r border-container bg-surface">
        <div className="p-4 border-b border-container">
          <p className="text-xs font-mono text-fg-muted">sandbox-preview.tsx</p>
        </div>
        <SandboxPreview />
      </div>

      {/* Panneau droit — rapport audit */}
      <div className="flex-[2] overflow-y-auto bg-raised">
        <div className="p-4 border-b border-container">
          <p className="text-xs font-mono text-fg-muted">sandbox-report.md</p>
        </div>
        <pre className="p-6 whitespace-pre-wrap font-mono text-sm text-fg leading-relaxed">
          {report}
        </pre>
      </div>
    </div>
  )
}
```

**Step 2: Démarrer le serveur docs et vérifier la page**

```bash
pnpm dev:docs
```

Ouvrir `http://localhost:3100/docs/sandbox`.

Expected:
- Panneau gauche : badges colorés rendus (Default, Positive, Negative, Caution, Inform)
- Panneau droit : message "Aucun rapport..." en mono

Si erreur de résolution de chemin pour `sandbox-report.md`, ajuster le chemin dans `path.resolve(__dirname, ...)` selon la structure réelle du build Vite.

**Step 3: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/sandbox.tsx
git commit -m "feat(docs): add sandbox split-view route with fs loader"
```

---

## Task 4: Ajouter l'entrée Sandbox dans la navigation

**Files:**
- Modify: `apps/docs/src/config/navigation.ts` (fin du fichier, avant le `]` fermant de `navigation`)

**Step 1: Vérifier les imports existants**

`Wrench` est déjà importé dans `navigation.ts` (ligne ~24). Pas besoin d'ajout d'import.

**Step 2: Ajouter la section "Outils" dans `navigation`**

Localiser la fin de `navigation: [...]` dans `sidebarConfig` (juste avant le `]` fermant suivi de `}`). Ajouter :

```ts
    {
      id: "outils",
      title: "Outils",
      items: [
        {
          id: "sandbox",
          title: "Sandbox",
          url: "/docs/sandbox",
          icon: Wrench,
        },
      ],
    },
```

La structure complète finale de `sidebarConfig.navigation` sera :
```ts
navigation: [
  { id: "ui", title: "UI", items: [...] },
  // ... autres sections existantes ...
  {
    id: "outils",
    title: "Outils",
    items: [
      { id: "sandbox", title: "Sandbox", url: "/docs/sandbox", icon: Wrench },
    ],
  },
],
```

**Step 3: Vérifier dans le browser**

Recharger `http://localhost:3100/docs/sandbox`.

Expected: "Sandbox" apparaît dans la sidebar docs sous une section "Outils", avec lien fonctionnel.

**Step 4: Commit**

```bash
git add apps/docs/src/config/navigation.ts
git commit -m "feat(docs): add Sandbox entry to sidebar navigation"
```

---

## Validation finale

Après les 4 tasks, tester le workflow complet :

1. Ouvrir `http://localhost:3100/docs/sandbox`
2. Vérifier les deux panneaux (composant + rapport initial)
3. Modifier `apps/docs/src/components/docs/sandbox-preview.tsx` → hot reload panneau gauche ✅
4. Écrire manuellement dans `apps/docs/sandbox-report.md` → F5 page → contenu mis à jour panneau droit ✅
5. Cliquer "Sandbox" dans la sidebar → navigation vers `/docs/sandbox` ✅
