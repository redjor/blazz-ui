/**
 * Extended internationalization (i18n) support for DataTable
 *
 * Adds support for Spanish (es), German (de), Italian (it), and Portuguese (pt)
 * to complement the existing French and English translations.
 *
 * @example
 * ```tsx
 * const t = useDataTableTranslations('es')
 * console.log(t.search) // "Búsqueda"
 * ```
 */

import type { DataTableTranslations } from "../data-table.i18n"

/**
 * Spanish (Español) translations for DataTable
 */
export const spanishTranslations: DataTableTranslations = {
	// Search
	search: "Búsqueda",
	searchPlaceholder: "Buscar...",
	cancel: "Cancelar",

	// Filters
	addFilter: "Añadir filtro",
	clearAll: "Limpiar todo",
	filters: "Filtros",
	noFilters: "Sin filtros",
	filterWith: "con:",
	noMoreFilters: "No hay más filtros disponibles",
	clearFilter: "Limpiar filtro",

	// Sorting
	sortBy: "Ordenar por",
	ascending: "Ascendente",
	descending: "Descendente",
	clearSorting: "Limpiar ordenamiento",
	sortAscending: "Del más antiguo al más reciente",
	sortDescending: "Del más reciente al más antiguo",

	// Selection
	rowsSelected: (count) => `${count} ${count === 1 ? "fila seleccionada" : "filas seleccionadas"}`,
	selectedCount: (count) => `${count} seleccionado${count > 1 ? "s" : ""}`,
	selectAll: "Seleccionar todo",
	deselectAll: "Deseleccionar todo",

	// Pagination
	rowsPerPage: "Filas por página",
	page: "Página",
	of: "de",
	showing: (from, to, total) => `Mostrando de ${from} a ${to} de ${total} resultados`,

	// Empty states
	noResults: "No se encontraron resultados",
	noData: "Sin datos",

	// Actions
	actions: "Acciones",
	moreActions: "Más acciones",
	export: "Exportar",
	import: "Importar",

	// Views
	views: "Vistas",
	allItems: "Todos los elementos",
	createView: "Crear vista",
	saveView: "Guardar vista",
	deleteView: "Eliminar vista",
}

/**
 * German (Deutsch) translations for DataTable
 */
export const germanTranslations: DataTableTranslations = {
	// Search
	search: "Suche",
	searchPlaceholder: "Suchen...",
	cancel: "Abbrechen",

	// Filters
	addFilter: "Filter hinzufügen",
	clearAll: "Alle löschen",
	filters: "Filter",
	noFilters: "Keine Filter",
	filterWith: "mit:",
	noMoreFilters: "Keine weiteren Filter verfügbar",
	clearFilter: "Filter löschen",

	// Sorting
	sortBy: "Sortieren nach",
	ascending: "Aufsteigend",
	descending: "Absteigend",
	clearSorting: "Sortierung löschen",
	sortAscending: "Vom ältesten zum neuesten",
	sortDescending: "Vom neuesten zum ältesten",

	// Selection
	rowsSelected: (count) => `${count} ${count === 1 ? "Zeile ausgewählt" : "Zeilen ausgewählt"}`,
	selectedCount: (count) => `${count} ausgewählt`,
	selectAll: "Alle auswählen",
	deselectAll: "Alle abwählen",

	// Pagination
	rowsPerPage: "Zeilen pro Seite",
	page: "Seite",
	of: "von",
	showing: (from, to, total) => `Anzeige von ${from} bis ${to} von ${total} Ergebnissen`,

	// Empty states
	noResults: "Keine Ergebnisse gefunden",
	noData: "Keine Daten",

	// Actions
	actions: "Aktionen",
	moreActions: "Weitere Aktionen",
	export: "Exportieren",
	import: "Importieren",

	// Views
	views: "Ansichten",
	allItems: "Alle Elemente",
	createView: "Ansicht erstellen",
	saveView: "Ansicht speichern",
	deleteView: "Ansicht löschen",
}

/**
 * Italian (Italiano) translations for DataTable
 */
export const italianTranslations: DataTableTranslations = {
	// Search
	search: "Ricerca",
	searchPlaceholder: "Cerca...",
	cancel: "Annulla",

	// Filters
	addFilter: "Aggiungi filtro",
	clearAll: "Cancella tutto",
	filters: "Filtri",
	noFilters: "Nessun filtro",
	filterWith: "con:",
	noMoreFilters: "Nessun altro filtro disponibile",
	clearFilter: "Cancella filtro",

	// Sorting
	sortBy: "Ordina per",
	ascending: "Crescente",
	descending: "Decrescente",
	clearSorting: "Cancella ordinamento",
	sortAscending: "Dal più vecchio al più recente",
	sortDescending: "Dal più recente al più vecchio",

	// Selection
	rowsSelected: (count) => `${count} ${count === 1 ? "riga selezionata" : "righe selezionate"}`,
	selectedCount: (count) => `${count} selezionat${count > 1 ? "e" : "a"}`,
	selectAll: "Seleziona tutto",
	deselectAll: "Deseleziona tutto",

	// Pagination
	rowsPerPage: "Righe per pagina",
	page: "Pagina",
	of: "di",
	showing: (from, to, total) => `Visualizzazione da ${from} a ${to} di ${total} risultati`,

	// Empty states
	noResults: "Nessun risultato trovato",
	noData: "Nessun dato",

	// Actions
	actions: "Azioni",
	moreActions: "Altre azioni",
	export: "Esportare",
	import: "Importare",

	// Views
	views: "Viste",
	allItems: "Tutti gli elementi",
	createView: "Crea vista",
	saveView: "Salva vista",
	deleteView: "Elimina vista",
}

/**
 * Portuguese (Português) translations for DataTable
 */
export const portugueseTranslations: DataTableTranslations = {
	// Search
	search: "Pesquisa",
	searchPlaceholder: "Pesquisar...",
	cancel: "Cancelar",

	// Filters
	addFilter: "Adicionar filtro",
	clearAll: "Limpar tudo",
	filters: "Filtros",
	noFilters: "Sem filtros",
	filterWith: "com:",
	noMoreFilters: "Não há mais filtros disponíveis",
	clearFilter: "Limpar filtro",

	// Sorting
	sortBy: "Ordenar por",
	ascending: "Ascendente",
	descending: "Descendente",
	clearSorting: "Limpar ordenação",
	sortAscending: "Do mais antigo ao mais recente",
	sortDescending: "Do mais recente ao mais antigo",

	// Selection
	rowsSelected: (count) => `${count} ${count === 1 ? "linha selecionada" : "linhas selecionadas"}`,
	selectedCount: (count) => `${count} selecionado${count > 1 ? "s" : ""}`,
	selectAll: "Selecionar tudo",
	deselectAll: "Desselecionar tudo",

	// Pagination
	rowsPerPage: "Linhas por página",
	page: "Página",
	of: "de",
	showing: (from, to, total) => `Exibindo de ${from} a ${to} de ${total} resultados`,

	// Empty states
	noResults: "Nenhum resultado encontrado",
	noData: "Sem dados",

	// Actions
	actions: "Ações",
	moreActions: "Mais ações",
	export: "Exportar",
	import: "Importar",

	// Views
	views: "Visualizações",
	allItems: "Todos os itens",
	createView: "Criar visualização",
	saveView: "Salvar visualização",
	deleteView: "Excluir visualização",
}
