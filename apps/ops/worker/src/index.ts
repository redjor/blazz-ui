import dotenv from "dotenv"
import { resolve } from "node:path"

dotenv.config({ path: resolve(import.meta.dirname, "../../.env.local") })

import { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"
import { runMission } from "./runner"
import { createToolRegistry } from "./tools/index"
import cron from "node-cron"

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL
if (!CONVEX_URL) throw new Error("NEXT_PUBLIC_CONVEX_URL or CONVEX_URL required")

const convex = new ConvexHttpClient(CONVEX_URL)
const running = new Map<string, AbortController>()

async function pollMissions() {
  try {
    const todoMissions = await convex.query(api.worker.workerListByStatus, { status: "todo" })

    for (const mission of todoMissions) {
      if (running.has(mission._id)) continue

      const agent = await convex.query(api.worker.workerGetAgent, { id: mission.agentId })
      if (!agent || agent.status === "disabled") continue

      const controller = new AbortController()
      running.set(mission._id, controller)

      const tools = createToolRegistry(convex)

      console.log(`[worker] starting mission: ${mission.title} (agent: ${agent.name})`)

      runMission(convex, mission as any, agent as any, tools, controller.signal)
        .then(() => console.log(`[worker] mission completed: ${mission.title}`))
        .catch((err) => console.error(`[worker] mission failed: ${mission.title}`, err))
        .finally(() => running.delete(mission._id))
    }
  } catch (err) {
    console.error("[worker] poll error:", err)
  }
}

setInterval(pollMissions, 5000)
console.log("[worker] started, polling every 5s")

// Cron scheduler
async function startCronScheduler() {
  try {
    const cronMissions = await convex.query(api.worker.workerListCron, {})
    for (const template of cronMissions) {
      if (!template.cron) continue
      cron.schedule(template.cron, async () => {
        console.log(`[cron] creating mission from template: ${template.title}`)
        await convex.mutation(api.worker.workerCreateFromTemplate, { templateMissionId: template._id })
      })
    }
    console.log(`[cron] ${cronMissions.length} recurring missions scheduled`)
  } catch (err) {
    console.error("[cron] scheduler error:", err)
  }
}

startCronScheduler()

process.on("SIGINT", () => {
  console.log("[worker] shutting down...")
  for (const [, controller] of running) {
    controller.abort()
  }
  process.exit(0)
})
