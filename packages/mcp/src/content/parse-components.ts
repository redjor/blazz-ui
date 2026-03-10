export interface ComponentEntry {
  name: string
  category: string
  description: string
}

/**
 * Parse all components from the components.md markdown into a structured list.
 *
 * Handles two entry formats:
 * - Inline: `- **Name** — description text`
 * - Heading: `### Name` followed by description paragraph
 *
 * Category is derived from the last `## ` heading encountered.
 */
export function parseComponentList(markdown: string): ComponentEntry[] {
  const lines = markdown.split("\n")
  const entries: ComponentEntry[] = []
  let currentCategory = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Category header: ## Category Name
    const categoryMatch = line.match(/^## (.+)/)
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim()
      continue
    }

    // Heading entry: ### ComponentName
    const headingMatch = line.match(/^### (.+)/)
    if (headingMatch) {
      const name = headingMatch[1].trim()
      // Look ahead for description (first non-empty line that isn't a code fence)
      let description = ""
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j].trim()
        if (next === "") continue
        if (next.startsWith("```") || next.startsWith("##") || next.startsWith("- **")) break
        description = next
        break
      }
      entries.push({ name, category: currentCategory, description })
      continue
    }

    // Inline entry: - **Name** — description  (or - **Name** / **Name2** — description)
    const inlineMatch = line.match(/^- \*\*(.+?)\*\*(?:\s*\/\s*\*\*.*?\*\*)*\s*[—–-]\s*(.*)/)
    if (inlineMatch) {
      const name = inlineMatch[1].trim()
      const description = inlineMatch[2].trim()
      entries.push({ name, category: currentCategory, description })
      continue
    }
  }

  return entries
}

/**
 * Extract the full markdown section for a specific component.
 *
 * - For `### Name` entries: returns from `### Name` to the next `###` or `##`
 * - For `- **Name** — ` entries: returns from that line to the next `- **`, `##`, or `###`
 * - Case-insensitive matching on name
 * - Returns null if not found
 */
export function extractComponentSection(
  markdown: string,
  name: string
): string | null {
  const lines = markdown.split("\n")
  const nameLower = name.toLowerCase()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check heading entry: ### Name
    const headingMatch = line.match(/^### (.+)/)
    if (headingMatch && headingMatch[1].trim().toLowerCase() === nameLower) {
      const sectionLines = [line]
      for (let j = i + 1; j < lines.length; j++) {
        if (/^##/.test(lines[j])) break
        sectionLines.push(lines[j])
      }
      return trimTrailingBlanks(sectionLines)
    }

    // Check inline entry: - **Name** —
    const inlineMatch = line.match(/^- \*\*(.+?)\*\*/)
    if (inlineMatch && inlineMatch[1].trim().toLowerCase() === nameLower) {
      const sectionLines = [line]
      for (let j = i + 1; j < lines.length; j++) {
        if (/^- \*\*/.test(lines[j]) || /^##/.test(lines[j])) break
        sectionLines.push(lines[j])
      }
      return trimTrailingBlanks(sectionLines)
    }
  }

  return null
}

function trimTrailingBlanks(lines: string[]): string {
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop()
  }
  return lines.join("\n")
}
