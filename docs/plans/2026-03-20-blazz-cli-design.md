# Blazz CLI — Design Document

**Date:** 2026-03-20
**Status:** Approved
**Replaces:** `packages/mcp/` (MCP server)

## Problem

The MCP server injects context into every Claude message — wasting tokens even on non-UI tasks. We need an on-demand approach where the LLM fetches Blazz documentation only when it needs it.

## Solution

A zero-dependency CLI that outputs markdown documentation to stdout. Consumed by:
- **LLMs** (Claude Code, Cursor) — via Bash tool calls, guided by the `blazz-ui` skill
- **Humans** — directly in the terminal

## Commands

```
blazz list                    # All components (name, category, one-liner)
blazz show <component>        # Full doc: props, examples, gotchas
blazz pattern <name>          # Page pattern (resource-list, dashboard, etc.)
blazz rules                   # 12 non-negotiable coding rules
blazz design                  # Design principles (Tufte, Gestalt, tokens)
blazz tokens                  # CSS design tokens oklch (3 themes)
```

## Architecture

```
packages/cli/
├── package.json              ← @blazz/cli, bin: { "blazz": "./dist/index.js" }
├── tsconfig.json
├── tsup.config.ts            ← ESM build, bundles content at build time
└── src/
    ├── index.ts              ← Entry: parses process.argv, routes to command
    ├── commands/
    │   ├── list.ts
    │   ├── show.ts
    │   ├── pattern.ts
    │   ├── rules.ts
    │   ├── design.ts
    │   └── tokens.ts
    └── loader.ts             ← Reads ai/*.md + tokens.css, bundled as strings
```

### Key decisions

- **No CLI framework** — `process.argv` is sufficient for 6 flat commands. Zero runtime dependencies.
- **Content bundled at build** — tsup inlines the markdown files as strings. The CLI is self-contained, no filesystem reads at runtime.
- **Markdown output only** — no JSON, no flags. LLMs parse markdown perfectly, humans read it well in terminal.

## Content Sources

Reuses existing files as-is:

| Command | Source file |
|---------|------------|
| `blazz rules` | `ai/rules.md` |
| `blazz list` | `ai/components.md` (parsed into summary) |
| `blazz show <name>` | `ai/components.md` (parsed by section) |
| `blazz pattern <name>` | `ai/patterns/<name>.md` |
| `blazz design` | `ai/design.md` |
| `blazz tokens` | `packages/ui/styles/tokens.css` |

## Claude Code Integration

### 1. CLAUDE.md (one line)

```
- Avant de coder du UI, utiliser le CLI `blazz` (ex: `blazz rules`, `blazz show button`)
```

### 2. Skill `blazz-ui` (updated)

The existing skill is updated to instruct Claude:

1. `blazz rules` — read the rules before any UI work
2. `blazz show <component>` — for each component being used
3. `blazz pattern <name>` — when building a full page

This replaces the MCP tools. Claude calls the CLI via Bash only when needed → 0 tokens on non-UI conversations.

## What Gets Removed

- `packages/mcp/` — deleted entirely
- `.mcp.json` — deleted
- MCP tool references in Claude config — removed

## Build & Distribution

- Built with `tsup` → single ESM file with inlined content
- `pnpm build --filter @blazz/cli`
- Published to npm: `npx @blazz/cli show button`
- Local dev: linked via pnpm workspace

## Output Example

```bash
$ blazz show data-table
# DataTable

> @blazz/pro/components/blocks/data-table

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | ColumnDef[] | required | Column definitions via col() helper |
...

## Examples
...

## Gotchas
- Always use `col()` helper, never raw `columnHelper`
...
```

```bash
$ blazz list
# Blazz Components

## UI Primitives
- **button** — Button with variants and sizes
- **input** — Input with label and error state
...

## Patterns
- **app-frame** — Main shell with sidebar + topbar
...

## Blocks
- **data-table** — Data table with sort, filters, pagination
...
```
