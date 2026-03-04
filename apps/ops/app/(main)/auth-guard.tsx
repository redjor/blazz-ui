"use client"

import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

export function AuthGuard({ children }: { children: ReactNode }) {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const router = useRouter()

	console.log("[AuthGuard]", { isLoading, isAuthenticated })

	useEffect(() => {
		console.log("[AuthGuard] effect", { isLoading, isAuthenticated })
		if (!isLoading && !isAuthenticated) {
			console.log("[AuthGuard] → redirect /login")
			router.replace("/login")
		}
	}, [isAuthenticated, isLoading, router])

	if (isLoading || !isAuthenticated) return null

	return <>{children}</>
}
