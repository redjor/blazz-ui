# Notifications Inbox — Design Document

**Date:** 2026-03-19
**App:** apps/ops
**Approach:** Webhooks natifs Convex (Approche A)

## Overview

Système de notifications centralisé pour recevoir les events de GitHub, Vercel et Convex via webhooks entrants. Affichage dans une page `/notifications` dédiée utilisant le block `Inbox` de `@blazz/pro`.

## Data Model

Nouvelle table `notifications` dans `convex/schema.ts` :

```typescript
notifications: defineTable({
  userId: v.id("users"),
  source: v.union(v.literal("github"), v.literal("vercel"), v.literal("convex")),
  externalId: v.string(),
  title: v.string(),
  description: v.string(),
  actionType: v.string(),
  status: v.optional(v.string()),
  priority: v.optional(v.string()),
  authorName: v.string(),
  authorInitials: v.string(),
  authorColor: v.optional(v.string()),
  authorAvatar: v.optional(v.string()),
  url: v.optional(v.string()),
  read: v.boolean(),
  archivedAt: v.optional(v.number()),
  createdAt: v.number(),
})
.index("by_user_date", ["userId", "createdAt"])
.index("by_user_read", ["userId", "read"])
.index("by_user_source", ["userId", "source"])
.index("by_source_external", ["source", "externalId"])
```

### Key decisions

- `externalId` + `by_source_external` index pour l'idempotence (évite doublons cross-source)
- `authorInitials` + `authorColor` stockés explicitement (requis par le block Inbox pour le fallback avatar)
- `archivedAt` pour soft-archive — purge cron des archivées > 30 jours
- `by_user_date` pour la pagination chronologique descendante

## Webhook Handlers

Trois endpoints HTTP dans `convex/http.ts` :

### GitHub (`POST /webhooks/github`)

- Vérification signature HMAC-SHA256 (`X-Hub-Signature-256`)
- Events traités :
  - `pull_request` (opened, merged, closed, review_requested) → actionType `"comment"`
  - `issue_comment` / `pull_request_review` → actionType `"comment"` ou `"reply"`
  - `push` → actionType `"added"`
  - `check_run` / `check_suite` (CI failures) → actionType `"mention"`, priority `"high"`
- Mapping : `sender.login` → authorName, `sender.avatar_url` → authorAvatar, initiales générées depuis le login
- Ignore les events du bot lui-même (configurable)

### Vercel (`POST /webhooks/vercel`)

- Vérification signature (`x-vercel-signature`)
- Events traités :
  - `deployment.created` → status `"in-progress"`
  - `deployment.succeeded` → status `"done"`
  - `deployment.error` → status `"urgent"`, priority `"high"`
  - `deployment.cancelled` → status `"cancelled"`
- Mapping : `deployment.meta.githubCommitMessage` → description, branch → title

### Convex (`POST /webhooks/convex`)

- Vérification token secret en header (`X-Convex-Webhook-Secret`)
- Events : erreurs runtime, limites quota
- Endpoint prêt pour quand Convex ajoute des webhooks natifs, ou pour un système custom

### Logique commune

- Chaque handler : vérif signature → parse payload → check idempotence via `by_source_external` → `internalMutation` pour insert
- Pas d'auth utilisateur (machine-to-machine) — `userId` résolu via mapping dans table `settings`

## Convex Functions

### Queries

- **`notifications.list`** — `{ source?, read?, limit? }` → documents triés par `createdAt` desc, filtre `archivedAt === undefined`, default limit 50
- **`notifications.unreadCount`** — count via `by_user_read` avec `read: false`

### Mutations

- **`notifications.markRead`** — `{ id }` → set `read: true`
- **`notifications.markAllRead`** — `{ source? }` → batch update toutes unread
- **`notifications.archive`** — `{ id }` → set `archivedAt: Date.now()`
- **`notifications.archiveAllRead`** — archive toutes les lues

### Internal Mutations

- **`notifications.internalCreate`** — appelée par webhook handlers, check idempotence avant insert, set `read: false` + `createdAt: Date.now()`

### Cron

- **`purgeOldNotifications`** — hebdomadaire, supprime archivées > 30 jours (hard delete)

## UI — Page `/notifications`

### Route & Navigation

- Route : `app/(main)/notifications/page.tsx` + `_client.tsx`
- Feature flag : `notifications: true` dans `lib/features.ts`
- Sidebar : icône `Bell` dans groupe "Outils", badge unread count

### Composition

```tsx
<Inbox>
  <InboxSidebar width={380}>
    <InboxHeader
      title="Notifications"
      filters={filters}
      onFiltersChange={setFilters}
      menuActions={[
        { label: "Mark all read", onClick: handleMarkAllRead },
        { label: "Archive all read", onClick: handleArchiveAllRead },
      ]}
    />
    <InboxPanel loading={isLoading} error={isError} onRetry={retry}>
      <InboxList>
        {filtered.map((item) => (
          <InboxItem
            key={item._id}
            item={toInboxNotification(item)}
            selected={selected === item._id}
            onClick={handleSelect}
          />
        ))}
      </InboxList>
    </InboxPanel>
  </InboxSidebar>
  <InboxDetail>
    {selected ? <NotificationDetail notification={selected} /> : null}
  </InboxDetail>
</Inbox>
```

### Mapper `toInboxNotification`

Transforme le document Convex → `InboxNotification` du block :
- `author: { name, initials, color, avatarUrl }`
- `time` : relatif via `date-fns/formatDistanceToNowStrict` (`"2m"`, `"1h"`, `"3d"`)

### `NotificationDetail` (panneau droit)

- Header : source badge (GitHub/Vercel/Convex) + titre + timestamp
- Body : description complète
- Footer : bouton "Open in [source]" (ouvre `url` nouvel onglet) + bouton "Archive"
- Auto-`markRead` à la sélection

### Filtrage

- Filtres natifs du block Inbox : read/unread, actionType, status
- Filtre additionnel par `source` (3 chips : GitHub, Vercel, Convex)

## Environment Variables (à ajouter)

- `GITHUB_WEBHOOK_SECRET` — secret partagé pour vérif signature
- `VERCEL_WEBHOOK_SECRET` — secret Vercel
- `CONVEX_WEBHOOK_SECRET` — secret custom pour endpoint Convex
