"use client"

import { useEffect, useRef } from "react"
import { useUnsavedChangesContext } from "./context"

/**
 * Prevents the user from accidentally navigating away when a form has unsaved changes.
 *
 * - Blocks browser tab close / reload (`beforeunload`)
 * - Blocks browser back / forward button (`popstate`) and shakes the bar instead
 *
 * Place this hook in your topbar or root layout component (once per app).
 */
export function useUnsavedChangesNavigationGuard() {
	const { state, dispatch } = useUnsavedChangesContext()
	const { isDirty, onSave, onDiscard } = state

	const isBlocked = isDirty && (onSave !== null || onDiscard !== null)
	const guardActive = useRef(false)

	// Keep a ref for the bypass flag so popstate handler always reads the latest value
	const navigationBypassRef = useRef(state._navigationBypass)
	useEffect(() => {
		navigationBypassRef.current = state._navigationBypass
	}, [state._navigationBypass])

	// Prevent tab close / reload while the guard is active
	useEffect(() => {
		if (!isBlocked) return

		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault()
		}

		window.addEventListener("beforeunload", handler)
		return () => window.removeEventListener("beforeunload", handler)
	}, [isBlocked])

	// Intercept browser back / forward via a duplicate history entry
	useEffect(() => {
		if (!isBlocked) {
			// When the guard deactivates, undo the extra pushState we added —
			// unless allowNextNavigation() was called (successful submit + redirect).
			if (guardActive.current) {
				guardActive.current = false
				if (!navigationBypassRef.current) {
					window.history.back()
				}
			}
			return
		}

		// Reset bypass when the guard (re-)activates so it doesn't leak from a
		// previous cancel / discard action
		if (navigationBypassRef.current) {
			navigationBypassRef.current = false
			dispatch({ type: "RESET_NAVIGATION_BYPASS" })
		}

		const handler = () => {
			if (navigationBypassRef.current) {
				// The user cancelled via the discard button — step past the guard entry
				window.removeEventListener("popstate", handler)
				guardActive.current = false
				window.history.back()
				return
			}
			// Block navigation: restore the current URL and shake the bar
			window.history.pushState(null, "", window.location.href)
			dispatch({ type: "SHAKE" })
		}

		// Push an extra history entry so the next back-button press fires popstate
		// before leaving the page
		window.history.pushState(null, "", window.location.href)
		guardActive.current = true
		window.addEventListener("popstate", handler)

		return () => {
			window.removeEventListener("popstate", handler)
		}
	}, [isBlocked, dispatch])
}
