# Notifications Inbox — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Centralized notification inbox in apps/ops that receives webhooks from GitHub, Vercel, and Convex, stores them in a Convex table, and displays them using the `@blazz/pro` Inbox block.

**Architecture:** Webhook HTTP endpoints in `convex/http.ts` receive events, validate signatures, and insert into a `notifications` table via internal mutations. A `/notifications` page uses the Inbox block with real-time Convex subscriptions. A weekly cron purges archived notifications > 30 days.

**Tech Stack:** Convex (schema, HTTP actions, crons, internal mutations), `@blazz/pro` Inbox block, Next.js 16, lucide-react, date-fns

**Design doc:** `docs/plans/2026-03-19-notifications-inbox-design.md`

---

### Task 1: Schema — Add `notifications` table

**Files:**
- Modify: `apps/ops/convex/schema.ts:323` (add table before closing `})`)

**Step 1: Add the notifications table definition**

Insert before line 324 (`})`) in schema.ts:

```typescript
	notifications: defineTable({
		userId: v.string(),
		source: v.union(v.literal("github"), v.literal("vercel"), v.literal("convex")),
		externalId: v.string(),
		title: v.string(),
		description: v.string(),
		actionType: v.string(),
		status: v.optional(v.string()),
		priority: v.optional(v.string()),
		authorName: v.string(),
		authorInitials: v.string(),
		authorColor: v.optional(v.string()),
		authorAvatar: v.optional(v.string()),
		url: v.optional(v.string()),
		read: v.boolean(),
		archivedAt: v.optional(v.number()),
		createdAt: v.number(),
	})
		.index("by_user_date", ["userId", "createdAt"])
		.index("by_user_read", ["userId", "read"])
		.index("by_user_source", ["userId", "source"])
		.index("by_source_external", ["source", "externalId"]),
```

**Step 2: Push schema to Convex**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed, `notifications` table created.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add notifications table to Convex schema"
```

---

### Task 2: Convex functions — queries and mutations

**Files:**
- Create: `apps/ops/convex/notifications.ts`

**Step 1: Create the notifications module**

Create `apps/ops/convex/notifications.ts`:

```typescript
import { v } from "convex/values"
import { mutation, query, internalMutation } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const list = query({
	args: {
		source: v.optional(v.string()),
		read: v.optional(v.boolean()),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, { source, read, limit = 50 }) => {
		const { userId } = await requireAuth(ctx)

		let q = ctx.db
			.query("notifications")
			.withIndex("by_user_date", (q) => q.eq("userId", userId))
			.order("desc")

		const results = await q.collect()

		return results
			.filter((n) => n.archivedAt === undefined)
			.filter((n) => (source ? n.source === source : true))
			.filter((n) => (read !== undefined ? n.read === read : true))
			.slice(0, limit)
	},
})

export const unreadCount = query({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		const results = await ctx.db
			.query("notifications")
			.withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
			.collect()

		return results.filter((n) => n.archivedAt === undefined).length
	},
})

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export const markRead = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const notification = await ctx.db.get(id)
		if (!notification || notification.userId !== userId) throw new Error("Not found")
		await ctx.db.patch(id, { read: true })
	},
})

export const markAllRead = mutation({
	args: { source: v.optional(v.string()) },
	handler: async (ctx, { source }) => {
		const { userId } = await requireAuth(ctx)

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", false))
			.collect()

		const toUpdate = unread.filter((n) => (source ? n.source === source : true))
		for (const n of toUpdate) {
			await ctx.db.patch(n._id, { read: true })
		}
	},
})

export const archive = mutation({
	args: { id: v.id("notifications") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const notification = await ctx.db.get(id)
		if (!notification || notification.userId !== userId) throw new Error("Not found")
		await ctx.db.patch(id, { archivedAt: Date.now() })
	},
})

export const archiveAllRead = mutation({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)

		const read = await ctx.db
			.query("notifications")
			.withIndex("by_user_read", (q) => q.eq("userId", userId).eq("read", true))
			.collect()

		const toArchive = read.filter((n) => n.archivedAt === undefined)
		for (const n of toArchive) {
			await ctx.db.patch(n._id, { archivedAt: Date.now() })
		}
	},
})

// ---------------------------------------------------------------------------
// Internal (webhook handlers call these)
// ---------------------------------------------------------------------------

