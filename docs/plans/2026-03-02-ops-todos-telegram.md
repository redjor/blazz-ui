# Todos + Telegram Capture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Kanban todos page to Blazz Ops with capture via a Telegram bot webhook, using Convex HTTP Actions.

**Architecture:** New `todos` table in Convex → `convex/todos.ts` mutations/queries → `convex/http.ts` Telegram webhook handler → `/todos` page with 4-column Kanban. Capture is one-way: Telegram message → Convex HTTP Action → todo in Triage.

**Tech Stack:** Convex (schema + mutations + HTTP Actions), Next.js 16 (page, client component), @blazz/ui (Button, Dialog, Badge, Empty, Skeleton, PageHeader), Telegram Bot API (BotFather + setWebhook)

---

## Task 1: Add `todos` table to Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Open schema and add the todos table**

In `apps/ops/convex/schema.ts`, add the following table after `timeEntries`:

```ts
todos: defineTable({
  text: v.string(),
  status: v.union(
    v.literal("triage"),
    v.literal("todo"),
    v.literal("in_progress"),
    v.literal("done")
  ),
  source: v.union(v.literal("app"), v.literal("telegram")),
  projectId: v.optional(v.id("projects")),
  createdAt: v.number(),
})
  .index("by_status", ["status"]),
```

**Step 2: Verify Convex picks it up**

Run: `cd apps/ops && npx convex dev --once`
Expected: no type errors, schema pushed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add todos table to convex schema"
```

---

## Task 2: Create `convex/todos.ts` — queries and mutations

**Files:**
- Create: `apps/ops/convex/todos.ts`

**Step 1: Write the file**

```ts
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("triage"),
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done")
      )
    ),
  },
  handler: async (ctx, { status }) => {
    const all = await ctx.db.query("todos").order("desc").collect()
    return status ? all.filter((t) => t.status === status) : all
  },
})

export const create = mutation({
  args: {
    text: v.string(),
    status: v.optional(
      v.union(
        v.literal("triage"),
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done")
      )
    ),
    source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { text, status = "triage", source = "app", projectId }) => {
    return ctx.db.insert("todos", {
      text,
      status,
      source,
      projectId,
      createdAt: Date.now(),
    })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("todos"),
    status: v.union(
      v.literal("triage"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done")
    ),
  },
  handler: async (ctx, { id, status }) => ctx.db.patch(id, { status }),
})

export const linkProject = mutation({
  args: {
    id: v.id("todos"),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { id, projectId }) => ctx.db.patch(id, { projectId }),
})

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
})
```

**Step 2: Verify types compile**

Run: `cd apps/ops && npx convex dev --once`
Expected: `Generated new files in convex/_generated/` with no errors.

Also run: `pnpm --filter ops type-check`
Expected: no TypeScript errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/todos.ts
git commit -m "feat(ops): add todos convex queries and mutations"
```

---

## Task 3: Create `convex/http.ts` — Telegram webhook

**Files:**
- Create: `apps/ops/convex/http.ts`

**Context:** Convex HTTP Actions are serverless functions exposed at `https://<deployment>.convex.site/<path>`. Telegram will POST the webhook payload to this URL. We validate a secret token in the query string, parse the message text, and call `todos.create` with `source: "telegram"`.

**Step 1: Write the file**

```ts
import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"

const http = httpRouter()

http.route({
  path: "/telegram-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Validate secret token in query string
    const url = new URL(request.url)
    const secret = url.searchParams.get("secret")
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

    if (!expectedSecret || secret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Parse Telegram update
    let body: {
      message?: {
        text?: string
        chat?: { id: number }
      }
    }
    try {
      body = await request.json()
    } catch {
      return new Response("Bad Request", { status: 400 })
    }

    const text = body?.message?.text
    if (!text) {
      // Ignore non-text messages (photos, stickers, etc.) — just ACK
      return new Response("OK", { status: 200 })
    }

    // Create todo in Triage
    await ctx.runMutation(api.todos.create, {
      text,
      status: "triage",
      source: "telegram",
    })

    return new Response("OK", { status: 200 })
  }),
})

export default http
```

