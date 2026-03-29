# External Connections Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow Blazz Ops agents to access external apps (Google Drive, Gmail, Notion, Airtable) via a configurable connection system in settings.

**Architecture:** Two new Convex tables (`connections`, `agentConnections`), a provider registry with typed adapters, OAuth2/API-key auth flows via Next.js API routes, and a settings UI for managing connections and dispatching access per agent.

**Tech Stack:** Convex (schema, mutations, queries), Next.js API routes (OAuth flows), zod (validation), @blazz/ui components (UI), Lucide icons.

**Design doc:** `docs/plans/2026-03-29-external-connections-design.md`

---

### Task 1: Add Convex schema tables

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add `connections` table**

At the end of the schema (before the closing `})`), add:

```typescript
connections: defineTable({
	userId: v.string(),
	provider: v.string(),
	label: v.string(),
	authType: v.union(v.literal("oauth2"), v.literal("api_key")),
	status: v.union(
		v.literal("active"),
		v.literal("expired"),
		v.literal("error"),
		v.literal("disconnected"),
	),
	accessToken: v.optional(v.string()),
	refreshToken: v.optional(v.string()),
	tokenExpiresAt: v.optional(v.number()),
	scopes: v.optional(v.array(v.string())),
	apiKey: v.optional(v.string()),
	accountInfo: v.optional(
		v.object({
			email: v.optional(v.string()),
			name: v.optional(v.string()),
			avatar: v.optional(v.string()),
		}),
	),
	lastUsedAt: v.optional(v.number()),
	errorMessage: v.optional(v.string()),
})
	.index("by_user", ["userId"])
	.index("by_user_provider", ["userId", "provider"]),

agentConnections: defineTable({
	userId: v.string(),
	agentId: v.id("agents"),
	connectionId: v.id("connections"),
	addedAt: v.number(),
})
	.index("by_agent", ["agentId"])
	.index("by_connection", ["connectionId"]),
```

**Step 2: Push schema to Convex**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully, new tables created.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add connections and agentConnections tables to schema"
```

---

### Task 2: Create Convex CRUD for connections

**Files:**
- Create: `apps/ops/convex/connections.ts`

**Step 1: Write the connections module**

```typescript
import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

// ── Queries ──

export const list = query({
	args: {},
	handler: async (ctx) => {
		const userId = await requireAuth(ctx)
		return ctx.db
			.query("connections")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()
	},
})

export const get = query({
	args: { id: v.id("connections") },
	handler: async (ctx, { id }) => {
		const userId = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) return null
		return conn
	},
})

// ── Mutations ──

export const create = mutation({
	args: {
		provider: v.string(),
		label: v.string(),
		authType: v.union(v.literal("oauth2"), v.literal("api_key")),
		accessToken: v.optional(v.string()),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		scopes: v.optional(v.array(v.string())),
		apiKey: v.optional(v.string()),
		accountInfo: v.optional(
			v.object({
				email: v.optional(v.string()),
				name: v.optional(v.string()),
				avatar: v.optional(v.string()),
			}),
		),
	},
	handler: async (ctx, args) => {
		const userId = await requireAuth(ctx)
		return ctx.db.insert("connections", {
			...args,
			userId,
			status: "active",
			lastUsedAt: Date.now(),
		})
	},
})

export const updateTokens = mutation({
	args: {
		id: v.id("connections"),
		accessToken: v.string(),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		status: v.optional(
			v.union(
				v.literal("active"),
				v.literal("expired"),
				v.literal("error"),
			),
		),
		errorMessage: v.optional(v.string()),
	},
	handler: async (ctx, { id, ...fields }) => {
		const userId = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) throw new Error("Not found")
		await ctx.db.patch(id, fields)
	},
})

export const remove = mutation({
	args: { id: v.id("connections") },
	handler: async (ctx, { id }) => {
		const userId = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) throw new Error("Not found")

		// Delete all agentConnections referencing this connection
		const links = await ctx.db
			.query("agentConnections")
			.withIndex("by_connection", (q) => q.eq("connectionId", id))
			.collect()
		for (const link of links) {
			await ctx.db.delete(link._id)
		}

		await ctx.db.delete(id)
	},
})

export const markExpired = mutation({
	args: {
		id: v.id("connections"),
		errorMessage: v.string(),
	},
	handler: async (ctx, { id, errorMessage }) => {
		const userId = await requireAuth(ctx)
		const conn = await ctx.db.get(id)
		if (!conn || conn.userId !== userId) throw new Error("Not found")
		await ctx.db.patch(id, {
			status: "expired",
			errorMessage,
		})
	},
})

