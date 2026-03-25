"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
	const { setTheme, resolvedTheme } = useTheme()

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-muted transition-colors"
			aria-label="Toggle theme"
		>
			<Sun className="size-4 hidden dark:block" />
			<Moon className="size-4 block dark:hidden" />
		</button>
	)
}
