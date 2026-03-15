"use client"

import { BlazzProvider } from "@blazz/pro"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import { ThemeProvider } from "next-themes"

const BLAZZ_DEV_LICENSE = "BLAZZ-PRO-BLAZZDEV-20271231-569bc77c0666d084"

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
			<BlazzProvider licenseKey={BLAZZ_DEV_LICENSE}>
				<ThemePaletteProvider>{children}</ThemePaletteProvider>
			</BlazzProvider>
		</ThemeProvider>
	)
}
