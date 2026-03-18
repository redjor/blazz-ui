# Design: Tags sur les Notes

**Date**: 2026-03-18
**Scope**: `apps/ops` uniquement

## Contexte

Ajouter un système de tags avec couleurs prédéfinies sur les notes de l'app Ops.
Objectif : filtrage, catégorisation visuelle, et organisation transverse des notes.

## Data model

### Nouvelle table `tags`

```
tags {
  userId: string
  name: string        // ex: "urgent", "idée", "ref"
  color: string       // clé de la palette (voir ci-dessous)
  createdAt: number
}
index: by_user [userId]
```

### Modification de `notes`

Ajouter un champ :
```
tags: v.optional(v.array(v.id("tags")))
```

## Palette de couleurs (9 couleurs)

| Clé      | Usage                |
|----------|----------------------|
| gray     | Neutre, par défaut   |
| blue     | Info, référence      |
| teal     | Technique            |
| green    | Validé, positif      |
| yellow   | Attention            |
| orange   | En cours             |
| pink     | Personnel            |
| red      | Urgent, critique     |
| purple   | Idée, créatif        |

Chaque couleur mappe vers une paire bg/text en CSS (light + dark).

## UX

### Ajout de tags sur une note

- Bouton "+" dans la toolbar de l'éditeur (à côté de Pin / Supprimer)
- Ouvre un Popover avec :
  - Champ de recherche en haut
  - Liste des tags existants avec checkbox toggle
  - Si aucun match → option "Créer [nom]" avec sélecteur de couleur inline (9 dots)

### Affichage des tags

- **Éditeur** : badges colorés (dot + nom) sous le titre, avant le contenu
- **Sidebar TreeView** : petits dots colorés à droite du nom de la note

### Mutations Convex

- `tags.list` — tous les tags du user
- `tags.create({ name, color })` — créer un tag
- `tags.remove({ id })` — supprimer un tag (retirer des notes concernées)
- `notes.update` — existant, ajouter support du champ `tags`

## Hors scope (MVP)

- Filtrage de la sidebar par tag
- Tags sur d'autres entités (clients, projets, todos, timeEntries)
- Renommage / édition de tag
- Gestion des tags (page dédiée)
