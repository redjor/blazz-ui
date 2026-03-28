"use client"

import { usePathname, useRouter } from "next/navigation"
import { TabsInterceptor } from "../../core/tabs-interceptor"

interface NextTabsInterceptorProps {
	excludePaths?: string[]
	titleResolver?: (url: string) => string
}

/**
 * Next.js adapter for TabsInterceptor.
 * Reads pathname and provides navigation via next/navigation.
 */
export function NextTabsInterceptor({ excludePaths, titleResolver }: NextTabsInterceptorProps) {
	const pathname = usePathname()
	const router = useRouter()

	return <TabsInterceptor pathname={pathname} onNavigate={(url) => router.push(url)} excludePaths={excludePaths} titleResolver={titleResolver} />
}
