import { httpRouter } from "convex/server"
import { api, internal } from "./_generated/api"
import { httpAction } from "./_generated/server"
import { auth } from "./auth"
import { classifyUrl, extractHost } from "./lib/bookmarkUrl"
import { dispatchMcpRequest } from "./mcp"

const http = httpRouter()

// Auth routes (Google OAuth callbacks)
auth.addHttpRoutes(http)

// Telegram webhook (inchangé)
http.route({
	path: "/telegram-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const url = new URL(request.url)
		const secret = url.searchParams.get("secret")
		const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

		if (!expectedSecret || secret !== expectedSecret) {
			return new Response("Unauthorized", { status: 401 })
		}

		let body: {
			message?: {
				text?: string
				chat?: { id: number }
			}
		}
		try {
			body = await request.json()
		} catch {
			return new Response("Bad Request", { status: 400 })
		}

		const text = body?.message?.text
		if (!text) {
			return new Response("OK", { status: 200 })
		}

		const telegramUserId = process.env.TELEGRAM_USER_ID
		if (!telegramUserId) {
			return new Response("Telegram user not configured", { status: 500 })
		}

		await ctx.runMutation(internal.todos.internalCreate, {
			text,
			userId: telegramUserId,
			status: "triage",
			source: "telegram",
		})

		return new Response("OK", { status: 200 })
	}),
})

// GitHub webhook
http.route({
	path: "/webhooks/github",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const secret = process.env.GITHUB_WEBHOOK_SECRET
		if (!secret) return new Response("GitHub webhook secret not configured", { status: 500 })

		const body = await request.text()
		const { verifyGitHubSignature, initialsFrom } = await import("./lib/webhooks")
		const signature = request.headers.get("x-hub-signature-256")

		if (!(await verifyGitHubSignature(body, signature, secret))) {
			return new Response("Invalid signature", { status: 401 })
		}

		const userId = process.env.OPS_USER_ID
		if (!userId) return new Response("OPS_USER_ID not configured", { status: 500 })

		const event = request.headers.get("x-github-event")
		const payload = JSON.parse(body)
		const sender = payload.sender ?? {}
		const authorName = sender.login ?? "GitHub"
		const authorAvatar = sender.avatar_url ?? undefined
		const authorInitials = initialsFrom(authorName)

		let notification: {
			externalId: string
			title: string
			description: string
			actionType: string
			status?: string
			priority?: string
			url?: string
		} | null = null

		if (event === "pull_request") {
			const pr = payload.pull_request
			const action = payload.action
			if (!["opened", "closed", "review_requested"].includes(action)) {
				return new Response("OK", { status: 200 })
			}
			const merged = action === "closed" && pr.merged
			const actionType = merged ? "merged" : action === "opened" ? "added" : action === "closed" ? "removed" : "mention"
			const status = merged ? "done" : action === "opened" ? "in-progress" : action === "closed" ? "cancelled" : "todo"
			notification = {
				externalId: `gh-pr-${pr.id}-${merged ? "merged" : action}`,
				title: `PR #${pr.number}: ${pr.title}`,
				description: `${authorName} ${merged ? "merged" : action} pull request`,
				actionType,
				status,
				url: pr.html_url,
			}
		} else if (event === "issue_comment") {
			const comment = payload.comment
			notification = {
				externalId: `gh-comment-${comment.id}`,
				title: `Comment on #${payload.issue.number}: ${payload.issue.title}`,
				description: comment.body?.slice(0, 200) ?? "",
				actionType: "comment",
				url: comment.html_url,
			}
		} else if (event === "pull_request_review") {
			const review = payload.review
			const pr = payload.pull_request
			const state = review.state === "approved" ? "approved" : review.state === "changes_requested" ? "changes requested" : review.state
			notification = {
				externalId: `gh-review-${review.id}`,
				title: `Review on PR #${pr.number}: ${pr.title}`,
				description: `${authorName} ${state}`,
				actionType: "comment",
				priority: review.state === "changes_requested" ? "high" : undefined,
				url: review.html_url,
			}
		} else if (event === "check_run") {
			const checkRun = payload.check_run
			if (checkRun.conclusion !== "failure") {
				return new Response("OK", { status: 200 })
			}
			notification = {
				externalId: `gh-check-${checkRun.id}`,
				title: `CI failed: ${checkRun.name}`,
				description: `Check run failed on ${checkRun.head_sha?.slice(0, 7) ?? "unknown"}`,
				actionType: "added",
				status: "urgent",
				priority: "high",
				url: checkRun.html_url,
			}
		} else if (event === "push") {
			const commits = payload.commits ?? []
			const branch = (payload.ref ?? "").replace("refs/heads/", "")
			notification = {
				externalId: `gh-push-${payload.after?.slice(0, 12) ?? Date.now()}`,
				title: `Push to ${branch}`,
				description: commits.length === 1 ? (commits[0].message?.slice(0, 200) ?? "") : `${commits.length} commits pushed`,
				actionType: "added",
				url: payload.compare,
			}
		}

		if (!notification) {
			return new Response("OK", { status: 200 })
		}

		await ctx.runMutation(internal.notifications.internalCreate, {
			userId,
			source: "github",
			authorName,
			authorInitials,
			authorAvatar,
			...notification,
		})

		return new Response("OK", { status: 200 })
	}),
})

