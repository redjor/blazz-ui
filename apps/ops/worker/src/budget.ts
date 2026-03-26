interface Agent {
  model: string
  budget: { maxPerMission: number; maxPerDay: number; maxPerMonth: number }
  usage: { todayUsd: number; monthUsd: number }
}

const RATES: Record<string, { input: number; output: number }> = {
  "gpt-4.1-mini": { input: 0.40, output: 1.60 },
  "gpt-4.1": { input: 2.00, output: 8.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
}

export function calculateCost(
  usage: { prompt_tokens: number; completion_tokens: number },
  model: string,
): number {
  const rate = RATES[model] ?? RATES["gpt-4.1-mini"]
  return (usage.prompt_tokens * rate.input + usage.completion_tokens * rate.output) / 1_000_000
}

export function canStartMission(agent: Agent): { ok: boolean; reason?: string } {
  if (agent.usage.todayUsd >= agent.budget.maxPerDay) {
    return { ok: false, reason: `Budget journalier atteint (${agent.usage.todayUsd.toFixed(3)}$ / ${agent.budget.maxPerDay}$)` }
  }
  if (agent.usage.monthUsd >= agent.budget.maxPerMonth) {
    return { ok: false, reason: `Budget mensuel atteint (${agent.usage.monthUsd.toFixed(3)}$ / ${agent.budget.maxPerMonth}$)` }
  }
  return { ok: true }
}

export function isMissionBudgetExceeded(missionCost: number, maxPerMission: number): boolean {
  return missionCost >= maxPerMission
}