// Internal mutation for OAuth callback (no auth — called from API route with userId)
export const internalCreate = internalMutation({
	args: {
		userId: v.string(),
		provider: v.string(),
		label: v.string(),
		authType: v.union(v.literal("oauth2"), v.literal("api_key")),
		accessToken: v.optional(v.string()),
		refreshToken: v.optional(v.string()),
		tokenExpiresAt: v.optional(v.number()),
		scopes: v.optional(v.array(v.string())),
		accountInfo: v.optional(
			v.object({
				email: v.optional(v.string()),
				name: v.optional(v.string()),
				avatar: v.optional(v.string()),
			}),
		),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("connections", {
			...args,
			status: "active",
			lastUsedAt: Date.now(),
		})
	},
})
```

**Step 2: Push and verify**

Run: `cd apps/ops && npx convex dev --once`

**Step 3: Commit**

```bash
git add apps/ops/convex/connections.ts
git commit -m "feat(ops): add connections CRUD mutations and queries"
```

---

### Task 3: Create Convex CRUD for agentConnections

**Files:**
- Create: `apps/ops/convex/agentConnections.ts`

**Step 1: Write the agentConnections module**

```typescript
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const listByAgent = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		await requireAuth(ctx)
		const links = await ctx.db
			.query("agentConnections")
			.withIndex("by_agent", (q) => q.eq("agentId", agentId))
			.collect()

		// Resolve connections
		const connections = await Promise.all(
			links.map(async (link) => {
				const conn = await ctx.db.get(link.connectionId)
				return conn ? { ...conn, linkId: link._id } : null
			}),
		)
		return connections.filter(Boolean)
	},
})

export const link = mutation({
	args: {
		agentId: v.id("agents"),
		connectionId: v.id("connections"),
	},
	handler: async (ctx, { agentId, connectionId }) => {
		const userId = await requireAuth(ctx)

		// Check agent and connection belong to user
		const agent = await ctx.db.get(agentId)
		if (!agent || agent.userId !== userId) throw new Error("Agent not found")
		const conn = await ctx.db.get(connectionId)
		if (!conn || conn.userId !== userId) throw new Error("Connection not found")

		// Prevent duplicates
		const existing = await ctx.db
			.query("agentConnections")
			.withIndex("by_agent", (q) => q.eq("agentId", agentId))
			.collect()
		if (existing.some((e) => e.connectionId === connectionId)) return

		return ctx.db.insert("agentConnections", {
			userId,
			agentId,
			connectionId,
			addedAt: Date.now(),
		})
	},
})

export const unlink = mutation({
	args: {
		agentId: v.id("agents"),
		connectionId: v.id("connections"),
	},
	handler: async (ctx, { agentId, connectionId }) => {
		const userId = await requireAuth(ctx)
		const links = await ctx.db
			.query("agentConnections")
			.withIndex("by_agent", (q) => q.eq("agentId", agentId))
			.collect()

		const link = links.find((l) => l.connectionId === connectionId)
		if (link && link.userId === userId) {
			await ctx.db.delete(link._id)
		}
	},
})
```

**Step 2: Push and verify**

Run: `cd apps/ops && npx convex dev --once`

**Step 3: Commit**

```bash
git add apps/ops/convex/agentConnections.ts
git commit -m "feat(ops): add agentConnections link/unlink mutations"
```

---

### Task 4: Create provider registry

**Files:**
- Create: `apps/ops/lib/connections/providers.ts`

**Step 1: Write the provider registry**

```typescript
import type { LucideIcon } from "lucide-react"
import { Cloud, FileText, HardDrive, Mail, Table2 } from "lucide-react"

export type ProviderDef = {
	id: string
	name: string
	icon: LucideIcon
	authType: "oauth2" | "api_key"
	description: string
	capabilities: string[]
	// OAuth2
	authUrl?: string
	tokenUrl?: string
	scopes?: string[]
	// Tools exposed by this provider
	tools: string[]
}

export const providers: ProviderDef[] = [
	{
		id: "google_drive",
		name: "Google Drive",
		icon: HardDrive,
		authType: "oauth2",
		description: "Rechercher et lire des fichiers Google Drive.",
		capabilities: ["Recherche", "Lecture"],
		authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		scopes: ["https://www.googleapis.com/auth/drive.readonly"],
		tools: ["google_drive_search", "google_drive_read", "google_drive_list"],
	},
	{
		id: "google_mail",
		name: "Google Mail",
		icon: Mail,
		authType: "oauth2",
		description: "Rechercher et lire des emails Gmail.",
		capabilities: ["Recherche", "Lecture"],
		authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
		tools: ["google_mail_search", "google_mail_read", "google_mail_list_labels"],
	},
	{
		id: "notion",
		name: "Notion",
		icon: FileText,
		authType: "oauth2",
		description: "Rechercher et lire des pages et bases Notion.",
		capabilities: ["Recherche", "Lecture"],
		authUrl: "https://api.notion.com/v1/oauth/authorize",
		tokenUrl: "https://api.notion.com/v1/oauth/token",
		scopes: [],
		tools: ["notion_search", "notion_read_page", "notion_query_database"],
	},
	{
		id: "airtable",
		name: "Airtable",
		icon: Table2,
		authType: "api_key",
		description: "Lire des enregistrements Airtable.",
		capabilities: ["Recherche", "Lecture"],
		tools: ["airtable_list_records", "airtable_get_record", "airtable_search"],
	},
]

