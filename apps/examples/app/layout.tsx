import "./globals.css"
import { BlazzProvider } from "@blazz/pro"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"

const BLAZZ_DEV_LICENSE = "BLAZZ-PRO-BLAZZDEV-20271231-569bc77c0666d084"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Blazz UI Examples",
	description: "CRM, StockBase, TalentFlow demo apps powered by @blazz/ui",
	icons: {
		icon: "/favicon.png",
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
					<BlazzProvider licenseKey={BLAZZ_DEV_LICENSE}>
						<ThemePaletteProvider>{children}</ThemePaletteProvider>
					</BlazzProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
