# Design — Logo client (Blazz Ops)

**Date:** 2026-03-02
**Scope:** `apps/ops/`

## Objectif

Permettre d'associer un logo à chaque client dans Blazz Ops. Le logo est uploadé depuis le disque, stocké dans Convex File Storage, et affiché dans la liste des clients et la page de détail.

## Approche retenue

**Convex File Storage natif.**
Flow : `generateUploadUrl` → `fetch PUT` → save `storageId` sur le client. Les fichiers sont gérés par Convex (URLs signées, suppression propre). Pas de dépendance externe.

## Changements

### 1. Schema — `convex/schema.ts`

Ajouter le champ optionnel sur la table `clients` :

```ts
logoStorageId: v.optional(v.id("_storage"))
```

### 2. Backend — `convex/clients.ts`

- Nouvelle mutation `generateUploadUrl` → retourne une pre-signed URL Convex
- `create` et `update` acceptent `logoStorageId?: Id<"_storage">`
- Les queries `list` et `get` résolvent `logoStorageId` → `logoUrl: string | null` inline via `ctx.storage.getUrl()`

### 3. ClientForm — `components/client-form.tsx`

Zone d'upload en haut du formulaire :
- Logo existant : avatar 64px cliquable (click → remplace)
- Pas de logo : bouton "Ajouter un logo" avec icône upload
- Clic → `<input type="file" accept="image/*">` caché → upload immédiat au pick
- Pendant upload : spinner
- `logoStorageId` en state local, soumis avec le reste du form

### 4. Affichage

| Endroit | Taille | Fallback |
|---|---|---|
| Liste `/clients` | Avatar 36px | Initiales du nom |
| Détail `/clients/[id]` | Avatar 56px | Initiales du nom |
