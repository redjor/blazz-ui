import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RootProvider } from "fumadocs-ui/provider/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Blazz UI Boilerplate",
	description: "Boilerplate pour utiliser le package @blazz/ui-boilerplate avec Base UI",
	icons: {
		icon: "/favicon.png",
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	)
}
