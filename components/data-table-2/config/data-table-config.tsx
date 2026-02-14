'use client';

import { createContext, useContext, useMemo } from 'react';

/**
 * Pagination configuration defaults
 */
export interface PaginationDefaults {
  /** Default number of rows per page */
  defaultPageSize: number;
  /** Available page size options in dropdown */
  pageSizeOptions: number[];
  /** Show page info text ("Showing X-Y of Z") */
  showPageInfo: boolean;
}

/**
 * Performance configuration defaults
 */
export interface PerformanceDefaults {
  /** Debounce delay for search input (ms) */
  searchDebounceMs: number;
}

/**
 * UI configuration defaults
 */
export interface UIDefaults {
  /** Default table variant */
  defaultVariant: 'default' | 'lined' | 'striped' | 'editable';
  /** Default table density */
  defaultDensity: 'compact' | 'default' | 'comfortable';
}

/**
 * Internationalization configuration defaults
 */
export interface I18nDefaults {
  /** Default locale for the table */
  defaultLocale: 'fr' | 'en';
}

/**
 * Complete DataTable default configuration
 */
export interface DataTableDefaultConfig {
  pagination: PaginationDefaults;
  performance: PerformanceDefaults;
  ui: UIDefaults;
  i18n: I18nDefaults;
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
  },
  ui: {
    defaultVariant: 'lined',
    defaultDensity: 'default',
  },
  i18n: {
    defaultLocale: 'fr',
  },
};

/**
 * React Context for DataTable configuration
 */
export const DataTableConfigContext =
  createContext<DataTableDefaultConfig>(DEFAULT_DATA_TABLE_CONFIG);

/**
 * Hook to access DataTable configuration
 */
export function useDataTableConfig(): DataTableDefaultConfig {
  const context = useContext(DataTableConfigContext);
  if (!context) {
    return DEFAULT_DATA_TABLE_CONFIG;
  }
  return context;
}

/**
 * Deep merge utility for configuration objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output: any = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        output[key] = deepMerge(target[key] || {}, source[key] as any);
      } else {
        output[key] = source[key];
      }
    }
  }

  return output as T;
}

/**
 * Props for DataTableConfigProvider
 */
export interface DataTableConfigProviderProps {
  /** Partial configuration to override defaults */
  config?: Partial<DataTableDefaultConfig>;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Provider component for DataTable configuration
 */
export function DataTableConfigProvider({ config, children }: DataTableConfigProviderProps) {
  const mergedConfig = useMemo(() => {
    if (!config) return DEFAULT_DATA_TABLE_CONFIG;
    return deepMerge(DEFAULT_DATA_TABLE_CONFIG, config);
  }, [config]);

  return (
    <DataTableConfigContext.Provider value={mergedConfig}>
      {children}
    </DataTableConfigContext.Provider>
  );
}
