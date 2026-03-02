# Time Week Grid — Design Document

**Date**: 2026-03-02
**Scope**: Blazz Ops — amélioration gestion des temps
**Status**: Approved

## Problème

La saisie des temps actuelle (page `/time`) est une DataTable sans contexte temporel. Pour les projets qui s'étalent sur plusieurs semaines, il faut naviguer sans voir d'un coup d'œil les jours non saisis. L'utilisateur veut pouvoir cliquer directement sur un jour pour logger rapidement.

## Solution

Vue semaine intégrée dans la page `/time` via un switcher d'onglets **Liste | Semaine**.

## Layout

```
< Semaine précédente    3 – 9 mars 2026    Semaine suivante >

                  Lun 3  Mar 4  Mer 5  Jeu 6  Ven 7  Sam 8  Dim 9  Total
Client A / Proj   [ 4h ] [  —  ] [ 4h ] [ 4h ] [  —  ]  ···   ···   12h
Client B / Proj   [  —  ] [ 2h ] [  —  ] [  —  ] [ 2h ]  ···   ···    4h
─────────────────────────────────────────────────────────────────────────
Total jour          4h     2h    4h     4h     2h                   16h
```

### Règles visuelles

- Cellule remplie : durée en monospace, fond coloré (accent brand)
- Cellule vide : cliquable, grisée, curseur pointer
- Samedi/Dimanche : colonnes plus ternes (opacity réduite)
- Total par ligne (colonne droite) + total par colonne (ligne bas)
- Multi-entrées sur le même projet+jour : somme affichée, badge `+N` si > 1 entrée

## Interaction

### Clic sur n'importe quelle cellule (vide ou remplie)

Ouvre un **modal rapide** de saisie. Toujours en mode "ajout" (create).

### Champs du modal

| Champ | Comportement |
|-------|-------------|
| Date | Lecture seule, affichée en clair ("Jeudi 6 mars") |
| Projet | Lecture seule (nom projet + client) |
| Durée | Input texte, parse "4h" / "1h30" / "90min" / "90" → minutes |
| Description | Textarea optionnel |
| Billable | Checkbox, coché par défaut |

## Data Flow

### Queries (existantes, pas de changement Convex)

- `api.timeEntries.list({ from, to })` — entrées de la semaine (lundi → dimanche)
- `api.projects.listActive` — projets à afficher en lignes

### Groupement côté client

```ts
// Map<`${projectId}_${date}`, TimeEntry[]>
groupBy(entries, e => `${e.projectId}_${e.date}`)
```

### Mutation

`api.timeEntries.create` — mutation existante, aucun changement backend.

## Composants à créer

1. **`WeekGrid`** — composant principal, grille tableau
2. **`WeekCell`** — cellule individuelle (vide ou remplie)
3. **`QuickTimeEntryModal`** — modal rapide de saisie (projet + date pré-remplis)

## Composants à modifier

- `apps/ops/app/time/page.tsx` — ajouter switcher d'onglets + état `view: "list" | "week"`

## Non-inclus (YAGNI)

- Édition d'une entrée depuis la grille (utiliser la vue Liste pour ça)
- Timer en live (chrono)
- Vue mois
- Drag & drop des entrées
