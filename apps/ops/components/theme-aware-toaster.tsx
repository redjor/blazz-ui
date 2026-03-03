"use client"

import { Toaster } from "@blazz/ui/components/ui/toast"
import { useTheme } from "next-themes"

export function ThemeAwareToaster() {
	const { resolvedTheme } = useTheme()

	return <Toaster theme={resolvedTheme as "light" | "dark" | "system"} />
}
