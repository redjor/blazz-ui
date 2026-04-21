import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"
import { toOpenAIDef } from "./shared"

export function knowledgeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "list_todos",
			category: "read",
			definition: toOpenAIDef("list_todos"),
			execute: async (args) => {
				return convex.query(api.worker.workerListTodos, {
					status: args.status as string | undefined,
					limit: Math.min((args.limit as number) ?? 50, 100),
				})
			},
		},
		{
			name: "list_clients",
			category: "read",
			definition: toOpenAIDef("list_clients"),
			execute: async () => {
				return convex.query(api.worker.workerListClients, {})
			},
		},
	]
}
