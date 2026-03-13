"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type LicenseInfo, validateLicense } from "./license"

interface LicenseContextValue {
	license: LicenseInfo | null
	isLoading: boolean
}

const LicenseContext = createContext<LicenseContextValue>({
	license: null,
	isLoading: false,
})

export function BlazzProvider({
	licenseKey,
	children,
}: {
	licenseKey?: string
	children: React.ReactNode
}) {
	const [license, setLicense] = useState<LicenseInfo | null>(null)
	const [isLoading, setIsLoading] = useState(!!licenseKey)

	useEffect(() => {
		if (!licenseKey) {
			setLicense(null)
			setIsLoading(false)
			return
		}
		let cancelled = false
		validateLicense(licenseKey)
			.then((result) => {
				if (!cancelled) {
					console.log("[blazz] license validation:", result ? `valid=${result.valid}, plan=${result.plan}` : "null (invalid key)")
					setLicense(result)
					setIsLoading(false)
				}
			})
			.catch((err) => {
				if (!cancelled) {
					console.error("[blazz] license validation error:", err)
					setLicense(null)
					setIsLoading(false)
				}
			})
		return () => {
			cancelled = true
		}
	}, [licenseKey])

	return <LicenseContext value={{ license, isLoading }}>{children}</LicenseContext>
}

export function useLicense(): LicenseContextValue {
	return useContext(LicenseContext)
}