export const providerMap = Object.fromEntries(providers.map((p) => [p.id, p]))

/** Get all tool names for a given provider */
export function getProviderTools(providerId: string): string[] {
	return providerMap[providerId]?.tools ?? []
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/connections/providers.ts
git commit -m "feat(ops): add provider registry with Google Drive, Gmail, Notion, Airtable"
```

---

### Task 5: Create OAuth flow API routes

**Files:**
- Create: `apps/ops/app/api/connections/[provider]/authorize/route.ts`
- Create: `apps/ops/app/api/connections/[provider]/callback/route.ts`

**Step 1: Write the authorize route**

```typescript
// apps/ops/app/api/connections/[provider]/authorize/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { providerMap } from "@/lib/connections/providers"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.CONNECTIONS_JWT_SECRET ?? "dev-secret-change-me")

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ provider: string }> },
) {
	const { provider: providerId } = await params
	const provider = providerMap[providerId]

	if (!provider || provider.authType !== "oauth2") {
		return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
	}

	const clientId = process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
	const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/connections/${providerId}/callback`

	if (!clientId) {
		return NextResponse.json({ error: "Provider not configured" }, { status: 500 })
	}

	// Generate signed state JWT (5 min expiry)
	const state = await new SignJWT({ provider: providerId })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("5m")
		.sign(JWT_SECRET)

	// Store state in httpOnly cookie
	const cookieStore = await cookies()
	cookieStore.set("oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 300, // 5 min
		path: "/",
	})

	// Build OAuth URL
	const url = new URL(provider.authUrl!)
	url.searchParams.set("client_id", clientId)
	url.searchParams.set("redirect_uri", redirectUri)
	url.searchParams.set("response_type", "code")
	url.searchParams.set("state", state)
	url.searchParams.set("access_type", "offline")
	url.searchParams.set("prompt", "consent")
	if (provider.scopes?.length) {
		url.searchParams.set("scope", provider.scopes.join(" "))
	}

	return NextResponse.redirect(url.toString())
}
```

**Step 2: Write the callback route**

```typescript
// apps/ops/app/api/connections/[provider]/callback/route.ts
import { ConvexHttpClient } from "convex/browser"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { providerMap } from "@/lib/connections/providers"
import { internal } from "@/convex/_generated/api"

const JWT_SECRET = new TextEncoder().encode(process.env.CONNECTIONS_JWT_SECRET ?? "dev-secret-change-me")

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ provider: string }> },
) {
	const { provider: providerId } = await params
	const provider = providerMap[providerId]
	const url = new URL(req.url)
	const code = url.searchParams.get("code")
	const state = url.searchParams.get("state")

	if (!provider || !code || !state) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=invalid_request`)
	}

	// Verify state JWT
	const cookieStore = await cookies()
	const savedState = cookieStore.get("oauth_state")?.value
	if (state !== savedState) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=state_mismatch`)
	}

	try {
		const { payload } = await jwtVerify(state, JWT_SECRET)
		if (payload.provider !== providerId) {
			throw new Error("Provider mismatch")
		}
	} catch {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=state_expired`)
	}

	// Exchange code for tokens
	const clientId = process.env[`${providerId.toUpperCase()}_CLIENT_ID`]
	const clientSecret = process.env[`${providerId.toUpperCase()}_CLIENT_SECRET`]
	const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/connections/${providerId}/callback`

	const tokenRes = await fetch(provider.tokenUrl!, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			client_id: clientId!,
			client_secret: clientSecret!,
		}),
	})

	if (!tokenRes.ok) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=token_exchange_failed`)
	}

	const tokens = await tokenRes.json()

	// Health check — verify the token works (provider-specific)
	const healthOk = await healthCheck(providerId, tokens.access_token)
	if (!healthOk) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=health_check_failed`)
	}

	// Fetch account info
	const accountInfo = await fetchAccountInfo(providerId, tokens.access_token)

	// Save to Convex via internal mutation
	// Note: userId comes from the auth session — extract from cookie/token
	// For now, use a helper that reads the Convex auth token
	const authToken = cookieStore.get("__convexAuthToken")?.value
	if (!authToken) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?error=not_authenticated`)
	}

	convex.setAuth(authToken)
	await convex.mutation(internal.connections.internalCreate, {
		userId: "", // Will be resolved from auth in the mutation — see note below
		provider: providerId,
		label: `${provider.name}${accountInfo?.email ? ` (${accountInfo.email})` : ""}`,
		authType: "oauth2",
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token,
		tokenExpiresAt: tokens.expires_in
			? Date.now() + tokens.expires_in * 1000
			: undefined,
		scopes: provider.scopes,
		accountInfo,
	})

	// Clean up state cookie
	cookieStore.delete("oauth_state")

	return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings/connections?success=true`)
}

// ── Helpers ──

async function healthCheck(provider: string, accessToken: string): Promise<boolean> {
	try {
		switch (provider) {
			case "google_drive": {
				const res = await fetch("https://www.googleapis.com/drive/v3/about?fields=user", {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
				return res.ok
			}
			case "google_mail": {
				const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
				return res.ok
			}
			case "notion": {
				const res = await fetch("https://api.notion.com/v1/users/me", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Notion-Version": "2022-06-28",
					},
				})
				return res.ok
			}
			default:
				return true
		}
	} catch {
		return false
	}
}

async function fetchAccountInfo(
	provider: string,
	accessToken: string,
): Promise<{ email?: string; name?: string; avatar?: string } | undefined> {
	try {
		switch (provider) {
			case "google_drive":
			case "google_mail": {
				const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
				if (!res.ok) return undefined
				const data = await res.json()
				return { email: data.email, name: data.name, avatar: data.picture }
			}
			case "notion": {
				const res = await fetch("https://api.notion.com/v1/users/me", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Notion-Version": "2022-06-28",
					},
				})
				if (!res.ok) return undefined
				const data = await res.json()
				return { name: data.name, avatar: data.avatar_url }
			}
			default:
				return undefined
		}
	} catch {
		return undefined
	}
}
```

