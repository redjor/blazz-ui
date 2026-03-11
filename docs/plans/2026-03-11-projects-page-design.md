# Design — Page Projets (Blazz Ops)

**Date :** 2026-03-11
**Scope :** `apps/ops/`
**Objectif :** Ajouter une page top-level listant tous les projets actifs avec acces rapide et indicateurs budget.

## Route

`/projects` — nouvelle page dans `app/(main)/projects/page.tsx`

## Sidebar

Apres "Aujourd'hui", icone `FolderOpen` de lucide-react.

## Contenu

- `PageHeader` titre "Projets"
- Filtre statut en haut a droite : "Actifs" (defaut) / "Tous"
- Liste plate de projets, tries par nom
- Chaque ligne :
  - Nom du projet (lien vers `/clients/[cid]/projects/[pid]`)
  - Sous-label : nom du client, TJM/j
  - Pastille budget (vert/orange/rouge) si budgetAmount defini
  - Pastille statut (active=vert, paused=orange, closed=gris)

## Data

- Query `listAll` existante pour les projets
- Query `listAll` ou `list` pour les clients (pour les noms)
- Budget percent calcule cote client avec les donnees existantes
- Pas de nouvelle query Convex complexe — on enrichit listAll avec budgetPercent comme listByClient

## Hors scope

- Pas de stats agregees en haut
- Pas de groupement par client
- Pas de creation de projet depuis cette page
