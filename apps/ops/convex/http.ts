import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"
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

		await ctx.runMutation(api.todos.create, {
			text,
			status: "triage",
			source: "telegram",
		})

		return new Response("OK", { status: 200 })
	}),
})

export default http
