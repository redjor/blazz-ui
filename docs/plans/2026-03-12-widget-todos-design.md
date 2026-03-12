# BlazzTime Widget — Todos du jour

**Date:** 2026-03-12
**Status:** Validated

## Goal

Widget macOS medium (WidgetKit) affichant les todos du jour dans le Centre de notifications / Bureau. Affichage passif, refresh toutes les 30 min.

## UI

```
┌──────────────────────────────────────────┐
│  📋 Aujourd'hui              3 tâches    │
│                                          │
│  🔴 Envoyer facture client Acme          │
│  🟡 Revoir PR design system             │
│  🔵 Préparer démo vendredi             │
│                                          │
│  Mis à jour à 14:30                      │
└──────────────────────────────────────────┘
```

- Pastilles couleur par priorité : urgent = rouge, high = orange, normal = bleu, low = gris
- Max 5 todos affichés
- Compteur en haut à droite
- Timestamp du dernier refresh
- État vide : "Rien pour aujourd'hui" + check vert

## Architecture

- Widget Extension target `BlazzTimeWidget` dans le même Xcode project
- App Group `group.dev.blazz.blazztime` partagé pour le token Keychain
- Appel direct API HTTP Convex via URLSession dans le TimelineProvider
- Refresh timeline toutes les 30 min

## Convex

Nouvelle query `todos:listByDate`:
- Args: `{ date: string }`
- Filtre: `dueDate == date && status != "done"`
- Tri: par priorité (urgent > high > normal > low)

## Fichiers

- Créer: `BlazzTimeWidget/BlazzTimeWidget.swift` — entry point + views
- Créer: `BlazzTimeWidget/TodoProvider.swift` — TimelineProvider + HTTP
- Modifier: `convex/todos.ts` — ajouter listByDate
- Modifier: `project.yml` — ajouter target widget

## Hors scope

- Interaction / deep link au clic
- Taille small
- Configuration utilisateur du widget
