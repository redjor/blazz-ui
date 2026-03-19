# Curation Feed Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an automated tech watch feed to apps/ops that fetches YouTube videos and RSS articles, enriches them with GPT-4o-mini summaries/tags, and displays them in a chronological timeline.

**Architecture:** Convex scheduled functions (cron every 2h) fetch content from YouTube Data API v3 and RSS feeds, store normalized items in `feedSources`/`feedItems` tables, then async Convex actions enrich each new item via GPT-4o-mini. The UI is a simple timeline page at `/veille` with a sources management page at `/veille/sources`.

**Tech Stack:** Convex (schema, queries, mutations, actions, crons), YouTube Data API v3, fast-xml-parser (RSS), OpenAI GPT-4o-mini, Next.js 16 pages, @blazz/ui + @blazz/pro components.

---

### Task 1: Convex Schema — feedSources & feedItems tables

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add the two new tables to the schema**

Add after the `bookmarks` table definition:

```typescript
feedSources: defineTable({
  userId: v.id("users"),
  name: v.string(),
  type: v.union(v.literal("youtube"), v.literal("rss")),
  externalId: v.string(), // YouTube channel ID or RSS feed URL
  avatarUrl: v.optional(v.string()),
  lastFetchedAt: v.optional(v.number()),
  isActive: v.boolean(),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_type", ["userId", "type"])
  .index("by_user_active", ["userId", "isActive"]),

feedItems: defineTable({
  userId: v.id("users"),
  sourceId: v.id("feedSources"),
  externalId: v.string(), // YouTube video ID or article URL (for dedup)
  type: v.union(v.literal("youtube"), v.literal("rss")),
  title: v.string(),
  content: v.string(), // Video description or article excerpt
  url: v.string(),
  thumbnailUrl: v.optional(v.string()),
  publishedAt: v.number(),
  aiSummary: v.optional(v.string()),
  aiTags: v.optional(v.array(v.string())),
  isRead: v.boolean(),
  isFavorite: v.boolean(),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_type", ["userId", "type"])
  .index("by_source", ["sourceId"])
  .index("by_external", ["externalId"]),
```

**Step 2: Run Convex to validate schema**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add feedSources and feedItems tables to schema"
```

---

### Task 2: Convex CRUD — feedSources queries & mutations

**Files:**
- Create: `apps/ops/convex/feedSources.ts`

**Step 1: Create the feedSources Convex file**

```typescript
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const sourceTypeValidator = v.union(v.literal("youtube"), v.literal("rss"))

export const list = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db
      .query("feedSources")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    type: sourceTypeValidator,
    externalId: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx)
    const name = args.name.trim()
    if (!name) throw new ConvexError("Le nom est requis")
    const externalId = args.externalId.trim()
    if (!externalId) throw new ConvexError("L'identifiant est requis")

    return ctx.db.insert("feedSources", {
      userId,
      name,
      type: args.type,
      externalId,
      avatarUrl: args.avatarUrl,
      isActive: true,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id("feedSources"),
    name: v.optional(v.string()),
    externalId: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const { userId } = await requireAuth(ctx)
    const source = await ctx.db.get(id)
    if (!source || source.userId !== userId) throw new ConvexError("Introuvable")

    const patch: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) patch[key] = value
    }
    return ctx.db.patch(id, patch)
  },
})

export const remove = mutation({
  args: { id: v.id("feedSources") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const source = await ctx.db.get(id)
    if (!source || source.userId !== userId) throw new ConvexError("Introuvable")

    // Delete all items from this source
    const items = await ctx.db
      .query("feedItems")
      .withIndex("by_source", (q) => q.eq("sourceId", id))
      .collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }

    return ctx.db.delete(id)
  },
})
```

**Step 2: Validate**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions registered, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/feedSources.ts
git commit -m "feat(ops): add feedSources CRUD queries and mutations"
```

---

### Task 3: Convex CRUD — feedItems queries & mutations

**Files:**
- Create: `apps/ops/convex/feedItems.ts`

**Step 1: Create the feedItems Convex file**

