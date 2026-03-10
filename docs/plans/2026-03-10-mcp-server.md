# @blazz/mcp — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an MCP server package that exposes 6 read-only tools serving the existing AI docs to Claude Code / Cursor.

**Architecture:** Stdio-based MCP server using `@modelcontextprotocol/sdk`. Content from `ai/*.md` and `tokens.css` is read at runtime via `fs`. The server is a standalone Node CLI (`npx @blazz/mcp`). Each tool is a separate module.

**Tech Stack:** `@modelcontextprotocol/sdk` v1.x, TypeScript, tsup (ESM build), zod (already in monorepo)

---

### Task 1: Scaffold `packages/mcp/` package

**Files:**
- Create: `packages/mcp/package.json`
- Create: `packages/mcp/tsconfig.json`
- Create: `packages/mcp/tsup.config.ts`

**Step 1: Create `package.json`**

```json
{
  "name": "@blazz/mcp",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "bin": {
    "blazz-mcp": "./dist/index.js"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.12.1",
    "zod": "^3.25.67"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

Note: Check latest `@modelcontextprotocol/sdk` version on npm before installing. Use zod v3 (not v4) because `@modelcontextprotocol/sdk` v1.x depends on zod v3.

**Step 2: Create `tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "sourceMap": true,
    "noEmit": false
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create `tsup.config.ts`**

```ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
})
```

The `banner` adds the shebang for CLI execution via `npx`.

**Step 4: Install dependencies**

Run: `cd packages/mcp && pnpm install`

**Step 5: Commit**

```bash
git add packages/mcp/package.json packages/mcp/tsconfig.json packages/mcp/tsup.config.ts pnpm-lock.yaml
git commit -m "feat(mcp): scaffold @blazz/mcp package"
```

---

### Task 2: Content loader module

**Files:**
- Create: `packages/mcp/src/content/loader.ts`

**Step 1: Write the content loader**

This module resolves paths relative to the monorepo root (2 levels up from `packages/mcp/`) and reads AI docs at runtime.

```ts
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// In dev: packages/mcp/src/content/ → ../../.. → repo root
// In dist (npx): resolve from installed package → may need BLAZZ_ROOT env
function getRoot(): string {
  if (process.env.BLAZZ_ROOT) return process.env.BLAZZ_ROOT
  // Walk up from dist/ or src/ to find ai/ directory
  let dir = resolve(__dirname)
  for (let i = 0; i < 6; i++) {
    dir = dirname(dir)
    try {
      readdirSync(join(dir, "ai"))
      return dir
    } catch {
      // continue
    }
  }
  throw new Error(
    "Could not find project root. Set BLAZZ_ROOT environment variable."
  )
}

const ROOT = getRoot()

function readFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf-8")
}

export function loadRules(): string {
  return readFile("ai/rules.md")
}

export function loadComponents(): string {
  return readFile("ai/components.md")
}

export function loadPattern(name: string): string {
  const safeName = name.replace(/[^a-z0-9-]/gi, "")
  return readFile(`ai/patterns/${safeName}.md`)
}

export function listPatterns(): string[] {
  const dir = join(ROOT, "ai/patterns")
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""))
}

export function loadDesignPrinciples(): string {
  return readFile("ai/design.md")
}

export function loadTokens(): string {
  return readFile("packages/ui/styles/tokens.css")
}
```

**Step 2: Commit**

```bash
git add packages/mcp/src/content/loader.ts
git commit -m "feat(mcp): add content loader for AI docs"
```

---

### Task 3: Parse `components.md` for listing

**Files:**
- Create: `packages/mcp/src/content/parse-components.ts`

**Step 1: Write the parser**

`ai/components.md` has sections with `### ComponentName` headings. Parse them into a structured list.

