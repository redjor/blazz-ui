import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"

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
					<ThemePaletteProvider>
						{children}
					</ThemePaletteProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
