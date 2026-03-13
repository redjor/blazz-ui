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
