# Gmail Invoice Filer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a system where the `account-manager` agent fetches invoices from Gmail (label `facture`), extracts metadata via Haiku vision, files PDFs into Google Drive (`YYYY/MM/`), and creates `expenseSuggestions` for manual validation.

**Architecture:** 5 granular Convex actions exposed as worker tools. The agent loops over emails and attachments, calling tools one by one. Attachment-level claims ensure concurrency safety. Google auth reuses existing `connections`/`providerConfigs` tables with a new `google_invoices` provider (combined `gmail.modify` + `drive.file` scopes). Google Picker selects the target Drive folder.

**Tech Stack:** Convex (actions, mutations, crons), Gmail API v1, Google Drive API v3, Google Picker API, Anthropic Haiku 4.5 vision, OpenAI function calling (worker), Next.js API routes (OAuth)

**Spec:** `docs/superpowers/specs/2026-04-11-gmail-invoice-filer-design.md`

---

## File Map

### New files

| File | Responsibility |
|---|---|
| `apps/ops/convex/lib/google-auth.ts` | Helper to get fresh Google access token from `connections` table (refresh if needed) |
| `apps/ops/convex/lib/invoice-naming.ts` | Pure function: `buildInvoiceFileName(vendor, date, amountCents)` → sluggified filename |
| `apps/ops/convex/attachmentClaims.ts` | CRUD + claim mutation for `attachmentClaims` table |
| `apps/ops/convex/google.ts` | Convex actions wrapping Gmail + Drive + LLM extraction APIs |
| `apps/ops/worker/src/tools/invoices.ts` | 5 worker tools calling the Convex actions |
| `apps/ops/convex/attachmentClaims.test.ts` | Tests for claim logic |
| `apps/ops/convex/lib/invoice-naming.test.ts` | Tests for file naming |

### Modified files

| File | What changes |
|---|---|
| `apps/ops/convex/schema.ts` | Add `attachmentClaims` table, extend `expenseSuggestions` (add `"gmail"` source + new fields), extend `expenses` (add `"invoice"` type + Drive fields) |
| `apps/ops/convex/test.schema.ts` | Mirror all schema changes |
| `apps/ops/convex/expenseSuggestions.ts` | Extend `accept()` to handle `source: "gmail"` → creates expense with `type: "invoice"` + Drive fields. Add `insertFromGmail` internal mutation. |
| `apps/ops/convex/expenses.ts` | Add `"invoice"` to type validators in `list` query and `create`/`update` mutations |
| `apps/ops/worker/src/tools/index.ts` | Import and register `invoiceTools` |
| `apps/ops/lib/connections/providers.ts` | Add `google_invoices` provider with combined scopes |
| `apps/ops/agents/account-manager/SKILL.md` | Add `invoice-filing` mode |
| `apps/ops/convex/crons.ts` | Add daily 9h cron for invoice filing mission |
| `apps/ops/app/(main)/settings/connections/_client.tsx` | Add Picker UI for Drive folder selection (after Google Invoices connection) |

---

## Task 1: Schema changes

**Files:**
- Modify: `apps/ops/convex/schema.ts`
- Modify: `apps/ops/convex/test.schema.ts`

- [ ] **Step 1: Add `attachmentClaims` table to `schema.ts`**

Add after the `expenseSuggestions` table definition (before the closing `})`):

```ts
	// ── Gmail Invoice Filing ──

	attachmentClaims: defineTable({
		userId: v.string(),
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		missionId: v.optional(v.string()),
		status: v.union(
			v.literal("claimed"),
			v.literal("extracted"),
			v.literal("uploaded"),
			v.literal("suggested"),
			v.literal("relabeled"),
			v.literal("failed"),
		),
		driveFileId: v.optional(v.string()),
		suggestionId: v.optional(v.id("expenseSuggestions")),
		errorMessage: v.optional(v.string()),
		claimedAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_user_message_attachment", ["userId", "gmailMessageId", "gmailAttachmentId"])
		.index("by_user_message", ["userId", "gmailMessageId"])
		.index("by_user_status", ["userId", "status"]),
```

- [ ] **Step 2: Extend `expenseSuggestions` in `schema.ts`**

Replace the existing `expenseSuggestions` definition:

```ts
	expenseSuggestions: defineTable({
		userId: v.string(),
		source: v.union(v.literal("qonto"), v.literal("gmail")),
		status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
		label: v.string(),
		amountCents: v.number(),
		date: v.string(),
		confidence: v.number(),
		syncedAt: v.number(),
		// Source = qonto
		qontoTransactionId: v.optional(v.string()),
		// Source = gmail
		gmailMessageId: v.optional(v.string()),
		gmailAttachmentId: v.optional(v.string()),
		driveFileId: v.optional(v.string()),
		driveWebViewLink: v.optional(v.string()),
		invoiceNumber: v.optional(v.string()),
		currency: v.optional(v.string()),
	})
		.index("by_user_status", ["userId", "status"])
		.index("by_user_txn", ["userId", "qontoTransactionId"])
		.index("by_user_attachment", ["userId", "gmailMessageId", "gmailAttachmentId"]),
```

- [ ] **Step 3: Extend `expenses` in `schema.ts`**

Add `"invoice"` to the `type` union and add new optional fields after `qontoTransactionId`:

```ts
	expenses: defineTable({
		userId: v.string(),
		type: v.union(v.literal("restaurant"), v.literal("mileage"), v.literal("invoice")),
		date: v.string(),
		amountCents: v.optional(v.number()),
		clientId: v.optional(v.id("clients")),
		projectId: v.optional(v.id("projects")),
		notes: v.optional(v.string()),
		// Restaurant
		guests: v.optional(v.string()),
		purpose: v.optional(v.string()),
		// Mileage
		departure: v.optional(v.string()),
		destination: v.optional(v.string()),
		distanceKm: v.optional(v.number()),
		reimbursementCents: v.optional(v.number()),
		qontoTransactionId: v.optional(v.string()),
		// Invoice (from Gmail filer)
		driveFileId: v.optional(v.string()),
		driveWebViewLink: v.optional(v.string()),
		gmailMessageId: v.optional(v.string()),
		gmailAttachmentId: v.optional(v.string()),
		vendor: v.optional(v.string()),
		invoiceNumber: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_date", ["userId", "date"])
		.index("by_user_type", ["userId", "type"]),
```

- [ ] **Step 4: Mirror all changes in `test.schema.ts`**

Add the same `attachmentClaims` table. Update `expenseSuggestions` (add all gmail fields, change `source` to union, make `qontoTransactionId` optional). Update `expenses` (add `"invoice"` to type, add Drive/Gmail fields). The test.schema must exactly match schema.ts for tables used in tests.

- [ ] **Step 5: Verify Convex pushes without errors**

Run: `cd apps/ops && npx convex dev --once --typecheck=disable`
Expected: Schema push succeeds. No validation errors. Existing data stays intact.

- [ ] **Step 6: Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/convex/test.schema.ts
git commit -m "feat(ops): add attachmentClaims table, extend expenses/expenseSuggestions for gmail invoices"
```

---

## Task 2: Invoice naming utility + tests

**Files:**
- Create: `apps/ops/convex/lib/invoice-naming.ts`
- Create: `apps/ops/convex/lib/invoice-naming.test.ts`

- [ ] **Step 1: Write the tests**

Create `apps/ops/convex/lib/invoice-naming.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { buildInvoiceFileName, slugifyVendor } from "./invoice-naming"

describe("slugifyVendor", () => {
	it("lowercases and replaces spaces with hyphens", () => {
		expect(slugifyVendor("Notion Labs Inc")).toBe("Notion-Labs-Inc")
	})

	it("removes non-ASCII characters", () => {
		expect(slugifyVendor("Café René")).toBe("Caf-Ren")
	})

	it("collapses multiple hyphens", () => {
		expect(slugifyVendor("OVH   Cloud")).toBe("OVH-Cloud")
	})

	it("trims leading/trailing hyphens", () => {
		expect(slugifyVendor(" OVH ")).toBe("OVH")
	})
})

