"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	if (!mounted) {
		return <button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-800" aria-label="Toggle theme"><span className="h-4 w-4 block" /></button>
	}

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="rounded-lg p-2 transition-colors hover:bg-gray-800"
			aria-label={resolvedTheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
		>
			{resolvedTheme === "dark" ? (
				<Sun className="h-4 w-4 text-gray-300" />
			) : (
				<Moon className="h-4 w-4 text-gray-300" />
			)}
		</button>
	)
}
