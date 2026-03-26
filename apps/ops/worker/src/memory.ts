import OpenAI from "openai"
import type { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"

let _openai: OpenAI
function getOpenAI() {
	if (!_openai) _openai = new OpenAI()
	return _openai
}

export async function generatePostMissionMemory(
  convex: ConvexHttpClient,
  agentId: string,
  missionId: string,
  agentModel: string,
  output: string,
) {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini", // Always use cheap model for memory
      messages: [
        {
          role: "system",
          content: `Tu es un assistant qui résume les apprentissages d'une mission.
Résume en 2-3 phrases UNIQUEMENT les informations clés apprises qui seraient utiles
pour de futures missions. Ne résume PAS le rapport — résume ce que tu as APPRIS
(patterns, anomalies récurrentes, contexte business, chiffres clés à retenir).
Réponds en français.`,
        },
        {
          role: "user",
          content: `Output de la mission :\n\n${output.slice(0, 3000)}`,
        },
      ],
      max_tokens: 200,
    })

    const summary = response.choices[0].message.content
    if (!summary) return

    await convex.mutation(api.agentMemory.add, {
      agentId: agentId as any,
      missionId: missionId as any,
      type: "summary",
      content: summary,
      // Summaries expire after 90 days
      expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
    })
  } catch (err) {
    console.error("[memory] generation error:", err)
  }
}