export const internalCreate = internalMutation({
	args: {
		userId: v.string(),
		source: v.union(v.literal("github"), v.literal("vercel"), v.literal("convex")),
		externalId: v.string(),
		title: v.string(),
		description: v.string(),
		actionType: v.string(),
		status: v.optional(v.string()),
		priority: v.optional(v.string()),
		authorName: v.string(),
		authorInitials: v.string(),
		authorColor: v.optional(v.string()),
		authorAvatar: v.optional(v.string()),
		url: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Idempotence: check if already exists
		const existing = await ctx.db
			.query("notifications")
			.withIndex("by_source_external", (q) =>
				q.eq("source", args.source).eq("externalId", args.externalId)
			)
			.first()

		if (existing) return existing._id

		return ctx.db.insert("notifications", {
			...args,
			read: false,
			createdAt: Date.now(),
		})
	},
})

export const cleanupOld = internalMutation({
	args: {},
	handler: async (ctx) => {
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
		const all = await ctx.db.query("notifications").collect()
		const toDelete = all.filter(
			(n) => n.archivedAt !== undefined && n.archivedAt < thirtyDaysAgo
		)
		for (const n of toDelete) {
			await ctx.db.delete(n._id)
		}
	},
})
```

**Step 2: Push to verify compilation**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions pushed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/notifications.ts
git commit -m "feat(ops): add notification queries, mutations, and internal create"
```

---

### Task 3: Cron — Weekly purge of old archived notifications

**Files:**
- Modify: `apps/ops/convex/crons.ts:8` (add before export)

**Step 1: Add the cron job**

Insert at line 8, before `export default crons`:

```typescript
crons.weekly("purge old notifications", { dayOfWeek: "sunday", hourUTC: 3, minuteUTC: 0 }, internal.notifications.cleanupOld)
```

**Step 2: Push to verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: Cron registered.

**Step 3: Commit**

```bash
git add apps/ops/convex/crons.ts
git commit -m "feat(ops): add weekly cron to purge old archived notifications"
```

---

### Task 4: Webhook handlers — GitHub, Vercel, Convex

**Files:**
- Modify: `apps/ops/convex/http.ts:55` (add webhook routes after Telegram handler)
- Create: `apps/ops/convex/lib/webhooks.ts` (shared helpers: signature verification, initials generation)

**Step 1: Create webhook helpers**

Create `apps/ops/convex/lib/webhooks.ts`:

```typescript
import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Verify GitHub webhook signature (HMAC-SHA256).
 */
export function verifyGitHubSignature(
	payload: string,
	signature: string | null,
	secret: string
): boolean {
	if (!signature) return false
	const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`
	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
	} catch {
		return false
	}
}

/**
 * Verify Vercel webhook signature (HMAC-SHA1).
 */
export function verifyVercelSignature(
	payload: string,
	signature: string | null,
	secret: string
): boolean {
	if (!signature) return false
	const expected = createHmac("sha1", secret).update(payload).digest("hex")
	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
	} catch {
		return false
	}
}

/**
 * Generate 2-letter initials from a name or username.
 */