```ts
interface ComponentEntry {
  name: string
  category: string
  description: string
}

export function parseComponentList(markdown: string): ComponentEntry[] {
  const components: ComponentEntry[] = []
  let currentCategory = ""

  for (const line of markdown.split("\n")) {
    // Category headers: ## Primitives, ## Blocks Data, etc.
    const catMatch = line.match(/^## (.+)/)
    if (catMatch) {
      currentCategory = catMatch[1].trim()
      continue
    }

    // Component entries: - **Button** — description
    // or ### ComponentName
    const boldMatch = line.match(/^- \*\*(\w+)\*\*\s*[—–-]\s*(.+)/)
    if (boldMatch) {
      components.push({
        name: boldMatch[1],
        category: currentCategory,
        description: boldMatch[2].trim().replace(/\.$/, ""),
      })
      continue
    }

    const headingMatch = line.match(/^### (\w+)/)
    if (headingMatch && currentCategory) {
      components.push({
        name: headingMatch[1],
        category: currentCategory,
        description: "",
      })
    }
  }

  return components
}

export function extractComponentSection(
  markdown: string,
  name: string
): string | null {
  // Find the component section by looking for ### Name or **Name**
  const lines = markdown.split("\n")
  let start = -1
  let level = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Match ### ComponentName or - **ComponentName**
    if (
      line.match(new RegExp(`^### ${name}\\b`, "i")) ||
      line.match(new RegExp(`^- \\*\\*${name}\\*\\*`, "i"))
    ) {
      start = i
      level = line.startsWith("###") ? 3 : 0
      continue
    }

    // If we've started, look for the next section at same or higher level
    if (start >= 0 && i > start) {
      if (level === 3 && line.match(/^### \w/)) break
      if (level === 0 && line.match(/^- \*\*\w+\*\*/)) break
      if (line.match(/^## /)) break
    }
  }

  if (start < 0) return null
  const end =
    lines.findIndex(
      (l, i) =>
        i > start &&
        (l.match(/^### \w/) || l.match(/^## /) || l.match(/^- \*\*\w+\*\*/))
    ) || lines.length

  return lines
    .slice(start, end === -1 ? undefined : end)
    .join("\n")
    .trim()
}
```

**Step 2: Commit**

```bash
git add packages/mcp/src/content/parse-components.ts
git commit -m "feat(mcp): add components.md parser"
```

---

### Task 4: Implement 6 tools

**Files:**
- Create: `packages/mcp/src/tools/list-components.ts`
- Create: `packages/mcp/src/tools/get-component.ts`
- Create: `packages/mcp/src/tools/get-pattern.ts`
- Create: `packages/mcp/src/tools/get-rules.ts`
- Create: `packages/mcp/src/tools/get-design-principles.ts`
- Create: `packages/mcp/src/tools/get-tokens.ts`

Each tool exports a `register(server)` function using the `server.tool()` convenience API.

**Step 1: `list-components.ts`**

```ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { loadComponents } from "../content/loader.js"
import { parseComponentList } from "../content/parse-components.js"

export function registerListComponents(server: Server) {
  server.tool(
    "list_components",
    "List all available UI components with name, category, and description",
    {},
    async () => {
      const markdown = loadComponents()
      const components = parseComponentList(markdown)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(components, null, 2),
          },
        ],
      }
    }
  )
}
```

**Step 2: `get-component.ts`**

```ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { z } from "zod"
import { loadComponents } from "../content/loader.js"
import { extractComponentSection } from "../content/parse-components.js"

export function registerGetComponent(server: Server) {
  server.tool(
    "get_component",
    "Get full API documentation, props, and usage example for a specific component",
    { name: z.string().describe("Component name (e.g. DataGrid, Button, PageHeader)") },
    async ({ name }) => {
      const markdown = loadComponents()
      const section = extractComponentSection(markdown, name)
      if (!section) {
        return {
          content: [{ type: "text", text: `Component "${name}" not found. Use list_components to see available components.` }],
          isError: true,
        }
      }
      return {
        content: [{ type: "text", text: section }],
      }
    }
  )
}
```

**Step 3: `get-pattern.ts`**

```ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { z } from "zod"
import { listPatterns, loadPattern } from "../content/loader.js"

export function registerGetPattern(server: Server) {
  server.tool(
    "get_pattern",
    "Get a full page pattern with file structure, code examples, and conventions. Available patterns: resource-list, resource-detail, resource-create-edit, resource-import, dashboard, pipeline-kanban, reporting",
    { name: z.string().describe("Pattern name (e.g. resource-list, dashboard, pipeline-kanban)") },
    async ({ name }) => {
      const available = listPatterns()
      if (!available.includes(name)) {
        return {
          content: [{ type: "text", text: `Pattern "${name}" not found. Available: ${available.join(", ")}` }],
          isError: true,
        }
      }
      const content = loadPattern(name)
      return {
        content: [{ type: "text", text: content }],
      }
    }
  )
}
```

**Step 4: `get-rules.ts`**

```ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { loadRules } from "../content/loader.js"

export function registerGetRules(server: Server) {
  server.tool(
    "get_rules",
    "Get the non-negotiable coding rules and conventions for the UI kit (architecture, forms, data fetching, states, accessibility)",
    {},
    async () => {
      const content = loadRules()
      return {
        content: [{ type: "text", text: content }],
      }
    }
  )
}
```

**Step 5: `get-design-principles.ts`**

```ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { loadDesignPrinciples } from "../content/loader.js"

export function registerGetDesignPrinciples(server: Server) {
  server.tool(
    "get_design_principles",
    "Get the design system principles: Tufte data-ink ratio, Gestalt laws, density patterns, spacing, typography, color usage, and anti-patterns",
    {},
    async () => {
      const content = loadDesignPrinciples()
      return {
        content: [{ type: "text", text: content }],
      }
    }
  )
}
```

**Step 6: `get-tokens.ts`**

```ts
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { loadTokens } from "../content/loader.js"

export function registerGetTokens(server: Server) {
  server.tool(
    "get_tokens",
    "Get the CSS design tokens (surfaces, borders, text, accent, semantic colors, density, layout variables) for all 3 themes",
    {},
    async () => {
      const content = loadTokens()
      return {
        content: [{ type: "text", text: content }],
      }
    }
  )
}
```

**Step 7: Commit**

```bash
git add packages/mcp/src/tools/
git commit -m "feat(mcp): implement 6 MCP tools"
```

---

### Task 5: Server entry point

**Files:**
- Create: `packages/mcp/src/index.ts`

**Step 1: Write the server entry point**

```ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerGetComponent } from "./tools/get-component.js"
import { registerGetDesignPrinciples } from "./tools/get-design-principles.js"
import { registerGetPattern } from "./tools/get-pattern.js"
import { registerGetRules } from "./tools/get-rules.js"
import { registerGetTokens } from "./tools/get-tokens.js"
import { registerListComponents } from "./tools/list-components.js"

