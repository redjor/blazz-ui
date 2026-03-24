# Blazz OPS CLI — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a CLI (`blazz-ops`) for managing notes and todos via Convex, with MCP server mode for Claude Code integration.

**Architecture:** Commander.js CLI in `apps/ops/cli/`, communicating with Convex via `ConvexHttpClient` + `internalQuery`/`internalMutation`. MCP server exposed via `blazz-ops mcp` using stdio transport.

**Tech Stack:** Node.js, Commander.js, convex (ConvexHttpClient), @modelcontextprotocol/sdk, tsx (runner), dotenv, chalk

---

### Task 1: Project setup — deps, config, entry point

**Files:**
- Modify: `apps/ops/package.json` (add deps + scripts)
- Create: `apps/ops/cli/bin.ts`
- Create: `apps/ops/cli/lib/config.ts`
- Create: `apps/ops/cli/lib/convex-client.ts`
- Create: `apps/ops/cli/lib/output.ts`

**Step 1: Install dependencies**

Run:
```bash
cd apps/ops && pnpm add commander chalk dotenv @modelcontextprotocol/sdk
```

**Step 2: Add CLI script to package.json**

Add to `scripts`:
```json
"cli": "tsx cli/bin.ts"
```

**Step 3: Create config loader `cli/lib/config.ts`**

```ts
import { config } from "dotenv"
import { resolve } from "node:path"
import { homedir } from "node:os"
import { existsSync } from "node:fs"

export interface CliConfig {
  convexUrl: string
  deployKey: string
  userId: string
}

export function loadConfig(): CliConfig {
  // 1. Try ~/.blazz-ops/.env
  const homeEnv = resolve(homedir(), ".blazz-ops", ".env")
  if (existsSync(homeEnv)) {
    config({ path: homeEnv })
  }

  const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL
  const deployKey = process.env.CONVEX_DEPLOY_KEY
  const userId = process.env.OPS_USER_ID

  if (!convexUrl) throw new Error("Missing CONVEX_URL or NEXT_PUBLIC_CONVEX_URL")
  if (!deployKey) throw new Error("Missing CONVEX_DEPLOY_KEY")
  if (!userId) throw new Error("Missing OPS_USER_ID")

  return { convexUrl, deployKey, userId }
}
```

**Step 4: Create Convex client wrapper `cli/lib/convex-client.ts`**

```ts
import { ConvexHttpClient } from "convex/browser"
import type { CliConfig } from "./config"

let client: ConvexHttpClient | null = null

export function getClient(config: CliConfig): ConvexHttpClient {
  if (!client) {
    client = new ConvexHttpClient(config.convexUrl)
    client.setAdminAuth(config.deployKey)
  }
  return client
}
```

**Step 5: Create output formatter `cli/lib/output.ts`**

```ts
import chalk from "chalk"

let jsonMode = false

export function setJsonMode(enabled: boolean) {
  jsonMode = enabled
}

export function isJsonMode(): boolean {
  return jsonMode
}

export function output(data: unknown) {
  if (jsonMode) {
    console.log(JSON.stringify(data, null, 2))
    return
  }
  // For arrays, print as table-like output
  if (Array.isArray(data)) {
    for (const item of data) {
      printRecord(item)
    }
    return
  }
  printRecord(data as Record<string, unknown>)
}

function printRecord(record: Record<string, unknown>) {
  const id = record._id ?? record.id ?? ""
  const title = record.title ?? record.text ?? ""
  const status = record.status ?? ""
  const pinned = record.pinned ? chalk.yellow("★") : ""
  const locked = record.locked ? chalk.red("🔒") : ""

  const meta = [status, pinned, locked].filter(Boolean).join(" ")
  console.log(`${chalk.dim(String(id))}  ${title}  ${chalk.cyan(meta)}`)
}

export function success(msg: string) {
  if (jsonMode) return
  console.log(chalk.green(`✓ ${msg}`))
}

export function error(msg: string) {
  console.error(chalk.red(`✗ ${msg}`))
}
```

**Step 6: Create entry point `cli/bin.ts`**