describe("buildInvoiceFileName", () => {
	it("builds standard name", () => {
		expect(buildInvoiceFileName("OVH", "2026-04-11", 2399)).toBe("2026-04-11_OVH_23.99.pdf")
	})

	it("handles zero cents", () => {
		expect(buildInvoiceFileName("SNCF", "2026-01-15", 5000)).toBe("2026-01-15_SNCF_50.00.pdf")
	})

	it("sluggifies vendor with spaces", () => {
		expect(buildInvoiceFileName("Notion Labs", "2026-04-11", 1500)).toBe("2026-04-11_Notion-Labs_15.00.pdf")
	})

	it("handles suffix for collisions", () => {
		expect(buildInvoiceFileName("OVH", "2026-04-11", 2399, 2)).toBe("2026-04-11_OVH_23.99_2.pdf")
	})

	it("no suffix when suffix is 1 or undefined", () => {
		expect(buildInvoiceFileName("OVH", "2026-04-11", 2399, 1)).toBe("2026-04-11_OVH_23.99.pdf")
	})
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/ops && npx vitest run convex/lib/invoice-naming.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

Create `apps/ops/convex/lib/invoice-naming.ts`:

```ts
/**
 * Sluggify a vendor name for safe file naming.
 * Keeps ASCII letters, digits, hyphens. Replaces spaces with hyphens.
 */
export function slugifyVendor(vendor: string): string {
	return vendor
		.trim()
		.replace(/[^\x20-\x7E]/g, "") // remove non-ASCII
		.replace(/\s+/g, "-") // spaces → hyphens
		.replace(/-+/g, "-") // collapse hyphens
		.replace(/^-|-$/g, "") // trim hyphens
}

/**
 * Build the invoice file name.
 * Format: YYYY-MM-DD_Vendor_Amount.pdf
 * If suffix > 1, appends _N before .pdf
 */
export function buildInvoiceFileName(vendor: string, invoiceDate: string, amountCents: number, suffix?: number): string {
	const slug = slugifyVendor(vendor)
	const amount = (amountCents / 100).toFixed(2)
	const suffixPart = suffix && suffix > 1 ? `_${suffix}` : ""
	return `${invoiceDate}_${slug}_${amount}${suffixPart}.pdf`
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/ops && npx vitest run convex/lib/invoice-naming.test.ts`
Expected: All 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add apps/ops/convex/lib/invoice-naming.ts apps/ops/convex/lib/invoice-naming.test.ts
git commit -m "feat(ops): add invoice file naming utility with tests"
```

---

## Task 3: Google auth helper

**Files:**
- Create: `apps/ops/convex/lib/google-auth.ts`

This helper runs inside Convex actions. It reads the `connections` and `providerConfigs` tables to get a valid access token, refreshing if expired.

- [ ] **Step 1: Create the helper**

Create `apps/ops/convex/lib/google-auth.ts`:

```ts
import type { ActionCtx } from "../_generated/server"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"

/**
 * Get a valid Google access token for the current user.
 * Reads from the `connections` table (provider = "google_invoices").
 * Refreshes automatically if expired or expiring within 60s.
 * Updates the connection row with new tokens after refresh.
 *
 * Must be called from a Convex action (needs ctx.runQuery + ctx.runMutation).
 */
export async function getGoogleAccessToken(
	ctx: ActionCtx,
	userId: string
): Promise<string> {
	// Find the google_invoices connection
	const connections: any[] = await ctx.runQuery(
		// @ts-expect-error -- internal query, not typed in api
		"connections:list" as any
	)
	// We can't use the typed api here because this runs inside an action
	// and we need to query by provider. Use raw DB access pattern instead.
	// Actually, we need a dedicated internal query. See below.
	throw new Error("Not implemented — see getGoogleAccessTokenInternal")
}

/**
 * Fetch a valid Google access token from within a Convex action.
 * Takes the connection and provider config as pre-fetched arguments
 * to avoid circular imports with the action layer.
 */
export async function refreshGoogleTokenIfNeeded(
	connection: {
		_id: string
		accessToken?: string
		refreshToken?: string
		tokenExpiresAt?: number
	},
	providerConfig: {
		clientId: string
		clientSecret: string
	},
	patchConnection: (id: string, fields: Record<string, unknown>) => Promise<void>
): Promise<string> {
	if (!connection.accessToken) {
		throw new Error("Google connection has no access token")
	}

	// Return current token if still valid (with 60s margin)
	if (!connection.tokenExpiresAt || connection.tokenExpiresAt > Date.now() + 60_000) {
		return connection.accessToken
	}

	// Need refresh
	if (!connection.refreshToken) {
		throw new Error("Google token expired and no refresh token available")
	}

	const res = await fetch(GOOGLE_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: connection.refreshToken,
			client_id: providerConfig.clientId,
			client_secret: providerConfig.clientSecret,
		}),
	})

	if (!res.ok) {
		const body = await res.text()
		throw new Error(`Google token refresh failed (${res.status}): ${body}`)
	}

	const tokens = await res.json()
	const newAccessToken = tokens.access_token as string
	const newExpiresAt = tokens.expires_in ? Date.now() + (tokens.expires_in as number) * 1000 : undefined

	// Persist refreshed token
	await patchConnection(connection._id, {
		accessToken: newAccessToken,
		tokenExpiresAt: newExpiresAt,
		status: "active",
	})

	return newAccessToken
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/ops/convex/lib/google-auth.ts
git commit -m "feat(ops): add Google token refresh helper for Convex actions"
```

---

## Task 4: Attachment claims + tests

**Files:**
- Create: `apps/ops/convex/attachmentClaims.ts`
- Create: `apps/ops/convex/attachmentClaims.test.ts`

- [ ] **Step 1: Write the tests**

Create `apps/ops/convex/attachmentClaims.test.ts`:

```ts
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./test.schema"

const modules = import.meta.glob("./**/*.*s")

function setup() {
	const t = convexTest(schema, modules)
	const asUser = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
	return { t, asUser }
}

describe("attachmentClaims.claim", () => {
	it("claims a new attachment", async () => {
		const { asUser } = setup()
		const result = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "mission1",
		})
		expect(result.claimed).toBe(true)
		expect(result.claimId).toBeDefined()
	})

	it("rejects claim on active lock (< 10 min)", async () => {
		const { asUser } = setup()
		await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "mission1",
		})
		const result = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "mission2",
		})
		expect(result.claimed).toBe(false)
		expect(result.reason).toBe("locked")
	})

	it("rejects claim on terminal status", async () => {
		const { asUser } = setup()
		const { claimId } = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "mission1",
		})
		await asUser.mutation(api.attachmentClaims.updateStatus, {
			id: claimId!,
			status: "suggested",
		})
		const result = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "mission2",
		})
		expect(result.claimed).toBe(false)
		expect(result.reason).toBe("terminal")
	})
})

describe("attachmentClaims.allTerminalForMessage", () => {
	it("returns true when all attachments are terminal", async () => {
		const { asUser } = setup()
		const { claimId: c1 } = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "m1",
		})
		const { claimId: c2 } = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att2",
			missionId: "m1",
		})
		await asUser.mutation(api.attachmentClaims.updateStatus, { id: c1!, status: "suggested" })
		await asUser.mutation(api.attachmentClaims.updateStatus, { id: c2!, status: "failed" })

		const result = await asUser.query(api.attachmentClaims.allTerminalForMessage, {
			gmailMessageId: "msg1",
		})
		expect(result).toBe(true)
	})

	it("returns false when some attachments are in-progress", async () => {
		const { asUser } = setup()
		const { claimId: c1 } = await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att1",
			missionId: "m1",
		})
		await asUser.mutation(api.attachmentClaims.claim, {
			gmailMessageId: "msg1",
			gmailAttachmentId: "att2",
			missionId: "m1",
		})
		await asUser.mutation(api.attachmentClaims.updateStatus, { id: c1!, status: "suggested" })
		// att2 is still "claimed"

		const result = await asUser.query(api.attachmentClaims.allTerminalForMessage, {
			gmailMessageId: "msg1",
		})
		expect(result).toBe(false)
	})
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd apps/ops && npx vitest run convex/attachmentClaims.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

