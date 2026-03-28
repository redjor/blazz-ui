import type { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"

interface Mission {
	_id: string
	title: string
}
interface Agent {
	_id: string
	name: string
	role: string
	avatar?: string
	userId: string
}

export async function notifyMissionComplete(convex: ConvexHttpClient, mission: Mission, agent: Agent, output: string) {
	// 1. Create notification in inbox
	try {
		await convex.mutation(api.worker.workerCreateNotification, {
			userId: agent.userId,
			title: `${agent.name} a terminé : ${mission.title}`,
			description: output.slice(0, 300) + (output.length > 300 ? "..." : ""),
			url: `/missions/${mission._id}`,
			agentName: agent.name,
			agentAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(agent.name)}`,
			externalId: `mission-${mission._id}`,
		})
	} catch (err) {
		console.error("[notify] notification error:", err)
	}

	// 2. Create a note with the full output
	try {
		await convex.mutation(api.worker.workerCreateNote, {
			userId: agent.userId as any,
			content: `# ${mission.title}\n\n*Par ${agent.name} (${agent.role})*\n\n${output}`,
			entityType: "general",
		})
	} catch (err) {
		console.error("[notify] note creation error:", err)
	}

	// 3. Telegram (optional)
	const telegramToken = process.env.TELEGRAM_BOT_TOKEN
	const telegramChatId = process.env.TELEGRAM_CHAT_ID
	if (telegramToken && telegramChatId) {
		try {
			await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: telegramChatId,
					text: `🤖 *${agent.name}* a terminé : *${mission.title}*\n\n${output.slice(0, 500)}`,
					parse_mode: "Markdown",
				}),
			})
		} catch (err) {
			console.error("[notify] telegram error:", err)
		}
	}
}

export async function notifyMissionError(convex: ConvexHttpClient, mission: Mission, agent: Agent, error: string) {
	try {
		await convex.mutation(api.worker.workerCreateNotification, {
			userId: agent.userId,
			title: `❌ ${agent.name} — erreur : ${mission.title}`,
			description: error.slice(0, 300),
			url: `/missions/${mission._id}`,
			agentName: agent.name,
			externalId: `mission-error-${mission._id}`,
		})
	} catch (err) {
		console.error("[notify] error notification failed:", err)
	}
}
