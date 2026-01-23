"use client"

import { createContext, useContext, useMemo } from "react"

/**
 * Pagination configuration defaults
 */
export interface PaginationDefaults {
	/** Default number of rows per page */
	defaultPageSize: number
	/** Available page size options in dropdown */
	pageSizeOptions: number[]
	/** Show page info text ("Showing X-Y of Z") */
	showPageInfo: boolean
}

/**
 * Performance configuration defaults
 */
export interface PerformanceDefaults {
	/** Debounce delay for search input (ms) */
	searchDebounceMs: number
	/** Enable virtualization for large datasets */
	enableVirtualization: boolean
	/** Number of rows threshold to enable virtualization */
	virtualizeThreshold: number
}

/**
 * UI configuration defaults
 */
export interface UIDefaults {
	/** Default table variant */
	defaultVariant: "default" | "lined" | "striped"
	/** Default table density */
	defaultDensity: "compact" | "default" | "comfortable"
	/** Message shown when no data available */
	emptyStateMessage: string
	/** Message shown during loading */
	loadingMessage: string
}

/**
 * Internationalization configuration defaults
 */
export interface I18nDefaults {
	/** Default locale for the table */
	defaultLocale: "fr" | "en" | "es" | "de" | "it" | "pt"
	/** List of supported locales */
	supportedLocales: string[]
}

/**
 * Feature toggles configuration
 */
export interface FeatureDefaults {
	/** Enable sorting by default */
	enableSortingByDefault: boolean
	/** Enable pagination by default */
	enablePaginationByDefault: boolean
	/** Enable row selection by default */
	enableRowSelectionByDefault: boolean
	/** Enable global search by default */
	enableGlobalSearchByDefault: boolean
	/** Enable advanced filters by default */
	enableAdvancedFiltersByDefault: boolean
}

/**
 * Complete DataTable default configuration
 *
 * @example
 * ```typescript
 * const customConfig: DataTableDefaultConfig = {
 *   pagination: {
 *     defaultPageSize: 50,
 *     pageSizeOptions: [25, 50, 100, 250],
 *     showPageInfo: true,
 *   },
 *   performance: {
 *     searchDebounceMs: 500,
 *     enableVirtualization: true,
 *     virtualizeThreshold: 500,
 *   },
 *   // ... other settings
 * }
 * ```
 */
export interface DataTableDefaultConfig {
	pagination: PaginationDefaults
	performance: PerformanceDefaults
	ui: UIDefaults
	i18n: I18nDefaults
	features: FeatureDefaults
}

/**
 * Default configuration for DataTable
 * These values are used when no override is provided
 */
export const DEFAULT_DATA_TABLE_CONFIG: DataTableDefaultConfig = {
	pagination: {
		defaultPageSize: 25,
		pageSizeOptions: [10, 25, 50, 100],
		showPageInfo: true,
	},
	performance: {
		searchDebounceMs: 300,
		enableVirtualization: false,
		virtualizeThreshold: 1000,
	},
	ui: {
		defaultVariant: "lined",
		defaultDensity: "default",
		emptyStateMessage: "No data available",
		loadingMessage: "Loading...",
	},
	i18n: {
		defaultLocale: "fr",
		supportedLocales: ["fr", "en", "es", "de", "it", "pt"],
	},
	features: {
		enableSortingByDefault: true,
		enablePaginationByDefault: true,
		enableRowSelectionByDefault: false,
		enableGlobalSearchByDefault: true,
		enableAdvancedFiltersByDefault: false,
	},
}

/**
 * React Context for DataTable configuration
 */
export const DataTableConfigContext = createContext<DataTableDefaultConfig>(
	DEFAULT_DATA_TABLE_CONFIG
)

/**
 * Hook to access DataTable configuration
 *
 * @example
 * ```typescript
 * function MyTable() {
 *   const config = useDataTableConfig()
 *   const pageSize = config.pagination.defaultPageSize
 *   // ...
 * }
 * ```
 */
export function useDataTableConfig(): DataTableDefaultConfig {
	const context = useContext(DataTableConfigContext)
	if (!context) {
		// Fallback to default config if not wrapped in provider
		return DEFAULT_DATA_TABLE_CONFIG
	}
	return context
}

/**
 * Deep merge utility for configuration objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
	const output: any = { ...target }

	for (const key in source) {
		if (source[key] !== undefined) {
			if (
				typeof source[key] === "object" &&
				!Array.isArray(source[key]) &&
				source[key] !== null
			) {
				output[key] = deepMerge(target[key] || {}, source[key] as any)
			} else {
				output[key] = source[key]
			}
		}
	}

	return output as T
}

/**
 * Props for DataTableConfigProvider
 */
export interface DataTableConfigProviderProps {
	/** Partial configuration to override defaults */
	config?: Partial<DataTableDefaultConfig>
	/** Child components */
	children: React.ReactNode
}

/**
 * Provider component for DataTable configuration
 *
 * Wrap your app or specific pages with this provider to customize
 * DataTable behavior globally or for a specific section.
 *
 * @example
 * ```typescript
 * // Global config in layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <DataTableConfigProvider
 *       config={{
 *         pagination: {
 *           defaultPageSize: 50,
 *           pageSizeOptions: [25, 50, 100, 250],
 *         },
 *         performance: {
 *           searchDebounceMs: 500,
 *         },
 *       }}
 *     >
 *       {children}
 *     </DataTableConfigProvider>
 *   )
 * }
 *
 * // Override for specific page
 * export default function ProductsPage() {
 *   return (
 *     <DataTableConfigProvider
 *       config={{
 *         pagination: {
 *           defaultPageSize: 15,
 *         },
 *       }}
 *     >
 *       <DataTable data={products} columns={columns} />
 *     </DataTableConfigProvider>
 *   )
 * }
 * ```
 */
export function DataTableConfigProvider({
	config,
	children,
}: DataTableConfigProviderProps) {
	const mergedConfig = useMemo(() => {
		if (!config) return DEFAULT_DATA_TABLE_CONFIG
		return deepMerge(DEFAULT_DATA_TABLE_CONFIG, config)
	}, [config])

	return (
		<DataTableConfigContext.Provider value={mergedConfig}>
			{children}
		</DataTableConfigContext.Provider>
	)
}
