# Budget forfait sur les contrats

**Date** : 2026-03-18
**Scope** : apps/ops uniquement

## Contexte

Le type de contrat `"forfait"` existe dans le schema Convex mais n'a aucun champ budget ni suivi de consommation. L'utilisateur veut pouvoir saisir un montant fixe (€) sur un contrat forfait et suivre la consommation vs ce budget.

## Design

### Schema Convex

Ajouter `budgetAmount: v.optional(v.number())` sur la table `contracts`.
Utilisé uniquement quand `type === "forfait"`.

### Formulaire contrat

Dans `ContractForm`, afficher un champ **"Budget forfait (€)"** quand le type sélectionné est `"forfait"`.
Même pattern conditionnel que `daysPerMonth` pour TMA.

### Métriques forfait

Nouvelle fonction `computeForfaitMetrics()` dans `lib/contracts.ts` :
- Input : `budgetAmount` + time entries billable pendant la période du contrat
- Output : `{ budgetTotal, consumed, remaining, percentUsed, health }`
- Health : mêmes seuils que l'existant (ok < 70%, warning < 90%, danger < 100%, over ≥ 100%)
- Consommation calculée par revenu : `minutes × hourlyRate`

### UI — ContractSection

Quand contrat forfait actif : barre de progression (budget consommé / total) + health badge.
Réutiliser les composants `Progress` et badges existants.
Pas de chart burn-down, pas de KPI cards — juste le minimum.

### Ce qui ne change pas

- Le `budgetAmount` sur `projects` reste indépendant
- La logique TMA ne bouge pas
- La facturation reste au temps passé