export function initialsFrom(name: string): string {
	const parts = name.replace(/\[bot\]$/, "").split(/[\s\-_]+/).filter(Boolean)
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
	return name.slice(0, 2).toUpperCase()
}
```

**Step 2: Add GitHub webhook handler to http.ts**

Insert after line 55 (after Telegram webhook block) in `convex/http.ts`:

```typescript
// GitHub webhook
http.route({
	path: "/webhooks/github",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const { verifyGitHubSignature, initialsFrom } = await import("./lib/webhooks")

		const secret = process.env.GITHUB_WEBHOOK_SECRET
		if (!secret) return new Response("Not configured", { status: 500 })

		const body = await request.text()
		const signature = request.headers.get("x-hub-signature-256")
		if (!verifyGitHubSignature(body, signature, secret)) {
			return new Response("Invalid signature", { status: 401 })
		}

		const event = request.headers.get("x-github-event")
		const payload = JSON.parse(body)
		const userId = process.env.OPS_USER_ID
		if (!userId) return new Response("User not configured", { status: 500 })

		let title = ""
		let description = ""
		let actionType = "comment"
		let status: string | undefined
		let priority: string | undefined
		let url: string | undefined
		let externalId = ""

		const sender = payload.sender ?? {}
		const authorName = sender.login ?? "GitHub"
		const authorAvatar = sender.avatar_url

		if (event === "pull_request" && payload.action) {
			const pr = payload.pull_request
			externalId = `gh-pr-${pr.id}-${payload.action}`
			title = `PR #${pr.number} ${payload.action}`
			description = pr.title
			url = pr.html_url
			actionType = payload.action === "review_requested" ? "mention" : "comment"
			if (payload.action === "opened") status = "in-progress"
			if (payload.action === "closed" && pr.merged) status = "done"
			if (payload.action === "closed" && !pr.merged) status = "cancelled"
		} else if (event === "issue_comment") {
			const comment = payload.comment
			externalId = `gh-comment-${comment.id}`
			title = `Comment on #${payload.issue.number}`
			description = comment.body?.slice(0, 200) ?? ""
			url = comment.html_url
			actionType = "comment"
		} else if (event === "pull_request_review") {
			const review = payload.review
			externalId = `gh-review-${review.id}`
			title = `Review on PR #${payload.pull_request.number}`
			description = review.body?.slice(0, 200) ?? review.state
			url = review.html_url
			actionType = "reply"
			if (review.state === "changes_requested") priority = "high"
		} else if (event === "check_run" && payload.check_run?.conclusion === "failure") {
			const check = payload.check_run
			externalId = `gh-check-${check.id}`
			title = `CI failed: ${check.name}`
			description = check.output?.title ?? "Check run failed"
			url = check.html_url
			actionType = "mention"
			priority = "high"
			status = "urgent"
		} else if (event === "push") {
			externalId = `gh-push-${payload.after}`
			const branch = payload.ref.replace("refs/heads/", "")
			title = `Push to ${branch}`
			description = payload.head_commit?.message?.slice(0, 200) ?? ""
			url = payload.head_commit?.url
			actionType = "added"
		} else {
			return new Response("OK", { status: 200 })
		}

		await ctx.runMutation(internal.notifications.internalCreate, {
			userId,
			source: "github",
			externalId,
			title,
			description,
			actionType,
			status,
			priority,
			authorName,
			authorInitials: initialsFrom(authorName),
			authorAvatar,
			url,
		})

		return new Response("OK", { status: 200 })
	}),
})
```

**Step 3: Add Vercel webhook handler**

Insert after the GitHub webhook block in `convex/http.ts`:

```typescript
// Vercel webhook
http.route({
	path: "/webhooks/vercel",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const { verifyVercelSignature, initialsFrom } = await import("./lib/webhooks")

		const secret = process.env.VERCEL_WEBHOOK_SECRET
		if (!secret) return new Response("Not configured", { status: 500 })

		const body = await request.text()
		const signature = request.headers.get("x-vercel-signature")
		if (!verifyVercelSignature(body, signature, secret)) {
			return new Response("Invalid signature", { status: 401 })
		}

		const payload = JSON.parse(body)
		const userId = process.env.OPS_USER_ID
		if (!userId) return new Response("User not configured", { status: 500 })

		const deployment = payload.payload?.deployment ?? {}
		const type = payload.type ?? ""
		const externalId = `vercel-${deployment.id ?? payload.id}-${type}`

		let title = ""
		let description = deployment.meta?.githubCommitMessage?.slice(0, 200) ?? ""
		let status: string | undefined
		let priority: string | undefined
		const url = deployment.inspectorUrl ?? deployment.url
			? `https://${deployment.url}`
			: undefined
		const branch = deployment.meta?.githubCommitRef ?? "unknown"
		const authorName = deployment.meta?.githubCommitAuthorName ?? "Vercel"

		if (type === "deployment.created") {
			title = `Deploy started on ${branch}`
			status = "in-progress"
		} else if (type === "deployment.succeeded") {
			title = `Deploy succeeded on ${branch}`
			status = "done"
		} else if (type === "deployment.error") {
			title = `Deploy failed on ${branch}`
			status = "urgent"
			priority = "high"
		} else if (type === "deployment.cancelled") {
			title = `Deploy cancelled on ${branch}`
			status = "cancelled"
		} else {
			return new Response("OK", { status: 200 })
		}

		await ctx.runMutation(internal.notifications.internalCreate, {
			userId,
			source: "vercel",
			externalId,
			title,
			description,
			actionType: "added",
			status,
			priority,
			authorName,
			authorInitials: initialsFrom(authorName),
			url,
		})

		return new Response("OK", { status: 200 })
	}),
})
```

**Step 4: Add Convex webhook handler**

Insert after the Vercel webhook block in `convex/http.ts`:

```typescript
// Convex webhook (custom — for future use or manual triggers)
http.route({
	path: "/webhooks/convex",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const { initialsFrom } = await import("./lib/webhooks")

		const secret = process.env.CONVEX_WEBHOOK_SECRET
		if (!secret) return new Response("Not configured", { status: 500 })

		const headerSecret = request.headers.get("x-convex-webhook-secret")
		if (headerSecret !== secret) {
			return new Response("Invalid secret", { status: 401 })
		}

		const userId = process.env.OPS_USER_ID
		if (!userId) return new Response("User not configured", { status: 500 })

		let payload: {
			externalId: string
			title: string
			description: string
			status?: string
			priority?: string
			url?: string
		}
		try {
			payload = await request.json()
		} catch {
			return new Response("Bad Request", { status: 400 })
		}

		await ctx.runMutation(internal.notifications.internalCreate, {
			userId,
			source: "convex",
			externalId: payload.externalId,
			title: payload.title,
			description: payload.description,
			actionType: "mention",
			status: payload.status,
			priority: payload.priority,
			authorName: "Convex",
			authorInitials: "CX",
			authorColor: "#f97316",
			url: payload.url,
		})

		return new Response("OK", { status: 200 })
	}),
})
```

**Step 5: Add `internal` import for notifications**

The existing import `import { internal } from "./_generated/api"` already covers it — Convex auto-generates the api reference when `notifications.ts` exists.

**Step 6: Push to verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: HTTP routes registered.

**Step 7: Commit**

```bash
git add apps/ops/convex/lib/webhooks.ts apps/ops/convex/http.ts
git commit -m "feat(ops): add GitHub, Vercel, and Convex webhook handlers"
```

---

### Task 5: Feature flag + sidebar navigation

**Files:**
- Modify: `apps/ops/lib/features.ts:18` (add flag)
- Modify: `apps/ops/lib/features.ts:45` (add route)
- Modify: `apps/ops/components/ops-frame.tsx:4-21` (add Bell icon)
- Modify: `apps/ops/components/ops-frame.tsx:69` (add nav item in "Outils" group)

**Step 1: Add feature flag**

In `apps/ops/lib/features.ts`, add `notifications: true` at line 18 (before `veille: true`):

```typescript
	notifications: true,
