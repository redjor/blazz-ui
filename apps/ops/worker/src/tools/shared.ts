import type { ConvexHttpClient } from "convex/browser"
import { getToolSchema } from "../../../shared/tool-schemas"
import { api } from "../convex"
import type { Tool } from "./index"

export function toOpenAIDef(name: string) {
	const schema = getToolSchema(name)
	if (!schema) throw new Error(`Unknown tool schema: ${name}`)
	return {
		type: "function" as const,
		function: {
			name: schema.name,
			description: schema.description,
			parameters: schema.parameters,
		},
	}
}

export function sharedTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "create_note",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "create_note",
					description: "Create a note in Blazz Ops. Used for alerts, recommendations, audit findings.",
					parameters: {
						type: "object",
						properties: {
							content: { type: "string", description: "Note content (markdown)" },
							entityType: { type: "string", enum: ["general", "client", "project", "invoice"], description: "What this note relates to" },
							entityId: { type: "string", description: "ID of the related entity (optional)" },
						},
						required: ["content"],
					},
				},
			},
			execute: async (args) => {
				return convex.mutation(api.worker.workerCreateNote, {
					content: args.content as string,
					entityType: (args.entityType as string) ?? "general",
					entityId: args.entityId as string | undefined,
				})
			},
		},
		{
			name: "create_todo",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "create_todo",
					description: "Create a todo task in Blazz Ops.",
					parameters: {
						type: "object",
						properties: {
							text: { type: "string", description: "Todo text" },
							priority: { type: "string", enum: ["urgent", "high", "normal", "low"] },
							dueDate: { type: "string", description: "Due date YYYY-MM-DD" },
						},
						required: ["text"],
					},
				},
			},
			execute: async (args) => {
				return convex.mutation(api.worker.workerCreateTodo, {
					text: args.text as string,
					priority: (args.priority as string) ?? "normal",
					dueDate: args.dueDate as string | undefined,
				})
			},
		},
	]
}
