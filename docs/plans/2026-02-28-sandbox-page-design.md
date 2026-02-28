# Design — Page Sandbox (Split-view)

**Date** : 2026-02-28
**Scope** : Nouvelle page `/docs/sandbox` dans apps/docs — split-view pour tester des composants et voir le rapport blazz-audit côte à côte

---

## Contexte

Besoin d'une page de développement dans la doc pour :
1. Tester un composant "cobaye" en rendu réel (hot reload)
2. Voir le résultat d'un `/blazz-audit` sur ce composant côte à côte

Workflow cible :
- Claude réécrit `sandbox-preview.tsx` → Vite hot reload → panneau gauche se met à jour
- Claude exécute `/blazz-audit` → écrit dans `sandbox-report.md` → panneau droit s'actualise (F5)

---

## Architecture

### Fichiers à créer

| Fichier | Rôle |
|---|---|
| `apps/docs/src/routes/_docs/docs/sandbox.tsx` | Route TanStack + layout split-view |
| `apps/docs/src/components/docs/sandbox-preview.tsx` | Composant cobaye (réécrit par Claude) |
| `apps/docs/sandbox-report.md` | Rapport blazz-audit (écrit par Claude) |

### Fichier à modifier

| Fichier | Modification |
|---|---|
| `apps/docs/src/config/navigation.ts` | Ajouter entrée "Sandbox" dans la sidebar |

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│  Topbar (_docs.tsx — inchangé)                       │
├──────────────────────────┬──────────────────────────┤
│  Left (~60%)             │  Right (~40%)            │
│  bg-surface              │  bg-raised               │
│  overflow-y-auto         │  overflow-y-auto         │
│                          │                          │
│  <SandboxPreview />      │  Rapport blazz-audit     │
│  (hot reload)            │  (contenu markdown       │
│                          │   formaté en <pre>)      │
└──────────────────────────┴──────────────────────────┘
```

Pas de wrapper DocPage — layout custom `h-full flex` directement dans le composant de route.

---

## Détails techniques

### Route & Loader (`sandbox.tsx`)

```ts
import fs from "node:fs/promises"
import { createFileRoute } from "@tanstack/react-router"
import { SandboxPreview } from "~/components/docs/sandbox-preview"
import { useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute("/_docs/docs/sandbox")({
  loader: async () => {
    const report = await fs.readFile(
      new URL("../../../sandbox-report.md", import.meta.url),
      "utf-8"
    ).catch(() => "Aucun rapport — lance `/blazz-audit` d'abord.")
    return { report }
  },
  component: SandboxPage,
})

function SandboxPage() {
  const { report } = useLoaderData({ from: "/_docs/docs/sandbox" })
  return (
    <div className="flex h-full">
      {/* Panneau gauche */}
      <div className="flex-[3] overflow-y-auto border-r border-container bg-surface p-8">
        <SandboxPreview />
      </div>
      {/* Panneau droit */}
      <div className="flex-[2] overflow-y-auto bg-raised p-6">
        <pre className="whitespace-pre-wrap font-mono text-sm text-fg">{report}</pre>
      </div>
    </div>
  )
}
```

### Composant cobaye initial (`sandbox-preview.tsx`)

```tsx
// Fichier cobaye — Claude réécrit ce fichier pour les tests
import { Badge } from "@blazz/ui/components/ui/badge"

export function SandboxPreview() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Badge>Default</Badge>
      <Badge variant="positive">Positive</Badge>
      <Badge variant="negative">Negative</Badge>
      <Badge variant="caution">Caution</Badge>
    </div>
  )
}
```

### Rapport initial (`sandbox-report.md`)

```md
# Rapport Blazz Audit

Aucun composant audité pour l'instant.
Lance `/blazz-audit` sur `sandbox-preview.tsx` pour générer un rapport.
```

### Navigation

Ajouter dans `apps/docs/src/config/navigation.ts` une entrée "Sandbox" dans une section appropriée (ex: section "Outils" ou en bas du sidebar).

---

## Workflow d'utilisation

```
1. Ouvrir http://localhost:3100/docs/sandbox
2. Demander à Claude de modifier sandbox-preview.tsx
   → Vite hot reload → panneau gauche se met à jour automatiquement
3. Lancer /blazz-audit apps/docs/src/components/docs/sandbox-preview.tsx
   → Claude écrit le rapport dans sandbox-report.md
4. Recharger la page (F5)
   → Panneau droit affiche le rapport
```

---

## Ce qu'on ne fait pas

- Pas de WebSocket/live reload pour le panneau droit (trop complexe, F5 suffisant)
- Pas d'éditeur de code inline
- Pas d'authentification ou protection de la page
- Pas de versioning des rapports
