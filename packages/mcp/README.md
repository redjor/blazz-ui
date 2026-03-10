# @blazz/mcp

MCP server for the Blazz UI Kit. Exposes design system docs, component APIs, patterns, and coding rules to AI assistants.

## Usage

### Claude Code / Cursor

Add to your MCP config:

```json
{
  "mcpServers": {
    "blazz": {
      "command": "npx",
      "args": ["@blazz/mcp"]
    }
  }
}
```

### Local development (in monorepo)

```json
{
  "mcpServers": {
    "blazz": {
      "command": "node",
      "args": ["packages/mcp/dist/index.js"]
    }
  }
}
```

If the server can't find the project root automatically, set the `BLAZZ_ROOT` environment variable:

```json
{
  "mcpServers": {
    "blazz": {
      "command": "node",
      "args": ["packages/mcp/dist/index.js"],
      "env": { "BLAZZ_ROOT": "/path/to/blazz-ui-app" }
    }
  }
}
```

## Tools

| Tool | Input | Description |
|------|-------|-------------|
| `list_components` | — | List all UI components with name, category, description |
| `get_component` | `name` | Get full API docs, props, and usage example for a component |
| `get_pattern` | `name` | Get a page pattern (resource-list, dashboard, pipeline-kanban, etc.) |
| `get_rules` | — | Get the coding rules and conventions |
| `get_design_principles` | — | Get design system principles (Tufte, Gestalt, density) |
| `get_tokens` | — | Get the CSS design tokens for all 3 themes |

## Available patterns

`resource-list`, `resource-detail`, `resource-create-edit`, `resource-import`, `dashboard`, `pipeline-kanban`, `reporting`
