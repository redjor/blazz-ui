import { loadComponents } from "../loader.js"
import { extractComponentSection } from "../parse-components.js"

export function show(name: string): void {
  if (!name) {
    process.stderr.write("Usage: blazz show <component>\nExample: blazz show button\n")
    process.exit(1)
  }

  const markdown = loadComponents()
  const section = extractComponentSection(markdown, name)

  if (!section) {
    process.stderr.write(`Component "${name}" not found.\nRun "blazz list" to see available components.\n`)
    process.exit(1)
  }

  process.stdout.write(section)
}
