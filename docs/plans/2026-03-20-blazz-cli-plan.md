# Blazz CLI — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the MCP server with a zero-dependency CLI that outputs markdown docs to stdout, consumed by LLMs and humans.

**Architecture:** A `packages/cli/` package built with tsup that bundles `ai/*.md` + `tokens.css` content at build time. Entry point parses `process.argv` and routes to command handlers. The `blazz-ui` skill and CLAUDE.md are updated to point to the CLI instead of MCP tools.

**Tech Stack:** TypeScript, tsup (ESM build), Node.js `process.argv` (no CLI framework)

---

### Task 1: Scaffold `packages/cli/` package

**Files:**
- Create: `packages/cli/package.json`
- Create: `packages/cli/tsconfig.json`
- Create: `packages/cli/tsup.config.ts`

**Step 1: Create package.json**

```json
{
  "name": "@blazz/cli",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "bin": {
    "blazz": "./dist/index.js"
  },
  "main": "./dist/index.js",
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 3: Create tsup.config.ts**

tsup must bundle the markdown content files at build time. Use the `define` option or a custom loader to inline file contents. The key insight: use a tsup plugin or `esbuild` loader to import `.md` and `.css` files as raw strings.

```ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  loader: {
    ".md": "text",
    ".css": "text",
  },
})
```

**Step 4: Install dependencies**

Run: `cd packages/cli && pnpm install`

**Step 5: Commit**

```bash
git add packages/cli/package.json packages/cli/tsconfig.json packages/cli/tsup.config.ts
git commit -m "feat(cli): scaffold @blazz/cli package"
```

---

### Task 2: Create the content loader with bundled files

**Files:**
- Create: `packages/cli/src/content/rules.md` (symlink or copy — see approach below)
- Create: `packages/cli/src/loader.ts`

**Approach:** tsup with `loader: { ".md": "text" }` lets us `import` markdown files directly as strings. But the source files live in `ai/` at project root, not inside `packages/cli/`. Two options:

- **Option A:** Import with relative paths `../../ai/rules.md`. tsup follows these at build time.
- **Option B:** Copy files into `packages/cli/src/content/` at build time via a pre-build script.

**Go with Option A** — simpler, no duplication, no sync issues. tsup resolves relative imports at build time and bundles the content inline.

**Step 1: Create loader.ts**

```ts
// Content files — bundled as strings by tsup (loader: { ".md": "text", ".css": "text" })
import componentsRaw from "../../ai/components.md"
import designRaw from "../../ai/design.md"
import dashboardPattern from "../../ai/patterns/dashboard.md"
import pipelineKanbanPattern from "../../ai/patterns/pipeline-kanban.md"
import reportingPattern from "../../ai/patterns/reporting.md"
import resourceCreateEditPattern from "../../ai/patterns/resource-create-edit.md"
import resourceDetailPattern from "../../ai/patterns/resource-detail.md"
import resourceImportPattern from "../../ai/patterns/resource-import.md"
import resourceListPattern from "../../ai/patterns/resource-list.md"
import rulesRaw from "../../ai/rules.md"
import tokensRaw from "../../packages/ui/styles/tokens.css"

export function loadRules(): string {
  return rulesRaw
}

export function loadComponents(): string {
  return componentsRaw
}

export function loadDesignPrinciples(): string {
  return designRaw
}

export function loadTokens(): string {
  return tokensRaw
}

const patterns: Record<string, string> = {
  "resource-list": resourceListPattern,
  "resource-detail": resourceDetailPattern,
  "resource-create-edit": resourceCreateEditPattern,
  "resource-import": resourceImportPattern,
  "dashboard": dashboardPattern,
  "pipeline-kanban": pipelineKanbanPattern,
  "reporting": reportingPattern,
}

export function loadPattern(name: string): string | null {
  return patterns[name] ?? null
}

