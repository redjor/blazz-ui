import OpenAI from "openai"

const openai = new OpenAI()

export async function generateCoverImage(title: string): Promise<string | null> {
	try {
		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: `Create a minimalist ASCII art style illustration for a professional document cover about: "${title}".

Requirements:
- White or very light background
- Dark monochrome ASCII characters forming a visual representation of the topic
- Clean, structured composition with clear visual hierarchy
- Terminal/code aesthetic with subtle grid patterns
- The ASCII art should be abstract and artistic, not literal text
- Professional and sophisticated, suitable for a business document
- No text, no words, no letters - only abstract ASCII-inspired visual patterns and shapes
- Subtle depth with varying character density`,
			size: "1792x1024",
			quality: "standard",
			response_format: "b64_json",
			n: 1,
		})

		const b64 = response.data[0]?.b64_json
		if (!b64) return null

		return `data:image/png;base64,${b64}`
	} catch (error) {
		console.error("[Cover Image] Generation failed:", error)
		return null
	}
}
