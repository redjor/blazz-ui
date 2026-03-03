// apps/docs/src/data/components/detail-panel.ts
import type { ComponentData } from "../types"

export const detailPanelData: ComponentData = {
	name: "DetailPanel",
	category: "blocks",
	description: "Panneau de détail d'une entité avec sections, propriétés et tabs.",
	docPath: "/docs/components/blocks/detail-panel",
	imports: {
		path: "@blazz/ui/components/blocks/detail-panel",
		named: ["DetailPanel", "DetailPanelSection", "DetailPanelProperty"],
	},
	props: [
		{ name: "title", type: "string", required: true, description: "Titre de l'entité." },
		{ name: "subtitle", type: "string", description: "Sous-titre (statut, rôle, etc.)." },
		{ name: "actions", type: "React.ReactNode", description: "Actions (Edit, Delete, etc.)." },
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Sections et contenu.",
		},
	],
	gotchas: [
		"Use DetailPanelSection to group properties — not raw divs",
		"Missing values display '—' (em dash), never empty string",
		"For tabbed detail views, wrap DetailPanel children in Tabs from @blazz/ui/components/ui/tabs — DetailPanel does not include tabs itself",
	],
	canonicalExample: `<DetailPanel
  title={contact.name}
  subtitle={contact.role}
  actions={<Button size="sm" variant="outline">Edit</Button>}
>
  <DetailPanelSection title="Contact Info">
    <DetailPanelProperty label="Email" value={contact.email} />
    <DetailPanelProperty label="Phone" value={contact.phone ?? "—"} />
  </DetailPanelSection>
</DetailPanel>`,
}
