import { httpRouter } from "convex/server"
import { httpAction } from "./_generated/server"
import { api } from "./_generated/api"

const http = httpRouter()

http.route({
	path: "/telegram-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		// Validate secret token in query string
		const url = new URL(request.url)
		const secret = url.searchParams.get("secret")
		const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

		if (!expectedSecret || secret !== expectedSecret) {
			return new Response("Unauthorized", { status: 401 })
		}

		// Parse Telegram update
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
			// Ignore non-text messages (photos, stickers, etc.) — just ACK
			return new Response("OK", { status: 200 })
		}

		// Create todo in Triage
		await ctx.runMutation(api.todos.create, {
			text,
			status: "triage",
			source: "telegram",
		})

		return new Response("OK", { status: 200 })
	}),
})

export default http
