# Hermes ↔ Blazz Ops — MCP Server

**Date** : 2026-04-20
**Statut** : design validé, prêt pour plan d'implémentation
**Contexte** : Hermes Agent (Nous Research) déployé sur Railway (`loving-recreation`). Blazz Ops tourne sur Convex Cloud. On veut que Hermes, depuis Telegram, puisse lire et écrire dans Blazz Ops via MCP.

## Objectif
Exposer un sous-ensemble des tools de `apps/ops/worker/src/tools/` en serveur **MCP sur HTTP POST + JSON-RPC 2.0** (pas de SSE, pas de streaming — tous les tools répondent synchronement) hébergé dans Convex, pour que Hermes (et demain d'autres clients MCP : Claude Code, Cursor) puissent consulter la tréso / les factures / les heures et logger des frais pro depuis n'importe quel canal.

## Décisions

| Décision | Choix |
|---|---|
| Rôle de Hermes | 4e agent généraliste — ne remplace pas Marc/Léo/Sarah |
| Scope MVP | Read + write "sûrs" (pas de delete, pas d'envoi de facture) |
| Hébergement MCP | `apps/ops/convex/mcp.ts` (`httpAction`) |
| URL publique | `https://<deployment>.convex.site/mcp` (domaine `.site`, pas `.cloud`) |
| Auth | `Authorization: Bearer <MCP_SECRET>` (env Convex) |
| Résolution d'IDs | Hermes enchaîne `list_clients` → `create_expense` (pas de matching fuzzy côté serveur) |

## Architecture

```
Telegram ──▶ Hermes (Railway) ──[HTTPS + Bearer]──▶ Convex httpAction /mcp
                                                         │
                                                         ▼
                                         api.worker.* (bypass user auth)
                                                         │
                                                         ▼
                                                    Convex DB
```

Pas de worker Node.js intermédiaire : les tools MCP appellent direct les queries/mutations Convex existantes via `ctx.runQuery` / `ctx.runMutation`, réutilisant la logique déjà validée par le chat agent et le worker daemon.

**Point archi important** : le handler MCP n'a pas de session Google OAuth. Il appelle donc les fonctions Convex préfixées **`worker*`** (ex : `api.worker.workerGetTreasurySettings`, `api.worker.workerCreateExpense`) qui ne requièrent pas d'auth user — c'est le même contrat que le worker daemon. L'authentification se fait **au niveau HTTP** via le Bearer token (voir section Auth).

### Schémas de tools partagés (MVP, pas v2)

Le worker (`apps/ops/worker/src/tools/*.ts`) et le handler MCP (`apps/ops/convex/mcp.ts`) **doivent partager les mêmes JSON schemas** pour les 10 tools du MVP — sinon `tools/list` et le comportement réel divergent dès la première modif.

Solution : extraire les `definition.function` (name, description, parameters) dans `apps/ops/shared/tool-schemas.ts`. Ce fichier contient **uniquement de la data pure** (pas d'import Convex, pas d'execute, pas de ConvexHttpClient) → importable à la fois depuis le runtime Node.js du worker et depuis le runtime Convex.

```
apps/ops/shared/tool-schemas.ts   ← source unique : {name, description, parameters}
  ↓                      ↓
worker/src/tools/*.ts   convex/mcp.ts
  (ajoute execute       (ajoute handler
   via ConvexHttpClient) via ctx.runQuery)
```

Chaque side ajoute son `execute` spécifique au runtime. Pas de duplication = pas de drift.

Refacto à faire dans le plan d'implémentation : étape préliminaire de création de `shared/tool-schemas.ts` + migration des 10 tools du worker pour importer depuis là, AVANT d'écrire `convex/mcp.ts`.

## Tools exposés (10)

### Read (9)
- `qonto_balance` — solde Qonto actuel
- `qonto_transactions` — 10 dernières transactions
- `treasury_forecast` — projection de tréso
- `list_invoices` — factures (filtre par statut)
- `list_expenses` — frais pro du mois
- `list_time_entries` — heures de la semaine
- `list_todos` — todos
- `list_clients` — clients avec leurs IDs (nécessaire pour `create_expense`)
- `list_projects` — projets avec leurs IDs

### Write (1)
- `create_expense` — crée une dépense `restaurant` ou `mileage`

### Write volontairement repoussé en v2
- `create_time_entry` — pourrait être le use case #1 Telegram ("j'ai bossé 2h sur projet X"), **mais la mutation Convex n'existe pas encore**. Ajouter cette fonctionnalité = nouvelle mutation `api.worker.workerCreateTimeEntry` + validation des heures. Hors scope MVP pour livrer vite ; à ajouter dans une itération suivante en 1h de dev une fois le flow MCP validé.

## Protocole

**MCP JSON-RPC 2.0 sur HTTP POST** (subset du transport "Streamable HTTP" de la spec 2025-06-18, sans SSE). Méthodes à implémenter :
- `initialize` — handshake, retourne capabilities + infos serveur
- `tools/list` — liste les 10 tools avec leur JSON schema
- `tools/call` — exécute un tool et retourne le résultat

Transport : une seule route `POST /mcp`. Mode stateless — pas de session côté serveur, chaque requête porte son Bearer token. Réponses JSON (pas de SSE — tous les tools répondent en quelques centaines de ms).

**Format erreur MCP** : si un tool échoue (bad ID, validation), on retourne un JSON-RPC result avec `isError: true` + contenu texte expliquant l'erreur. Ne **pas** renvoyer un HTTP 500 — le client MCP doit recevoir une réponse structurée pour que le LLM puisse réagir intelligemment. Les 401/403 restent pour l'auth, les 400 pour JSON-RPC mal formé.

## Dates & timezone

Tous les champs `date` (ex : `create_expense.date`) sont au format **`YYYY-MM-DD` interprété en Europe/Paris**. Les tools qui retournent des dates suivent la même convention.

- **Résolution de "hier", "aujourd'hui" etc.** : c'est **Hermes** qui convertit avant d'envoyer le tool call. Hermes tourne sur Railway avec `TZ=Europe/Paris` (à configurer dans les env vars Railway du service `hermes-agent` si pas déjà fait — `hermes config set timezone Europe/Paris` dans la CLI). Convex ne ré-interprète pas.
- **Convex** : stocke les dates comme strings, trust le client. Aucune conversion côté serveur.
- **Schema MCP** : la description du champ `date` pour chaque tool doit dire explicitement `"YYYY-MM-DD in Europe/Paris"` — pas juste `"YYYY-MM-DD"` — pour que le LLM ne choisisse pas une autre TZ.
- **Out of scope MVP** : multi-timezone, support d'utilisateurs dans d'autres fuseaux, DST edge cases (Hermes doit gérer ses conversions en amont).

## Auth

Secret partagé `MCP_SECRET` :
- Généré aléatoirement (`openssl rand -hex 32`)
- Stocké dans les env Convex : `npx convex env set MCP_SECRET <value>`
- Stocké dans Hermes (config gateway) via `hermes mcp add`
- Vérifié en début de chaque requête : header `Authorization: Bearer <secret>` doit matcher

Requête non authentifiée → 401 Unauthorized.

**Limites à assumer** :
- Le secret donne un accès **total** aux 10 tools, pas de granularité (aucun consumer ne peut être restreint à "read-only").
- **Aucune identité client** côté Convex : les logs d'audit ne pourront pas dire "c'est Hermes" vs "c'est Claude Code" si plusieurs clients partagent ce secret. Passer à multi-consumer (ex : ajouter Claude Code sur macOS) impose **soit** de partager le même secret (augmente la surface de fuite), **soit** une refonte auth (token par consumer, identité côté serveur, changement de contrat côté clients existants). Ce n'est pas une extension transparente de v1 — c'est un changement breaking à prévoir dès qu'un 2e consumer rentre.
- Pas de révocation granulaire : en cas de suspicion de fuite, la seule option est rotation globale (voir Ops & sécurité).

## Install côté Hermes

Via SSH sur Railway après le déploiement du MCP server :
```bash
hermes mcp add ops --transport http \
  --url https://<deployment>.convex.site/mcp \
  --header "Authorization: Bearer <MCP_SECRET>"
```
Redémarrer le gateway pour charger (ou cliquer "Restart Gateway" dans l'admin dashboard).

## Ce qui n'est PAS dans le scope

- Delete (delete_expense, delete_todo, etc.)
- Actions sensibles (send_invoice, mark_paid)
- Tools du worker qui ne sont pas dans la liste (git_log, read_file, list_notes, list_bookmarks, list_missions, list_goals, list_feed_items, save_memory, delegate_to_agent, ask_agent, check_time_anomalies, list_recurring_expenses)
- Multi-user (MVP = single-user freelance, identité implicite via le secret)
- Streaming (SSE) — tous les tools répondent synchronement
- OAuth / clés par consumer (impact détaillé dans section Auth)
- Fuzzy matching de clientName côté serveur

**Ce qui s'ajoute en v2 sans casser MCP** : delete, send_invoice, fuzzy matching, SSE, tests automatisés.
**Ce qui exige un breaking change** : multi-consumer auth (voir section Auth), passage à multi-user.

## Risques & points d'attention

- **Convex httpAction a un timeout** (~5min), suffisant pour tous ces tools.
- **MCP_SECRET en clair dans les logs Hermes** → le handler ne doit pas logger le header Authorization (ni le payload qui pourrait contenir des secrets).
- **Consistance du schema** : résolue dès le MVP par `apps/ops/shared/tool-schemas.ts` (voir section Architecture). Sans ce partage, `tools/list` mentirait au client MCP dès la première modif → régression certaine.
- **Mauvais clientId/projectId** : Convex mutation throw si l'ID n'existe pas. Le handler MCP catch et retourne un `isError: true` MCP propre (pas un 500).
- **Idempotence `create_expense`** : si Telegram/Hermes retry sur une erreur réseau, on peut dupliquer la dépense. MVP = on accepte le risque (rare + facile à corriger à la main). v2 = accepter un `idempotencyKey` optionnel et dédupliquer côté Convex.

## Ops & sécurité

- **Rotation du secret** : si `MCP_SECRET` fuit → `npx convex env set MCP_SECRET <new>`, puis `hermes mcp remove ops && hermes mcp add ops ...` côté Railway. Aucun downtime côté Convex (les tokens invalides deviennent 401 immédiatement).
- **Audit** : chaque appel `tools/call` log dans Convex (une nouvelle table `mcpAuditLog` : timestamp, tool, args redacted, result success/error). Permet de répondre à "qu'est-ce que Hermes a fait hier ?".
- **Monitoring** : health check simple `GET /mcp` qui retourne `200 {"ok":true, "version":"..."}` sans auth — ping par le dashboard Hermes pour vérifier que le MCP server répond.

## Testing

Avant de brancher Hermes — tester avec curl depuis ton Mac.

Deployment dev : `rightful-guineapig-376.eu-west-1.convex.site` (remplacer par le deployment prod quand créé).

1. **Smoke test `tools/list`** :
   ```bash
   curl -X POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
     -H "Authorization: Bearer $MCP_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```
   Attendu : les 10 tools dans `result.tools`.

2. **Test auth** : same call sans header ou avec mauvais Bearer → 401.

3. **Test read** : `method: "tools/call"`, `params: {"name":"qonto_balance","arguments":{}}` → `result.content[0].text` contient le solde.

4. **Test write + rollback** : `create_expense` avec des données test (small amount, fake purpose), vérifier apparition dans la table `expenses` Convex, supprimer à la main via dashboard Convex.

5. **Test Hermes end-to-end** : après `hermes mcp add ops`, demander sur Telegram "combien en banque ?" → réponse correcte.

Pas de tests automatisés côté Convex pour cette itération (MVP, low ROI vs effort). Ajouter `tests/mcp.test.ts` si le contrat grossit.

## Critères de succès

1. Sur Telegram, "combien en banque ?" déclenche `qonto_balance` et Hermes répond le solde correct.
2. "Log un resto de 38€ avec Coca-Cola hier" déclenche `list_clients` puis `create_expense` et la dépense apparaît dans la table `expenses` Convex avec le bon `clientId`.
3. Une requête avec un mauvais Bearer token reçoit 401.
4. L'admin dashboard Hermes liste `ops` comme MCP server connecté.

## Prochaine étape

Plan d'implémentation détaillé (skill `writing-plans`).
