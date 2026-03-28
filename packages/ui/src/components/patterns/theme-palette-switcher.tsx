"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemePaletteSwitcher() {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<button type="button" className="rounded-lg p-2 transition-colors hover:bg-muted" aria-label="Toggle theme" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
			{resolvedTheme === "dark" ? <Sun className="h-4 w-4 text-fg-muted" /> : <Moon className="h-4 w-4 text-fg-muted" />}
		</button>
	)
}
