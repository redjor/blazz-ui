#!/usr/bin/env node
import { Command } from "commander"
import { setJsonMode } from "./lib/output"

const program = new Command()

program
	.name("blazz-ops")
	.description("Blazz OPS CLI — manage notes, todos, and more")
	.version("0.1.0")
	.option("--json", "Output as JSON")
	.hook("preAction", (thisCommand) => {
		const opts = thisCommand.opts()
		if (opts.json) setJsonMode(true)
	})

import { registerNotesCommand } from "./commands/notes"
registerNotesCommand(program)

program.parse()