> **Note:** The `userId` resolution in the callback depends on how Convex Auth exposes the session from cookies. This will need to be adapted based on the actual `@convex-dev/auth` session extraction pattern used in the app. The `internalCreate` mutation takes an explicit `userId` so the API route must extract it from the auth session.

**Step 3: Commit**

```bash
git add apps/ops/app/api/connections/
git commit -m "feat(ops): add OAuth authorize and callback API routes"
```

---

### Task 6: Create token refresh helper

**Files:**
- Create: `apps/ops/lib/connections/ensure-fresh-token.ts`

**Step 1: Write the helper**

```typescript
import { ConvexHttpClient } from "convex/browser"
import { providerMap } from "./providers"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

type Connection = {
	_id: Id<"connections">
	provider: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
}

/**
 * Returns a fresh access token for the given connection.
 * Refreshes automatically if expired or about to expire (1 min margin).
 * Throws if refresh fails — caller should handle by marking connection expired.
 */
export async function ensureFreshToken(
	connection: Connection,
	authToken: string,
): Promise<string> {
	if (!connection.accessToken) {
		throw new Error(`Connection ${connection._id} has no access token`)
	}

	// If no expiry or not expired yet, return current token
	if (
		!connection.tokenExpiresAt ||
		connection.tokenExpiresAt > Date.now() + 60_000
	) {
		return connection.accessToken
	}

	// Need refresh
	if (!connection.refreshToken) {
		throw new Error(`Connection ${connection._id} token expired and no refresh token`)
	}

	const provider = providerMap[connection.provider]
	if (!provider?.tokenUrl) {
		throw new Error(`Provider ${connection.provider} has no tokenUrl`)
	}

	const clientId = process.env[`${connection.provider.toUpperCase()}_CLIENT_ID`]
	const clientSecret = process.env[`${connection.provider.toUpperCase()}_CLIENT_SECRET`]

	const res = await fetch(provider.tokenUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: connection.refreshToken,
			client_id: clientId!,
			client_secret: clientSecret!,
		}),
	})

	if (!res.ok) {
		throw new Error(`Token refresh failed for ${connection.provider}: ${res.status}`)
	}

	const tokens = await res.json()

	// Update tokens in Convex
	convex.setAuth(authToken)
	await convex.mutation(api.connections.updateTokens, {
		id: connection._id,
		accessToken: tokens.access_token,
		refreshToken: tokens.refresh_token ?? connection.refreshToken,
		tokenExpiresAt: tokens.expires_in
			? Date.now() + tokens.expires_in * 1000
			: undefined,
		status: "active",
	})

	return tokens.access_token
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/connections/ensure-fresh-token.ts
git commit -m "feat(ops): add OAuth token refresh helper"
```

---

### Task 7: Create first adapter (Google Drive)

**Files:**
- Create: `apps/ops/lib/connections/adapters/google-drive.ts`

**Step 1: Write the Google Drive adapter**

