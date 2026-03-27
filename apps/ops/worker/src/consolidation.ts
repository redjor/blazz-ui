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

		const userId = (allMemories[0] as any)?.userId
		if (!userId) return

		for (const upd of result.update ?? []) {
			await convex.mutation(api.worker.workerUpdateMemory, {
				id: upd.id as any,
				content: upd.content,
				confidence: upd.confidence,
			})
		}

		const memMap = new Map(allMemories.map((m: any) => [m._id, m]))
		for (const id of result.delete ?? []) {
			const mem = memMap.get(id)
			if (mem && (mem as any).category === "rule") continue
			await convex.mutation(api.worker.workerDeleteMemory, { id: id as any })
		}

		for (const ins of result.insert ?? []) {
			const category = ins.category as "fact" | "preference" | "episode" | "pattern" | "rule"
			const thirtyDays = 30 * 24 * 60 * 60 * 1000
			const ninetyDays = 90 * 24 * 60 * 60 * 1000
			const expiresAt = category === "fact"
				? Date.now() + thirtyDays
				: category === "episode"
					? Date.now() + ninetyDays
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
