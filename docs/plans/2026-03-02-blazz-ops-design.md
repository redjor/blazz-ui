# Blazz Ops — Design

**Date:** 2026-03-02
**Status:** Approved

## Contexte

App de gestion freelance personnelle pour tracker le temps passé sur des projets clients, calculer les montants facturables, et générer des récaps à envoyer aux clients. Vit dans le monorepo Blazz comme une vraie app (pas une démo), avec une évolution prévue vers une app Mac native via Tauri.

## Architecture

Nouvelle app `apps/ops` dans le monorepo Turborepo.

```
apps/ops/
├── app/
│   ├── layout.tsx          ← ConvexProvider + @blazz/ui theme
│   ├── (dashboard)/        ← vue d'ensemble
│   ├── (clients)/          ← gestion clients + projets
│   ├── (time)/             ← saisie + historique des heures
│   └── (recap)/            ← récapitulatif facturable
├── convex/
│   ├── schema.ts
│   ├── clients.ts
│   ├── projects.ts
│   └── timeEntries.ts
├── src-tauri/              ← config Tauri (prête, non activée)
│   ├── tauri.conf.json
│   └── Cargo.toml
└── package.json
```

**Stack :**
- Next.js 16 + React 19 (output: "export" pour Tauri-compatibility)
- Convex — backend complet (DB + server functions + real-time)
- @blazz/ui — composants
- Tailwind v4, TypeScript strict

**Contrainte static export :**
- Pas de Server Components avec data fetching — tout passe par Convex client-side
- Pas d'API routes Next.js — Convex functions les remplacent
- `next/image` en mode unoptimized

## Modèle de données (Convex)

### `clients`
```ts
{
  name: string,
  email?: string,
  phone?: string,
  address?: string,
  notes?: string,
  createdAt: number,
}
```

### `projects`
```ts
{
  clientId: Id<"clients">,
  name: string,
  description?: string,
  tjm: number,              // défaut: 600
  hoursPerDay: number,      // défaut: 8 → hourlyRate = tjm / hoursPerDay
  currency: string,         // défaut: "EUR"
  status: "active" | "paused" | "closed",
  startDate?: string,
  endDate?: string,
  createdAt: number,
}
```

### `timeEntries`
```ts
{
  projectId: Id<"projects">,
  date: string,             // ISO date (YYYY-MM-DD)
  minutes: number,          // stocké en minutes pour éviter erreurs float
  hourlyRate: number,       // snapshot du taux au moment de la saisie
  description?: string,
  billable: boolean,        // défaut: true
  invoicedAt?: number,      // timestamp — null = pas encore facturé
  createdAt: number,
}
```

**Calculs dérivés (jamais stockés) :**
- `hours = minutes / 60`
- `days = hours / hoursPerDay`
- `amount = hours × hourlyRate`

## Écrans & Fonctionnalités (Phase 1)

### Dashboard
- Total heures + montant facturable du mois en cours
- Projets actifs avec leur cumul en cours
- 10 dernières entrées de temps

### Clients & Projets
- Liste clients → détail client avec ses projets
- CRUD client (nom, email, téléphone, adresse)
- CRUD projet (nom, TJM, currency, statut, dates)
- Archiver un projet (statut `closed`) sans supprimer l'historique

### Temps
- Formulaire de saisie : date, projet (select), durée, description
- Historique filtrable par projet / période
- Inline edit d'une entrée
- Toggle billable/non-billable

### Récap
- Filtres : client + projet + période (mois prédéfini ou custom)
- Tableau : date | description | durée | taux | montant
- Footer : total heures + total € + nb jours équivalents
- Bouton "Marquer comme facturé" → pose `invoicedAt` sur toutes les entrées du récap
- Export CSV

## Tauri Setup

`next.config.ts` configuré avec `output: "export"` dès le départ. `src-tauri/` initialisé avec config minimale (vide), pas de dépendance Rust au démarrage.

Quand la Mac app sera prête : `tauri build` génère le `.app`. Convex reste le backend cloud, accessible depuis l'app desktop comme depuis le web.

## Hors scope Phase 1

- Timer live (stopwatch) → Phase 2
- Génération PDF facture → Phase 2
- Module facturation complet → Phase 2
- App Mac native activée → Phase 3
