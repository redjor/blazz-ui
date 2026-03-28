# Goals — Projection hybride avec contrats

**Date** : 2026-03-28
**Scope** : `apps/ops` uniquement

## Problème

La page Goals projette le revenu annuel uniquement à partir du rythme réel (time entries billable). Les contrats signés (TMA, Régie, Forfait) ne sont pas pris en compte — un contrat annuel garanti n'apparaît pas dans la projection tant que le temps n'est pas logué.

## Design

### 1. Projection hybride (fin d'année)

Pour chaque mois de l'année :

| Période | Source |
|---------|--------|
| Mois passé (< currentMonth) | Revenu réel (monthlyRevenue) — inchangé |
| Mois en cours (= currentMonth) | Extrapolation rythme actuel — inchangé |
| Mois futur (> currentMonth) | `max(contractRevenue, revenueTarget)` |

- `contractRevenue` = somme du revenu des contrats actifs ce mois-là
- `revenueTarget` = cible mensuelle du goalPlan (via `resolveTargets`)
- On prend le max : si les contrats couvrent plus que la cible, on prend le contractuel ; sinon on garde la cible (hypothèse optimiste : "j'atteindrai ma cible")

**Projection fin d'année** = Σ(mois passés réels) + projection mois en cours + Σ(mois futurs hybrides)

### 2. Nouvelle stat "Sécurisé" dans le StatsGrid

Ajout d'une 5e stat card :

- **Label** : "Sécurisé"
- **Value** : total du revenu contractuel sur l'année
- **Description** : `/ {cible annuelle}`
- **Icon** : `ShieldCheck` (lucide)
- **Trend** : % de la cible annuelle couverte par contrats - 100

Le StatsGrid passe de `columns={4}` à `columns={5}`.

### 3. Calcul du revenu contractuel mensuel

Réutilisation de la logique treasury existante, factorisée :

| Type contrat | Revenu mensuel |
|-------------|----------------|
| TMA | `daysPerMonth × project.tjm` |
| Régie | `20 × project.tjm` |
| Forfait | `budgetAmount / totalMonths` |

Un contrat contribue au mois `i` ssi `startDate <= mois <= endDate` et `status === "active"`.

### 4. Factorisation

Extraire `contractMonthlyRevenue(contract, project)` dans `convex/lib/contracts.ts`, utilisable par :
- `convex/goals.ts` (query `dashboard`)
- `convex/treasury.ts` (query `forecast`)

## Ce qui ne change PAS

- Charts mensuels (barres cible/réel) — inchangés
- Tableau récap trimestriel — inchangé
- Projection fin de mois — inchangée (reste l'extrapolation du rythme actuel)
- GoalsConfigDialog — inchangé

## Données ajoutées au retour de `goals.dashboard`

```ts
{
  // ... existant ...
  secured: {
    annual: number       // total revenu contractuel sur l'année
    percent: number      // % de la cible annuelle couverte
    monthlyBreakdown: number[]  // revenu contractuel par mois (12 entries)
  }
}
```
