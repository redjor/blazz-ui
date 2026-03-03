// apps/docs/src/data/components/page-header-shell.ts
import type { ComponentData } from "../types"

export const pageHeaderShellData: ComponentData = {
	name: "PageHeaderShell",
	category: "patterns",
	description: "Header de page standardisé avec titre, breadcrumb, et slot d'actions.",
	docPath: "/docs/components/patterns/page-header-shell",
	imports: {
		path: "@blazz/ui/components/patterns/page-header-shell",
		named: ["PageHeaderShell"],
	},
	props: [
		{ name: "title", type: "string", required: true, description: "Titre de la page." },
		{ name: "description", type: "string", description: "Sous-titre ou description." },
		{ name: "actions", type: "React.ReactNode", description: "Boutons d'action (top-right)." },
		{ name: "breadcrumb", type: "React.ReactNode", description: "Fil d'Ariane." },
	],
	gotchas: [
		"Primary action goes in actions prop (top-right), always a Button variant='default'",
		"Use at the top of every resource page — not inside cards",
	],
	canonicalExample: `<PageHeaderShell
  title="Contacts"
  description="2 847 contacts"
  actions={
    <Button onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" /> New Contact
    </Button>
  }
/>`,
}