export function listPatterns(): string[] {
  return Object.keys(patterns)
}
```

Note: The import paths for `../../ai/...` are relative to `packages/cli/src/loader.ts`. The `../../packages/ui/styles/tokens.css` path goes up to project root then into packages/ui. Verify these paths resolve correctly at build time.

**Step 2: Add TypeScript declarations for .md and .css imports**

Create: `packages/cli/src/types.d.ts`

```ts
declare module "*.md" {
  const content: string
  export default content
}

declare module "*.css" {
  const content: string
  export default content
}
```

**Step 3: Verify build works**

Run: `cd packages/cli && pnpm build`
Expected: `dist/index.js` created with markdown content inlined as strings.

**Step 4: Commit**

```bash
git add packages/cli/src/loader.ts packages/cli/src/types.d.ts
git commit -m "feat(cli): add content loader with bundled markdown files"
```

---

### Task 3: Port the component parser from MCP

**Files:**
- Create: `packages/cli/src/parse-components.ts`

**Step 1: Copy the parser from MCP**

The file `packages/mcp/src/content/parse-components.ts` already has `parseComponentList()` and `extractComponentSection()`. Copy it verbatim into `packages/cli/src/parse-components.ts`. The code is self-contained with no external dependencies.

```ts
// Copy the entire content of packages/mcp/src/content/parse-components.ts
// No changes needed — the parser is pure functions operating on strings.
```

**Step 2: Commit**

```bash
git add packages/cli/src/parse-components.ts
git commit -m "feat(cli): port component parser from MCP"
```

---

### Task 4: Create command handlers

**Files:**
- Create: `packages/cli/src/commands/list.ts`
- Create: `packages/cli/src/commands/show.ts`
- Create: `packages/cli/src/commands/pattern.ts`
- Create: `packages/cli/src/commands/rules.ts`
- Create: `packages/cli/src/commands/design.ts`
- Create: `packages/cli/src/commands/tokens.ts`

Each command handler is a function that takes args and writes to stdout.

**Step 1: Create `commands/rules.ts`**

```ts
import { loadRules } from "../loader.js"

export function rules(): void {
  process.stdout.write(loadRules())
}
```

**Step 2: Create `commands/design.ts`**

```ts
import { loadDesignPrinciples } from "../loader.js"

export function design(): void {
  process.stdout.write(loadDesignPrinciples())
}
```

**Step 3: Create `commands/tokens.ts`**

```ts
import { loadTokens } from "../loader.js"

export function tokens(): void {
  process.stdout.write(loadTokens())
}
```

**Step 4: Create `commands/list.ts`**

```ts
import { loadComponents } from "../loader.js"
import { parseComponentList } from "../parse-components.js"

export function list(): void {
  const markdown = loadComponents()
  const components = parseComponentList(markdown)

  const grouped = new Map<string, typeof components>()
  for (const c of components) {
    const group = grouped.get(c.category) ?? []
    group.push(c)
    grouped.set(c.category, group)
  }

  const lines: string[] = ["# Blazz Components\n"]
  for (const [category, items] of grouped) {
    lines.push(`## ${category}\n`)
    for (const item of items) {
      lines.push(`- **${item.name}** — ${item.description}`)
    }
    lines.push("")
  }

  process.stdout.write(lines.join("\n"))
}
```

**Step 5: Create `commands/show.ts`**

```ts
import { loadComponents } from "../loader.js"
import { extractComponentSection } from "../parse-components.js"

export function show(name: string): void {
  if (!name) {
    process.stderr.write('Usage: blazz show <component>\nExample: blazz show button\n')
    process.exit(1)
  }

  const markdown = loadComponents()
  const section = extractComponentSection(markdown, name)

  if (!section) {
    process.stderr.write(`Component "${name}" not found.\nRun "blazz list" to see available components.\n`)
    process.exit(1)
  }

  process.stdout.write(section)
}
```

**Step 6: Create `commands/pattern.ts`**

```ts
import { listPatterns, loadPattern } from "../loader.js"

