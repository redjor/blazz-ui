"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { isEnabled, routeToFlag } from "@/lib/features"

export function RouteGuard({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		const flag = routeToFlag(pathname)
		if (flag && !isEnabled(flag)) {
			router.replace("/")
		}
	}, [pathname, router])

	const flag = routeToFlag(pathname)
	if (flag && !isEnabled(flag)) return null

	return <>{children}</>
}
