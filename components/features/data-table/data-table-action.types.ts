import type { Row } from '@tanstack/react-table';
import type { LucideIcon } from 'lucide-react';

/**
 * Action available for individual table rows.
 * Displayed in a dropdown menu at the end of each row.
 *
 * @template TData - The row data type
 *
 * @example
 * ```typescript
 * const rowActions: RowAction<Product>[] = [
 *   {
 *     id: "edit",
 *     label: "Edit",
 *     icon: Edit,
 *     handler: (row) => router.push(`/products/${row.original.id}/edit`)
 *   },
 *   {
 *     id: "delete",
 *     label: "Delete",
 *     variant: "destructive",
 *     icon: Trash,
 *     separator: true,
 *     requireConfirmation: true,
 *     confirmationMessage: (row) => `Delete "${row.original.name}"?`,
 *     handler: async (row) => {
 *       await deleteProduct(row.original.id)
 *     },
 *     hidden: (row) => row.original.status === "archived"
 *   }
 * ]
 * ```
 */
export interface RowAction<TData = any> {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Optional icon (Lucide icon component) */
  icon?: LucideIcon;

  /** Visual style variant */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';

  /** Action handler - can be async */
  handler: (row: Row<TData>) => void | Promise<void>;

  /** Function to conditionally hide action for specific rows */
  hidden?: (row: Row<TData>) => boolean;

  /** Function to conditionally disable action for specific rows */
  disabled?: (row: Row<TData>) => boolean;

  /** If true, shows confirmation dialog before executing */
  requireConfirmation?: boolean;

  /** Confirmation message (can be function for dynamic message) */
  confirmationMessage?: string | ((row: Row<TData>) => string);

  /** If true, renders visual separator above this action */
  separator?: boolean;

  /** Keyboard shortcut (display only, not functional) */
  shortcut?: string;
}

/**
 * Action for multiple selected rows.
 * Displayed in toolbar when rows are selected.
 *
 * @template TData - The row data type
 *
 * @example
 * ```typescript
 * const bulkActions: BulkAction<Product>[] = [
 *   {
 *     id: "activate",
 *     label: "Activate Selected",
 *     icon: CheckCircle,
 *     handler: async (rows) => {
 *       const ids = rows.map(r => r.original.id)
 *       await bulkActivateProducts(ids)
 *     },
 *     disabled: (rows) => rows.every(r => r.original.status === "active")
 *   },
 *   {
 *     id: "delete",
 *     label: "Delete Selected",
 *     variant: "destructive",
 *     icon: Trash,
 *     requireConfirmation: true,
 *     confirmationMessage: (count) => `Delete ${count} product(s)?`,
 *     handler: async (rows) => {
 *       const ids = rows.map(r => r.original.id)
 *       await bulkDeleteProducts(ids)
 *     }
 *   }
 * ]
 * ```
 */
export interface BulkAction<TData = any> {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Optional icon (Lucide icon component) */
  icon?: LucideIcon;

  /** Visual style variant */
  variant?: 'default' | 'outline' | 'destructive';

  /** Action handler - receives array of selected rows, can be async */
  handler: (selectedRows: Row<TData>[]) => void | Promise<void>;

  /** Function to conditionally disable action based on selection */
  disabled?: (selectedRows: Row<TData>[]) => boolean;

  /** If true, shows confirmation dialog before executing */
  requireConfirmation?: boolean;

  /** Confirmation message (can be function with row count) */
  confirmationMessage?: string | ((count: number) => string);
}
