# Blazz Ops — Statuts fins sur les entrées de temps

**Date :** 2026-03-02
**Scope :** apps/ops — time tracking status system
**Approche retenue :** champ `status` optionnel additionnel (pas de migration de données)

---

## Contexte

Le schema actuel de `timeEntries` utilise deux champs booléens pour le suivi :
- `billable: boolean` — facturable ou non
- `invoicedAt?: number` — timestamp de facturation

Cela crée deux états seulement : facturable non-facturé | facturé. Il manque les étapes intermédiaires utiles pour un suivi freelance : préparer les entrées pour la facturation, distinguer facturé et payé.

---

## Statuts retenus

```
draft → ready_to_invoice → invoiced → paid
```

| Valeur | Label FR | Couleur |
|---|---|---|
| `draft` | Brouillon | gris / fg-muted |
| `ready_to_invoice` | Prêt à facturer | orange / amber |
| `invoiced` | Facturé | bleu |
| `paid` | Payé | vert |
| `null` (non billable) | Non facturable | gris dashed |

---

## Décisions

### Schema — champ additionnel optionnel

Ajouter `status` optionnel à côté de `billable` et `invoicedAt` (conservés intacts).

```ts
// convex/schema.ts
timeEntries: defineTable({
  // champs existants inchangés
  status: v.optional(
    v.union(
      v.literal("draft"),
      v.literal("ready_to_invoice"),
      v.literal("invoiced"),
      v.literal("paid"),
    )
  ),
})
```

### Dérivation du statut effectif

Les entrées existantes (sans `status`) restent valides via dérivation :

```ts
// apps/ops/lib/time-entry-status.ts
export type EntryStatus = "draft" | "ready_to_invoice" | "invoiced" | "paid"

export function getEffectiveStatus(entry: {
  status?: EntryStatus | null
  billable: boolean
  invoicedAt?: number | null
}): EntryStatus | null {
  if (!entry.billable) return null         // hors périmètre facturation
  if (entry.status) return entry.status   // nouveau champ prioritaire
  if (entry.invoicedAt) return "invoiced"  // rétrocompatibilité
  return "draft"                           // défaut legacy
}
```

### Machine d'état (transitions valides)

```
draft ──────────────────→ ready_to_invoice
ready_to_invoice ────────→ invoiced
                 ←────────
invoiced ────────────────→ paid
invoiced ────────────────→ ready_to_invoice (correction)
```

`paid` est un état terminal — pas de progression ni de retour en arrière.

### Mutation Convex

Ajouter `setStatus` pour les changements de statut individuels et en masse :

```ts
// convex/timeEntries.ts
export const setStatus = mutation({
  args: {
    ids: v.array(v.id("timeEntries")),
    status: v.union(
      v.literal("draft"),
      v.literal("ready_to_invoice"),
      v.literal("invoiced"),
      v.literal("paid"),
    ),
  },
  handler: async (ctx, { ids, status }) => {
    const now = Date.now()
    await Promise.all(
      ids.map(async (id) => {
        const patch: Record<string, unknown> = { status }
        // maintenir invoicedAt pour rétrocompat
        if (status === "invoiced") patch.invoicedAt = now
        if (status === "draft" || status === "ready_to_invoice") patch.invoicedAt = undefined
        await ctx.db.patch(id, patch)
      })
    )
  },
})
```

Mettre à jour `create` et `update` pour accepter `status?`.

---

## UI

### Composant `EntryStatusBadge`

Nouveau composant `components/entry-status-badge.tsx` affichant le badge coloré pour un statut effectif.

### Page `/time` — vue liste

- Fusionner les colonnes `Facturable` + `Statut` en une seule colonne `Statut` utilisant `EntryStatusBadge`
- Menu contextuel (row actions) avec transitions selon le statut actuel :
  - `draft` → "Marquer prêt à facturer"
  - `ready_to_invoice` → "Revenir en brouillon" + "Marquer facturé"
  - `invoiced` → "Marquer payé" + "Revenir à prêt à facturer"
  - `paid` → readonly

### Formulaire de saisie `TimeEntryForm`

- Ajouter un champ select `Statut` visible uniquement si `billable: true`
- Défaut sur `draft`

### Page `/recap`

- Étendre `listForRecap` pour filtrer par statut (au lieu de `!invoicedAt`)
- Par défaut : afficher les entrées `ready_to_invoice`
- Filtre optionnel pour voir les `invoiced` et `paid`
- Action "Marquer comme facturé" → disponible uniquement sur `ready_to_invoice`
- Nouvelle action "Marquer comme payé" → disponible sur `invoiced`

---

## Fichiers impactés

| Fichier | Changement |
|---|---|
| `convex/schema.ts` | Ajouter `status` optionnel |
| `convex/timeEntries.ts` | Ajouter `setStatus`, mettre à jour `create`/`update`/`listForRecap` |
| `apps/ops/lib/time-entry-status.ts` | Nouveau — `getEffectiveStatus` + type `EntryStatus` |
| `apps/ops/components/entry-status-badge.tsx` | Nouveau — badge coloré |
| `apps/ops/components/time-entry-form.tsx` | Ajouter champ `status` |
| `apps/ops/app/time/page.tsx` | Fusionner colonnes, mettre à jour row actions |
| `apps/ops/app/recap/page.tsx` | Filtres et actions selon nouveaux statuts |
