import { GeistPixelSquare } from "geist/font/pixel"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { PwaRegister } from "@/components/pwa-register"
import { Providers } from "./providers"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
	title: { default: "Blazz Ops", template: "%s — Blazz Ops" },
	description: "Freelance time tracking & billing",
	applicationName: "Blazz Ops",
	appleWebApp: {
		capable: true,
		title: "Blazz Ops",
		statusBarStyle: "black-translucent",
	},
	icons: {
		icon: "/favicon.png",
		apple: "/icons/apple-touch-icon.png",
	},
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#111114" },
	],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="fr" suppressHydrationWarning>
				<body className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} font-sans antialiased`}>
					<Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" />
					<PwaRegister />
					<Providers>{children}</Providers>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
