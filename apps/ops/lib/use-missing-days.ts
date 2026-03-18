import { useQuery } from "convex/react"
import {
	startOfWeek,
	endOfWeek,
	subWeeks,
	eachDayOfInterval,
	format,
	isAfter,
	startOfDay,
	getDay,
} from "date-fns"
import { fr } from "date-fns/locale"
import { useMemo } from "react"
import { api } from "@/convex/_generated/api"

/**
 * Returns workdays (Mon-Fri) with no billable time entry,
 * covering the current week (Mon → today) and the previous week.
 */
export function useMissingDays() {
	const today = startOfDay(new Date())
	const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
	const previousWeekStart = startOfWeek(subWeeks(today, 1), {
		weekStartsOn: 1,
	})
	const previousWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 })

	const from = format(previousWeekStart, "yyyy-MM-dd")
	const to = format(today, "yyyy-MM-dd")

	const entries = useQuery(api.timeEntries.list, { from, to })

	const missingDays = useMemo(() => {
		if (entries === undefined) return undefined

		// Collect all days that have at least 1 billable entry
		const coveredDates = new Set(
			entries.filter((e) => e.billable).map((e) => e.date),
		)

		// Build list of all workdays in range
		const allDays = [
			...eachDayOfInterval({
				start: previousWeekStart,
				end: previousWeekEnd,
			}),
			...eachDayOfInterval({ start: currentWeekStart, end: today }),
		]

		// Filter: workdays (Mon=1..Fri=5), not in future, not covered
		return allDays
			.filter((day) => {
				const dow = getDay(day) // 0=Sun, 6=Sat
				if (dow === 0 || dow === 6) return false
				if (isAfter(day, today)) return false
				return !coveredDates.has(format(day, "yyyy-MM-dd"))
			})
			.map((day) => ({
				date: format(day, "yyyy-MM-dd"),
				label: format(day, "EEE d MMM", { locale: fr }),
			}))
	}, [entries, previousWeekStart, previousWeekEnd, currentWeekStart, today])

	return { missingDays, isLoading: entries === undefined }
}
