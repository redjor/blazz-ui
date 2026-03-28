"use client"

import { useMutation, useQuery } from "convex/react"
import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react"
import { api } from "@/convex/_generated/api"
import { defaults, type FeatureFlag, routeToFlag } from "./features"

interface FeatureFlagsContextValue {
	isEnabled: (flag: FeatureFlag) => boolean
	setFlag: (flag: FeatureFlag, enabled: boolean) => Promise<void>
	flags: Record<FeatureFlag, boolean>
	isLoaded: boolean
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null)

const SETTING_PREFIX = "feature:"

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
	const allSettings = useQuery(api.settings.list)
	const setSetting = useMutation(api.settings.set)
	const removeSetting = useMutation(api.settings.remove)

	const flags = useMemo(() => {
		const result: Record<FeatureFlag, boolean> = { ...defaults }
		if (allSettings) {
			for (const key of Object.keys(defaults) as FeatureFlag[]) {
				const stored = allSettings[`${SETTING_PREFIX}${key}`]
				if (stored !== undefined) {
					result[key] = stored === "true"
				}
			}
		}
		return result
	}, [allSettings])

	const isEnabled = useCallback((flag: FeatureFlag) => flags[flag], [flags])

	const setFlag = useCallback(
		async (flag: FeatureFlag, enabled: boolean) => {
			if (enabled === defaults[flag]) {
				await removeSetting({ key: `${SETTING_PREFIX}${flag}` })
			} else {
				await setSetting({ key: `${SETTING_PREFIX}${flag}`, value: String(enabled) })
			}
		},
		[setSetting, removeSetting]
	)

	const value = useMemo(() => ({ isEnabled, setFlag, flags, isLoaded: allSettings !== undefined }), [isEnabled, setFlag, flags, allSettings])

	return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
}

export function useFeatureFlags() {
	const ctx = useContext(FeatureFlagsContext)
	if (!ctx) throw new Error("useFeatureFlags must be used within FeatureFlagsProvider")
	return ctx
}

export { routeToFlag }
