"use client"

import type { ReactNode } from "react"
import { useFeatureFlags } from "@/lib/feature-flags-context"
import type { FeatureFlag } from "@/lib/features"

export function FeatureGate({ flag, children }: { flag: FeatureFlag; children: ReactNode }) {
	const { isEnabled } = useFeatureFlags()
	if (!isEnabled(flag)) return null
	return <>{children}</>
}