**Step 2: Verify compilation**

Run: `cd apps/ops && npx convex dev --once`
Expected: HTTP routes registered, no errors. Convex will print the deployment URL like `https://xxx.convex.site`.

**Step 3: Commit**

```bash
git add apps/ops/convex/http.ts
git commit -m "feat(ops): add telegram webhook convex http action"
```

---

## Task 4: Set up Telegram bot (one-time manual setup)

**No files to modify.** This is infrastructure setup.

**Step 1: Create the bot**

Open Telegram, message `@BotFather`:
1. Send `/newbot`
2. Choose a name: e.g. "Blazz Ops"
3. Choose a username: e.g. `blazz_ops_bot` (must end in `bot`)
4. Save the `BOT_TOKEN` BotFather gives you (format: `1234567890:ABCDefgh...`)

**Step 2: Add env vars to Convex**

Go to https://dashboard.convex.dev → your deployment → Settings → Environment Variables.

Add two variables:
- `TELEGRAM_BOT_TOKEN` = the token from BotFather
- `TELEGRAM_WEBHOOK_SECRET` = any random string you invent (e.g. generate with `openssl rand -hex 16`)

**Step 3: Find your Convex deployment URL**

Run: `cd apps/ops && npx convex dev --once 2>&1 | grep convex.site`
Or check the Convex dashboard — it looks like `https://playful-owl-123.convex.site`.

**Step 4: Register the webhook with Telegram**

```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<deployment>.convex.site/telegram-webhook?secret=<WEBHOOK_SECRET>"
```

Expected response:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

**Step 5: Test the webhook**

Send any text message to your bot in Telegram.

Then check Convex dashboard → Data → `todos` table.
Expected: a new row appears with `status: "triage"`, `source: "telegram"`, `text: <your message>`.

---

## Task 5: Build the Todos Kanban page

**Files:**
- Create: `apps/ops/app/todos/page.tsx`
- Modify: `apps/ops/components/ops-frame.tsx`

### Part A — Add "Todos" to the sidebar

In `apps/ops/components/ops-frame.tsx`, add `CheckSquare` to the lucide-react imports and add a nav item:

```ts
import { LayoutDashboard, Users, Clock, FileText, CheckSquare } from "lucide-react"
```

Add after the Récap item in `opsSidebarConfig.navigation[0].items`:
```ts
{ title: "Todos", url: "/todos", icon: CheckSquare },
```

### Part B — Create the page

Create `apps/ops/app/todos/page.tsx`:

