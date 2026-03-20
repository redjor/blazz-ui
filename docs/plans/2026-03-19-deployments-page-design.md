# Design — Page Deployments (Ops)

## Route
`/deployments` dans `(main)`, section Admin du sidebar.

## Data source
- API Vercel `GET /v6/deployments?projectId=X&limit=20`
- Token Vercel + Project ID stockes dans settings Convex (cles `vercel_token`, `vercel_project_id`)
- Appel client-side direct (pas de Convex/API route)

## UI
- PageHeader : titre "Deployments", bouton refresh
- Liste 20 derniers deployments en Cards empilees :
  - Status badge (Ready=vert, Error=rouge, Building=jaune, Canceled=gris)
  - Branche + commit message (tronque)
  - Date relative
  - Duree du build
- Bloc config si token manquant (lien vers /settings)
- 4 etats : loading (skeleton), empty, error, success

## Feature flag
`deployments` dans features.ts, sidebar section Admin.

## Pas de Convex
Aucune table ni query. Tout via API Vercel client-side.
