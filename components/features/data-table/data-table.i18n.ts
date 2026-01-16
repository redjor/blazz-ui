/**
 * Internationalization (i18n) support for DataTable
 *
 * Provides translations for all user-facing text in the DataTable component.
 * Currently supports French (fr) and English (en).
 *
 * @example
 * ```tsx
 * const t = useDataTableTranslations('fr')
 * console.log(t.search) // "Recherche..."
 * ```
 */

export type DataTableLocale = "fr" | "en"

export interface DataTableTranslations {
	// Search
	search: string
	searchPlaceholder: string
	cancel: string

	// Filters
	addFilter: string
	clearAll: string
	filters: string
	noFilters: string

	// Sorting
	sortBy: string
	ascending: string
	descending: string
	clearSorting: string
	sortAscending: string
	sortDescending: string

	// Selection
	rowsSelected: (count: number) => string
	selectAll: string
	deselectAll: string

	// Pagination
	rowsPerPage: string
	page: string
	of: string
	showing: (from: number, to: number, total: number) => string

	// Empty states
	noResults: string
	noData: string

	// Actions
	actions: string
	moreActions: string

	// Views
	views: string
	allItems: string
	createView: string
	saveView: string
	deleteView: string
}

export const dataTableTranslations: Record<DataTableLocale, DataTableTranslations> = {
	fr: {
		// Search
		search: "Recherche",
		searchPlaceholder: "Rechercher...",
		cancel: "Annuler",

		// Filters
		addFilter: "Ajouter un filtre",
		clearAll: "Tout effacer",
		filters: "Filtres",
		noFilters: "Aucun filtre",

		// Sorting
		sortBy: "Trier par",
		ascending: "Croissant",
		descending: "Décroissant",
		clearSorting: "Effacer le tri",
		sortAscending: "Du plus ancien au plus récent",
		sortDescending: "Du plus récent au plus ancien",

		// Selection
		rowsSelected: (count) => `${count} ${count === 1 ? "ligne sélectionnée" : "lignes sélectionnées"}`,
		selectAll: "Tout sélectionner",
		deselectAll: "Tout désélectionner",

		// Pagination
		rowsPerPage: "Lignes par page",
		page: "Page",
		of: "sur",
		showing: (from, to, total) => `Affichage de ${from} à ${to} sur ${total} résultats`,

		// Empty states
		noResults: "Aucun résultat",
		noData: "Aucune donnée disponible",

		// Actions
		actions: "Actions",
		moreActions: "Plus d'actions",

		// Views
		views: "Vues",
		allItems: "Tous les éléments",
		createView: "Créer une vue",
		saveView: "Enregistrer la vue",
		deleteView: "Supprimer la vue",
	},
	en: {
		// Search
		search: "Search",
		searchPlaceholder: "Search...",
		cancel: "Cancel",

		// Filters
		addFilter: "Add filter",
		clearAll: "Clear all",
		filters: "Filters",
		noFilters: "No filters",

		// Sorting
		sortBy: "Sort by",
		ascending: "Ascending",
		descending: "Descending",
		clearSorting: "Clear sorting",
		sortAscending: "From oldest to most recent",
		sortDescending: "From most recent to oldest",

		// Selection
		rowsSelected: (count) => `${count} ${count === 1 ? "row selected" : "rows selected"}`,
		selectAll: "Select all",
		deselectAll: "Deselect all",

		// Pagination
		rowsPerPage: "Rows per page",
		page: "Page",
		of: "of",
		showing: (from, to, total) => `Showing ${from} to ${to} of ${total} results`,

		// Empty states
		noResults: "No results found",
		noData: "No data available",

		// Actions
		actions: "Actions",
		moreActions: "More actions",

		// Views
		views: "Views",
		allItems: "All items",
		createView: "Create view",
		saveView: "Save view",
		deleteView: "Delete view",
	},
}

/**
 * Hook to get translations for the current locale
 *
 * @param locale - The locale to use (default: 'fr')
 * @returns Translation object for the specified locale
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const t = useDataTableTranslations('en')
 *   return <button>{t.search}</button>
 * }
 * ```
 */
export function useDataTableTranslations(locale: DataTableLocale = "fr"): DataTableTranslations {
	return dataTableTranslations[locale]
}

/**
 * Get translations without using a hook
 * Useful for non-component contexts
 *
 * @param locale - The locale to use (default: 'fr')
 * @returns Translation object for the specified locale
 */
export function getDataTableTranslations(locale: DataTableLocale = "fr"): DataTableTranslations {
	return dataTableTranslations[locale]
}
