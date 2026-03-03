// apps/docs/src/data/components/filter-bar.ts
import type { ComponentData } from "../types"

export const filterBarData: ComponentData = {
	name: "FilterBar",
	category: "blocks",
	description: "Barre de filtres pour les pages de liste — recherche + filtres actifs + reset.",
	docPath: "/docs/components/blocks/filter-bar",
	imports: {
		path: "@blazz/ui/components/blocks/filter-bar",
		named: ["FilterBar"],
	},
	props: [
		{ name: "search", type: "string", description: "Valeur de recherche contrôlée." },
		{ name: "onSearchChange", type: "(value: string) => void", description: "Callback recherche." },
		{
			name: "filters",
			type: "FilterConfig[]",
			description: "Configuration des filtres disponibles.",
		},
		{
			name: "activeFilters",
			type: "Record<string, string>",
			description: "Filtres actifs contrôlés.",
		},
		{
			name: "onFilterChange",
			type: "(filters: Record<string, string>) => void",
			description: "Callback filtres.",
		},
		{ name: "onReset", type: "() => void", description: "Callback reset tous les filtres." },
	],
	gotchas: [
		"FilterBar goes ABOVE the DataTable, outside of it — not inside",
		"Persist filters in URL searchParams for back-button support",
		"onReset should clear both search and all activeFilters",
	],
	canonicalExample: `<FilterBar
  search={search}
  onSearchChange={setSearch}
  activeFilters={filters}
  onFilterChange={setFilters}
  onReset={() => { setSearch(""); setFilters({}) }}
  filters={[
    { key: "status", label: "Status", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
  ]}
/>`,
}
