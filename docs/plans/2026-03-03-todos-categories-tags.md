# Todos Categories & Tags Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dynamic category system (1 per todo, Convex-backed) and free-form tags (array of strings, autocomplete) to Blazz Ops todos, with a kanban filter bar and category management sheet.

**Architecture:** New `categories` Convex table + `categoryId`/`tags` fields on `todos`. A `TagInput` component handles free-form tag entry with autocomplete. The kanban view gets a category filter bar; the list view gets two new columns.

**Tech Stack:** Convex (mutations/queries), React 19, @blazz/ui primitives, Tailwind v4

---

## Task 1: Update Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Open the file and add the `categories` table + new `todos` fields**

Replace the current `schema.ts` content with:

```ts
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }),

  projects: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    currency: v.union(v.literal("EUR")),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_status", ["status"]),

  timeEntries: defineTable({
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
    invoicedAt: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("ready_to_invoice"),
        v.literal("invoiced"),
        v.literal("paid")
      )
    ),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_date", ["date"]),

  categories: defineTable({
    name: v.string(),
    color: v.optional(v.string()),
    createdAt: v.number(),
  }),

  todos: defineTable({
    text: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("triage"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done")
    ),
    source: v.union(v.literal("app"), v.literal("telegram")),
    projectId: v.optional(v.id("projects")),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(
        v.literal("urgent"),
        v.literal("high"),
        v.literal("normal"),
        v.literal("low")
      )
    ),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_category", ["categoryId"]),
})
```

**Step 2: Verify**

```bash
cd apps/ops && npx convex dev --once
```

Expected: Convex schema push succeeds, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add categories table and categoryId/tags to todos schema"
```

---

## Task 2: Create `convex/categories.ts`

**Files:**
- Create: `apps/ops/convex/categories.ts`

**Step 1: Create the file**

```ts
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("categories").order("asc").collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { name, color }) => {
    return ctx.db.insert("categories", { name, color, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { id, name, color }) => {
    const patch: Record<string, unknown> = {}
    if (name !== undefined) patch.name = name
    if (color !== undefined) patch.color = color
    return ctx.db.patch(id, patch)
  },
})

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    // Nullify categoryId on all todos linked to this category
    const linked = await ctx.db
      .query("todos")
      .withIndex("by_category", (q) => q.eq("categoryId", id))
      .collect()
    await Promise.all(linked.map((t) => ctx.db.patch(t._id, { categoryId: undefined })))
    await ctx.db.delete(id)
  },
})
```

**Step 2: Verify**

```bash
cd apps/ops && npx convex dev --once
```

Expected: No errors. `api.categories.*` available in generated types.

**Step 3: Commit**

```bash
git add apps/ops/convex/categories.ts
git commit -m "feat(ops): add categories Convex backend (list/create/update/remove)"
```

---

## Task 3: Update `convex/todos.ts`

**Files:**
- Modify: `apps/ops/convex/todos.ts`

**Step 1: Replace file content**

```ts
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

const statusValidator = v.union(
  v.literal("triage"),
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("done")
)

const priorityValidator = v.union(
  v.literal("urgent"),
  v.literal("high"),
  v.literal("normal"),
  v.literal("low")
)

export const list = query({
  args: {
    status: v.optional(statusValidator),
  },
  handler: async (ctx, { status }) => {
    if (status) {
      return ctx.db
        .query("todos")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect()
    }
    return ctx.db.query("todos").order("desc").collect()
  },
})

export const listAllTags = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect()
    const tagSet = new Set<string>()
    for (const todo of todos) {
      for (const tag of todo.tags ?? []) {
        tagSet.add(tag)
      }
    }
    return Array.from(tagSet).sort()
  },
})

export const create = mutation({
  args: {
    text: v.string(),
    description: v.optional(v.string()),
    status: v.optional(statusValidator),
    source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
    projectId: v.optional(v.id("projects")),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
    priority: v.optional(priorityValidator),
  },
  handler: async (ctx, { text, description, status = "triage", source = "app", projectId, categoryId, tags, priority }) => {
    return ctx.db.insert("todos", {
      text,
      description,
      status,
      source,
      projectId,
      categoryId,
      tags,
      priority,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(priorityValidator),
    projectId: v.optional(v.id("projects")),
    categoryId: v.optional(v.id("categories")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...fields }) => {
    const patch: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) patch[k] = v
    }
    // Allow explicit null/undefined to clear optional fields
    if ("projectId" in fields) patch.projectId = fields.projectId
    if ("categoryId" in fields) patch.categoryId = fields.categoryId
    if ("tags" in fields) patch.tags = fields.tags
    return ctx.db.patch(id, patch)
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("todos"),
    status: statusValidator,
  },
  handler: async (ctx, { id, status }) => ctx.db.patch(id, { status }),
})

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => ctx.db.delete(id),
})
```

**Step 2: Verify**

```bash
cd apps/ops && npx convex dev --once
```

Expected: No errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/todos.ts
git commit -m "feat(ops): unify todos mutations, add categoryId/tags/listAllTags"
```

