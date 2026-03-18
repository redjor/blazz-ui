# Bookmarks System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a bookmark management system to Blazz Ops for saving and organizing tweets, YouTube videos, images, videos, and links with collections (2 levels) and tags.

**Architecture:** Two new Convex tables (`bookmarks`, `bookmarkCollections`), one Next.js API route for metadata extraction, and a new `/bookmarks` page with grid layout + collection sidebar. Reuses the existing `tags` table and `tag-input.tsx` component.

**Tech Stack:** Convex (backend), Next.js 16 API routes (metadata extraction), React 19, @blazz/ui components, Lucide icons, Tailwind v4.

**Design doc:** `docs/plans/2026-03-18-bookmarks-design.md`

---

### Task 1: Add schema tables

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add `bookmarkCollections` and `bookmarks` tables to schema**

Add after the `packages` table definition (before the closing `})`):

```ts
bookmarkCollections: defineTable({
	userId: v.string(),
	name: v.string(),
	icon: v.optional(v.string()),
	color: v.optional(v.string()),
	parentId: v.optional(v.id("bookmarkCollections")),
	order: v.number(),
	createdAt: v.number(),
})
	.index("by_user", ["userId"])
	.index("by_parent", ["parentId"]),

bookmarks: defineTable({
	userId: v.string(),
	url: v.string(),
	type: v.union(
		v.literal("tweet"),
		v.literal("youtube"),
		v.literal("image"),
		v.literal("video"),
		v.literal("link")
	),
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	thumbnailUrl: v.optional(v.string()),
	thumbnailStorageId: v.optional(v.id("_storage")),
	author: v.optional(v.string()),
	siteName: v.optional(v.string()),
	embedUrl: v.optional(v.string()),
	collectionId: v.optional(v.id("bookmarkCollections")),
	tags: v.optional(v.array(v.id("tags"))),
	notes: v.optional(v.string()),
	pinned: v.boolean(),
	archivedAt: v.optional(v.number()),
	createdAt: v.number(),
})
	.index("by_user", ["userId"])
	.index("by_user_collection", ["userId", "collectionId"])
	.index("by_user_type", ["userId", "type"])
	.index("by_user_archived", ["userId", "archivedAt"]),
```

