"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

/**
 * Hook for navigation that preserves important URL parameters
 *
 * Provides a consistent way to navigate between views while preserving
 * client and hotel context parameters (clientId, pimid, clientphone, etc.)
 *
 * @example
 * const { navigateWithParams } = useNavigationWithParams()
 *
 * // Navigate to home, preserving default params (clientId, pimid, clientphone)
 * navigateWithParams('/')
 *
 * // Navigate to cart, preserving only specific params
 * navigateWithParams('/cart', ['clientId'])
 */
export function useNavigationWithParams() {
	const router = useRouter()
	const searchParams = useSearchParams()

	/**
	 * Navigate to a path while preserving specified URL parameters
	 *
	 * @param path - Target path (e.g., '/', '/cart', '/confirm')
	 * @param paramsToPreserve - Array of param names to preserve. If not specified, preserves default params.
	 * @param additionalParams - Additional params to add to the URL
	 */
	const navigateWithParams = useCallback(
		(path: string, paramsToPreserve?: string[], additionalParams?: Record<string, string>) => {
			const currentParams = new URLSearchParams(searchParams.toString())
			const newParams = new URLSearchParams()

			// Default params to preserve (client and hotel context)
			const defaultPreserve = ["clientId", "pimid", "clientphone"]
			const toPreserve = paramsToPreserve ?? defaultPreserve

			// Preserve specified params from current URL
			toPreserve.forEach((key) => {
				const value = currentParams.get(key)
				if (value) {
					newParams.set(key, value)
				}
			})

			// Add additional params if provided
			if (additionalParams) {
				Object.entries(additionalParams).forEach(([key, value]) => {
					newParams.set(key, value)
				})
			}

			// Build final URL
			const queryString = newParams.toString()
			router.push(queryString ? `${path}?${queryString}` : path)
		},
		[router, searchParams]
	)

	/**
	 * Navigate to home page, preserving client/hotel context
	 */
	const navigateToHome = useCallback(() => {
		navigateWithParams("/")
	}, [navigateWithParams])

	/**
	 * Navigate to a path, explicitly clearing all params (fresh start)
	 */
	const navigateWithoutParams = useCallback(
		(path: string) => {
			router.push(path)
		},
		[router]
	)

	return {
		navigateWithParams,
		navigateToHome,
		navigateWithoutParams,
	}
}
