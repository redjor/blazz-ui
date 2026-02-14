#!/usr/bin/env tsx
/**
 * Generates ai/registry.json from all __meta exports in components.
 * 
 * Run: npx tsx scripts/build-registry.ts
 * 
 * This creates a single JSON file that AI tools can consume.
 * The file is auto-generated — never edit it manually.
 */

import { readdir, readFile, writeFile } from "fs/promises"
import { join, relative } from "path"

const SRC_DIR = join(process.cwd(), "src/components")
const OUTPUT = join(process.cwd(), "ai/registry.json")

interface RegistryEntry {
  name: string
  path: string
  description: string
  context: string[]
  dataComplexity: string
  requires?: string[]
  pairs_with?: string[]
  example_usage: string
}

async function findTsxFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findTsxFiles(fullPath)))
    } else if (entry.name.endsWith(".tsx") && !entry.name.includes(".test.")) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract __meta from a file using regex (no import needed).
 * This is intentionally simple — we parse the const, not import the module.
 * For a more robust solution, use ts-morph or the TypeScript compiler API.
 */
function extractMeta(content: string): Record<string, unknown> | null {
  const metaMatch = content.match(
    /export\s+const\s+__meta\s*=\s*(\{[\s\S]*?\})\s*(?:as\s+const)?(?:\s+satisfies\s+\w+)?;/
  )
  if (!metaMatch) return null

  try {
    // Crude but effective: replace single quotes, remove trailing commas
    const jsonish = metaMatch[1]
      .replace(/'/g, '"')
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      // Remove template literals (preview strings) — we don't need them in registry
      .replace(/`[\s\S]*?`/g, '""')

    return JSON.parse(jsonish)
  } catch {
    // If JSON parse fails, it's probably complex — skip or use AST parser
    console.warn("⚠ Could not parse __meta, consider simplifying the object")
    return null
  }
}

async function main() {
  console.log("🔍 Scanning components...")

  const files = await findTsxFiles(SRC_DIR)
  const registry: RegistryEntry[] = []

  for (const file of files) {
    const content = await readFile(file, "utf-8")
    const meta = extractMeta(content)

    if (meta) {
      const relPath = relative(join(process.cwd(), "src"), file)
        .replace(/\.tsx$/, "")
        .replace(/\\/g, "/")

      registry.push({
        name: meta.name as string,
        path: `@/${relPath}`,
        description: meta.description as string,
        context: meta.context as string[],
        dataComplexity: meta.dataComplexity as string,
        requires: meta.requires as string[] | undefined,
        pairs_with: meta.pairs_with as string[] | undefined,
        example_usage: meta.example_usage as string,
      })

      console.log(`  ✓ ${meta.name}`)
    }
  }

  // Build reverse index: context → component names
  const contextIndex: Record<string, string[]> = {}
  for (const entry of registry) {
    for (const ctx of entry.context) {
      if (!contextIndex[ctx]) contextIndex[ctx] = []
      contextIndex[ctx].push(entry.name)
    }
  }

  const output = {
    generated_at: new Date().toISOString(),
    total_components: registry.length,
    components: registry,
    context_index: contextIndex,
  }

  await writeFile(OUTPUT, JSON.stringify(output, null, 2))
  console.log(`\n✅ Registry generated: ${OUTPUT}`)
  console.log(`   ${registry.length} components indexed`)
}

main().catch(console.error)