**Step 2: Verify Convex accepts the schema**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema push succeeds, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add bookmarks and bookmarkCollections tables to schema"
```

---

### Task 2: Create `bookmarkCollections` Convex functions

**Files:**
- Create: `apps/ops/convex/bookmarkCollections.ts`

**Step 1: Create the file with CRUD functions**

```ts
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("bookmarkCollections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const create = mutation({
	args: {
		name: v.string(),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
		parentId: v.optional(v.id("bookmarkCollections")),
	},
	handler: async (ctx, { name, icon, color, parentId }) => {
		const { userId } = await requireAuth(ctx)
		const trimmed = name.trim()
		if (!trimmed) throw new ConvexError("Le nom est requis")

		// Validate max 2 levels: parentId must be top-level
		if (parentId) {
			const parent = await ctx.db.get(parentId)
			if (!parent || parent.userId !== userId) throw new ConvexError("Collection parente introuvable")
			if (parent.parentId) throw new ConvexError("Maximum 2 niveaux de collections")
		}

		// Auto-increment order
		const siblings = await ctx.db
			.query("bookmarkCollections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
		const sameLevel = siblings.filter((c) =>
			parentId ? c.parentId === parentId : !c.parentId
		)
		const maxOrder = sameLevel.reduce((max, c) => Math.max(max, c.order), -1)

		return ctx.db.insert("bookmarkCollections", {
			userId,
			name: trimmed,
			icon,
			color,
			parentId,
			order: maxOrder + 1,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("bookmarkCollections"),
		name: v.optional(v.string()),
		icon: v.optional(v.string()),
		color: v.optional(v.string()),
		order: v.optional(v.number()),
	},
	handler: async (ctx, { id, name, icon, color, order }) => {
		const { userId } = await requireAuth(ctx)
		const col = await ctx.db.get(id)
		if (!col || col.userId !== userId) throw new ConvexError("Introuvable")

		const patch: Record<string, unknown> = {}
		if (name !== undefined) patch.name = name.trim() || col.name
		if (icon !== undefined) patch.icon = icon
		if (color !== undefined) patch.color = color
		if (order !== undefined) patch.order = order
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("bookmarkCollections") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const col = await ctx.db.get(id)
		if (!col || col.userId !== userId) throw new ConvexError("Introuvable")

		// Unlink bookmarks in this collection
		const bookmarks = await ctx.db
			.query("bookmarks")
			.withIndex("by_user_collection", (q) => q.eq("userId", userId).eq("collectionId", id))
			.collect()
		for (const b of bookmarks) {
			await ctx.db.patch(b._id, { collectionId: undefined })
		}

		// Delete sub-collections and unlink their bookmarks
		const children = await ctx.db
			.query("bookmarkCollections")
			.withIndex("by_parent", (q) => q.eq("parentId", id))
			.collect()
		for (const child of children) {
			const childBookmarks = await ctx.db
				.query("bookmarks")
				.withIndex("by_user_collection", (q) => q.eq("userId", userId).eq("collectionId", child._id))
				.collect()
			for (const b of childBookmarks) {
				await ctx.db.patch(b._id, { collectionId: undefined })
			}
			await ctx.db.delete(child._id)
		}

		return ctx.db.delete(id)
	},
})
```

**Step 2: Verify Convex compiles**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/bookmarkCollections.ts
git commit -m "feat(ops): add bookmarkCollections Convex CRUD functions"
```

---

### Task 3: Create `bookmarks` Convex functions

**Files:**
- Create: `apps/ops/convex/bookmarks.ts`

**Step 1: Create the file with CRUD + list/archive/move functions**

```ts
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const bookmarkTypeValidator = v.union(
	v.literal("tweet"),
	v.literal("youtube"),
	v.literal("image"),
	v.literal("video"),
	v.literal("link")
)

export const list = query({
	args: {
		collectionId: v.optional(v.id("bookmarkCollections")),
		type: v.optional(bookmarkTypeValidator),
		tag: v.optional(v.id("tags")),
		archived: v.optional(v.boolean()),
		search: v.optional(v.string()),
	},
	handler: async (ctx, { collectionId, type, tag, archived, search }) => {
		const { userId } = await requireAuth(ctx)

		let results
		if (collectionId) {
			results = await ctx.db
				.query("bookmarks")
				.withIndex("by_user_collection", (q) => q.eq("userId", userId).eq("collectionId", collectionId))
				.collect()
		} else if (type) {
			results = await ctx.db
				.query("bookmarks")
				.withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type))
				.collect()
		} else {
			results = await ctx.db
				.query("bookmarks")
				.withIndex("by_user", (q) => q.eq("userId", userId))
				.collect()
		}

		// Filter archived
		if (archived === true) {
			results = results.filter((b) => b.archivedAt != null)
		} else if (archived !== undefined) {
			results = results.filter((b) => b.archivedAt == null)
		} else {
			// Default: exclude archived
			results = results.filter((b) => b.archivedAt == null)
		}

		// Filter by tag
		if (tag) {
			results = results.filter((b) => b.tags?.includes(tag))
		}

		// Filter by search
		if (search) {
			const q = search.toLowerCase()
			results = results.filter(
				(b) =>
					b.title?.toLowerCase().includes(q) ||
					b.description?.toLowerCase().includes(q) ||
					b.url.toLowerCase().includes(q) ||
					b.author?.toLowerCase().includes(q)
			)
		}

		// Sort: pinned first, then by creation time desc
		return results.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
			return b._creationTime - a._creationTime
		})
	},
})

export const get = query({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return bookmark
	},
})

export const create = mutation({
	args: {
		url: v.string(),
		type: bookmarkTypeValidator,
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		thumbnailUrl: v.optional(v.string()),
		author: v.optional(v.string()),
		siteName: v.optional(v.string()),
		embedUrl: v.optional(v.string()),
		collectionId: v.optional(v.id("bookmarkCollections")),
		tags: v.optional(v.array(v.id("tags"))),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)
		const url = args.url.trim()
		if (!url) throw new ConvexError("L'URL est requise")

		return ctx.db.insert("bookmarks", {
			userId,
			url,
			type: args.type,
			title: args.title,
			description: args.description,
			thumbnailUrl: args.thumbnailUrl,
			author: args.author,
			siteName: args.siteName,
			embedUrl: args.embedUrl,
			collectionId: args.collectionId,
			tags: args.tags,
			notes: args.notes,
			pinned: false,
			createdAt: Date.now(),
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("bookmarks"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		collectionId: v.optional(v.union(v.id("bookmarkCollections"), v.null())),
		tags: v.optional(v.array(v.id("tags"))),
		notes: v.optional(v.string()),
		pinned: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")

		const patch: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(fields)) {
			if (value !== undefined) {
				patch[key] = value === null ? undefined : value
			}
		}
		return ctx.db.patch(id, patch)
	},
})

export const remove = mutation({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.delete(id)
	},
})

export const removeBatch = mutation({
	args: { ids: v.array(v.id("bookmarks")) },
	handler: async (ctx, { ids }) => {
		const { userId } = await requireAuth(ctx)
		for (const id of ids) {
			const bookmark = await ctx.db.get(id)
			if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
			await ctx.db.delete(id)
		}
	},
})

export const archive = mutation({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { archivedAt: Date.now() })
	},
})

export const unarchive = mutation({
	args: { id: v.id("bookmarks") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const bookmark = await ctx.db.get(id)
		if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
		return ctx.db.patch(id, { archivedAt: undefined })
	},
})

export const move = mutation({
	args: {
		ids: v.array(v.id("bookmarks")),
		collectionId: v.optional(v.id("bookmarkCollections")),
	},
	handler: async (ctx, { ids, collectionId }) => {
		const { userId } = await requireAuth(ctx)
		for (const id of ids) {
			const bookmark = await ctx.db.get(id)
			if (!bookmark || bookmark.userId !== userId) throw new ConvexError("Introuvable")
			await ctx.db.patch(id, { collectionId: collectionId ?? undefined })
		}
	},
})
```

**Step 2: Update `tags.ts` to cascade delete into bookmarks**

In `apps/ops/convex/tags.ts`, add `"bookmarks"` to the `tables` array on line 42:

```ts
const tables = ["notes", "projects", "timeEntries", "licenseKeys", "bookmarks"] as const
```

**Step 3: Verify Convex compiles**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors.

**Step 4: Commit**

```bash
git add apps/ops/convex/bookmarks.ts apps/ops/convex/tags.ts
git commit -m "feat(ops): add bookmarks Convex CRUD functions with tag cascade"
```

---

### Task 4: Create metadata extraction API route

**Files:**
- Create: `apps/ops/app/api/bookmarks/metadata/route.ts`

**Step 1: Create the URL type detector and OG metadata fetcher**

```ts
import { NextResponse } from "next/server"

type BookmarkType = "tweet" | "youtube" | "image" | "video" | "link"

interface ExtractedMetadata {
	type: BookmarkType
	title?: string
	description?: string
	thumbnailUrl?: string
	author?: string
	siteName?: string
	embedUrl?: string
}

function detectType(url: string): BookmarkType {
	const u = url.toLowerCase()
	if (u.includes("twitter.com/") || u.includes("x.com/")) return "tweet"
	if (u.includes("youtube.com/watch") || u.includes("youtu.be/")) return "youtube"
	if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(u)) return "image"
	if (/\.(mp4|webm|mov)(\?.*)?$/i.test(u)) return "video"
	return "link"
}

function extractYouTubeId(url: string): string | null {
	const match = url.match(
		/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
	)
	return match?.[1] ?? null
}

function extractTweetAuthor(url: string): string | null {
	const match = url.match(/(?:twitter\.com|x\.com)\/([\w]+)\/status/)
	return match?.[1] ?? null
}

function getMetaContent(html: string, property: string): string | null {
	// Match both property="..." and name="..." attributes
	const regex = new RegExp(
		`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*?)["']|<meta[^>]*content=["']([^"']*?)["'][^>]*(?:property|name)=["']${property}["']`,
		"i"
	)
	const match = html.match(regex)
	return match?.[1] ?? match?.[2] ?? null
}

function getTitle(html: string): string | null {
	const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
	return match?.[1]?.trim() ?? null
}

export async function POST(request: Request) {
	try {
		const { url } = await request.json()
		if (!url || typeof url !== "string") {
			return NextResponse.json({ error: "URL is required" }, { status: 400 })
		}

		const type = detectType(url)
		const metadata: ExtractedMetadata = { type }

		// Type-specific extraction
		if (type === "youtube") {
			const videoId = extractYouTubeId(url)
			if (videoId) {
				metadata.embedUrl = `https://www.youtube.com/embed/${videoId}`
				metadata.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
			}
			metadata.siteName = "YouTube"
		}

		if (type === "tweet") {
			metadata.author = extractTweetAuthor(url)
			metadata.siteName = "X (Twitter)"
		}

		if (type === "image") {
			metadata.thumbnailUrl = url
			metadata.title = url.split("/").pop()?.split("?")[0] ?? "Image"
		}

		// Fetch OG metadata for tweets, youtube, links
		if (type !== "image" && type !== "video") {
			try {
				const response = await fetch(url, {
					headers: { "User-Agent": "bot" },
					signal: AbortSignal.timeout(5000),
					redirect: "follow",
				})
				if (response.ok) {
					const html = await response.text()
					metadata.title = metadata.title ?? getMetaContent(html, "og:title") ?? getTitle(html) ?? undefined
					metadata.description = getMetaContent(html, "og:description") ?? getMetaContent(html, "description") ?? undefined
					metadata.thumbnailUrl = metadata.thumbnailUrl ?? getMetaContent(html, "og:image") ?? undefined
					metadata.siteName = metadata.siteName ?? getMetaContent(html, "og:site_name") ?? undefined
					metadata.author = metadata.author ?? getMetaContent(html, "article:author") ?? undefined
				}
			} catch {
				// Fetch failed — return what we have from URL-based detection
			}
		}

		return NextResponse.json(metadata)
	} catch {
		return NextResponse.json({ error: "Failed to extract metadata" }, { status: 500 })
	}
}
```

**Step 2: Verify the API route compiles**

Run: `cd apps/ops && pnpm build`
Expected: Build succeeds (or at least no TS errors on the new file — `ignoreBuildErrors: true` is set).

**Step 3: Commit**

```bash
git add apps/ops/app/api/bookmarks/metadata/route.ts
git commit -m "feat(ops): add bookmark metadata extraction API route"
```

---

### Task 5: Add feature flag and navigation item

**Files:**
- Modify: `apps/ops/lib/features.ts`
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add `bookmarks` feature flag**

In `apps/ops/lib/features.ts`, add to the `features` object:

```ts
bookmarks: true,
```

And add to `routeMap`:

```ts
"/bookmarks": "bookmarks",
```

**Step 2: Add navigation item to OpsFrame**

In `apps/ops/components/ops-frame.tsx`:

1. Add `Bookmark` to the lucide-react import
2. Add nav item after the Notes entry (`{ title: "Notes", ... }`):

```ts
{ title: "Bookmarks", url: "/bookmarks", icon: Bookmark, flag: "bookmarks" },
```

**Step 3: Commit**

```bash
git add apps/ops/lib/features.ts apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add bookmarks feature flag and nav item"
```

---

### Task 6: Create bookmark form dialog component

**Files:**
- Create: `apps/ops/components/bookmark-form-dialog.tsx`

This dialog handles both "Add" and "Edit" modes. It:
- Takes a URL input (paste triggers metadata fetch)
- Shows a preview of the extracted metadata
- Lets user pick collection, tags, add notes
- Uses existing `TagInput` component for tags
- Uses `@blazz/ui` Dialog, Input, Button, Select, Textarea

**Step 1: Create the component**

The component should:
- Accept optional `bookmark` prop (edit mode) and `open`/`onOpenChange` props
- On URL paste/blur, call `/api/bookmarks/metadata` and populate fields
- Show thumbnail preview + title + description
- Collection select using `useQuery(api.bookmarkCollections.list)`
- Tag picker using `TagInput` with `useQuery(api.tags.list)` for suggestions
- Notes textarea
- On submit: call `useMutation(api.bookmarks.create)` or `api.bookmarks.update`

Implementation detail: follow the same pattern as `client-form.tsx` or `project-form.tsx` for form state. Use `react-hook-form` + `zod` per project conventions.

**Step 2: Commit**

```bash
git add apps/ops/components/bookmark-form-dialog.tsx
git commit -m "feat(ops): add bookmark form dialog component"
```

---

### Task 7: Create bookmark card component

**Files:**
- Create: `apps/ops/components/bookmark-card.tsx`

A card component with type-specific rendering:

- **Common**: thumbnail area (top), title, tags badges, pin indicator, 3-dot menu (pin, move, archive, edit, delete)
- **Tweet**: show author handle, tweet text, thumbnail if present
- **YouTube**: large thumbnail with play icon overlay, video title, channel name
- **Image**: full-bleed thumbnail, title overlay at bottom
- **Video**: thumbnail with play icon, title
- **Link**: thumbnail + favicon + title + truncated description + siteName

Use `@blazz/ui` Card, Badge, DropdownMenu components. The card links to `bookmark.url` via `target="_blank"`.

**Step 1: Create the component**

The component accepts:
- `bookmark` — the bookmark document from Convex
- `onEdit` — callback to open edit dialog
- `onArchive` / `onDelete` / `onPin` — action callbacks

**Step 2: Commit**

```bash
git add apps/ops/components/bookmark-card.tsx
git commit -m "feat(ops): add type-specific bookmark card component"
```

---

### Task 8: Create collection sidebar component

**Files:**
- Create: `apps/ops/components/bookmark-collections-sidebar.tsx`

A sidebar panel that shows:
- "All bookmarks" link (active when no collection filter)
- List of top-level collections, each expandable to show children
- "Archived" link at the bottom
- "+" button to create a new collection (inline input or small dialog)
- Right-click / menu on each collection: rename, change icon/color, delete

Uses `useQuery(api.bookmarkCollections.list)` and groups parent/children client-side.

**Step 1: Create the component**

Props:
- `activeCollectionId` — currently selected collection (or "all" or "archived")
- `onSelect` — callback when a collection is clicked

**Step 2: Commit**

```bash
git add apps/ops/components/bookmark-collections-sidebar.tsx
git commit -m "feat(ops): add bookmark collections sidebar component"
```

---

### Task 9: Create the bookmarks page

**Files:**
- Create: `apps/ops/app/(main)/bookmarks/page.tsx`
- Create: `apps/ops/app/(main)/bookmarks/_client.tsx`

**Step 1: Create the server page**

`page.tsx` — minimal server component:

```tsx
import BookmarksPageClient from "./_client"

