"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type LicenseInfo, parseLicenseKey, validateLicense } from "./license"

async function debugValidateLicense(key: string): Promise<LicenseInfo | null> {
	const parsed = parseLicenseKey(key)
	console.log("[blazz] key:", key)
	console.log("[blazz] parsed:", parsed)
	const result = await validateLicense(key)
	console.log("[blazz] result:", result)
	return result
}

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
		debugValidateLicense(licenseKey)
			.then((result) => {
				if (!cancelled) {
					setLicense(result)
					setIsLoading(false)
				}
			})
			.catch((err) => {
				if (!cancelled) {
					console.error("[blazz] license error:", err)
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
