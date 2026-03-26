import OpenAI from "openai"
import { ConvexHttpClient } from "convex/browser"
import { api } from "./convex"
import { loadSoul } from "./soul-loader"
import { calculateCost, canStartMission, isMissionBudgetExceeded } from "./budget"
import type { Tool } from "./tools/index"

let _openai: OpenAI
function getOpenAI() {
	if (!_openai) _openai = new OpenAI()
	return _openai
}

interface Mission {
  _id: string
  agentId: string
  title: string
  prompt: string
  mode?: string
  maxIterations?: number
  rejectionReason?: string
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
  const budgetCheck = canStartMission(agent)
  if (!budgetCheck.ok) {
    await convex.mutation(api.worker.workerFailMission, { id: mission._id as any, error: budgetCheck.reason! })
    return
  }

  const { systemPrompt, soulHash } = await loadSoul(agent.slug)

  const allowedTools = tools.filter((t) => {
    if (agent.permissions.blocked.includes(t.name)) return false
    return agent.permissions.safe.includes(t.name) || agent.permissions.confirm.includes(t.name)
  })

  await convex.mutation(api.worker.workerUpdateStatus, { id: mission._id as any, status: "in_progress", soulHash })
  await convex.mutation(api.worker.workerUpdateAgentStatus, { id: agent._id as any, status: "busy" })

  let memories: any[] = []
  try {
    memories = await convex.query(api.worker.workerListMemory, { agentId: agent._id as any })
  } catch { /* no memories yet */ }

  const memoryBlock = memories.length > 0
    ? "\n\n## Mémoire\n" + memories.slice(-10).map((m: any) => `[${m.type}] ${m.content}`).join("\n")
    : ""

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

      const response = await getOpenAI().chat.completions.create({
        model: agent.model,
        messages,
        tools: allowedTools.length > 0 ? allowedTools.map((t) => t.definition) : undefined,
      })

      if (response.usage) {
        const cost = calculateCost(response.usage, agent.model)
        missionCost += cost
        await convex.mutation(api.worker.workerAddAgentUsage, { id: agent._id as any, costUsd: cost })
      }

      const choice = response.choices[0]

      if (choice.message.content) {
        await log("thinking", choice.message.content)
      }

      if (choice.finish_reason === "stop") break

      if (isMissionBudgetExceeded(missionCost, agent.budget.maxPerMission)) {
        await log("budget_warning", `Budget mission atteint (${missionCost.toFixed(4)}$). Synthèse forcée.`)
        messages.push(choice.message)
        messages.push({ role: "user", content: "BUDGET LIMIT: Conclus maintenant avec les données collectées." })
        continue
      }

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
          if (mission.mode === "dry-run" && tool.category === "write") {
            result = JSON.stringify({ skipped: true, reason: "dry-run mode" })
          } else {
            try {
              const output = await tool.execute(JSON.parse(call.function.arguments), convex)
              result = JSON.stringify(output)
              if (agent.permissions.confirm.includes(tool.name)) {
                actions.push({ type: tool.name, description: `${tool.name}(${call.function.arguments})`, reversible: tool.category === "write" })
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

    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant" && typeof m.content === "string")
    const output = (lastAssistant as any)?.content ?? "Mission terminée sans output."

    await log("done", `Mission terminée en ${iterations} itérations. Coût: ${missionCost.toFixed(4)}$`)

    await convex.mutation(api.worker.workerComplete, {
      id: mission._id as any,
      output,
      actions: actions.length > 0 ? actions : undefined,
      costUsd: missionCost,
      soulHash,
    })
  } catch (err) {
    await log("error", String(err))
    await convex.mutation(api.worker.workerFailMission, { id: mission._id as any, error: String(err) })
  } finally {
    await convex.mutation(api.worker.workerUpdateAgentStatus, { id: agent._id as any, status: "idle" })
  }
}
