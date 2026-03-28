import type { ConvexHttpClient } from "convex/browser"
import OpenAI from "openai"
import { api } from "./convex"

let _openai: OpenAI
function getOpenAI() {
	if (!_openai) _openai = new OpenAI()
	return _openai
}

export interface MemoryExtraction {
	facts: string[]
	preferences: string[]
	episodes: string[]
	patterns: string[]
	shared: string[] // facts relevant to all agents
}

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

/**
 * Post-mission/chat memory extraction.
 * Uses GPT-4o-mini to extract structured memories from the conversation output.
 */
export async function extractAndSaveMemories(
	convex: ConvexHttpClient,
	agentId: string,
	userId: string,
	missionId: string | undefined,
	output: string,
	source: "mission" | "chat"
): Promise<MemoryExtraction | undefined> {
	try {
		const response = await getOpenAI().chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content: `Tu extrais des mémoires structurées d'une conversation entre un agent IA et un utilisateur.

Extrais UNIQUEMENT les informations nouvelles et utiles pour de futures interactions. Sois sélectif.

Réponds en JSON strict avec ces catégories :
- facts: données factuelles nouvelles (chiffres, dates, noms, états). Ex: "Solde Qonto au 26 mars : 24 350€"
- preferences: choix ou opinions de l'utilisateur. Ex: "Préfère les forecasts conservateurs"
- episodes: résumé de la conversation en 1-2 phrases. Ex: "Discussion sur l'investissement monitoring, Jonathan hésite"
- patterns: comportements récurrents observés. Ex: "Vérifie toujours les anomalies de temps le vendredi"
- shared: faits importants pour TOUS les agents (pas juste celui-ci). Ex: "Client TechVision renouvelle pour Q2 2026"

Chaque entrée = 1 phrase courte. Max 3 par catégorie. Catégories vides = tableau vide.
Si rien d'intéressant, retourne tous les tableaux vides.`,
				},
				{
					role: "user",
					content: `Output de ${source} :\n\n${output.slice(0, 4000)}`,
				},
			],
			response_format: { type: "json_object" },
			max_tokens: 500,
		})

		const content = response.choices[0].message.content
		if (!content) return

		const extraction: MemoryExtraction = JSON.parse(content)

		const now = Date.now()
		const thirtyDays = 30 * 24 * 60 * 60 * 1000
		const ninetyDays = 90 * 24 * 60 * 60 * 1000

		// Save private memories
		for (const fact of extraction.facts ?? []) {
			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				agentId: agentId as any,
				missionId: missionId as any,
				scope: "private",
				category: "fact",
				content: fact,
				confidence: 0.7,
				source,
				expiresAt: now + thirtyDays,
			})
		}

		for (const pref of extraction.preferences ?? []) {
			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				agentId: agentId as any,
				missionId: missionId as any,
				scope: "private",
				category: "preference",
				content: pref,
				confidence: 0.8,
				source,
			})
		}

		for (const episode of extraction.episodes ?? []) {
			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				agentId: agentId as any,
				missionId: missionId as any,
				scope: "private",
				category: "episode",
				content: episode,
				confidence: 1.0,
				source,
				expiresAt: now + ninetyDays,
			})
		}

		for (const pattern of extraction.patterns ?? []) {
			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				agentId: agentId as any,
				missionId: missionId as any,
				scope: "private",
				category: "pattern",
				content: pattern,
				confidence: 0.5, // starts low, increases on confirmation
				source,
			})
		}

		// Save shared memories
		for (const shared of extraction.shared ?? []) {
			await convex.mutation(api.worker.workerAddMemory, {
				userId: userId as any,
				scope: "shared",
				category: "fact",
				content: shared,
				confidence: 0.7,
				source,
				expiresAt: now + ninetyDays,
			})
		}

		return extraction
	} catch (err) {
		console.error("[memory] extraction error:", err)
		return undefined
	}
}

export async function consolidatePostMission(convex: ConvexHttpClient, agentId: string, userId: string, missionId: string | undefined, newMemories: MemoryExtraction) {
	const allNew = [
		...(newMemories.facts ?? []).map((c) => ({ content: c, category: "fact" })),
		...(newMemories.preferences ?? []).map((c) => ({ content: c, category: "preference" })),
		...(newMemories.episodes ?? []).map((c) => ({ content: c, category: "episode" })),
		...(newMemories.patterns ?? []).map((c) => ({ content: c, category: "pattern" })),
		...(newMemories.shared ?? []).map((c) => ({ content: c, category: "fact", scope: "shared" })),
	]
	if (allNew.length === 0) return

	try {
		const allExisting = await convex.query(api.worker.workerListMemory, {
			agentId: agentId as any,
		})
		// Filter out memories just saved by extractAndSaveMemories (same missionId)
		// to avoid the LLM seeing duplicates in both "existing" and "new"
		const existing = allExisting.filter((m: any) => m.missionId !== missionId)
		if (existing.length === 0) return

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

		const newForPrompt = allNew.map((m, i) => ({
			index: i,
			content: m.content,
			category: m.category,
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

		for (const upd of result.update ?? []) {
			await convex.mutation(api.worker.workerUpdateMemory, {
				id: upd.id as any,
				content: upd.content,
				confidence: upd.confidence,
			})
		}

		const existingMap = new Map(existing.map((m: any) => [m._id, m]))
		for (const id of result.delete ?? []) {
			const mem = existingMap.get(id)
			if (mem && (mem as any).category === "rule") continue
			await convex.mutation(api.worker.workerDeleteMemory, { id: id as any })
		}

		for (const ins of result.insert ?? []) {
			const category = ins.category as "fact" | "preference" | "episode" | "pattern" | "rule"
			const thirtyDays = 30 * 24 * 60 * 60 * 1000
			const ninetyDays = 90 * 24 * 60 * 60 * 1000
			const expiresAt = category === "fact" ? Date.now() + thirtyDays : category === "episode" ? Date.now() + ninetyDays : undefined

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
