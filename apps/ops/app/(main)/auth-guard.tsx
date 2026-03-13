"use client"

import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect } from "react"

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
