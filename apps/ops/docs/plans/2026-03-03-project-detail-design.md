# Design — Page Détail Projet

**Date :** 2026-03-03
**Feature :** Vue détaillée d'un projet depuis la page client
**Approche choisie :** B — Stats + chart mensuel + timeline

---

## Contexte

La page client (`/clients/[id]`) liste les projets en mode compact (nom, TJM, statut). L'utilisateur veut pouvoir cliquer sur un projet pour accéder à une vue enrichie avec les chiffres d'affaires et le détail du travail effectué.

---

## Route

```
/clients/[id]/projects/[pid]
```

Fichier : `apps/ops/app/clients/[id]/projects/[pid]/page.tsx`

---

## Structure de la page

```
Breadcrumb: Clients > [Nom client] > [Nom projet]
Titre: [Nom projet]                    Actions: [Modifier]

┌──────────┬──────────┬──────────┬──────────┐
│ CA total │ Facturé  │À facturer│  Heures  │
│  8 400€  │  6 000€  │  2 400€  │   120h   │
└──────────┴──────────┴──────────┴──────────┘

Bar chart: "Activité mensuelle"
  → 2 séries : heures (axe gauche) + CA en € (axe droit)
  → 6 derniers mois visibles par défaut

Section "Entrées"
  Filtres pills: Tout | Draft | Prêt | Facturé | Payé
  → Liste des timeEntries triées par date DESC
     date | durée | description | montant | statut badge
```

---

## Architecture technique

### Convex — Nouvelle query

Ajouter dans `convex/projects.ts` une query `getWithStats` :

```ts
// Retourne le projet + stats agrégées depuis ses timeEntries
export const getWithStats = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id)
    if (!project) return null

    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect()

    // KPI cards
    const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0)
    const totalRevenue = entries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
    const invoicedRevenue = entries
      .filter((e) => e.status === "invoiced" || e.status === "paid")
      .reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
    const pendingRevenue = totalRevenue - invoicedRevenue

    // Chart mensuel
    const byMonth: Record<string, { minutes: number; revenue: number }> = {}
    for (const e of entries) {
      const month = e.date.slice(0, 7) // "2026-03"
      if (!byMonth[month]) byMonth[month] = { minutes: 0, revenue: 0 }
      byMonth[month].minutes += e.minutes
      byMonth[month].revenue += (e.minutes / 60) * e.hourlyRate
    }
    const monthlyData = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }))

    return {
      project,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
      stats: { totalMinutes, totalRevenue, invoicedRevenue, pendingRevenue },
      monthlyData,
    }
  },
})
```

### Navigation depuis la liste client

Dans `app/clients/[id]/page.tsx`, rendre chaque ligne projet cliquable avec `Link` vers `/clients/[id]/projects/[project._id]`.

Garder le bouton crayon (edit) fonctionnel via `stopPropagation`.

### Composants utilisés

| Besoin | Composant |
|--------|-----------|
| KPI cards | `Card` de `@blazz/ui` (4 cards en grid) |
| Bar chart | `BarChart` de Recharts via `@blazz/ui` |
| Filtres statut | Pills en state local (`useState<string>`) |
| Timeline | Table simple (pas de DataGrid) |
| Statut badge | `EntryStatusBadge` (composant existant) |
| Page structure | `PageHeader` + `OpsFrame` |

---

## Données non requises (pas de changement schema)

Tout est calculable depuis les `timeEntries` existantes. Pas de migration Convex nécessaire.

---

## États UI requis

- Loading : Skeletons pour les 4 cards + chart + liste
- Empty : "Aucune entrée de temps pour ce projet" avec CTA
- Error : "Projet introuvable" si `getWithStats` retourne null
- Success : page complète

---

## Ce qui est hors-scope (phase 2)

- Heatmap GitHub-style des jours travaillés
- Champ `budget` sur les projets (progression budget)
- Export des entrées depuis cette page
