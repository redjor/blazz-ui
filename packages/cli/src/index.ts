import { compose } from "./commands/compose.js"
import { design } from "./commands/design.js"
import { list } from "./commands/list.js"
import { pattern } from "./commands/pattern.js"
import { rules } from "./commands/rules.js"
import { show } from "./commands/show.js"
import { tokens } from "./commands/tokens.js"

const HELP = `Usage: blazz <command> [args]

Commands:
  list                List all components (name, category, description)
  show <component>    Full documentation for a specific component
  pattern <name>      Page pattern (resource-list, dashboard, etc.)
  compose             Layout primitives, compositions, and custom component patterns
  rules               Non-negotiable coding rules and conventions
  design              Design principles (Tufte, Gestalt, density, spacing)
  tokens              CSS design tokens (oklch, 3 themes)

Examples:
  blazz list
  blazz show button
  blazz show data-table
  blazz pattern resource-list
  blazz rules
`

const [command, ...args] = process.argv.slice(2)

switch (command) {
  case "compose":
    compose()
    break
  case "list":
    list()
    break
  case "show":
    show(args[0])
    break
  case "pattern":
    pattern(args[0])
    break
  case "rules":
    rules()
    break
  case "design":
    design()
    break
  case "tokens":
    tokens()
    break
  default:
    process.stdout.write(HELP)
    if (command && command !== "help" && command !== "--help" && command !== "-h") {
      process.exit(1)
    }
    break
}