Create `apps/ops/convex/attachmentClaims.ts`:

```ts
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

const STALE_TTL_MS = 10 * 60 * 1000 // 10 minutes

const TERMINAL_STATUSES = ["suggested", "relabeled", "failed"] as const

type ClaimResult =
	| { claimed: true; claimId: string }
	| { claimed: false; reason: "locked" | "terminal" }

/**
 * Atomically claim an attachment for processing.
 * Convex mutations are serializable — no two concurrent claims can both succeed.
 */
export const claim = mutation({
	args: {
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		missionId: v.optional(v.string()),
	},
	handler: async (ctx, { gmailMessageId, gmailAttachmentId, missionId }): Promise<ClaimResult> => {
		const { userId } = await requireAuth(ctx)

		const existing = await ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message_attachment", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId).eq("gmailAttachmentId", gmailAttachmentId)
			)
			.first()

		if (existing) {
			// Terminal — already fully processed
			if ((TERMINAL_STATUSES as readonly string[]).includes(existing.status)) {
				return { claimed: false, reason: "terminal" }
			}

			// Stale — re-claim allowed
			if (existing.claimedAt < Date.now() - STALE_TTL_MS) {
				await ctx.db.patch(existing._id, {
					missionId,
					status: "claimed",
					claimedAt: Date.now(),
					updatedAt: Date.now(),
				})
				return { claimed: true, claimId: existing._id }
			}

			// Active lock by another mission
			return { claimed: false, reason: "locked" }
		}

		// New claim
		const claimId = await ctx.db.insert("attachmentClaims", {
			userId,
			gmailMessageId,
			gmailAttachmentId,
			missionId,
			status: "claimed",
			claimedAt: Date.now(),
			updatedAt: Date.now(),
		})

		return { claimed: true, claimId }
	},
})

/**
 * Update claim status after each pipeline step.
 */
export const updateStatus = mutation({
	args: {
		id: v.id("attachmentClaims"),
		status: v.union(
			v.literal("extracted"),
			v.literal("uploaded"),
			v.literal("suggested"),
			v.literal("relabeled"),
			v.literal("failed"),
		),
		driveFileId: v.optional(v.string()),
		suggestionId: v.optional(v.id("expenseSuggestions")),
		errorMessage: v.optional(v.string()),
	},
	handler: async (ctx, { id, status, driveFileId, suggestionId, errorMessage }) => {
		const { userId } = await requireAuth(ctx)
		const claim = await ctx.db.get(id)
		if (!claim || claim.userId !== userId) throw new Error("Claim not found")

		const patch: Record<string, unknown> = { status, updatedAt: Date.now() }
		if (driveFileId !== undefined) patch.driveFileId = driveFileId
		if (suggestionId !== undefined) patch.suggestionId = suggestionId
		if (errorMessage !== undefined) patch.errorMessage = errorMessage

		await ctx.db.patch(id, patch)
	},
})

/**
 * Check if all attachments for a message are in terminal state.
 * Used by gmail_mark_processed to decide whether to relabel.
 */
export const allTerminalForMessage = query({
	args: { gmailMessageId: v.string() },
	handler: async (ctx, { gmailMessageId }) => {
		const { userId } = await requireAuth(ctx)

		const claims = await ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId)
			)
			.collect()

		if (claims.length === 0) return false

		return claims.every((c) => (TERMINAL_STATUSES as readonly string[]).includes(c.status))
	},
})

/**
 * Mark all terminal claims for a message as "relabeled".
 */
export const markRelabeled = mutation({
	args: { gmailMessageId: v.string() },
	handler: async (ctx, { gmailMessageId }) => {
		const { userId } = await requireAuth(ctx)

		const claims = await ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId)
			)
			.collect()

		for (const claim of claims) {
			if ((TERMINAL_STATUSES as readonly string[]).includes(claim.status)) {
				await ctx.db.patch(claim._id, { status: "relabeled", updatedAt: Date.now() })
			}
		}
	},
})
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd apps/ops && npx vitest run convex/attachmentClaims.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add apps/ops/convex/attachmentClaims.ts apps/ops/convex/attachmentClaims.test.ts
git commit -m "feat(ops): add attachment claims with atomic locking and tests"
```

---

## Task 5: Google provider registration

**Files:**
- Modify: `apps/ops/lib/connections/providers.ts`

- [ ] **Step 1: Add the `google_invoices` provider**

Add to the `providers` array in `apps/ops/lib/connections/providers.ts`:

```ts
	{
		id: "google_invoices",
		name: "Google Invoices",
		logo: "/logos/gmail.svg",
		authType: "oauth2",
		description: "Classer automatiquement les factures Gmail dans Google Drive.",
		capabilities: ["Gmail", "Drive", "Filing"],
		authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
		tokenUrl: "https://oauth2.googleapis.com/token",
		scopes: [
			"https://www.googleapis.com/auth/gmail.modify",
			"https://www.googleapis.com/auth/drive.file",
		],
		credentialsKey: "google",
		tools: [
			"gmail_list_invoices",
			"process_invoice_pdf",
			"drive_upload_invoice",
			"create_invoice_suggestion",
			"gmail_mark_processed",
		],
	},
```

This reuses the shared `credentialsKey: "google"` (same Google Cloud project as `google_drive` and `google_mail`), but with invoice-specific scopes. The existing OAuth authorize/callback routes work out of the box with no changes.

- [ ] **Step 2: Verify the provider appears in the callback health check**

The callback route at `app/api/connections/[provider]/callback/route.ts` has a `healthCheck` function with a `switch` on provider id. Add a case for `google_invoices`:

```ts
			case "google_invoices": {
				// Check both Gmail and Drive access
				const [gmailRes, driveRes] = await Promise.all([
					fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
					fetch("https://www.googleapis.com/drive/v3/about?fields=user", {
						headers: { Authorization: `Bearer ${accessToken}` },
					}),
				])
				return gmailRes.ok && driveRes.ok
			}
```

And in `fetchAccountInfo`, the existing `google_drive` / `google_mail` case already covers Google userinfo. Add `"google_invoices"` to the same case:

```ts
			case "google_drive":
			case "google_mail":
			case "google_invoices": {
```

- [ ] **Step 3: Commit**

```bash
git add apps/ops/lib/connections/providers.ts "apps/ops/app/api/connections/[provider]/callback/route.ts"
git commit -m "feat(ops): add google_invoices provider with gmail.modify + drive.file scopes"
```

---

## Task 6: Convex Google actions (Gmail + Drive + LLM extraction)

**Files:**
- Create: `apps/ops/convex/google.ts`

This is the largest file. It contains 5 Convex actions corresponding to the 5 worker tools. Each action handles auth, API calls, and claim status updates.

- [ ] **Step 1: Create `apps/ops/convex/google.ts`**

