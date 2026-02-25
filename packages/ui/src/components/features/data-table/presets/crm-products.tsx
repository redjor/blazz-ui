'use client';

/**
 * CRM Products preset for DataTable
 *
 * Pre-configured columns, views, and actions for product catalog management.
 * Uses Forge CRM Product type from sample-data.
 *
 * @module presets/crm-products
 */

import { Copy, XCircle } from 'lucide-react';
import type { Product } from '../../../../lib/sample-data';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import { col } from '../factories/col';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createCustomRowAction, createBulkActions } from '../factories/action-builders';

/**
 * Configuration options for Products preset
 */
export interface ProductsPresetConfig {
  onEdit?: (product: Product) => void | Promise<void>;
  onDuplicate?: (product: Product) => void | Promise<void>;
  onDeactivate?: (product: Product) => void | Promise<void>;
  onBulkDeactivate?: (products: Product[]) => void | Promise<void>;
  onBulkDelete?: (products: Product[]) => void | Promise<void>;
}

/**
 * Return type for the Products preset
 */
export interface ProductsPreset {
  columns: DataTableColumnDef<Product>[];
  views: DataTableView[];
  rowActions: RowAction<Product>[];
  bulkActions: BulkAction<Product>[];
}

/**
 * Category options for select filter
 */
const categoryOptions = [
  { label: 'Licence', value: 'Licence' },
  { label: 'Support', value: 'Support' },
  { label: 'Consulting', value: 'Consulting' },
  { label: 'Formation', value: 'Formation' },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'Custom Dev', value: 'Custom Dev' },
];

/**
 * Creates a complete Products preset for the Forge CRM DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views, rowActions } = createProductsPreset({
 *   onEdit: (product) => router.push(`/products/${product.id}/edit`),
 *   onDuplicate: async (product) => await duplicateProduct(product.id),
 *   onDeactivate: async (product) => await deactivateProduct(product.id),
 * });
 * ```
 */
export function createProductsPreset(config: ProductsPresetConfig = {}): ProductsPreset {
  const { onEdit, onDuplicate, onDeactivate, onBulkDeactivate, onBulkDelete } = config;

  const columns: DataTableColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produit" />,
      cell: ({ row }) => {
        const name = row.original.name;
        const sku = row.original.sku;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-fg">{name}</span>
            <span className="text-xs text-fg-muted font-mono">{sku}</span>
          </div>
        );
      },
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher par nom...',
        showInlineFilter: true,
        defaultInlineFilter: false,
        filterLabel: 'Produit',
      },
    } as DataTableColumnDef<Product>,
    col.select<Product>('category', {
      title: 'Catégorie',
      options: categoryOptions,
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    col.currency<Product>('unitPrice', {
      title: 'Prix unitaire',
      currency: 'EUR',
      locale: 'fr-FR',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    col.status<Product>('status', {
      title: 'Statut',
      statusMap: {
        active: { variant: 'success', label: 'Actif' },
        inactive: { variant: 'secondary', label: 'Inactif' },
        discontinued: { variant: 'destructive', label: 'Arrêté' },
      },
      filterOptions: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
        { label: 'Arrêté', value: 'discontinued' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'active', name: 'Actifs', value: 'active' },
      { id: 'inactive', name: 'Inactifs', value: 'inactive' },
    ],
    allViewName: 'Tous',
  });

  const crudActions = createCRUDActions<Product>({
    onEdit,
    labels: {
      edit: 'Modifier',
    },
  });

  const customActions: RowAction<Product>[] = [];

  if (onDuplicate) {
    customActions.push(
      createCustomRowAction<Product>({
        id: 'duplicate',
        label: 'Dupliquer',
        icon: Copy,
        handler: onDuplicate,
        separator: true,
      }),
    );
  }

  if (onDeactivate) {
    customActions.push(
      createCustomRowAction<Product>({
        id: 'deactivate',
        label: 'Désactiver',
        icon: XCircle,
        handler: onDeactivate,
        hidden: (product) => product.status !== 'active',
        requireConfirmation: true,
        confirmationMessage: (product) =>
          `Êtes-vous sûr de vouloir désactiver "${product.name}" ?`,
      }),
    );
  }

  const rowActions: RowAction<Product>[] = [...crudActions, ...customActions];

  const bulkActions = createBulkActions<Product>({
    onArchive: onBulkDeactivate,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) =>
      `Êtes-vous sûr de vouloir désactiver ${count} produit(s) ?`,
    deleteConfirmation: (count) =>
      `Êtes-vous sûr de vouloir supprimer ${count} produit(s) ?`,
    labels: {
      archive: 'Désactiver la sélection',
      delete: 'Supprimer la sélection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
