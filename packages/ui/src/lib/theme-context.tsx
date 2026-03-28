"use client"

import { useTheme } from "next-themes"
import { createContext, useContext } from "react"

const ThemePaletteContext = createContext<{
	palette: "slate"
	setPalette: (palette: "slate") => void
}>({
	palette: "slate",
	setPalette: () => {},
})

export type ThemePalette = "slate"

export function ThemePaletteProvider({ children }: { children: React.ReactNode }) {
	return <ThemePaletteContext.Provider value={{ palette: "slate", setPalette: () => {} }}>{children}</ThemePaletteContext.Provider>
}

export function useThemePalette() {
	return useContext(ThemePaletteContext)
}
