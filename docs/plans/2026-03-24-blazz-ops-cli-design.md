# Blazz OPS CLI — Design

**Date:** 2026-03-24
**Scope MVP:** Notes + Todos
**Extensible vers:** Clients, Projects, Time Entries, Invoices

## Vue d'ensemble

Un CLI Node.js (`blazz-ops`) dans `apps/ops/cli/` qui :
- Gère **notes** et **todos** en standalone (terminal)
- Expose un **mode MCP server** (`blazz-ops mcp`) pour Claude Code
- Communique avec Convex via `ConvexHttpClient` + fonctions `internalQuery`/`internalMutation`

## Architecture

```
apps/ops/cli/
├── bin.ts                 ← Entry point (Commander)
├── lib/
│   ├── convex-client.ts   ← ConvexHttpClient + deploy key auth
│   ├── config.ts          ← Lecture ~/.blazz-ops/.env ou env vars
│   └── output.ts          ← Formatage texte / --json
├── commands/
│   ├── notes.ts           ← notes list|get|create|update|remove
│   └── todos.ts           ← todos list|get|create|update|remove|status
├── mcp/
│   └── server.ts          ← MCP server (stdio transport)
└── package.json           ← deps: commander, @modelcontextprotocol/sdk
```

### Convex — nouveau fichier

```
apps/ops/convex/cli.ts     ← internalQuery/internalMutation dédiées CLI
```

Réutilise la logique existante de `notes.ts` et `todos.ts` mais prend `userId` en paramètre au lieu de `requireAuth(ctx)`.

## Auth

- **Transport:** `ConvexHttpClient` avec deploy key
- **Credentials:** `CONVEX_URL` + `CONVEX_DEPLOY_KEY` + `OPS_USER_ID`
- **Stockage:** `~/.blazz-ops/.env` ou variables d'environnement
- **Sécurité:** Les fonctions `internal` sont inaccessibles depuis le client web — seul le deploy key peut les appeler

## Commandes CLI

### Notes

| Commande | Description |
|---|---|
| `blazz-ops notes list` | Lister les notes. Filtres: `--entity-type`, `--pinned` |
| `blazz-ops notes get <id>` | Afficher une note |
| `blazz-ops notes create` | Créer. Options: `--title`, `--content`, `--entity-type`, `--entity-id`, `--pinned` |
| `blazz-ops notes update <id>` | Modifier. Options: `--title`, `--content`, `--pin`, `--lock` |
| `blazz-ops notes remove <id>` | Supprimer (échoue si locked) |

### Todos

| Commande | Description |
|---|---|
| `blazz-ops todos list` | Lister les todos. Filtres: `--status`, `--project`, `--priority` |
| `blazz-ops todos get <id>` | Afficher un todo |
| `blazz-ops todos create` | Créer. Options: `--text`, `--priority`, `--due`, `--project`, `--status` |
| `blazz-ops todos update <id>` | Modifier champs |
| `blazz-ops todos status <id> <status>` | Changer le statut (triage/todo/blocked/in_progress/done) |
| `blazz-ops todos remove <id>` | Supprimer |

### MCP

| Commande | Description |
|---|---|
| `blazz-ops mcp` | Lancer le MCP server en mode stdio |

## Sortie

- **Défaut:** Texte formaté (tableaux, couleurs via chalk ou similaire)
- **`--json`:** JSON structuré
- **Mode MCP:** Toujours JSON

## MCP Tools

Mêmes opérations que le CLI, exposées comme tools MCP :

- `notes_list`, `notes_get`, `notes_create`, `notes_update`, `notes_remove`
- `todos_list`, `todos_get`, `todos_create`, `todos_update`, `todos_status`, `todos_remove`

Transport: stdio (standard pour Claude Code)

## Dépendances

- `commander` — parsing CLI
- `convex` — ConvexHttpClient
- `dotenv` — lecture .env
- `@modelcontextprotocol/sdk` — MCP server
- `chalk` (optionnel) — couleurs terminal

## Extension future

Le pattern est conçu pour être étendu facilement :
1. Ajouter un fichier `commands/clients.ts`
2. Ajouter les fonctions internes dans `convex/cli.ts`
3. Ajouter les tools MCP correspondants dans `mcp/server.ts`
4. Enregistrer la commande dans `bin.ts`
