#!/usr/bin/env tsx
// apps/docs/scripts/generate-llms.ts

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { registry } from "../src/data/registry"

const __dirname = dirname(fileURLToPath(import.meta.url))
import {
	type ComponentData,
	type ComponentDataLite,
	type RegistryEntry,
	isFullComponent,
} from "../src/data/types"

const DOCS_BASE_URL = "https://blazz.io"

// ── Helpers ─────────────────────────────────────────────────────────────────

function getPackage(category: string): "@blazz/ui" | "@blazz/pro" {
	return category === "ui" || category === "patterns" ? "@blazz/ui" : "@blazz/pro"
}

function byCategory(entries: RegistryEntry[]): Record<string, RegistryEntry[]> {
	return entries.reduce<Record<string, RegistryEntry[]>>((acc, c) => {
		acc[c.category] = acc[c.category] ?? []
		acc[c.category].push(c)
		return acc
	}, {})
}

// ── Renderers ───────────────────────────────────────────────────────────────

function renderFullComponent(c: ComponentData): string {
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

function renderLiteComponent(c: ComponentDataLite): string {
	const lines: string[] = []
	lines.push(`### ${c.name}`)
	lines.push("")
	lines.push(`Import: \`${c.imports.path}\``)
	lines.push(`Named: \`${c.imports.named.join(", ")}\``)
	lines.push("")
	lines.push(c.description)
	lines.push(`Use case: ${c.useCase}`)
	lines.push("")
	lines.push("```tsx")
	lines.push(c.canonicalExample)
	lines.push("```")
	return lines.join("\n")
}

function renderAiMdFull(c: ComponentData): string {
	const lines: string[] = []
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
	return lines.join("\n")
}

// ── packages/ui/AI.md ───────────────────────────────────────────────────────

function generateUiAiMd(): string {
	const uiEntries = registry.filter((c) => getPackage(c.category) === "@blazz/ui")
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

	// Component Index
	lines.push("## Component Index")
	lines.push("")
	lines.push("| Component | Import | Key Gotcha |")
	lines.push("|-----------|--------|------------|")

	for (const c of uiEntries) {
		if (isFullComponent(c)) {
			const mainGotcha = c.gotchas[0]?.slice(0, 80) ?? ""
			lines.push(`| ${c.name} | \`${c.imports.path}\` | ${mainGotcha} |`)
		}
	}

	lines.push("")
	lines.push("---")
	lines.push("")

	// Full Component Reference
	lines.push("## Full Component Reference")
	lines.push("")

	for (const c of uiEntries) {
		if (isFullComponent(c)) {
			lines.push(renderAiMdFull(c))
		}
	}

	return lines.join("\n")
}

// ── packages/pro/AI.md ──────────────────────────────────────────────────────

function generateProAiMd(): string {
	const proEntries = registry.filter((c) => getPackage(c.category) === "@blazz/pro")
	const grouped = byCategory(proEntries)
	const lines: string[] = []

	lines.push("# @blazz/pro — AI Context")
	lines.push("")
	lines.push("> Read before generating any @blazz/pro code.")
	lines.push("")
	lines.push("## Critical Patterns")
	lines.push("")
	lines.push("### 1. Import paths")
	lines.push("- Blocks: `@blazz/pro/components/blocks/{name}` (e.g. data-table, stats-grid)")
	lines.push(
		"- AI core: `@blazz/pro/components/ai/{domain}` (e.g. chat, reasoning, tools) — direct import, NO barrel"
	)
	lines.push(
		"- AI generative: `@blazz/pro/components/ai/generative/{domain}/{name}` — direct import"
	)
	lines.push("")
	lines.push("### 2. No barrel export for AI")
	lines.push(
		'AI components are NOT exported from `@blazz/pro` barrel. Import directly from their module path. `import { ChatMessage } from "@blazz/pro"` will NOT work.'
	)
	lines.push("")
	lines.push("### 3. @blazz/ui is a peer dependency")
	lines.push(
		"Use @blazz/ui primitives (Button, Dialog, Badge, etc.) — don't recreate them. @blazz/pro builds on top of @blazz/ui."
	)
	lines.push("")
	lines.push("### 4. License required")
	lines.push(
		"All @blazz/pro components are wrapped with `withProGuard()`. Wrap your app in `<BlazzProvider licenseKey={key}>` to unlock them."
	)
	lines.push("")
	lines.push("---")
	lines.push("")

	// Component Index — Blocks
	const blocks = (grouped.blocks ?? []).filter(isFullComponent)
	if (blocks.length > 0) {
		lines.push("## Component Index — Blocks")
		lines.push("")
		lines.push("| Component | Import | Key Gotcha |")
		lines.push("|-----------|--------|------------|")
		for (const c of blocks) {
			const mainGotcha = c.gotchas[0]?.slice(0, 80) ?? ""
			lines.push(`| ${c.name} | \`${c.imports.path}\` | ${mainGotcha} |`)
		}
		lines.push("")
	}

	// Component Index — AI Core
	const aiAll = grouped.ai ?? []
	const aiCore = aiAll.filter(isFullComponent)
	if (aiCore.length > 0) {
		lines.push("## Component Index — AI Core")
		lines.push("")
		lines.push("| Component | Import | Key Gotcha |")
		lines.push("|-----------|--------|------------|")
		for (const c of aiCore) {
			const mainGotcha = c.gotchas[0]?.slice(0, 80) ?? ""
			lines.push(`| ${c.name} | \`${c.imports.path}\` | ${mainGotcha} |`)
		}
		lines.push("")
	}

	lines.push("---")
	lines.push("")

	// Full Component Reference — Blocks
	if (blocks.length > 0) {
		lines.push("## Full Component Reference — Blocks")
		lines.push("")
		for (const c of blocks) {
			lines.push(renderAiMdFull(c))
		}
		lines.push("---")
		lines.push("")
	}

	// Full Component Reference — AI Core
	if (aiCore.length > 0) {
		lines.push("## Full Component Reference — AI Core")
		lines.push("")
		for (const c of aiCore) {
			lines.push(renderAiMdFull(c))
		}
		lines.push("---")
		lines.push("")
	}

	// AI Generative Components (lite)
	const aiLite = aiAll.filter((c): c is ComponentDataLite => !isFullComponent(c))
	if (aiLite.length > 0) {
		lines.push("## AI Generative Components")
		lines.push("")
		lines.push(
			`> ${aiLite.length} ready-to-use UI cards for AI chat responses. Import directly from \`@blazz/pro/components/ai/generative/{domain}/{name}\`.`
		)
		lines.push("")

		// Group by domain (extracted from import path)
		const byDomain: Record<string, ComponentDataLite[]> = {}
		for (const c of aiLite) {
			const parts = c.imports.path.split("/")
			const domain = parts[parts.length - 2] // e.g. "commerce", "content"
			byDomain[domain] = byDomain[domain] ?? []
			byDomain[domain].push(c)
		}

		const domainOrder = ["commerce", "content", "data", "entities", "planning", "workflow"]
		const domainLabels: Record<string, string> = {
			commerce: "Commerce",
			content: "Content",
			data: "Data",
			entities: "Entities",
			planning: "Planning",
			workflow: "Workflow",
		}

		for (const domain of domainOrder) {
			const components = byDomain[domain]
			if (!components?.length) continue

			lines.push(`### ${domainLabels[domain] ?? domain}`)
			lines.push("")
			for (const c of components) {
				lines.push(renderLiteComponent(c))
				lines.push("")
			}
		}
	}

	return lines.join("\n")
}

// ── apps/docs/public/llms.txt ───────────────────────────────────────────────

function generateLlmsTxt(): string {
	const sections: string[] = []

	sections.push("# Blazz UI Kit")
	sections.push("")
	sections.push(
		"> AI-native React component kit for data-heavy pro apps. Two packages: @blazz/ui (open-source) and @blazz/pro (paid)."
	)
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
		"- @blazz/ui imports: `@blazz/ui/components/{category}/{name}` — not from barrel"
	)
	sections.push(
		"- @blazz/pro blocks: `@blazz/pro/components/blocks/{name}` — not from barrel"
	)
	sections.push(
		"- @blazz/pro AI: `@blazz/pro/components/ai/{domain}` — direct import, NO barrel export"
	)
	sections.push("- Forms: ALWAYS use react-hook-form + zod. Never local useState for form state.")
	sections.push(
		"- All 4 states required: loading (Skeleton), empty (Empty component), error, success"
	)
	sections.push("")
	sections.push("---")
	sections.push("")

	const categoryOrder = ["ui", "patterns", "blocks", "ai"] as const
	const categoryLabels: Record<string, string> = {
		ui: "@blazz/ui — UI Primitives",
		patterns: "@blazz/ui — Patterns",
		blocks: "@blazz/pro — Business Blocks",
		ai: "@blazz/pro — AI Components",
	}

	const grouped = byCategory(registry)

	for (const cat of categoryOrder) {
		const components = grouped[cat]
		if (!components?.length) continue

		sections.push(`# ${categoryLabels[cat]}`)
		sections.push("")

		// Full components
		const full = components.filter(isFullComponent)
		for (const component of full) {
			sections.push(renderFullComponent(component))
			sections.push("")
			sections.push("---")
			sections.push("")
		}

		// Lite components (AI generative)
		const lite = components.filter((c): c is ComponentDataLite => !isFullComponent(c))
		if (lite.length > 0) {
			sections.push(`## Generative UI Components (${lite.length})`)
			sections.push("")
			for (const component of lite) {
				sections.push(renderLiteComponent(component))
				sections.push("")
			}
			sections.push("---")
			sections.push("")
		}
	}

	return sections.join("\n")
}

