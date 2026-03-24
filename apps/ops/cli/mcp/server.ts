import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { internal } from "../../convex/_generated/api"
import { loadConfig } from "../lib/config"
import { getClient } from "../lib/convex-client"

// ── Shared enums ─────────────────────────────────────────────────────────
const entityTypeEnum = z.enum([
	"client",
	"project",
	"contract",
	"invoice",
	"todo",
	"general",
])
const statusEnum = z.enum(["triage", "todo", "blocked", "in_progress", "done"])
const priorityEnum = z.enum(["urgent", "high", "normal", "low"])

// ── Helpers ──────────────────────────────────────────────────────────────
function json(data: unknown) {
	return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] }
}

// ── Server ───────────────────────────────────────────────────────────────
export async function startMcpServer() {
	const config = loadConfig()
	const client = getClient(config)
	const userId = config.userId

	const server = new McpServer({ name: "blazz-ops", version: "0.1.0" })

	// ── Notes ──────────────────────────────────────────────────────────────

	server.tool(
		"notes_list",
		"List notes. Optionally filter by entity type or pinned status.",
		{
			entityType: entityTypeEnum.optional(),
			pinned: z.boolean().optional(),
		},
		async ({ entityType, pinned }) => {
			const args: Record<string, unknown> = { userId }
			if (entityType) args.entityType = entityType
			if (pinned !== undefined) args.pinned = pinned
			const result = await client.query(internal.cli.notesList, args)
			return json(result)
		},
	)

	server.tool(
		"notes_get",
		"Get a single note by ID.",
		{ id: z.string() },
		async ({ id }) => {
			const result = await client.query(internal.cli.notesGet, {
				userId,
				id: id as any,
			})
			if (!result) return { ...json({ error: "Note not found" }), isError: true }
			return json(result)
		},
	)

	server.tool(
		"notes_create",
		"Create a new note.",
		{
			title: z.string(),
			contentText: z.string().optional(),
			entityType: entityTypeEnum.default("general"),
			entityId: z.string().optional(),
			pinned: z.boolean().optional(),
		},
		async ({ title, contentText, entityType, entityId, pinned }) => {
			const args: Record<string, unknown> = { userId, title, entityType }
			if (contentText) args.contentText = contentText
			if (entityId) args.entityId = entityId
			if (pinned !== undefined) args.pinned = pinned
			const id = await client.mutation(internal.cli.notesCreate, args)
			return json({ _id: id })
		},
	)

	server.tool(
		"notes_update",
		"Update an existing note.",
		{
			id: z.string(),
			title: z.string().optional(),
			contentText: z.string().optional(),
			pinned: z.boolean().optional(),
			locked: z.boolean().optional(),
		},
		async ({ id, ...rest }) => {
			const args: Record<string, unknown> = { userId, id: id as any }
			if (rest.title !== undefined) args.title = rest.title
			if (rest.contentText !== undefined) args.contentText = rest.contentText
			if (rest.pinned !== undefined) args.pinned = rest.pinned
			if (rest.locked !== undefined) args.locked = rest.locked
			await client.mutation(internal.cli.notesUpdate, args)
			return json({ ok: true })
		},
	)

	server.tool(
		"notes_remove",
		"Delete a note. Fails if note is locked.",
		{ id: z.string() },
		async ({ id }) => {
			await client.mutation(internal.cli.notesRemove, { userId, id: id as any })
			return json({ ok: true })
		},
	)

	// ── Todos ──────────────────────────────────────────────────────────────

	server.tool(
		"todos_list",
		"List todos. Optionally filter by status, project, or priority.",
		{
			status: statusEnum.optional(),
			projectId: z.string().optional(),
			priority: priorityEnum.optional(),
		},
		async ({ status, projectId, priority }) => {
			const args: Record<string, unknown> = { userId }
			if (status) args.status = status
			if (projectId) args.projectId = projectId
			if (priority) args.priority = priority
			const result = await client.query(internal.cli.todosList, args)
			return json(result)
		},
	)

	server.tool(
		"todos_get",
		"Get a single todo by ID.",
		{ id: z.string() },
		async ({ id }) => {
			const result = await client.query(internal.cli.todosGet, {
				userId,
				id: id as any,
			})
			if (!result) return { ...json({ error: "Todo not found" }), isError: true }
			return json(result)
		},
	)

	server.tool(
		"todos_create",
		"Create a new todo.",
		{
			text: z.string(),
			description: z.string().optional(),
			status: statusEnum.default("triage"),
			priority: priorityEnum.optional(),
			dueDate: z.string().optional(),
			projectId: z.string().optional(),
			tags: z.array(z.string()).optional(),
		},
		async ({ text, description, status, priority, dueDate, projectId, tags }) => {
			const args: Record<string, unknown> = { userId, text, status }
			if (description) args.description = description
			if (priority) args.priority = priority
			if (dueDate) args.dueDate = dueDate
			if (projectId) args.projectId = projectId
			if (tags) args.tags = tags
			const id = await client.mutation(internal.cli.todosCreate, args)
			return json({ _id: id })
		},
	)

	server.tool(
		"todos_update",
		"Update an existing todo.",
		{
			id: z.string(),
			text: z.string().optional(),
			description: z.string().optional(),
			priority: priorityEnum.optional(),
			dueDate: z.string().optional(),
			projectId: z.string().optional(),
			tags: z.array(z.string()).optional(),
		},
		async ({ id, ...rest }) => {
			const args: Record<string, unknown> = { userId, id: id as any }
			if (rest.text !== undefined) args.text = rest.text
			if (rest.description !== undefined) args.description = rest.description
			if (rest.priority !== undefined) args.priority = rest.priority
			if (rest.dueDate !== undefined) args.dueDate = rest.dueDate
			if (rest.projectId !== undefined) args.projectId = rest.projectId
			if (rest.tags !== undefined) args.tags = rest.tags
			await client.mutation(internal.cli.todosUpdate, args)
			return json({ ok: true })
		},
	)

	server.tool(
		"todos_status",
		"Change todo status.",
		{
			id: z.string(),
			status: statusEnum,
		},
		async ({ id, status }) => {
			await client.mutation(internal.cli.todosUpdate, {
				userId,
				id: id as any,
				status,
			})
			return json({ ok: true })
		},
	)

	server.tool(
		"todos_remove",
		"Delete a todo.",
		{ id: z.string() },
		async ({ id }) => {
			await client.mutation(internal.cli.todosRemove, { userId, id: id as any })
			return json({ ok: true })
		},
	)

	// ── Start ──────────────────────────────────────────────────────────────
	const transport = new StdioServerTransport()
	await server.connect(transport)
}
