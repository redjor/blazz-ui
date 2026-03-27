import { readFile } from "node:fs/promises"
import { join } from "node:path"

export async function GET(req: Request) {
	const url = new URL(req.url)
	const slug = url.searchParams.get("slug") ?? "product-lead"
	const cwd = process.cwd()

	const parts: string[] = []
	for (const file of ["SOUL.md", "STYLE.md", "SKILL.md", "CONTEXT.md"]) {
		try {
			const content = await readFile(join(cwd, "agents", slug, file), "utf-8")
			parts.push(content)
		} catch {
			// skip
		}
	}

	const systemPrompt = parts.join("\n\n---\n\n")

	return Response.json({
		slug,
		promptLength: systemPrompt.length,
		promptStart: systemPrompt.slice(0, 500),
		soulStart: parts[0]?.slice(0, 200),
		contextStart: parts[3]?.slice(0, 200) ?? "NO CONTEXT.md",
	})
}
