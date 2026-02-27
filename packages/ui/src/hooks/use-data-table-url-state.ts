"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import type { DataTableView } from "../components/blocks/data-table"

interface UseDataTableUrlStateOptions {
	views: DataTableView[]
	defaultView?: DataTableView
}

interface UseDataTableUrlStateReturn {
	activeView: DataTableView | null
	setActiveView: (view: DataTableView | null) => void
}

/**
 * Hook to manage DataTable view state via URL parameters
 *
 * URL format: ?selectedView=actif&status=actif
 * - selectedView: ID of the active view
 * - Other params: Filter conditions from the view (for URL readability and sharing)
 *
 * The DataTable will automatically apply the view's filters when the view changes.
 *
 * @example
 * const { activeView, setActiveView } = useDataTableUrlState({
 *   views: myViews,
 *   defaultView: myViews[0]
 * })
 */
export function useDataTableUrlState({
	views,
	defaultView,
}: UseDataTableUrlStateOptions): UseDataTableUrlStateReturn {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	// Get active view from URL or use default
	const getActiveViewFromUrl = useCallback((): DataTableView | null => {
		const selectedViewId = searchParams.get("selectedView")
		if (selectedViewId) {
			return views.find((v) => v.id === selectedViewId) || null
		}
		return defaultView || (views.length > 0 ? views.find((v) => v.isDefault) || views[0] : null)
	}, [searchParams, views, defaultView])

	const [activeView, setActiveViewState] = useState<DataTableView | null>(getActiveViewFromUrl)

	// Sync activeView when URL changes
	useEffect(() => {
		setActiveViewState(getActiveViewFromUrl())
	}, [getActiveViewFromUrl])

	// Update URL when view changes
	const setActiveView = useCallback(
		(view: DataTableView | null) => {
			const params = new URLSearchParams()

			if (view) {
				// Set the selectedView parameter
				params.set("selectedView", view.id)

				// Add filter params from view for URL readability
				if (view.filters && view.filters.conditions) {
					view.filters.conditions.forEach((condition) => {
						if ("column" in condition && "value" in condition) {
							params.set(condition.column, String(condition.value))
						}
					})
				}
			}

			const queryString = params.toString()
			router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
			setActiveViewState(view)
		},
		[router, pathname]
	)

	return {
		activeView,
		setActiveView,
	}
}
