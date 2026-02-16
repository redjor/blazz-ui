"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useTheme } from "next-themes"

export type ThemePalette = "slate" | "corporate" | "warm"

const RECOMMENDED_MODE: Record<ThemePalette, string> = {
	slate: "dark",
	corporate: "light",
	warm: "light",
}

const ThemePaletteContext = createContext<{
	palette: ThemePalette
	setPalette: (palette: ThemePalette) => void
}>({
	palette: "slate",
	setPalette: () => {},
})

export function ThemePaletteProvider({ children }: { children: React.ReactNode }) {
	const [palette, setPaletteState] = useState<ThemePalette>("slate")
	const [mounted, setMounted] = useState(false)
	const { setTheme } = useTheme()

	useEffect(() => {
		const stored = localStorage.getItem("theme-palette") as ThemePalette | null
		if (stored && stored in RECOMMENDED_MODE) {
			setPaletteState(stored)
			if (stored === "slate") {
				document.documentElement.removeAttribute("data-theme")
			} else {
				document.documentElement.setAttribute("data-theme", stored)
			}
		}
		setMounted(true)
	}, [])

	const setPalette = useCallback(
		(next: ThemePalette) => {
			setPaletteState(next)
			localStorage.setItem("theme-palette", next)
			if (next === "slate") {
				document.documentElement.removeAttribute("data-theme")
			} else {
				document.documentElement.setAttribute("data-theme", next)
			}
			setTheme(RECOMMENDED_MODE[next])
		},
		[setTheme]
	)

	if (!mounted) return <>{children}</>

	return (
		<ThemePaletteContext.Provider value={{ palette, setPalette }}>
			{children}
		</ThemePaletteContext.Provider>
	)
}

export function useThemePalette() {
	return useContext(ThemePaletteContext)
}
