# Todos — Système de catégories et tags

**Date:** 2026-03-03
**Scope:** `apps/ops`

## Résumé

Ajout d'un système de catégorie (1 par todo, dynamique, gérée par l'utilisateur) et de tags (multiple, free-form avec autocomplete) aux todos de Blazz Ops.

## Data Model

### Nouvelle table `categories`

```ts
categories: defineTable({
  name: v.string(),
  color: v.optional(v.string()),  // ex: "indigo", "rose", "emerald"
  createdAt: v.number(),
})
```

### Modifications `todos`

```ts
categoryId: v.optional(v.id("categories")),
tags: v.optional(v.array(v.string())),
```

Index supplémentaire : `.index("by_category", ["categoryId"])`

## Backend Convex

### `convex/categories.ts` (nouveau fichier)

| Fonction | Type | Description |
|---|---|---|
| `list` | query | Toutes les catégories triées par nom |
| `create` | mutation | `name`, `color?` |
| `update` | mutation | `id`, `name?`, `color?` |
| `remove` | mutation | `id` — nullifie `categoryId` sur les todos liés |

### `convex/todos.ts` (modifications)

| Fonction | Changement |
|---|---|
| `create` | Ajout args `categoryId?`, `tags?` |
| `update` (nouveau) | Mutation générale remplaçant `updateText` + `updatePriority` + `linkProject` |
| `updateTags` (nouveau) | Patch rapide `tags` seul |
| `updateCategory` (nouveau) | Patch rapide `categoryId` seul |
| `listAllTags` (nouveau) | Query — extrait les tags distincts de tous les todos (autocomplete) |

## Frontend UI

### Formulaires Add/Edit todo

- `Select` catégorie optionnel — liste des catégories avec badge coloré
- `TagInput` — combobox custom : tape un tag → Enter pour ajouter, autocomplete sur tags existants, chips suppressibles

### Carte kanban (`TodoCard`)

- Badge catégorie coloré sous le titre
- Chips tags en ligne (petits, tronqués si > 3)

### Filtre kanban

- Bar de chips au-dessus du board : `Tous | Dev | Design | Admin ...`
- Sélection filtre les 4 colonnes simultanément

### Vue liste (DataTable)

- Colonne `Catégorie` — badge coloré, sortable
- Colonne `Tags` — chips inline, non sortable
- Advanced filters existants couvrent le filtrage

### Gestion des catégories

- Bouton "Catégories" dans le PageHeader → Sheet avec liste + form inline
- Couleurs disponibles (8 fixes) : `indigo`, `violet`, `rose`, `orange`, `amber`, `emerald`, `sky`, `zinc`

## Décisions clés

- **Catégories dynamiques** dans Convex (pas hard-codées) pour permettre rename/delete
- **Tags free-form** stockés comme `string[]` sur le todo (pas de table dédiée)
- **`update` unifié** sur todos pour réduire les appels parallèles dans le dialog d'édition
- `remove` sur une catégorie nullifie les todos liés (pas de cascade delete)
