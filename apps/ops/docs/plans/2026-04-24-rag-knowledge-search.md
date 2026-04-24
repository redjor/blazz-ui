# RAG Knowledge Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exposer un tool MCP `search_knowledge` qui fait de la recherche sémantique sur `notes` + `bookmarks`, indexés en async via une queue + cron + embeddings OpenAI stockés dans une table Convex avec vectorIndex.

**Architecture:** Hooks dans les mutations notes/bookmarks → enqueue dans `embeddingJobs`. Cron toutes les 60 sec bat les jobs par 50, skip si `contentHash` inchangé, appelle OpenAI `text-embedding-3-small`, upsert dans `embeddings` (avec vectorIndex). Le tool MCP embed la query et fait `ctx.vectorSearch`, filtre par score ≥ 0.35.

**Tech Stack:** Convex (httpAction, action, mutation, internalMutation, scheduled cron, vectorIndex), OpenAI embeddings API, TypeScript, vitest + convex-test.

**Spec source:** `apps/ops/docs/plans/2026-04-24-rag-knowledge-search-design.md`

---

## File Structure

**Files créés :**
- `apps/ops/convex/lib/rag/buildIndexableText.ts` — fonction pure qui formatte un doc pour embedding
- `apps/ops/convex/lib/rag/buildIndexableText.test.ts` — tests unitaires
- `apps/ops/convex/lib/rag/contentHash.ts` — fonction pure sha1 via Web Crypto
- `apps/ops/convex/lib/rag/contentHash.test.ts` — tests unitaires
- `apps/ops/convex/lib/rag/openai.ts` — wrapper fetch pour OpenAI embeddings API
- `apps/ops/convex/rag.ts` — queue mutations + indexer action + search action + admin helpers
- `apps/ops/convex/rag.test.ts` — integration tests (convex-test avec fetch mocké)

**Files modifiés :**
- `apps/ops/convex/schema.ts` — ajout tables `embeddingJobs` + `embeddings`
- `apps/ops/convex/test.schema.ts` — idem (utilisé par convex-test)
- `apps/ops/convex/notes.ts` — hooks enqueue dans create/update, cleanup dans remove/archive
- `apps/ops/convex/bookmarks.ts` — hooks enqueue dans create/update/internalCreateFromUrl, cleanup dans remove
- `apps/ops/convex/crons.ts` — registre le cron indexer toutes les 60 sec
- `apps/ops/convex/http.ts` — ajout du case `search_knowledge` dans le switch MCP
- `apps/ops/shared/tool-schemas.ts` — ajout `search_knowledge` dans TOOL_SCHEMAS

---

## Task 1 : Schéma Convex (2 nouvelles tables)

**Files:**
- Modify: `apps/ops/convex/schema.ts`
- Modify: `apps/ops/convex/test.schema.ts`

- [ ] **Step 1.1 — Ajouter `embeddingJobs` et `embeddings` dans `schema.ts`**

Ouvrir `apps/ops/convex/schema.ts`. Trouver la dernière table (avant le `})` final du `defineSchema`). Insérer ces 2 tables **juste avant** la fermeture :

```typescript
	embeddingJobs: defineTable({
		sourceTable: v.union(v.literal("notes"), v.literal("bookmarks")),
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
		attempts: v.number(),
		lastError: v.optional(v.string()),
		createdAt: v.number(),
	}).index("by_created", ["createdAt"]),

	embeddings: defineTable({
		userId: v.string(),
		sourceTable: v.union(v.literal("notes"), v.literal("bookmarks")),
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
		contentHash: v.string(),
		text: v.string(),
		vector: v.array(v.number()),
		updatedAt: v.number(),
	})
		.index("by_source", ["sourceTable", "sourceId"])
		.vectorIndex("by_vector", {
			vectorField: "vector",
			dimensions: 1536,
			filterFields: ["userId", "sourceTable"],
		}),
```

- [ ] **Step 1.2 — Ajouter les mêmes tables dans `test.schema.ts`**

Ouvrir `apps/ops/convex/test.schema.ts`. Même manip que Step 1.1 — insérer les 2 tables **avec la même définition** avant la fermeture `})`.

- [ ] **Step 1.3 — Push Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!` sans erreur.

- [ ] **Step 1.4 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/schema.ts apps/ops/convex/test.schema.ts && git commit -m "feat(ops): add embeddingJobs + embeddings tables for RAG"
```

---

## Task 2 : Pure utils (`buildIndexableText` + `contentHash`)

