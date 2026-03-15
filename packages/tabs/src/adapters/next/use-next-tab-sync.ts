"use client"

import { usePathname } from "next/navigation"
import { useTabUrlSync } from "../../core/use-tab-url-sync"

/**
 * Next.js adapter for useTabUrlSync.
 * Reads pathname from next/navigation automatically.
 */
export function useNextTabSync(titleResolver: (pathname: string) => string) {
  const pathname = usePathname()
  useTabUrlSync(pathname, titleResolver)
}
