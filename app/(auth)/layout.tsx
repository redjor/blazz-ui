import type * as React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4">
			{/* Branding */}
			<div className="mb-8 text-center">
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					Forge CRM
				</h1>
				<p className="text-sm text-muted-foreground">
					Gestion commerciale intelligente
				</p>
			</div>

			{/* Auth card */}
			<div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-sm">
				{children}
			</div>

			{/* Footer */}
			<p className="mt-6 text-xs text-muted-foreground">
				Pro UI Kit by Blazz
			</p>
		</div>
	)
}
