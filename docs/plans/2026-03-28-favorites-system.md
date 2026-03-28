# Favorites System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a universal favorites system to apps/ops — star any entity from its page header, see favorites in sidebar with drag & drop reorder.

**Architecture:** Dedicated Convex `favorites` table with denormalized labels. Single query powers the sidebar. Star button in PageHeader actions on each entity page. @dnd-kit for reorder.

**Tech Stack:** Convex (schema + queries + mutations), React 19, @blazz/pro PageHeader, @dnd-kit/core + @dnd-kit/sortable, lucide-react Star icon

---

### Task 1: Add `favorites` table to Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts` (add table before closing `}`)

**Step 1: Add the favorites table definition**

Insert before the closing `})` of `defineSchema`:

```typescript
// ── Favorites ──────────────────────────────────────────────────
favorites: defineTable({
	userId: v.string(),
	entityType: v.union(
		v.literal("client"),
		v.literal("project"),
		v.literal("todo"),
		v.literal("note"),
		v.literal("bookmark"),
		v.literal("feedItem"),
	),
	entityId: v.string(),
	label: v.string(),
	order: v.number(),
	createdAt: v.number(),
})
	.index("by_user_order", ["userId", "order"])
	.index("by_user_entity", ["userId", "entityType", "entityId"]),
```

**Step 2: Verify schema compiles**

Run: `cd apps/ops && npx convex dev --once --typecheck disable`
Expected: Schema pushed successfully

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add favorites table to Convex schema"
```

---

### Task 2: Create `favorites.ts` Convex functions (queries + mutations)

**Files:**
- Create: `apps/ops/convex/favorites.ts`

**Step 1: Create the file with all queries and mutations**

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const entityTypeValidator = v.union(
	v.literal("client"),
	v.literal("project"),
	v.literal("todo"),
	v.literal("note"),
	v.literal("bookmark"),
	v.literal("feedItem"),
)

// ── Queries ──────────────────────────────────────────────────

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const favorites = await ctx.db
			.query("favorites")
			.withIndex("by_user_order", (q) => q.eq("userId", userId))
			.collect()
		return favorites.sort((a, b) => a.order - b.order)
	},
})

export const isFavorited = query({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
	},
	handler: async (ctx, { entityType, entityId }) => {
		const { userId } = await requireAuth(ctx)
		const favorite = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) =>
				q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId),
			)
			.first()
		return !!favorite
	},
})

// ── Mutations ──────────────────────────────────────────────────

export const add = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
		label: v.string(),
	},
	handler: async (ctx, { entityType, entityId, label }) => {
		const { userId } = await requireAuth(ctx)

		// Check if already favorited
		const existing = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) =>
				q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId),
			)
			.first()
		if (existing) return existing._id

		// Get max order
		const all = await ctx.db
			.query("favorites")
			.withIndex("by_user_order", (q) => q.eq("userId", userId))
			.collect()
		const maxOrder = all.length > 0 ? Math.max(...all.map((f) => f.order)) : 0

		return ctx.db.insert("favorites", {
			userId,
			entityType,
			entityId,
			label: label.length > 30 ? `${label.slice(0, 27)}...` : label,
			order: maxOrder + 1,
			createdAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
	},
	handler: async (ctx, { entityType, entityId }) => {
		const { userId } = await requireAuth(ctx)
		const favorite = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) =>
				q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId),
			)
			.first()
		if (favorite) {
			await ctx.db.delete(favorite._id)
		}
	},
})

export const reorder = mutation({
	args: {
		orderedIds: v.array(v.id("favorites")),
	},
	handler: async (ctx, { orderedIds }) => {
		await requireAuth(ctx)
		for (let i = 0; i < orderedIds.length; i++) {
			await ctx.db.patch(orderedIds[i], { order: i + 1 })
		}
	},
})

export const updateLabel = mutation({
	args: {
		entityType: entityTypeValidator,
		entityId: v.string(),
		label: v.string(),
	},
	handler: async (ctx, { entityType, entityId, label }) => {
		const { userId } = await requireAuth(ctx)
		const favorite = await ctx.db
			.query("favorites")
			.withIndex("by_user_entity", (q) =>
				q.eq("userId", userId).eq("entityType", entityType).eq("entityId", entityId),
			)
			.first()
		if (favorite) {
			await ctx.db.patch(favorite._id, {
				label: label.length > 30 ? `${label.slice(0, 27)}...` : label,
			})
		}
	},
})
```

