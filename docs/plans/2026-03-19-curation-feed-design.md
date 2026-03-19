# Feed de veille techno — Design

**Date** : 2026-03-19
**App** : apps/ops
**Stack** : Convex + Next.js 16 + @blazz/ui + GPT-4o-mini

## Concept

Agent de veille automatique qui fetch les dernières publications de chaînes YouTube et flux RSS, les enrichit via GPT-4o-mini (résumé + tags), et les présente dans un feed chronologique dans l'app ops.

## Architecture

```
Sources (YouTube Data API v3, RSS/Atom feeds)
        ↓
Convex scheduled function (cron toutes les 2h)
        ↓
Convex actions (HTTP fetch, pas de Playwright)
        ↓
Normalize → Deduplicate → Store
        ↓
Convex action async (queue) → GPT-4o-mini (résumé + tags)
        ↓
Convex DB (feedSources, feedItems)
        ↓
UI feed timeline (apps/ops)
```

Tout tourne dans Convex — pas de serveur externe, pas de couplage.

## Data model (Convex)

### feedSources

| Champ          | Type                     | Description                          |
| -------------- | ------------------------ | ------------------------------------ |
| name           | string                   | "Theo - t3.gg", "Kent C. Dodds blog" |
| type           | "youtube" \| "rss"       | Type de source                       |
| externalId     | string                   | Channel ID YouTube ou URL du flux RSS |
| avatarUrl      | string?                  | Avatar/favicon de la source          |
| lastFetchedAt  | number?                  | Timestamp du dernier fetch           |
| isActive       | boolean                  | Toggle actif/inactif                 |

### feedItems

| Champ          | Type                     | Description                          |
| -------------- | ------------------------ | ------------------------------------ |
| sourceId       | Id\<"feedSources"\>      | Ref vers la source                   |
| externalId     | string                   | Video ID ou URL article (pour dédup) |
| type           | "youtube" \| "rss"       | Hérité de la source                  |
| title          | string                   | Titre vidéo ou article               |
| content        | string                   | Description vidéo ou extrait article |
| url            | string                   | Lien direct                          |
| thumbnailUrl   | string?                  | Thumbnail                            |
| publishedAt    | number                   | Date de publication (timestamp)      |
| aiSummary      | string?                  | Résumé GPT-4o-mini (ajouté async)   |
| aiTags         | string[]?                | Tags techniques                      |
| isRead         | boolean                  | Marqué comme lu                      |
| isFavorite     | boolean                  | Favori                               |

## Fetchers

### YouTube — Convex action, HTTP direct

- `search.list` avec `channelId` + `order=date` + `maxResults=10`
- Puis `videos.list` pour les détails (description, thumbnail HQ)
- Clé API en env var Convex (`YOUTUBE_API_KEY`)
- Première sync : 10 dernières vidéos par chaîne
- Quota gratuit : 10 000 unités/jour (search = 100 unités → ~100 recherches/jour)

### RSS — Convex action, HTTP direct

- Fetch le XML, parse avec fast-xml-parser (~50KB)
- Couvre : blogs tech, Medium, Substack, newsletters avec archive RSS
- Première sync : 15 derniers items

## Enrichissement AI (async)

- Après chaque fetch batch, schedule une Convex action séparée par item
- Chaque action appelle GPT-4o-mini :
  - Prompt : "Résume en 2 phrases, donne 3-5 tags techniques"
- Retry intégré : si OpenAI down, re-schedule dans 5 min
- L'item apparaît dans le feed immédiatement (sans résumé), le résumé s'ajoute quelques secondes après (réactif grâce à Convex)
- Coût estimé : ~20 sources × 5 items × $0.00015/résumé ≈ $0.015/cycle → négligeable

## UI

### Page "Veille" (`/veille`)

```
PageHeader "Veille" + bouton "Fetch now" + badge "12 non-lus"
↓ 16px
FilterBar (All | YouTube | RSS) + tri par date
↓ 0px
Timeline feed (BlockStack)
  ┌──────────────────────────────────────────┐
  │ [avatar] Theo · il y a 3h           [★]  │
  │ "Why I Mass Delete Routes..."            │
  │ Résumé AI 2 lignes... (ou skeleton)      │
  │ [react] [nextjs] [architecture]          │
  └──────────────────────────────────────────┘
```

- Timeline simple chronologique
- Auto-mark lu au clic sur un item
- Favoris toggle
- Infinite scroll ou pagination simple

### Page "Sources" (`/veille/sources`)

```
PageHeader "Sources" + bouton "+ Ajouter"
↓
Liste des sources avec toggle actif/inactif, dernière sync, count items
Dialog d'ajout : type (YouTube/RSS) + ID/URL
```

## Cron

```ts
// convex/crons.ts
crons.interval("fetchAllFeeds", { hours: 2 })
```

- Fetch toutes les sources actives
- Dédup par `externalId` (skip si déjà en base)
- Schedule l'enrichissement AI pour les nouveaux items uniquement

## Hors scope MVP

- Twitter/X (v2 — scraping Playwright ou service tiers)
- Score de pertinence AI
- Notes perso sur les items
- Export/partage
- Dashboard stats de veille
- Notifications
