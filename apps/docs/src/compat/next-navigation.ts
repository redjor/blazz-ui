"use client"

import { useLocation, useNavigate } from "@tanstack/react-router"
import { useCallback, useMemo } from "react"

export function useRouter() {
	const navigate = useNavigate()

	const push = useCallback(
		(url: string) => {
			navigate({ to: url })
		},
		[navigate]
	)

	const replace = useCallback(
		(url: string) => {
			navigate({ to: url, replace: true })
		},
		[navigate]
	)

	const back = useCallback(() => {
		window.history.back()
	}, [])

	const forward = useCallback(() => {
		window.history.forward()
	}, [])

	const refresh = useCallback(() => {
		window.location.reload()
	}, [])

	return { push, replace, back, forward, refresh }
}

export function usePathname(): string {
	const location = useLocation()
	return location.pathname
}

export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
	const location = useLocation()
	const navigate = useNavigate()

	const searchParams = useMemo(() => new URLSearchParams(location.searchStr), [location.searchStr])

	const setSearchParams = useCallback(
		(params: URLSearchParams) => {
			const search = params.toString()
			navigate({
				to: location.pathname,
				search: search ? `?${search}` : "",
			} as any)
		},
		[navigate, location.pathname]
	)

	return [searchParams, setSearchParams]
}