---

## Task 4: Create `TagInput` component

**Files:**
- Create: `apps/ops/components/tag-input.tsx`

**Step 1: Create the file**

```tsx
"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Input } from "@blazz/ui/components/ui/input"
import { X } from "lucide-react"
import { useRef, useState } from "react"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function TagInput({ value, onChange, suggestions = [], placeholder = "Ajouter un tag..." }: TagInputProps) {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  )

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase()
    if (!trimmed || value.includes(trimmed)) return
    onChange([...value, trimmed])
    setInput("")
    setShowSuggestions(false)
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(input)
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1.5 min-h-9 px-3 py-1.5 rounded-md border border-edge bg-surface cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 flex items-center gap-1 h-5">
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="text-fg-muted hover:text-fg ml-0.5"
            >
              <X className="size-2.5" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted/60"
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-edge bg-surface shadow-md">
          {filtered.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => addTag(s)}
              className="w-full px-3 py-1.5 text-left text-sm text-fg hover:bg-raised"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Verify (visual)**

Import and render `<TagInput value={[]} onChange={() => {}} />` temporarily on the todos page to confirm it renders. Remove temporary usage after check.

**Step 3: Commit**

```bash
git add apps/ops/components/tag-input.tsx
git commit -m "feat(ops): add TagInput component with autocomplete"
```

---

## Task 5: Create `ManageCategoriesSheet` component

**Files:**
- Create: `apps/ops/components/manage-categories-sheet.tsx`

**Step 1: Define the color palette constant (top of file)**

```tsx
"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@blazz/ui/components/ui/sheet"
import { useMutation, useQuery } from "convex/react"
import { Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export const CATEGORY_COLORS = [
  { id: "indigo", label: "Indigo", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" },
  { id: "violet", label: "Violet", bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" },
  { id: "rose", label: "Rose", bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400" },
  { id: "orange", label: "Orange", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
  { id: "amber", label: "Ambre", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  { id: "emerald", label: "Émeraude", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
  { id: "sky", label: "Ciel", bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400" },
  { id: "zinc", label: "Zinc", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-700 dark:text-zinc-300" },
]

export function getCategoryColorClasses(color?: string) {
  return CATEGORY_COLORS.find((c) => c.id === color) ?? CATEGORY_COLORS[7]
}

export function CategoryBadge({ name, color }: { name: string; color?: string }) {
  const cls = getCategoryColorClasses(color)
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls.bg} ${cls.text}`}>
      {name}
    </span>
  )
}

export function ManageCategoriesSheet() {
  const categories = useQuery(api.categories.list, {})
  const createCategory = useMutation(api.categories.create)
  const removeCategory = useMutation(api.categories.remove)

  const [name, setName] = useState("")
  const [color, setColor] = useState("indigo")

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await createCategory({ name: name.trim(), color })
    setName("")
    setColor("indigo")
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" />}>
        <Settings2 className="size-3.5 mr-1.5" />
        Catégories
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Gérer les catégories</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Existing categories */}
          <div className="space-y-2">
            {(categories ?? []).length === 0 ? (
              <p className="text-sm text-fg-muted">Aucune catégorie.</p>
            ) : (
              (categories ?? []).map((cat) => (
                <div key={cat._id} className="flex items-center justify-between gap-2 py-1">
                  <CategoryBadge name={cat.name} color={cat.color} />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeCategory({ id: cat._id as Id<"categories"> })}
                    className="text-fg-muted hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Add form */}
          <form onSubmit={handleCreate} className="space-y-3 border-t border-edge pt-4">
            <p className="text-sm font-medium text-fg">Nouvelle catégorie</p>
            <Input
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${c.bg} ${color === c.id ? "border-fg scale-110" : "border-transparent"}`}
                  title={c.label}
                />
              ))}
            </div>
            <Button type="submit" size="sm" disabled={!name.trim()}>
              Ajouter
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

**Step 2: Verify**

```bash
pnpm dev:ops
```

Open the todos page. The Sheet should not appear yet (not integrated). Check for TS errors in terminal.

**Step 3: Commit**

```bash
git add apps/ops/components/manage-categories-sheet.tsx
git commit -m "feat(ops): add ManageCategoriesSheet with color picker"
```

---

## Task 6: Update `todos-preset.tsx`

**Files:**
- Modify: `apps/ops/components/todos-preset.tsx`

**Step 1: Update `Todo` type and add new columns**

Update the `Todo` interface to include the new fields:

```ts
export interface Todo {
  _id: string
  text: string
  description?: string
  status: "triage" | "todo" | "in_progress" | "done"
  priority?: "urgent" | "high" | "normal" | "low"
  projectId?: string
  projectName?: string
  categoryId?: string
  categoryName?: string
  categoryColor?: string
  tags?: string[]
  createdAt: number
}
```

Add these two columns to the `columns` array (after the `status` column, before `projectName`):

```tsx
// Category — colored badge
{
  accessorKey: 'categoryName',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Catégorie" />,
  cell: ({ row }) => {
    const name = row.getValue('categoryName') as string | undefined
    const color = row.original.categoryColor
    if (!name) return <span className="text-fg-muted/40 text-sm">—</span>
    const cls = getCategoryColorClasses(color)
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls.bg} ${cls.text}`}>
        {name}
      </span>
    )
  },
  enableSorting: true,
  size: 120,
} as DataTableColumnDef<Todo>,

// Tags — chips
{
  accessorKey: 'tags',
  header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
  cell: ({ row }) => {
    const tags = row.getValue('tags') as string[] | undefined
    if (!tags || tags.length === 0) return <span className="text-fg-muted/40 text-sm">—</span>
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center rounded-full bg-surface px-1.5 py-0.5 text-xs text-fg-muted border border-edge">
            {tag}
          </span>
        ))}
      </div>
    )
  },
  enableSorting: false,
  size: 200,
} as DataTableColumnDef<Todo>,
```

Add the import at the top:
```ts
import { getCategoryColorClasses } from './manage-categories-sheet'
```

**Step 2: Verify**

```bash
pnpm dev:ops
```

Switch to list view on todos page. No TS errors, new columns visible.

**Step 3: Commit**

```bash
git add apps/ops/components/todos-preset.tsx
git commit -m "feat(ops): add category and tags columns to todos list preset"
```

---

## Task 7: Update `todos/page.tsx` — full integration

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

This is the largest task. Work through it section by section.

### Step 1: Update imports

Add to the existing imports:

```ts
import { useQuery as useConvexQuery } from "convex/react"
import { ManageCategoriesSheet, CategoryBadge, getCategoryColorClasses } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"
```

Also add `api.categories.list` and `api.todos.listAllTags` queries in `TodosPage`.

### Step 2: Update `Todo` type resolution in `TodosPage`

```ts
const categories = useQuery(api.categories.list, {})
const allTags = useQuery(api.todos.listAllTags, {})
const categoryList = categories ?? []
const allTagsList = allTags ?? []

