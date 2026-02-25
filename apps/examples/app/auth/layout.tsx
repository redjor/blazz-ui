import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Authentification - Blazz",
}

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[oklch(0.175_0.002_264)] to-[oklch(0.12_0.002_264)] flex items-center justify-center p-4">
			{children}
		</div>
	)
}
