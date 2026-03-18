# Notes Tags Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a colored tag system on notes in the Ops app, with a dedicated `tags` Convex table, tag picker popover, and visual display in the editor and sidebar.

**Architecture:** New `tags` table in Convex with `userId`, `name`, `color`. Notes get a `tags` field storing an array of tag IDs. A new `NoteTagPicker` popover component handles tag selection and creation. Tag colors use a fixed 9-color palette mapped to Tailwind classes.

**Tech Stack:** Convex (schema + mutations), React, @blazz/ui (Popover, Badge, ScrollArea), Tailwind

---

### Task 1: Add `tags` table to Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add the `tags` table and update `notes`**

In `apps/ops/convex/schema.ts`, add a new `tags` table before `todos`, and add the `tags` field to the `notes` table:

```ts
// Add after the notes table definition, before contracts:
tags: defineTable({
    userId: v.string(),
    name: v.string(),
    color: v.string(),
    createdAt: v.number(),
}).index("by_user", ["userId"]),
```

In the `notes` table, add after the `pinned` field:

```ts
tags: v.optional(v.array(v.id("tags"))),
```

**Step 2: Run Convex to verify schema pushes**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add tags table and tags field on notes"
```

---

### Task 2: Create Convex `tags` mutations and queries

**Files:**
- Create: `apps/ops/convex/tags.ts`
- Modify: `apps/ops/convex/notes.ts`

**Step 1: Create `apps/ops/convex/tags.ts`**

```ts
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
    args: {},
    handler: async (ctx) => {
        const { userId } = await requireAuth(ctx)
        return ctx.db
            .query("tags")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect()
    },
})

export const create = mutation({
    args: {
        name: v.string(),
        color: v.string(),
    },
    handler: async (ctx, { name, color }) => {
        const { userId } = await requireAuth(ctx)
        const trimmed = name.trim().toLowerCase()
        if (!trimmed) throw new ConvexError("Le nom du tag est requis")
        return ctx.db.insert("tags", {
            userId,
            name: trimmed,
            color,
            createdAt: Date.now(),
        })
    },
})