**Files:**
- Create: `apps/ops/convex/lib/rag/buildIndexableText.ts`
- Create: `apps/ops/convex/lib/rag/buildIndexableText.test.ts`
- Create: `apps/ops/convex/lib/rag/contentHash.ts`
- Create: `apps/ops/convex/lib/rag/contentHash.test.ts`

- [ ] **Step 2.1 — Test `buildIndexableText`**

Create `apps/ops/convex/lib/rag/buildIndexableText.test.ts`:

```typescript
import { describe, expect, it } from "vitest"
import { buildIndexableText } from "./buildIndexableText"

describe("buildIndexableText", () => {
	it("formats a note with title + content", () => {
		const text = buildIndexableText({
			kind: "notes",
			title: "Réunion Coca-Cola",
			contentText: "On a parlé pricing et timeline.",
		})
		expect(text).toBe("Réunion Coca-Cola\n\nOn a parlé pricing et timeline.")
	})

	it("formats a note with empty contentText (trims trailing newlines)", () => {
		const text = buildIndexableText({
			kind: "notes",
			title: "Note vide",
			contentText: undefined,
		})
		expect(text).toBe("Note vide")
	})

	it("formats a bookmark with all fields", () => {
		const text = buildIndexableText({
			kind: "bookmarks",
			title: "Hermes Agent",
			notes: "Intéressant pour Blazz",
			description: "Self-improving AI agent",
			url: "https://github.com/NousResearch/hermes-agent",
		})
		expect(text).toBe("Hermes Agent\nIntéressant pour Blazz\nSelf-improving AI agent\nsource: https://github.com/NousResearch/hermes-agent")
	})

	it("formats a bookmark with only url (optional fields become empty lines)", () => {
		const text = buildIndexableText({
			kind: "bookmarks",
			title: undefined,
			notes: undefined,
			description: undefined,
			url: "https://example.com",
		})
		expect(text).toBe("\n\n\nsource: https://example.com")
	})

	it("trims whitespace from individual note fields", () => {
		const text = buildIndexableText({
			kind: "notes",
			title: "  Titre  ",
			contentText: "  Contenu  ",
		})
		expect(text).toBe("Titre\n\nContenu")
	})
})
```

- [ ] **Step 2.2 — Run test (attendu FAIL : module not found)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run convex/lib/rag/buildIndexableText.test.ts
```
Expected: FAIL `Cannot find module './buildIndexableText'`.

- [ ] **Step 2.3 — Implémenter `buildIndexableText`**

Create `apps/ops/convex/lib/rag/buildIndexableText.ts`:

```typescript
export type NoteInput = {
	kind: "notes"
	title: string | undefined
	contentText: string | undefined
}

export type BookmarkInput = {
	kind: "bookmarks"
	title: string | undefined
	notes: string | undefined
	description: string | undefined
	url: string
}

export type IndexableInput = NoteInput | BookmarkInput

export function buildIndexableText(input: IndexableInput): string {
	if (input.kind === "notes") {
		// Trim each field individually, join with double newline separator
		const title = (input.title ?? "").trim()
		const content = (input.contentText ?? "").trim()
		return content ? `${title}\n\n${content}` : title
	}
	// Bookmarks: keep line structure even when fields are missing (4 lines fixed)
	const title = (input.title ?? "").trim()
	const notes = (input.notes ?? "").trim()
	const description = (input.description ?? "").trim()
	return `${title}\n${notes}\n${description}\nsource: ${input.url.trim()}`
}
```

- [ ] **Step 2.4 — Run tests (attendu 5 PASS)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run convex/lib/rag/buildIndexableText.test.ts
```
Expected: 5 PASS.

- [ ] **Step 2.5 — Test `contentHash`**

Create `apps/ops/convex/lib/rag/contentHash.test.ts`:

```typescript
import { describe, expect, it } from "vitest"
import { contentHash } from "./contentHash"

describe("contentHash", () => {
	it("returns hex-encoded sha1 hash", async () => {
		const hash = await contentHash("hello world")
		// sha1("hello world") = 2aae6c35c94fcfb415dbe95f408b9ce91ee846ed
		expect(hash).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed")
	})

	it("is deterministic", async () => {
		const a = await contentHash("same input")
		const b = await contentHash("same input")
		expect(a).toBe(b)
	})

	it("differs for different inputs", async () => {
		const a = await contentHash("input 1")
		const b = await contentHash("input 2")
		expect(a).not.toBe(b)
	})

	it("handles empty string", async () => {
		const hash = await contentHash("")
		// sha1("") = da39a3ee5e6b4b0d3255bfef95601890afd80709
		expect(hash).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709")
	})
})
```