// Vercel webhook
http.route({
	path: "/webhooks/vercel",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const secret = process.env.VERCEL_WEBHOOK_SECRET
		if (!secret) return new Response("Vercel webhook secret not configured", { status: 500 })

		const body = await request.text()
		const { verifyVercelSignature } = await import("./lib/webhooks")
		const signature = request.headers.get("x-vercel-signature")

		if (!(await verifyVercelSignature(body, signature, secret))) {
			return new Response("Invalid signature", { status: 401 })
		}

		const userId = process.env.OPS_USER_ID
		if (!userId) return new Response("OPS_USER_ID not configured", { status: 500 })

		const payload = JSON.parse(body)
		const eventType: string = payload.type ?? ""
		const deployment = payload.payload?.deployment ?? {}
		const meta = deployment.meta ?? {}
		const branch = meta.githubCommitRef ?? "unknown"
		const commitMessage = meta.githubCommitMessage ?? ""
		const projectName = payload.payload?.name ?? deployment.name ?? "project"

		let status: string
		let priority: string | undefined
		if (eventType === "deployment.created") {
			status = "in-progress"
		} else if (eventType === "deployment.succeeded") {
			status = "done"
		} else if (eventType === "deployment.error") {
			status = "urgent"
			priority = "high"
		} else if (eventType === "deployment.cancelled") {
			status = "cancelled"
		} else {
			return new Response("OK", { status: 200 })
		}

		await ctx.runMutation(internal.notifications.internalCreate, {
			userId,
			source: "vercel",
			externalId: `vercel-${deployment.id ?? Date.now()}-${eventType}`,
			title: `${projectName}: ${branch}`,
			description: commitMessage.slice(0, 200) || eventType,
			actionType: "added",
			status,
			priority,
			authorName: "Vercel",
			authorInitials: "VC",
			authorColor: "#000000",
			url: deployment.inspectorUrl ?? (deployment.url ? `https://${deployment.url}` : undefined),
		})

		return new Response("OK", { status: 200 })
	}),
})

// Convex webhook
http.route({
	path: "/webhooks/convex",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const secret = process.env.CONVEX_WEBHOOK_SECRET
		if (!secret) return new Response("Convex webhook secret not configured", { status: 500 })

		const headerSecret = request.headers.get("X-Convex-Webhook-Secret")
		if (headerSecret !== secret) {
			return new Response("Invalid secret", { status: 401 })
		}

		const userId = process.env.OPS_USER_ID
		if (!userId) return new Response("OPS_USER_ID not configured", { status: 500 })

		let payload: {
			externalId: string
			title: string
			description: string
			status?: string
			priority?: string
			url?: string
		}
		try {
			payload = await request.json()
		} catch {
			return new Response("Bad Request", { status: 400 })
		}

		await ctx.runMutation(internal.notifications.internalCreate, {
			userId,
			source: "convex",
			externalId: payload.externalId,
			title: payload.title,
			description: payload.description,
			actionType: "mention",
			status: payload.status,
			priority: payload.priority,
			url: payload.url,
			authorName: "Convex",
			authorInitials: "CX",
			authorColor: "#f97316",
		})

		return new Response("OK", { status: 200 })
	}),
})

