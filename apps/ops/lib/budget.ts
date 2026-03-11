export type BudgetHealth = "ok" | "warning" | "danger" | "over"

export interface BudgetMetrics {
  budgetAmount: number
  daysSold: number
  daysConsumed: number
  revenueConsumed: number
  remaining: number
  percentUsed: number
  effectiveTjm: number | null // null if 0 days consumed
  health: BudgetHealth
}

/**
 * Compute all budget-derived metrics from a project's data.
 * Returns null if no budget is set.
 */
export function computeBudgetMetrics(opts: {
  budgetAmount: number | undefined
  tjm: number
  hoursPerDay: number
  billableMinutes: number
  billableRevenue: number
}): BudgetMetrics | null {
  if (!opts.budgetAmount || opts.budgetAmount <= 0) return null

  const daysSold = opts.tjm > 0 ? opts.budgetAmount / opts.tjm : 0
  const daysConsumed =
    opts.hoursPerDay > 0 ? opts.billableMinutes / (opts.hoursPerDay * 60) : 0
  const remaining = opts.budgetAmount - opts.billableRevenue
  const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
  const effectiveTjm =
    daysConsumed > 0 ? opts.billableRevenue / daysConsumed : null

  let health: BudgetHealth = "ok"
  if (percentUsed >= 100) health = "over"
  else if (percentUsed >= 90) health = "danger"
  else if (percentUsed >= 70) health = "warning"

  return {
    budgetAmount: opts.budgetAmount,
    daysSold: Math.round(daysSold * 10) / 10,
    daysConsumed: Math.round(daysConsumed * 10) / 10,
    revenueConsumed: Math.round(opts.billableRevenue),
    remaining: Math.round(remaining),
    percentUsed: Math.round(percentUsed * 10) / 10,
    effectiveTjm: effectiveTjm !== null ? Math.round(effectiveTjm) : null,
    health,
  }
}

/** Returns Tailwind classes for progress bar color based on health. */
export function healthColor(health: BudgetHealth): {
  bar: string
  text: string
  bg: string
} {
  switch (health) {
    case "ok":
      return {
        bar: "bg-green-500",
        text: "text-green-700 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950/30",
      }
    case "warning":
      return {
        bar: "bg-amber-500",
        text: "text-amber-700 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/30",
      }
    case "danger":
      return {
        bar: "bg-red-500",
        text: "text-red-700 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
      }
    case "over":
      return {
        bar: "bg-red-600",
        text: "text-red-700 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
      }
  }
}