```typescript
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const itemTypeValidator = v.union(v.literal("youtube"), v.literal("rss"))

export const list = query({
  args: {
    type: v.optional(itemTypeValidator),
    unreadOnly: v.optional(v.boolean()),
    favoritesOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, { type, unreadOnly, favoritesOnly }) => {
    const { userId } = await requireAuth(ctx)

    let results
    if (type) {
      results = await ctx.db
        .query("feedItems")
        .withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type))
        .collect()
    } else {
      results = await ctx.db
        .query("feedItems")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect()
    }

    if (unreadOnly) {
      results = results.filter((i) => !i.isRead)
    }

    if (favoritesOnly) {
      results = results.filter((i) => i.isFavorite)
    }

    return results.sort((a, b) => b.publishedAt - a.publishedAt)
  },
})

export const markRead = mutation({
  args: { id: v.id("feedItems") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const item = await ctx.db.get(id)
    if (!item || item.userId !== userId) throw new ConvexError("Introuvable")
    return ctx.db.patch(id, { isRead: true })
  },
})

export const toggleFavorite = mutation({
  args: { id: v.id("feedItems") },
  handler: async (ctx, { id }) => {
    const { userId } = await requireAuth(ctx)
    const item = await ctx.db.get(id)
    if (!item || item.userId !== userId) throw new ConvexError("Introuvable")
    return ctx.db.patch(id, { isFavorite: !item.isFavorite })
  },
})

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    const unread = await ctx.db
      .query("feedItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()

    for (const item of unread.filter((i) => !i.isRead)) {
      await ctx.db.patch(item._id, { isRead: true })
    }
  },
})

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = await requireAuth(ctx)
    const items = await ctx.db
      .query("feedItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
    return items.filter((i) => !i.isRead).length
  },
})
```

**Step 2: Validate**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions registered, no errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/feedItems.ts
git commit -m "feat(ops): add feedItems queries and mutations"
```

---

### Task 4: YouTube Fetcher — Convex action

**Files:**
- Create: `apps/ops/convex/feed.ts`

This file contains the fetching logic (Convex actions) and the internal mutations used by the cron.

**Step 1: Create the feed action file**

```typescript
import { v } from "convex/values"
import { action, internalAction, internalMutation } from "./_generated/server"
import { internal, api } from "./_generated/api"

// --- Internal mutation: insert a feed item if not duplicate ---

export const insertItemIfNew = internalMutation({
  args: {
    userId: v.id("users"),
    sourceId: v.id("feedSources"),
    externalId: v.string(),
    type: v.union(v.literal("youtube"), v.literal("rss")),
    title: v.string(),
    content: v.string(),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Dedup by externalId
    const existing = await ctx.db
      .query("feedItems")
      .withIndex("by_external", (q) => q.eq("externalId", args.externalId))
      .first()
    if (existing) return null

    const id = await ctx.db.insert("feedItems", {
      ...args,
      isRead: false,
      isFavorite: false,
      createdAt: Date.now(),
    })
    return id
  },
})

// --- Internal mutation: update lastFetchedAt on source ---

export const markSourceFetched = internalMutation({
  args: { id: v.id("feedSources") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { lastFetchedAt: Date.now() })
  },
})

// --- Internal mutation: save AI enrichment ---

export const saveEnrichment = internalMutation({
  args: {
    id: v.id("feedItems"),
    aiSummary: v.string(),
    aiTags: v.array(v.string()),
  },
  handler: async (ctx, { id, aiSummary, aiTags }) => {
    await ctx.db.patch(id, { aiSummary, aiTags })
  },
})

// --- YouTube fetcher action ---

export const fetchYouTubeChannel = internalAction({
  args: {
    userId: v.id("users"),
    sourceId: v.id("feedSources"),
    channelId: v.string(),
  },
  handler: async (ctx, { userId, sourceId, channelId }) => {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured")

    // 1. Search latest videos from channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${apiKey}`
    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) {
      throw new Error(`YouTube search API error: ${searchRes.status} ${await searchRes.text()}`)
    }
    const searchData = await searchRes.json()

    // 2. Insert each video
    const newItemIds: string[] = []
    for (const item of searchData.items ?? []) {
      const videoId = item.id?.videoId
      if (!videoId) continue

      const snippet = item.snippet
      const id = await ctx.runMutation(internal.feed.insertItemIfNew, {
        userId,
        sourceId,
        externalId: videoId,
        type: "youtube",
        title: snippet.title ?? "Sans titre",
        content: snippet.description ?? "",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.medium?.url,
        publishedAt: new Date(snippet.publishedAt).getTime(),
      })
      if (id) newItemIds.push(id)
    }

    // 3. Mark source as fetched
    await ctx.runMutation(internal.feed.markSourceFetched, { id: sourceId })

    // 4. Schedule AI enrichment for new items
    for (const itemId of newItemIds) {
      await ctx.scheduler.runAfter(0, internal.feed.enrichItem, {
        itemId: itemId as any,
      })
    }

    return { fetched: searchData.items?.length ?? 0, new: newItemIds.length }
  },
})