```ts
#!/usr/bin/env node
import { Command } from "commander"
import { setJsonMode } from "./lib/output"

const program = new Command()

program
  .name("blazz-ops")
  .description("Blazz OPS CLI — manage notes, todos, and more")
  .version("0.1.0")
  .option("--json", "Output as JSON")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.opts()
    if (opts.json) setJsonMode(true)
  })

// Commands will be registered here in subsequent tasks

program.parse()
```

**Step 7: Test the skeleton**

Run: `cd apps/ops && pnpm cli --help`
Expected: Shows help text with `blazz-ops` name and `--json` option.

**Step 8: Commit**

```bash
git add apps/ops/cli/ apps/ops/package.json pnpm-lock.yaml
git commit -m "feat(ops-cli): scaffold CLI with config, convex client, output formatter"
```

---

### Task 2: Convex internal functions for CLI

**Files:**
- Create: `apps/ops/convex/cli.ts`

**Step 1: Create `convex/cli.ts` with notes internal functions**

```ts
import { v } from "convex/values"
import { internalMutation, internalQuery } from "./_generated/server"

// ── Notes ──

export const notesList = internalQuery({
  args: {
    userId: v.string(),
    entityType: v.optional(
      v.union(
        v.literal("client"),
        v.literal("project"),
        v.literal("contract"),
        v.literal("invoice"),
        v.literal("todo"),
        v.literal("general")
      )
    ),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, entityType, pinned }) => {
    let notes
    if (entityType) {
      notes = await ctx.db
        .query("notes")
        .withIndex("by_entity_updated", (q) =>
          q.eq("userId", userId).eq("entityType", entityType)
        )
        .order("desc")
        .collect()
    } else {
      notes = await ctx.db
        .query("notes")
        .withIndex("by_user_updated", (q) => q.eq("userId", userId))
        .order("desc")
        .collect()
    }
    if (pinned !== undefined) {
      notes = notes.filter((n) => n.pinned === pinned)
    }
    return notes.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.updatedAt - a.updatedAt
    })
  },
})

export const notesGet = internalQuery({
  args: { userId: v.string(), id: v.id("notes") },
  handler: async (ctx, { userId, id }) => {
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) return null
    return note
  },
})

export const notesCreate = internalMutation({
  args: {
    userId: v.string(),
    entityType: v.union(
      v.literal("client"),
      v.literal("project"),
      v.literal("contract"),
      v.literal("invoice"),
      v.literal("todo"),
      v.literal("general")
    ),
    entityId: v.optional(v.string()),
    title: v.optional(v.string()),
    contentText: v.optional(v.string()),
    pinned: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, entityType, entityId, title, contentText, pinned = false }) => {
    const now = Date.now()
    return ctx.db.insert("notes", {
      userId,
      entityType,
      entityId,
      title: title?.trim() || "Nouvelle note",
      contentText,
      pinned,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const notesUpdate = internalMutation({
  args: {
    userId: v.string(),
    id: v.id("notes"),
    title: v.optional(v.string()),
    contentText: v.optional(v.union(v.string(), v.null())),
    pinned: v.optional(v.boolean()),
    locked: v.optional(v.boolean()),
  },
  handler: async (ctx, { userId, id, title, contentText, pinned, locked }) => {
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) throw new Error("Introuvable")
    const isContentEdit = title !== undefined || contentText !== undefined
    if (note.locked && locked !== false && isContentEdit) {
      throw new Error("Note verrouillée")
    }
    const patch: Record<string, unknown> = { updatedAt: Date.now() }
    if (title !== undefined) patch.title = title.trim() || "Nouvelle note"
    if (contentText !== undefined) patch.contentText = contentText ?? undefined
    if (pinned !== undefined) patch.pinned = pinned
    if (locked !== undefined) patch.locked = locked
    return ctx.db.patch(id, patch)
  },
})

export const notesRemove = internalMutation({
  args: { userId: v.string(), id: v.id("notes") },
  handler: async (ctx, { userId, id }) => {
    const note = await ctx.db.get(id)
    if (!note || note.userId !== userId) throw new Error("Introuvable")
    if (note.locked) throw new Error("Note verrouillée")
    return ctx.db.delete(id)
  },
})

// ── Todos ──

const statusValidator = v.union(
  v.literal("triage"),
  v.literal("todo"),
  v.literal("blocked"),
  v.literal("in_progress"),
  v.literal("done")
)

const priorityValidator = v.union(
  v.literal("urgent"),
  v.literal("high"),
  v.literal("normal"),
  v.literal("low")
)

export const todosList = internalQuery({
  args: {
    userId: v.string(),
    status: v.optional(statusValidator),
    projectId: v.optional(v.string()),
    priority: v.optional(priorityValidator),
  },
  handler: async (ctx, { userId, status, projectId, priority }) => {
    let todos
    if (status) {
      todos = await ctx.db
        .query("todos")
        .withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", status))
        .collect()
    } else {
      todos = await ctx.db
        .query("todos")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .collect()
    }
    if (projectId) {
      todos = todos.filter((t) => String(t.projectId) === projectId)
    }
    if (priority) {
      todos = todos.filter((t) => t.priority === priority)
    }
    return todos
  },
})

export const todosGet = internalQuery({
  args: { userId: v.string(), id: v.id("todos") },
  handler: async (ctx, { userId, id }) => {
    const todo = await ctx.db.get(id)
    if (!todo || todo.userId !== userId) return null
    return todo
  },
})

export const todosCreate = internalMutation({
  args: {
    userId: v.string(),
    text: v.string(),
    description: v.optional(v.string()),
    status: v.optional(statusValidator),
    dueDate: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    priority: v.optional(priorityValidator),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { userId, text, description, status = "triage", dueDate, projectId, priority, tags }) => {
    return ctx.db.insert("todos", {
      text,
      description,
      userId,
      status,
      source: "app" as const,
      dueDate,
      projectId,
      priority,
      tags,
      createdAt: Date.now(),
    })
  },
})

export const todosUpdate = internalMutation({
  args: {
    userId: v.string(),
    id: v.id("todos"),
    text: v.optional(v.string()),
    description: v.optional(v.union(v.string(), v.null())),
    priority: v.optional(priorityValidator),
    dueDate: v.optional(v.union(v.string(), v.null())),
    projectId: v.optional(v.union(v.id("projects"), v.null())),
    tags: v.optional(v.union(v.array(v.string()), v.null())),
  },
  handler: async (ctx, { userId, id, text, description, priority, dueDate, projectId, tags }) => {
    const todo = await ctx.db.get(id)
    if (!todo || todo.userId !== userId) throw new Error("Introuvable")
    const patch: Record<string, unknown> = {}
    if (text !== undefined) patch.text = text
    if (description !== undefined) patch.description = description ?? undefined
    if (priority !== undefined) patch.priority = priority ?? undefined
    if (dueDate !== undefined) patch.dueDate = dueDate ?? undefined
    if (projectId !== undefined) patch.projectId = projectId ?? undefined
    if (tags !== undefined) patch.tags = tags ?? undefined
    return ctx.db.patch(id, patch)
  },
})

export const todosUpdateStatus = internalMutation({
  args: {
    userId: v.string(),
    id: v.id("todos"),
    status: statusValidator,
  },
  handler: async (ctx, { userId, id, status }) => {
    const todo = await ctx.db.get(id)
    if (!todo || todo.userId !== userId) throw new Error("Introuvable")
    return ctx.db.patch(id, { status })
  },
})

export const todosRemove = internalMutation({
  args: { userId: v.string(), id: v.id("todos") },
  handler: async (ctx, { userId, id }) => {
    const todo = await ctx.db.get(id)
    if (!todo || todo.userId !== userId) throw new Error("Introuvable")
    return ctx.db.delete(id)
  },
})
```

