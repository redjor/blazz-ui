"use client"

import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ConvexProvider client={convex}>
			<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
				<ThemePaletteProvider>
					{children}
					<Toaster richColors />
				</ThemePaletteProvider>
			</ThemeProvider>
		</ConvexProvider>
	)
}