// --- RSS fetcher action ---

export const fetchRSSFeed = internalAction({
  args: {
    userId: v.id("users"),
    sourceId: v.id("feedSources"),
    feedUrl: v.string(),
  },
  handler: async (ctx, { userId, sourceId, feedUrl }) => {
    // 1. Fetch RSS XML
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "BlazzOps/1.0" },
    })
    if (!res.ok) {
      throw new Error(`RSS fetch error: ${res.status} ${await res.text()}`)
    }
    const xml = await res.text()

    // 2. Parse RSS/Atom manually (no external dep in Convex actions)
    const items = parseRSSItems(xml)

    // 3. Insert items (max 15 for first sync)
    const newItemIds: string[] = []
    for (const item of items.slice(0, 15)) {
      const id = await ctx.runMutation(internal.feed.insertItemIfNew, {
        userId,
        sourceId,
        externalId: item.url,
        type: "rss",
        title: item.title,
        content: item.content,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        publishedAt: item.publishedAt,
      })
      if (id) newItemIds.push(id)
    }

    // 4. Mark source as fetched
    await ctx.runMutation(internal.feed.markSourceFetched, { id: sourceId })

    // 5. Schedule AI enrichment for new items
    for (const itemId of newItemIds) {
      await ctx.scheduler.runAfter(0, internal.feed.enrichItem, {
        itemId: itemId as any,
      })
    }

    return { fetched: items.length, new: newItemIds.length }
  },
})

// --- AI enrichment action ---

export const enrichItem = internalAction({
  args: { itemId: v.id("feedItems") },
  handler: async (ctx, { itemId }) => {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return // Skip silently if no key

    // Read the item
    const item = await ctx.runQuery(internal.feed.getItemInternal, { id: itemId })
    if (!item || item.aiSummary) return // Already enriched

    const prompt = `Tu es un assistant de veille techno pour un développeur React/Next.js/TypeScript.

Contenu:
Titre: ${item.title}
Description: ${item.content.slice(0, 1000)}

Réponds en JSON strict:
{
  "summary": "Résumé en 2 phrases max, en français",
  "tags": ["tag1", "tag2", "tag3"] // 3-5 tags techniques en minuscules
}`

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      })

      if (!res.ok) {
        console.error(`OpenAI error: ${res.status}`)
        // Retry in 5 minutes
        await ctx.scheduler.runAfter(5 * 60 * 1000, internal.feed.enrichItem, { itemId })
        return
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) return

      const parsed = JSON.parse(content)
      await ctx.runMutation(internal.feed.saveEnrichment, {
        id: itemId,
        aiSummary: parsed.summary ?? "",
        aiTags: parsed.tags ?? [],
      })
    } catch (e) {
      console.error("Enrichment failed:", e)
      // Retry in 5 minutes
      await ctx.scheduler.runAfter(5 * 60 * 1000, internal.feed.enrichItem, { itemId })
    }
  },
})

// --- Internal query to read item from action ---

export const getItemInternal = internalQuery({
  args: { id: v.id("feedItems") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id)
  },
})

// --- Cron handler: fetch all active sources ---

export const fetchAllFeeds = internalAction({
  args: {},
  handler: async (ctx) => {
    // Get all active sources (internal query to bypass auth)
    const sources = await ctx.runQuery(internal.feed.listActiveSources)

    for (const source of sources) {
      try {
        if (source.type === "youtube") {
          await ctx.scheduler.runAfter(0, internal.feed.fetchYouTubeChannel, {
            userId: source.userId,
            sourceId: source._id,
            channelId: source.externalId,
          })
        } else if (source.type === "rss") {
          await ctx.scheduler.runAfter(0, internal.feed.fetchRSSFeed, {
            userId: source.userId,
            sourceId: source._id,
            feedUrl: source.externalId,
          })
        }
      } catch (e) {
        console.error(`Failed to schedule fetch for source ${source.name}:`, e)
      }
    }
  },
})