```

And add route mapping at line 45 (before the closing `}`):

```typescript
	"/notifications": "notifications",
```

**Step 2: Add sidebar nav item**

In `apps/ops/components/ops-frame.tsx`:

Add `Bell` to the lucide-react import (line 4):

```typescript
import {
	Banknote,
	Bell,
	Bookmark,
	// ... rest unchanged
```

Add nav item in the "Outils" group after Chat (line 70):

```typescript
			{ title: "Notifications", url: "/notifications", icon: Bell, flag: "notifications" },
```

**Step 3: Commit**

```bash
git add apps/ops/lib/features.ts apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add notifications feature flag and sidebar nav item"
```

---

### Task 6: UI — Notifications page

**Files:**
- Create: `apps/ops/app/(main)/notifications/page.tsx`
- Create: `apps/ops/app/(main)/notifications/_client.tsx`
- Create: `apps/ops/components/notification-detail.tsx`
- Create: `apps/ops/lib/notifications.ts` (mapper helper)

**Step 1: Create the mapper helper**

Create `apps/ops/lib/notifications.ts`:

```typescript
import type { InboxNotification } from "@blazz/pro/components/blocks/inbox"
import { formatDistanceToNowStrict } from "date-fns"

type ConvexNotification = {
	_id: string
	title: string
	description: string
	actionType: string
	status?: string
	priority?: string
	authorName: string
	authorInitials: string
	authorColor?: string
	authorAvatar?: string
	time?: string
	read?: boolean
	createdAt: number
}

const actionTypeMap: Record<string, InboxNotification["actionType"]> = {
	comment: "comment",
	reply: "reply",
	reaction: "reaction",
	mention: "mention",
	added: "added",
}

export function toInboxNotification(n: ConvexNotification): InboxNotification {
	return {
		id: n._id,
		title: n.title,
		description: n.description,
		actionType: actionTypeMap[n.actionType] ?? "comment",
		status: (n.status as InboxNotification["status"]) ?? "default",
		priority: (n.priority as InboxNotification["priority"]) ?? "none",
		author: {
			name: n.authorName,
			initials: n.authorInitials,
			color: n.authorColor,
			avatarUrl: n.authorAvatar,
		},
		time: formatDistanceToNowStrict(new Date(n.createdAt), { addSuffix: false })
			.replace(" seconds", "s")
			.replace(" second", "s")
			.replace(" minutes", "m")
			.replace(" minute", "m")
			.replace(" hours", "h")
			.replace(" hour", "h")
			.replace(" days", "d")
			.replace(" day", "d"),
		read: n.read ?? false,
	}
}
```

**Step 2: Create the server page**

Create `apps/ops/app/(main)/notifications/page.tsx`:

```tsx
import type { Metadata } from "next"
import NotificationsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Notifications",
}