```ts
import Anthropic from "@anthropic-ai/sdk"
import { v } from "convex/values"
import { action, internalMutation, internalQuery } from "./_generated/server"
import { internal } from "./_generated/api"
import { requireAuth } from "./lib/auth"
import { refreshGoogleTokenIfNeeded } from "./lib/google-auth"
import { buildInvoiceFileName } from "./lib/invoice-naming"

// ── Internal helpers for auth ──────────────────────────────────────

export const internalGetGoogleConnection = internalQuery({
	args: { userId: v.string() },
	handler: async (ctx, { userId }) => {
		return ctx.db
			.query("connections")
			.withIndex("by_user_provider", (q) => q.eq("userId", userId).eq("provider", "google_invoices"))
			.first()
	},
})

export const internalPatchConnection = internalMutation({
	args: {
		id: v.id("connections"),
		fields: v.object({
			accessToken: v.optional(v.string()),
			tokenExpiresAt: v.optional(v.number()),
			status: v.optional(v.string()),
			errorMessage: v.optional(v.string()),
		}),
	},
	handler: async (ctx, { id, fields }) => {
		await ctx.db.patch(id, fields)
	},
})

/**
 * Get a valid access token inside an action.
 */
async function getAccessToken(ctx: any, userId: string): Promise<string> {
	const connection = await ctx.runQuery(internal.google.internalGetGoogleConnection, { userId })
	if (!connection) throw new Error("Google Invoices not connected. Go to Settings > Connections.")

	const config = await ctx.runQuery(internal.providerConfigs.internalGetByProvider, {
		userId,
		provider: "google", // credentialsKey
	})
	if (!config?.clientId || !config?.clientSecret) {
		throw new Error("Google credentials not configured. Go to Settings > Connections.")
	}

	return refreshGoogleTokenIfNeeded(
		connection,
		config,
		async (id, fields) => {
			await ctx.runMutation(internal.google.internalPatchConnection, { id: id as any, fields: fields as any })
		}
	)
}

// ── Gmail helpers ──────────────────────────────────────────────────

const GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"

async function gmailFetch(accessToken: string, path: string): Promise<any> {
	const res = await fetch(`${GMAIL_BASE}${path}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})
	if (!res.ok) {
		const body = await res.text()
		throw new Error(`Gmail API error ${res.status}: ${body}`)
	}
	return res.json()
}

// ── 1. gmail_list_invoices ─────────────────────────────────────────

export const listInvoiceEmails = action({
	args: {},
	handler: async (ctx) => {
		const { userId } = await requireAuth(ctx)
		const accessToken = await getAccessToken(ctx, userId)

		// Search for messages with label "facture" but not "facture/traitée"
		const query = "label:facture -label:facture/traitée has:attachment filename:pdf"
		const searchRes = await gmailFetch(accessToken, `/messages?q=${encodeURIComponent(query)}&maxResults=50`)

		const messageIds: string[] = (searchRes.messages ?? []).map((m: any) => m.id)
		if (messageIds.length === 0) return { emails: [] }

		// Fetch each message metadata (not body)
		const emails = []
		for (const messageId of messageIds) {
			const msg = await gmailFetch(accessToken, `/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`)

			const headers = msg.payload?.headers ?? []
			const from = headers.find((h: any) => h.name === "From")?.value ?? ""
			const subject = headers.find((h: any) => h.name === "Subject")?.value ?? ""
			const dateHeader = headers.find((h: any) => h.name === "Date")?.value ?? ""

			// Collect PDF attachments from parts
			const attachments: Array<{ attachmentId: string; filename: string; mimeType: string; sizeBytes: number }> = []
			function walkParts(parts: any[]) {
				for (const part of parts) {
					if (part.mimeType === "application/pdf" && part.body?.attachmentId) {
						attachments.push({
							attachmentId: part.body.attachmentId,
							filename: part.filename ?? "invoice.pdf",
							mimeType: part.mimeType,
							sizeBytes: part.body.size ?? 0,
						})
					}
					if (part.parts) walkParts(part.parts)
				}
			}
			if (msg.payload?.parts) walkParts(msg.payload.parts)

			if (attachments.length > 0) {
				emails.push({
					messageId,
					from,
					subject,
					receivedAt: dateHeader ? new Date(dateHeader).toISOString() : new Date(Number(msg.internalDate)).toISOString(),
					attachments,
				})
			}
		}

		return { emails }
	},
})

// ── 2. process_invoice_pdf (claim + extract) ───────────────────────

export const processInvoicePdf = action({
	args: {
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		missionId: v.optional(v.string()),
	},
	handler: async (ctx, { gmailMessageId, gmailAttachmentId, missionId }) => {
		const { userId } = await requireAuth(ctx)

		// Step 1: Claim
		const claimResult = await ctx.runMutation(internal.attachmentClaims.internalClaim, {
			userId,
			gmailMessageId,
			gmailAttachmentId,
			missionId,
		})

		if (!claimResult.claimed) {
			return { skipped: claimResult.reason === "terminal" ? "already_terminal" : "already_claimed" }
		}

		const claimId = claimResult.claimId!

		try {
			// Step 2: Fetch PDF from Gmail
			const accessToken = await getAccessToken(ctx, userId)
			const attachment = await gmailFetch(
				accessToken,
				`/messages/${gmailMessageId}/attachments/${gmailAttachmentId}`
			)
			const base64Data = attachment.data // Gmail returns URL-safe base64

			// Step 3: Extract via Haiku vision
			const anthropic = new Anthropic()
			// Convert URL-safe base64 to standard base64
			const standardBase64 = base64Data.replace(/-/g, "+").replace(/_/g, "/")

			const response = await anthropic.messages.create({
				model: "claude-haiku-4-5-20251001",
				max_tokens: 500,
				messages: [
					{
						role: "user",
						content: [
							{
								type: "image",
								source: {
									type: "base64",
									media_type: "application/pdf",
									data: standardBase64,
								},
							},
							{
								type: "text",
								text: `Extract invoice metadata from this PDF. Return ONLY valid JSON:
{
  "vendor": "Company name (normalized, e.g. 'OVH' not 'OVH SAS')",
  "invoiceDate": "YYYY-MM-DD (the invoice date, not due date)",
  "amountCents": 2399 (total TTC in cents),
  "invoiceNumber": "INV-2026-001 (if found, otherwise null)",
  "currency": "EUR (3-letter code)",
  "confidence": 0.95 (0 to 1, how confident you are)
}`,
							},
						],
					},
				],
			})

			const text = response.content[0].type === "text" ? response.content[0].text : ""
			let extracted: {
				vendor: string
				invoiceDate: string
				amountCents: number
				invoiceNumber?: string
				currency: string
				confidence: number
			}

			try {
				// Parse JSON from response (might be wrapped in ```json blocks)
				const jsonMatch = text.match(/\{[\s\S]*\}/)
				if (!jsonMatch) throw new Error("No JSON found")
				extracted = JSON.parse(jsonMatch[0])
			} catch {
				await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
					id: claimId as any,
					status: "failed",
					errorMessage: "extraction_failed: could not parse LLM response",
				})
				return { error: "extraction_failed" as const }
			}

			// Validate confidence
			if (extracted.confidence < 0.7) {
				await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
					id: claimId as any,
					status: "failed",
					errorMessage: `low_confidence: ${extracted.confidence}`,
				})
				return { error: "low_confidence" as const }
			}

			// Validate date
			const year = Number.parseInt(extracted.invoiceDate?.slice(0, 4) ?? "0")
			const invoiceDate = new Date(extracted.invoiceDate)
			const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			if (year < 2020 || invoiceDate > thirtyDaysFromNow) {
				await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
					id: claimId as any,
					status: "failed",
					errorMessage: `invalid_date: ${extracted.invoiceDate}`,
				})
				return { error: "invalid_date" as const }
			}

			// Success — mark as extracted
			await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
				id: claimId as any,
				status: "extracted",
			})

			return {
				vendor: extracted.vendor,
				invoiceDate: extracted.invoiceDate,
				amountCents: extracted.amountCents,
				invoiceNumber: extracted.invoiceNumber ?? undefined,
				currency: extracted.currency,
				confidence: extracted.confidence,
			}
		} catch (err) {
			await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
				id: claimId as any,
				status: "failed",
				errorMessage: `extraction_failed: ${String(err).slice(0, 200)}`,
			})
			return { error: "extraction_failed" as const }
		}
	},
})

// ── 3. drive_upload_invoice ────────────────────────────────────────

const DRIVE_BASE = "https://www.googleapis.com/drive/v3"
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3"

