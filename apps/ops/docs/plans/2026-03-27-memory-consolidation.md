# Memory Consolidation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add hybrid memory consolidation (post-mission dedup + weekly deep consolidation) so agent memories stay clean and useful instead of accumulating noise.

**Architecture:** Two consolidation passes — a lightweight LLM dedup after each mission (hot path), and a deep weekly cron that merges, abstracts, and prunes all memories per agent (cold path). Both use GPT-4o-mini with structured JSON output. No embeddings, no vector DB.

**Tech Stack:** OpenAI GPT-4o-mini, Convex mutations, node-cron

---

### Task 1: Add Convex worker mutations for memory update/delete/listAll

**Files:**
- Modify: `apps/ops/convex/worker.ts` (after line 172, in the Agent Memory section)

**Step 1: Add `workerUpdateMemory` mutation**

```ts
export const workerUpdateMemory = mutation({
	args: {
		id: v.id("agentMemory"),
		content: v.string(),
		confidence: v.optional(v.number()),
	},
	handler: async (ctx, { id, content, confidence }) => {
		const patch: Record<string, unknown> = { content, lastConfirmedAt: Date.now() }
		if (confidence !== undefined) patch.confidence = confidence
		await ctx.db.patch(id, patch)
	},
})
```

**Step 2: Add `workerDeleteMemory` mutation**

```ts
export const workerDeleteMemory = mutation({
	args: { id: v.id("agentMemory") },
	handler: async (ctx, { id }) => {
		const mem = await ctx.db.get(id)
		if (mem) await ctx.db.delete(id)
	},
})
```

**Step 3: Add `workerListAllMemory` query**

```ts
export const workerListAllMemory = query({
	args: { agentId: v.id("agents") },
	handler: async (ctx, { agentId }) => {
		const all = await ctx.db.query("agentMemory").collect()
		// All private for this agent + all shared — no expiry filter (consolidation handles cleanup)
		return all.filter((m) =>
			(m.scope === "private" && m.agentId === agentId) ||
			m.scope === "shared"
		)
	},
})
```

**Step 4: Add `workerListAgents` query** (needed by weekly cron)

```ts
export const workerListAgents = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("agents").collect()
	},
})
```

**Step 5: Verify Convex types generate**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors, `_generated/api.d.ts` includes the new functions.

**Step 6: Commit**

```bash
git add apps/ops/convex/worker.ts
git commit -m "feat(ops): add worker mutations for memory consolidation"
```

---

### Task 2: Implement post-mission consolidation (hot path)

**Files:**
- Modify: `apps/ops/worker/src/memory.ts`

**Step 1: Add the consolidation prompt constant**

Add at the top of `memory.ts`, after the imports:

```ts
const CONSOLIDATION_PROMPT = `Tu es un archiviste mémoire. On te donne les mémoires existantes d'un agent IA et les nouvelles mémoires extraites d'une mission.

Règles :
- Si une nouvelle mémoire dit la même chose qu'une existante → garde la plus récente/précise (update l'existante)
- Si une nouvelle mémoire contredit une existante → remplace l'existante (update)
- Si deux mémoires peuvent se fusionner en une seule plus complète → fusionne (delete les originales + insert la fusion)
- Ne jamais supprimer une mémoire de catégorie "rule"
- Ne jamais inventer d'information non présente dans les inputs
- Si rien à consolider, retourne tous les IDs dans "keep" et les nouvelles dans "insert"

Réponds en JSON strict :
{
  "keep": ["id1", "id2"],
  "update": [{"id": "id3", "content": "nouveau contenu", "confidence": 0.8}],
  "delete": ["id4", "id5"],
  "insert": [{"content": "...", "category": "fact|preference|episode|pattern|rule", "scope": "private|shared"}]
}`
```

**Step 2: Add `consolidatePostMission` function**

Add after the `extractAndSaveMemories` function:

