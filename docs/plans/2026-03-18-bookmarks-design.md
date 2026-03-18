# Bookmarks System — Design

**Date :** 2026-03-18
**App :** apps/ops
**Use case :** Veille/inspiration + read-it-later intégré à Ops

## Objectifs

- Sauvegarder des tweets, vidéos YouTube, images, vidéos, liens
- Catégoriser avec collections (2 niveaux) + tags transversaux
- Extraction automatique de metadata OpenGraph/oEmbed
- Rendu différencié par type de contenu (embed tweet, player YouTube, preview image...)
- Vue principale en grille de cards (style Pinterest/Raindrop)

## Data Model

### Table `bookmarkCollections`

| Champ | Type | Description |
|-------|------|-------------|
| `userId` | Id<"users"> | Owner |
| `name` | string | Nom de la collection |
| `icon` | string? | Emoji ou icon name |
| `color` | string? | Couleur |
| `parentId` | Id<"bookmarkCollections">? | null = top-level, set = sous-collection |
| `order` | number | Tri |

Indexes : `by_user`, `by_parent`

### Table `bookmarks`

| Champ | Type | Description |
|-------|------|-------------|
| `userId` | Id<"users"> | Owner |
| `url` | string | URL source |
| `type` | "tweet" \| "youtube" \| "image" \| "video" \| "link" | Auto-détecté |
| `title` | string? | OpenGraph title |
| `description` | string? | OG description |
| `thumbnailUrl` | string? | OG image URL (externe) |
| `thumbnailStorageId` | Id<"_storage">? | Future copie locale |
| `author` | string? | Auteur/compte |
| `siteName` | string? | "Twitter", "YouTube"... |
| `embedUrl` | string? | URL d'embed |
| `collectionId` | Id<"bookmarkCollections">? | Collection parente |
| `tags` | string[] | Tags (noms) |
| `notes` | string? | Note perso |
| `pinned` | boolean | Épinglé en haut |
| `archivedAt` | number? | Timestamp si archivé |

Indexes : `by_user`, `by_user_collection`, `by_user_type`, `by_user_archived`

## Détection de type

| Pattern | Type |
|---------|------|
| `twitter.com/*`, `x.com/*` | `tweet` |
| `youtube.com/watch*`, `youtu.be/*` | `youtube` |
| `.png`, `.jpg`, `.gif`, `.webp`, `.svg` | `image` |
| `.mp4`, `.webm`, `.mov` | `video` |
| Tout le reste | `link` |

## Extraction metadata — API route `/api/bookmarks/metadata`

Route Next.js POST :
1. Reçoit l'URL
2. Fetch la page, parse OpenGraph (`og:title`, `og:description`, `og:image`, `og:site_name`)
3. YouTube : extrait embed URL (`youtube.com/embed/{videoId}`)
4. Tweets : extrait auteur depuis URL (`x.com/{author}/status/...`)
5. Retourne `{ type, title, description, thumbnailUrl, author, siteName, embedUrl }`

Appelé au paste/blur dans le formulaire d'ajout. `thumbnailStorageId` pas implémenté en V1.

## Convex Functions

### `convex/bookmarkCollections.ts`

- `list()` — Collections de l'user, triées par `order`. Regroupement parent/enfants côté client
- `create(name, icon?, color?, parentId?)` — Valide que parentId est top-level (max 2 niveaux)
- `update(id, name?, icon?, color?, order?)`
- `remove(id)` — Bookmarks dedans passent à collectionId undefined. Supprime les sous-collections

### `convex/bookmarks.ts`

- `list(collectionId?, type?, tag?, archived?)` — Filtrée, `_creationTime` desc, pinned first
- `get(id)` — Détail
- `create(url, type, title?, description?, thumbnailUrl?, author?, siteName?, embedUrl?, collectionId?, tags?, notes?)`
- `update(id, ...)`
- `remove(id)`
- `removeBatch(ids)` — Suppression en lot
- `archive(id)` / `unarchive(id)`
- `move(ids, collectionId)` — Bulk move

## UI

### Navigation

Item "Bookmarks" dans OpsFrame sidebar (`/bookmarks`), icône `Bookmark`, entre Notes et Chat.

### Page `/bookmarks`

**Layout :** Sidebar collections (gauche) + grille de cards (droite)

**Sidebar collections :**
- "All bookmarks" en haut
- Collections top-level, dépliables (sous-collections)
- "Archived" en bas
- Bouton "+" pour créer

**Toolbar :**
- Bouton "Add bookmark" → dialog
- Filtre par type (pills : All, Tweets, YouTube, Images, Videos, Links)
- Filtre par tag (dropdown multi-select)
- Recherche texte (titre/description/url)

**Cards par type :**
- **Tweet** : avatar auteur, texte, thumbnail
- **YouTube** : thumbnail large + play overlay, titre, chaîne
- **Image** : thumbnail plein cadre, titre en overlay
- **Video** : thumbnail + play, titre
- **Link** : thumbnail + favicon + titre + description + siteName

Chaque card : tags (badges), collection (en vue All), indicateur pinned.
Actions hover/menu : pin, move, archive, edit, delete.

### Dialog "Add Bookmark"

1. Input URL (paste → fetch metadata → pré-remplissage)
2. Preview metadata (thumbnail, titre, description)
3. Sélecteur collection (dropdown)
4. Tag picker (composant `tag-input.tsx` existant)
5. Note perso (textarea)
6. Bouton "Save"

### Dialog "Edit Bookmark"

Même layout, pré-rempli. Correction titre/description, changement collection/tags/notes.