**Step 2: Verify Convex codegen picks up the new file**

Run: `cd apps/ops && npx convex dev --once`
Expected: Codegen succeeds, `convex/_generated/api.d.ts` includes `cli` module with internal functions.

**Step 3: Commit**

```bash
git add apps/ops/convex/cli.ts
git commit -m "feat(ops-cli): add internal Convex functions for CLI notes + todos"
```

---

### Task 3: Notes commands

**Files:**
- Create: `apps/ops/cli/commands/notes.ts`
- Modify: `apps/ops/cli/bin.ts` (register notes command)

**Step 1: Create `cli/commands/notes.ts`**

```ts
import { Command } from "commander"
import { api } from "../../convex/_generated/api"
import { loadConfig } from "../lib/config"
import { getClient } from "../lib/convex-client"
import { output, success, error } from "../lib/output"

export function registerNotesCommand(program: Command) {
  const notes = program.command("notes").description("Manage notes")

  notes
    .command("list")
    .description("List notes")
    .option("--entity-type <type>", "Filter by entity type (client|project|contract|invoice|todo|general)")
    .option("--pinned", "Only pinned notes")
    .action(async (opts) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        const result = await client.query(api.cli.notesList, {
          userId: config.userId,
          entityType: opts.entityType,
          pinned: opts.pinned ? true : undefined,
        })
        output(result)
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  notes
    .command("get <id>")
    .description("Get a note by ID")
    .action(async (id) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        const result = await client.query(api.cli.notesGet, {
          userId: config.userId,
          id,
        })
        if (!result) {
          error("Note introuvable")
          process.exit(1)
        }
        output(result)
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  notes
    .command("create")
    .description("Create a note")
    .requiredOption("--title <title>", "Note title")
    .option("--content <text>", "Plain text content")
    .option("--entity-type <type>", "Entity type", "general")
    .option("--entity-id <id>", "Entity ID")
    .option("--pinned", "Pin the note")
    .action(async (opts) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        const id = await client.mutation(api.cli.notesCreate, {
          userId: config.userId,
          title: opts.title,
          contentText: opts.content,
          entityType: opts.entityType,
          entityId: opts.entityId,
          pinned: opts.pinned ? true : undefined,
        })
        success(`Note created: ${id}`)
        output({ _id: id })
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  notes
    .command("update <id>")
    .description("Update a note")
    .option("--title <title>", "New title")
    .option("--content <text>", "New content")
    .option("--pin", "Pin the note")
    .option("--unpin", "Unpin the note")
    .option("--lock", "Lock the note")
    .option("--unlock", "Unlock the note")
    .action(async (id, opts) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        await client.mutation(api.cli.notesUpdate, {
          userId: config.userId,
          id,
          title: opts.title,
          contentText: opts.content,
          pinned: opts.pin ? true : opts.unpin ? false : undefined,
          locked: opts.lock ? true : opts.unlock ? false : undefined,
        })
        success("Note updated")
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  notes
    .command("remove <id>")
    .description("Remove a note")
    .action(async (id) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        await client.mutation(api.cli.notesRemove, {
          userId: config.userId,
          id,
        })
        success("Note removed")
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })
}
```

