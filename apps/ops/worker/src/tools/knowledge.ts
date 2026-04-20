import type { ConvexHttpClient } from "convex/browser"
import { api } from "../convex"
import type { Tool } from "./index"

export function knowledgeTools(convex: ConvexHttpClient): Tool[] {
	return [
		{
			name: "list_notes",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_notes",
					description: "List the user's notes (markdown content). Useful to find context, prior analysis, or decisions already documented.",
					parameters: {
						type: "object",
						properties: {
							entityType: {
								type: "string",
								enum: ["client", "project", "contract", "invoice", "todo", "general"],
								description: "Filter by the entity this note is attached to.",
							},
							limit: { type: "number", description: "Max notes to return (default 20, max 50)" },
						},
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListNotes, {
					entityType: args.entityType as string | undefined,
					limit: Math.min((args.limit as number) ?? 20, 50),
				})
			},
		},
		{
			name: "list_bookmarks",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_bookmarks",
					description: "List the user's saved bookmarks (tweets, YouTube videos, articles). Useful to surface content the user has flagged as interesting.",
					parameters: {
						type: "object",
						properties: {
							type: {
								type: "string",
								enum: ["tweet", "youtube", "image", "video", "link"],
								description: "Filter by bookmark type.",
							},
							limit: { type: "number", description: "Max bookmarks (default 20, max 50)" },
						},
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListBookmarks, {
					type: args.type as string | undefined,
					limit: Math.min((args.limit as number) ?? 20, 50),
				})
			},
		},
		{
			name: "list_todos",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_todos",
					description: "List the user's todos. Useful to check what's on the user's plate or cross-reference work against time entries.",
					parameters: {
						type: "object",
						properties: {
							status: {
								type: "string",
								enum: ["triage", "todo", "blocked", "in_progress", "done"],
								description: "Filter by status.",
							},
							limit: { type: "number", description: "Max todos (default 50, max 100)" },
						},
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListTodos, {
					status: args.status as string | undefined,
					limit: Math.min((args.limit as number) ?? 50, 100),
				})
			},
		},
		{
			name: "list_missions",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_missions",
					description: "List recent agent missions across the team. Useful for a meta-view of what everyone has been working on — daily briefs, team summaries, pattern detection.",
					parameters: {
						type: "object",
						properties: {
							status: {
								type: "string",
								enum: ["planning", "todo", "in_progress", "review", "done", "rejected", "aborted"],
							},
							limit: { type: "number", description: "Max missions (default 20, max 50)" },
						},
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListMissions, {
					status: args.status as string | undefined,
					limit: Math.min((args.limit as number) ?? 20, 50),
				})
			},
		},
		{
			name: "list_goals",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_goals",
					description: "Read the user's revenue/days/TJM goals for a given year.",
					parameters: {
						type: "object",
						properties: {
							year: { type: "number", description: "Year (defaults to current year)" },
						},
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListGoals, {
					year: args.year as number | undefined,
				})
			},
		},
		{
			name: "list_feed_items",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "list_feed_items",
					description: "List the user's RSS/YouTube feed items (veille). Useful to identify trends, surface interesting content, or build daily briefs.",
					parameters: {
						type: "object",
						properties: {
							unreadOnly: { type: "boolean", description: "Only return unread items" },
							limit: { type: "number", description: "Max items (default 20, max 50)" },
						},
					},
				},
			},
			execute: async (args) => {
				return convex.query(api.worker.workerListFeedItems, {
					unreadOnly: args.unreadOnly as boolean | undefined,
					limit: Math.min((args.limit as number) ?? 20, 50),
				})
			},
		},
	]
}