export default function NotificationsPage() {
	return <NotificationsPageClient />
}
```

**Step 3: Create the client page**

Create `apps/ops/app/(main)/notifications/_client.tsx`:

```tsx
"use client"

import { useQuery, useMutation } from "convex/react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import {
	Inbox,
	InboxSidebar,
	InboxDetail,
	InboxHeader,
	InboxPanel,
	InboxList,
	InboxItem,
	InboxDetailEmpty,
	filterInboxItems,
	type InboxFilters,
	type InboxNotification,
} from "@blazz/pro/components/blocks/inbox"
import { toInboxNotification } from "@/lib/notifications"
import { NotificationDetail } from "@/components/notification-detail"

export default function NotificationsPageClient() {
	const notifications = useQuery(api.notifications.list, {})
	const markRead = useMutation(api.notifications.markRead)
	const markAllReadMutation = useMutation(api.notifications.markAllRead)
	const archiveAllReadMutation = useMutation(api.notifications.archiveAllRead)

	const [selectedId, setSelectedId] = useState<Id<"notifications"> | null>(null)
	const [filters, setFilters] = useState<InboxFilters>({})
	const [sourceFilter, setSourceFilter] = useState<string | null>(null)

	const isLoading = notifications === undefined

	const items: InboxNotification[] = (notifications ?? []).map(toInboxNotification)
	const filteredBySource = sourceFilter
		? items.filter((item) => {
				const original = notifications?.find((n) => n._id === item.id)
				return original?.source === sourceFilter
			})
		: items
	const filtered = filterInboxItems(filteredBySource, filters)

	const selectedNotification = notifications?.find((n) => n._id === selectedId)

	function handleSelect(item: InboxNotification) {
		const id = item.id as Id<"notifications">
		setSelectedId(id)
		const original = notifications?.find((n) => n._id === id)
		if (original && !original.read) {
			markRead({ id })
		}
	}

	function handleMarkAllRead() {
		markAllReadMutation(sourceFilter ? { source: sourceFilter } : {})
	}

	function handleArchiveAllRead() {
		archiveAllReadMutation({})
	}

	const sources = ["github", "vercel", "convex"] as const

	return (
		<Inbox className="h-[calc(100vh-3.5rem)]">
			<InboxSidebar width={380}>
				{/* Source filter chips */}
				<div className="flex items-center gap-1 px-3 pt-2">
					<button
						type="button"
						onClick={() => setSourceFilter(null)}
						className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
							sourceFilter === null
								? "bg-brand/15 text-brand"
								: "bg-fg/5 text-fg-muted hover:bg-fg/10"
						}`}
					>
						All
					</button>
					{sources.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setSourceFilter(sourceFilter === s ? null : s)}
							className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-colors cursor-pointer ${
								sourceFilter === s
									? "bg-brand/15 text-brand"
									: "bg-fg/5 text-fg-muted hover:bg-fg/10"
							}`}
						>
							{s}
						</button>
					))}
				</div>

				<InboxHeader
					title="Notifications"
					filters={filters}
					onFiltersChange={setFilters}
					menuActions={[
						{ label: "Mark all read", onClick: handleMarkAllRead },
						{ label: "Archive all read", onClick: handleArchiveAllRead },
					]}
				/>
				<InboxPanel loading={isLoading}>
					<InboxList>
						{filtered.map((item) => (
							<InboxItem
								key={item.id}
								item={item}
								selected={selectedId === item.id}
								onClick={handleSelect}
							/>
						))}
					</InboxList>
				</InboxPanel>
			</InboxSidebar>
			<InboxDetail>
				{selectedNotification ? (
					<NotificationDetail notification={selectedNotification} />
				) : (
					<InboxDetailEmpty />
				)}
			</InboxDetail>
		</Inbox>
	)
}
```

**Step 4: Create NotificationDetail component**

Create `apps/ops/components/notification-detail.tsx`:

```tsx
"use client"

import { useMutation } from "convex/react"
import { ExternalLink, Archive } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"
import { Button } from "@blazz/ui"
import { Badge } from "@blazz/ui"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

const sourceBadgeVariant: Record<string, "default" | "success" | "info"> = {
	github: "default",
	vercel: "info",
	convex: "success",
}