```tsx
"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { Input } from "@blazz/ui/components/ui/input"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { CheckSquare, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { OpsFrame } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

type TodoStatus = "triage" | "todo" | "in_progress" | "done"

const COLUMNS: { status: TodoStatus; label: string }[] = [
  { status: "triage", label: "Triage" },
  { status: "todo", label: "Todo" },
  { status: "in_progress", label: "En cours" },
  { status: "done", label: "Fait" },
]

const STATUS_ORDER: TodoStatus[] = ["triage", "todo", "in_progress", "done"]

function getPrev(status: TodoStatus): TodoStatus | null {
  const idx = STATUS_ORDER.indexOf(status)
  return idx > 0 ? STATUS_ORDER[idx - 1] : null
}

function getNext(status: TodoStatus): TodoStatus | null {
  const idx = STATUS_ORDER.indexOf(status)
  return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null
}

function TodoCard({ todo }: { todo: Doc<"todos"> }) {
  const updateStatus = useMutation(api.todos.updateStatus)
  const remove = useMutation(api.todos.remove)
  const prev = getPrev(todo.status)
  const next = getNext(todo.status)

  return (
    <div className={`p-3 rounded-md border border-edge bg-raised space-y-2 ${todo.status === "done" ? "opacity-60" : ""}`}>
      <p className="text-sm text-fg leading-snug">{todo.text}</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {todo.source === "telegram" && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">Telegram</Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {prev && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => updateStatus({ id: todo._id, status: prev })}
              aria-label="Reculer"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
          )}
          {next && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => updateStatus({ id: todo._id, status: next })}
              aria-label="Avancer"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => remove({ id: todo._id })}
            aria-label="Supprimer"
            className="text-fg-muted hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function AddTodoDialog({
  defaultStatus,
  open,
  onOpenChange,
}: {
  defaultStatus: TodoStatus
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const create = useMutation(api.todos.create)
  const [text, setText] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await create({ text: text.trim(), status: defaultStatus, source: "app" })
    setText("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder="Ce que tu dois faire..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!text.trim()}>
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function TodosPage() {
  const todos = useQuery(api.todos.list, {})
  const [addFor, setAddFor] = useState<TodoStatus | null>(null)

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <PageHeader title="Todos" description="Capturez et organisez vos tâches" />

        {/* Kanban columns */}
        {todos === undefined ? (
          <div className="grid grid-cols-4 gap-4">
            {COLUMNS.map((col) => (
              <div key={col.status} className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 items-start">
            {COLUMNS.map((col) => {
              const colTodos = todos.filter((t) => t.status === col.status)
              return (
                <div key={col.status} className="space-y-2">
                  {/* Column header */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-fg">{col.label}</span>
                      {colTodos.length > 0 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 tabular-nums">
                          {colTodos.length}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setAddFor(col.status)}
                      aria-label={`Ajouter dans ${col.label}`}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2">
                    {colTodos.length === 0 ? (
                      <div className="border border-dashed border-edge rounded-md p-4 text-xs text-fg-muted text-center">
                        Vide
                      </div>
                    ) : (
                      colTodos.map((todo) => <TodoCard key={todo._id} todo={todo} />)
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {todos?.length === 0 && (
          <Empty
            icon={CheckSquare}
            title="Aucun todo"
            description="Créez un todo depuis l'app ou envoyez un message à votre bot Telegram"
            action={{ label: "Nouveau todo", onClick: () => setAddFor("triage"), icon: Plus }}
          />
        )}
      </div>

      {addFor && (
        <AddTodoDialog
          defaultStatus={addFor}
          open={true}
          onOpenChange={(v) => !v && setAddFor(null)}
        />
      )}
    </OpsFrame>
  )
}
```

**Step 3: Verify the page renders**

Run: `pnpm dev:ops`
Open: http://localhost:3120/todos
Expected: 4 columns (Triage, Todo, En cours, Fait) with "+" buttons, sidebar shows "Todos" link.

**Step 4: Verify type-check**

Run: `pnpm --filter ops type-check`
Expected: no TypeScript errors.

**Step 5: Commit**

```bash
git add apps/ops/app/todos/page.tsx apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add todos kanban page with 4-column layout"
```

---

## Task 6: End-to-end smoke test

**No files to create.** Manual verification checklist.

**Step 1: Create a todo from the app**
- Open http://localhost:3120/todos
- Click "+" in the Triage column
- Type any text, submit
- Expected: card appears in Triage column

**Step 2: Move a todo**
- Click ChevronRight on the Triage card
- Expected: card moves to Todo column

**Step 3: Test Telegram capture**
- Send a text message to your Telegram bot
- Refresh http://localhost:3120/todos (or wait — Convex is real-time, should auto-update)
- Expected: new card appears in Triage with "Telegram" badge

**Step 4: Delete a todo**
- Click trash icon on any card
- Expected: card disappears

**Step 5: Commit (if any cleanup needed)**

```bash
git add -p
git commit -m "fix(ops): todos page smoke test fixes"
```

---

## Notes

- Convex is real-time: no need to manually refresh the page — todos appear instantly when the webhook fires
- The Telegram bot only receives messages in private chat (not groups unless you add it)
- `TELEGRAM_WEBHOOK_SECRET` must be URL-safe (use hex string, avoid `&`, `=`, `?`)
- If you redeploy Convex and the deployment URL changes, re-run the `setWebhook` curl command
