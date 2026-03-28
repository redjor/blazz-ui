import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

const AGENTS_DIR = join(import.meta.dirname, "../../agents")

export interface SoulData {
	systemPrompt: string
	soulHash: string
}

async function loadFileOptional(path: string): Promise<string | null> {
	try {
		return await readFile(path, "utf-8")
	} catch {
		return null
	}
}

export async function loadSoul(slug: string): Promise<SoulData> {
	const dir = join(AGENTS_DIR, slug)

	const [soul, style, skill, context] = await Promise.all([
		readFile(join(dir, "SOUL.md"), "utf-8"),
		readFile(join(dir, "STYLE.md"), "utf-8"),
		readFile(join(dir, "SKILL.md"), "utf-8"),
		loadFileOptional(join(dir, "CONTEXT.md")),
	])

	const parts = [soul, style, skill]
	if (context) parts.push(context)

	const systemPrompt = parts.join("\n\n---\n\n")
	const soulHash = createHash("sha256").update(systemPrompt).digest("hex").slice(0, 8)

	return { systemPrompt, soulHash }
}
