import { listPatterns, loadPattern } from "../loader.js"

export function pattern(name: string): void {
  if (!name) {
    const available = listPatterns()
    process.stderr.write(`Usage: blazz pattern <name>\nAvailable: ${available.join(", ")}\n`)
    process.exit(1)
  }

  const content = loadPattern(name)
  if (!content) {
    const available = listPatterns()
    process.stderr.write(`Pattern "${name}" not found.\nAvailable: ${available.join(", ")}\n`)
    process.exit(1)
  }

  process.stdout.write(content)
}
