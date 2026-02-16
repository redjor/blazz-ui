import type { DataTableProps } from '../data-table.types';

/**
 * Defines a reusable DataTable preset configuration.
 * The returned object can be spread into DataTable: `<DataTable {...preset} data={data} />`
 *
 * @example
 * ```tsx
 * const dealsPreset = definePreset<Deal>({
 *   columns: [col.text("name"), col.currency("amount")],
 *   enableRowSelection: true,
 * });
 *
 * <DataTable {...dealsPreset} data={deals} />
 * ```
 */
export function definePreset<TData, TValue = unknown>(
  config: Omit<DataTableProps<TData, TValue>, 'data'>
): Omit<DataTableProps<TData, TValue>, 'data'> {
  return config;
}