export const listActiveSources = internalQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("feedSources")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
  },
})

// --- Manual fetch trigger (user-facing action) ---

export const fetchNow = action({
  args: {},
  handler: async (ctx) => {
    // Trigger the same cron handler
    await ctx.scheduler.runAfter(0, internal.feed.fetchAllFeeds)
  },
})

// --- RSS parser (simple, no external dependency) ---

function parseRSSItems(xml: string): Array<{
  title: string
  content: string
  url: string
  thumbnailUrl?: string
  publishedAt: number
}> {
  const items: Array<{
    title: string
    content: string
    url: string
    thumbnailUrl?: string
    publishedAt: number
  }> = []

  // Try RSS 2.0 format first
  const rssItemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null

  while ((match = rssItemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(block, "title")
    const link = extractTag(block, "link") || extractAttr(block, "link", "href")
    const description = extractTag(block, "description") || extractTag(block, "content:encoded")
    const pubDate = extractTag(block, "pubDate") || extractTag(block, "dc:date")
    const thumbnail =
      extractAttr(block, "media:thumbnail", "url") ||
      extractAttr(block, "media:content", "url") ||
      extractAttr(block, "enclosure", "url")

    if (title && link) {
      items.push({
        title: stripHtml(title),
        content: stripHtml(description ?? "").slice(0, 500),
        url: link,
        thumbnailUrl: thumbnail,
        publishedAt: pubDate ? new Date(pubDate).getTime() : Date.now(),
      })
    }
  }

  // Try Atom format if no RSS items found
  if (items.length === 0) {
    const atomEntryRegex = /<entry>([\s\S]*?)<\/entry>/g
    while ((match = atomEntryRegex.exec(xml)) !== null) {
      const block = match[1]
      const title = extractTag(block, "title")
      const link = extractAttr(block, "link", "href")
      const summary = extractTag(block, "summary") || extractTag(block, "content")
      const updated = extractTag(block, "updated") || extractTag(block, "published")

      if (title && link) {
        items.push({
          title: stripHtml(title),
          content: stripHtml(summary ?? "").slice(0, 500),
          url: link,
          publishedAt: updated ? new Date(updated).getTime() : Date.now(),
        })
      }
    }
  }

  return items
}

function extractTag(xml: string, tag: string): string | undefined {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`)
  const cdataMatch = cdataRegex.exec(xml)
  if (cdataMatch) return cdataMatch[1].trim()

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
  const match = regex.exec(xml)
  return match ? match[1].trim() : undefined
}

function extractAttr(xml: string, tag: string, attr: string): string | undefined {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`)
  const match = regex.exec(xml)
  return match ? match[1] : undefined
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim()
}
```

**Important:** Add missing import at the top of the file:

```typescript
import { internalQuery } from "./_generated/server"
```

The full import line should be:
```typescript
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server"
```

**Step 2: Add YOUTUBE_API_KEY to Convex env vars**

Run: `cd apps/ops && npx convex env set YOUTUBE_API_KEY <your-key>`

Note: The user needs to create a Google Cloud project, enable YouTube Data API v3, and generate an API key at https://console.cloud.google.com/apis/credentials

Also ensure OPENAI_API_KEY is set in Convex:
Run: `cd apps/ops && npx convex env set OPENAI_API_KEY <your-key>`

**Step 3: Validate**

Run: `cd apps/ops && npx convex dev --once`
Expected: All functions registered.

**Step 4: Commit**

```bash
git add apps/ops/convex/feed.ts
git commit -m "feat(ops): add YouTube and RSS fetchers with AI enrichment"
```

---

### Task 5: Cron registration

**Files:**
- Modify: `apps/ops/convex/crons.ts`

**Step 1: Add the feed cron**

Current file has one cron for npm packages. Add the feed cron:

```typescript
import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval("sync npm packages", { minutes: 15 }, internal.packages.sync)
crons.interval("fetch all feeds", { hours: 2 }, internal.feed.fetchAllFeeds)

