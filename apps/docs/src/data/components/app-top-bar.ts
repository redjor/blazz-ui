// apps/docs/src/data/components/app-top-bar.ts
import type { ComponentData } from "../types"

export const appTopBarData: ComponentData = {
	name: "AppTopBar",
	category: "patterns",
	description: "Barre de navigation supérieure — généralement incluse via AppFrame.",
	docPath: "/docs/components/patterns/app-top-bar",
	imports: {
		path: "@blazz/ui/components/patterns/app-top-bar",
		named: ["AppTopBar"],
	},
	props: [
		{
			name: "children",
			type: "React.ReactNode",
			description: "Contenu additionnel dans la top bar.",
		},
	],
	gotchas: ["Prefer AppFrame over AppTopBar directly — AppFrame includes the top bar"],
	canonicalExample: `// Use AppFrame instead:
<AppFrame topBarContent={<ThemeToggle />}>{children}</AppFrame>`,
}
