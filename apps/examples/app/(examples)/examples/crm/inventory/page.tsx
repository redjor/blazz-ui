'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@blazz/ui/components/blocks/page-header';
import { DataTable, createSpreadsheetPreset } from '@blazz/ui/components/features/data-table';
import { Box } from '@blazz/ui/components/ui/box';
import { products as initialProducts, type Product } from '@/lib/sample-data';

const categoryOptions = [
  { label: 'Licence', value: 'Licence' },
  { label: 'Service', value: 'Service' },
  { label: 'Support', value: 'Support' },
  { label: 'Module', value: 'Module' },
];

const statusOptions = [
  { label: 'Actif', value: 'active' },
  { label: 'Inactif', value: 'inactive' },
  { label: 'Abandonné', value: 'discontinued' },
];

export default function InventoryPage() {
  const [data, setData] = useState<Product[]>(() => [...initialProducts]);

  const handleCellEdit = useCallback(
    (rowId: string, columnId: string, value: unknown) => {
      setData((prev) =>
        prev.map((row) =>
          row.id === rowId ? { ...row, [columnId]: value } : row,
        ),
      );
      toast.success('Cellule mise à jour');
    },
    [],
  );

  const { columns } = useMemo(
    () =>
      createSpreadsheetPreset<Product>({
        onCellEdit: handleCellEdit,
        columns: [
          { accessorKey: 'sku', title: 'SKU', type: 'text', editable: false },
          { accessorKey: 'name', title: 'Produit', type: 'text', placeholder: 'Nom du produit' },
          { accessorKey: 'category', title: 'Catégorie', type: 'select', options: categoryOptions },
          { accessorKey: 'unitPrice', title: 'Prix unitaire', type: 'currency', currency: 'EUR', locale: 'fr-FR' },
          { accessorKey: 'stock', title: 'Stock', type: 'number', min: 0, step: 1 },
          { accessorKey: 'status', title: 'Statut', type: 'select', options: statusOptions },
          { accessorKey: 'reorderDate', title: 'Réappro.', type: 'date' },
        ],
      }),
    [handleCellEdit],
  );

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Inventaire"
        description="Gestion du stock en mode spreadsheet — éditez les cellules directement"
        breadcrumbs={[
          { label: 'Dashboard', href: '/examples/crm/dashboard' },
          { label: 'Inventaire' },
        ]}
      />

      <Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
        <DataTable
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          enableSorting
          enablePagination
          variant="spreadsheet"
          density="compact"
          locale="fr"
          pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50] }}
        />
      </Box>
    </div>
  );
}
