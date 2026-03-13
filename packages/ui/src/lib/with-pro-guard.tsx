"use client"

import { type ComponentType, useEffect } from "react"
import { LicenseBanner } from "../components/ui/license-banner"
import { useLicense } from "./license-context"

const warnedComponents = new Set<string>()

export function withProGuard<P extends object>(
	Component: ComponentType<P>,
	displayName?: string
): ComponentType<P> {
	const name = displayName || Component.displayName || Component.name || "ProComponent"

	function Guarded(props: P) {
		const { license, isLoading } = useLicense()
		const isLicensed = license?.valid === true

		useEffect(() => {
			if (
				!isLoading &&
				!isLicensed &&
				process.env.NODE_ENV === "development" &&
				!warnedComponents.has(name)
			) {
				warnedComponents.add(name)
				console.warn(
					`[blazz] <${name}> is a Pro component. Add a valid license key to <BlazzProvider> to remove the watermark. Learn more: https://blazz.dev/pricing`
				)
			}
		}, [isLicensed, isLoading])

		if (isLoading || isLicensed) {
			return <Component {...props} />
		}

		return (
			<div style={{ position: "relative" }}>
				<Component {...props} />
				<LicenseBanner />
			</div>
		)
	}

	Guarded.displayName = `withProGuard(${name})`
	return Guarded
}
