"use client"

import { useEffect, useState } from "react"
import type { DataTableView } from "../components/features/data-table"

interface UseDataTableViewsOptions {
	storageKey: string
	defaultViews: DataTableView[]
}

interface UseDataTableViewsReturn {
	views: DataTableView[]
	activeView: DataTableView | null
	setActiveView: (viewId: string | null) => void
	addView: (view: DataTableView) => void
	updateView: (viewId: string, updates: Partial<DataTableView>) => void
	deleteView: (viewId: string) => void
	setDefaultView: (viewId: string) => void
}

export function useDataTableViews({
	storageKey,
	defaultViews,
}: UseDataTableViewsOptions): UseDataTableViewsReturn {
	const [views, setViews] = useState<DataTableView[]>(defaultViews)
	const [activeView, setActiveView] = useState<string | null>(null)

	// Load views from localStorage on mount
	useEffect(() => {
		if (typeof window === "undefined") return

		try {
			const stored = localStorage.getItem(`${storageKey}-views`)
			if (stored) {
				setViews(JSON.parse(stored))
			}

			const storedActiveView = localStorage.getItem(`${storageKey}-active`)
			if (storedActiveView) {
				setActiveView(storedActiveView)
			}
		} catch (error) {
			console.error("Failed to load table views from localStorage:", error)
		}
	}, [storageKey])

	// Save views to localStorage whenever they change
	useEffect(() => {
		if (typeof window === "undefined") return

		try {
			localStorage.setItem(`${storageKey}-views`, JSON.stringify(views))
		} catch (error) {
			console.error("Failed to save table views to localStorage:", error)
		}
	}, [views, storageKey])

	// Save active view to localStorage whenever it changes
	useEffect(() => {
		if (typeof window === "undefined") return

		try {
			if (activeView) {
				localStorage.setItem(`${storageKey}-active`, activeView)
			} else {
				localStorage.removeItem(`${storageKey}-active`)
			}
		} catch (error) {
			console.error("Failed to save active view to localStorage:", error)
		}
	}, [activeView, storageKey])

	const addView = (view: DataTableView) => {
		setViews((prev) => [...prev, view])
	}

	const updateView = (viewId: string, updates: Partial<DataTableView>) => {
		setViews((prev) => prev.map((view) => (view.id === viewId ? { ...view, ...updates } : view)))
	}

	const deleteView = (viewId: string) => {
		setViews((prev) => prev.filter((view) => view.id !== viewId))
		if (activeView === viewId) {
			setActiveView(null)
		}
	}

	const setDefaultView = (viewId: string) => {
		setViews((prev) =>
			prev.map((view) => ({
				...view,
				isDefault: view.id === viewId,
			}))
		)
	}

	// Convert activeView ID to full object
	const activeViewObject = activeView ? views.find((v) => v.id === activeView) || null : null

	return {
		views,
		activeView: activeViewObject,
		setActiveView,
		addView,
		updateView,
		deleteView,
		setDefaultView,
	}
}
