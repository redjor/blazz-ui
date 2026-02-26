import { Moon, Sun } from "lucide-react"
import { setThemeCookie, type Theme } from "~/lib/theme"

export function ThemeToggle() {
	const toggle = () => {
		const isDark = document.documentElement.classList.contains("dark")
		const next: Theme = isDark ? "light" : "dark"
		document.documentElement.classList.toggle("dark", next === "dark")
		setThemeCookie({ data: next })
	}

	return (
		<button
			type="button"
			onClick={toggle}
			className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-raised transition-colors"
			aria-label="Toggle theme"
		>
			<Sun className="size-4 hidden dark:block" />
			<Moon className="size-4 block dark:hidden" />
		</button>
	)
}