export default crons
```

**Step 2: Validate**

Run: `cd apps/ops && npx convex dev --once`
Expected: Cron registered.

**Step 3: Commit**

```bash
git add apps/ops/convex/crons.ts
git commit -m "feat(ops): add feed fetch cron every 2 hours"
```

---

### Task 6: Feature flag + Navigation

**Files:**
- Modify: `apps/ops/lib/features.ts`
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add the feature flag**

In `apps/ops/lib/features.ts`, add `veille: true` to the defaults object and `"/veille": "veille"` to the routeMap.

**Step 2: Add navigation item**

In `apps/ops/components/ops-frame.tsx`, add the "Veille" item to the "Outils" nav group:

```typescript
{ title: "Veille", url: "/veille", icon: Rss, flag: "veille" },
```

Import `Rss` from `lucide-react`.

**Step 3: Commit**

```bash
git add apps/ops/lib/features.ts apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add veille feature flag and navigation item"
```

---

### Task 7: Feed timeline page — `/veille`

**Files:**
- Create: `apps/ops/app/(main)/veille/page.tsx`
- Create: `apps/ops/app/(main)/veille/_client.tsx`
- Create: `apps/ops/components/feed-item-card.tsx`

**Step 1: Create the server page**

`apps/ops/app/(main)/veille/page.tsx`:

```typescript
import type { Metadata } from "next"
import VeilleClient from "./_client"

export const metadata: Metadata = { title: "Veille" }

export default function VeillePage() {
  return <VeilleClient />
}
```

**Step 2: Create the FeedItemCard component**

`apps/ops/components/feed-item-card.tsx`:

A card for each feed item showing: source avatar + name, time ago, title, AI summary (or skeleton), AI tags, favorite toggle. Opens the URL on click. Follows the @blazz/ui design skill:
- Uses `BlockStack`, `InlineStack`, `Box` for layout
- 13px body dense, text hierarchy (3 levels)
- Dot + text for source type
- Tags as small badges
- Favorite as star icon toggle
- Skeleton for AI summary when loading

```tsx
"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { ExternalLink, Rss, Star, Youtube } from "lucide-react"
import type { Doc } from "@/convex/_generated/dataModel"

interface FeedItemCardProps {
  item: Doc<"feedItems">
  sourceName?: string
  onToggleFavorite: () => void
  onMarkRead: () => void
}

