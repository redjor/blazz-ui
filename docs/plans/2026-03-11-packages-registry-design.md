# Package Registry Dashboard — Design

> Validated 2026-03-11

## Concept
Page `/packages` dans Ops affichant les stats npm live de packages hardcodés.
Data fetchée via Convex action + cron toutes les 15min.

## Data source
- `https://registry.npmjs.org/<package>` — metadata (version, date, size, license, description)
- `https://api.npmjs.org/downloads/point/last-week/<package>` — downloads hebdo
- Pas d'auth requise.

## Schema
```
packages: defineTable({
  name: string(),
  latestVersion: string(),
  publishedAt: string(),
  weeklyDownloads: number(),
  description: string(),
  license: optional(string()),
  unpackedSize: optional(number()),
  lastSyncedAt: number(),
})
```

## Sync
- Convex action `packages:sync` fetch npm pour chaque package dans TRACKED_PACKAGES
- Cron toutes les 15 minutes
- Bouton refresh manuel

## UI
- Page `/packages` avec PageHeader + grille de cards
- Card : nom (lien npm), version badge, downloads/week, taille, relative time, license
- Sidebar : entrée "Packages" avec icône Package

## Packages hardcodés
`lib/tracked-packages.ts` : `["@blazz/ui"]`
