"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="rounded-lg p-2 transition-colors hover:bg-gray-800"
			aria-label={resolvedTheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
		>
			{resolvedTheme === "dark" ? (
				<Sun className="h-5 w-5 text-gray-300" />
			) : (
				<Moon className="h-5 w-5 text-gray-300" />
			)}
		</button>
	)
}
