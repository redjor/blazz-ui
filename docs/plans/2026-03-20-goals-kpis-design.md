# Goals & KPIs — Design Document

**Date**: 2026-03-20
**App**: apps/ops (freelance management)
**Status**: Approved

## Context

L'app ops track le temps, la facturation et les projets mais n'a aucun système d'objectifs.
Tout est descriptif (ce qui s'est passé) mais rien n'est prescriptif (où on veut aller).

Le user est freelance + créateur produit (@blazz/pro, pas encore en vente).
Côté freelance : 18j/mois facturables, 10 000€/mois CA cible.
Côté produit : pas de KPIs pour l'instant — à ajouter quand @blazz/pro sera en vente.

## Décisions

- **Approche B** : un document `goalPlan` par année (pas de table goals granulaire, pas de settings KV)
- **Granularité** : annuel → trimestriel (auto) → mensuel (auto avec overrides)
- **Redistribution** : l'annuel est la source de vérité. Les mois non-overridés se partagent le reste.
- **Actuals calculés** : zéro saisie — tout vient des `timeEntries` existantes (billable, agrégées)

## Data Model

### Table `goalPlans`

```ts
goalPlans: defineTable({
  userId: v.string(),
  year: v.number(),
  revenue: v.object({
    annual: v.number(),                         // ex: 120000 (euros)
    overrides: v.record(v.string(), v.number()), // { "8": 0, "12": 5000 }
  }),
  days: v.object({
    annual: v.number(),                         // ex: 216
    overrides: v.record(v.string(), v.number()), // { "8": 0 }
  }),
  tjm: v.object({
    target: v.number(),                         // ex: 556 (€/jour)
  }),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_year", ["userId", "year"])
```

### Redistribution (pure function)

```ts
function resolveMonthlyTargets(annual: number, overrides: Record<string, number>): number[] {
  // 1. Identifier mois overridés vs mois "auto"
  // 2. reste = annual - somme(overrides)
  // 3. Répartir reste / nombre de mois auto
  // Retourne array[12] : [jan, fev, ..., dec]
}
```

Exemple :
```
annual: 120000, overrides: { "8": 0, "12": 5000 }
→ reste = 115000, mois auto = 10
→ [11500, 11500, 11500, 11500, 11500, 11500, 11500, 0, 11500, 11500, 11500, 5000]
```

### Convex functions

```
goals.get(year)            → goalPlan | null
goals.dashboard(year)      → KPIs calculés (targets + actuals)
goals.save(year, revenue, days, tjm) → upsert
```

### Query `goals.dashboard` — shape retournée

```ts
{
  year: 2026,
  revenue: {
    annual:  { target: 120000, actual: 87500, percent: 73 },
    quarter: { target: 30000, actual: 28000, percent: 93, label: "Q1" },
    month:   { target: 11500, actual: 9200, percent: 80, label: "Mars" },
    monthlyTargets: number[],  // 12 cibles résolues
    monthlyActuals: number[],  // 12 réels
  },
  days: {
    annual:  { target: 216, actual: 158, percent: 73 },
    quarter: { target: 54, actual: 51, percent: 94 },
    month:   { target: 18, actual: 14, percent: 78 },
    monthlyTargets: number[],
    monthlyActuals: number[],
  },
  tjm: {
    target: 556,
    actual: 580,
    trend: +4.3,
  }
}
```

Actuals calculés depuis `timeEntries` (billable) agrégées par mois.
TJM actual = revenu réel total / jours réels total.

## UI

### Dashboard — Section Objectifs

Ajoutée sous le pipeline financier. Card compacte avec 3 progress bars :

```
┌─────────────────────────────────────────────────────────┐
│  Objectifs Mars 2026                                    │
│                                                         │
│  Revenu     ████████████░░░░  €9 200 / €11 500    80%  │
│  Jours      ██████████░░░░░░  14 / 18j            78%  │
│  TJM moyen  ████████████████  €580 (cible €556)  104%  │
│                                                         │
│  Q1 : €28 000 / €30 000 (93%)     2026 : 73%           │
└─────────────────────────────────────────────────────────┘
```

Couleurs progress bar : vert > 90%, ambre 70-90%, rouge < 70%.
Lien "Voir détails →" vers `/goals`.

### Page `/goals`

```
PageHeader "Objectifs 2026" [année ▼]  [Modifier les cibles]
↓ 24px
StatsGrid (4 KPIs)
  CA Annuel | CA Mois | Jours | TJM
↓ 24px
Grid 2 colonnes
  Bar chart revenu (actual vs target, 12 mois)
  Bar chart jours (actual vs target, 12 mois)
↓ 24px
Tableau récap trimestriel (Q1-Q4 + total année)
  Colonnes : Cible | Réel | % | Écart
```

Charts : barres groupées (target en opacity-20, actual en plein).
Mois futurs : barre target visible, pas de barre actual.

### Dialog "Modifier les cibles"

```
Année : [2026 ▼]

─── Revenu ───
Objectif annuel    [120 000] €
Override par mois :
  Jan [—]  Fev [—]  Mar [—]  Avr [—]
  Mai [—]  Jun [—]  Jul [—]  Aoû [0]
  Sep [—]  Oct [—]  Nov [—]  Déc [5000]

─── Jours ───
Objectif annuel    [216] jours
Override par mois  (même grille)

─── TJM ───
TJM cible          [556] €/jour

[Annuler]  [Sauvegarder]
```

"—" = valeur auto-calculée affichée en placeholder (text-muted).
Champ vide = auto. Champ rempli = override.
Preview en temps réel via `resolveMonthlyTargets` côté client.

### Navigation

Nouveau lien sidebar après "Finances" :
```
Finances
Goals        ← icône Target (lucide-react)
```

### États

- **Empty** : icône Target + "Pas encore d'objectifs" + CTA ouvre le dialog
- **Loading** : Skeleton StatsGrid + charts
- **Error** : Message + retry
- **Données partielles** : mois futurs sans actual, barres target visibles

## Scope out

- KPIs produit (MRR, churn) → quand @blazz/pro en vente
- Charges / dépenses → feature séparée
- Alertes automatiques (agent "tu es en retard") → feature séparée
- Historique multi-année (comparaison 2025 vs 2026) → V2