**Step 2: Verify Convex syncs**

Run: `cd apps/ops && npx convex dev --once --typecheck disable`
Expected: Functions pushed successfully

**Step 3: Commit**

```bash
git add apps/ops/convex/favorites.ts
git commit -m "feat(ops): add favorites Convex queries and mutations"
```

---

### Task 3: Create `FavoriteButton` component

**Files:**
- Create: `apps/ops/components/favorite-button.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { Star } from "lucide-react"
import { api } from "@/convex/_generated/api"

interface FavoriteButtonProps {
	entityType: "client" | "project" | "todo" | "note" | "bookmark" | "feedItem"
	entityId: string
	label: string
}

export function FavoriteButton({ entityType, entityId, label }: FavoriteButtonProps) {
	const isFavorited = useQuery(api.favorites.isFavorited, { entityType, entityId })
	const addFavorite = useMutation(api.favorites.add)
	const removeFavorite = useMutation(api.favorites.remove)

	if (isFavorited === undefined) return null

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={() => {
				if (isFavorited) {
					removeFavorite({ entityType, entityId })
				} else {
					addFavorite({ entityType, entityId, label })
				}
			}}
		>
			<Star
				className={`size-4 transition-transform ${
					isFavorited
						? "fill-amber-400 text-amber-400 scale-110"
						: "text-fg-muted"
				}`}
			/>
		</Button>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/favorite-button.tsx
git commit -m "feat(ops): add FavoriteButton component with star toggle"
```

---

### Task 4: Add FavoriteButton to entity page headers

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/_client.tsx`
- Modify: `apps/ops/app/(main)/projects/[pid]/page.tsx`
- Modify other entity pages as found (notes, todos, bookmarks detail pages)

**Step 1: Client detail page**

In `apps/ops/app/(main)/clients/[id]/_client.tsx`, add import:
```tsx
import { FavoriteButton } from "@/components/favorite-button"
```

Replace the PageHeader section (~line 89-96):
```tsx
<PageHeader
	title={client.name}
	actions={
		<InlineStack gap="200" blockAlign="center">
			<FavoriteButton
				entityType="client"
				entityId={id}
				label={client.name}
			/>
			<Button variant="outline" onClick={() => setEditOpen(true)}>
				Modifier
			</Button>
		</InlineStack>
	}
/>
```

**Step 2: Project detail page**

In `apps/ops/app/(main)/projects/[pid]/page.tsx`, same pattern — add import and wrap existing actions with `<InlineStack>` + `<FavoriteButton entityType="project" ...>`.

Find the PageHeader in the file and add FavoriteButton before existing action buttons.

**Step 3: Other entity pages**

Find and update PageHeader on:
- Notes detail (if individual note page exists)
- Todos (if individual todo page exists)
- Bookmarks (if detail page exists)

For list pages (todos, notes) that don't have individual detail pages, skip — we can add context menu favorites later.

**Step 4: Verify the app renders**

Run: `pnpm dev:ops`
Navigate to a client detail page, verify the star appears next to the title.
Click star → verify it fills amber. Click again → unfills.

**Step 5: Commit**

```bash
git add apps/ops/app/(main)/clients/[id]/_client.tsx apps/ops/app/(main)/projects/[pid]/page.tsx
git commit -m "feat(ops): add favorite star to client and project page headers"
```

---

### Task 5: Add "Favoris" group to sidebar

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add imports**

```tsx
import { Star } from "lucide-react"
```

Add to existing convex imports — `useMutation` alongside `useQuery`:
```tsx
import { useMutation, useQuery } from "convex/react"
```

**Step 2: Create icon map for entity types**

Add after the `createAgentIconWithStatus` function (after line 67):

```tsx
const entityTypeIcons: Record<string, ComponentType<{ className?: string }>> = {
	client: Users,
	project: FolderOpen,
	todo: CheckSquare,
	note: FileText,
	bookmark: Bookmark,
	feedItem: Rss,
}
```

**Step 3: Build dynamic favorites group in the `useMemo`**

Inside `OpsFrame`, add the favorites query:
```tsx
const favorites = useQuery(api.favorites.list)
```

Inside the `useMemo` (add `favorites` to deps), after building `filtered`, insert the Favoris group:

```tsx
// Build Favoris group from live data
if (favorites && favorites.length > 0) {
	const favGroup: NavGroup = {
		label: "Favoris",
		items: favorites.map((fav) => {
			const urlMap: Record<string, string> = {
				client: `/clients/${fav.entityId}`,
				project: `/projects/${fav.entityId}`,
				todo: `/todos`,
				note: `/notes/${fav.entityId}`,
				bookmark: `/bookmarks`,
				feedItem: `/veille`,
			}
			return {
				title: fav.label,
				url: urlMap[fav.entityType] ?? "/",
				icon: entityTypeIcons[fav.entityType] ?? Star,
			}
		}),
	}
	// Insert after Inbox item — find the main group (index 0 after shortcuts if shortcuts exist)
	// Insert favGroup after the main group (which contains Inbox)
	const shortcutsIdx = filtered.findIndex((g) => g.display === "shortcuts")
	const mainIdx = shortcutsIdx >= 0 ? shortcutsIdx + 1 : 0
	filtered.splice(mainIdx + 1, 0, favGroup)
}
```

**Step 4: Verify sidebar renders**

Run: `pnpm dev:ops`
Star a client from its detail page → verify "Favoris" group appears in sidebar with the client name and Users icon.

**Step 5: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add Favoris group to sidebar with entity type icons"
```

