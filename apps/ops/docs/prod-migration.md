# Migration vers Convex prod — checklist

Ce document liste ce qu'il faut refaire quand on passe une feature "httpAction + Bearer auth" de la dev Convex vers la prod.

Cible actuelle : deployment **dev** `rightful-guineapig-376.eu-west-1.convex.site`.

## Principe

Chaque deployment Convex est isolé :
- **Base de données différente** → les IDs (`users._id`, `clients._id`, etc.) changent
- **Env vars différentes** → il faut tout re-setter
- **URL différente** → `<deployment>.convex.site`

Donc toute feature qui dépend d'un env var ou d'un ID Convex doit être ré-initialisée en prod.

## Pré-requis : deployment prod

```bash
# Depuis apps/ops/
npx convex deploy --prod
```
Cette commande (ou l'UI dashboard.convex.dev) crée le deployment prod et donne :
- Son URL WebSocket (`.convex.cloud`) → met dans `NEXT_PUBLIC_CONVEX_URL` de l'app
- Son URL httpAction (`.convex.site`) → pour les webhooks + shortcuts

## Récupérer les IDs prod

Les `userId`, `clientId`, `projectId` sont différents en prod.

```bash
# Récupérer ton user ID prod
npx convex data users --prod --limit 5
# Copier le _id qui matche ton email
```

---

## Feature 1 — Hermes MCP Server

Ajouté le 2026-04-20. Voir `apps/ops/docs/plans/2026-04-20-hermes-mcp-ops-design.md`.

### Env vars à set sur prod
```bash
npx convex env set --prod MCP_SECRET "$(openssl rand -hex 32)"
```

### URL à brancher côté Hermes (Railway)
Dans le container Hermes sur Railway :
```bash
# Édite /data/.hermes/config.yaml, remplace l'URL de l'entrée mcp_servers.ops :
#   url: https://<PROD_DEPLOYMENT>.convex.site/mcp
#   headers:
#     Authorization: 'Bearer <NOUVEAU_MCP_SECRET>'

# Ou via CLI (attention à la TUI interactive, cf spec) :
hermes mcp remove ops
hermes mcp add ops --url https://<prod>.convex.site/mcp --auth header
```

Puis redémarrer le gateway Hermes.

---

## Feature 2 — iOS Bookmark Capture

Ajouté le 2026-04-23. Voir `apps/ops/docs/plans/2026-04-23-ios-bookmark-capture.md`.

### Env vars à set sur prod
```bash
# Secret pour le Bearer auth
npx convex env set --prod BOOKMARK_SECRET "$(openssl rand -hex 32)"

# User ID prod (récupéré via `npx convex data users --prod`)
npx convex env set --prod OPS_USER_ID "<PROD_USER_ID>"
```

### iOS Shortcut "Save to Blazz Prod"
iOS Shortcuts ne gère pas facilement les variables d'environnement → le plus simple est de **dupliquer** le Shortcut dev et changer l'URL + le secret.

1. Ouvrir l'app Raccourcis → long press sur "Save to Blazz" → **Dupliquer**
2. Renommer en "**Save to Blazz Prod**"
3. Éditer l'action "Obtenir le contenu de l'URL" :
   - URL : `https://<PROD_DEPLOYMENT>.convex.site/bookmark`
   - Header `Authorization` : `Bearer <NOUVEAU_BOOKMARK_SECRET>`
4. (Optionnel) Garder le dev Shortcut pour les tests futurs, ou le désactiver ("Afficher dans la feuille de partage" → off)

---

## Rotation des secrets (dev ou prod)

Si un secret fuit dans des logs, une capture d'écran, etc. :
```bash
# Générer + set le nouveau (remplacez <SECRET_NAME>)
npx convex env set --prod <SECRET_NAME> "$(openssl rand -hex 32)"

# Redéployer / re-configurer les consumers :
# - Hermes MCP : hermes mcp remove / add (cf Feature 1 ci-dessus)
# - iOS Shortcut : éditer l'Authorization header dans le Shortcut
```

Les anciens tokens deviennent 401 immédiatement côté serveur, pas de downtime sur les endpoints eux-mêmes.

---

## À ajouter au fil de l'eau

Chaque nouvelle feature qui ajoute un env var ou un ID Convex → une section ici avec :
- Nom de la feature + date
- Lien vers son plan/design doc
- Env vars à set sur prod
- Actions côté consumers (apps externes, shortcuts, webhooks)