export default function BookmarksPage() {
	return <BookmarksPageClient />
}
```

**Step 2: Create the client page**

`_client.tsx` — main bookmarks view:

- Uses `useAppTopBar` for breadcrumb: `[{ label: "Bookmarks" }]`
- State: `activeCollectionId`, `typeFilter`, `tagFilter`, `search`
- Layout: `BookmarkCollectionsSidebar` (left) + main area
- Toolbar: "Add bookmark" button, type filter pills (All / Tweet / YouTube / Image / Video / Link), tag dropdown, search input
- Grid: responsive CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) of `BookmarkCard` components
- Empty state when no bookmarks match filters
- Uses `useQuery(api.bookmarks.list, { collectionId, type, tag, archived, search })`
- "Add bookmark" opens `BookmarkFormDialog`

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/bookmarks/
git commit -m "feat(ops): add bookmarks page with grid view and filters"
```

---

### Task 10: Create collection management dialog

**Files:**
- Create: `apps/ops/components/collection-form-dialog.tsx`

Small dialog for creating/editing a collection:
- Name input
- Icon picker (emoji input or simple text field)
- Color picker (small palette of preset colors)
- Parent collection select (only shows top-level collections, hidden if editing a child)

Used by the "+" button in the sidebar and the "edit" action on collection context menu.