export function NotificationDetail({ notification }: { notification: Doc<"notifications"> }) {
	const archiveMutation = useMutation(api.notifications.archive)

	const timeAgo = formatDistanceToNowStrict(new Date(notification.createdAt), {
		addSuffix: true,
	})

	return (
		<BlockStack gap="400" className="p-6">
			{/* Header */}
			<BlockStack gap="200">
				<InlineStack gap="200" blockAlign="center">
					<Badge variant={sourceBadgeVariant[notification.source] ?? "default"}>
						{notification.source}
					</Badge>
					<span className="text-xs text-fg-muted">{timeAgo}</span>
				</InlineStack>
				<h2 className="text-lg font-semibold text-fg">{notification.title}</h2>
			</BlockStack>

			{/* Body */}
			<p className="text-sm text-fg-muted leading-relaxed">{notification.description}</p>

			{/* Author */}
			<InlineStack gap="200" blockAlign="center">
				{notification.authorAvatar ? (
					<img
						src={notification.authorAvatar}
						alt={notification.authorName}
						className="size-5 rounded-full"
					/>
				) : (
					<div
						className="flex size-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
						style={{ backgroundColor: notification.authorColor ?? "#6b7280" }}
					>
						{notification.authorInitials}
					</div>
				)}
				<span className="text-xs text-fg-muted">{notification.authorName}</span>
			</InlineStack>

			{/* Actions */}
			<InlineStack gap="200">
				{notification.url && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.open(notification.url!, "_blank")}
					>
						<ExternalLink className="mr-1.5 size-3.5" />
						Open in {notification.source}
					</Button>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => archiveMutation({ id: notification._id })}
				>
					<Archive className="mr-1.5 size-3.5" />
					Archive
				</Button>
			</InlineStack>
		</BlockStack>
	)
}
```

**Step 5: Verify the app builds**

Run: `cd apps/ops && pnpm build`
Expected: Build succeeds.

**Step 6: Commit**

```bash
git add apps/ops/app/\(main\)/notifications/ apps/ops/components/notification-detail.tsx apps/ops/lib/notifications.ts
git commit -m "feat(ops): add notifications inbox page with Inbox block"
```

---

### Task 7: Unread badge in sidebar

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx` (add unread count badge next to Notifications nav item)

**Step 1: Add unread count query**

In `apps/ops/components/ops-frame.tsx`, import and use the unread count:

After the existing imports, add:
```typescript
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
```

Inside the `OpsFrame` component, before the `useMemo`:
```typescript
const unreadCount = useQuery(api.notifications.unreadCount)
```

In the "Outils" group, update the Notifications nav item to include a badge suffix:
```typescript
{
	title: unreadCount ? `Notifications (${unreadCount})` : "Notifications",
	url: "/notifications",
	icon: Bell,
	flag: "notifications",
},
```

> Note: If `AppFrame` supports a `badge` prop on nav items, use that instead. Otherwise the count-in-title approach works.

**Step 2: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): show unread notification count in sidebar"
```

---

### Task 8: Environment variables documentation

**Files:**
- Modify: `apps/ops/.env.example` (or create if it doesn't exist)

**Step 1: Document required env vars**

Add to `.env.example`:

```bash
# Notification webhooks
GITHUB_WEBHOOK_SECRET=         # Secret for GitHub webhook signature verification
VERCEL_WEBHOOK_SECRET=         # Secret for Vercel webhook signature verification
CONVEX_WEBHOOK_SECRET=         # Secret for custom Convex webhook
OPS_USER_ID=                   # Your Convex user ID (for webhook → notification mapping)
```

**Step 2: Commit**

```bash
git add apps/ops/.env.example
git commit -m "docs(ops): add webhook env vars to .env.example"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Schema | `convex/schema.ts` |
| 2 | Convex functions | `convex/notifications.ts` (new) |
| 3 | Cron | `convex/crons.ts` |
| 4 | Webhook handlers | `convex/http.ts`, `convex/lib/webhooks.ts` (new) |
| 5 | Feature flag + nav | `lib/features.ts`, `components/ops-frame.tsx` |
| 6 | Notifications page | `app/(main)/notifications/`, `components/notification-detail.tsx`, `lib/notifications.ts` (new) |
| 7 | Unread badge | `components/ops-frame.tsx` |
| 8 | Env vars | `.env.example` |

**Dependencies:** Task 1 → Task 2 → Task 4, Task 3 (parallel). Task 5 and Task 6 can start after Task 2. Task 7 after Task 6. Task 8 anytime.
