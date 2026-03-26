import OpenAI from "openai"
import type { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"

let _openai: OpenAI
function getOpenAI() {
	if (!_openai) _openai = new OpenAI()
	return _openai
}

interface MemoryExtraction {
	facts: string[]
	preferences: string[]
	episodes: string[]
	patterns: string[]
	shared: string[] // facts relevant to all agents
}

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
	source: "mission" | "chat",
) {
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
	} catch (err) {
		console.error("[memory] extraction error:", err)
	}
}
