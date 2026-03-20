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
		"src and alt go on AvatarImage, fallback text goes as children of AvatarFallback — no props on Avatar root",
	],
	canonicalExample: `<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
</Avatar>`,
}
