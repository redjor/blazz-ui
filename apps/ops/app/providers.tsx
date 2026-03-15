"use client"

import { BlazzProvider } from "@blazz/pro"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs"
import { ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { ThemeAwareToaster } from "@/components/theme-aware-toaster"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ConvexAuthNextjsProvider client={convex}>
			<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
				<BlazzProvider licenseKey={process.env.NEXT_PUBLIC_BLAZZ_LICENSE_KEY}>
					<ThemePaletteProvider>
						{children}
						<ThemeAwareToaster />
					</ThemePaletteProvider>
				</BlazzProvider>
			</ThemeProvider>
		</ConvexAuthNextjsProvider>
	)
}
