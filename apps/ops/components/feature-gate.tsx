import type { ReactNode } from "react"
import { type FeatureFlag, isEnabled } from "@/lib/features"

export function FeatureGate({ flag, children }: { flag: FeatureFlag; children: ReactNode }) {
	if (!isEnabled(flag)) return null
	return <>{children}</>
}
