# Design — Todos + Telegram Capture (Blazz Ops)

**Date:** 2026-03-02
**App:** `apps/ops`
**Status:** Approved

## Context

Blazz Ops is a personal freelance management app (Next.js + Convex). Currently tracks clients, projects, and time entries. No task management exists yet.

The user needs a lightweight place to capture todos that appear throughout the day — some linked to client projects, others personal. Todos arrive via Telegram (capture only, one-way) and land in "Triage" for later processing.

## Goals

- Add a `todos` table to the Convex schema
- Build a 4-column Kanban page at `/todos`
- Accept incoming todos from a Telegram bot via Convex HTTP Action

## Non-Goals

- Bidirectional Telegram interaction (no bot replies, no /done commands)
- Due dates, priorities, labels (YAGNI)
- Drag-and-drop (buttons to move between columns suffice for now)

---

## Schema

New table added to `convex/schema.ts`:

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
  .index("by_status", ["status"])
```

---

## Telegram Integration

### Architecture

```
Telegram message → POST /telegram-webhook → Convex HTTP Action → todos.create (status: "triage")
```

### Files

- `convex/http.ts` — HTTP router + `/telegram-webhook` handler
- `convex/todos.ts` — queries + mutations (list, create, updateStatus, linkProject, delete)

### Security

- `TELEGRAM_WEBHOOK_SECRET` env var in Convex dashboard
- Webhook URL: `https://<your-convex-deployment>.convex.site/telegram-webhook?secret=<TOKEN>`
- Bot setup: create via BotFather, register webhook URL with `setWebhook` API call

### Message parsing

- Any text message → `todo.text = message.text`, `source: "telegram"`, `status: "triage"`
- Non-text messages (photos, stickers, etc.) → ignored, respond 200 anyway

---

## UI — `/todos` page

4-column Kanban layout:

| Triage | Todo | In Progress | Done |
|--------|------|-------------|------|
| cards  | cards| cards       | cards (muted) |

**Card content:**
- Todo text
- Source badge: `Telegram` (blue) or `App` (neutral), shown only for telegram-sourced
- Project badge (if linked)
- Action buttons: arrows to move to adjacent column, link to project, delete

**Column headers:**
- Name + count badge
- "+" button to create a todo directly in that column (defaults to status = column)

**No drag-and-drop** — arrow buttons suffice for a personal tool.

---

## Convex Mutations

| Mutation | Purpose |
|----------|---------|
| `todos.list` | Query all todos, optionally filtered by status |
| `todos.create` | Create todo with text, status, source, optional projectId |
| `todos.updateStatus` | Move todo to a new status |
| `todos.linkProject` | Attach a projectId to an existing todo |
| `todos.remove` | Delete a todo |

---

## Setup Steps (manual, one-time)

1. Create Telegram bot via BotFather → get `BOT_TOKEN`
2. Add `TELEGRAM_WEBHOOK_SECRET` + `TELEGRAM_BOT_TOKEN` to Convex env vars
3. Register webhook: `curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<deployment>.convex.site/telegram-webhook?secret=<SECRET>`
4. Test: send a message to the bot → verify todo appears in Triage
