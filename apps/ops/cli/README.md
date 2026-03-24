# Blazz OPS CLI

CLI + MCP server pour gérer notes et todos via Convex.

## Setup

1. Créer `~/.blazz-ops/.env` :
   ```
   CONVEX_URL=<your Convex URL>
   CONVEX_DEPLOY_KEY=<your deploy key from Convex dashboard>
   OPS_USER_ID=<your user ID>
   ```

2. Depuis la racine du monorepo :
   ```bash
   cd apps/ops && pnpm cli <command>
   ```

## Commandes

```bash
# Notes
blazz-ops notes list [--entity-type general] [--pinned] [--json]
blazz-ops notes get <id>
blazz-ops notes create --title "Ma note" [--content "..."] [--entity-type general]
blazz-ops notes update <id> [--title "..."] [--content "..."] [--pin] [--lock]
blazz-ops notes remove <id>

# Todos
blazz-ops todos list [--status todo] [--project <id>] [--priority urgent] [--json]
blazz-ops todos get <id>
blazz-ops todos create --text "Ma tâche" [--priority high] [--due 2026-03-25] [--project <id>]
blazz-ops todos update <id> [--text "..."] [--priority normal] [--due 2026-04-01]
blazz-ops todos status <id> done
blazz-ops todos remove <id>

# MCP server (pour Claude Code)
blazz-ops mcp
```

## Options globales

- `--json` — sortie JSON (défaut : texte formaté)
- `--help` — aide

## MCP (Claude Code)

Ajouter dans la config MCP de Claude Code (`.mcp.json` ou `settings.json`) :

```json
{
  "mcpServers": {
    "blazz-ops": {
      "command": "pnpm",
      "args": ["--filter", "ops", "cli", "mcp"],
      "cwd": "/path/to/blazz-ui-app"
    }
  }
}
```

11 tools exposés : `notes_list`, `notes_get`, `notes_create`, `notes_update`, `notes_remove`, `todos_list`, `todos_get`, `todos_create`, `todos_update`, `todos_status`, `todos_remove`.
