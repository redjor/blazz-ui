import type { ConvexHttpClient } from "convex/browser"
import OpenAI from "openai"
import { calculateCost, canStartMission, isMissionBudgetExceeded } from "./budget"
import { api } from "./convex"
import { consolidatePostMission, extractAndSaveMemories } from "./memory"
import { notifyMissionComplete, notifyMissionError } from "./notifications"
import { loadSoul } from "./soul-loader"
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
	userId: string
	slug: string
	name: string
	role: string
	model: string
	avatar?: string
	budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
	usage: { todayUsd: number; monthUsd: number; totalUsd: number; lastResetDay: string; lastResetMonth: string }
	permissions: { safe: string[]; confirm: string[]; blocked: string[] }
}

export async function runMission(convex: ConvexHttpClient, mission: Mission, agent: Agent, tools: Tool[], signal: AbortSignal) {
	const budgetCheck = canStartMission(agent)
	if (!budgetCheck.ok) {
		await convex.mutation(api.worker.workerFailMission, { id: mission._id as any, error: budgetCheck.reason! })
		return
	}

	const { systemPrompt, soulHash } = await loadSoul(agent.slug)

	// Inter-agent tools are always available
	const alwaysAvailable = ["delegate_to_agent", "ask_agent", "save_memory"]
	const allowedTools = tools.filter((t) => {
		if (alwaysAvailable.includes(t.name)) return true
		if (agent.permissions.blocked.includes(t.name)) return false
		return agent.permissions.safe.includes(t.name) || agent.permissions.confirm.includes(t.name)
	})

	await convex.mutation(api.worker.workerUpdateStatus, { id: mission._id as any, status: "in_progress", soulHash })
	await convex.mutation(api.worker.workerUpdateAgentStatus, { id: agent._id as any, status: "busy" })

	let memories: any[] = []
	try {
		memories = await convex.query(api.worker.workerListMemory, { agentId: agent._id as any })
	} catch {
		/* no memories yet */
	}

	// Build memory block, prioritized by category: rules > preferences > patterns > facts > episodes
	const categoryOrder = ["rule", "preference", "pattern", "fact", "episode"]
	const sorted = [...memories].sort((a, b) => categoryOrder.indexOf(a.category ?? "fact") - categoryOrder.indexOf(b.category ?? "fact")).slice(0, 15) // max 15 memories

	const memoryBlock =
		sorted.length > 0
			? `\n\n## Mémoire\n${sorted
					.map((m: any) => {
						const scope = m.scope === "shared" ? " [partagé]" : ""
						return `- [${m.category}${scope}] ${m.content}`
					})
					.join("\n")}`
			: ""

	const rejectionBlock = mission.rejectionReason ? `\n\nMISSION PRÉCÉDENTE REJETÉE. Raison : ${mission.rejectionReason}\nAjuste ton approche.` : ""

	const messages: OpenAI.ChatCompletionMessageParam[] = [
		{ role: "system", content: systemPrompt + memoryBlock + rejectionBlock },
		{ role: "user", content: mission.prompt },
	]

	let missionCost = 0
	let totalTokens = 0
	let askAgentCount = 0
	let iterations = 0
	const maxIter = mission.maxIterations ?? 15
	const maxTokens = 30_000 // hard cap: ~$0.02 for gpt-4.1-mini, ~$0.10 for gpt-4.1
	const maxAskAgent = 3
	const actions: Array<{ type: string; description: string; entityId?: string; reversible: boolean }> = []
	let lastThinkingContent: string | null = null

	const log = async (type: string, content: string, toolName?: string) => {
		await convex.mutation(api.agentLogs.append, {
			missionId: mission._id as any,
			agentId: agent._id as any,
			type: type as any,
			content,
			toolName,
		})
	}

	let hadError = true
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
				totalTokens += (response.usage.prompt_tokens ?? 0) + (response.usage.completion_tokens ?? 0)
				await convex.mutation(api.worker.workerAddAgentUsage, { id: agent._id as any, costUsd: cost })
			}

			// Token cap check
			if (totalTokens >= maxTokens) {
				await log("budget_warning", `Token cap atteint (${totalTokens} / ${maxTokens}). Synthèse forcée.`)
				messages.push(response.choices[0].message)
				messages.push({ role: "user", content: "TOKEN LIMIT: Tu as atteint la limite de tokens. Conclus immédiatement avec ce que tu as." })
				// One last call to conclude
				const finalResponse = await getOpenAI().chat.completions.create({
					model: agent.model,
					messages,
					max_tokens: 500,
				})
				if (finalResponse.choices[0].message.content) {
					await log("thinking", finalResponse.choices[0].message.content)
				}
				break
			}

			const choice = response.choices[0]

			if (choice.message.content) {
				lastThinkingContent = choice.message.content
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

					// Circuit breaker: max ask_agent calls per mission
					if (call.function.name === "ask_agent") {
						askAgentCount++
						if (askAgentCount > maxAskAgent) {
							const msg = `Limite de ${maxAskAgent} appels ask_agent atteinte. Utilise les réponses déjà obtenues.`
							await log("budget_warning", msg, "ask_agent")
							messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify({ error: msg }) })
							continue
						}
					}

					let result: string
					if (mission.mode === "dry-run" && tool.category === "write") {
						result = JSON.stringify({ skipped: true, reason: "dry-run mode" })
					} else {
						// Approval gate: tools listed in permissions.confirm require human sign-off.
						// The worker creates a pending approval and polls until the user resolves it.
						let approvalOutcome: "approved" | "rejected" | "timeout" | "skipped" = "skipped"
						let rejectionReason: string | undefined
						if (agent.permissions.confirm.includes(tool.name)) {
							const approvalId = await convex.mutation(api.worker.workerRequestApproval, {
								missionId: mission._id as any,
								agentId: agent._id as any,
								toolName: tool.name,
								toolArgs: JSON.parse(call.function.arguments),
							})
							await log("thinking", `⏸ En attente d'approbation pour ${tool.name}`, tool.name)

							const maxWaitMs = 5 * 60_000
							const pollInterval = 2000
							const startedAt = Date.now()
							approvalOutcome = "timeout"
							while (Date.now() - startedAt < maxWaitMs) {
								if (signal.aborted) {
									approvalOutcome = "rejected"
									rejectionReason = "Mission annulée"
									break
								}
								const approval = await convex.query(api.worker.workerGetApproval, { id: approvalId })
								if (approval?.status === "approved") {
									approvalOutcome = "approved"
									break
								}
								if (approval?.status === "rejected") {
									approvalOutcome = "rejected"
									rejectionReason = approval.rejectionReason
									break
								}
								await new Promise((r) => setTimeout(r, pollInterval))
							}
						}

						if (approvalOutcome === "rejected" || approvalOutcome === "timeout") {
							const reason = approvalOutcome === "timeout" ? "Timeout d'approbation (5 min)" : (rejectionReason ?? "Rejeté par l'utilisateur")
							result = JSON.stringify({ error: `Approval denied: ${reason}` })
							await log("error", `${tool.name} refusé: ${reason}`, tool.name)
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
					}

					await log("tool_result", result, call.function.name)
					messages.push({ role: "tool", tool_call_id: call.id, content: result })
				}
			}
		}

		// Use the thinking logs to get the output — they contain ALL assistant text
		// (messages array misses the final "stop" message since it's not pushed)
		const thinkingLogs: string[] = []
		for (const m of messages) {
			if (m.role === "assistant" && typeof (m as any).content === "string" && (m as any).content) {
				thinkingLogs.push((m as any).content)
			}
		}
		// Also check: the last response might have been logged but not pushed
		// Fall back to the agentLogs we created during the loop
		const output = thinkingLogs.length > 0 ? thinkingLogs[thinkingLogs.length - 1] : (lastThinkingContent ?? "Mission terminée sans output.")

		await log("done", `Mission terminée en ${iterations} itérations. Coût: ${missionCost.toFixed(4)}$`)

		await convex.mutation(api.worker.workerComplete, {
			id: mission._id as any,
			output,
			actions: actions.length > 0 ? actions : undefined,
			costUsd: missionCost,
			soulHash,
		})

		// Notify + create note
		await notifyMissionComplete(convex, mission, agent as any, output)

		// Extract and save memories from the mission output, then consolidate
		const extraction = await extractAndSaveMemories(convex, agent._id, agent.userId as string, mission._id, output, "mission")
		if (extraction) {
			await consolidatePostMission(convex, agent._id, agent.userId as string, mission._id, extraction)
		}
		hadError = false
	} catch (err) {
		hadError = true
		await log("error", String(err))
		await convex.mutation(api.worker.workerFailMission, { id: mission._id as any, error: String(err) })
		await notifyMissionError(convex, mission, agent as any, String(err))
	} finally {
		await convex.mutation(api.worker.workerUpdateAgentStatus, {
			id: agent._id as any,
			status: hadError ? "error" : "idle",
		})
	}
}
