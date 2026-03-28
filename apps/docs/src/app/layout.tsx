import { BlazzProvider } from "@blazz/pro"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import "~/styles/globals.css"

const BLAZZ_DEV_LICENSE = "BLAZZ-PRO-BLAZZDEV-20271231-569bc77c0666d084"

export const metadata: Metadata = {
	title: "Blazz UI",
	description: "Pro UI Kit — AI-native components for data-heavy apps",
	icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
			</head>
			<body className="font-['Inter',sans-serif] antialiased">
				<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
					<BlazzProvider licenseKey={BLAZZ_DEV_LICENSE}>{children}</BlazzProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
