import type { Doc } from "../_generated/dataModel"

type Contract = Doc<"contracts">
type Project = { tjm: number }

/**
 * Compute the monthly revenue (in euros, NOT cents) for a contract in a given yearMonth.
 * Returns 0 if the contract is not active during that month.
 */
export function contractMonthlyRevenue(contract: Contract, project: Project, yearMonth: string): number {
	// Check contract covers this month
	const cStart = contract.startDate.slice(0, 7)
	const cEnd = contract.endDate.slice(0, 7)
	if (yearMonth < cStart || yearMonth > cEnd) return 0

	if (contract.type === "tma" && contract.daysPerMonth) {
		return contract.daysPerMonth * project.tjm
	}

	if (contract.type === "regie") {
		return 20 * project.tjm
	}

	if (contract.type === "forfait" && contract.budgetAmount) {
		const startDate = new Date(contract.startDate)
		const endDate = new Date(contract.endDate)
		const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1
		if (totalMonths > 0) {
			return contract.budgetAmount / totalMonths
		}
	}

	return 0
}
