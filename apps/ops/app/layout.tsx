import { GeistPixelSquare } from "geist/font/pixel"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Providers } from "./providers"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
	title: "Blazz Ops",
	description: "Freelance time tracking & billing",
	icons: {
		icon: "/favicon.png",
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="fr" suppressHydrationWarning>
				<body
					className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} font-sans antialiased`}
				>
					<Providers>{children}</Providers>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
