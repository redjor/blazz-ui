# Design : Stats pipeline client

**Date :** 2026-03-03
**App :** blazz-ops
**Page :** `/clients/[id]`

## Contexte

La page client montre les coordonnées et la liste des projets. On veut ajouter un aperçu rapide de la pipeline de facturation pour ce client, sans avoir à entrer dans chaque projet.

## Objectif

Afficher un bloc de stats agrégées sur le pipeline de facturation du client (tous ses projets confondus), pour voir d'un coup d'œil ce qui est à facturer, en attente de paiement, et le CA total.

## Design

### Composant

`StatsStrip` de `@blazz/ui/components/blocks/stats-strip` — 4 métriques en ligne, scroll horizontal natif sur mobile.

### Placement

Entre le bloc coordonnées (FieldGrid) et la section Projets.

### Métriques affichées

| Label | Définition |
|---|---|
| À facturer | Entrées billable avec `status === "ready_to_invoice"` |
| Facturé (non payé) | Entrées billable avec `status === "invoiced"` |
| Payé | Entrées billable avec `status === "paid"` |
| CA total | Toutes entrées billable, tous statuts |

Calcul : `(minutes / 60) * hourlyRate`, arrondi à l'entier, formaté `X €`.

### Loading state

`StatsStrip` avec `loading={true}` pendant le chargement Convex (query retourne `undefined`).

## Implémentation

### 1. Nouveau query Convex — `clients.getStats`

Fichier : `apps/ops/convex/clients.ts`

```ts
export const getStats = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, { clientId }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_client", (q) => q.eq("clientId", clientId))
      .collect()

    const allEntries = (
      await Promise.all(
        projects.map((p) =>
          ctx.db
            .query("timeEntries")
            .withIndex("by_project", (q) => q.eq("projectId", p._id))
            .collect()
        )
      )
    )
      .flat()
      .filter((e) => e.billable)

    const calc = (filter: (e: (typeof allEntries)[number]) => boolean) =>
      Math.round(
        allEntries.filter(filter).reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
      )

    return {
      toInvoice: calc((e) => e.status === "ready_to_invoice"),
      invoiced: calc((e) => e.status === "invoiced"),
      paid: calc((e) => e.status === "paid"),
      total: calc(() => true),
    }
  },
})
```

### 2. Mise à jour page — `apps/ops/app/clients/[id]/page.tsx`

- Ajouter `useQuery(api.clients.getStats, { clientId: id as Id<"clients"> })`
- Importer `StatsStrip`
- Insérer le bloc entre FieldGrid et section Projets

```tsx
const clientStats = useQuery(api.clients.getStats, { clientId: id as Id<"clients"> })

// Formatter helper
const fmt = (n: number) => `${n.toLocaleString("fr-FR")} €`

// Entre FieldGrid et section Projets :
<StatsStrip
  loading={clientStats === undefined}
  stats={clientStats ? [
    { label: "À facturer", value: fmt(clientStats.toInvoice) },
    { label: "Facturé (non payé)", value: fmt(clientStats.invoiced) },
    { label: "Payé", value: fmt(clientStats.paid) },
    { label: "CA total", value: fmt(clientStats.total) },
  ] : []}
/>
```

## Ce qui est hors scope

- Couleurs conditionnelles (orange si > 0) — non supporté par `StatsStrip` sans modification
- Breakdown par projet — voir les stats détaillées sur la page projet (`/clients/[id]/projects/[pid]`)
- Filtrage par période (mois courant, etc.) — à envisager plus tard si besoin
