import { useCallback, useEffect, useState } from "react"

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | null {
	if (typeof document === "undefined") {
		return null
	}

	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)

	if (parts.length === 2) {
		return parts.pop()?.split(";").shift() || null
	}

	return null
}

// Singleton to prevent multiple concurrent fetches
let fetchPromise: Promise<string> | null = null
let cachedToken: string | null = null

/**
 * Hook to fetch and manage CSRF token
 * Automatically fetches token on mount and provides it for API calls
 * Uses singleton pattern to prevent race conditions between multiple components
 */
export function useCsrf() {
	const [csrfToken, setCsrfToken] = useState<string | null>(() => {
		// Initialize with cached token or cookie value
		if (cachedToken) return cachedToken
		if (typeof document !== "undefined") {
			const cookie = getCookie("csrf_token")
			if (cookie) {
				cachedToken = cookie
				return cookie
			}
		}
		return null
	})
	const [isLoading, setIsLoading] = useState(!cachedToken)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchCsrfToken() {
			try {
				// First, check if we already have a cached token
				if (cachedToken) {
					setCsrfToken(cachedToken)
					setIsLoading(false)
					return
				}

				// Check if the token exists in cookies
				const existingToken = getCookie("csrf_token")
				if (existingToken) {
					cachedToken = existingToken
					setCsrfToken(existingToken)
					setIsLoading(false)
					return
				}

				// If a fetch is already in progress, wait for it
				if (fetchPromise) {
					const token = await fetchPromise
					setCsrfToken(token)
					setIsLoading(false)
					return
				}

				// Start a new fetch and store the promise
				fetchPromise = (async () => {
					const response = await fetch("/api/csrf")

					if (!response.ok) {
						throw new Error("Failed to fetch CSRF token")
					}

					const data = await response.json()

					// Wait a bit for the cookie to be set by the browser
					await new Promise((resolve) => setTimeout(resolve, 50))

					// Read the token from the cookie (server sets it)
					const tokenFromCookie = getCookie("csrf_token")
					const token = tokenFromCookie || data.token

					cachedToken = token
					return token
				})()

				const token = await fetchPromise
				setCsrfToken(token)
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error")
			} finally {
				setIsLoading(false)
				fetchPromise = null
			}
		}

		fetchCsrfToken()
	}, [])

	// Allow manual refresh of CSRF token
	const refreshToken = useCallback(async () => {
		cachedToken = null
		fetchPromise = null
		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch("/api/csrf")
			if (!response.ok) {
				throw new Error("Failed to refresh CSRF token")
			}

			const data = await response.json()
			await new Promise((resolve) => setTimeout(resolve, 50))

			const tokenFromCookie = getCookie("csrf_token")
			const token = tokenFromCookie || data.token

			cachedToken = token
			setCsrfToken(token)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error")
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { csrfToken, isLoading, error, refreshToken }
}

/**
 * Get CSRF headers for fetch requests
 */
export function getCsrfHeaders(csrfToken: string | null | undefined): HeadersInit {
	if (!csrfToken) {
		return {}
	}

	return {
		"x-csrf-token": csrfToken,
	}
}