**Step 2: Register in `cli/bin.ts`**

Add import and registration:
```ts
import { registerNotesCommand } from "./commands/notes"

// After program definition, before program.parse():
registerNotesCommand(program)
```

**Step 3: Test notes commands**

Run: `cd apps/ops && pnpm cli notes --help`
Expected: Shows subcommands list|get|create|update|remove.

Run: `cd apps/ops && pnpm cli notes list --json`
Expected: JSON array of notes (or empty array).

**Step 4: Commit**

```bash
git add apps/ops/cli/commands/notes.ts apps/ops/cli/bin.ts
git commit -m "feat(ops-cli): add notes list|get|create|update|remove commands"
```

---

### Task 4: Todos commands

**Files:**
- Create: `apps/ops/cli/commands/todos.ts`
- Modify: `apps/ops/cli/bin.ts` (register todos command)

**Step 1: Create `cli/commands/todos.ts`**

```ts
import { Command } from "commander"
import { api } from "../../convex/_generated/api"
import { loadConfig } from "../lib/config"
import { getClient } from "../lib/convex-client"
import { output, success, error } from "../lib/output"

export function registerTodosCommand(program: Command) {
  const todos = program.command("todos").description("Manage todos")

  todos
    .command("list")
    .description("List todos")
    .option("--status <status>", "Filter by status (triage|todo|blocked|in_progress|done)")
    .option("--project <id>", "Filter by project ID")
    .option("--priority <priority>", "Filter by priority (urgent|high|normal|low)")
    .action(async (opts) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        const result = await client.query(api.cli.todosList, {
          userId: config.userId,
          status: opts.status,
          projectId: opts.project,
          priority: opts.priority,
        })
        output(result)
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  todos
    .command("get <id>")
    .description("Get a todo by ID")
    .action(async (id) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        const result = await client.query(api.cli.todosGet, {
          userId: config.userId,
          id,
        })
        if (!result) {
          error("Todo introuvable")
          process.exit(1)
        }
        output(result)
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  todos
    .command("create")
    .description("Create a todo")
    .requiredOption("--text <text>", "Todo text")
    .option("--description <desc>", "Description")
    .option("--status <status>", "Status", "triage")
    .option("--priority <priority>", "Priority (urgent|high|normal|low)")
    .option("--due <date>", "Due date (YYYY-MM-DD)")
    .option("--project <id>", "Project ID")
    .option("--tags <tags>", "Comma-separated tags")
    .action(async (opts) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        const id = await client.mutation(api.cli.todosCreate, {
          userId: config.userId,
          text: opts.text,
          description: opts.description,
          status: opts.status,
          priority: opts.priority,
          dueDate: opts.due,
          projectId: opts.project,
          tags: opts.tags ? opts.tags.split(",").map((t: string) => t.trim()) : undefined,
        })
        success(`Todo created: ${id}`)
        output({ _id: id })
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  todos
    .command("update <id>")
    .description("Update a todo")
    .option("--text <text>", "New text")
    .option("--description <desc>", "New description")
    .option("--priority <priority>", "New priority")
    .option("--due <date>", "New due date (YYYY-MM-DD)")
    .option("--project <id>", "Project ID")
    .option("--tags <tags>", "Comma-separated tags")
    .action(async (id, opts) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        await client.mutation(api.cli.todosUpdate, {
          userId: config.userId,
          id,
          text: opts.text,
          description: opts.description,
          priority: opts.priority,
          dueDate: opts.due,
          projectId: opts.project,
          tags: opts.tags ? opts.tags.split(",").map((t: string) => t.trim()) : undefined,
        })
        success("Todo updated")
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  todos
    .command("status <id> <status>")
    .description("Change todo status (triage|todo|blocked|in_progress|done)")
    .action(async (id, status) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        await client.mutation(api.cli.todosUpdateStatus, {
          userId: config.userId,
          id,
          status,
        })
        success(`Status → ${status}`)
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })

  todos
    .command("remove <id>")
    .description("Remove a todo")
    .action(async (id) => {
      try {
        const config = loadConfig()
        const client = getClient(config)
        await client.mutation(api.cli.todosRemove, {
          userId: config.userId,
          id,
        })
        success("Todo removed")
      } catch (e: any) {
        error(e.message)
        process.exit(1)
      }
    })
}
```