const server = new Server(
  { name: "@blazz/mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
)

// Register all tools
registerListComponents(server)
registerGetComponent(server)
registerGetPattern(server)
registerGetRules(server)
registerGetDesignPrinciples(server)
registerGetTokens(server)

// Connect via stdio
const transport = new StdioServerTransport()
await server.connect(transport)
console.error("@blazz/mcp server running")
```

**Step 2: Commit**

```bash
git add packages/mcp/src/index.ts
git commit -m "feat(mcp): add server entry point with stdio transport"
```

---

### Task 6: Build, test manually, document

**Step 1: Build the package**

Run: `cd packages/mcp && pnpm build`
Expected: `dist/index.js` created with shebang, no errors.

**Step 2: Test locally**

Run: `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node packages/mcp/dist/index.js`
Expected: JSON response listing 6 tools.

If that doesn't work with plain echo (MCP needs proper initialization), test with:
```bash
node packages/mcp/dist/index.js <<'EOF'
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list"}
EOF
```

**Step 3: Test in Claude Code**

Add to `.claude/mcp.json` (or create it):
```json
{
  "mcpServers": {
    "blazz": {
      "command": "node",
      "args": ["packages/mcp/dist/index.js"],
      "env": {
        "BLAZZ_ROOT": "/Users/jonathanruas/Development/blazz-ui-app"
      }
    }
  }
}
```

Restart Claude Code and verify the 6 tools appear.

**Step 4: Add README**

Create `packages/mcp/README.md` with usage instructions:

```markdown
# @blazz/mcp

MCP server for the Blazz UI Kit. Exposes design system docs, component APIs, patterns, and coding rules to AI assistants.

## Usage

### Claude Code / Cursor

Add to your MCP config:

\```json
{
  "mcpServers": {
    "blazz": {
      "command": "npx",
      "args": ["@blazz/mcp"]
    }
  }
}
\```

### Local development (in monorepo)

\```json
{
  "mcpServers": {
    "blazz": {
      "command": "node",
      "args": ["packages/mcp/dist/index.js"]
    }
  }
}
\```

## Tools

| Tool | Description |
|------|-------------|
| `list_components` | List all UI components with name, category, description |
| `get_component` | Get full API docs + props + example for a component |
| `get_pattern` | Get a page pattern (resource-list, dashboard, etc.) |
| `get_rules` | Get the coding rules and conventions |
| `get_design_principles` | Get design system principles (Tufte, Gestalt, density) |
| `get_tokens` | Get the CSS design tokens for all themes |
```

**Step 5: Final commit**

```bash
git add packages/mcp/
git commit -m "feat(mcp): complete @blazz/mcp server with 6 tools and README"
```

---

## Summary

6 tasks, ~45 min total estimated effort:

| Task | Description | Effort |
|------|-------------|--------|
| 1 | Scaffold package (package.json, tsconfig, tsup) | 5 min |
| 2 | Content loader (read ai/ files) | 5 min |
| 3 | Components parser (list + extract sections) | 10 min |
| 4 | 6 tool modules | 10 min |
| 5 | Server entry point | 5 min |
| 6 | Build, test, README | 10 min |
