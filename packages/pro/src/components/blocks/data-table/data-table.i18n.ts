/**
 * Internationalization (i18n) support for DataTable
 *
 * Provides translations for all user-facing text in the DataTable component.
 * Supports French (fr) and English (en).
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
	filterWith: string
	noMoreFilters: string
	clearFilter: string

	// Sorting
	sortBy: string
	ascending: string
	descending: string
	clearSorting: string
	sortAscending: string
	sortDescending: string

	// Selection
	rowsSelected: (count: number) => string
	selectedCount: (count: number) => string
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
	export: string
	import: string

	// Views
	views: string
	allItems: string
	moreViews: string
	createView: string
	saveView: string
	deleteView: string

	// View management
	save: string
	duplicate: string
	rename: string
	delete: string

	// Filter builder
	advancedFilters: string
	advancedFiltersDesc: string
	matchRows: string
	allConditions: string
	anyCondition: string
	followingConditions: string
	enterValue: string
	removeCondition: string
	addCondition: string
	noFilterableColumns: string
	applyFilters: string

	// Pagination (extended)
	goToFirstPage: string
	goToPreviousPage: string
	goToNextPage: string
	goToLastPage: string
	pageOf: (current: number, total: number) => string
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
		filterWith: "avec:",
		noMoreFilters: "Aucun filtre disponible",
		clearFilter: "Effacer le filtre",

		// Sorting
		sortBy: "Trier par",
		ascending: "Croissant",
		descending: "Décroissant",
		clearSorting: "Effacer le tri",
		sortAscending: "Du plus ancien au plus récent",
		sortDescending: "Du plus récent au plus ancien",

		// Selection
		rowsSelected: (count) =>
			`${count} ${count === 1 ? "ligne sélectionnée" : "lignes sélectionnées"}`,
		selectedCount: (count) => `${count} sélectionné${count > 1 ? "s" : ""}`,
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
		export: "Exporter",
		import: "Importer",

		// Views
		views: "Vues",
		allItems: "Tous les éléments",
		moreViews: "Plus de vues",
		createView: "Créer une vue",
		saveView: "Enregistrer la vue",
		deleteView: "Supprimer la vue",

		// View management
		save: "Enregistrer",
		duplicate: "Dupliquer",
		rename: "Renommer",
		delete: "Supprimer",

		// Filter builder
		advancedFilters: "Filtres avancés",
		advancedFiltersDesc: "Créer des filtres complexes avec logique ET/OU",
		matchRows: "Les lignes correspondant à",
		allConditions: "toutes",
		anyCondition: "au moins une",
		followingConditions: "des conditions suivantes :",
		enterValue: "Saisir une valeur...",
		removeCondition: "Supprimer la condition",
		addCondition: "Ajouter une condition",
		noFilterableColumns: "Aucune colonne filtrable",
		applyFilters: "Appliquer",

		// Pagination (extended)
		goToFirstPage: "Première page",
		goToPreviousPage: "Page précédente",
		goToNextPage: "Page suivante",
		goToLastPage: "Dernière page",
		pageOf: (current, total) => `Page ${current} sur ${total}`,
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
		filterWith: "with:",
		noMoreFilters: "No more filters",
		clearFilter: "Clear filter",

		// Sorting
		sortBy: "Sort by",
		ascending: "Ascending",
		descending: "Descending",
		clearSorting: "Clear sorting",
		sortAscending: "From oldest to most recent",
		sortDescending: "From most recent to oldest",

		// Selection
		rowsSelected: (count) => `${count} ${count === 1 ? "row selected" : "rows selected"}`,
		selectedCount: (count) => `${count} selected`,
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
		export: "Export",
		import: "Import",

		// Views
		views: "Views",
		allItems: "All items",
		moreViews: "More views",
		createView: "Create view",
		saveView: "Save view",
		deleteView: "Delete view",

		// View management
		save: "Save",
		duplicate: "Duplicate",
		rename: "Rename",
		delete: "Delete",

		// Filter builder
		advancedFilters: "Advanced Filters",
		advancedFiltersDesc: "Create complex filters with AND/OR logic",
		matchRows: "Match rows that satisfy",
		allConditions: "all",
		anyCondition: "any",
		followingConditions: "of the following conditions:",
		enterValue: "Enter value...",
		removeCondition: "Remove condition",
		addCondition: "Add Condition",
		noFilterableColumns: "No filterable columns",
		applyFilters: "Apply Filters",

		// Pagination (extended)
		goToFirstPage: "Go to first page",
		goToPreviousPage: "Go to previous page",
		goToNextPage: "Go to next page",
		goToLastPage: "Go to last page",
		pageOf: (current, total) => `Page ${current} of ${total}`,
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
