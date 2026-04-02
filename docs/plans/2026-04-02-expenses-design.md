# Frais professionnels — Design

**Date :** 2026-04-02
**App :** apps/ops
**Route :** `/expenses`

## Contexte

Page de suivi des frais professionnels pour justifier les dépenses de restaurants (convives + motif) et les déplacements véhicule (indemnités kilométriques URSSAF). Pas d'upload de justificatifs, pas d'export — saisie manuelle uniquement.

## Data Model

### Table `expenses`

```
expenses {
  userId              Id<"users">
  type                "restaurant" | "mileage"
  date                string (YYYY-MM-DD)
  amountCents         number (montant TTC en centimes, restaurant uniquement)
  clientId?           Id<"clients"> optionnel
  projectId?          Id<"projects"> optionnel
  notes?              string optionnel

  // Restaurant
  guests?             string (noms des convives)
  purpose?            string (motif du repas)

  // Déplacement
  departure?          string (lieu de départ)
  destination?        string (lieu d'arrivée)
  distanceKm?         number
  reimbursementCents? number (calculé auto via barème URSSAF)
}
```

Index : `by_userId_date` sur `(userId, date)`.

### Table `vehicleSettings`

```
vehicleSettings {
  userId              Id<"users">
  fiscalPower         number (CV fiscaux : 3, 4, 5, 6, 7)
  vehicleType         "car" | "motorcycle"
}
```

## Navigation

Nouvelle entrée "Frais pro" dans le groupe "Finances" de la sidebar.
Feature flag : `expenses`.

## Page `/expenses`

### Stats cards (haut de page)

3 cards récap du mois filtré :
- Total restaurants (€)
- Total km parcourus
- Total indemnités kilométriques (€)

### Liste

DataTable chronologique (plus récent en haut) avec colonnes :
- Date
- Type (badge "Restaurant" ou "Déplacement")
- Description (guests + purpose pour resto, départ → destination pour trajet)
- Client (optionnel, nom cliquable)
- Montant (€ pour resto, `X km — Y €` pour trajet)

Filtres : type (tous / restaurants / déplacements), mois.

### Actions

- Bouton "Ajouter" avec dropdown : "Restaurant" / "Déplacement"
- Clic sur une ligne → dialog d'édition pré-remplie
- Menu "..." par ligne → supprimer (avec confirmation)

## Formulaires (Dialog modale)

### Restaurant

| Champ | Type | Requis | Défaut |
|-------|------|--------|--------|
| Date | Datepicker | oui | aujourd'hui |
| Montant TTC | Number (€) | oui | — |
| Convive(s) | Texte libre | non | — |
| Motif | Texte libre | non | — |
| Client | Select (clients existants) | non | — |
| Projet | Select (filtré par client) | non | — |
| Notes | Textarea | non | — |

### Déplacement

| Champ | Type | Requis | Défaut |
|-------|------|--------|--------|
| Date | Datepicker | oui | aujourd'hui |
| Départ | Texte libre | oui | — |
| Destination | Texte libre | oui | — |
| Distance km | Number | oui | — |
| Indemnité | Lecture seule (calculée) | — | — |
| Client | Select | non | — |
| Projet | Select (filtré par client) | non | — |
| Notes | Textarea | non | — |

Validation zod : date requise, montant > 0 (resto), distance > 0 (trajet).

## Barème kilométrique URSSAF 2025 (voitures)

| CV fiscaux | ≤ 5 000 km | 5 001 – 20 000 km | > 20 000 km |
|---|---|---|---|
| 3 CV | d × 0.529 | (d × 0.316) + 1 065 | d × 0.370 |
| 4 CV | d × 0.606 | (d × 0.340) + 1 330 | d × 0.407 |
| 5 CV | d × 0.636 | (d × 0.357) + 1 395 | d × 0.427 |
| 6 CV | d × 0.665 | (d × 0.374) + 1 457 | d × 0.447 |
| 7 CV+ | d × 0.697 | (d × 0.394) + 1 515 | d × 0.470 |

**Logique :**
1. Récupérer la config véhicule (fiscalPower)
2. Calculer le cumul km annuel (tous les trajets de l'année)
3. Appliquer le barème selon la tranche
4. Stocker `reimbursementCents` sur l'expense
5. Recalculer si modification/suppression d'un trajet antérieur

## Settings véhicule

Nouveau bloc dans `/settings` : "Véhicule" avec 2 champs (puissance fiscale, type véhicule).

## Hors scope

- Upload de justificatifs
- Export CSV
- OCR
- Barème motos (à ajouter plus tard si besoin)