const todoRows = useMemo<Todo[]>(() => {
  if (!todos) return []
  return todos.map((t) => {
    const cat = categoryList.find((c) => c._id === t.categoryId)
    return {
      ...t,
      projectName: projectList.find((p) => p._id === t.projectId)?.name,
      categoryName: cat?.name,
      categoryColor: cat?.color,
    }
  })
}, [todos, projectList, categoryList])
```

### Step 3: Add category filter state and filter bar

Add state:
```ts
const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
```

Filter todos for kanban view:
```ts
const filteredTodos = useMemo(() => {
  if (!todos) return []
  if (!activeCategoryId) return todos
  return todos.filter((t) => t.categoryId === activeCategoryId)
}, [todos, activeCategoryId])
```

Replace `todos` with `filteredTodos` in the kanban rendering section.

Add the filter bar JSX above the kanban grid:
```tsx
{/* Category filter bar */}
{categoryList.length > 0 && (
  <div className="flex flex-wrap gap-1.5">
    <button
      type="button"
      onClick={() => setActiveCategoryId(null)}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        activeCategoryId === null
          ? "bg-brand text-white"
          : "bg-raised border border-edge text-fg-muted hover:text-fg"
      }`}
    >
      Tous
    </button>
    {categoryList.map((cat) => {
      const isActive = activeCategoryId === cat._id
      const cls = getCategoryColorClasses(cat.color)
      return (
        <button
          key={cat._id}
          type="button"
          onClick={() => setActiveCategoryId(isActive ? null : cat._id)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
            isActive
              ? `${cls.bg} ${cls.text} border-transparent`
              : "bg-raised border-edge text-fg-muted hover:text-fg"
          }`}
        >
          {cat.name}
        </button>
      )
    })}
  </div>
)}
```

### Step 4: Update `AddTodoDialog` signature and internals

Add props and state:
```ts
interface AddTodoDialogProps {
  defaultStatus: TodoStatus
  open: boolean
  onOpenChange: (v: boolean) => void
  projects: Doc<"projects">[]
  categories: { _id: string; name: string; color?: string }[]
  allTags: string[]
}
```

Add inside the component:
```ts
const [categoryId, setCategoryId] = useState<string>("")
const [tags, setTags] = useState<string[]>([])
```

Add to `reset()`:
```ts
setCategoryId("")
setTags([])
```

Add to `create(...)` call:
```ts
categoryId: categoryId as Id<"categories"> | undefined,
tags: tags.length > 0 ? tags : undefined,
```

Add to the form JSX (after the priority/project row):
```tsx
<Select
  value={categoryId}
  onValueChange={setCategoryId}
  items={[{ value: "", label: "Aucune" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Catégorie (optionnel)" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">Aucune</SelectItem>
    {categories.map((c) => (
      <SelectItem key={c._id} value={c._id}>
        <CategoryBadge name={c.name} color={c.color} />
      </SelectItem>
    ))}
  </SelectContent>
</Select>
<TagInput value={tags} onChange={setTags} suggestions={allTags} />
```

### Step 5: Update `EditTodoDialog` similarly

Same changes as `AddTodoDialog`: add `categories`, `allTags` props; add `categoryId`, `tags` state initialized from `todo`; include in form; update the `update` mutation call (use unified `api.todos.update`).

Replace the three separate mutation calls (`updateText`, `updatePriority`, `linkProject`) with a single:
```ts
const updateTodo = useMutation(api.todos.update)
// ...
await updateTodo({
  id: todo._id,
  text: text.trim(),
  description: description.trim() || undefined,
  priority: priority as "urgent" | "high" | "normal" | "low",
  projectId: (projectId || undefined) as Id<"projects"> | undefined,
  categoryId: (categoryId || undefined) as Id<"categories"> | undefined,
  tags: tags.length > 0 ? tags : undefined,
})
```

### Step 6: Update `TodoCard` to show category + tags

Add to the bottom of the card's metadata section (after the project badge):

```tsx
{(() => {
  const cat = categoryId
    ? categories.find((c) => c._id === todo.categoryId)
    : null
  return cat ? <CategoryBadge name={cat.name} color={cat.color} /> : null
})()}
{(todo.tags ?? []).length > 0 && (
  <div className="flex flex-wrap gap-1 mt-1">
    {(todo.tags ?? []).slice(0, 3).map((tag) => (
      <span key={tag} className="text-xs text-fg-muted bg-raised border border-edge rounded-full px-1.5 py-0">
        {tag}
      </span>
    ))}
    {(todo.tags ?? []).length > 3 && (
      <span className="text-xs text-fg-muted">+{(todo.tags ?? []).length - 3}</span>
    )}
  </div>
)}
```

Pass `categories={projectList}` → rename to pass actual `categoryList` from parent.

### Step 7: Add "Catégories" button in PageHeader

In `TodosPage`, update `actionsSlot`:
```tsx
actionsSlot={
  <div className="flex items-center gap-2">
    <ManageCategoriesSheet />
    {/* existing view toggle */}
    <div className="flex items-center gap-1 rounded-md border border-edge p-0.5">
      ...
    </div>
  </div>
}
```

### Step 8: Verify full integration

```bash
pnpm dev:ops
```

Checklist:
- [ ] "Catégories" button appears in page header
- [ ] Sheet opens, can create/delete a category with color
- [ ] Filter bar appears when categories exist
- [ ] Clicking a category chip filters kanban columns
- [ ] Add todo dialog shows category select + tag input
- [ ] Created todo shows category badge + tags on card
- [ ] Edit dialog pre-populates category + tags
- [ ] List view shows category and tags columns

### Step 9: Commit

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): integrate categories and tags into todos page"
```

---

## Done

All 7 tasks complete. The todos now support dynamic categories and free-form tags with kanban filtering.