```typescript
import { z } from "zod"
import { tool } from "@/lib/chat/tools"
import { ensureFreshToken } from "../ensure-fresh-token"

type Connection = {
	_id: any
	provider: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
}

export function buildGoogleDriveTools(connection: Connection, authToken: string) {
	return {
		"google_drive_search": {
			...tool({
				description: "Search files in Google Drive by name or content. Returns file names, IDs, and MIME types.",
				parameters: z.object({
					query: z.string().describe("Search query (file name or content keywords)"),
					maxResults: z.number().optional().describe("Max results to return (default: 10)"),
				}),
			}),
			execute: async ({ query, maxResults }: { query: string; maxResults?: number }) => {
				const token = await ensureFreshToken(connection, authToken)
				const limit = maxResults ?? 10
				const res = await fetch(
					`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`name contains '${query}' or fullText contains '${query}'`)}&fields=files(id,name,mimeType,modifiedTime,size)&pageSize=${limit}`,
					{ headers: { Authorization: `Bearer ${token}` } },
				)
				if (!res.ok) throw new Error(`Google Drive search failed: ${res.status}`)
				const data = await res.json()
				return data.files ?? []
			},
		},

		"google_drive_read": {
			...tool({
				description: "Read the text content of a Google Drive file by ID. Works with Google Docs, Sheets (as CSV), and plain text files.",
				parameters: z.object({
					fileId: z.string().describe("The file ID from Google Drive"),
				}),
			}),
			execute: async ({ fileId }: { fileId: string }) => {
				const token = await ensureFreshToken(connection, authToken)
				// Try export for Google Docs/Sheets, fallback to direct download
				const metaRes = await fetch(
					`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`,
					{ headers: { Authorization: `Bearer ${token}` } },
				)
				if (!metaRes.ok) throw new Error(`File not found: ${metaRes.status}`)
				const meta = await metaRes.json()

				let contentUrl: string
				if (meta.mimeType === "application/vnd.google-apps.document") {
					contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`
				} else if (meta.mimeType === "application/vnd.google-apps.spreadsheet") {
					contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`
				} else {
					contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
				}

				const contentRes = await fetch(contentUrl, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (!contentRes.ok) throw new Error(`Failed to read file: ${contentRes.status}`)
				const text = await contentRes.text()
				return { name: meta.name, mimeType: meta.mimeType, content: text.slice(0, 10000) }
			},
		},

		"google_drive_list": {
			...tool({
				description: "List recent files in Google Drive. Returns the most recently modified files.",
				parameters: z.object({
					maxResults: z.number().optional().describe("Max results (default: 20)"),
					folderId: z.string().optional().describe("Folder ID to list (default: root)"),
				}),
			}),
			execute: async ({ maxResults, folderId }: { maxResults?: number; folderId?: string }) => {
				const token = await ensureFreshToken(connection, authToken)
				const limit = maxResults ?? 20
				const q = folderId ? `'${folderId}' in parents` : ""
				const url = `https://www.googleapis.com/drive/v3/files?orderBy=modifiedTime desc&pageSize=${limit}&fields=files(id,name,mimeType,modifiedTime,size)${q ? `&q=${encodeURIComponent(q)}` : ""}`
				const res = await fetch(url, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (!res.ok) throw new Error(`Google Drive list failed: ${res.status}`)
				const data = await res.json()
				return data.files ?? []
			},
		},
	}
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/connections/adapters/google-drive.ts
git commit -m "feat(ops): add Google Drive adapter with search, read, list tools"
```

---

### Task 8: Inject connection tools into agent chat

**Files:**
- Modify: `apps/ops/app/api/agents/[slug]/chat/route.ts`
- Create: `apps/ops/lib/connections/build-connection-tools.ts`

**Step 1: Create the connection tools builder**

```typescript
// apps/ops/lib/connections/build-connection-tools.ts
import { buildGoogleDriveTools } from "./adapters/google-drive"
// import { buildGoogleMailTools } from "./adapters/google-mail"
// import { buildNotionTools } from "./adapters/notion"
// import { buildAirtableTools } from "./adapters/airtable"

type Connection = {
	_id: any
	provider: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
	apiKey?: string
}

const adapterMap: Record<string, (conn: Connection, authToken: string) => Record<string, any>> = {
	google_drive: buildGoogleDriveTools,
	// google_mail: buildGoogleMailTools,
	// notion: buildNotionTools,
	// airtable: buildAirtableTools,
}

/**
 * Build tools from all active connections linked to an agent.
 * Returns a Record<toolName, toolDef> ready to merge into the agent's tools.
 */
export function buildConnectionTools(
	connections: Connection[],
	authToken: string,
): Record<string, any> {
	const tools: Record<string, any> = {}

	for (const conn of connections) {
		if (conn.status !== "active") continue
		const builder = adapterMap[conn.provider]
		if (!builder) continue

		const providerTools = builder(conn, authToken)
		Object.assign(tools, providerTools)
	}

	return tools
}
```

**Step 2: Modify the chat route to inject connection tools**

In `apps/ops/app/api/agents/[slug]/chat/route.ts`, after the existing tool building block (after line ~356 where `console.log` shows registered tools), add:

```typescript
// After: console.log(`[agent-chat] ${slug} tools registered:`, Object.keys(tools))

