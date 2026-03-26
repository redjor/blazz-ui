import { ConvexHttpClient } from "convex/browser"
import { api } from "../../convex/_generated/api"
import { runMission } from "./runner"
import { createToolRegistry } from "./tools/index"
import cron from "node-cron"

const CONVEX_URL = process.env.CONVEX_URL
if (!CONVEX_URL) throw new Error("CONVEX_URL required")

const convex = new ConvexHttpClient(CONVEX_URL)
const running = new Map<string, AbortController>()

async function pollMissions() {
  try {
    const todoMissions = await convex.query(api.missions.listByStatus, { status: "todo" })

    for (const mission of todoMissions) {
      if (running.has(mission._id)) continue

      const agent = await convex.query(api.agents.get, { id: mission.agentId })
      if (!agent || agent.status === "disabled") continue

      const controller = new AbortController()
      running.set(mission._id, controller)

      const tools = createToolRegistry(convex)

      runMission(convex, mission as any, agent as any, tools, controller.signal)
        .finally(() => running.delete(mission._id))
    }
  } catch (err) {
    console.error("[worker] poll error:", err)
  }
}

// Poll every 5 seconds (ConvexHttpClient doesn't support subscriptions)
setInterval(pollMissions, 5000)
console.log("[worker] started, polling every 5s")

// Cron scheduler for recurring missions
async function startCronScheduler() {
  try {
    const cronMissions = await convex.query(api.missions.listCron, {})
    for (const template of cronMissions) {
      if (!template.cron) continue
      cron.schedule(template.cron, async () => {
        console.log(`[cron] creating mission from template: ${template.title}`)
        await convex.mutation(api.missions.createFromTemplate, { templateMissionId: template._id })
      })
    }
    console.log(`[cron] ${cronMissions.length} recurring missions scheduled`)
  } catch (err) {
    console.error("[cron] scheduler error:", err)
  }
}

startCronScheduler()

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("[worker] shutting down...")
  for (const [id, controller] of running) {
    controller.abort()
  }
  process.exit(0)
})