// Token endpoint for BlazzTime menu bar app
// Visit while logged in to get your session token
http.route({
	path: "/api/auth/token",
	method: "GET",
	handler: httpAction(async (ctx, request) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) {
			return new Response(JSON.stringify({ error: "Not authenticated" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		}
		// Extract token from Authorization header (passed by Convex client)
		const authHeader = request.headers.get("Authorization")
		const token = authHeader?.replace("Bearer ", "") ?? null
		return new Response(
			JSON.stringify({
				message: "Copy this token into BlazzTime",
				token,
				subject: identity.subject,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": process.env.BLAZZTIME_ORIGIN ?? "tauri://localhost",
				},
			}
		)
	}),
})

// ── MCP Server (JSON-RPC 2.0 over HTTP POST) ──

// Health check — public, no auth. Ping to verify MCP server is alive.
http.route({
	path: "/mcp",
	method: "GET",
	handler: httpAction(async () => {
		return new Response(JSON.stringify({ ok: true, server: "blazz-ops-mcp", version: "0.1.0" }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	}),
})

// Main MCP endpoint — Bearer-protected.
http.route({
	path: "/mcp",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const expected = process.env.MCP_SECRET
		if (!expected) {
			return new Response("MCP_SECRET not configured", { status: 500 })
		}

		const authHeader = request.headers.get("Authorization") ?? ""
		const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
		if (bearer !== expected) {
			return new Response("Unauthorized", { status: 401 })
		}

		let body: unknown
		try {
			body = await request.json()
		} catch {
			return new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }), { status: 400, headers: { "Content-Type": "application/json" } })
		}

		const response = await dispatchMcpRequest(body, {
			executeTool: async (name, args) => {
				switch (name) {
					case "qonto_balance": {
						const settings = await ctx.runQuery(api.worker.workerGetTreasurySettings, {})
						return {
							balanceCents: settings?.qontoBalanceCents ?? 0,
							balanceEur: (settings?.qontoBalanceCents ?? 0) / 100,
							lastUpdated: settings?._creationTime,
						}
					}
					case "qonto_transactions": {
						try {
							return await ctx.runAction(api.qonto.listTransactions, {})
						} catch {
							return { error: "Qonto API not configured or unavailable" }
						}
					}
					case "treasury_forecast": {
						const [settings, expenses] = await Promise.all([ctx.runQuery(api.worker.workerGetTreasurySettings, {}), ctx.runQuery(api.worker.workerExpenseSummary, {})])
						return { settings, expenses }
					}
					case "list_invoices":
						return ctx.runQuery(api.worker.workerListInvoices, args as any)
					case "list_expenses":
						return ctx.runQuery(api.worker.workerListExpenses, {
							type: args.type as "restaurant" | "mileage" | undefined,
							from: args.from as string | undefined,
							to: args.to as string | undefined,
							limit: Math.min((args.limit as number) ?? 30, 100),
						})
					case "list_time_entries":
						return ctx.runQuery(api.worker.workerListTimeEntries, args as any)
					case "list_todos":
						return ctx.runQuery(api.worker.workerListTodos, {
							status: args.status as string | undefined,
							limit: Math.min((args.limit as number) ?? 50, 100),
						})
					case "list_clients":
						return ctx.runQuery(api.worker.workerListClients, {})
					case "list_projects":
						return ctx.runQuery(api.worker.workerListProjects, {})
					case "create_expense":
						return ctx.runMutation(api.worker.workerCreateExpense, args as any)
					case "search_knowledge":
						// NOTE: sourceTable filter intentionally dropped — gpt-4o-mini filters too
						// eagerly (always passes "notes"), missing valid bookmark hits. Corpus is
						// small enough that returning both sources is acceptable.
						return ctx.runAction(api.rag.searchKnowledge, {
							query: String(args.query ?? ""),
							limit: Math.min((args.limit as number) ?? 10, 30),
						})
					default:
						throw new Error(`Unhandled tool in switch: ${name}`)
				}
			},
			appendAudit: async (entry) => {
				await ctx.runMutation(api.worker.workerAppendMcpAudit, {
					method: entry.method,
					tool: entry.tool,
					success: entry.success,
					errorMessage: entry.errorMessage,
					argsPreview: entry.argsPreview,
				})
			},
		})

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	}),
})

// ── Bookmark capture (iOS Shortcut / any Bearer-auth client) ──

http.route({
	path: "/bookmark",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const expected = process.env.BOOKMARK_SECRET
		if (!expected) {
			return new Response("BOOKMARK_SECRET not configured", { status: 500 })
		}
		const opsUserId = process.env.OPS_USER_ID
		if (!opsUserId) {
			return new Response("OPS_USER_ID not configured", { status: 500 })
		}

		const authHeader = request.headers.get("Authorization") ?? ""
		const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
		if (bearer !== expected) {
			return new Response("Unauthorized", { status: 401 })
		}

		let body: { url?: string; note?: string; sourceApp?: string; title?: string }
		try {
			body = await request.json()
		} catch {
			return new Response(JSON.stringify({ error: "Invalid JSON" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		const rawUrl = (body.url ?? "").trim()
		if (!rawUrl) {
			return new Response(JSON.stringify({ error: "url is required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			})
		}

		const sourceApp = body.sourceApp ?? extractHost(rawUrl) ?? undefined
		const type = classifyUrl(rawUrl)

		const id = await ctx.runMutation(internal.bookmarks.internalCreateFromUrl, {
			userId: opsUserId,
			url: rawUrl,
			type,
			title: body.title,
			note: body.note,
			sourceApp,
		})

		return new Response(JSON.stringify({ ok: true, id, type, sourceApp }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		})
	}),
})

export default http
