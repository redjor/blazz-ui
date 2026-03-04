# Design — Authentification Google OAuth pour Blazz Ops

**Date:** 2026-03-04
**App:** `apps/ops`
**Stack auth:** `@convex-dev/auth` + Google OAuth

## Contexte

Blazz Ops est une app Next.js 16 + Convex personnelle (utilisateur unique). Actuellement, toutes les routes sont publiques. L'objectif est d'ajouter une authentification Google OAuth simple et robuste, entièrement dans l'écosystème Convex.

## Approche retenue

`@convex-dev/auth` — lib officielle Convex pour l'authentification. Supporte Google OAuth nativement. Pas de service externe tiers.

## Flux utilisateur

1. L'utilisateur arrive sur n'importe quelle route
2. Le middleware Next.js vérifie le token JWT Convex (cookie httpOnly)
3. Si non connecté → redirect vers `/login`
4. Sur `/login` → bouton "Continuer avec Google" → OAuth flow Google → callback Convex → redirect vers `/`
5. Token JWT stocké dans un cookie httpOnly géré par `@convex-dev/auth`

## Fichiers à créer/modifier

| Fichier | Action | Description |
|---|---|---|
| `convex/auth.config.ts` | Créer | Config du provider Google (client ID/secret) |
| `convex/auth.ts` | Créer | Export `{ auth, signIn, signOut }` depuis `@convex-dev/auth/server` |
| `convex/http.ts` | Modifier | Ajouter le routeur HTTP pour les callbacks OAuth |
| `app/providers.tsx` | Modifier | Remplacer `ConvexProvider` par `ConvexAuthProvider` |
| `app/layout.tsx` | Modifier | Wrapper `ConvexAuthNextjsServerProvider` |
| `app/login/page.tsx` | Créer | Page de login : logo + bouton Google |
| `middleware.ts` | Créer | Protect toutes routes sauf `/login` |
| `.env.local` | Modifier | Ajouter `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `JWT_PRIVATE_KEY`, `SITE_URL` |

## Protection des données

Le middleware Next.js protège l'accès à l'UI. Les queries/mutations Convex existantes n'ont pas besoin de modification pour cette phase (app solo, pas de multitenancy). Si besoin à terme, `ctx.auth.getUserIdentity()` peut être ajouté dans les mutations.

## Page de login

Design minimaliste : fond dark, logo/titre "Blazz Ops", bouton "Continuer avec Google" centré. Pas de formulaire email/password.

## Variables d'environnement requises

```
NEXT_PUBLIC_CONVEX_URL=...          (déjà présent)
AUTH_GOOGLE_ID=...                   (Google Cloud Console)
AUTH_GOOGLE_SECRET=...               (Google Cloud Console)
JWT_PRIVATE_KEY=...                  (généré par npx @convex-dev/auth)
SITE_URL=http://localhost:3120
```