export function FeedItemCard({ item, sourceName, onToggleFavorite, onMarkRead }: FeedItemCardProps) {
  const isYouTube = item.type === "youtube"
  const Icon = isYouTube ? Youtube : Rss

  return (
    <Box
      padding="4"
      background={item.isRead ? "app" : "surface"}
      border="default"
      borderRadius="lg"
      className="cursor-pointer transition-colors hover:border-fg-muted/25"
      onClick={() => {
        onMarkRead()
        window.open(item.url, "_blank", "noopener")
      }}
    >
      <BlockStack gap="200">
        {/* Header: source + time + favorite */}
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="150" blockAlign="center">
            <Icon className="size-3.5 text-fg-muted" />
            <span className="text-xs text-fg-muted">
              {sourceName ?? "—"}
            </span>
            <span className="text-xs text-fg-muted">·</span>
            <span className="text-xs text-fg-muted">
              {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true, locale: fr })}
            </span>
          </InlineStack>
          <InlineStack gap="100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              className="text-fg-muted hover:text-fg transition-colors"
            >
              <Star className={`size-3.5 ${item.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
            <ExternalLink className="size-3 text-fg-muted" />
          </InlineStack>
        </InlineStack>

        {/* Thumbnail for YouTube */}
        {isYouTube && item.thumbnailUrl && (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full rounded-md aspect-video object-cover"
          />
        )}

        {/* Title */}
        <span className={`text-sm font-medium leading-snug ${item.isRead ? "text-fg-muted" : "text-fg"}`}>
          {item.title}
        </span>

        {/* AI Summary */}
        {item.aiSummary ? (
          <p className="text-xs text-fg-secondary leading-relaxed line-clamp-2">
            {item.aiSummary}
          </p>
        ) : (
          <BlockStack gap="100">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </BlockStack>
        )}

        {/* AI Tags */}
        {item.aiTags && item.aiTags.length > 0 && (
          <InlineStack gap="100">
            {item.aiTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </InlineStack>
        )}
      </BlockStack>
    </Box>
  )
}
```

**Step 3: Create the client page**

`apps/ops/app/(main)/veille/_client.tsx`:

```tsx
"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useAction, useMutation, useQuery } from "convex/react"
import { CheckCheck, RefreshCw, Rss, Settings2, Youtube } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { FeedItemCard } from "@/components/feed-item-card"
import { api } from "@/convex/_generated/api"

type TypeFilter = "all" | "youtube" | "rss"

function FeedSkeleton() {
  return (
    <BlockStack gap="300">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-edge bg-surface p-4">
          <BlockStack gap="200">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <InlineStack gap="100">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-4 w-10 rounded-full" />
            </InlineStack>
          </BlockStack>
        </div>
      ))}
    </BlockStack>
  )
}

export default function VeilleClient() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [fetching, setFetching] = useState(false)

  // Queries
  const items = useQuery(api.feedItems.list, {
    type: typeFilter === "all" ? undefined : typeFilter,
  })
  const unreadCount = useQuery(api.feedItems.unreadCount)
  const sources = useQuery(api.feedSources.list)

  // Mutations
  const markRead = useMutation(api.feedItems.markRead)
  const toggleFavorite = useMutation(api.feedItems.toggleFavorite)
  const markAllRead = useMutation(api.feedItems.markAllRead)
  const fetchNow = useAction(api.feed.fetchNow)

  // Source name lookup
  const sourceMap = useMemo(() => {
    if (!sources) return new Map()
    return new Map(sources.map((s) => [s._id, s.name]))
  }, [sources])

  // Top bar
  const topBarActions = useMemo(
    () => (
      <InlineStack gap="100">
        <Link href="/veille/sources">
          <Button size="icon-sm" variant="ghost">
            <Settings2 className="size-4" />
          </Button>
        </Link>
      </InlineStack>
    ),
    []
  )
  useAppTopBar([{ label: "Veille" }], topBarActions)

  // Handlers
  const handleFetchNow = async () => {
    setFetching(true)
    try {
      await fetchNow()
      toast.success("Fetch lancé")
    } catch {
      toast.error("Erreur lors du fetch")
    } finally {
      setFetching(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead()
      toast.success("Tout marqué comme lu")
    } catch {
      toast.error("Erreur")
    }
  }

  const FILTERS: { value: TypeFilter; label: string; icon?: React.ElementType }[] = [
    { value: "all", label: "Tout" },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "rss", label: "RSS", icon: Rss },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-edge px-4 py-3">
        <Button size="sm" onClick={handleFetchNow} disabled={fetching}>
          <RefreshCw className={`size-3.5 mr-1.5 ${fetching ? "animate-spin" : ""}`} />
          Fetch now
        </Button>

        {unreadCount != null && unreadCount > 0 && (
          <Button size="sm" variant="ghost" onClick={handleMarkAllRead}>
            <CheckCheck className="size-3.5 mr-1.5" />
            Tout lire ({unreadCount})
          </Button>
        )}

        {/* Type filter pills */}
        <div className="flex items-center gap-1 ml-auto">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={typeFilter === f.value ? "default" : "outline"}
              onClick={() => setTypeFilter(f.value)}
            >
              {f.icon && <f.icon className="size-3 mr-1" />}
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Feed content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl">
          {/* Loading */}
          {items === undefined && <FeedSkeleton />}

          {/* Empty */}
          {items?.length === 0 && (
            <Empty
              icon={Rss}
              title="Aucun article"
              description={
                sources?.length === 0
                  ? "Ajoutez des sources pour commencer votre veille"
                  : "Aucun article pour le moment"
              }
              action={
                sources?.length === 0
                  ? {
                      label: "Ajouter des sources",
                      onClick: () => {},
                      href: "/veille/sources",
                      icon: Settings2,
                    }
                  : {
                      label: "Fetch now",
                      onClick: handleFetchNow,
                      icon: RefreshCw,
                    }
              }
            />
          )}

          {/* Items */}
          {items && items.length > 0 && (
            <BlockStack gap="300">
              {items.map((item) => (
                <FeedItemCard
                  key={item._id}
                  item={item}
                  sourceName={sourceMap.get(item.sourceId)}
                  onToggleFavorite={() => toggleFavorite({ id: item._id })}
                  onMarkRead={() => {
                    if (!item.isRead) markRead({ id: item._id })
                  }}
                />
              ))}
            </BlockStack>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add apps/ops/app/\(main\)/veille/ apps/ops/components/feed-item-card.tsx
git commit -m "feat(ops): add veille feed timeline page"
```

---

### Task 8: Sources management page — `/veille/sources`

**Files:**
- Create: `apps/ops/app/(main)/veille/sources/page.tsx`
- Create: `apps/ops/app/(main)/veille/sources/_client.tsx`
- Create: `apps/ops/components/source-form-dialog.tsx`

**Step 1: Create the server page**

`apps/ops/app/(main)/veille/sources/page.tsx`:

```typescript
import type { Metadata } from "next"
import SourcesClient from "./_client"

export const metadata: Metadata = { title: "Sources - Veille" }

export default function SourcesPage() {
  return <SourcesClient />
}
```

**Step 2: Create the source form dialog**

`apps/ops/components/source-form-dialog.tsx`:

Dialog with:
- Name field (text input)
- Type field (Select: YouTube / RSS)
- External ID field (text input, label changes based on type: "Channel ID" / "URL du flux RSS")
- Helper text explaining how to find a YouTube channel ID

```tsx
"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@blazz/ui/components/ui/select"
import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

interface SourceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  source?: Doc<"feedSources">
}

export function SourceFormDialog({ open, onOpenChange, source }: SourceFormDialogProps) {
  const isEdit = !!source
  const [name, setName] = useState(source?.name ?? "")
  const [type, setType] = useState<"youtube" | "rss">(source?.type ?? "youtube")
  const [externalId, setExternalId] = useState(source?.externalId ?? "")
  const [submitting, setSubmitting] = useState(false)

  const createSource = useMutation(api.feedSources.create)
  const updateSource = useMutation(api.feedSources.update)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateSource({ id: source._id, name, externalId })
      } else {
        await createSource({ name, type, externalId })
      }
      toast.success(isEdit ? "Source modifiée" : "Source ajoutée")
      onOpenChange(false)
      setName("")
      setExternalId("")
    } catch {
      toast.error("Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la source" : "Ajouter une source"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <BlockStack gap="400">
            <BlockStack gap="150">
              <Label htmlFor="source-name">Nom</Label>
              <Input
                id="source-name"
                placeholder="Ex: Theo - t3.gg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </BlockStack>

            {!isEdit && (
              <BlockStack gap="150">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as "youtube" | "rss")}
                  items={[
                    { value: "youtube", label: "YouTube" },
                    { value: "rss", label: "RSS" },
                  ]}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="rss">RSS</SelectItem>
                  </SelectContent>
                </Select>
              </BlockStack>
            )}

            <BlockStack gap="150">
              <Label htmlFor="source-id">
                {type === "youtube" ? "Channel ID" : "URL du flux RSS"}
              </Label>
              <Input
                id="source-id"
                placeholder={
                  type === "youtube"
                    ? "Ex: UCsBjURrPoezykLs9EqgamOA"
                    : "Ex: https://blog.example.com/rss.xml"
                }
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                required
              />
              {type === "youtube" && (
                <p className="text-xs text-fg-muted">
                  Trouvable dans l'URL de la chaîne : youtube.com/channel/[CHANNEL_ID]
                </p>
              )}
            </BlockStack>
          </BlockStack>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "..." : isEdit ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 3: Create the sources client page**

`apps/ops/app/(main)/veille/sources/_client.tsx`:

```tsx
"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Switch } from "@blazz/ui/components/ui/switch"
import { useMutation, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Plus, Rss, Trash2, Youtube } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { SourceFormDialog } from "@/components/source-form-dialog"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

export default function SourcesClient() {
  const [addOpen, setAddOpen] = useState(false)
  const [editSource, setEditSource] = useState<Doc<"feedSources"> | undefined>()

  const sources = useQuery(api.feedSources.list)
  const updateSource = useMutation(api.feedSources.update)
  const removeSource = useMutation(api.feedSources.remove)

  useAppTopBar([{ label: "Veille", href: "/veille" }, { label: "Sources" }])

  const handleToggleActive = async (source: Doc<"feedSources">) => {
    try {
      await updateSource({ id: source._id, isActive: !source.isActive })
      toast.success(source.isActive ? "Source désactivée" : "Source activée")
    } catch {
      toast.error("Erreur")
    }
  }

  const handleDelete = async (source: Doc<"feedSources">) => {
    if (!window.confirm(`Supprimer "${source.name}" et tous ses articles ?`)) return
    try {
      await removeSource({ id: source._id })
      toast.success("Source supprimée")
    } catch {
      toast.error("Erreur")
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-edge px-4 py-3">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-3.5 mr-1.5" />
          Ajouter
        </Button>
        <span className="text-xs text-fg-muted ml-auto">
          {sources?.length ?? 0} source{(sources?.length ?? 0) > 1 ? "s" : ""}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl">
          {/* Loading */}
          {sources === undefined && (
            <BlockStack gap="300">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </BlockStack>
          )}

          {/* Empty */}
          {sources?.length === 0 && (
            <Empty
              icon={Rss}
              title="Aucune source"
              description="Ajoutez des chaînes YouTube ou des flux RSS"
              action={{
                label: "Ajouter une source",
                onClick: () => setAddOpen(true),
                icon: Plus,
              }}
            />
          )}

          {/* Source list */}
          {sources && sources.length > 0 && (
            <BlockStack gap="200">
              {sources.map((source) => {
                const Icon = source.type === "youtube" ? Youtube : Rss
                return (
                  <Box
                    key={source._id}
                    padding="4"
                    background="surface"
                    border="default"
                    borderRadius="lg"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="300" blockAlign="center">
                        <Icon className="size-4 text-fg-muted" />
                        <BlockStack gap="050">
                          <button
                            type="button"
                            onClick={() => setEditSource(source)}
                            className="text-sm font-medium text-fg hover:underline text-left"
                          >
                            {source.name}
                          </button>
                          <InlineStack gap="150">
                            <Badge variant="secondary" className="text-[10px]">
                              {source.type === "youtube" ? "YouTube" : "RSS"}
                            </Badge>
                            {source.lastFetchedAt && (
                              <span className="text-xs text-fg-muted">
                                Sync {formatDistanceToNow(new Date(source.lastFetchedAt), { addSuffix: true, locale: fr })}
                              </span>
                            )}
                          </InlineStack>
                        </BlockStack>
                      </InlineStack>

                      <InlineStack gap="200" blockAlign="center">
                        <Switch
                          checked={source.isActive}
                          onCheckedChange={() => handleToggleActive(source)}
                        />
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleDelete(source)}
                          className="text-fg-muted hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </InlineStack>
                    </InlineStack>
                  </Box>
                )
              })}
            </BlockStack>
          )}
        </div>
      </div>

      {/* Form dialog */}
      <SourceFormDialog
        open={addOpen || !!editSource}
        onOpenChange={(open) => {
          if (!open) {
            setAddOpen(false)
            setEditSource(undefined)
          }
        }}
        source={editSource}
      />
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add apps/ops/app/\(main\)/veille/sources/ apps/ops/components/source-form-dialog.tsx
git commit -m "feat(ops): add sources management page for veille"
```

---

### Task 9: Integration test — End-to-end smoke test

**Files:** No new files

**Step 1: Start the dev servers**

Run: `cd apps/ops && npx convex dev` (in one terminal)
Run: `pnpm dev:ops` (in another terminal)

**Step 2: Manual smoke test**

1. Navigate to `/veille/sources`
2. Add a YouTube source (e.g., name: "Fireship", channel ID: `UCsBjURrPoezykLs9EqgamOA`)
3. Add an RSS source (e.g., name: "Kent C. Dodds", URL: `https://kentcdodds.com/blog/rss.xml`)
4. Navigate to `/veille`
5. Click "Fetch now"
6. Verify items appear in the timeline
7. Verify AI summaries populate after a few seconds
8. Verify favorite toggle works
9. Verify items are marked read on click
10. Verify "Tout lire" button works

**Step 3: Fix any issues found during testing**

**Step 4: Final commit if fixes were needed**

```bash
git commit -m "fix(ops): address issues found during veille smoke test"
```

---

## Summary

| Task | Description | Est. |
|------|-------------|------|
| 1 | Schema: feedSources + feedItems tables | 5 min |
| 2 | CRUD: feedSources queries/mutations | 5 min |
| 3 | CRUD: feedItems queries/mutations | 5 min |
| 4 | YouTube + RSS fetchers + AI enrichment | 15 min |
| 5 | Cron registration | 2 min |
| 6 | Feature flag + navigation | 3 min |
| 7 | Feed timeline page UI | 10 min |
| 8 | Sources management page UI | 10 min |
| 9 | Smoke test | 10 min |

**Prerequisites:**
- YouTube Data API v3 key (Google Cloud Console)
- OpenAI API key set in Convex env vars
- Convex dev server running
