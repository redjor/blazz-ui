"use client"

import { useEffect } from "react"

/**
 * Adds `frame-layout` class to <html> on mount, removes on unmount.
 * This enables overflow:hidden on html/body for frame-based layouts
 * (CRM dashboard, showcase) while letting other routes (docs) scroll normally.
 */
export function useFrameLayout() {
	useEffect(() => {
		document.documentElement.classList.add("frame-layout")
		return () => {
			document.documentElement.classList.remove("frame-layout")
		}
	}, [])
}