- [ ] **Step 2.6 — Run test (attendu FAIL)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run convex/lib/rag/contentHash.test.ts
```
Expected: FAIL `Cannot find module './contentHash'`.

- [ ] **Step 2.7 — Implémenter `contentHash`**

Create `apps/ops/convex/lib/rag/contentHash.ts`:

```typescript
/**
 * Pure sha1 via Web Crypto. Available in Convex V8 runtime + Node + browser.
 */
export async function contentHash(input: string): Promise<string> {
	const data = new TextEncoder().encode(input)
	const buffer = await crypto.subtle.digest("SHA-1", data)
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}
```

- [ ] **Step 2.8 — Run tests**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run convex/lib/rag/contentHash.test.ts
```
Expected: 4 PASS.

- [ ] **Step 2.9 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/lib/rag/ && git commit -m "feat(ops): add pure utils buildIndexableText + contentHash for RAG"
```

---

## Task 3 : OpenAI client wrapper

**Files:**
- Create: `apps/ops/convex/lib/rag/openai.ts`

- [ ] **Step 3.1 — Créer le wrapper**

Create `apps/ops/convex/lib/rag/openai.ts`:

```typescript
/**
 * Minimal OpenAI embeddings client. Uses native fetch (Convex V8 + Node both have it).
 * Kept as a standalone module so the indexer action can mock it cleanly in tests.
 */

export type EmbeddingBatchResult = {
	vectors: number[][]
	tokensUsed: number
}

export class OpenAIError extends Error {
	constructor(
		message: string,
		public status: number,
		public retryable: boolean,
	) {
		super(message)
		this.name = "OpenAIError"
	}
}

export async function embedBatch(inputs: string[], apiKey: string): Promise<EmbeddingBatchResult> {
	if (inputs.length === 0) return { vectors: [], tokensUsed: 0 }

	const response = await fetch("https://api.openai.com/v1/embeddings", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "text-embedding-3-small",
			input: inputs,
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		// 429 + 5xx are transient
		const retryable = response.status === 429 || response.status >= 500
		throw new OpenAIError(`OpenAI ${response.status}: ${body.slice(0, 200)}`, response.status, retryable)
	}

	const data = (await response.json()) as {
		data: { embedding: number[] }[]
		usage: { total_tokens: number }
	}

	return {
		vectors: data.data.map((d) => d.embedding),
		tokensUsed: data.usage.total_tokens,
	}
}
```

- [ ] **Step 3.2 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/lib/rag/openai.ts && git commit -m "feat(ops): add OpenAI embeddings client wrapper"
```

---

## Task 4 : Queue internal mutations

**Files:**
- Create: `apps/ops/convex/rag.ts`

- [ ] **Step 4.1 — Créer `rag.ts` avec les internal mutations de queue**

Create `apps/ops/convex/rag.ts`:

```typescript
import { ConvexError, v } from "convex/values"
import { api, internal } from "./_generated/api"
import type { Id } from "./_generated/dataModel"
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server"

const sourceTableValidator = v.union(v.literal("notes"), v.literal("bookmarks"))

// ── Queue : enqueue un doc à indexer ──

export const enqueueJob = internalMutation({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		// Dedup : si un job existe déjà pour cet id, on le laisse (sera traité avec l'état le plus récent)
		const existing = await ctx.db
			.query("embeddingJobs")
			.filter((q) => q.eq(q.field("sourceId"), sourceId))
			.first()
		if (existing) return existing._id

		return ctx.db.insert("embeddingJobs", {
			sourceTable,
			sourceId,
			attempts: 0,
			createdAt: Date.now(),
		})
	},
})

// ── Queue : cleanup quand une source est supprimée ──

export const removeForSource = internalMutation({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		// Delete embedding
		const emb = await ctx.db
			.query("embeddings")
			.withIndex("by_source", (q) => q.eq("sourceTable", sourceTable).eq("sourceId", sourceId))
			.first()
		if (emb) await ctx.db.delete(emb._id)

		// Delete any pending job
		const jobs = await ctx.db
			.query("embeddingJobs")
			.filter((q) => q.eq(q.field("sourceId"), sourceId))
			.collect()
		for (const job of jobs) await ctx.db.delete(job._id)
	},
})
```

- [ ] **Step 4.2 — Push Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!`.

- [ ] **Step 4.3 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/rag.ts && git commit -m "feat(ops): add RAG queue internal mutations (enqueue + cleanup)"
```

---

## Task 5 : Hooks dans `notes.ts` + `bookmarks.ts`

**Files:**
- Modify: `apps/ops/convex/notes.ts`
- Modify: `apps/ops/convex/bookmarks.ts`