export const driveUploadInvoice = action({
	args: {
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		vendor: v.string(),
		invoiceDate: v.string(),
		amountCents: v.number(),
	},
	handler: async (ctx, { gmailMessageId, gmailAttachmentId, vendor, invoiceDate, amountCents }) => {
		const { userId } = await requireAuth(ctx)
		const accessToken = await getAccessToken(ctx, userId)

		// Get configured folder ID
		const folderSetting = await ctx.runQuery(internal.settings.internalGet, {
			userId,
			key: "googleDriveInvoiceFolderId",
		})

		if (!folderSetting) {
			return { error: "no_folder_configured" }
		}

		const parentFolderId = folderSetting

		// Ensure YYYY/MM subfolder exists
		const year = invoiceDate.slice(0, 4)
		const month = invoiceDate.slice(5, 7)

		const yearFolderId = await ensureSubfolder(accessToken, parentFolderId, year)
		const monthFolderId = await ensureSubfolder(accessToken, yearFolderId, month)

		// Re-fetch PDF from Gmail
		const attachment = await gmailFetch(
			accessToken,
			`/messages/${gmailMessageId}/attachments/${gmailAttachmentId}`
		)
		const base64Data = attachment.data
		const standardBase64 = base64Data.replace(/-/g, "+").replace(/_/g, "/")
		const pdfBuffer = Buffer.from(standardBase64, "base64")

		// Build filename (check for collisions)
		let suffix = 1
		let fileName = buildInvoiceFileName(vendor, invoiceDate, amountCents)

		while (await fileExistsInFolder(accessToken, monthFolderId, fileName)) {
			suffix++
			fileName = buildInvoiceFileName(vendor, invoiceDate, amountCents, suffix)
		}

		// Upload
		const metadata = {
			name: fileName,
			parents: [monthFolderId],
			mimeType: "application/pdf",
		}

		const boundary = "blazz_invoice_upload"
		const body = [
			`--${boundary}`,
			"Content-Type: application/json; charset=UTF-8",
			"",
			JSON.stringify(metadata),
			`--${boundary}`,
			"Content-Type: application/pdf",
			"Content-Transfer-Encoding: base64",
			"",
			standardBase64,
			`--${boundary}--`,
		].join("\r\n")

		const uploadRes = await fetch(`${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id,webViewLink`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": `multipart/related; boundary=${boundary}`,
			},
			body,
		})

		if (!uploadRes.ok) {
			const errBody = await uploadRes.text()
			return { error: `drive_upload_failed: ${errBody.slice(0, 200)}` }
		}

		const fileData = await uploadRes.json()

		// Update claim status
		// Find the claim for this attachment
		const claims: any[] = await ctx.runQuery(internal.attachmentClaims.internalFindByAttachment, {
			userId,
			gmailMessageId,
			gmailAttachmentId,
		})
		if (claims.length > 0) {
			await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
				id: claims[0]._id,
				status: "uploaded",
				driveFileId: fileData.id,
			})
		}

		return {
			fileId: fileData.id as string,
			fileName,
			webViewLink: fileData.webViewLink as string,
			folderPath: `${year}/${month}`,
		}
	},
})

