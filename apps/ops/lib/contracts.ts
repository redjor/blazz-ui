import { type BudgetHealth, healthColor } from "./budget"

export { healthColor }
export type ContractHealth = BudgetHealth

export interface MonthRow {
	month: string // "2026-03"
	allocated: number // days available (base + carry)
	consumed: number // days consumed
	carryIn: number // days carried from previous month
	remaining: number // allocated - consumed
	health: ContractHealth
}

export interface ContractMetrics {
	daysAllocatedThisMonth: number
	daysConsumedThisMonth: number
	daysRemainingThisMonth: number
	carryInThisMonth: number
	contractHealth: ContractHealth
	totalDaysAllocated: number
	totalDaysConsumed: number
	monthlyBreakdown: MonthRow[]
	/** True when we're consuming next month's budget early (prestation window) */
	isAnticipated: boolean
	/** The label for the target month, e.g. "2026-04" */
	targetMonth: string
}

/**
 * Build month-by-month breakdown for a TMA contract.
 * Returns null if contract has no daysPerMonth.
 */
export function computeContractMetrics(opts: {
	daysPerMonth: number
	carryOver: boolean
	prestationStartDate?: string // ISO — if set, entries before startDate are counted in first month
	startDate: string // ISO "2026-01-01"
	endDate: string // ISO "2026-12-31"
	hoursPerDay: number
	/** All billable time entries for the project within the contract period */
	entries: Array<{ date: string; minutes: number; billable: boolean }>
}): ContractMetrics | null {
	if (opts.daysPerMonth <= 0) return null

	const start = new Date(opts.startDate)
	const end = new Date(opts.endDate)
	const now = new Date()
	const effectiveEnd = end < now ? end : now

	// If we're in the prestation window (before contract start), show first contract month
	const inPrestationWindow = opts.prestationStartDate && now < start && now >= new Date(opts.prestationStartDate)

	// Build list of months: "2026-01", "2026-02", ...
	const months: string[] = []
	const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
	const lastMonth = inPrestationWindow
		? new Date(start.getFullYear(), start.getMonth(), 1) // force first contract month
		: new Date(effectiveEnd.getFullYear(), effectiveEnd.getMonth(), 1)
	while (cursor <= lastMonth) {
		months.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`)
		cursor.setMonth(cursor.getMonth() + 1)
	}
	if (months.length === 0) return null

	const firstMonth = months[0]

	// Group billable entries by month
	// If prestationStartDate is set, entries before startDate are bucketed into the first contract month
	const minutesByMonth: Record<string, number> = {}
	for (const e of opts.entries) {
		if (!e.billable) continue
		let m = e.date.slice(0, 7)
		if (opts.prestationStartDate && e.date >= opts.prestationStartDate && e.date < opts.startDate) {
			m = firstMonth
		}
		minutesByMonth[m] = (minutesByMonth[m] ?? 0) + e.minutes
	}

	// Build rows
	const minutesPerDay = opts.hoursPerDay * 60
	let carry = 0
	const rows: MonthRow[] = months.map((month) => {
		const allocated = opts.daysPerMonth + (opts.carryOver ? carry : 0)
		const consumed = minutesPerDay > 0 ? Math.round(((minutesByMonth[month] ?? 0) / minutesPerDay) * 10) / 10 : 0
		const remaining = Math.round((allocated - consumed) * 10) / 10
		const percentUsed = allocated > 0 ? (consumed / allocated) * 100 : 0

		let health: ContractHealth = "ok"
		if (percentUsed >= 100) health = "over"
		else if (percentUsed >= 90) health = "danger"
		else if (percentUsed >= 70) health = "warning"

		const carryIn = opts.carryOver ? carry : 0

		// Update carry for next month: only positive remaining carries over
		carry = opts.carryOver ? Math.max(0, remaining) : 0

		return { month, allocated, consumed, carryIn, remaining, health }
	})

	// Current month metrics
	const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
	const currentRow = rows.find((r) => r.month === currentMonth) ?? rows[rows.length - 1]

	const totalDaysAllocated = rows.reduce((s, _r) => s + opts.daysPerMonth, 0)
	const totalDaysConsumed = rows.reduce((s, r) => s + r.consumed, 0)

	return {
		daysAllocatedThisMonth: currentRow.allocated,
		daysConsumedThisMonth: currentRow.consumed,
		daysRemainingThisMonth: currentRow.remaining,
		carryInThisMonth: currentRow.carryIn,
		contractHealth: currentRow.health,
		totalDaysAllocated,
		totalDaysConsumed: Math.round(totalDaysConsumed * 10) / 10,
		monthlyBreakdown: rows,
		isAnticipated: !!inPrestationWindow,
		targetMonth: currentRow.month,
	}
}

export interface ForfaitMetrics {
	budgetTotal: number
	consumed: number
	remaining: number
	percentUsed: number
	health: ContractHealth
}

/**
 * Compute forfait contract metrics.
 * Consumption = sum of (minutes / 60 * hourlyRate) for billable entries within contract period.
 */
export function computeForfaitMetrics(opts: {
	budgetAmount: number
	entries: Array<{ date: string; minutes: number; hourlyRate: number; billable: boolean }>
	startDate: string
	endDate: string
}): ForfaitMetrics {
	const consumed = opts.entries.filter((e) => e.billable && e.date >= opts.startDate && e.date <= opts.endDate).reduce((sum, e) => sum + (e.minutes / 60) * e.hourlyRate, 0)

	const remaining = opts.budgetAmount - consumed
	const percentUsed = opts.budgetAmount > 0 ? (consumed / opts.budgetAmount) * 100 : 0

	let health: ContractHealth = "ok"
	if (percentUsed >= 100) health = "over"
	else if (percentUsed >= 90) health = "danger"
	else if (percentUsed >= 70) health = "warning"

	return {
		budgetTotal: opts.budgetAmount,
		consumed: Math.round(consumed),
		remaining: Math.round(remaining),
		percentUsed: Math.round(percentUsed * 10) / 10,
		health,
	}
}
