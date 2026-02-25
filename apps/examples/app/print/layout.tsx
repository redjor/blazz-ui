import type * as React from "react"

export default function PrintLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body className="bg-white text-black">
				<div className="mx-auto max-w-4xl px-8 py-6 print:px-0 print:py-0">
					{/* Print header */}
					<header className="mb-6 border-b pb-4 print:mb-4 print:pb-2">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-lg font-bold">Forge CRM</h1>
								<p className="text-xs text-gray-500">
									Document généré le{" "}
									{new Date().toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</p>
							</div>
						</div>
					</header>

					{/* Content */}
					<main>{children}</main>

					{/* Print footer */}
					<footer className="mt-8 border-t pt-4 text-xs text-gray-400 print:mt-4 print:pt-2">
						<p>Forge CRM — Document confidentiel</p>
					</footer>
				</div>
			</body>
		</html>
	)
}