async function ensureSubfolder(accessToken: string, parentId: string, name: string): Promise<string> {
	// Check if folder exists
	const q = `'${parentId}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
	const searchRes = await fetch(`${DRIVE_BASE}/files?q=${encodeURIComponent(q)}&fields=files(id)`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})

	if (searchRes.ok) {
		const data = await searchRes.json()
		if (data.files?.length > 0) return data.files[0].id
	}

	// Create folder
	const createRes = await fetch(`${DRIVE_BASE}/files`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name,
			mimeType: "application/vnd.google-apps.folder",
			parents: [parentId],
		}),
	})

	if (!createRes.ok) {
		const errBody = await createRes.text()
		throw new Error(`Failed to create folder ${name}: ${errBody}`)
	}

	const folder = await createRes.json()
	return folder.id
}

async function fileExistsInFolder(accessToken: string, folderId: string, fileName: string): Promise<boolean> {
	const q = `'${folderId}' in parents and name='${fileName}' and trashed=false`
	const res = await fetch(`${DRIVE_BASE}/files?q=${encodeURIComponent(q)}&fields=files(id)`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	})
	if (!res.ok) return false
	const data = await res.json()
	return (data.files?.length ?? 0) > 0
}

// ── 4. create_invoice_suggestion ───────────────────────────────────

export const createInvoiceSuggestion = action({
	args: {
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		vendor: v.string(),
		invoiceDate: v.string(),
		amountCents: v.number(),
		invoiceNumber: v.optional(v.string()),
		currency: v.string(),
		driveFileId: v.string(),
		driveWebViewLink: v.string(),
		confidence: v.number(),
	},
	handler: async (ctx, args) => {
		const { userId } = await requireAuth(ctx)

		const result = await ctx.runMutation(internal.expenseSuggestions.insertFromGmail, {
			userId,
			gmailMessageId: args.gmailMessageId,
			gmailAttachmentId: args.gmailAttachmentId,
			vendor: args.vendor,
			invoiceDate: args.invoiceDate,
			amountCents: args.amountCents,
			invoiceNumber: args.invoiceNumber,
			currency: args.currency,
			driveFileId: args.driveFileId,
			driveWebViewLink: args.driveWebViewLink,
			confidence: args.confidence,
		})

		// Update claim
		const claims: any[] = await ctx.runQuery(internal.attachmentClaims.internalFindByAttachment, {
			userId,
			gmailMessageId: args.gmailMessageId,
			gmailAttachmentId: args.gmailAttachmentId,
		})
		if (claims.length > 0) {
			await ctx.runMutation(internal.attachmentClaims.internalUpdateStatus, {
				id: claims[0]._id,
				status: "suggested",
				suggestionId: result.suggestionId as any,
			})
		}

		return { suggestionId: result.suggestionId }
	},
})

// ── 5. gmail_mark_processed ────────────────────────────────────────

export const gmailMarkProcessed = action({
	args: { gmailMessageId: v.string() },
	handler: async (ctx, { gmailMessageId }) => {
		const { userId } = await requireAuth(ctx)

		// Check all attachments are terminal
		const allTerminal = await ctx.runQuery(internal.attachmentClaims.internalAllTerminalForMessage, {
			userId,
			gmailMessageId,
		})

		if (!allTerminal) {
			return { ok: true, relabeled: false }
		}

		const accessToken = await getAccessToken(ctx, userId)

		// Get or create "facture/traitée" label
		const labelsRes = await gmailFetch(accessToken, "/labels")
		const labels: Array<{ id: string; name: string }> = labelsRes.labels ?? []

		let processedLabelId = labels.find((l) => l.name === "facture/traitée")?.id
		if (!processedLabelId) {
			const createRes = await fetch(`${GMAIL_BASE}/labels`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: "facture/traitée" }),
			})
			if (createRes.ok) {
				const label = await createRes.json()
				processedLabelId = label.id
			}
		}

		const factureLabelId = labels.find((l) => l.name === "facture")?.id

		// Modify message labels
		const modifyBody: { addLabelIds?: string[]; removeLabelIds?: string[] } = {}
		if (processedLabelId) modifyBody.addLabelIds = [processedLabelId]
		if (factureLabelId) modifyBody.removeLabelIds = [factureLabelId]

		await fetch(`${GMAIL_BASE}/messages/${gmailMessageId}/modify`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(modifyBody),
		})

		// Mark claims as relabeled
		await ctx.runMutation(internal.attachmentClaims.internalMarkRelabeled, {
			userId,
			gmailMessageId,
		})

		return { ok: true, relabeled: true }
	},
})
```

- [ ] **Step 2: Add internal versions of attachmentClaims functions**

The actions above call `internal.*` functions. Add these to `apps/ops/convex/attachmentClaims.ts`:

```ts
import { internalMutation, internalQuery } from "./_generated/server"

// ... (add after the existing exports)

const STALE_TTL_MS = 10 * 60 * 1000
const TERMINAL_STATUSES = ["suggested", "relabeled", "failed"] as const

export const internalClaim = internalMutation({
	args: {
		userId: v.string(),
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		missionId: v.optional(v.string()),
	},
	handler: async (ctx, { userId, gmailMessageId, gmailAttachmentId, missionId }) => {
		const existing = await ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message_attachment", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId).eq("gmailAttachmentId", gmailAttachmentId)
			)
			.first()

		if (existing) {
			if ((TERMINAL_STATUSES as readonly string[]).includes(existing.status)) {
				return { claimed: false, reason: "terminal" as const, claimId: null }
			}
			if (existing.claimedAt < Date.now() - STALE_TTL_MS) {
				await ctx.db.patch(existing._id, {
					missionId,
					status: "claimed",
					claimedAt: Date.now(),
					updatedAt: Date.now(),
				})
				return { claimed: true, reason: null, claimId: existing._id }
			}
			return { claimed: false, reason: "locked" as const, claimId: null }
		}

		const claimId = await ctx.db.insert("attachmentClaims", {
			userId,
			gmailMessageId,
			gmailAttachmentId,
			missionId,
			status: "claimed",
			claimedAt: Date.now(),
			updatedAt: Date.now(),
		})

		return { claimed: true, reason: null, claimId }
	},
})

export const internalUpdateStatus = internalMutation({
	args: {
		id: v.id("attachmentClaims"),
		status: v.union(
			v.literal("extracted"),
			v.literal("uploaded"),
			v.literal("suggested"),
			v.literal("relabeled"),
			v.literal("failed"),
		),
		driveFileId: v.optional(v.string()),
		suggestionId: v.optional(v.id("expenseSuggestions")),
		errorMessage: v.optional(v.string()),
	},
	handler: async (ctx, { id, status, driveFileId, suggestionId, errorMessage }) => {
		const patch: Record<string, unknown> = { status, updatedAt: Date.now() }
		if (driveFileId !== undefined) patch.driveFileId = driveFileId
		if (suggestionId !== undefined) patch.suggestionId = suggestionId
		if (errorMessage !== undefined) patch.errorMessage = errorMessage
		await ctx.db.patch(id, patch)
	},
})

export const internalFindByAttachment = internalQuery({
	args: {
		userId: v.string(),
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
	},
	handler: async (ctx, { userId, gmailMessageId, gmailAttachmentId }) => {
		return ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message_attachment", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId).eq("gmailAttachmentId", gmailAttachmentId)
			)
			.collect()
	},
})

export const internalAllTerminalForMessage = internalQuery({
	args: {
		userId: v.string(),
		gmailMessageId: v.string(),
	},
	handler: async (ctx, { userId, gmailMessageId }) => {
		const claims = await ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId)
			)
			.collect()
		if (claims.length === 0) return false
		return claims.every((c) => (TERMINAL_STATUSES as readonly string[]).includes(c.status))
	},
})

export const internalMarkRelabeled = internalMutation({
	args: {
		userId: v.string(),
		gmailMessageId: v.string(),
	},
	handler: async (ctx, { userId, gmailMessageId }) => {
		const claims = await ctx.db
			.query("attachmentClaims")
			.withIndex("by_user_message", (q) =>
				q.eq("userId", userId).eq("gmailMessageId", gmailMessageId)
			)
			.collect()
		for (const claim of claims) {
			if ((TERMINAL_STATUSES as readonly string[]).includes(claim.status)) {
				await ctx.db.patch(claim._id, { status: "relabeled", updatedAt: Date.now() })
			}
		}
	},
})
```

- [ ] **Step 3: Add internal settings query**

Add to `apps/ops/convex/settings.ts`:

```ts
import { internalQuery } from "./_generated/server"

export const internalGet = internalQuery({
	args: { userId: v.string(), key: v.string() },
	handler: async (ctx, { userId, key }) => {
		const setting = await ctx.db
			.query("settings")
			.withIndex("by_user_key", (q) => q.eq("userId", userId).eq("key", key))
			.first()
		return setting?.value ?? null
	},
})
```

- [ ] **Step 4: Verify types compile**

Run: `cd apps/ops && npx tsc --noEmit --skipLibCheck 2>&1 | head -30`
Expected: No type errors in the new files (existing errors are acceptable due to `typescript.ignoreBuildErrors: true`)

- [ ] **Step 5: Commit**

```bash
git add apps/ops/convex/google.ts apps/ops/convex/attachmentClaims.ts apps/ops/convex/settings.ts
git commit -m "feat(ops): add Gmail/Drive/LLM extraction Convex actions for invoice filing"
```

---

## Task 7: Extend expenseSuggestions for Gmail source

**Files:**
- Modify: `apps/ops/convex/expenseSuggestions.ts`

- [ ] **Step 1: Add `insertFromGmail` internal mutation**

Add at the end of `apps/ops/convex/expenseSuggestions.ts`:

```ts
export const insertFromGmail = internalMutation({
	args: {
		userId: v.string(),
		gmailMessageId: v.string(),
		gmailAttachmentId: v.string(),
		vendor: v.string(),
		invoiceDate: v.string(),
		amountCents: v.number(),
		invoiceNumber: v.optional(v.string()),
		currency: v.string(),
		driveFileId: v.string(),
		driveWebViewLink: v.string(),
		confidence: v.number(),
	},
	handler: async (ctx, args) => {
		// Idempotence check
		const existing = await ctx.db
			.query("expenseSuggestions")
			.withIndex("by_user_attachment", (q) =>
				q.eq("userId", args.userId)
					.eq("gmailMessageId", args.gmailMessageId)
					.eq("gmailAttachmentId", args.gmailAttachmentId)
			)
			.first()

		if (existing) {
			return { suggestionId: existing._id, created: false }
		}

		const id = await ctx.db.insert("expenseSuggestions", {
			userId: args.userId,
			source: "gmail",
			status: "pending",
			label: args.vendor,
			amountCents: args.amountCents,
			date: args.invoiceDate,
			confidence: args.confidence,
			syncedAt: Date.now(),
			gmailMessageId: args.gmailMessageId,
			gmailAttachmentId: args.gmailAttachmentId,
			driveFileId: args.driveFileId,
			driveWebViewLink: args.driveWebViewLink,
			invoiceNumber: args.invoiceNumber,
			currency: args.currency,
		})

		return { suggestionId: id, created: true }
	},
})
```

- [ ] **Step 2: Update `accept()` to handle gmail source**

Replace the `accept` mutation handler to handle both sources:

```ts
export const accept = mutation({
	args: { id: v.id("expenseSuggestions") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const suggestion = await ctx.db.get(id)
		if (!suggestion || suggestion.userId !== userId) throw new Error("Not found")
		if (suggestion.status !== "pending") throw new Error("Already processed")

		if (suggestion.source === "gmail") {
			await ctx.db.insert("expenses", {
				userId,
				type: "invoice",
				date: suggestion.date,
				amountCents: suggestion.amountCents,
				notes: suggestion.label,
				vendor: suggestion.label,
				invoiceNumber: suggestion.invoiceNumber,
				driveFileId: suggestion.driveFileId,
				driveWebViewLink: suggestion.driveWebViewLink,
				gmailMessageId: suggestion.gmailMessageId,
				gmailAttachmentId: suggestion.gmailAttachmentId,
				createdAt: Date.now(),
			})
		} else {
			// Qonto source (existing behavior)
			await ctx.db.insert("expenses", {
				userId,
				type: "restaurant",
				date: suggestion.date,
				amountCents: suggestion.amountCents,
				notes: suggestion.label,
				qontoTransactionId: suggestion.qontoTransactionId,
				createdAt: Date.now(),
			})
		}

		await ctx.db.patch(id, { status: "accepted" })
	},
})
```

- [ ] **Step 3: Update `acceptAll()` similarly**

Update the `acceptAll` mutation to handle both sources using the same logic.

- [ ] **Step 4: Update `listProcessedTransactionIds` to not break on gmail suggestions**

The `listProcessedTransactionIds` currently maps `.qontoTransactionId`. It needs a null filter:

```ts
return [...pending, ...accepted]
	.map((s) => s.qontoTransactionId)
	.filter((id): id is string => id != null)
```

- [ ] **Step 5: Write tests for gmail suggestions**

Extend or create `apps/ops/convex/expenseSuggestions.test.ts` (follow the `convex-test` pattern from `clients.test.ts`):

```ts
import { convexTest } from "convex-test"
import { describe, expect, it } from "vitest"
import { api } from "./_generated/api"
import schema from "./test.schema"

const modules = import.meta.glob("./**/*.*s")

function setup() {
	const t = convexTest(schema, modules)
	const asUser = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
	return { t, asUser }
}

describe("expenseSuggestions gmail", () => {
	it("accepts a gmail suggestion and creates invoice expense", async () => {
		const { t, asUser } = setup()

		// Insert directly via internal mutation (simulating the action)
		const id = await t.run(async (ctx) => {
			return ctx.db.insert("expenseSuggestions", {
				userId: "user1",
				source: "gmail",
				status: "pending",
				label: "OVH",
				amountCents: 2399,
				date: "2026-04-11",
				confidence: 0.95,
				syncedAt: Date.now(),
				gmailMessageId: "msg1",
				gmailAttachmentId: "att1",
				driveFileId: "drive123",
				driveWebViewLink: "https://drive.google.com/file/d/drive123",
				invoiceNumber: "INV-001",
				currency: "EUR",
			})
		})

		await asUser.mutation(api.expenseSuggestions.accept, { id })

		// Verify the expense was created with type "invoice"
		const expenses = await asUser.query(api.expenses.list, {})
		expect(expenses).toHaveLength(1)
		expect(expenses[0].type).toBe("invoice")
		expect(expenses[0].vendor).toBe("OVH")
		expect(expenses[0].driveFileId).toBe("drive123")
		expect(expenses[0].gmailMessageId).toBe("msg1")
	})

	it("accept qonto suggestion still works (regression)", async () => {
		const { t, asUser } = setup()

		const id = await t.run(async (ctx) => {
			return ctx.db.insert("expenseSuggestions", {
				userId: "user1",
				source: "qonto",
				status: "pending",
				label: "Restaurant Le Bon",
				amountCents: 3500,
				date: "2026-04-10",
				confidence: 0.9,
				syncedAt: Date.now(),
				qontoTransactionId: "txn123",
			})
		})

		await asUser.mutation(api.expenseSuggestions.accept, { id })

		const expenses = await asUser.query(api.expenses.list, {})
		expect(expenses).toHaveLength(1)
		expect(expenses[0].type).toBe("restaurant")
	})
})
```

- [ ] **Step 6: Run tests**

Run: `cd apps/ops && npx vitest run convex/expenseSuggestions.test.ts`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add apps/ops/convex/expenseSuggestions.ts apps/ops/convex/expenseSuggestions.test.ts
git commit -m "feat(ops): extend expenseSuggestions for gmail source with accept() + insertFromGmail + tests"
```

---

## Task 8: Extend expenses for invoice type

**Files:**
- Modify: `apps/ops/convex/expenses.ts`

- [ ] **Step 1: Update the `list` query type filter**

In `apps/ops/convex/expenses.ts`, the `list` query has:

```ts
args: {
	type: v.optional(v.union(v.literal("restaurant"), v.literal("mileage"))),
```

Add `v.literal("invoice")`:

```ts
args: {
	type: v.optional(v.union(v.literal("restaurant"), v.literal("mileage"), v.literal("invoice"))),
```

- [ ] **Step 2: Update the `create` mutation if it exists**

Check the `create` mutation's type validator — add `"invoice"` to the union. Ensure it does not require `guests`/`purpose` for invoice type. If the create mutation uses a strict validator for `type`, extend it.

- [ ] **Step 3: Commit**

```bash
git add apps/ops/convex/expenses.ts
git commit -m "feat(ops): add 'invoice' type to expenses validators"
```

---

## Task 9: Worker tools

**Files:**
- Create: `apps/ops/worker/src/tools/invoices.ts`
- Modify: `apps/ops/worker/src/tools/index.ts`

- [ ] **Step 1: Create `apps/ops/worker/src/tools/invoices.ts`**

```ts
import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"

export function invoiceTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "gmail_list_invoices",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "gmail_list_invoices",
					description:
						'List emails labeled "facture" that have PDF attachments and are not yet processed. Returns message IDs and attachment metadata.',
					parameters: { type: "object", properties: {}, required: [] },
				},
			},
			execute: async () => {
				try {
					return await convex.action(api.google.listInvoiceEmails, {})
				} catch (err) {
					return { error: String(err) }
				}
			},
		},
		{
			name: "process_invoice_pdf",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "process_invoice_pdf",
					description:
						"Claim an attachment and extract invoice metadata (vendor, date, amount) via LLM vision. Returns extracted data, or {skipped} if already processed, or {error} if extraction fails.",
					parameters: {
						type: "object",
						properties: {
							messageId: { type: "string", description: "Gmail message ID" },
							attachmentId: { type: "string", description: "Gmail attachment ID" },
						},
						required: ["messageId", "attachmentId"],
					},
				},
			},
			execute: async (args) => {
				try {
					return await convex.action(api.google.processInvoicePdf, {
						gmailMessageId: args.messageId as string,
						gmailAttachmentId: args.attachmentId as string,
					})
				} catch (err) {
					return { error: String(err) }
				}
			},
		},
		{
			name: "drive_upload_invoice",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "drive_upload_invoice",
					description:
						"Upload the invoice PDF to Google Drive in the configured folder (YYYY/MM structure). Returns the Drive file ID, file name, and web view link.",
					parameters: {
						type: "object",
						properties: {
							messageId: { type: "string", description: "Gmail message ID" },
							attachmentId: { type: "string", description: "Gmail attachment ID" },
							vendor: { type: "string", description: "Vendor name (from extraction)" },
							invoiceDate: { type: "string", description: "Invoice date YYYY-MM-DD" },
							amountCents: { type: "number", description: "Total TTC in cents" },
						},
						required: ["messageId", "attachmentId", "vendor", "invoiceDate", "amountCents"],
					},
				},
			},
			execute: async (args) => {
				try {
					return await convex.action(api.google.driveUploadInvoice, {
						gmailMessageId: args.messageId as string,
						gmailAttachmentId: args.attachmentId as string,
						vendor: args.vendor as string,
						invoiceDate: args.invoiceDate as string,
						amountCents: args.amountCents as number,
					})
				} catch (err) {
					return { error: String(err) }
				}
			},
		},
		{
			name: "create_invoice_suggestion",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "create_invoice_suggestion",
					description:
						"Create an expense suggestion from the extracted invoice data. The user will review and accept/reject it in the UI.",
					parameters: {
						type: "object",
						properties: {
							messageId: { type: "string", description: "Gmail message ID" },
							attachmentId: { type: "string", description: "Gmail attachment ID" },
							vendor: { type: "string" },
							invoiceDate: { type: "string", description: "YYYY-MM-DD" },
							amountCents: { type: "number" },
							invoiceNumber: { type: "string" },
							currency: { type: "string", description: "3-letter currency code" },
							driveFileId: { type: "string" },
							driveWebViewLink: { type: "string" },
							confidence: { type: "number", description: "0 to 1" },
						},
						required: [
							"messageId",
							"attachmentId",
							"vendor",
							"invoiceDate",
							"amountCents",
							"currency",
							"driveFileId",
							"driveWebViewLink",
							"confidence",
						],
					},
				},
			},
			execute: async (args) => {
				try {
					return await convex.action(api.google.createInvoiceSuggestion, {
						gmailMessageId: args.messageId as string,
						gmailAttachmentId: args.attachmentId as string,
						vendor: args.vendor as string,
						invoiceDate: args.invoiceDate as string,
						amountCents: args.amountCents as number,
						invoiceNumber: args.invoiceNumber as string | undefined,
						currency: args.currency as string,
						driveFileId: args.driveFileId as string,
						driveWebViewLink: args.driveWebViewLink as string,
						confidence: args.confidence as number,
					})
				} catch (err) {
					return { error: String(err) }
				}
			},
		},
		{
			name: "gmail_mark_processed",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "gmail_mark_processed",
					description:
						'Mark a Gmail message as processed by removing label "facture" and adding "facture/traitée". Only relabels if ALL attachments are in terminal state.',
					parameters: {
						type: "object",
						properties: {
							messageId: { type: "string", description: "Gmail message ID" },
						},
						required: ["messageId"],
					},
				},
			},
			execute: async (args) => {
				try {
					return await convex.action(api.google.gmailMarkProcessed, {
						gmailMessageId: args.messageId as string,
					})
				} catch (err) {
					return { error: String(err) }
				}
			},
		},
	]
}
```

- [ ] **Step 2: Register in tool index**

In `apps/ops/worker/src/tools/index.ts`, add:

```ts
import { invoiceTools } from "./invoices"
```

And update `createToolRegistry`:

```ts
export function createToolRegistry(convex: ConvexHttpClient): Tool[] {
	return [...financeTools(convex), ...timeTools(convex), ...productTools(), ...sharedTools(convex), ...agentTools(convex), ...invoiceTools(convex)]
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/ops/worker/src/tools/invoices.ts apps/ops/worker/src/tools/index.ts
git commit -m "feat(ops): add 5 invoice filing worker tools"
```

---

## Task 10: Account-manager mode + cron

**Files:**
- Modify: `apps/ops/agents/account-manager/SKILL.md`
- Modify: `apps/ops/convex/crons.ts`

- [ ] **Step 1: Add `invoice-filing` mode to SKILL.md**

Append to `apps/ops/agents/account-manager/SKILL.md`:

```markdown

## invoice-filing
> Classer les factures fournisseurs reçues par mail.
Tools: gmail_list_invoices, process_invoice_pdf, drive_upload_invoice, create_invoice_suggestion, gmail_mark_processed, create_todo, ask_agent
Prompt: "Récupère tous les mails labelés 'facture' non encore traités via gmail_list_invoices. Si la liste est vide, retourne 'Rien à traiter aujourd'hui' immédiatement sans appeler d'autres tools.

Pour chaque mail, pour chaque attachment PDF :
1. Appelle process_invoice_pdf(messageId, attachmentId) pour claim + extraire.
   - Si retourne { skipped }, passe à l'attachment suivant (déjà traité).
   - Si retourne { error }, crée un todo 'Vérifier facture <subject> / <filename>' et passe au suivant.
2. drive_upload_invoice(messageId, attachmentId, vendor, invoiceDate, amountCents)
3. create_invoice_suggestion(messageId, attachmentId, vendor, invoiceDate, amountCents, currency, driveFileId, driveWebViewLink, confidence)

Quand TOUS les attachments d'un mail sont traités, appelle gmail_mark_processed(messageId).
- Si relabeled: false, certains attachments sont encore en cours — laisse le mail, il sera relabelé au prochain run.

À la fin, résume : N factures classées, M ignorées (avec raisons), total TTC."
```

- [ ] **Step 2: Add invoice-filing cron to `crons.ts`**

Add to `apps/ops/convex/crons.ts`:

```ts
crons.daily("file invoices from gmail", { hourUTC: 7, minuteUTC: 0 }, internal.missions.createInvoiceFilingMission)
```

Note: 7h UTC = 9h Paris time (CET summer). This requires an internal mutation to create the mission. Add to a worker helper file or create a small internal mutation.

- [ ] **Step 3: Create the cron handler**

Add an internal mutation in `apps/ops/convex/missions.ts` (or a new file `apps/ops/convex/cronHandlers.ts`):

```ts
import { internalMutation } from "./_generated/server"

export const createInvoiceFilingMission = internalMutation({
	handler: async (ctx) => {
		const userId = process.env.OPS_USER_ID
		if (!userId) return

		// Find the account-manager agent
		const agent = await ctx.db
			.query("agents")
			.withIndex("by_slug", (q) => q.eq("userId", userId as any).eq("slug", "account-manager"))
			.first()

		if (!agent) return

		await ctx.db.insert("missions", {
			userId: userId as any,
			agentId: agent._id,
			title: "Filing factures Gmail",
			prompt: "Mode invoice-filing : traite les mails labelés 'facture' dans Gmail.",
			status: "todo",
			priority: "medium",
			maxIterations: 120,
			templateId: "invoice-filing",
		})
	},
})
```

- [ ] **Step 4: Commit**

```bash
git add apps/ops/agents/account-manager/SKILL.md apps/ops/convex/crons.ts apps/ops/convex/missions.ts
git commit -m "feat(ops): add invoice-filing mode to account-manager + daily cron"
```

---

## Task 11: Picker UI for Drive folder selection

**Files:**
- Modify: `apps/ops/app/(main)/settings/connections/_client.tsx`

- [ ] **Step 1: Add Drive folder Picker component**

Add a new component section in `_client.tsx` that shows after a `google_invoices` connection is active. It loads the Google Picker SDK, opens a folder picker, and saves the selected folder ID via `settings.set("googleDriveInvoiceFolderId", folderId)`.

Key elements:
- "Choisir le dossier factures" button (only visible when `google_invoices` connection is `active`)
- Load `https://apis.google.com/js/api.js` script dynamically
- Use `google.picker.PickerBuilder` with `DocsView(FOLDERS)` + `setSelectFolderEnabled(true)`
- Pass the connection's `accessToken` and the provider's API key
- On selection: call `settings.set` mutation, show success toast
- Display current folder name if already configured
- "Test connexion" button that calls a Convex action to verify Drive access

This is a UI integration task. The exact code depends on the existing component patterns in the file. The engineer should:
1. Read the full `_client.tsx` file to understand the existing component structure
2. Add a section below the connections list for `google_invoices`-specific config
3. Use the existing `useMutation(api.settings.set)` pattern
4. Handle the script loading with a `useEffect` + script tag injection

- [ ] **Step 2: Test the Picker flow manually**

1. Run `pnpm dev:ops`
2. Go to Settings > Connections
3. Add Google credentials (if not already done)
4. Click "Connecter Google Invoices"
5. After successful OAuth, click "Choisir le dossier factures"
6. Select the target folder in Picker
7. Verify the folder ID is saved (check in Convex dashboard)

- [ ] **Step 3: Commit**

```bash
git add "apps/ops/app/(main)/settings/connections/_client.tsx"
git commit -m "feat(ops): add Google Picker UI for Drive invoice folder selection"
```

---

## Task 12: Integration test — full pipeline

This is a manual validation task, not an automated test.

- [ ] **Step 1: Prepare test Gmail label**

1. In Gmail, create a label `facture-test`
2. Find a real invoice email and apply the `facture-test` label
3. In `apps/ops/convex/google.ts`, temporarily change the Gmail query from `label:facture` to `label:facture-test`

- [ ] **Step 2: Run the pipeline via Mission Control**

1. Start the worker: `cd apps/ops/worker && pnpm dev`
2. In the Ops UI, go to Mission Control
3. Create a mission for account-manager with prompt: "Mode invoice-filing"
4. Watch the agent logs — verify:
   - `gmail_list_invoices` returns the test email
   - `process_invoice_pdf` extracts correct metadata
   - `drive_upload_invoice` creates the PDF in the right folder
   - `create_invoice_suggestion` creates a pending suggestion
   - `gmail_mark_processed` relabels the email

- [ ] **Step 3: Verify in Google Drive**

Open the target folder → YYYY/MM/ → confirm the PDF is named correctly.

- [ ] **Step 4: Verify in Ops UI**

Check the expense suggestions list — confirm the gmail suggestion appears with correct data and a "Voir le PDF" link.

- [ ] **Step 5: Accept the suggestion**

Click "Accepter" on the suggestion → confirm an expense of type `"invoice"` is created with Drive link.

- [ ] **Step 6: Revert test changes**

Change the Gmail query back from `label:facture-test` to `label:facture`.

- [ ] **Step 7: Commit final state**

```bash
git add -A
git commit -m "feat(ops): gmail invoice filer complete — tested end to end"
```
