// apps/docs/src/data/components/avatar.ts
import type { ComponentData } from "../types"

export const avatarData: ComponentData = {
	name: "Avatar",
	category: "ui",
	description: "Avatar utilisateur avec image et fallback initiales.",
	docPath: "/docs/components/ui/avatar",
	imports: {
		path: "@blazz/ui/components/ui/avatar",
		named: ["Avatar", "AvatarImage", "AvatarFallback", "AvatarGroup"],
	},
	props: [
		{ name: "src", type: "string", description: "URL de l'image (passé à AvatarImage)." },
		{
			name: "fallback",
			type: "string",
			description: "Texte de fallback si l'image ne charge pas (ex: 'JD').",
		},
		{
			name: "size",
			type: '"xs" | "sm" | "default" | "lg" | "xl"',
			default: '"default"',
			description: "Taille de l'avatar.",
		},
	],
	gotchas: [
		"Always provide AvatarFallback with 2-letter initials — image loading can fail",
		"For stacked avatars use AvatarGroup with max prop",
	],
	canonicalExample: `<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
</Avatar>`,
}
