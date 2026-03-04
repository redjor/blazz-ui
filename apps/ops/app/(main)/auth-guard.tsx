"use client"

import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

export function AuthGuard({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.replace("/login")
		}
	}, [isAuthenticated, isLoading, router])

	if (isLoading || !isAuthenticated) return null

	return <>{children}</>
}
