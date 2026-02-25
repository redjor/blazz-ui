"use client"

import * as React from "react"
import { TreeView } from "@blazz/ui/components/ui/tree-view"
import type { TreeNode } from "@blazz/ui/components/ui/tree-view"

const fileTree: TreeNode[] = [
	{
		id: "src",
		label: "src",
		children: [
			{
				id: "components",
				label: "components",
				children: [
					{ id: "button.tsx", label: "button.tsx" },
					{ id: "input.tsx", label: "input.tsx" },
					{ id: "dialog.tsx", label: "dialog.tsx" },
				],
			},
			{
				id: "lib",
				label: "lib",
				children: [
					{ id: "utils.ts", label: "utils.ts" },
					{ id: "api.ts", label: "api.ts" },
				],
			},
			{ id: "app.tsx", label: "app.tsx" },
			{ id: "index.tsx", label: "index.tsx" },
		],
	},
	{ id: "package.json", label: "package.json" },
	{ id: "tsconfig.json", label: "tsconfig.json" },
]

export function ControlledTreeDemo() {
	const [selected, setSelected] = React.useState<string[]>([])

	return (
		<div className="space-y-3">
			<TreeView
				data={fileTree}
				selected={selected}
				onSelect={setSelected}
				className="max-w-xs"
			/>
			<p className="text-xs text-fg-muted">
				Selected: {selected.length > 0 ? selected.join(", ") : "none"}
			</p>
		</div>
	)
}