```ts
export async function consolidatePostMission(
	convex: ConvexHttpClient,
	agentId: string,
	userId: string,
	missionId: string | undefined,
	newMemories: MemoryExtraction,
) {
	// Skip if extraction produced nothing
	const allNew = [
		...(newMemories.facts ?? []),
		...(newMemories.preferences ?? []),
		...(newMemories.episodes ?? []),
		...(newMemories.patterns ?? []),
		...(newMemories.shared ?? []),
	]
	if (allNew.length === 0) return

	try {
		// Load existing memories (max 50, sorted by lastConfirmedAt desc)
		const existing = await convex.query(api.worker.workerListMemory, {
			agentId: agentId as any,
		})
		if (existing.length === 0) return // nothing to consolidate against

		const existingForPrompt = existing
			.sort((a: any, b: any) => (b.lastConfirmedAt ?? 0) - (a.lastConfirmedAt ?? 0))
			.slice(0, 50)
			.map((m: any) => ({
				id: m._id,
				category: m.category,
				scope: m.scope,
				content: m.content,
				confidence: m.confidence,
			}))

		const newForPrompt = allNew.map((content, i) => ({
			index: i,
			content,
		}))

		const response = await getOpenAI().chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: CONSOLIDATION_PROMPT },
				{
					role: "user",
					content: `Mémoires existantes :\n${JSON.stringify(existingForPrompt, null, 2)}\n\nNouvelles mémoires :\n${JSON.stringify(newForPrompt, null, 2)}`,
				},
			],
			response_format: { type: "json_object" },
			max_tokens: 1000,
		})

		const content = response.choices[0].message.content
		if (!content) return

		const result = JSON.parse(content) as {
			keep: string[]
			update: Array<{ id: string; content: string; confidence?: number }>
			delete: string[]
			insert: Array<{ content: string; category: string; scope: string }>
		}

		// Apply updates
		for (const upd of result.update ?? []) {
			await convex.mutation(api.worker.workerUpdateMemory, {
				id: upd.id as any,
				content: upd.content,
				confidence: upd.confidence,
			})
		}

		// Apply deletes (never delete rules — safety net)
		const existingMap = new Map(existing.map((m: any) => [m._id, m]))
		for (const id of result.delete ?? []) {
			const mem = existingMap.get(id)
			if (mem && (mem as any).category === "rule") continue
			await convex.mutation(api.worker.workerDeleteMemory, { id: id as any })
		}

		// Apply inserts
		for (const ins of result.insert ?? []) {
			const category = ins.category as "fact" | "preference" | "episode" | "pattern" | "rule"
			const expiresAt = category === "fact" || category === "episode"
				? Date.now() + 30 * 24 * 60 * 60 * 1000
				: undefined

			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				agentId: agentId as any,
				missionId: missionId as any,
				scope: (ins.scope as "private" | "shared") ?? "private",
				category,
				content: ins.content,
				confidence: 0.7,
				source: "consolidation",
				expiresAt,
			})
		}

		console.log(`[memory] post-mission consolidation: ${result.update?.length ?? 0} updated, ${result.delete?.length ?? 0} deleted, ${result.insert?.length ?? 0} inserted`)
	} catch (err) {
		console.error("[memory] consolidation error:", err)
	}
}
```

**Step 3: Refactor `extractAndSaveMemories` to return the extraction**

Change the return type of `extractAndSaveMemories` so it returns the `MemoryExtraction` (currently returns void). At the end of the function, before the catch:

```ts
return extraction
```

And update the function signature:

```ts
export async function extractAndSaveMemories(
	...
): Promise<MemoryExtraction | undefined> {
```

Add a `return undefined` in the catch block.

**Step 4: Commit**

```bash
git add apps/ops/worker/src/memory.ts
git commit -m "feat(ops): add post-mission memory consolidation"
```

---

### Task 3: Wire consolidation into the runner

**Files:**
- Modify: `apps/ops/worker/src/runner.ts`

