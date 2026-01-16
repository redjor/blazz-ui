'use client'

import { Page } from '@/components/ui/page'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Eye, Trash, Archive } from 'lucide-react'
import {
  DataTable,
  type DataTableColumnDef,
  type DataTableView,
  type RowAction,
  type BulkAction,
} from '@/components/features/data-table'
import { useDataTableViews } from '@/hooks/use-data-table-views'

interface Product {
  id: string
  name: string
  image: string
  status: 'actif' | 'brouillon' | 'archivé'
  stock: string
  stockCount: number
  category: string
  channels: number
  catalogues: number
}

const products: Product[] = [
  {
    id: '1',
    name: 'The Collection Snowboard: Liquid',
    image: '🏂',
    status: 'actif',
    stock: '50 en stock pour 4 variantes',
    stockCount: 50,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '2',
    name: 'The 3p Fulfilled Snowboard',
    image: '🏂',
    status: 'actif',
    stock: '20 en stock',
    stockCount: 20,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '3',
    name: 'The Multi-managed Snowboard',
    image: '🏂',
    status: 'actif',
    stock: '100 en stock',
    stockCount: 100,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '4',
    name: 'The Collection Snowboard: Oxygen',
    image: '🏂',
    status: 'actif',
    stock: '50 en stock',
    stockCount: 50,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '5',
    name: 'The Multi-location Snowboard',
    image: '🏂',
    status: 'actif',
    stock: '100 en stock',
    stockCount: 100,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '6',
    name: 'The Complete Snowboard',
    image: '🏂',
    status: 'actif',
    stock: '50 en stock pour 5 variantes',
    stockCount: 50,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '7',
    name: 'Selling Plans Ski Wax',
    image: '🎿',
    status: 'actif',
    stock: '30 en stock pour 3 variantes',
    stockCount: 30,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '8',
    name: 'The Draft Snowboard',
    image: '🏂',
    status: 'brouillon',
    stock: '20 en stock',
    stockCount: 20,
    category: 'Non classé',
    channels: 0,
    catalogues: 1,
  },
  {
    id: '9',
    name: 'The Compare at Price Snowboard',
    image: '🏂',
    status: 'actif',
    stock: '10 en stock',
    stockCount: 10,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '10',
    name: 'The Collection Snowboard: Hydrogen',
    image: '🏂',
    status: 'actif',
    stock: '50 en stock',
    stockCount: 50,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '11',
    name: 'The Out of Stock Snowboard',
    image: '🏂',
    status: 'actif',
    stock: '0 en stock',
    stockCount: 0,
    category: 'Non classé',
    channels: 1,
    catalogues: 1,
  },
  {
    id: '12',
    name: 'The Archived Snowboard',
    image: '🏂',
    status: 'archivé',
    stock: '50 en stock',
    stockCount: 50,
    category: 'Non classé',
    channels: 0,
    catalogues: 1,
  },
]

const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Produit',
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-xl">
            {product.image}
          </div>
          <span className="text-body-md">{product.name}</span>
        </div>
      )
    },
    enableSorting: true,
    filterConfig: {
      type: 'text',
      placeholder: 'Rechercher par nom...',
    },
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variants = {
        actif: 'default' as const,
        brouillon: 'secondary' as const,
        archivé: 'outline' as const,
      }
      return (
        <Badge
          variant={variants[status as keyof typeof variants]}
          className={
            status === 'actif'
              ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200'
              : status === 'brouillon'
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
    enableSorting: true,
    filterConfig: {
      type: 'select',
      options: [
        { label: 'Actif', value: 'actif' },
        { label: 'Brouillon', value: 'brouillon' },
        { label: 'Archivé', value: 'archivé' },
      ],
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.getValue('stock') as string
      const stockCount = row.original.stockCount
      return (
        <span className={stockCount === 0 ? 'text-body-md text-red-600' : 'text-body-md text-foreground'}>
          {stock}
        </span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
    enableSorting: true,
    filterConfig: {
      type: 'text',
      placeholder: 'Filtrer par catégorie...',
    },
  },
  {
    accessorKey: 'channels',
    header: 'Canaux',
    cell: ({ row }) => {
      const channels = row.getValue('channels') as number
      return <span className="text-body-md text-foreground">{channels}</span>
    },
    enableSorting: true,
    meta: {
      align: 'center',
    },
  },
  {
    accessorKey: 'catalogues',
    header: 'Catalogues',
    cell: ({ row }) => {
      const catalogues = row.getValue('catalogues') as number
      return <span className="text-body-md text-foreground">{catalogues}</span>
    },
    enableSorting: true,
    meta: {
      align: 'center',
    },
  },
]

const defaultViews: DataTableView[] = [
  {
    id: 'tous',
    name: 'Tous',
    isSystem: true,
    isDefault: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [],
    },
  },
  {
    id: 'actif',
    name: 'Actif',
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [
        {
          id: 'status-actif',
          column: 'status',
          operator: 'equals',
          value: 'actif',
          type: 'select',
        },
      ],
    },
  },
  {
    id: 'brouillon',
    name: 'Brouillon',
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [
        {
          id: 'status-brouillon',
          column: 'status',
          operator: 'equals',
          value: 'brouillon',
          type: 'select',
        },
      ],
    },
  },
  {
    id: 'archive',
    name: 'Archivé',
    isSystem: true,
    filters: {
      id: 'root',
      operator: 'AND',
      conditions: [
        {
          id: 'status-archive',
          column: 'status',
          operator: 'equals',
          value: 'archivé',
          type: 'select',
        },
      ],
    },
  },
]

export default function ProductsPage() {
  const { views, activeView, setActiveView } = useDataTableViews({
    storageKey: 'products-table-views',
    defaultViews,
  })

  // Row actions
  const rowActions: RowAction<Product>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      handler: (row) => {
        alert(`Viewing product: ${row.original.name}`)
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      handler: (row) => {
        alert(`Editing product: ${row.original.name}`)
      },
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      variant: 'destructive',
      separator: true,
      requireConfirmation: true,
      confirmationMessage: (row) =>
        `Are you sure you want to archive ${row.original.name}?`,
      handler: async (row) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert(`Archived product: ${row.original.name}`)
      },
      hidden: (row) => row.original.status === 'archivé',
    },
  ]

  // Bulk actions
  const bulkActions: BulkAction<Product>[] = [
    {
      id: 'activate',
      label: 'Set as Active',
      icon: Plus,
      variant: 'default',
      handler: async (rows) => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        alert(`Activated ${rows.length} products`)
      },
    },
    {
      id: 'archive',
      label: 'Archive Products',
      icon: Archive,
      variant: 'destructive',
      requireConfirmation: true,
      confirmationMessage: (count) =>
        `Are you sure you want to archive ${count} products?`,
      handler: async (rows) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert(`Archived ${rows.length} products`)
      },
    },
  ]

  return (
    <Page
      title="Products"
      subtitle="Manage your product inventory"
      fullWidth
      primaryAction={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      }
    >
      <Card className="ring-0 p-0">
        <DataTable
          data={products}
          columns={columns}
          enableSorting
          enablePagination
          enableRowSelection
          enableGlobalSearch
          enableAdvancedFilters
          searchPlaceholder="Rechercher dans tous les produits..."
          views={views}
          activeView={activeView}
          onViewChange={setActiveView}
          enableCustomViews
          rowActions={rowActions}
          bulkActions={bulkActions}
          pagination={{
            pageSize: 15,
            pageSizeOptions: [10, 15, 25, 50],
          }}
          variant="lined"
          density="default"
        />
      </Card>
    </Page>
  )
}
