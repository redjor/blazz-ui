import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

const SYSTEM_PROMPTS: Record<string, string> = {
	ask: "You are a helpful writing assistant. Respond in the same language as the user's prompt. Output only the generated content, no preamble.",
	continue:
		"You are a writing assistant. Continue the text naturally, matching the style, tone, and language. Output only the continuation, no preamble or repetition of existing text.",
	summarize:
		"Summarize the following text concisely, preserving key points. Use the same language as the input. Output only the summary.",
	fix: "Fix grammar, spelling, and punctuation in the following text. Preserve the meaning and tone. Output only the corrected text.",
	translate:
		"Detect the language of the following text. If French, translate to English. If English, translate to French. For other languages, translate to English. Output only the translation.",
	tone_professional:
		"Rewrite the following text in a professional, formal tone. Same language. Output only the rewritten text.",
	tone_casual:
		"Rewrite the following text in a casual, conversational tone. Same language. Output only the rewritten text.",
	tone_friendly:
		"Rewrite the following text in a warm, friendly tone. Same language. Output only the rewritten text.",
	tone_concise:
		"Rewrite the following text to be as concise as possible while preserving meaning. Same language. Output only the rewritten text.",
}

export async function POST(req: Request) {
	if (!process.env.OPENAI_API_KEY) {
		return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}

	const { action, prompt, context } = await req.json()

	const systemPrompt = SYSTEM_PROMPTS[action]
	if (!systemPrompt) {
		return new Response(JSON.stringify({ error: "Unknown action" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		})
	}

	let userMessage = ""
	if (action === "ask") {
		userMessage = context ? `Context:\n${context}\n\nRequest: ${prompt}` : prompt
	} else if (action === "continue") {
		userMessage = context || ""
	} else {
		userMessage = prompt || context || ""
	}

	const result = streamText({
		model: openai.chat("gpt-4o-mini"),
		system: systemPrompt,
		prompt: userMessage,
	})

	return result.toDataStreamResponse()
}
