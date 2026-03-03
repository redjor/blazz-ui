# Design — Todos: Vue Liste avec DataTable

**Date:** 2026-03-03
**App:** `apps/ops`
**Status:** Approved

## Context

La page `/todos` a actuellement une vue kanban uniquement. On ajoute une vue liste via le DataTable de `@blazz/ui`, avec un toggle kanban/liste dans le header.

## Blazz-UI Principles Applied

- **Density** : 13px font-size, row-height 40px, padding serré
- **Tufte** : colonne priorité = barre colorée sans label (pas de texte redondant)
- **Double codage** : statut = dot ● + texte (couleur + forme + mot)
- **Progressive disclosure** : actions secondaires sous menu ⋯ au hover
- **Valeurs manquantes** : `—` (em dash), jamais vide

## Architecture

- Nouveau fichier `apps/ops/components/todos-preset.tsx` — preset autonome
- `apps/ops/app/todos/page.tsx` — ajout du toggle + rendu conditionnel
- Pattern identique à `packages/ui/src/components/blocks/data-table/presets/linear-issues.tsx`

## Toggle kanban / liste

Deux icônes boutons (`Columns3` / `LayoutList`) dans le `PageHeader` à droite.
State `viewMode: "kanban" | "list"` dans `TodosPage`.
Transition 150ms ease-out sur le switcher.

## Preset `todos-preset.tsx`

### Colonnes

| Colonne | Rendu | Tri |
|---|---|---|
| `priority` | Barre verticale colorée 3×14px (urgent=destructive, high=orange-500, normal=edge, low=fg-muted/30) — pas de label | Oui |
| `text` | `font-medium text-fg` ligne 1 + `description` en `text-xs text-fg-muted` ligne 2 (cell two-lines) | Oui |
| `status` | Dot 6px + label (Triage / Todo / En cours / Fait) | Oui |
| `project` | Nom du projet résolu depuis `projects[]`, `—` si absent | Non |
| `createdAt` | Date relative fr-FR : "Il y a 2j" si < 7 jours, "15 jan." sinon | Oui |
| Actions | Menu ⋯ (visible au hover) : Modifier → EditTodoDialog, Supprimer | — |

### Color maps

```ts
const priorityBarMap = {
  urgent: "bg-destructive",
  high: "bg-orange-500",
  normal: "bg-edge",
  low: "bg-fg-muted/30",
}

const statusDotMap = {
  triage: "bg-zinc-400",
  todo: "bg-zinc-500",
  in_progress: "bg-yellow-500",
  done: "bg-green-500",
}

const statusLabelMap = {
  triage: "Triage",
  todo: "Todo",
  in_progress: "En cours",
  done: "Fait",
}
```

### Views (onglets)

```ts
createStatusViews({
  column: "status",
  statuses: [
    { id: "triage", name: "Triage", value: "triage" },
    { id: "todo", name: "Todo", value: "todo" },
    { id: "in_progress", name: "En cours", value: "in_progress" },
    { id: "done", name: "Fait", value: "done" },
  ],
  allViewName: "Tous",
})
```

### Row actions

```ts
createCRUDActions({
  onEdit,   // → ouvre EditTodoDialog existant
  onDelete, // → appelle mutation remove
  labels: { edit: "Modifier", delete: "Supprimer" },
})
```

Pas de `onView` (pas de page détail pour un todo).

### Interface

```ts
export interface TodosPresetConfig {
  projects: { _id: string; name: string }[]
  onEdit?: (todo: Todo) => void
  onDelete?: (todo: Todo) => void
  onBulkDelete?: (todos: Todo[]) => void
}
```

## Intégration dans `TodosPage`

1. `useQuery(api.projects.listActive, {})` → déjà présent
2. `viewMode` state + toggle boutons dans le `PageHeader` actions slot
3. Rendu conditionnel :
   - `viewMode === "kanban"` → kanban existant (inchangé)
   - `viewMode === "list"` → `<DataTable>` avec le preset

## Out of Scope

- Pagination (Convex retourne tout, pas besoin côté client)
- Filtres texte (la vue kanban ne les a pas)
- Édition inline dans la table
- Drag & drop dans la liste
