import { readFileSync, readdirSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

function getRoot(): string {
  if (process.env.BLAZZ_ROOT) return process.env.BLAZZ_ROOT
  let dir = resolve(__dirname)
  for (let i = 0; i < 6; i++) {
    dir = dirname(dir)
    try {
      readdirSync(join(dir, "ai"))
      return dir
    } catch {
      // continue
    }
  }
  throw new Error(
    "Could not find project root. Set BLAZZ_ROOT environment variable."
  )
}

const ROOT = getRoot()

function readFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), "utf-8")
}

export function loadRules(): string {
  return readFile("ai/rules.md")
}

export function loadComponents(): string {
  return readFile("ai/components.md")
}

export function loadPattern(name: string): string {
  const safeName = name.replace(/[^a-z0-9-]/gi, "")
  return readFile(`ai/patterns/${safeName}.md`)
}

export function listPatterns(): string[] {
  const dir = join(ROOT, "ai/patterns")
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""))
}

export function loadDesignPrinciples(): string {
  return readFile("ai/design.md")
}

export function loadTokens(): string {
  return readFile("packages/ui/styles/tokens.css")
}
