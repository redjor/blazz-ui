// apps/docs/src/data/components/button.ts
import type { ComponentData } from "../types"

export const buttonData: ComponentData = {
	name: "Button",
	category: "ui",
	description: "Bouton d'action principal du design system.",
	docPath: "/docs/components/ui/button",
	imports: {
		path: "@blazz/ui/components/ui/button",
		named: ["Button"],
	},
	props: [
		{
			name: "variant",
			type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
			default: '"default"',
			description: "Style visuel du bouton.",
		},
		{
			name: "size",
			type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
			default: '"default"',
			description: "Taille du bouton.",
		},
		{ name: "disabled", type: "boolean", default: "false", description: "Désactive le bouton." },
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Contenu du bouton.",
		},
	],
	gotchas: [
		"Always add type='button' on non-submit buttons inside forms — prevents accidental form submission",
		"For icon-only buttons use size='icon' and add a Tooltip for accessibility",
		"Loading state: use disabled + a Spinner inside children, not a separate loading prop",
	],
	canonicalExample: `<Button variant="default" onClick={handleAction}>Save</Button>
<Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
<Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>`,
}
