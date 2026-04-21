import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"
import { toOpenAIDef } from "./shared"

export function timeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "list_time_entries",
			category: "read",
			definition: toOpenAIDef("list_time_entries"),
			execute: async (args) => {
				return convex.query(api.worker.workerListTimeEntries, args as any)
			},
		},
		{
			name: "list_projects",
			category: "read",
			definition: toOpenAIDef("list_projects"),
			execute: async () => {
				return convex.query(api.worker.workerListProjects, {})
			},
		},
	]
}
