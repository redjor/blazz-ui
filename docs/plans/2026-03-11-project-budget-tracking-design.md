# Design — Pilotage budget projet (Blazz Ops)

**Date :** 2026-03-11
**Scope :** `apps/ops/`
**Objectif :** Permettre le suivi budgetaire par projet pour un freelance — savoir en un coup d'oeil si on depasse, si on sous-facture, et combien il reste.

## Schema

Un seul champ ajoute sur `projects` :

- `budgetAmount`: `number | undefined` — montant forfaitaire en euros, optionnel

## Formules derivees (pas stockees)

| Indicateur | Formule |
|---|---|
| Jours vendus | `budgetAmount / tjm` |
| Jours consommes | `sum(minutes billable) / (hoursPerDay * 60)` |
| % consomme | `jours consommes / jours vendus` |
| Reste | `budgetAmount - sum(revenue billable)` |
| TJM effectif | `sum(revenue billable) / jours consommes` |

## Page projet (`/clients/[id]/projects/[pid]`)

### KPI Card — TJM effectif
- Ajoutee aux cards existantes (Revenu total, Facture, En attente, Heures)
- Vert si >= TJM vendu, rouge si inferieur
- Sous-label : "TJM vendu : 750 EUR"

### Barre de progression budget
- Pleine largeur, sous les cards
- Seuils couleur : vert < 70%, orange 70-90%, rouge > 90%
- Label : "12 450 EUR / 15 000 EUR (83%) — reste 2 550 EUR (~3,4j)"

### Banniere alerte
- Au-dessus de la barre de progression
- 80% consomme -> bandeau orange
- 100%+ depasse -> bandeau rouge
- < 80% -> rien

### Sparkline burn-down
- Petit chart sous la barre de progression
- Axe X : semaines depuis startDate
- Axe Y : budget restant (EUR)
- Ligne theorique (lineaire) vs ligne reelle

## Liste projets (`/clients/[id]`)

- Pastille coloree a cote du nom du projet
- Vert < 70%, Orange 70-90%, Rouge > 90%, Gris si pas de budget

## Formulaire projet (ProjectForm)

- Champ "Budget (EUR)" — input number, optionnel, apres TJM
- Placeholder : "Ex: 15 000"
- Calcul live en dessous : "~= 20 jours a 750 EUR/j"

## Hors scope

- Pas de notifications push/email
- Pas de nouveau ecran/page
- Pas de table budget separee
- Pas de type de budget (un seul champ montant)
