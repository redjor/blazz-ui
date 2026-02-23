'use client';

import { useMemo } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/features/data-table';
import type { DataTableColumnDef, RowAction } from '@/components/features/data-table/data-table.types';
import { DataTableColumnHeader } from '@/components/features/data-table/data-table-column-header';
import { col } from '@/components/features/data-table/factories/col';
import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';

/* ─── Types ─── */

interface SupplierPricing {
  id: string;
  entityType: 'Centrale' | 'Magasin';
  entity: string;
  supplier: string;
  priceHT: number | null;
  costPrice: number | null;
  status: 'actif' | 'inactif' | null;
  validFrom: string | null;
  validTo: string | null;
}

/* ─── Mock Data (from screenshot) ─── */

const supplierData: SupplierPricing[] = [
  // Centrales — Global Product Geispolsheim
  {
    id: 'c1-s1',
    entityType: 'Centrale',
    entity: 'Global Product Geispolsheim',
    supplier: 'Davigel SAS',
    priceHT: null,
    costPrice: null,
    status: null,
    validFrom: null,
    validTo: null,
  },
  {
    id: 'c1-s2',
    entityType: 'Centrale',
    entity: 'Global Product Geispolsheim',
    supplier: 'METRO France',
    priceHT: 0.33,
    costPrice: null,
    status: 'actif',
    validFrom: '01/01/26',
    validTo: null,
  },
  {
    id: 'c1-s3',
    entityType: 'Centrale',
    entity: 'Global Product Geispolsheim',
    supplier: 'SOCOPA SA',
    priceHT: null,
    costPrice: null,
    status: null,
    validFrom: null,
    validTo: null,
  },
  // Centrales — Pro Centrale Strasbourg (empty, no suppliers yet)

  // Magasins — Pro Inter Belfort
  {
    id: 'm1-s1',
    entityType: 'Magasin',
    entity: 'Pro Inter Belfort',
    supplier: 'Centrale Global Product Geispolsheim',
    priceHT: 5.89,
    costPrice: 5.89,
    status: 'actif',
    validFrom: '23/02/26',
    validTo: null,
  },
  // Magasins — Pro Inter Meinau
  {
    id: 'm2-s1',
    entityType: 'Magasin',
    entity: 'Pro Inter Meinau',
    supplier: 'Centrale Global Product Geispolsheim',
    priceHT: 5.89,
    costPrice: 5.89,
    status: 'actif',
    validFrom: '23/02/26',
    validTo: null,
  },
  // Magasins — Pro Inter Mutzig
  {
    id: 'm3-s1',
    entityType: 'Magasin',
    entity: 'Pro Inter Mutzig',
    supplier: 'Centrale Global Product Geispolsheim',
    priceHT: 5.89,
    costPrice: 5.89,
    status: 'actif',
    validFrom: '23/02/26',
    validTo: null,
  },
];

/* ─── Format helpers ─── */

function formatEUR(value: number | null): string {
  if (value === null) return '- -';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

function formatValidity(from: string | null, to: string | null): string {
  if (!from) return '- -';
  return to ? `${from} → ${to}` : `${from} →`;
}

/* ─── Columns ─── */

function createSupplierColumns(): DataTableColumnDef<SupplierPricing>[] {
  return [
    // Entity type (used for grouping)
    {
      accessorKey: 'entityType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.entityType}</span>
      ),
      enableGrouping: true,
      enableSorting: true,
      filterConfig: {
        type: 'select',
        options: [
          { label: 'Centrale', value: 'Centrale' },
          { label: 'Magasin', value: 'Magasin' },
        ],
        filterLabel: 'Type',
      },
    } as DataTableColumnDef<SupplierPricing>,

    // Entity name
    {
      accessorKey: 'entity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entité" />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-fg">{row.original.entity}</span>
      ),
      enableGrouping: true,
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher entité...',
        filterLabel: 'Entité',
      },
    } as DataTableColumnDef<SupplierPricing>,

    // Supplier name
    col.text<SupplierPricing>('supplier', {
      title: 'Fournisseur',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),

    // Prix HT
    {
      accessorKey: 'priceHT',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prix HT" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{formatEUR(row.original.priceHT)}</span>
      ),
      enableSorting: true,
    } as DataTableColumnDef<SupplierPricing>,

    // Prix revient
    {
      accessorKey: 'costPrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prix revient" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatEUR(row.original.costPrice)}
        </span>
      ),
      enableSorting: true,
    } as DataTableColumnDef<SupplierPricing>,

    // Statut
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Statut" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        if (!status) return <span className="text-fg-muted">- -</span>;
        return (
          <Badge variant={status === 'actif' ? 'success' : 'secondary'}>
            {status === 'actif' ? 'Actif' : 'Inactif'}
          </Badge>
        );
      },
      enableSorting: true,
      filterConfig: {
        type: 'select',
        options: [
          { label: 'Actif', value: 'actif' },
          { label: 'Inactif', value: 'inactif' },
        ],
        filterLabel: 'Statut',
        showInlineFilter: true,
        defaultInlineFilter: true,
      },
    } as DataTableColumnDef<SupplierPricing>,

    // Validité
    {
      accessorKey: 'validFrom',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Validité" />
      ),
      cell: ({ row }) => (
        <span className="text-fg-muted">
          {formatValidity(row.original.validFrom, row.original.validTo)}
        </span>
      ),
      enableSorting: true,
    } as DataTableColumnDef<SupplierPricing>,
  ];
}

/* ─── Row actions ─── */

function createSupplierRowActions(): RowAction<SupplierPricing>[] {
  return [
    {
      id: 'define',
      label: '+ Définir',
      icon: PlusCircle,
      handler: (row) =>
        toast.info(`Définir prix pour ${row.supplier} / ${row.entity}`),
      hidden: (row) => row.priceHT !== null,
    },
    {
      id: 'edit',
      label: 'Modifier',
      icon: Pencil,
      handler: (row) => toast.info(`Modifier ${row.supplier}`),
      hidden: (row) => row.priceHT === null,
    },
    {
      id: 'delete',
      label: 'Supprimer',
      icon: Trash2,
      variant: 'destructive',
      handler: (row) => toast.error(`Supprimer ${row.supplier}`),
      separator: true,
      requireConfirmation: true,
      confirmationMessage: (row) =>
        `Supprimer le fournisseur "${row.supplier}" de "${row.entity}" ?`,
    },
  ];
}

/* ─── Page ─── */

export default function PlaygroundPage() {
  const columns = useMemo(() => createSupplierColumns(), []);
  const rowActions = useMemo(() => createSupplierRowActions(), []);

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Playground</h1>
        <p className="text-fg-muted text-sm mt-1">
          Table fournisseurs avec grouping par type (Centrales / Magasins)
        </p>
      </div>

      <Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
        <DataTable
          data={supplierData}
          columns={columns}
          rowActions={rowActions}
          getRowId={(row) => row.id}
          enableSorting
          enableRowSelection
          enableGrouping
          defaultGrouping={['entityType', 'entity']}
          enableGlobalSearch
          searchPlaceholder="Rechercher fournisseur, entité..."
          enableAdvancedFilters
          combineSearchAndFilters
          locale="fr"
          variant="lined"
          density="compact"
        />
      </Box>
    </div>
  );
}