---

### Task 6: Add drag & drop reorder to favorites sidebar group

**Files:**
- Create: `apps/ops/components/sidebar-favorites.tsx`
- Modify: `apps/ops/components/ops-frame.tsx` (use the new component instead of static NavGroup)

**Step 1: Check @dnd-kit is available**

Run: `cat apps/ops/package.json | grep dnd`

If not present:
Run: `cd apps/ops && pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

**Step 2: Create SidebarFavorites component**

```tsx
"use client"

import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core"
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMutation, useQuery } from "convex/react"
import {
	Bookmark,
	CheckSquare,
	FileText,
	FolderOpen,
	GripVertical,
	Rss,
	Star,
	Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const entityTypeIcons: Record<string, ComponentType<{ className?: string }>> = {
	client: Users,
	project: FolderOpen,
	todo: CheckSquare,
	note: FileText,
	bookmark: Bookmark,
	feedItem: Rss,
}

const urlMap: Record<string, (id: string) => string> = {
	client: (id) => `/clients/${id}`,
	project: (id) => `/projects/${id}`,
	todo: () => "/todos",
	note: (id) => `/notes/${id}`,
	bookmark: () => "/bookmarks",
	feedItem: () => "/veille",
}

interface FavoriteItem {
	_id: Id<"favorites">
	entityType: string
	entityId: string
	label: string
	order: number
}

function SortableFavorite({ item }: { item: FavoriteItem }) {
	const pathname = usePathname()
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: item._id,
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const Icon = entityTypeIcons[item.entityType] ?? Star
	const url = (urlMap[item.entityType] ?? (() => "/"))(item.entityId)
	const isActive = pathname === url

	return (
		<div ref={setNodeRef} style={style} className="group flex items-center">
			<button
				{...attributes}
				{...listeners}
				className="opacity-0 group-hover:opacity-100 p-0.5 cursor-grab text-fg-muted"
			>
				<GripVertical className="size-3" />
			</button>
			<Link
				href={url}
				className={`flex items-center gap-2 flex-1 rounded-md px-2 py-1.5 text-sm truncate transition-colors ${
					isActive
						? "bg-raised text-fg font-medium"
						: "text-fg-muted hover:text-fg hover:bg-raised/50"
				}`}
			>
				<Icon className="size-4 shrink-0" />
				<span className="truncate">{item.label}</span>
			</Link>
		</div>
	)
}

export function SidebarFavorites() {
	const favorites = useQuery(api.favorites.list)
	const reorder = useMutation(api.favorites.reorder)

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	)

	if (!favorites || favorites.length === 0) return null

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id || !favorites) return

		const oldIndex = favorites.findIndex((f) => f._id === active.id)
		const newIndex = favorites.findIndex((f) => f._id === over.id)
		if (oldIndex === -1 || newIndex === -1) return

		const reordered = [...favorites]
		const [moved] = reordered.splice(oldIndex, 1)
		reordered.splice(newIndex, 0, moved)

		reorder({ orderedIds: reordered.map((f) => f._id) })
	}

	return (
		<div className="px-2 py-1">
			<div className="px-2 py-1 text-xs font-medium text-fg-muted uppercase tracking-wider">
				Favoris
			</div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={favorites.map((f) => f._id)} strategy={verticalListSortingStrategy}>
					{favorites.map((fav) => (
						<SortableFavorite key={fav._id} item={fav} />
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}
```

**Step 3: Integrate into ops-frame.tsx**

This is the tricky part — AppFrame uses NavGroups data, not custom components. Two options:
1. Pass favorites as a regular NavGroup (no drag & drop in sidebar) and add drag & drop later
2. Check if AppFrame supports custom sidebar sections

Read `@blazz/pro/components/blocks/app-frame` to see if it supports `sidebarContent` or custom sections. If it does, use `SidebarFavorites` as a custom section. If not, fall back to NavGroup for now and add drag & drop in a follow-up.

**For the initial implementation:** Use NavGroup approach from Task 5 (no drag & drop). Add `SidebarFavorites` as enhancement once we verify AppFrame supports custom sidebar content.

**Step 4: Commit**

```bash
git add apps/ops/components/sidebar-favorites.tsx
git commit -m "feat(ops): add SidebarFavorites component with drag-and-drop reorder"
```

---

### Task 7: Label sync — lazy update on sidebar load

**Files:**
- Modify: `apps/ops/convex/favorites.ts` (add `syncLabels` query/mutation)

**Step 1: Add a syncLabels mutation**

```typescript
export const syncLabels = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const favorites = await ctx.db
			.query("favorites")
			.withIndex("by_user_order", (q) => q.eq("userId", userId))
			.collect()

		for (const fav of favorites) {
			const tableMap: Record<string, string> = {
				client: "clients",
				project: "projects",
				todo: "todos",
				note: "notes",
				bookmark: "bookmarks",
				feedItem: "feedItems",
			}
			const tableName = tableMap[fav.entityType]
			if (!tableName) continue

			const entity = await ctx.db.get(fav.entityId as any)
			if (!entity) {
				// Entity deleted — remove favorite
				await ctx.db.delete(fav._id)
				continue
			}

			// Get label from entity
			const labelField = fav.entityType === "todo" ? "text" : (fav.entityType === "feedItem" ? "title" : "name")
			const rawLabel = (entity as any)[labelField] ?? (entity as any).title ?? "Sans titre"
			const newLabel = rawLabel.length > 30 ? `${rawLabel.slice(0, 27)}...` : rawLabel

			if (newLabel !== fav.label) {
				await ctx.db.patch(fav._id, { label: newLabel })
			}
		}
	},
})
```

**Step 2: Call syncLabels on sidebar mount**

In the component that renders favorites (SidebarFavorites or ops-frame), call the sync once on mount:

```tsx
const sync = useMutation(api.favorites.syncLabels)
useEffect(() => { sync() }, []) // eslint-disable-line react-hooks/exhaustive-deps
```

**Step 3: Commit**

```bash
git add apps/ops/convex/favorites.ts
git commit -m "feat(ops): add lazy label sync for favorites"
```

---

### Task 8: Verify end-to-end flow

**Step 1: Start dev server**

Run: `pnpm dev:ops`

**Step 2: Test the full flow**

1. Navigate to `/clients/[some-id]` → verify star icon next to title
2. Click star → verify it fills amber
3. Check sidebar → "Favoris" group appears with client name + Users icon
4. Navigate to `/projects/[some-pid]` → click star
5. Check sidebar → both favorites visible, project has FolderOpen icon
6. Click star again on client → verify it's removed from sidebar
7. If drag & drop is integrated: reorder favorites in sidebar, refresh page, verify order persists

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(ops): favorites system — star entities, sidebar group, drag-and-drop"
```
