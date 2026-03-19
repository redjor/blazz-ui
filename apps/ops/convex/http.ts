import { httpRouter } from "convex/server"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"
import { auth } from "./auth"

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

		if (!verifyGitHubSignature(body, signature, secret)) {
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
				description: commits.length === 1
					? commits[0].message?.slice(0, 200) ?? ""
					: `${commits.length} commits pushed`,
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

		if (!verifyVercelSignature(body, signature, secret)) {
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

export default http
