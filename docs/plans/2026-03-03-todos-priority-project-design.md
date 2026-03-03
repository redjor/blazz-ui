# Design — Todos: Priority Levels & Project Linking

**Date:** 2026-03-03
**App:** `apps/ops`
**Status:** Approved

## Context

The todos kanban board (`/todos`) currently supports text, description, status, and source. The Convex schema already has `projectId` (optional) and there's a `linkProject` mutation — but neither is exposed in the UI. Priority does not exist yet.

## Goals

1. Add priority levels (Urgent / High / Normal / Low) to todos
2. Expose project linking in the Create and Edit dialogs

## Schema Change

Add optional `priority` field to the `todos` table in `convex/schema.ts`:

```ts
priority: v.optional(v.union(
  v.literal("urgent"),
  v.literal("high"),
  v.literal("normal"),
  v.literal("low")
))
```

No change needed for `projectId` — already in schema.

## Backend Changes (`convex/todos.ts`)

- `create`: accept optional `priority` arg (stored as-is, default behavior = undefined = treated as "normal" in UI)
- Add `updatePriority` mutation: `{ id, priority }` → `ctx.db.patch(id, { priority })`
- `linkProject` already exists — no changes needed

## UI Changes (`app/todos/page.tsx`)

### AddTodoDialog
- Add `<Select>` for priority (4 options: Urgent, High, Normal, Low), defaulting to "normal"
- Add `<Select>` for project, populated via `useQuery(api.projects.list)`, optional

### EditTodoDialog
- Same two selects, pre-filled from `todo.priority` and `todo.projectId`
- On submit: call `updatePriority` if priority changed, `linkProject` if projectId changed

### TodoCard
- Display a colored `Flag` icon when `priority !== "normal"` and `priority !== undefined`:
  - `urgent` → `text-destructive` (red)
  - `high` → `text-orange-500` (orange)
  - `low` → `text-fg-muted` (gray)
- Show project name as a small badge when `projectId` is set (requires joining project data)

## Out of Scope

- Filtering/sorting kanban columns by priority
- Drag-and-drop reordering
- Priority change directly on the card (dialogs only)
- Project linking outside of dialogs