- [ ] **Step 5.1 — Ajouter l'import `internal` dans `notes.ts`**

Ouvrir `apps/ops/convex/notes.ts`. Au-dessus de `import { mutation, query } from "./_generated/server"`, ajouter :

```typescript
import { internal } from "./_generated/api"
```

(Si déjà présent, ne pas dupliquer.)

- [ ] **Step 5.2 — Hook dans `notes.create`**

Dans `apps/ops/convex/notes.ts`, trouver la mutation `create`. Après le `ctx.db.insert("notes", {...})`, récupérer l'id et enqueue :

Avant :
```typescript
		return ctx.db.insert("notes", {
			userId,
			entityType,
			// ...
		})
	},
})
```

Après :
```typescript
		const id = await ctx.db.insert("notes", {
			userId,
			entityType,
			// ...
		})
		await ctx.runMutation(internal.rag.enqueueJob, { sourceTable: "notes", sourceId: id })
		return id
	},
})
```

- [ ] **Step 5.3 — Hook dans `notes.createFromTemplate`**

Même pattern : capturer l'`id` du `ctx.db.insert`, appeler `enqueueJob`, retourner l'id.

- [ ] **Step 5.4 — Hook dans `notes.update`**

Trouver la mutation `update`. Après le `ctx.db.patch(id, patch)`, ajouter :

```typescript
		await ctx.db.patch(id, patch)
		// Re-index only if content changed
		if (title !== undefined || contentText !== undefined || contentJson !== undefined) {
			await ctx.runMutation(internal.rag.enqueueJob, { sourceTable: "notes", sourceId: id })
		}
	},
})
```

- [ ] **Step 5.5 — Hook dans `notes.remove`**

Trouver la mutation `remove`. **Avant** le `ctx.db.delete(id)`, ajouter :

```typescript
		await ctx.runMutation(internal.rag.removeForSource, { sourceTable: "notes", sourceId: id })
		await ctx.db.delete(id)
```

- [ ] **Step 5.6 — Hook dans `notes.archive`**

Archivée = toujours visible, donc on continue à l'indexer. **Pas de hook ici.** (Si on veut la cacher du RAG, faudra une v2 avec filtre sur `archivedAt`.)

- [ ] **Step 5.7 — Ajouter import dans `bookmarks.ts` (si absent)**

Même manip : `import { internal } from "./_generated/api"` en haut.

- [ ] **Step 5.8 — Hook dans `bookmarks.create`**

Après le `ctx.db.insert("bookmarks", {...})`, capturer l'id et enqueue :

```typescript
		const id = await ctx.db.insert("bookmarks", { ... })
		await ctx.runMutation(internal.rag.enqueueJob, { sourceTable: "bookmarks", sourceId: id })
		return id
```

- [ ] **Step 5.9 — Hook dans `bookmarks.update`**

Après `ctx.db.patch(id, patch)`, ajouter :

```typescript
		await ctx.runMutation(internal.rag.enqueueJob, { sourceTable: "bookmarks", sourceId: id })
```

