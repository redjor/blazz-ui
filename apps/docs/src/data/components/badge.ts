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
			type: '"default" | "secondary" | "outline" | "success" | "warning" | "critical" | "info"',
			default: '"default"',
			description: "Style sémantique du badge.",
		},
		{
			name: "fill",
			type: '"solid" | "subtle" | "ghost" | "ghost-dot"',
			default: '"solid"',
			description:
				"Niveau de remplissage. solid = fond plein, subtle = fond léger + border, ghost = texte coloré uniquement, ghost-dot = dot coloré + texte neutre.",
		},
		{
			name: "size",
			type: '"xs" | "sm" | "md"',
			default: '"sm"',
			description: "Taille du badge.",
		},
		{
			name: "dot",
			type: "boolean",
			default: "false",
			description: "Affiche un dot de statut avant le texte.",
		},
		{
			name: "onDismiss",
			type: "() => void",
			description: "Ajoute un bouton × pour supprimer le badge.",
		},
		{ name: "children", type: "React.ReactNode", required: true, description: "Contenu du badge." },
	],
	gotchas: [
		"For status dots use variant='success'|'warning'|'critical'|'info' — not custom colors",
		"Never use color alone to convey status — pair with text (e.g. '● Active' not just a colored dot)",
		"fill='ghost' renders text-only (colored) — ideal for inline status in dense tables",
		"fill='ghost-dot' renders a colored dot + neutral text — maximum Tufte data-ink ratio",
	],
	canonicalExample: `// Solid (default)
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="critical">Overdue</Badge>

// Ghost — colored text, no background
<Badge variant="success" fill="ghost">Active</Badge>

// Ghost-dot — colored dot, neutral text (Tufte style)
<Badge variant="success" fill="ghost-dot" dot>Active</Badge>
<Badge variant="critical" fill="ghost-dot" dot>Overdue</Badge>`,
}
