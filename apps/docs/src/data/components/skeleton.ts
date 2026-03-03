// apps/docs/src/data/components/skeleton.ts
import type { ComponentData } from "../types"

export const skeletonData: ComponentData = {
	name: "Skeleton",
	category: "ui",
	description: "Placeholder animé pour les états de chargement.",
	docPath: "/docs/components/ui/skeleton",
	imports: {
		path: "@blazz/ui/components/ui/skeleton",
		named: ["Skeleton"],
	},
	props: [
		{
			name: "className",
			type: "string",
			description: "Classes Tailwind pour dimensionner le skeleton (w-*, h-*, rounded-*).",
		},
	],
	gotchas: [
		"Always mirror the real content structure — a skeleton row should look like a real row",
		"Use rounded-full for circular skeletons (avatars), rounded-md for rectangular",
		"Never show a single generic spinner — skeleton must match the layout of the loading content",
	],
	canonicalExample: `{/* Loading state mirrors real content */}
<div className="flex items-center gap-3">
  <Skeleton className="size-8 rounded-full" />
  <div className="space-y-1.5">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-24" />
  </div>
</div>`,
}
