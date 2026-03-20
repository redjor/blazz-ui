/**
 * Resolve monthly targets from an annual goal + per-month overrides.
 * Overrides use 1-based month keys ("1" = Jan, "12" = Dec).
 * Non-overridden months share the remainder equally.
 * Returns an array of 12 integers (index 0 = Jan).
 */
export function resolveMonthlyTargets(annual: number, overrides: Record<string, number>): number[] {
	const result: number[] = new Array(12).fill(0)
	const autoMonths: number[] = []
	let overrideSum = 0

	for (let i = 0; i < 12; i++) {
		const key = String(i + 1)
		if (key in overrides) {
			result[i] = overrides[key]
			overrideSum += overrides[key]
		} else {
			autoMonths.push(i)
		}
	}

	if (autoMonths.length === 0) return result

	const remainder = annual - overrideSum
	const base = Math.floor(remainder / autoMonths.length)
	let leftover = remainder - base * autoMonths.length

	for (const idx of autoMonths) {
		result[idx] = base + (leftover > 0 ? 1 : 0)
		if (leftover > 0) leftover--
	}

	return result
}

/** Quarter index (0-3) for a given month index (0-11) */
export function quarterOf(monthIndex: number): number {
	return Math.floor(monthIndex / 3)
}

/** Label for a quarter: "Q1", "Q2", etc. */
export function quarterLabel(quarterIndex: number): string {
	return `Q${quarterIndex + 1}`
}