**Step 1: Create the component**

**Step 2: Commit**

```bash
git add apps/ops/components/collection-form-dialog.tsx
git commit -m "feat(ops): add collection form dialog component"
```

---

### Task 11: Wire everything together and test

**Files:**
- No new files — integration testing

**Step 1: Start the dev server**

Run: `pnpm dev:ops`

**Step 2: Manual smoke test checklist**

1. Navigate to `/bookmarks` — page loads, empty state shown
2. Create a collection "Design" — appears in sidebar
3. Create a sub-collection "UI" under "Design" — appears nested
4. Add a YouTube bookmark (paste URL) — metadata extracted, card shows with thumbnail + play overlay
5. Add a tweet bookmark (paste x.com URL) — author detected, card renders
6. Add a generic link — OG metadata extracted, card renders with site info
7. Filter by type (click "YouTube" pill) — only YouTube bookmarks shown
8. Filter by collection (click "Design") — only bookmarks in that collection
9. Add tags to a bookmark — tags shown as badges on card
10. Pin a bookmark — moves to top of grid
11. Archive a bookmark — disappears from main view, visible in "Archived"
12. Delete a bookmark — removed
13. Delete a collection — bookmarks unlinked (moved to "uncategorized")

**Step 3: Commit any fixes**

```bash
git add -u
git commit -m "fix(ops): bookmarks integration fixes"
```
