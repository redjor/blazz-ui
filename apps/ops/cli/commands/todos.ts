import type { Command } from "commander"
import { internal } from "../../convex/_generated/api"
import { loadConfig } from "../lib/config"
import { getClient } from "../lib/convex-client"
import { error, output, success } from "../lib/output"

export function registerTodosCommand(program: Command) {
	const todos = program.command("todos").description("Manage todos")

	// ── todos list ────────────────────────────────────────────────────────
	todos
		.command("list")
		.description("List todos")
		.option("--status <status>", "Filter by status (triage|todo|blocked|in_progress|done)")
		.option("--project <id>", "Filter by project ID")
		.option("--priority <priority>", "Filter by priority (urgent|high|normal|low)")
		.action(async (opts) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const args: Record<string, unknown> = { userId: config.userId }
				if (opts.status) args.status = opts.status
				if (opts.project) args.projectId = opts.project
				if (opts.priority) args.priority = opts.priority

				const todos = await client.query(internal.cli.todosList, args)
				output(todos)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── todos get ─────────────────────────────────────────────────────────
	todos
		.command("get <id>")
		.description("Get a todo by ID")
		.action(async (id: string) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const todo = await client.query(internal.cli.todosGet, {
					userId: config.userId,
					id,
				})

				if (!todo) {
					error("Todo not found")
					process.exit(1)
				}

				output(todo)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── todos create ──────────────────────────────────────────────────────
	todos
		.command("create")
		.description("Create a new todo")
		.requiredOption("--text <text>", "Todo text")
		.option("--description <desc>", "Todo description")
		.option("--status <status>", "Status (default: triage)", "triage")
		.option("--priority <priority>", "Priority (urgent|high|normal|low)")
		.option("--due <date>", "Due date (YYYY-MM-DD)")
		.option("--project <id>", "Project ID")
		.option("--tags <tags>", "Comma-separated tags")
		.action(async (opts) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const args: Record<string, unknown> = {
					userId: config.userId,
					text: opts.text,
					status: opts.status,
				}
				if (opts.description) args.description = opts.description
				if (opts.priority) args.priority = opts.priority
				if (opts.due) args.dueDate = opts.due
				if (opts.project) args.projectId = opts.project
				if (opts.tags) args.tags = opts.tags.split(",").map((t: string) => t.trim())

				const id = await client.mutation(internal.cli.todosCreate, args)
				success(`Todo created: ${id}`)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── todos update ──────────────────────────────────────────────────────
	todos
		.command("update <id>")
		.description("Update a todo")
		.option("--text <text>", "New text")
		.option("--description <desc>", "New description")
		.option("--priority <priority>", "New priority (urgent|high|normal|low)")
		.option("--due <date>", "New due date (YYYY-MM-DD)")
		.option("--project <id>", "Project ID")
		.option("--tags <tags>", "Comma-separated tags")
		.action(async (id: string, opts) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const args: Record<string, unknown> = {
					userId: config.userId,
					id,
				}
				if (opts.text) args.text = opts.text
				if (opts.description !== undefined) args.description = opts.description
				if (opts.priority) args.priority = opts.priority
				if (opts.due) args.dueDate = opts.due
				if (opts.project) args.projectId = opts.project
				if (opts.tags) args.tags = opts.tags.split(",").map((t: string) => t.trim())

				await client.mutation(internal.cli.todosUpdate, args)
				success("Todo updated")
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── todos status ──────────────────────────────────────────────────────
	todos
		.command("status <id> <status>")
		.description("Update a todo's status")
		.action(async (id: string, status: string) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				await client.mutation(internal.cli.todosUpdateStatus, {
					userId: config.userId,
					id,
					status,
				})
				success(`Todo status updated to: ${status}`)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── todos remove ──────────────────────────────────────────────────────
	todos
		.command("remove <id>")
		.description("Remove a todo")
		.action(async (id: string) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				await client.mutation(internal.cli.todosRemove, {
					userId: config.userId,
					id,
				})
				success("Todo removed")
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})
}
