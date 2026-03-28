"use client"

import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect } from "react"
import { routeToFlag, useFeatureFlags } from "@/lib/feature-flags-context"

export function RouteGuard({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const router = useRouter()
	const { isEnabled } = useFeatureFlags()

	useEffect(() => {
		const flag = routeToFlag(pathname)
		if (flag && !isEnabled(flag)) {
			router.replace("/")
		}
	}, [pathname, router, isEnabled])

	const flag = routeToFlag(pathname)
	if (flag && !isEnabled(flag)) return null

	return <>{children}</>
}