export const remove = mutation({
    args: { id: v.id("tags") },
    handler: async (ctx, { id }) => {
        const { userId } = await requireAuth(ctx)
        const tag = await ctx.db.get(id)
        if (!tag || tag.userId !== userId) throw new ConvexError("Introuvable")

        // Remove tag from all notes that reference it
        const notes = await ctx.db
            .query("notes")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect()
        for (const note of notes) {
            if (note.tags?.includes(id)) {
                await ctx.db.patch(note._id, {
                    tags: note.tags.filter((t) => t !== id),
                })
            }
        }

        return ctx.db.delete(id)
    },
})
```

**Step 2: Update `notes.update` to accept tags**

In `apps/ops/convex/notes.ts`, update the `update` mutation:

- Add to args: `tags: v.optional(v.array(v.id("tags"))),`
- Add to handler destructuring: `tags`
- Add to patch logic: `if (tags !== undefined) patch.tags = tags`

The updated mutation args:
```ts
export const update = mutation({
    args: {
        id: v.id("notes"),
        title: v.optional(v.string()),
        contentJson: v.optional(v.union(v.any(), v.null())),
        contentText: v.optional(v.union(v.string(), v.null())),
        pinned: v.optional(v.boolean()),
        tags: v.optional(v.array(v.id("tags"))),
    },
    handler: async (ctx, { id, title, contentJson, contentText, pinned, tags }) => {
        const { userId } = await requireAuth(ctx)
        const note = await ctx.db.get(id)
        if (!note || note.userId !== userId) throw new ConvexError("Introuvable")

        const patch: Record<string, unknown> = { updatedAt: Date.now() }
        applyNotePatchField(patch, "title", title?.trim() || (title === "" ? "Nouvelle note" : undefined))
        applyNotePatchField(patch, "contentJson", contentJson)
        applyNotePatchField(patch, "contentText", contentText)
        applyNotePatchField(patch, "pinned", pinned)
        if (tags !== undefined) patch.tags = tags
        return ctx.db.patch(id, patch)
    },
})
```

**Step 3: Push and verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors.

**Step 4: Commit**

```bash
git add apps/ops/convex/tags.ts apps/ops/convex/notes.ts
git commit -m "feat(ops): add tags CRUD and tags support in notes.update"
```

---

### Task 3: Create tag color constants and NoteTagPicker component

**Files:**
- Create: `apps/ops/lib/tag-colors.ts`
- Create: `apps/ops/components/note-tag-picker.tsx`

**Step 1: Create `apps/ops/lib/tag-colors.ts`**

Maps color keys to Tailwind classes (bg for dot, bg for badge, text for badge).

```ts
export const TAG_COLORS = [
    { key: "gray", label: "Gris", dot: "bg-zinc-400", bg: "bg-zinc-500/10", text: "text-zinc-600 dark:text-zinc-400" },
    { key: "blue", label: "Bleu", dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
    { key: "teal", label: "Teal", dot: "bg-teal-500", bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400" },
    { key: "green", label: "Vert", dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    { key: "yellow", label: "Jaune", dot: "bg-yellow-500", bg: "bg-yellow-500/10", text: "text-yellow-600 dark:text-yellow-400" },
    { key: "orange", label: "Orange", dot: "bg-orange-500", bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
    { key: "pink", label: "Rose", dot: "bg-pink-500", bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
    { key: "red", label: "Rouge", dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
    { key: "purple", label: "Violet", dot: "bg-purple-500", bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
] as const

export type TagColorKey = (typeof TAG_COLORS)[number]["key"]

export function getTagColor(key: string) {
    return TAG_COLORS.find((c) => c.key === key) ?? TAG_COLORS[0]
}
```

**Step 2: Create `apps/ops/components/note-tag-picker.tsx`**

A Popover triggered by a `+` button. Shows:
- Search input at top
- List of existing tags with checkboxes (toggle on/off)
- "Créer [query]" option with color selector when no match
- Color selector: 9 dots in a row

```tsx
"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui/components/ui/popover"
import { ScrollArea } from "@blazz/ui/components/ui/scroll-area"
import { useMutation, useQuery } from "convex/react"
import { Check, Plus, Tag } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { TAG_COLORS, getTagColor } from "@/lib/tag-colors"
import type { TagColorKey } from "@/lib/tag-colors"

interface NoteTagPickerProps {
    noteId: Id<"notes">
    noteTagIds: Id<"tags">[]
}

export function NoteTagPicker({ noteId, noteTagIds }: NoteTagPickerProps) {
    const allTags = useQuery(api.tags.list) ?? []
    const createTag = useMutation(api.tags.create)
    const updateNote = useMutation(api.notes.update)

    const [search, setSearch] = useState("")
    const [newColor, setNewColor] = useState<TagColorKey>("blue")
    const [open, setOpen] = useState(false)

    const filtered = allTags.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    )

    const exactMatch = allTags.some(
        (t) => t.name.toLowerCase() === search.trim().toLowerCase()
    )

    async function toggleTag(tagId: Id<"tags">) {
        const current = noteTagIds
        const next = current.includes(tagId)
            ? current.filter((id) => id !== tagId)
            : [...current, tagId]
        await updateNote({ id: noteId, tags: next })
    }

    async function handleCreate() {
        const trimmed = search.trim()
        if (!trimmed) return
        const id = await createTag({ name: trimmed, color: newColor })
        await updateNote({ id: noteId, tags: [...noteTagIds, id] })
        setSearch("")
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
                <Tag className="size-3" />
                <span>Tags</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[260px] p-0">
                {/* Search */}
                <div className="border-b border-edge px-3 py-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Chercher ou créer un tag…"
                        className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted/60"
                        autoFocus
                    />
                </div>

                {/* Tag list */}
                <ScrollArea className="max-h-[240px]">
                    <div className="p-1">
                        {filtered.map((tag) => {
                            const color = getTagColor(tag.color)
                            const isActive = noteTagIds.includes(tag._id)
                            return (
                                <button
                                    key={tag._id}
                                    type="button"
                                    onClick={() => void toggleTag(tag._id)}
                                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-2"
                                >
                                    <span className={`size-2.5 shrink-0 rounded-full ${color.dot}`} />
                                    <span className="min-w-0 flex-1 truncate text-left text-fg">
                                        {tag.name}
                                    </span>
                                    {isActive ? (
                                        <Check className="size-3.5 shrink-0 text-brand" />
                                    ) : null}
                                </button>
                            )
                        })}

                        {/* Create option */}
                        {search.trim() && !exactMatch ? (
                            <div className="border-t border-edge mt-1 pt-1">
                                <button
                                    type="button"
                                    onClick={() => void handleCreate()}
                                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-fg transition-colors hover:bg-surface-2"
                                >
                                    <Plus className="size-3.5 shrink-0 text-fg-muted" />
                                    <span>
                                        Créer <strong>{search.trim()}</strong>
                                    </span>
                                </button>
                                {/* Color selector */}
                                <div className="flex items-center gap-1.5 px-2.5 py-2">
                                    {TAG_COLORS.map((c) => (
                                        <button
                                            key={c.key}
                                            type="button"
                                            onClick={() => setNewColor(c.key)}
                                            className={`size-5 rounded-full transition-all ${c.dot} ${
                                                newColor === c.key
                                                    ? "ring-2 ring-fg ring-offset-2 ring-offset-surface"
                                                    : "hover:scale-110"
                                            }`}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {filtered.length === 0 && !search.trim() ? (
                            <p className="px-3 py-4 text-center text-xs text-fg-muted">
                                Aucun tag. Tape un nom pour en créer.
                            </p>
                        ) : null}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
```

**Step 3: Commit**

```bash
git add apps/ops/lib/tag-colors.ts apps/ops/components/note-tag-picker.tsx
git commit -m "feat(ops): add tag color constants and NoteTagPicker component"
```

---

### Task 4: Integrate tags in the notes editor and sidebar

**Files:**
- Modify: `apps/ops/components/entity-notes-panel.tsx`

**Step 1: Add tag display and picker to the editor**

In `entity-notes-panel.tsx`:

1. Add imports:
```tsx
import { NoteTagPicker } from "@/components/note-tag-picker"
import { getTagColor } from "@/lib/tag-colors"
```

2. Add a `useQuery(api.tags.list)` call alongside existing queries to resolve tag names/colors.

3. In the editor toolbar (the bar with Pin/Supprimer), add the `<NoteTagPicker>` after the pin button:
```tsx
<NoteTagPicker
    noteId={selectedNote._id}
    noteTagIds={selectedNote.tags ?? []}
/>
```

4. Between the title `<textarea>` and the date `<p>`, add the tag badges display:
```tsx
{selectedNote.tags && selectedNote.tags.length > 0 ? (
    <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {selectedNote.tags.map((tagId) => {
            const tag = allTags?.find((t) => t._id === tagId)
            if (!tag) return null
            const color = getTagColor(tag.color)
            return (
                <span
                    key={tagId}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}
                >
                    <span className={`size-1.5 rounded-full ${color.dot}`} />
                    {tag.name}
                </span>
            )
        })}
    </div>
) : null}
```

5. In the sidebar TreeView, add colored dots to notes that have tags. Update the `buildTreeData` function to accept `allTags` and include dot indicators in the tree node icon or as a suffix.

For the TreeView nodes, update the icon to show tag dots when a note has tags:
```tsx
icon: note.pinned ? (
    <Pin className="size-3.5 text-amber-500" />
) : note.tags && note.tags.length > 0 ? (
    <span className="flex items-center gap-0.5">
        <FileText className="size-3.5" />
    </span>
) : (
    <FileText className="size-3.5" />
),
```

And for the tree node label, we can't easily add dots after the label with the current TreeView API, so we keep it simple — the tags are visible in the editor when you select a note.

**Step 2: Verify in browser**

Run: `pnpm dev:ops`
Expected:
- Tag picker appears in the toolbar
- Can create tags with colors
- Tags display as colored badges under the note title
- Tags persist after refresh

**Step 3: Commit**

```bash
git add apps/ops/components/entity-notes-panel.tsx
git commit -m "feat(ops): integrate tag picker and display in notes editor"
```

---

### Task 5: Final polish and verification

**Files:**
- All modified files from previous tasks

**Step 1: Verify full flow**

1. Open Notes page
2. Create a new tag "urgent" (red)
3. Create a tag "idée" (purple)
4. Assign both to a note → badges appear under title
5. Toggle a tag off → badge disappears
6. Create another note, assign "urgent" → same tag reused
7. Pin button still works
8. Save state indicator still works
9. Delete note still works

**Step 2: Commit if any fixes**

```bash
git add -A apps/ops/
git commit -m "fix(ops): polish notes tags integration"
```