(Pas de check conditional : on est moins sensible au bruit sur bookmarks vu que les updates changent le titre/notes ce qu'on indexe.)

- [ ] **Step 5.10 — Hook dans `bookmarks.internalCreateFromUrl`**

Dans la mutation qu'on a ajoutée à Task 2 de la feature bookmark (`internalCreateFromUrl`), même pattern :

```typescript
		const id = await ctx.db.insert("bookmarks", {...})
		await ctx.runMutation(internal.rag.enqueueJob, { sourceTable: "bookmarks", sourceId: id })
		return id
```

- [ ] **Step 5.11 — Hook dans `bookmarks.remove` (si la mutation existe, sinon skip)**

Si une mutation `remove` existe dans `bookmarks.ts`, ajouter **avant** le `ctx.db.delete(id)` :

```typescript
		await ctx.runMutation(internal.rag.removeForSource, { sourceTable: "bookmarks", sourceId: id })
		await ctx.db.delete(id)
```

Si pas de `remove`, créer un TODO mental mais pas dans ce plan.

- [ ] **Step 5.12 — Push Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!`, pas d'erreur TypeScript.

- [ ] **Step 5.13 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/notes.ts apps/ops/convex/bookmarks.ts && git commit -m "feat(ops): hook notes + bookmarks mutations into RAG queue"
```

---

## Task 6 : Indexer action + cron

**Files:**
- Modify: `apps/ops/convex/rag.ts`
- Modify: `apps/ops/convex/crons.ts`

- [ ] **Step 6.1 — Ajouter internal queries/mutations de support dans `rag.ts`**

À la fin de `apps/ops/convex/rag.ts`, ajouter :

```typescript
// ── Support internes pour l'indexer ──

export const _getPendingJobs = internalQuery({
	args: { limit: v.number() },
	handler: async (ctx, { limit }) => {
		return ctx.db.query("embeddingJobs").withIndex("by_created").order("asc").take(limit)
	},
})

export const _getSourceDoc = internalQuery({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		const doc = await ctx.db.get(sourceId)
		return doc
	},
})

export const _getExistingEmbedding = internalQuery({
	args: {
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
	},
	handler: async (ctx, { sourceTable, sourceId }) => {
		return ctx.db
			.query("embeddings")
			.withIndex("by_source", (q) => q.eq("sourceTable", sourceTable).eq("sourceId", sourceId))
			.first()
	},
})

export const _upsertEmbedding = internalMutation({
	args: {
		existingId: v.optional(v.id("embeddings")),
		userId: v.string(),
		sourceTable: sourceTableValidator,
		sourceId: v.union(v.id("notes"), v.id("bookmarks")),
		contentHash: v.string(),
		text: v.string(),
		vector: v.array(v.number()),
	},
	handler: async (ctx, { existingId, ...fields }) => {
		const payload = { ...fields, updatedAt: Date.now() }
		if (existingId) {
			await ctx.db.patch(existingId, payload)
			return existingId
		}
		return ctx.db.insert("embeddings", payload)
	},
})

export const _deleteJob = internalMutation({
	args: { jobId: v.id("embeddingJobs") },
	handler: async (ctx, { jobId }) => {
		await ctx.db.delete(jobId)
	},
})

export const _markJobFailed = internalMutation({
	args: { jobId: v.id("embeddingJobs"), error: v.string() },
	handler: async (ctx, { jobId, error }) => {
		const job = await ctx.db.get(jobId)
		if (!job) return
		const attempts = job.attempts + 1
		if (attempts >= 5) {
			// Abandon
			await ctx.db.delete(jobId)
			return
		}
		await ctx.db.patch(jobId, { attempts, lastError: error.slice(0, 500) })
	},
})
```

- [ ] **Step 6.2a — Ajouter les imports en haut de `rag.ts`**

Après les imports existants, en haut de `apps/ops/convex/rag.ts`, ajouter :

```typescript
import { buildIndexableText } from "./lib/rag/buildIndexableText"
import { contentHash } from "./lib/rag/contentHash"
import { OpenAIError, embedBatch } from "./lib/rag/openai"
```

- [ ] **Step 6.2b — Ajouter l'action `indexPendingJobs` à la fin de `rag.ts`**

```typescript
// ── Indexer action (appelée par le cron) ──

export const indexPendingJobs = action({
	args: {},
	handler: async (ctx): Promise<{ processed: number; skipped: number; failed: number }> => {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) {
			console.error("[rag] OPENAI_API_KEY not set, skipping")
			return { processed: 0, skipped: 0, failed: 0 }
		}

		const jobs = await ctx.runQuery(internal.rag._getPendingJobs, { limit: 50 })
		if (jobs.length === 0) return { processed: 0, skipped: 0, failed: 0 }

		const batch: { job: typeof jobs[number]; text: string; hash: string; existingId: Id<"embeddings"> | undefined; userId: string }[] = []
		let skipped = 0

		for (const job of jobs) {
			try {
				const doc = await ctx.runQuery(internal.rag._getSourceDoc, {
					sourceTable: job.sourceTable,
					sourceId: job.sourceId,
				})
				if (!doc) {
					// Source disparu → delete embedding + job (GC)
					await ctx.runMutation(internal.rag.removeForSource, {
						sourceTable: job.sourceTable,
						sourceId: job.sourceId,
					})
					skipped++
					continue
				}

				// Build text
				const text =
					job.sourceTable === "notes"
						? buildIndexableText({
								kind: "notes",
								title: (doc as any).title,
								contentText: (doc as any).contentText,
							})
						: buildIndexableText({
								kind: "bookmarks",
								title: (doc as any).title,
								notes: (doc as any).notes,
								description: (doc as any).description,
								url: (doc as any).url,
							})

				const hash = await contentHash(text)

				// Check existing
				const existing = await ctx.runQuery(internal.rag._getExistingEmbedding, {
					sourceTable: job.sourceTable,
					sourceId: job.sourceId,
				})

				if (existing && existing.contentHash === hash) {
					// Skip — contenu identique, delete le job
					await ctx.runMutation(internal.rag._deleteJob, { jobId: job._id })
					skipped++
					continue
				}

				batch.push({
					job,
					text,
					hash,
					existingId: existing?._id,
					userId: (doc as any).userId,
				})
			} catch (err) {
				await ctx.runMutation(internal.rag._markJobFailed, {
					jobId: job._id,
					error: err instanceof Error ? err.message : String(err),
				})
			}
		}

		if (batch.length === 0) return { processed: 0, skipped, failed: 0 }

		// OpenAI batch call
		let failed = 0
		try {
			const { vectors } = await embedBatch(
				batch.map((b) => b.text),
				apiKey,
			)
			for (let i = 0; i < batch.length; i++) {
				const b = batch[i]
				const v = vectors[i]
				await ctx.runMutation(internal.rag._upsertEmbedding, {
					existingId: b.existingId,
					userId: b.userId,
					sourceTable: b.job.sourceTable,
					sourceId: b.job.sourceId,
					contentHash: b.hash,
					text: b.text,
					vector: v,
				})
				await ctx.runMutation(internal.rag._deleteJob, { jobId: b.job._id })
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			const retryable = err instanceof OpenAIError ? err.retryable : true
			for (const b of batch) {
				await ctx.runMutation(internal.rag._markJobFailed, {
					jobId: b.job._id,
					error: retryable ? `transient: ${message}` : `non-retryable: ${message}`,
				})
				failed++
			}
		}

		return { processed: batch.length - failed, skipped, failed }
	},
})
```

- [ ] **Step 6.3 — Enregistrer le cron dans `crons.ts`**

Ouvrir `apps/ops/convex/crons.ts`. Avant `export default crons` (ligne 10), ajouter :

```typescript
crons.interval("rag index pending jobs", { seconds: 60 }, internal.rag.indexPendingJobs)
```

- [ ] **Step 6.4 — Push Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!`.

- [ ] **Step 6.5 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/rag.ts apps/ops/convex/crons.ts && git commit -m "feat(ops): RAG indexer action + cron every 60s"
```

---

## Task 7 : Search action + admin helpers

**Files:**
- Modify: `apps/ops/convex/rag.ts`

- [ ] **Step 7.1 — Ajouter l'action `searchKnowledge`**

À la fin de `apps/ops/convex/rag.ts`, ajouter :

```typescript
// ── Search (appelée par le MCP tool search_knowledge) ──

export type SearchHit = {
	sourceTable: "notes" | "bookmarks"
	sourceId: string
	text: string
	score: number
}

export const searchKnowledge = action({
	args: {
		query: v.string(),
		limit: v.number(),
		sourceTable: v.optional(sourceTableValidator),
	},
	handler: async (ctx, { query, limit, sourceTable }): Promise<SearchHit[]> => {
		const apiKey = process.env.OPENAI_API_KEY
		if (!apiKey) throw new ConvexError("OPENAI_API_KEY not configured")

		const userId = process.env.OPS_USER_ID
		if (!userId) throw new ConvexError("OPS_USER_ID not configured")

		if (!query.trim()) return []

		// Embed la query
		const { vectors } = await embedBatch([query], apiKey)
		const queryVector = vectors[0]

		// Vector search
		const effectiveLimit = Math.min(limit, 30)
		const results = await ctx.vectorSearch("embeddings", "by_vector", {
			vector: queryVector,
			limit: Math.min(effectiveLimit * 2, 60),
			filter: sourceTable
				? (q) => q.eq("userId", userId).eq("sourceTable", sourceTable)
				: (q) => q.eq("userId", userId),
		})

		// Filter by score threshold + fetch text
		const filtered = results.filter((r) => r._score >= 0.35).slice(0, effectiveLimit)

		const hits: SearchHit[] = []
		for (const r of filtered) {
			const emb = await ctx.runQuery(internal.rag._getEmbeddingById, { id: r._id })
			if (!emb) continue
			hits.push({
				sourceTable: emb.sourceTable,
				sourceId: emb.sourceId,
				text: emb.text.slice(0, 300),
				score: r._score,
			})
		}
		return hits
	},
})

export const _getEmbeddingById = internalQuery({
	args: { id: v.id("embeddings") },
	handler: async (ctx, { id }) => ctx.db.get(id),
})
```

- [ ] **Step 7.2 — Ajouter les helpers admin (backfill + stats)**

À la fin de `apps/ops/convex/rag.ts` :

```typescript
// ── Admin : backfill one-shot pour les data existantes ──

export const backfillAll = mutation({
	args: {},
	handler: async (ctx) => {
		const notes = await ctx.db.query("notes").collect()
		const bookmarks = await ctx.db.query("bookmarks").collect()

		let enqueued = 0
		for (const n of notes) {
			await ctx.db.insert("embeddingJobs", {
				sourceTable: "notes",
				sourceId: n._id,
				attempts: 0,
				createdAt: Date.now(),
			})
			enqueued++
		}
		for (const b of bookmarks) {
			await ctx.db.insert("embeddingJobs", {
				sourceTable: "bookmarks",
				sourceId: b._id,
				attempts: 0,
				createdAt: Date.now(),
			})
			enqueued++
		}
		return { enqueued, notes: notes.length, bookmarks: bookmarks.length }
	},
})

// ── Stats pour debug ──

export const stats = query({
	args: {},
	handler: async (ctx) => {
		const embeddings = await ctx.db.query("embeddings").collect()
		const jobs = await ctx.db.query("embeddingJobs").collect()

		const byTable: Record<string, number> = {}
		for (const e of embeddings) {
			byTable[e.sourceTable] = (byTable[e.sourceTable] ?? 0) + 1
		}

		return {
			totalEmbeddings: embeddings.length,
			byTable,
			pendingJobs: jobs.length,
			failedJobs: jobs.filter((j) => j.attempts > 0).length,
		}
	},
})
```

- [ ] **Step 7.3 — Push Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!`.

- [ ] **Step 7.4 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/convex/rag.ts && git commit -m "feat(ops): RAG search action + backfill + stats helpers"
```

---

## Task 8 : Expose `search_knowledge` en MCP tool

**Files:**
- Modify: `apps/ops/shared/tool-schemas.ts`
- Modify: `apps/ops/convex/http.ts`

- [ ] **Step 8.1 — Ajouter le schema dans `tool-schemas.ts`**

Ouvrir `apps/ops/shared/tool-schemas.ts`. Dans le `TOOL_SCHEMAS` array (actuellement 10 items), insérer à la fin (juste avant `] as const`) :

```typescript
	{
		name: "search_knowledge",
		category: "read",
		description:
			"Recherche sémantique dans les notes et bookmarks de l'utilisateur. Retourne les entrées les plus pertinentes avec un score de similarité. Utile pour retrouver une note ou un lien sans en connaître le titre exact.",
		parameters: {
			type: "object",
			properties: {
				query: { type: "string", description: "Requête en langage naturel." },
				limit: { type: "number", description: "Max résultats (default 10, max 30)." },
				sourceTable: {
					type: "string",
					enum: ["notes", "bookmarks"],
					description: "Filtrer par type de source (optionnel).",
				},
			},
			required: ["query"],
		},
	},
```

- [ ] **Step 8.2 — Mettre à jour les tests de `tool-schemas.test.ts`**

Ouvrir `apps/ops/shared/tool-schemas.test.ts`. Le test `"exports exactly 10 tools"` va casser puisqu'on passe à 11. Modifier :

```typescript
	it("exports exactly 11 tools", () => {
		expect(TOOL_SCHEMAS).toHaveLength(11)
	})
```

- [ ] **Step 8.3 — Lancer les tests**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && pnpm vitest run shared/tool-schemas.test.ts
```
Expected: 7 PASS (on a maintenant 11 tools, mais toujours 7 tests).

- [ ] **Step 8.4 — Ajouter le case dans le switch MCP**

Ouvrir `apps/ops/convex/http.ts`. Trouver le switch dans l'httpAction `/mcp`. Chercher la ligne `case "create_expense":`. Ajouter **après** :

```typescript
					case "search_knowledge":
						return ctx.runAction(api.rag.searchKnowledge, {
							query: String(args.query ?? ""),
							limit: Math.min((args.limit as number) ?? 10, 30),
							sourceTable: args.sourceTable as "notes" | "bookmarks" | undefined,
						})
```

- [ ] **Step 8.5 — Push Convex**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex dev --once 2>&1 | tail -5
```
Expected: `Convex functions ready!`.

- [ ] **Step 8.6 — Commit**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && git add apps/ops/shared/tool-schemas.ts apps/ops/shared/tool-schemas.test.ts apps/ops/convex/http.ts && git commit -m "feat(ops): expose search_knowledge as MCP tool"
```

---

## Task 9 : Set OPENAI_API_KEY + verify

**Files:** aucun (env Convex)

- [ ] **Step 9.1 — Obtenir une clé OpenAI**

Si l'utilisateur n'a pas encore de clé : https://platform.openai.com/api-keys → Create new → copier (commence par `sk-`).

- [ ] **Step 9.2 — Setter dans Convex env**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex env set OPENAI_API_KEY sk-...
```
(Remplacer `sk-...` par la vraie clé. Si l'user veut coller depuis clipboard, utiliser `pbpaste` : `npx convex env set OPENAI_API_KEY "$(pbpaste)"`.)

- [ ] **Step 9.3 — Vérifier**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex env list 2>&1 | grep -c OPENAI_API_KEY
```
Expected: `1`.

- [ ] **Step 9.4 — Vérifier qu'`OPS_USER_ID` est déjà set (requis par searchKnowledge)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex env list 2>&1 | grep -c OPS_USER_ID
```
Expected: `1` (a été set lors de la feature Bookmark).

---

## Task 10 : Backfill + smoke tests

**Files:** aucun

- [ ] **Step 10.1 — Vérifier l'état initial (avant backfill)**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex run rag:stats
```
Expected: `{ totalEmbeddings: 0, byTable: {}, pendingJobs: 0, failedJobs: 0 }`.

- [ ] **Step 10.2 — Lancer le backfill**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex run rag:backfillAll
```
Expected: `{ enqueued: N, notes: X, bookmarks: Y }` où N = X + Y.

- [ ] **Step 10.3 — Vérifier la queue**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex run rag:stats
```
Expected: `pendingJobs: N`, `totalEmbeddings: 0` (cron pas encore passé).

- [ ] **Step 10.4 — Attendre 60-90 sec puis vérifier**

```bash
sleep 90 && cd /Users/jonathanruas/Development/blazz-ui-app/apps/ops && npx convex run rag:stats
```
Expected: `pendingJobs` ↓ (idéalement 0 ou très bas), `totalEmbeddings: N` (ou proche de N — batch de 50 donc si N > 50, il faut 2 cron ticks).

Si `failedJobs` > 0, checker les logs Convex dashboard pour voir `lastError`.

- [ ] **Step 10.5 — Smoke test curl via le MCP endpoint**

```bash
SECRET=$(cat /tmp/mcp-secret.txt) && curl -s -X POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | python3 -c "import sys, json; d = json.load(sys.stdin); names = [t['name'] for t in d['result']['tools']]; print('tools count:', len(names)); print('search_knowledge?', 'search_knowledge' in names)"
```
Expected: `tools count: 11`, `search_knowledge? True`.

- [ ] **Step 10.6 — Smoke test recherche réelle**

Choisir un terme que tu sais avoir dans tes notes ou bookmarks. Ex :
```bash
SECRET=$(cat /tmp/mcp-secret.txt) && curl -s -X POST https://rightful-guineapig-376.eu-west-1.convex.site/mcp \
  -H "Authorization: Bearer $SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_knowledge","arguments":{"query":"pricing","limit":5}}}' | python3 -m json.tool
