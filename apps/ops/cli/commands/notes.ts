import type { Command } from "commander"
import { internal } from "../../convex/_generated/api"
import { loadConfig } from "../lib/config"
import { getClient } from "../lib/convex-client"
import { error, output, success } from "../lib/output"

export function registerNotesCommand(program: Command) {
	const notes = program.command("notes").description("Manage notes")

	// ── notes list ────────────────────────────────────────────────────────
	notes
		.command("list")
		.description("List notes")
		.option("--entity-type <type>", "Filter by entity type")
		.option("--pinned", "Show only pinned notes")
		.action(async (opts) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const args: Record<string, unknown> = { userId: config.userId }
				if (opts.entityType) args.entityType = opts.entityType
				if (opts.pinned) args.pinned = true

				const notes = await client.query(internal.cli.notesList, args)
				output(notes)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── notes get ─────────────────────────────────────────────────────────
	notes
		.command("get <id>")
		.description("Get a note by ID")
		.action(async (id: string) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const note = await client.query(internal.cli.notesGet, {
					userId: config.userId,
					id,
				})

				if (!note) {
					error("Note not found")
					process.exit(1)
				}

				output(note)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── notes create ──────────────────────────────────────────────────────
	notes
		.command("create")
		.description("Create a new note")
		.requiredOption("--title <title>", "Note title")
		.option("--content <text>", "Note content")
		.option("--entity-type <type>", "Entity type", "general")
		.option("--entity-id <id>", "Entity ID")
		.option("--pinned", "Pin the note")
		.action(async (opts) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const args: Record<string, unknown> = {
					userId: config.userId,
					title: opts.title,
					entityType: opts.entityType,
				}
				if (opts.content) args.contentText = opts.content
				if (opts.entityId) args.entityId = opts.entityId
				if (opts.pinned) args.pinned = true

				const id = await client.mutation(internal.cli.notesCreate, args)
				success(`Note created: ${id}`)
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── notes update ──────────────────────────────────────────────────────
	notes
		.command("update <id>")
		.description("Update a note")
		.option("--title <title>", "New title")
		.option("--content <text>", "New content")
		.option("--pin", "Pin the note")
		.option("--unpin", "Unpin the note")
		.option("--lock", "Lock the note")
		.option("--unlock", "Unlock the note")
		.action(async (id: string, opts) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				const args: Record<string, unknown> = {
					userId: config.userId,
					id,
				}
				if (opts.title) args.title = opts.title
				if (opts.content !== undefined) args.contentText = opts.content
				if (opts.pin) args.pinned = true
				if (opts.unpin) args.pinned = false
				if (opts.lock) args.locked = true
				if (opts.unlock) args.locked = false

				await client.mutation(internal.cli.notesUpdate, args)
				success("Note updated")
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})

	// ── notes remove ──────────────────────────────────────────────────────
	notes
		.command("remove <id>")
		.description("Remove a note")
		.action(async (id: string) => {
			try {
				const config = loadConfig()
				const client = getClient(config)

				await client.mutation(internal.cli.notesRemove, {
					userId: config.userId,
					id,
				})
				success("Note removed")
			} catch (e) {
				error(e instanceof Error ? e.message : String(e))
				process.exit(1)
			}
		})
}
