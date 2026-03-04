#!/usr/bin/env tsx
// apps/docs/scripts/generate-llms.ts

import { writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { registry } from "../src/data/registry"
import type { ComponentData } from "../src/data/types"

const DOCS_BASE_URL = "https://blazz.io"

// ── llms.txt renderer ──────────────────────────────────────────────────────

function renderComponent(c: ComponentData): string {
	const lines: string[] = []

	lines.push(`## ${c.name}`)
	lines.push("")
	lines.push(`Import: \`${c.imports.path}\``)
	lines.push(`Named: \`${c.imports.named.join(", ")}\``)
	lines.push(`Docs: ${DOCS_BASE_URL}${c.docPath}`)
	lines.push("")
	lines.push(c.description)
	lines.push("")

	for (const gotcha of c.gotchas) {
		lines.push(`⚠️ ${gotcha}`)
	}
	lines.push("")

	const propSummary = c.props
		.map(
			(p) =>
				`${p.name} (${p.type}${p.required ? ", required" : ""}${p.default ? `, default: ${p.default}` : ""})`
		)
		.join(", ")
	lines.push(`Props: ${propSummary}`)
	lines.push("")

	lines.push("```tsx")
	lines.push(c.canonicalExample)
	lines.push("```")

	return lines.join("\n")
}

function generateLlmsTxt(): string {
	const sections: string[] = []

	sections.push("# @blazz/ui")
	sections.push("")
	sections.push("> AI-native React component kit for data-heavy pro apps. Base UI (not Radix).")
	sections.push("")
	sections.push("## Critical Rules")
	sections.push("")
	sections.push(
		"- ALL trigger components use `render={<Component />}` NOT `asChild` (Base UI, not Radix)"
	)
	sections.push(
		'- DateSelector NOT `<input type="date">` — import from @blazz/ui/components/ui/date-selector'
	)
	sections.push(
		"- Select/Combobox: `items`/`options` prop ALWAYS required to show labels instead of raw values"
	)
	sections.push(
		"- Import paths: `@blazz/ui/components/{category}/{name}` — not from barrel `@blazz/ui`"
	)
	sections.push("- Forms: ALWAYS use react-hook-form + zod. Never local useState for form state.")
	sections.push(
		"- All 4 states required: loading (Skeleton), empty (Empty component), error, success"
	)
	sections.push("")
	sections.push("---")
	sections.push("")

	const byCategory = registry.reduce<Record<string, ComponentData[]>>((acc, c) => {
		acc[c.category] = acc[c.category] ?? []
		acc[c.category].push(c)
		return acc
	}, {})

	const categoryOrder = ["ui", "patterns", "blocks", "ai"] as const
	const categoryLabels: Record<string, string> = {
		ui: "UI Primitives",
		patterns: "Patterns",
		blocks: "Business Blocks",
		ai: "AI Components",
	}

	for (const cat of categoryOrder) {
		const components = byCategory[cat]
		if (!components?.length) continue

		sections.push(`# ${categoryLabels[cat]}`)
		sections.push("")
		for (const component of components) {
			sections.push(renderComponent(component))
			sections.push("")
			sections.push("---")
			sections.push("")
		}
	}

	return sections.join("\n")
}

// ── AI.md renderer ─────────────────────────────────────────────────────────

function generateAiMd(): string {
	const lines: string[] = []

	lines.push("# @blazz/ui — AI Context")
	lines.push("")
	lines.push("> Read before generating any @blazz/ui code.")
	lines.push("")
	lines.push("## Critical Patterns")
	lines.push("")
	lines.push("### 1. Select — ALWAYS pass items")
	lines.push("Without `items`, SelectValue shows raw value ('active'), not label ('Active').")
	lines.push("```tsx")
	lines.push(
		'<Select items={[{ value: "active", label: "Active" }]} value={v} onValueChange={setV}>'
	)
	lines.push("```")
	lines.push("")
	lines.push("### 2. Triggers — render={} not asChild (Base UI)")
	lines.push("```tsx")
	lines.push("<DialogTrigger render={<Button />}>Open</DialogTrigger>  // ✅")
	lines.push("<DialogTrigger asChild><Button /></DialogTrigger>         // ❌")
	lines.push("```")
	lines.push("")
	lines.push("### 3. Dates — DateSelector not input type='date'")
	lines.push("```tsx")
	lines.push('import { DateSelector } from "@blazz/ui/components/ui/date-selector"')
	lines.push('<DateSelector value={date} onValueChange={setDate} formatStr="dd/MM/yyyy" />')
	lines.push("```")
	lines.push("")
	lines.push("### 4. Forms — react-hook-form + zod always")
	lines.push("Never useState for form fields. Always useForm + zodResolver.")
	lines.push("")
	lines.push("### 5. 4 required states")
	lines.push(
		"Every data-loading component needs: loading (Skeleton), empty (Empty), error, success."
	)
	lines.push("")
	lines.push("---")
	lines.push("")
	lines.push("## Component Index")
	lines.push("")
	lines.push("| Component | Import | Key Gotcha |")
	lines.push("|-----------|--------|------------|")

	for (const c of registry) {
		const mainGotcha = c.gotchas[0]?.slice(0, 80) ?? ""
		lines.push(`| ${c.name} | \`${c.imports.path}\` | ${mainGotcha} |`)
	}

	lines.push("")
	lines.push("---")
	lines.push("")
	lines.push("## Full Component Reference")
	lines.push("")

	for (const c of registry) {
		lines.push(`### ${c.name}`)
		lines.push("")
		lines.push(`\`${c.imports.path}\``)
		lines.push(`Named: \`${c.imports.named.join(", ")}\``)
		lines.push("")
		for (const gotcha of c.gotchas) {
			lines.push(`- ⚠️ ${gotcha}`)
		}
		lines.push("")
		lines.push("```tsx")
		lines.push(c.canonicalExample)
		lines.push("```")
		lines.push("")
	}

	return lines.join("\n")
}

// ── Main ───────────────────────────────────────────────────────────────────

// ── Validation ─────────────────────────────────────────────────────────────

const warnings: string[] = []
for (const c of registry) {
	if (c.gotchas.length === 0) {
		warnings.push(`  ⚠ ${c.name}: no gotchas (at least one required)`)
	}
	if (!c.canonicalExample.trim()) {
		warnings.push(`  ⚠ ${c.name}: empty canonicalExample`)
	}
}

if (warnings.length > 0) {
	console.warn("Validation warnings:")
	for (const w of warnings) console.warn(w)
}

// ── Output ─────────────────────────────────────────────────────────────────

const llmsTxt = generateLlmsTxt()
const aiMd = generateAiMd()

const docsPublicDir = join(import.meta.dirname, "..", "public")
const uiPackageDir = join(import.meta.dirname, "..", "..", "..", "packages", "ui")

mkdirSync(docsPublicDir, { recursive: true })
writeFileSync(join(docsPublicDir, "llms.txt"), llmsTxt, "utf-8")
mkdirSync(uiPackageDir, { recursive: true })
writeFileSync(join(uiPackageDir, "AI.md"), aiMd, "utf-8")

console.log(`✓ public/llms.txt — ${registry.length} components`)
console.log(`✓ packages/ui/AI.md — ${registry.length} components`)
