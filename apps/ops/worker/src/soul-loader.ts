import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { join } from "node:path"

const AGENTS_DIR = join(import.meta.dirname, "../../agents")

export interface SoulData {
  systemPrompt: string
  soulHash: string
}

export async function loadSoul(slug: string): Promise<SoulData> {
  const dir = join(AGENTS_DIR, slug)

  const [soul, style, skill] = await Promise.all([
    readFile(join(dir, "SOUL.md"), "utf-8"),
    readFile(join(dir, "STYLE.md"), "utf-8"),
    readFile(join(dir, "SKILL.md"), "utf-8"),
  ])

  const systemPrompt = [soul, style, skill].join("\n\n---\n\n")
  const soulHash = createHash("sha256").update(systemPrompt).digest("hex").slice(0, 8)

  return { systemPrompt, soulHash }
}
