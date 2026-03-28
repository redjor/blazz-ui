import { execSync } from "node:child_process"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Tool } from "./index"

const REPO_ROOT = join(import.meta.dirname, "../../../..")

export function productTools(): Tool[] {
	return [
		{
			name: "git_log",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "git_log",
					description: "Get recent git commits. Returns hash, author, date, message.",
					parameters: {
						type: "object",
						properties: {
							count: { type: "number", description: "Number of commits (default 20)" },
							path: { type: "string", description: "Filter by file path" },
						},
						required: [],
					},
				},
			},
			execute: async (args) => {
				const count = (args.count as number) ?? 20
				const pathFilter = args.path ? `-- ${args.path}` : ""
				const output = execSync(`git log --oneline --format="%H|%an|%ad|%s" --date=short -${count} ${pathFilter}`, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 10000 })
				return output
					.trim()
					.split("\n")
					.map((line) => {
						const [hash, author, date, ...msg] = line.split("|")
						return { hash, author, date, message: msg.join("|") }
					})
			},
		},
		{
			name: "git_diff",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "git_diff",
					description: "Get diff between two git refs (branches, commits, tags)",
					parameters: {
						type: "object",
						properties: {
							from: { type: "string", description: "Base ref (e.g. main)" },
							to: { type: "string", description: "Target ref (e.g. HEAD)" },
							path: { type: "string", description: "Filter by file path" },
						},
						required: ["from", "to"],
					},
				},
			},
			execute: async (args) => {
				const pathFilter = args.path ? `-- ${args.path}` : ""
				const output = execSync(`git diff --stat ${args.from}...${args.to} ${pathFilter}`, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 10000 })
				return output.trim()
			},
		},
		{
			name: "read_file",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "read_file",
					description: "Read a file from the repository. Path relative to repo root.",
					parameters: {
						type: "object",
						properties: {
							path: { type: "string", description: "File path relative to repo root" },
						},
						required: ["path"],
					},
				},
			},
			execute: async (args) => {
				const content = await readFile(join(REPO_ROOT, args.path as string), "utf-8")
				return { path: args.path, content: content.slice(0, 10000) } // Cap at 10k chars
			},
		},
		{
			name: "glob_files",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "glob_files",
					description: "Find files matching a glob pattern in the repository",
					parameters: {
						type: "object",
						properties: {
							pattern: { type: "string", description: "Glob pattern (e.g. 'packages/ui/src/**/*.tsx')" },
						},
						required: ["pattern"],
					},
				},
			},
			execute: async (args) => {
				const output = execSync(`find . -path './${args.pattern}' -type f | head -50`, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 10000 })
				return output.trim().split("\n").filter(Boolean)
			},
		},
		{
			name: "github_issues",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "github_issues",
					description: "List GitHub issues. Returns title, state, labels, assignee.",
					parameters: {
						type: "object",
						properties: {
							state: { type: "string", enum: ["open", "closed", "all"], description: "Filter by state (default: open)" },
							limit: { type: "number", description: "Max results (default 20)" },
						},
						required: [],
					},
				},
			},
			execute: async (args) => {
				const state = (args.state as string) ?? "open"
				const limit = (args.limit as number) ?? 20
				try {
					const output = execSync(`gh issue list --state ${state} --limit ${limit} --json number,title,state,labels,assignees,createdAt`, { cwd: REPO_ROOT, encoding: "utf-8", timeout: 15000 })
					return JSON.parse(output)
				} catch {
					return { error: "gh CLI not available or not authenticated" }
				}
			},
		},
		{
			name: "web_search",
			category: "read",
			definition: {
				type: "function",
				function: {
					name: "web_search",
					description: "Search the web for information (competitor analysis, trends, etc.)",
					parameters: {
						type: "object",
						properties: {
							query: { type: "string", description: "Search query" },
						},
						required: ["query"],
					},
				},
			},
			execute: async (args) => {
				// Use a simple search via DuckDuckGo HTML (no API key needed)
				try {
					const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(args.query as string)}`
					const res = await fetch(url, { headers: { "User-Agent": "BlazzOps/1.0" } })
					const html = await res.text()
					// Extract result snippets (basic extraction)
					const results =
						html
							.match(/class="result__snippet">(.*?)<\//g)
							?.slice(0, 5)
							.map((s) =>
								s
									.replace(/class="result__snippet">/, "")
									.replace(/<\//, "")
									.trim()
							) ?? []
					return { query: args.query, results }
				} catch {
					return { query: args.query, results: [], error: "Search failed" }
				}
			},
		},
		{
			name: "write_file",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "write_file",
					description: "Write content to a file in the repository. For specs, docs, and plans only.",
					parameters: {
						type: "object",
						properties: {
							path: { type: "string", description: "File path relative to repo root" },
							content: { type: "string", description: "File content" },
						},
						required: ["path", "content"],
					},
				},
			},
			execute: async (args) => {
				const { writeFile: wf } = await import("node:fs/promises")
				const fullPath = join(REPO_ROOT, args.path as string)
				await wf(fullPath, args.content as string, "utf-8")
				return { written: args.path, bytes: (args.content as string).length }
			},
		},
		{
			name: "github_create_issue",
			category: "write",
			definition: {
				type: "function",
				function: {
					name: "github_create_issue",
					description: "Create a GitHub issue with title, body, and optional labels",
					parameters: {
						type: "object",
						properties: {
							title: { type: "string", description: "Issue title" },
							body: { type: "string", description: "Issue body (markdown)" },
							labels: { type: "array", items: { type: "string" }, description: "Labels to apply" },
						},
						required: ["title", "body"],
					},
				},
			},
			execute: async (args) => {
				const labels = (args.labels as string[])?.map((l) => `--label "${l}"`).join(" ") ?? ""
				try {
					const output = execSync(`gh issue create --title "${args.title}" --body "${(args.body as string).replace(/"/g, '\\"')}" ${labels} --json number,url`, {
						cwd: REPO_ROOT,
						encoding: "utf-8",
						timeout: 15000,
					})
					return JSON.parse(output)
				} catch {
					return { error: "gh CLI not available or not authenticated" }
				}
			},
		},
	]
}
