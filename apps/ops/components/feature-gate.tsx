"use client"

import type { ReactNode } from "react"
import type { FeatureFlag } from "@/lib/features"
import { useFeatureFlags } from "@/lib/feature-flags-context"

export function FeatureGate({ flag, children }: { flag: FeatureFlag; children: ReactNode }) {
	const { isEnabled } = useFeatureFlags()
	if (!isEnabled(flag)) return null
	return <>{children}</>
}
