# Favorites System — Design

**Date:** 2026-03-28
**Scope:** apps/ops

## Summary

Système de favoris universel permettant de mettre en favoris clients, projets, todos, notes, bookmarks et feed items. Les favoris apparaissent dans la sidebar dans un groupe "Favoris" juste après Inbox, avec drag & drop pour réordonner.

## Data Model

Table Convex `favorites` dédiée :

```typescript
favorites: defineTable({
  userId: v.string(),
  entityType: v.union(
    v.literal("client"),
    v.literal("project"),
    v.literal("todo"),
    v.literal("note"),
    v.literal("bookmark"),
    v.literal("feedItem"),
  ),
  entityId: v.string(),       // ID polymorphique vers l'entité source
  label: v.string(),          // dénormalisé, tronqué ~30 chars
  order: v.number(),          // pour drag & drop (réindexation séquentielle)
}).index("by_user_order", ["userId", "order"])
  .index("by_user_entity", ["userId", "entityType", "entityId"])
```

- `label` dénormalisé au moment de l'ajout
- `order` : entiers séquentiels (1, 2, 3...), recalculés au drop
- Index `by_user_entity` pour lookup rapide (est-ce que cette entité est en favori ?)

## Sidebar — Groupe "Favoris"

- Position : après Inbox, avant Activité dans le groupe Main
- Chaque favori = lien direct vers la page de l'entité
- Label tronqué ~30 chars avec "..."
- Icône du type d'entité (client, project, todo, note, bookmark, feedItem)
- Drag & drop pour réordonner (@dnd-kit, déjà dans le projet)
- Toujours visible (pas collapsible)
- Masqué si 0 favoris

## Action favori — Étoile dans le page header

- Étoile vide à côté du titre → clic = ajouter
- Étoile pleine (couleur accent) → clic = retirer
- Animation scale bounce au toggle
- Mutations :
  - `favorites.add({ entityType, entityId })` → dénormalise label, order = max + 1
  - `favorites.remove({ entityType, entityId })` → supprime la row
- Pas de confirmation pour retirer (réversible)

## Drag & drop

- @dnd-kit (déjà disponible)
- Au drop : mutation `favorites.reorder` qui réindexe séquentiellement tous les items
- Petite liste (< 20 items typiquement), pas besoin de fractionnaires

## Sync du label dénormalisé

- Lazy update au chargement sidebar : vérification batch des labels, mutation silencieuse si changé
- Si entité source supprimée → favori retiré automatiquement (cleanup à la query)

## Décisions

| Question | Réponse |
|----------|---------|
| Stockage | Table `favorites` dédiée (pas de champ sur chaque entité) |
| Affichage sidebar | Liens directs, liste plate avec icône type |
| Label | Titre tronqué ~30 chars + icône type |
| Action favori | Étoile dans le page header |
| Ordre | Drag & drop manual |
| Collapsible | Non, toujours visible |
| Limite | Pas de limite hard |
