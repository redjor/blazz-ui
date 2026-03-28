"use client"

import type { TestAccount } from "@blazz/quick-login"
import { QuickAccountSelector } from "@blazz/quick-login"
import { useState } from "react"

const DEMO_ACCOUNTS: TestAccount[] = [
	{
		label: "Admin",
		username: "admin",
		password: "Admin1234!",
		group: "Admin",
		description: "Full access",
	},
	{
		label: "Manager",
		username: "manager",
		password: "Test1234!",
		group: "Users",
		subgroup: "Management",
		description: "Can view all resources",
	},
	{
		label: "Viewer",
		username: "viewer",
		password: "Test1234!",
		group: "Users",
		subgroup: "Read-only",
		description: "Read-only access",
	},
]

export function QuickLoginDemo({ position }: { position?: "top-right" | "bottom-right" }) {
	const [selected, setSelected] = useState<string | null>(null)
	const pos = position ?? "top-right"

	return (
		<div className="relative w-full min-h-24 flex items-center justify-center">
			<QuickAccountSelector
				accounts={DEMO_ACCOUNTS}
				onAccountSelect={(username) => setSelected(username)}
				forceShow
				position={pos}
				sheetSide="right"
				triggerClassName={`absolute z-10 ${pos === "bottom-right" ? "right-0 bottom-0" : "right-0 top-0"}`}
			/>
			<p className="text-sm text-fg-muted">
				{selected ? (
					<>
						Connected as <code className="text-fg font-mono text-xs bg-card px-1.5 py-0.5 rounded border border-edge">{selected}</code>
					</>
				) : (
					"Click the button to select a test account"
				)}
			</p>
		</div>
	)
}
