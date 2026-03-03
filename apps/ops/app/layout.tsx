import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { OpsFrame } from "@/components/ops-frame"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Blazz Ops",
	description: "Freelance time tracking & billing",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<Providers>
					<OpsFrame>{children}</OpsFrame>
				</Providers>
			</body>
		</html>
	)
}