export function pattern(name: string): void {
  if (!name) {
    const available = listPatterns()
    process.stderr.write(`Usage: blazz pattern <name>\nAvailable: ${available.join(", ")}\n`)
    process.exit(1)
  }

  const content = loadPattern(name)
  if (!content) {
    const available = listPatterns()
    process.stderr.write(`Pattern "${name}" not found.\nAvailable: ${available.join(", ")}\n`)
    process.exit(1)
  }

  process.stdout.write(content)
}
```

**Step 7: Commit**

```bash
git add packages/cli/src/commands/
git commit -m "feat(cli): add all 6 command handlers"
```

---

### Task 5: Create the CLI entry point

**Files:**
- Create: `packages/cli/src/index.ts`

**Step 1: Create index.ts**

```ts
import { design } from "./commands/design.js"
import { list } from "./commands/list.js"
import { pattern } from "./commands/pattern.js"
import { rules } from "./commands/rules.js"
import { show } from "./commands/show.js"
import { tokens } from "./commands/tokens.js"

const HELP = `Usage: blazz <command> [args]

Commands:
  list                List all components (name, category, description)
  show <component>    Full documentation for a specific component
  pattern <name>      Page pattern (resource-list, dashboard, etc.)
  rules               Non-negotiable coding rules and conventions
  design              Design principles (Tufte, Gestalt, density, spacing)
  tokens              CSS design tokens (oklch, 3 themes)

Examples:
  blazz list
  blazz show button
  blazz show data-table
  blazz pattern resource-list
  blazz rules
`

const [command, ...args] = process.argv.slice(2)

switch (command) {
  case "list":
    list()
    break
  case "show":
    show(args[0])
    break
  case "pattern":
    pattern(args[0])
    break
  case "rules":
    rules()
    break
  case "design":
    design()
    break
  case "tokens":
    tokens()
    break
  default:
    process.stdout.write(HELP)
    if (command && command !== "help" && command !== "--help" && command !== "-h") {
      process.exit(1)
    }
    break
}
```

**Step 2: Build and test locally**

Run: `cd packages/cli && pnpm build`
Expected: `dist/index.js` is created.

Run: `node packages/cli/dist/index.js --help`
Expected: Prints the help message.

Run: `node packages/cli/dist/index.js rules`
Expected: Prints the content of `ai/rules.md`.

Run: `node packages/cli/dist/index.js list`
Expected: Prints grouped component list in markdown.

Run: `node packages/cli/dist/index.js show button`
Expected: Prints the Button component section from `ai/components.md`.

Run: `node packages/cli/dist/index.js pattern resource-list`
Expected: Prints the resource-list pattern markdown.

**Step 3: Commit**

```bash
git add packages/cli/src/index.ts
git commit -m "feat(cli): add CLI entry point with argument routing"
```

---

### Task 6: Build, verify, and link locally

**Step 1: Run full build**

Run: `pnpm build --filter @blazz/cli`
Expected: Clean build, `packages/cli/dist/index.js` contains bundled content.

**Step 2: Verify file size**

Run: `wc -c packages/cli/dist/index.js`
Expected: Should be in the range of 50-200KB (all markdown content inlined).

**Step 3: Test all 6 commands**

```bash
node packages/cli/dist/index.js list
node packages/cli/dist/index.js show button
node packages/cli/dist/index.js show data-table
node packages/cli/dist/index.js pattern resource-list
node packages/cli/dist/index.js pattern dashboard
node packages/cli/dist/index.js rules
node packages/cli/dist/index.js design
node packages/cli/dist/index.js tokens
node packages/cli/dist/index.js --help
node packages/cli/dist/index.js show nonexistent  # should error to stderr
node packages/cli/dist/index.js pattern nonexistent  # should error to stderr
```

**Step 4: Test pnpm workspace link**

The `blazz` binary should be available via pnpm workspace. Test:

Run: `pnpm --filter @blazz/cli exec blazz list`
Or after build: `./packages/cli/dist/index.js list`

**Step 5: Commit (if any fixes were needed)**

```bash
git add -A packages/cli/
git commit -m "fix(cli): build and runtime fixes"
```

---

### Task 7: Update the `blazz-ui` skill to use CLI instead of MCP

**Files:**
- Modify: `/Users/jonathanruas/.claude/skills/blazz-ui/SKILL.md`

**Step 1: Add CLI instructions to the skill**

At the top of the skill file (after the frontmatter and before the existing content), add a section that instructs Claude to use the CLI. The key addition:

```markdown
## RÈGLE -1 — CLI OBLIGATOIRE