// ── Connection tools ──
import { buildConnectionTools } from "@/lib/connections/build-connection-tools"

// Fetch agent's active connections
const agentConns = await convex.query(api.agentConnections.listByAgent, { agentId: agent._id })
if (agentConns.length > 0) {
	const connectionTools = buildConnectionTools(agentConns, token)
	Object.assign(tools, connectionTools)
	console.log(`[agent-chat] ${slug} connection tools added:`, Object.keys(connectionTools))
}
```

> **Note:** The import should be at the top of the file. The inline block goes where the tools are built. The exact placement depends on where `convex` client and `token` are in scope — both are available at that point in the existing code.

**Step 3: Commit**

```bash
git add apps/ops/lib/connections/build-connection-tools.ts apps/ops/app/api/agents/[slug]/chat/route.ts
git commit -m "feat(ops): inject connection tools into agent chat route"
```

---

### Task 9: Settings nav — add Connections entry

**Files:**
- Modify: `apps/ops/app/(main)/settings/layout.tsx`

**Step 1: Add Connections to the nav**

Add `Plug` to the Lucide imports:

```typescript
import { Bot, Plug, Settings, Tag, ToggleRight } from "lucide-react"
```

Add the Connections entry in the "Général" group, after "Fonctionnalités":

```typescript
{
	group: "Général",
	items: [
		{ label: "Préférences", href: "/settings", icon: Settings },
		{ label: "Fonctionnalités", href: "/settings/features", icon: ToggleRight },
		{ label: "Connexions", href: "/settings/connections", icon: Plug },
	],
},
```

**Step 2: Commit**

```bash
git add apps/ops/app/(main)/settings/layout.tsx
git commit -m "feat(ops): add Connections entry to settings nav"
```

---

### Task 10: Create `/settings/connections` page

**Files:**
- Create: `apps/ops/app/(main)/settings/connections/page.tsx`
- Create: `apps/ops/app/(main)/settings/connections/_client.tsx`

**Step 1: Write the server page**

```typescript
// apps/ops/app/(main)/settings/connections/page.tsx
import type { Metadata } from "next"
import { ConnectionsClient } from "./_client"

export const metadata: Metadata = {
	title: "Connexions",
}

export default function ConnectionsPage() {
	return <ConnectionsClient />
}
```

**Step 2: Write the client component**

```typescript
// apps/ops/app/(main)/settings/connections/_client.tsx
"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { providers, type ProviderDef } from "@/lib/connections/providers"

// ── Status helpers ──

const statusLabels: Record<string, string> = {
	active: "Connecté",
	expired: "Expiré",
	error: "Erreur",
	disconnected: "Déconnecté",
}

const statusVariants: Record<string, "success" | "warning" | "destructive" | "outline"> = {
	active: "success",
	expired: "warning",
	error: "destructive",
	disconnected: "outline",
}

// ── Connection Card ──

type UserConnection = {
	_id: Id<"connections">
	provider: string
	status: string
	accountInfo?: { email?: string; name?: string; avatar?: string }
}

function ConnectionCard({
	provider,
	connection,
	onDisconnect,
}: {
	provider: ProviderDef
	connection?: UserConnection
	onDisconnect: (id: Id<"connections">) => void
}) {
	const Icon = provider.icon

	const handleConnect = () => {
		if (provider.authType === "oauth2") {
			// Redirect to OAuth authorize endpoint
			window.location.href = `/api/connections/${provider.id}/authorize`
		}
		// TODO: API key flow — open dialog
	}

	return (
		<Box padding="4" background="surface" border="default" borderRadius="lg">
			<BlockStack gap="300">
				<InlineStack gap="200" blockAlign="center" align="space-between">
					<InlineStack gap="200" blockAlign="center">
						<Icon className="size-5 text-fg-muted" />
						<span className="text-sm font-medium text-fg">{provider.name}</span>
					</InlineStack>
					{connection && (
						<Badge variant={statusVariants[connection.status] ?? "outline"}>
							{statusLabels[connection.status] ?? connection.status}
						</Badge>
					)}
				</InlineStack>

				<p className="text-xs text-fg-muted">{provider.description}</p>

				<InlineStack gap="100" wrap>
					{provider.capabilities.map((cap) => (
						<Badge key={cap} variant="outline" className="text-xs">
							{cap}
						</Badge>
					))}
				</InlineStack>

				{connection?.accountInfo?.email && (
					<span className="text-xs text-fg-muted">{connection.accountInfo.email}</span>
				)}

				{connection?.status === "active" ? (
					<Button
						variant="outline"
						size="sm"
						className="w-full"
						onClick={() => onDisconnect(connection._id)}
					>
						Déconnecter
					</Button>
				) : (
					<Button variant="secondary" size="sm" className="w-full" onClick={handleConnect}>
						Connecter
					</Button>
				)}
			</BlockStack>
		</Box>
	)
}