// ── Validation ──────────────────────────────────────────────────────────────

const warnings: string[] = []
for (const c of registry) {
	if (isFullComponent(c)) {
		if (c.gotchas.length === 0) {
			warnings.push(`  ⚠ ${c.name}: no gotchas (at least one required)`)
		}
	}
	if (!c.canonicalExample.trim()) {
		warnings.push(`  ⚠ ${c.name}: empty canonicalExample`)
	}
}

if (warnings.length > 0) {
	console.warn("Validation warnings:")
	for (const w of warnings) console.warn(w)
}

// ── Output ──────────────────────────────────────────────────────────────────

const uiAiMd = generateUiAiMd()
const proAiMd = generateProAiMd()
const llmsTxt = generateLlmsTxt()

const docsPublicDir = join(__dirname, "..", "public")
const uiPackageDir = join(__dirname, "..", "..", "..", "packages", "ui")
const proPackageDir = join(__dirname, "..", "..", "..", "packages", "pro")

mkdirSync(docsPublicDir, { recursive: true })
mkdirSync(uiPackageDir, { recursive: true })
mkdirSync(proPackageDir, { recursive: true })

writeFileSync(join(docsPublicDir, "llms.txt"), llmsTxt, "utf-8")
writeFileSync(join(uiPackageDir, "AI.md"), uiAiMd, "utf-8")
writeFileSync(join(proPackageDir, "AI.md"), proAiMd, "utf-8")

const uiCount = registry.filter((c) => getPackage(c.category) === "@blazz/ui").length
const proCount = registry.filter((c) => getPackage(c.category) === "@blazz/pro").length
console.log(`✓ packages/ui/AI.md — ${uiCount} components`)
console.log(`✓ packages/pro/AI.md — ${proCount} components`)
console.log(`✓ public/llms.txt — ${registry.length} components total`)