Avant de coder du UI, tu DOIS appeler le CLI Blazz pour charger le contexte nécessaire :

1. **Toujours en premier :** `blazz rules` — lis les règles non-négociables
2. **Pour chaque composant utilisé :** `blazz show <component>` — lis la doc du composant
3. **Pour une page complète :** `blazz pattern <name>` — lis le pattern de page

Commandes disponibles :
- `blazz list` — liste tous les composants
- `blazz show <component>` — doc complète d'un composant (props, exemples, gotchas)
- `blazz pattern <name>` — pattern de page (resource-list, dashboard, pipeline-kanban, etc.)
- `blazz rules` — règles de code non-négociables
- `blazz design` — principes design (Tufte, Gestalt, densité)
- `blazz tokens` — design tokens CSS oklch

Appelle ces commandes via l'outil Bash. Le CLI est dans le workspace : `node packages/cli/dist/index.js <command>`.
```

**Step 2: Commit**

```bash
git add /Users/jonathanruas/.claude/skills/blazz-ui/SKILL.md
git commit -m "feat(skill): update blazz-ui skill to use CLI instead of MCP"
```

---

### Task 8: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add CLI reference to CLAUDE.md**

In the `## Conventions` section of CLAUDE.md, add:

```markdown
- Avant de coder du UI, utiliser le CLI `blazz` (ex: `blazz rules`, `blazz show button`, `blazz pattern resource-list`)
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add blazz CLI reference to CLAUDE.md"
```

---

### Task 9: Remove MCP server

**Files:**
- Delete: `packages/mcp/` (entire directory)
- Delete: `.mcp.json`

**Step 1: Delete MCP package**

Run: `rm -rf packages/mcp`

**Step 2: Delete MCP config**

Run: `rm .mcp.json`

**Step 3: Verify monorepo still builds**

Run: `pnpm install` (update lockfile — MCP deps removed)
Run: `pnpm build`
Expected: All packages build successfully. No references to `@blazz/mcp`.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove MCP server, replaced by @blazz/cli"
```

---

### Task 10: Final integration test

**Step 1: Full clean build**

```bash
pnpm install
pnpm build --filter @blazz/cli
```

**Step 2: Test all commands produce output**

```bash
node packages/cli/dist/index.js list | head -20
node packages/cli/dist/index.js show button | head -20
node packages/cli/dist/index.js pattern resource-list | head -20
node packages/cli/dist/index.js rules | head -20
node packages/cli/dist/index.js design | head -20
node packages/cli/dist/index.js tokens | head -20
```

All should produce non-empty markdown output.

**Step 3: Test error cases**

```bash
node packages/cli/dist/index.js show nonexistent 2>&1
node packages/cli/dist/index.js pattern nonexistent 2>&1
node packages/cli/dist/index.js  # no args → help
```

**Step 4: Verify MCP is fully gone**

```bash
test ! -d packages/mcp && echo "OK: MCP removed"
test ! -f .mcp.json && echo "OK: .mcp.json removed"
```

**Step 5: Commit if any final fixes**

```bash
git add -A
git commit -m "test(cli): verify all commands and error cases"
```
