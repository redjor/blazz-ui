import type { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"

interface Mission { _id: string; title: string }
interface Agent { name: string; role: string; avatar?: string }

export async function notifyMissionComplete(
  convex: ConvexHttpClient,
  mission: Mission,
  agent: Agent,
  output: string,
) {
  // 1. Feed item in Ops
  try {
    await convex.mutation(api.notifications.internalCreate, {
      source: "convex",
      title: `${agent.avatar ?? "🤖"} ${agent.name} a terminé : ${mission.title}`,
      body: output.slice(0, 200) + (output.length > 200 ? "..." : ""),
      url: `/missions/${mission._id}`,
      externalId: `mission-${mission._id}`,
    })
  } catch (err) {
    console.error("[notify] feed error:", err)
  }

  // 2. Telegram webhook (optional)
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID
  if (telegramToken && telegramChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `${agent.avatar ?? "🤖"} *${agent.name}* a terminé : *${mission.title}*\n\n${output.slice(0, 500)}`,
          parse_mode: "Markdown",
        }),
      })
    } catch (err) {
      console.error("[notify] telegram error:", err)
    }
  }
}

export async function notifyBudgetAlert(
  convex: ConvexHttpClient,
  agent: Agent,
  type: "day" | "month",
  current: number,
  max: number,
) {
  try {
    await convex.mutation(api.notifications.internalCreate, {
      source: "convex",
      title: `⚠ Budget ${type === "day" ? "journalier" : "mensuel"} atteint pour ${agent.name}`,
      body: `${current.toFixed(3)}$ / ${max}$`,
      url: "/missions",
      externalId: `budget-${agent.name}-${type}-${new Date().toISOString().slice(0, 10)}`,
    })
  } catch (err) {
    console.error("[notify] budget alert error:", err)
  }
}
