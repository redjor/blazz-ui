"use client"

import { ConvexAuthProvider } from "@convex-dev/auth/react"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import { ThemeAwareToaster } from "@/components/theme-aware-toaster"
import { ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ConvexAuthProvider client={convex}>
			<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
				<ThemePaletteProvider>
					{children}
					<ThemeAwareToaster />
				</ThemePaletteProvider>
			</ThemeProvider>
		</ConvexAuthProvider>
	)
}
