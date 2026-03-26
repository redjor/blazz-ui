import OpenAI from "openai"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../convex/_generated/api"
import { loadSoul } from "./soul-loader"
import { calculateCost, canStartMission, isMissionBudgetExceeded } from "./budget"
import type { Tool } from "./tools/index"

const openai = new OpenAI()

interface Mission {
  _id: string
  agentId: string
  title: string
  prompt: string
  mode?: string
  maxIterations?: number
  rejectionReason?: string
  onComplete?: { createMission?: { agentSlug: string; templateId: string; condition?: string } }
}

interface Agent {
  _id: string
  slug: string
  name: string
  model: string
  budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
  usage: { todayUsd: number; monthUsd: number; totalUsd: number; lastResetDay: string; lastResetMonth: string }
  permissions: { safe: string[]; confirm: string[]; blocked: string[] }
}

export async function runMission(
  convex: ConvexHttpClient,
  mission: Mission,
  agent: Agent,
  tools: Tool[],
  signal: AbortSignal,
) {
  // 1. Budget check
  const budgetCheck = canStartMission(agent)
  if (!budgetCheck.ok) {
    await convex.mutation(api.missions.failMission, { id: mission._id as any, error: budgetCheck.reason! })
    return
  }

  // 2. Load soul
  const { systemPrompt, soulHash } = await loadSoul(agent.slug)

  // 3. Resolve tools (filter by permissions)
  const allowedTools = tools.filter((t) => {
    if (agent.permissions.blocked.includes(t.name)) return false
    if (agent.permissions.safe.includes(t.name)) return true
    if (agent.permissions.confirm.includes(t.name)) return true
    return false
  })

  // 4. Update status
  await convex.mutation(api.missions.updateStatus, {
    id: mission._id as any,
    status: "in_progress",
    soulHash,
  })
  await convex.mutation(api.agents.updateStatus, { id: agent._id as any, status: "busy" })

  // 5. Load memory
  const memories = await convex.query(api.agentMemory.list, { agentId: agent._id as any })
  const memoryBlock = memories.length > 0
    ? "\n\n## Mémoire\n" + memories.slice(-10).map((m) => `[${m.type}] ${m.content}`).join("\n")
    : ""

  // 6. Rejection context
  const rejectionBlock = mission.rejectionReason
    ? `\n\nMISSION PRÉCÉDENTE REJETÉE. Raison : ${mission.rejectionReason}\nAjuste ton approche.`
    : ""

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt + memoryBlock + rejectionBlock },
    { role: "user", content: mission.prompt },
  ]

  let missionCost = 0
  let iterations = 0
  const maxIter = mission.maxIterations ?? 15
  const actions: Array<{ type: string; description: string; entityId?: string; reversible: boolean }> = []

  const log = async (type: string, content: string, toolName?: string) => {
    await convex.mutation(api.agentLogs.append, {
      missionId: mission._id as any,
      agentId: agent._id as any,
      type: type as any,
      content,
      toolName,
    })
  }

  try {
    while (!signal.aborted && iterations < maxIter) {
      iterations++

      const response = await openai.chat.completions.create({
        model: agent.model,
        messages,
        tools: allowedTools.length > 0 ? allowedTools.map((t) => t.definition) : undefined,
      })

      // Track cost
      if (response.usage) {
        const cost = calculateCost(response.usage, agent.model)
        missionCost += cost
        await convex.mutation(api.agents.addUsage, { id: agent._id as any, costUsd: cost })
      }

      const choice = response.choices[0]

      // Log thinking
      if (choice.message.content) {
        await log("thinking", choice.message.content)
      }

      // Done?
      if (choice.finish_reason === "stop") break

      // Budget check mid-mission
      if (isMissionBudgetExceeded(missionCost, agent.budget.maxPerMission)) {
        await log("budget_warning", `Budget mission atteint (${missionCost.toFixed(4)}$). Synthèse forcée.`)
        messages.push(choice.message)
        messages.push({ role: "user", content: "BUDGET LIMIT: Conclus maintenant avec les données collectées." })
        continue
      }

      // Execute tool calls
      if (choice.message.tool_calls) {
        messages.push(choice.message)

        for (const call of choice.message.tool_calls) {
          const tool = allowedTools.find((t) => t.name === call.function.name)
          if (!tool) {
            messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: "Tool not available" }) })
            continue
          }

          await log("tool_call", call.function.arguments, call.function.name)

          let result: string
          const isDryRun = mission.mode === "dry-run" && tool.category === "write"

          if (isDryRun) {
            result = JSON.stringify({ skipped: true, reason: "dry-run mode" })
          } else {
            try {
              const output = await tool.execute(JSON.parse(call.function.arguments), convex)
              result = JSON.stringify(output)

              // Track confirm actions
              if (agent.permissions.confirm.includes(tool.name)) {
                actions.push({
                  type: tool.name,
                  description: `${tool.name}(${call.function.arguments})`,
                  reversible: tool.category === "write",
                })
              }
            } catch (err) {
              result = JSON.stringify({ error: String(err) })
              await log("error", `Tool ${call.function.name} failed: ${err}`, call.function.name)
            }
          }

          await log("tool_result", result, call.function.name)
          messages.push({ role: "tool", tool_call_id: call.id, content: result })
        }
      }
    }

    // Final output
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && typeof m.content === "string")
    const output = (lastAssistant as any)?.content ?? "Mission terminée sans output."

    await log("done", `Mission terminée en ${iterations} itérations. Coût: ${missionCost.toFixed(4)}$`)

    await convex.mutation(api.missions.complete, {
      id: mission._id as any,
      output,
      actions: actions.length > 0 ? actions : undefined,
      costUsd: missionCost,
      soulHash,
    })
  } catch (err) {
    await log("error", String(err))
    await convex.mutation(api.missions.failMission, {
      id: mission._id as any,
      error: String(err),
    })
  } finally {
    await convex.mutation(api.agents.updateStatus, { id: agent._id as any, status: "idle" })
  }
}