// ── Page ──

export function ConnectionsClient() {
	const connections = useQuery(api.connections.list)
	const removeConnection = useMutation(api.connections.remove)
	const searchParams = useSearchParams()
	const router = useRouter()

	// Handle OAuth callback feedback
	useEffect(() => {
		if (searchParams.get("success") === "true") {
			toast.success("Connexion réussie")
			router.replace("/settings/connections")
		}
		const error = searchParams.get("error")
		if (error) {
			const messages: Record<string, string> = {
				state_mismatch: "Erreur de sécurité — réessayez.",
				state_expired: "La demande a expiré — réessayez.",
				token_exchange_failed: "Échec de l'authentification.",
				health_check_failed: "La connexion ne fonctionne pas — vérifiez les permissions.",
				not_authenticated: "Vous devez être connecté.",
			}
			toast.error(messages[error] ?? `Erreur: ${error}`)
			router.replace("/settings/connections")
		}
	}, [searchParams, router])

	const handleDisconnect = async (id: Id<"connections">) => {
		try {
			await removeConnection({ id })
			toast.success("Connexion supprimée")
		} catch {
			toast.error("Erreur lors de la déconnexion")
		}
	}

	// Loading state
	if (connections === undefined) {
		return (
			<SettingsPage>
				<SettingsHeader title="Connexions" description="Connectez vos applications externes." />
				<InlineGrid columns={3} gap="300">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-44 w-full rounded-lg" />
					))}
				</InlineGrid>
			</SettingsPage>
		)
	}

	// Map connections by provider
	const connectionsByProvider = new Map<string, UserConnection>()
	for (const conn of connections) {
		connectionsByProvider.set(conn.provider, conn as UserConnection)
	}

	return (
		<SettingsPage>
			<SettingsHeader
				title="Connexions"
				description="Connectez vos applications externes pour les rendre accessibles à vos agents."
			/>
			<InlineGrid columns={3} gap="300">
				{providers.map((provider) => (
					<ConnectionCard
						key={provider.id}
						provider={provider}
						connection={connectionsByProvider.get(provider.id)}
						onDisconnect={handleDisconnect}
					/>
				))}
			</InlineGrid>
		</SettingsPage>
	)
}
```

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/settings/connections/
git commit -m "feat(ops): add connections settings page with provider cards"
```

---

### Task 11: Add Connections tab to agent settings

**Files:**
- Modify: `apps/ops/app/(main)/settings/agents/[slug]/_client.tsx`

**Step 1: Add a ConnectionsTab component**

Add this component before the `AgentDetailClient` function:

```typescript
// ── Connections tab ──

function ConnectionsTab({ agentId }: { agentId: Id<"agents"> }) {
	const connections = useQuery(api.connections.list)
	const agentConns = useQuery(api.agentConnections.listByAgent, { agentId })
	const link = useMutation(api.agentConnections.link)
	const unlink = useMutation(api.agentConnections.unlink)

	if (connections === undefined || agentConns === undefined) {
		return (
			<BlockStack gap="200">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-16 w-full rounded-lg" />
				))}
			</BlockStack>
		)
	}

	const activeConnections = connections.filter((c) => c.status === "active")

	if (activeConnections.length === 0) {
		return (
			<BlockStack gap="200">
				<p className="text-sm text-fg-muted">
					Aucune connexion active. Configurez des connexions dans{" "}
					<a href="/settings/connections" className="text-brand underline">
						Paramètres &gt; Connexions
					</a>
					.
				</p>
			</BlockStack>
		)
	}

	const linkedIds = new Set(agentConns.map((c: any) => c._id))

	const handleToggle = async (connectionId: Id<"connections">, checked: boolean) => {
		try {
			if (checked) {
				await link({ agentId, connectionId })
			} else {
				await unlink({ agentId, connectionId })
			}
			toast.success(checked ? "Connexion activée" : "Connexion désactivée")
		} catch {
			toast.error("Erreur")
		}
	}

	return (
		<BlockStack gap="200">
			<p className="text-sm text-fg-muted">
				Activez les connexions que cet agent peut utiliser. Les outils associés seront automatiquement disponibles.
			</p>
			<BlockStack gap="100">
				{activeConnections.map((conn) => {
					const isLinked = linkedIds.has(conn._id)
					const providerDef = providerMap[conn.provider]
					if (!providerDef) return null
					const Icon = providerDef.icon

					return (
						<Item key={conn._id}>
							<ItemContent>
								<InlineStack gap="200" blockAlign="center">
									<Icon className="size-4 text-fg-muted" />
									<ItemTitle>{conn.label}</ItemTitle>
								</InlineStack>
								{isLinked && (
									<InlineStack gap="100" wrap className="mt-1">
										{providerDef.tools.map((t) => (
											<Badge key={t} variant="outline" className="text-xs">
												{t}
											</Badge>
										))}
									</InlineStack>
								)}
							</ItemContent>
							<ItemActions>
								<Switch checked={isLinked} onCheckedChange={(checked) => handleToggle(conn._id, checked)} />
							</ItemActions>
						</Item>
					)
				})}
			</BlockStack>
		</BlockStack>
	)
}
```

