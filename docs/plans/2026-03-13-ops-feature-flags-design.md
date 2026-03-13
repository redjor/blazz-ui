# Feature Flags — apps/ops

**Date:** 2026-03-13
**Scope:** `apps/ops` uniquement
**Approche:** Config statique TypeScript + composant `<FeatureGate>` + filtre navigation

## Contexte

Système de feature flags pour gater des features en cours de développement dans l'app ops.
Pas de backend, pas d'env vars — un simple objet TypeScript modifiable dans le code.

## Décisions

- **Scope : apps/ops uniquement** — pas de modification de `packages/ui/`
- **Config statique** — objet TypeScript, pas de BDD ni env vars
- **Usage : dev-gating** — cacher features pas encore prêtes
- **Granularité : routes + sections** — contrôle à 2 niveaux

## Design

### 1. Config (`lib/features.ts`)

```ts
export const features = {
  dashboard: true,
  today: true,
  projects: true,
  clients: true,
  time: true,
  recap: true,
  todos: true,
  chat: true,
  packages: true,
} as const satisfies Record<string, boolean>;

export type FeatureFlag = keyof typeof features;

export function isEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
```

### 2. Composant `<FeatureGate>` (`components/feature-gate.tsx`)

```tsx
import type { ReactNode } from "react";
import { type FeatureFlag, isEnabled } from "@/lib/features";

export function FeatureGate({ flag, children }: { flag: FeatureFlag; children: ReactNode }) {
  if (!isEnabled(flag)) return null;
  return <>{children}</>;
}
```

### 3. Navigation filtrée (`components/ops-frame.tsx`)

Ajout d'un champ optionnel `flag?: FeatureFlag` sur chaque nav item.
Filtrage dans le rendu : `navItems.filter(item => !item.flag || isEnabled(item.flag))`.

### 4. Protection des routes

Mapping route → flag dans `lib/features.ts`. Composant `RouteGuard` dans le layout `(main)` qui redirige vers `/` si le flag de la route courante est désactivé.

## Fichiers impactés

- **Créer** `apps/ops/lib/features.ts`
- **Créer** `apps/ops/components/feature-gate.tsx`
- **Modifier** `apps/ops/components/ops-frame.tsx` — ajouter `flag` aux nav items + filtre
- **Modifier** `apps/ops/app/(main)/layout.tsx` — ajouter RouteGuard