```
Expected: `result.isError: false`, `result.content[0].text` contient un JSON array avec 0 à 5 hits triés par `score` décroissant. Si 0 résultats pour un terme évident, le threshold 0.35 est peut-être trop strict — l'ajuster à 0.3 dans `rag.ts`.

- [ ] **Step 10.7 — Test Telegram end-to-end**

Sur Telegram, envoyer à ton bot Hermes une requête du type :
> cherche dans mes notes un truc sur <un sujet que tu as noté>

Hermes doit appeler `search_knowledge` et restituer les hits en langage naturel.

---

## Critères de succès (récap)

- [ ] Tests `buildIndexableText.test.ts` + `contentHash.test.ts` passent (9 total)
- [ ] Tests `tool-schemas.test.ts` passent (7)
- [ ] `npx convex run rag:stats` fonctionne et retourne la bonne forme
- [ ] Création d'une nouvelle note → dans 60-90 sec, `stats.totalEmbeddings` incrémente
- [ ] `tools/list` via MCP retourne 11 tools dont `search_knowledge`
- [ ] `search_knowledge` retourne des hits triés par score pour une requête évidente
- [ ] Suppression d'une note → embedding disparaît dans les 60 sec
- [ ] Sur Telegram, Hermes peut retrouver une note via recherche sémantique

---

## Notes pour l'exécution

- **Branch** : `develop` (actuelle), commits directs OK.
- **Deployment cible** : dev Convex (`rightful-guineapig-376.eu-west-1.convex.site`).
- **Pour prod plus tard** : ajouter `OPENAI_API_KEY` à la section appropriée de `apps/ops/docs/prod-migration.md` + refaire le backfill.
- **Coût OpenAI attendu** : indexation initiale + usage courant < 1$/mois à ton volume. Monitoring via dashboard OpenAI.
- **Rollback** : chaque task commit indépendamment, `git revert` si un task casse quelque chose.