**Step 2: Register in `cli/bin.ts`**

Add import and registration:
```ts
import { registerTodosCommand } from "./commands/todos"

registerTodosCommand(program)
```

**Step 3: Test todos commands**

Run: `cd apps/ops && pnpm cli todos --help`
Expected: Shows subcommands list|get|create|update|status|remove.

Run: `cd apps/ops && pnpm cli todos list --json`
Expected: JSON array of todos.

**Step 4: Commit**

```bash
git add apps/ops/cli/commands/todos.ts apps/ops/cli/bin.ts
git commit -m "feat(ops-cli): add todos list|get|create|update|status|remove commands"
```

---

### Task 5: MCP server

**Files:**
- Create: `apps/ops/cli/mcp/server.ts`
- Modify: `apps/ops/cli/bin.ts` (register mcp command)

**Step 1: Create `cli/mcp/server.ts`**

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { api } from "../../convex/_generated/api"
import { loadConfig } from "../lib/config"
import { getClient } from "../lib/convex-client"

export async function startMcpServer() {
  const config = loadConfig()
  const client = getClient(config)
  const userId = config.userId

  const server = new McpServer({
    name: "blazz-ops",
    version: "0.1.0",
  })

  // ── Notes tools ──

  server.tool(
    "notes_list",
    "List notes. Optionally filter by entity type or pinned status.",
    {
      entityType: z.enum(["client", "project", "contract", "invoice", "todo", "general"]).optional().describe("Filter by entity type"),
      pinned: z.boolean().optional().describe("Only pinned notes"),
    },
    async ({ entityType, pinned }) => {
      const result = await client.query(api.cli.notesList, { userId, entityType, pinned })
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    "notes_get",
    "Get a single note by ID.",
    {
      id: z.string().describe("Note ID (Convex document ID)"),
    },
    async ({ id }) => {
      const result = await client.query(api.cli.notesGet, { userId, id: id as any })
      if (!result) return { content: [{ type: "text" as const, text: "Note not found" }], isError: true }
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    "notes_create",
    "Create a new note.",
    {
      title: z.string().describe("Note title"),
      contentText: z.string().optional().describe("Plain text content"),
      entityType: z.enum(["client", "project", "contract", "invoice", "todo", "general"]).default("general").describe("Entity type"),
      entityId: z.string().optional().describe("Entity ID to attach the note to"),
      pinned: z.boolean().optional().describe("Pin the note"),
    },
    async ({ title, contentText, entityType, entityId, pinned }) => {
      const id = await client.mutation(api.cli.notesCreate, {
        userId, title, contentText, entityType, entityId, pinned,
      })
      return { content: [{ type: "text" as const, text: JSON.stringify({ _id: id }, null, 2) }] }
    }
  )

  server.tool(
    "notes_update",
    "Update an existing note.",
    {
      id: z.string().describe("Note ID"),
      title: z.string().optional().describe("New title"),
      contentText: z.string().optional().describe("New plain text content"),
      pinned: z.boolean().optional().describe("Pin/unpin"),
      locked: z.boolean().optional().describe("Lock/unlock"),
    },
    async ({ id, title, contentText, pinned, locked }) => {
      await client.mutation(api.cli.notesUpdate, {
        userId, id: id as any, title, contentText, pinned, locked,
      })
      return { content: [{ type: "text" as const, text: "Note updated" }] }
    }
  )

  server.tool(
    "notes_remove",
    "Delete a note. Fails if note is locked.",
    {
      id: z.string().describe("Note ID"),
    },
    async ({ id }) => {
      await client.mutation(api.cli.notesRemove, { userId, id: id as any })
      return { content: [{ type: "text" as const, text: "Note removed" }] }
    }
  )

  // ── Todos tools ──

  server.tool(
    "todos_list",
    "List todos. Optionally filter by status, project, or priority.",
    {
      status: z.enum(["triage", "todo", "blocked", "in_progress", "done"]).optional().describe("Filter by status"),
      projectId: z.string().optional().describe("Filter by project ID"),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional().describe("Filter by priority"),
    },
    async ({ status, projectId, priority }) => {
      const result = await client.query(api.cli.todosList, { userId, status, projectId, priority })
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    "todos_get",
    "Get a single todo by ID.",
    {
      id: z.string().describe("Todo ID"),
    },
    async ({ id }) => {
      const result = await client.query(api.cli.todosGet, { userId, id: id as any })
      if (!result) return { content: [{ type: "text" as const, text: "Todo not found" }], isError: true }
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    "todos_create",
    "Create a new todo.",
    {
      text: z.string().describe("Todo text"),
      description: z.string().optional().describe("Description"),
      status: z.enum(["triage", "todo", "blocked", "in_progress", "done"]).default("triage").describe("Status"),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional().describe("Priority"),
      dueDate: z.string().optional().describe("Due date (YYYY-MM-DD)"),
      projectId: z.string().optional().describe("Project ID"),
      tags: z.array(z.string()).optional().describe("Tags"),
    },
    async ({ text, description, status, priority, dueDate, projectId, tags }) => {
      const id = await client.mutation(api.cli.todosCreate, {
        userId, text, description, status, priority, dueDate,
        projectId: projectId as any, tags,
      })
      return { content: [{ type: "text" as const, text: JSON.stringify({ _id: id }, null, 2) }] }
    }
  )

  server.tool(
    "todos_update",
    "Update an existing todo.",
    {
      id: z.string().describe("Todo ID"),
      text: z.string().optional().describe("New text"),
      description: z.string().optional().describe("New description"),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional().describe("New priority"),
      dueDate: z.string().optional().describe("New due date (YYYY-MM-DD)"),
      projectId: z.string().optional().describe("Project ID"),
      tags: z.array(z.string()).optional().describe("New tags"),
    },
    async ({ id, text, description, priority, dueDate, projectId, tags }) => {
      await client.mutation(api.cli.todosUpdate, {
        userId, id: id as any, text, description, priority, dueDate,
        projectId: projectId as any, tags,
      })
      return { content: [{ type: "text" as const, text: "Todo updated" }] }
    }
  )

  server.tool(
    "todos_status",
    "Change todo status.",
    {
      id: z.string().describe("Todo ID"),
      status: z.enum(["triage", "todo", "blocked", "in_progress", "done"]).describe("New status"),
    },
    async ({ id, status }) => {
      await client.mutation(api.cli.todosUpdateStatus, { userId, id: id as any, status })
      return { content: [{ type: "text" as const, text: `Status → ${status}` }] }
    }
  )

  server.tool(
    "todos_remove",
    "Delete a todo.",
    {
      id: z.string().describe("Todo ID"),
    },
    async ({ id }) => {
      await client.mutation(api.cli.todosRemove, { userId, id: id as any })
      return { content: [{ type: "text" as const, text: "Todo removed" }] }
    }
  )

  // ── Start server ──

  const transport = new StdioServerTransport()
  await server.connect(transport)
}
```

**Step 2: Register mcp command in `cli/bin.ts`**

```ts
import { startMcpServer } from "./mcp/server"

program
  .command("mcp")
  .description("Start MCP server (stdio transport)")
  .action(async () => {
    await startMcpServer()
  })
```

**Step 3: Test MCP server starts**

Run: `cd apps/ops && echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1.0"}}}' | pnpm cli mcp`
Expected: JSON response with server capabilities.

**Step 4: Commit**

```bash
git add apps/ops/cli/mcp/server.ts apps/ops/cli/bin.ts
git commit -m "feat(ops-cli): add MCP server with notes + todos tools"
```

---

### Task 6: Integration test — end-to-end CLI smoke test

**Files:**
- Create: `apps/ops/cli/README.md` (setup instructions)

**Step 1: Create `~/.blazz-ops/.env` if not exists**

Run:
```bash
mkdir -p ~/.blazz-ops
```

Then create `~/.blazz-ops/.env` with:
```
CONVEX_URL=<your NEXT_PUBLIC_CONVEX_URL>
CONVEX_DEPLOY_KEY=<your deploy key from Convex dashboard>
OPS_USER_ID=<your user ID>
```

**Step 2: Smoke test all commands**

```bash
cd apps/ops

# Notes
pnpm cli notes list --json
pnpm cli notes create --title "Test CLI" --content "Hello from CLI"
# Copy the ID from output
pnpm cli notes get <id> --json
pnpm cli notes update <id> --title "Updated from CLI"
pnpm cli notes remove <id>

# Todos
pnpm cli todos list --json
pnpm cli todos create --text "Test todo from CLI" --priority urgent
# Copy the ID from output
pnpm cli todos get <id> --json
pnpm cli todos status <id> in_progress
pnpm cli todos remove <id>
```

Expected: All commands succeed, data appears in the web UI.

**Step 3: Test MCP integration with Claude Code**

Add to Claude Code MCP config (`~/.claude/settings.json` or project `.mcp.json`):
```json
{
  "mcpServers": {
    "blazz-ops": {
      "command": "pnpm",
      "args": ["--filter", "ops", "cli", "mcp"],
      "cwd": "/Users/jonathanruas/Development/blazz-ui-app"
    }
  }
}
```

Then in Claude Code, verify tools `notes_list`, `todos_list`, etc. appear.

**Step 4: Write minimal README**

Create `apps/ops/cli/README.md`:
```markdown
# Blazz OPS CLI

## Setup

1. Create `~/.blazz-ops/.env`:
   ```
   CONVEX_URL=<your Convex URL>
   CONVEX_DEPLOY_KEY=<your deploy key>
   OPS_USER_ID=<your user ID>
   ```

2. Run: `pnpm cli <command>`

## Commands

- `blazz-ops notes list|get|create|update|remove`
- `blazz-ops todos list|get|create|update|status|remove`
- `blazz-ops mcp` — Start MCP server for Claude Code

Use `--json` for JSON output. Use `--help` on any command.
```

**Step 5: Final commit**

```bash
git add apps/ops/cli/README.md
git commit -m "docs(ops-cli): add CLI setup README"
```