**Step 1: Update the import**

Change line 6:

```ts
import { extractAndSaveMemories, consolidatePostMission } from "./memory"
```

**Step 2: Replace the extraction call**

Change line 236 from:

```ts
await extractAndSaveMemories(convex, agent._id, agent.userId as string, mission._id, output, "mission")
```

To:

```ts
const extraction = await extractAndSaveMemories(convex, agent._id, agent.userId as string, mission._id, output, "mission")
if (extraction) {
    await consolidatePostMission(convex, agent._id, agent.userId as string, mission._id, extraction)
}
```

**Step 3: Commit**

```bash
git add apps/ops/worker/src/runner.ts
git commit -m "feat(ops): wire post-mission consolidation into runner"
```

---

### Task 4: Implement weekly deep consolidation

**Files:**
- Create: `apps/ops/worker/src/consolidation.ts`

**Step 1: Create the consolidation module**

```ts
import OpenAI from "openai"
import type { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"

let _openai: OpenAI
function getOpenAI() {
	if (!_openai) _openai = new OpenAI()
	return _openai
}

const DEEP_CONSOLIDATION_PROMPT = `Tu es un archiviste mémoire. Voici TOUTES les mémoires d'un agent IA.

Consolide-les :
1. Fusionne les doublons et faits redondants en 1 seul
2. Si 3+ épisodes montrent le même comportement → crée 1 pattern et supprime les épisodes
3. Supprime les mémoires vagues, inutiles ou à très faible confidence (< 0.3) jamais confirmées depuis 30j+
4. Garde max 30 mémoires au total — priorise rules > preferences > patterns > facts > episodes
5. Ne jamais supprimer une mémoire de catégorie "rule"
6. Ne jamais inventer d'information non présente

Réponds en JSON strict :
{
  "keep": ["id1", "id2"],
  "update": [{"id": "id3", "content": "nouveau contenu", "confidence": 0.8}],
  "delete": ["id4", "id5"],
  "insert": [{"content": "...", "category": "fact|preference|episode|pattern|rule", "scope": "private|shared"}]
}`

export async function consolidateAgent(
	convex: ConvexHttpClient,
	agentId: string,
	agentName: string,
	agentRole: string,
) {
	try {
		const allMemories = await convex.query(api.worker.workerListAllMemory, {
			agentId: agentId as any,
		})

		if (allMemories.length < 5) {
			console.log(`[consolidation] ${agentName}: only ${allMemories.length} memories, skipping`)
			return
		}

		const memoriesForPrompt = allMemories.map((m: any) => ({
			id: m._id,
			category: m.category,
			scope: m.scope,
			content: m.content,
			confidence: m.confidence,
			lastConfirmedAt: m.lastConfirmedAt
				? new Date(m.lastConfirmedAt).toISOString().slice(0, 10)
				: "unknown",
		}))

		const response = await getOpenAI().chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: DEEP_CONSOLIDATION_PROMPT,
				},
				{
					role: "user",
					content: `Agent : ${agentName} (${agentRole})\n\nMémoires (${allMemories.length}) :\n${JSON.stringify(memoriesForPrompt, null, 2)}`,
				},
			],
			response_format: { type: "json_object" },
			max_tokens: 2000,
		})

		const content = response.choices[0].message.content
		if (!content) return

		const result = JSON.parse(content) as {
			keep: string[]
			update: Array<{ id: string; content: string; confidence?: number }>
			delete: string[]
			insert: Array<{ content: string; category: string; scope: string }>
		}

		// Safety: find the agent's userId from a memory
		const userId = (allMemories[0] as any)?.userId
		if (!userId) return

		// Apply updates
		for (const upd of result.update ?? []) {
			await convex.mutation(api.worker.workerUpdateMemory, {
				id: upd.id as any,
				content: upd.content,
				confidence: upd.confidence,
			})
		}

		// Apply deletes (protect rules)
		const memMap = new Map(allMemories.map((m: any) => [m._id, m]))
		for (const id of result.delete ?? []) {
			const mem = memMap.get(id)
			if (mem && (mem as any).category === "rule") continue
			await convex.mutation(api.worker.workerDeleteMemory, { id: id as any })
		}

		// Apply inserts
		for (const ins of result.insert ?? []) {
			const category = ins.category as "fact" | "preference" | "episode" | "pattern" | "rule"
			const expiresAt = category === "fact" || category === "episode"
				? Date.now() + 30 * 24 * 60 * 60 * 1000
				: undefined

			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				agentId: agentId as any,
				scope: (ins.scope as "private" | "shared") ?? "private",
				category,
				content: ins.content,
				confidence: 0.7,
				source: "consolidation",
				expiresAt,
			})
		}

		console.log(
			`[consolidation] ${agentName}: ${result.keep?.length ?? 0} kept, ${result.update?.length ?? 0} updated, ${result.delete?.length ?? 0} deleted, ${result.insert?.length ?? 0} inserted`,
		)
	} catch (err) {
		console.error(`[consolidation] ${agentName} error:`, err)
	}
}

export async function runWeeklyConsolidation(convex: ConvexHttpClient) {
	console.log("[consolidation] starting weekly consolidation...")
	try {
		const agents = await convex.query(api.worker.workerListAgents, {})
		for (const agent of agents) {
			if ((agent as any).status === "disabled") continue
			await consolidateAgent(convex, (agent as any)._id, (agent as any).name, (agent as any).role)
		}
		console.log("[consolidation] weekly consolidation complete")
	} catch (err) {
		console.error("[consolidation] weekly run error:", err)
	}
}
```

