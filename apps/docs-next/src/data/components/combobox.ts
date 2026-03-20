// apps/docs/src/data/components/combobox.ts
import type { ComponentData } from "../types"

export const comboboxData: ComponentData = {
	name: "Combobox",
	category: "ui",
	description: "Select avec recherche/filtrage. Remplace Select pour les listes longues.",
	docPath: "/docs/components/ui/combobox",
	imports: {
		path: "@blazz/ui/components/ui/combobox",
		named: ["Combobox"],
	},
	props: [
		{ name: "value", type: "string", description: "Valeur sélectionnée contrôlée." },
		{
			name: "onValueChange",
			type: "(value: string) => void",
			description: "Callback à la sélection.",
		},
		{
			name: "options",
			type: "Array<{ value: string; label: string; description?: string; avatar?: string; icon?: ReactNode }>",
			required: true,
			description: "Options disponibles.",
		},
		{
			name: "placeholder",
			type: "string",
			default: '"Select..."',
			description: "Placeholder du trigger.",
		},
		{
			name: "searchPlaceholder",
			type: "string",
			default: '"Search..."',
			description: "Placeholder de la recherche.",
		},
		{
			name: "searchable",
			type: "boolean",
			default: "true",
			description: "Active/désactive la recherche.",
		},
	],
	gotchas: [
		"Use Combobox (not Select) when list > 10 items or user needs search",
		"options prop is required — different from Select which uses items",
		"options.avatar: URL string for user avatars. options.icon: ReactNode for icons",
	],
	canonicalExample: `<Combobox
  value={assigneeId}
  onValueChange={setAssigneeId}
  options={users.map(u => ({ value: u.id, label: u.name, avatar: u.avatarUrl }))}
  placeholder="Assign to..."
  searchPlaceholder="Search users..."
/>`,
}
