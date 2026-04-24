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
		public retryable: boolean
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