**Step 2: Add the imports and tab trigger**

Add to the imports at the top of the file:

```typescript
import { Plug } from "lucide-react"
import { providerMap } from "@/lib/connections/providers"
import { api as agentConnectionsApi } from "@/convex/_generated/api" // already imported as api
```

In the `Tabs` section of `AgentDetailClient`, add after the Memory tab trigger:

```tsx
<TabsTrigger value="connections">Connexions</TabsTrigger>
```

And add the tab content after the Memory TabsContent:

```tsx
<TabsContent value="connections">
	<ConnectionsTab agentId={typedAgent._id} />
</TabsContent>
```

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/settings/agents/[slug]/_client.tsx
git commit -m "feat(ops): add Connections tab to agent settings"
```

---

### Task 12: Add expired token notification

**Files:**
- Modify: `apps/ops/lib/connections/ensure-fresh-token.ts`

**Step 1: Add notification on refresh failure**

In the `ensureFreshToken` function, after the refresh fails, before throwing:

```typescript
// In the catch/error path after refresh fails:
try {
	// Mark connection as expired
	convex.setAuth(authToken)
	await convex.mutation(api.connections.markExpired, {
		id: connection._id,
		errorMessage: `Token refresh failed: ${res.status}`,
	})

	// Create notification
	await convex.mutation(internal.notifications.internalCreate, {
		userId: "", // Extracted from auth context
		source: "system",
		externalId: `connection-expired-${connection._id}`,
		title: `Connexion ${providerMap[connection.provider]?.name ?? connection.provider} expirée`,
		description: "Reconnectez-la dans Paramètres > Connexions.",
		actionType: "alert",
		authorName: "Système",
		authorInitials: "SY",
		url: "/settings/connections",
	})
} catch {
	// Notification failure is non-critical
}
```

> **Note:** The `source` validator in `notifications.ts` may need to be updated to include `"system"` as a valid source value. Check the existing `sourceValidator` and add `"system"` if not present.

**Step 2: Commit**

```bash
git add apps/ops/lib/connections/ensure-fresh-token.ts
git commit -m "feat(ops): create notification when connection token expires"
```

---

### Task 13: Add env vars and jose dependency

**Files:**
- Modify: `apps/ops/package.json`
- Create/modify: `apps/ops/.env.local.example`

**Step 1: Install jose (JWT library)**

Run: `cd apps/ops && pnpm add jose`

**Step 2: Create env example file**

```bash
# apps/ops/.env.local.example — add these entries

# External Connections
CONNECTIONS_JWT_SECRET=generate-a-random-32-char-string
NEXT_PUBLIC_APP_URL=http://localhost:3120

# Google OAuth (console.cloud.google.com)
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_MAIL_CLIENT_ID=
GOOGLE_MAIL_CLIENT_SECRET=

# Notion OAuth (developers.notion.com)
NOTION_CLIENT_ID=
NOTION_CLIENT_SECRET=

# Airtable (airtable.com/account)
AIRTABLE_API_KEY=
```

**Step 3: Commit**

```bash
git add apps/ops/package.json apps/ops/pnpm-lock.yaml apps/ops/.env.local.example
git commit -m "chore(ops): add jose dependency and env vars example for connections"
```

---

### Task 14: Verify build

**Step 1: Run build**

Run: `cd apps/ops && pnpm build`
Expected: Build succeeds with no type errors.

**Step 2: Run lint**

Run: `pnpm lint`
Expected: No lint errors.

**Step 3: Fix any issues, then final commit if needed**

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Schema tables | `convex/schema.ts` |
| 2 | Connections CRUD | `convex/connections.ts` |
| 3 | AgentConnections CRUD | `convex/agentConnections.ts` |
| 4 | Provider registry | `lib/connections/providers.ts` |
| 5 | OAuth API routes | `app/api/connections/[provider]/authorize + callback` |
| 6 | Token refresh helper | `lib/connections/ensure-fresh-token.ts` |
| 7 | Google Drive adapter | `lib/connections/adapters/google-drive.ts` |
| 8 | Inject tools in chat | `lib/connections/build-connection-tools.ts` + modify chat route |
| 9 | Settings nav entry | modify `settings/layout.tsx` |
| 10 | Connections settings page | `settings/connections/page.tsx + _client.tsx` |
| 11 | Agent connections tab | modify `settings/agents/[slug]/_client.tsx` |
| 12 | Expired token notification | modify `ensure-fresh-token.ts` |
| 13 | Dependencies + env vars | `package.json` + `.env.local.example` |
| 14 | Build verification | — |
