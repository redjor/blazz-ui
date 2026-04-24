"use client"

import { useEffect } from "react"

export function PwaRegister() {
	useEffect(() => {
		if (typeof window === "undefined") return
		if (!("serviceWorker" in navigator)) return
		if (process.env.NODE_ENV !== "production") return

		const register = () => {
			navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
				// Silent: SW registration failure shouldn't break the app.
			})
		}

		if (document.readyState === "complete") register()
		else window.addEventListener("load", register, { once: true })
	}, [])

	return null
}
