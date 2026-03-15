// apps/docs/src/data/components/detail-panel.ts
import type { ComponentData } from "../types"

export const detailPanelData: ComponentData = {
	name: "DetailPanel",
	category: "blocks",
	description:
		"Panneau de détail d'une entité composé via sous-composants Header et Section. Architecture compound component.",
	docPath: "/docs/blocks/detail-panel",
	imports: {
		path: "@blazz/pro/components/blocks/detail-panel",
		named: ["DetailPanel"],
	},
	props: [
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Contenu du panneau — typiquement DetailPanel.Header + DetailPanel.Section(s).",
		},
		{
			name: "className",
			type: "string",
			description: "Classe CSS additionnelle sur le conteneur racine.",
		},
		{
			name: "DetailPanel.Header — title",
			type: "string",
			required: true,
			description: "Titre de l'entité affichée dans le header.",
		},
		{
			name: "DetailPanel.Header — subtitle",
			type: "string",
			description: "Sous-titre optionnel (statut, rôle, etc.).",
		},
		{
			name: "DetailPanel.Header — status",
			type: "React.ReactNode",
			description: "Badge ou indicateur de statut affiché à côté du titre.",
		},
		{
			name: "DetailPanel.Header — actions",
			type: "DetailPanelAction[]",
			description:
				"Actions du header. Chaque action: { label, onClick, icon?, variant? }. variant accepte 'default' | 'outline' | 'ghost' | 'destructive'.",
		},
		{
			name: "DetailPanel.Section — title",
			type: "string",
			required: true,
			description: "Titre de la section.",
		},
		{
			name: "DetailPanel.Section — description",
			type: "string",
			description: "Description optionnelle sous le titre de section.",
		},
		{
			name: "DetailPanel.Section — children",
			type: "React.ReactNode",
			required: true,
			description: "Contenu de la section (champs, listes, etc.).",
		},
	],
	gotchas: [
		"DetailPanel is a compound component — always use DetailPanel.Header and DetailPanel.Section, never pass title/subtitle/actions directly on <DetailPanel>",
		"DetailPanelProperty does not exist — render field values as plain JSX (dl/dt/dd or custom layout) inside DetailPanel.Section",
		"actions on DetailPanel.Header accepts DetailPanelAction[] (array of objects), not React.ReactNode",
		"Missing values should display '—' (em dash), never empty string",
		"For tabbed detail views, wrap DetailPanel children in Tabs from @blazz/ui/components/ui/tabs — DetailPanel does not include tabs itself",
	],
	canonicalExample: `import { Pencil, Trash2 } from "lucide-react"

<DetailPanel>
  <DetailPanel.Header
    title={contact.name}
    subtitle={contact.role}
    status={<Badge variant="success">Active</Badge>}
    actions={[
      { label: "Edit", icon: Pencil, variant: "outline", onClick: () => openEdit() },
      { label: "Delete", icon: Trash2, variant: "destructive", onClick: () => handleDelete() },
    ]}
  />
  <DetailPanel.Section title="Contact Info">
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt className="text-fg-muted">Email</dt>
      <dd>{contact.email}</dd>
      <dt className="text-fg-muted">Phone</dt>
      <dd>{contact.phone ?? "—"}</dd>
    </dl>
  </DetailPanel.Section>
  <DetailPanel.Section title="Company" description="Organisation associée">
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt className="text-fg-muted">Name</dt>
      <dd>{contact.company ?? "—"}</dd>
    </dl>
  </DetailPanel.Section>
</DetailPanel>`,
}
