// apps/docs/src/data/components/data-table.ts
import type { ComponentData } from "../types"

export const dataTableData: ComponentData = {
	name: "DataTable",
	category: "blocks",
	description: "Table de données avancée avec tri, filtrage, pagination, sélection et actions bulk.",
	docPath: "/docs/blocks/data-table",
	imports: {
		path: "@blazz/pro/components/blocks/data-table",
		named: ["DataTable", "col"],
	},
	props: [
		{ name: "data", type: "T[]", required: true, description: "Tableau de données à afficher." },
		{
			name: "columns",
			type: "DataTableColumnDef<T>[]",
			required: true,
			description: "Définitions des colonnes (via col() factory ou DataTableColumnDef directement).",
		},
		{
			name: "onRowClick",
			type: "(row: T) => void",
			description: "Callback au clic sur une ligne.",
		},
		{
			name: "getRowId",
			type: "(row: T) => string",
			description: "Fonction pour obtenir l'ID unique d'une ligne.",
		},
		{
			name: "loading",
			type: "boolean",
			default: "false",
			description: "Affiche le skeleton de chargement.",
		},
	],
	gotchas: [
		"Import from @blazz/pro/components/blocks/data-table — not from @blazz/ui",
		"Use col() factory for column definitions — not raw ColumnDef from TanStack Table",
		"For preset tables (CRM, StockBase) use createCompaniesPreset/createContactsPreset etc.",
		"getRowId is required for row selection to work correctly",
	],
	canonicalExample: `import { DataTable, col } from "@blazz/pro/components/blocks/data-table"

const columns = [
  col.text("name", { header: "Name", cell: (row) => row.name }),
  col.badge("status", { header: "Status", cell: (row) => row.status }),
  col.actions([
    { label: "Edit", onClick: (row) => handleEdit(row) },
    { label: "Delete", onClick: (row) => handleDelete(row), destructive: true },
  ]),
]

<DataTable
  data={contacts}
  columns={columns}
  getRowId={(row) => row.id}
  onRowClick={(row) => navigate(\`/contacts/\${row.id}\`)}
/>`,
}
