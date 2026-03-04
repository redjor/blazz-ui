# Design — Filtrage serveur + pagination curseur pour la liste des temps

**Date:** 2026-03-04
**App:** `apps/ops`
**Scope:** Vue Liste de `app/(main)/time/page.tsx`

## Contexte

La vue Liste charge actuellement **toutes** les entrées via `useQuery(api.timeEntries.list, {})` — filtrage, tri et pagination sont 100% client-side dans le DataTable. Pas scalable à l'échelle.

## Approche choisie

**`usePaginatedQuery` + "Load more"** — Convex natif, scalable.

## 1. Convex — Nouvelle query `listPaginated`

Fichier : `apps/ops/convex/timeEntries.ts`

```ts
export const listPaginated = query({
  args: {
    projectId: v.optional(v.id("projects")),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("ready_to_invoice"),
      v.literal("invoiced"),
      v.literal("paid")
    )),
    billable: v.optional(v.boolean()),
    from: v.optional(v.string()),   // "yyyy-MM-dd"
    to: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { projectId, status, billable, from, to, paginationOpts }) => {
    const q = ctx.db.query("timeEntries").withIndex("by_date").order("desc")
    return q
      .filter((q) => {
        let cond = q.gt(q.field("_id"), "")  // always true base
        if (projectId) cond = q.and(cond, q.eq(q.field("projectId"), projectId))
        if (status !== undefined) cond = q.and(cond, q.eq(q.field("status"), status))
        if (billable !== undefined) cond = q.and(cond, q.eq(q.field("billable"), billable))
        if (from) cond = q.and(cond, q.gte(q.field("date"), from))
        if (to) cond = q.and(cond, q.lte(q.field("date"), to))
        return cond
      })
      .paginate(paginationOpts)
  }
})
```

Index utilisé : `by_date` (déjà dans le schema). Tri : `desc` (plus récent en premier).

## 2. UI — Barre de filtres + DataTable

Fichier : `apps/ops/app/(main)/time/page.tsx` (vue `list` uniquement)

### Barre de filtres

```
[Projet ▼]  [Statut ▼]  [Du: ____]  [Au: ____]  [✓ Facturable]  [Reset]
```

Composants utilisés :
- `Select` (Base UI) pour Projet et Statut
- `Input type="date"` pour les dates
- `Button` toggle ou `Checkbox` pour Facturable
- Bouton "Reset" qui remet tous les filtres à undefined

### DataTable

- `usePaginatedQuery(api.timeEntries.listPaginated, filters, { initialNumItems: 25 })`
- DataTable : `enablePagination={false}` (pagination gérée par Convex)
- `enableGlobalSearch` reste actif (recherche client-side sur les entrées chargées)
- Tri dans le DataTable reste client-side sur les entrées chargées
- Bouton "Charger plus" sous le tableau, visible si `status !== "Exhausted"`
- Texte indicatif : "N entrées affichées" / "Toutes les entrées affichées"

### États

- `status === "LoadingFirstPage"` → skeleton / isLoading
- `status === "LoadingMore"` → bouton "Charger plus" en loading
- `status === "Exhausted"` → bouton masqué + "Toutes les entrées affichées"
- `status === "CanLoadMore"` → bouton "Charger 25 de plus" actif

## 3. Comportement des filtres

Quand un filtre change, `usePaginatedQuery` **reset automatiquement** le curseur — les résultats repartent de la première page du nouveau filtre. Pas besoin de gestion manuelle.

## Fichiers à modifier

1. `apps/ops/convex/timeEntries.ts` — ajouter `listPaginated`
2. `apps/ops/app/(main)/time/page.tsx` — remplacer `useQuery(list)` par `usePaginatedQuery(listPaginated)` + ajouter barre de filtres

## Hors scope

- Tri serveur (fixé `date DESC` par l'index)
- La query `list` existante reste inchangée (utilisée dans d'autres contextes)
- La vue Semaine n'est pas affectée
