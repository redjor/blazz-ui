// apps/docs/src/data/components/badge.ts
import type { ComponentData } from "../types"

export const badgeData: ComponentData = {
	name: "Badge",
	category: "ui",
	description: "Pastille de statut ou d'étiquette.",
	docPath: "/docs/components/ui/badge",
	imports: {
		path: "@blazz/ui/components/ui/badge",
		named: ["Badge"],
	},
	props: [
		{
			name: "variant",
			type: '"default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "info"',
			default: '"default"',
			description: "Style sémantique du badge.",
		},
		{ name: "children", type: "React.ReactNode", required: true, description: "Contenu du badge." },
	],
	gotchas: [
		"For status dots use variant='success'|'warning'|'destructive'|'info' — not custom colors",
		"Never use color alone to convey status — pair with text (e.g. '● Active' not just a colored dot)",
	],
	canonicalExample: `<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Overdue</Badge>`,
}
