import { loadComponents } from "../loader.js"
import { parseComponentList } from "../parse-components.js"

export function list(): void {
  const markdown = loadComponents()
  const components = parseComponentList(markdown)

  const grouped = new Map<string, typeof components>()
  for (const c of components) {
    const group = grouped.get(c.category) ?? []
    group.push(c)
    grouped.set(c.category, group)
  }

  const lines: string[] = ["# Blazz Components\n"]
  for (const [category, items] of grouped) {
    lines.push(`## ${category}\n`)
    for (const item of items) {
      lines.push(`- **${item.name}** — ${item.description}`)
    }
    lines.push("")
  }

  process.stdout.write(lines.join("\n"))
}