**Step 2: Commit**

```bash
git add apps/ops/worker/src/consolidation.ts
git commit -m "feat(ops): add weekly deep memory consolidation"
```

---

### Task 5: Wire weekly cron into the worker

**Files:**
- Modify: `apps/ops/worker/src/index.ts`

**Step 1: Add import**

After line 4 (`import { createToolRegistry }`), add:

```ts
import { runWeeklyConsolidation } from "./consolidation"
```

**Step 2: Add the weekly cron schedule**

After `startCronScheduler()` (line 69), add:

```ts
// Weekly memory consolidation — Sunday 3:00 AM
cron.schedule("0 3 * * 0", () => {
	console.log("[cron] triggering weekly memory consolidation")
	runWeeklyConsolidation(convex)
})
console.log("[cron] weekly memory consolidation scheduled (Sunday 3:00 AM)")
```

**Step 3: Verify the worker starts**

Run: `cd apps/ops && pnpm dev:ops`
Expected: Console shows `[cron] weekly memory consolidation scheduled (Sunday 3:00 AM)`

**Step 4: Commit**

```bash
git add apps/ops/worker/src/index.ts
git commit -m "feat(ops): schedule weekly memory consolidation cron"
```

---

### Task 6: Manual test — trigger consolidation

**Step 1: Add a temporary test endpoint or script**

Create a quick test by running the weekly consolidation manually. Add to `worker/src/index.ts` temporarily:

```ts
// Temporary: trigger consolidation on SIGUSR2
process.on("SIGUSR2", () => {
	console.log("[test] manual consolidation trigger")
	runWeeklyConsolidation(convex)
})
```

**Step 2: Test**

1. Start the worker: `cd apps/ops && pnpm dev:ops` (in one terminal)
2. Run a mission for any agent (to generate some memories)
3. Send SIGUSR2: `kill -USR2 $(pgrep -f "worker/src/index")`
4. Check console output — should see consolidation logs
5. Check the UI — agent memories should be cleaner

**Step 3: Remove temporary code and commit**

Remove the SIGUSR2 handler, then:

```bash
git add apps/ops/worker/src/index.ts
git commit -m "test(ops): verify memory consolidation works end-to-end"
```
