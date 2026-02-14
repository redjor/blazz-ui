'use client';

import * as React from 'react';
import { Page } from '@/components/ui/page';
import { ComponentExample } from '@/components/features/docs/component-example';
import { PropsTable, type PropDefinition } from '@/components/features/docs/props-table';
import { DataTable } from '@/components/features/data-table/data-table';
import { createUserManagementPreset } from '@/components/features/data-table/presets/users';
import { createCompaniesPreset } from '@/components/features/data-table/presets/crm-companies';
import { createContactsPreset } from '@/components/features/data-table/presets/crm-contacts';
import { createDealsPreset } from '@/components/features/data-table/presets/crm-deals';
import { createQuotesPreset } from '@/components/features/data-table/presets/crm-quotes';
import { createProductsPreset } from '@/components/features/data-table/presets/crm-products';
import { createEditableDealsPreset } from '@/components/features/data-table/presets/crm-deals-editable';
import type { User } from '@/types/user-management';
import type { DataTableColumnDef } from '@/components/features/data-table/data-table.types';
import {
  companies,
  contacts,
  deals,
  quotes,
  products,
} from '@/lib/sample-data';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for examples
const mockUsers = [
  {
    id: '1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'alice',
    status: 'active',
    lastSignedIn: '2024-01-15',
    createdAt: '2023-06-10',
  },
  {
    id: '2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    firstName: 'Bob',
    lastName: 'Smith',
    username: 'bob',
    status: 'active',
    lastSignedIn: '2024-01-14',
    createdAt: '2023-07-22',
  },
  {
    id: '3',
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    firstName: 'Charlie',
    lastName: 'Brown',
    username: 'charlie',
    status: 'suspended',
    lastSignedIn: '2024-01-10',
    createdAt: '2023-05-15',
  },
  {
    id: '4',
    email: 'diana@example.com',
    name: 'Diana Prince',
    firstName: 'Diana',
    lastName: 'Prince',
    username: 'diana',
    status: 'inactive',
    lastSignedIn: '2023-12-01',
    createdAt: '2023-08-30',
  },
  {
    id: '5',
    email: 'evan@example.com',
    name: 'Evan Davis',
    firstName: 'Evan',
    lastName: 'Davis',
    username: 'evan',
    status: 'never_active',
    lastSignedIn: null,
    createdAt: '2024-01-05',
  },
] as User[];

// Simple product data for basic examples
interface SimpleProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const mockProducts: SimpleProduct[] = [
  { id: '1', name: 'Laptop Pro', category: 'Electronics', price: 1299, stock: 15, status: 'in_stock' },
  { id: '2', name: 'Wireless Mouse', category: 'Electronics', price: 29, stock: 3, status: 'low_stock' },
  { id: '3', name: 'USB-C Cable', category: 'Accessories', price: 19, stock: 0, status: 'out_of_stock' },
  { id: '4', name: 'Desk Lamp', category: 'Office', price: 45, stock: 22, status: 'in_stock' },
  { id: '5', name: 'Notebook Set', category: 'Stationery', price: 12, stock: 50, status: 'in_stock' },
];

const dataTableProps: PropDefinition[] = [
  { name: 'data', type: 'TData[]', description: 'Array of data objects to display in the table.' },
  { name: 'columns', type: 'DataTableColumnDef<TData>[]', description: 'Column definitions for the table.' },
  { name: 'enableSorting', type: 'boolean', default: 'true', description: 'Enable column sorting functionality.' },
  { name: 'enablePagination', type: 'boolean', default: 'true', description: 'Enable pagination controls.' },
  { name: 'enableRowSelection', type: 'boolean', default: 'false', description: 'Enable row selection with checkboxes.' },
  { name: 'enableGlobalSearch', type: 'boolean', default: 'true', description: 'Enable global search functionality.' },
  { name: 'enableAdvancedFilters', type: 'boolean', default: 'false', description: 'Enable advanced filter builder with AND/OR logic.' },
  { name: 'views', type: 'DataTableView[]', description: 'Predefined views for quick filtering and sorting.' },
  { name: 'activeView', type: 'DataTableView | null', description: 'Currently active view.' },
  { name: 'onViewChange', type: '(view: DataTableView) => void', description: 'Callback when view changes.' },
  { name: 'enableCustomViews', type: 'boolean', default: 'false', description: 'Allow users to create and save custom views.' },
  { name: 'rowActions', type: 'RowAction<TData>[]', description: 'Actions available for each row (edit, delete, etc.).' },
  { name: 'bulkActions', type: 'BulkAction<TData>[]', description: 'Actions available for multiple selected rows.' },
  { name: 'variant', type: '"default" | "lined" | "striped"', default: '"lined"', description: 'Visual style variant of the table.' },
  { name: 'density', type: '"compact" | "default" | "comfortable"', default: '"default"', description: 'Row spacing density.' },
  { name: 'pagination', type: 'PaginationConfig', description: 'Pagination configuration (pageSize, pageSizeOptions).' },
  { name: 'locale', type: '"fr" | "en"', default: '"en"', description: 'Locale for internationalization.' },
];

export default function DataTablePage() {
  // Basic example columns
  const productColumns: DataTableColumnDef<SimpleProduct>[] = [
    { accessorKey: 'name', header: 'Product', enableSorting: true },
    { accessorKey: 'category', header: 'Category', enableSorting: true },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `$${row.getValue('price')}`,
      enableSorting: true,
    },
    { accessorKey: 'stock', header: 'Stock', enableSorting: true },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variantMap = {
          in_stock: 'success' as const,
          low_stock: 'warning' as const,
          out_of_stock: 'critical' as const,
        };
        return (
          <Badge variant={variantMap[status as keyof typeof variantMap]}>
            {status.replace('_', ' ')}
          </Badge>
        );
      },
    },
  ];

  // User management preset
  const userPreset = createUserManagementPreset({
    onView: (user) => console.log('View user:', user),
    onEdit: (user) => console.log('Edit user:', user),
    onSuspend: (user) => console.log('Suspend user:', user),
    onDelete: (user) => console.log('Delete user:', user),
    onBulkSuspend: (users) => console.log('Bulk suspend:', users),
    onBulkDelete: (users) => console.log('Bulk delete:', users),
  });

  // CRM presets
  const companiesPreset = createCompaniesPreset({
    onView: (c) => console.log('View company:', c.id),
    onEdit: (c) => console.log('Edit company:', c.id),
  });

  const contactsPreset = createContactsPreset({
    onView: (c) => console.log('View contact:', c.id),
    onEdit: (c) => console.log('Edit contact:', c.id),
  });

  const dealsPreset = createDealsPreset({
    onView: (d) => console.log('View deal:', d.id),
    onEdit: (d) => console.log('Edit deal:', d.id),
  });

  const quotesPreset = createQuotesPreset({
    onView: (q) => console.log('View quote:', q.id),
    onPrint: (q) => console.log('Print quote:', q.id),
  });

  const productsPreset = createProductsPreset({
    onEdit: (p) => console.log('Edit product:', p.id),
    onDuplicate: (p) => console.log('Duplicate product:', p.id),
  });

  const editablePreset = createEditableDealsPreset({
    onCellEdit: (rowId, columnId, value) => {
      console.log(`Cell edited: row=${rowId}, col=${columnId}, value=${value}`);
    },
  });

  return (
    <Page
      title="Data Table"
      subtitle="Enterprise-grade data table with advanced filtering, sorting, pagination, and bulk actions. Built with TanStack React Table v8."
    >
      <div className="space-y-12">
        {/* Basic Example */}
        <ComponentExample
          title="Basic Table"
          description="Simple data table with sorting and pagination."
          code={`const columns: DataTableColumnDef<Product>[] = [
  { accessorKey: "name", header: "Product", enableSorting: true },
  { accessorKey: "category", header: "Category", enableSorting: true },
  { accessorKey: "price", header: "Price", cell: ({ row }) => \`$\${row.getValue("price")}\` },
]

<DataTable data={products} columns={columns} enableSorting enablePagination pagination={{ pageSize: 10 }} />`}
        >
          <DataTable
            data={mockProducts}
            columns={productColumns}
            enableSorting
            enablePagination
            pagination={{ pageSize: 5 }}
          />
        </ComponentExample>

        {/* With Row Selection */}
        <ComponentExample
          title="With Row Selection"
          description="Enable row selection with checkboxes for bulk operations."
          code={`<DataTable data={products} columns={columns} enableRowSelection enablePagination pagination={{ pageSize: 10 }} />`}
        >
          <DataTable
            data={mockProducts}
            columns={productColumns}
            enableRowSelection
            enablePagination
            pagination={{ pageSize: 5 }}
          />
        </ComponentExample>

        {/* Variants */}
        <ComponentExample
          title="Visual Variants"
          description="Different visual styles: lined (default), striped, and default."
          code={`<DataTable variant="lined" data={products} columns={columns} />
<DataTable variant="striped" data={products} columns={columns} />
<DataTable variant="default" data={products} columns={columns} />`}
        >
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold mb-2">Lined (Default)</h4>
              <DataTable
                data={mockProducts.slice(0, 3)}
                columns={productColumns.slice(0, 3)}
                variant="lined"
                enablePagination={false}
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Striped</h4>
              <DataTable
                data={mockProducts.slice(0, 3)}
                columns={productColumns.slice(0, 3)}
                variant="striped"
                enablePagination={false}
              />
            </div>
          </div>
        </ComponentExample>

        {/* Density */}
        <ComponentExample
          title="Density Options"
          description="Control row spacing with compact, default, or comfortable density."
          code={`<DataTable density="compact" data={products} columns={columns} />
<DataTable density="default" data={products} columns={columns} />
<DataTable density="comfortable" data={products} columns={columns} />`}
        >
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold mb-2">Compact</h4>
              <DataTable
                data={mockProducts.slice(0, 3)}
                columns={productColumns.slice(0, 3)}
                density="compact"
                enablePagination={false}
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Comfortable</h4>
              <DataTable
                data={mockProducts.slice(0, 3)}
                columns={productColumns.slice(0, 3)}
                density="comfortable"
                enablePagination={false}
              />
            </div>
          </div>
        </ComponentExample>

        {/* Full-Featured with Preset */}
        <ComponentExample
          title="Full-Featured with Preset"
          description="Complete example using the User Management preset with views, filters, row actions, and bulk actions."
          code={`import { createUserManagementPreset } from "@/components/features/data-table"

const preset = createUserManagementPreset({
  onView: (user) => router.push(\`/users/\${user.id}\`),
  onEdit: (user) => router.push(\`/users/\${user.id}/edit\`),
  onSuspend: async (user) => await suspendUser(user.id),
  onDelete: async (user) => await deleteUser(user.id),
})

<DataTable
  data={users}
  columns={preset.columns}
  views={preset.views}
  rowActions={preset.rowActions}
  bulkActions={preset.bulkActions}
  enableSorting enablePagination enableRowSelection enableGlobalSearch enableCustomViews
  pagination={{ pageSize: 25 }}
/>`}
        >
          <DataTable
            data={mockUsers}
            columns={userPreset.columns}
            views={userPreset.views}
            rowActions={userPreset.rowActions}
            bulkActions={userPreset.bulkActions}
            enableSorting
            enablePagination
            enableRowSelection
            enableGlobalSearch
            enableCustomViews
            pagination={{ pageSize: 5 }}
          />
        </ComponentExample>

        {/* CRM Presets */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">CRM Presets</h2>
          <p className="text-sm text-muted-foreground">
            Domain-specific presets for the Forge CRM. Each preset provides columns, views, row actions, and bulk actions tailored to the domain.
          </p>
          <Tabs defaultValue="companies" className="w-full">
            <TabsList>
              <TabsTrigger value="companies">Entreprises</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="deals">Deals</TabsTrigger>
              <TabsTrigger value="quotes">Devis</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
            </TabsList>
            <TabsContent value="companies" className="mt-4">
              <DataTable
                data={companies.slice(0, 15)}
                columns={companiesPreset.columns}
                views={companiesPreset.views}
                rowActions={companiesPreset.rowActions}
                bulkActions={companiesPreset.bulkActions}
                getRowId={(row) => row.id}
                enableSorting
                enablePagination
                enableRowSelection
                enableGlobalSearch
                enableAdvancedFilters
                enableCustomViews
                combineSearchAndFilters
                searchPlaceholder="Rechercher..."
                locale="fr"
                variant="lined"
                pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
              />
            </TabsContent>
            <TabsContent value="contacts" className="mt-4">
              <DataTable
                data={contacts.slice(0, 15)}
                columns={contactsPreset.columns}
                views={contactsPreset.views}
                rowActions={contactsPreset.rowActions}
                getRowId={(row) => row.id}
                enableSorting
                enablePagination
                enableRowSelection
                enableGlobalSearch
                enableAdvancedFilters
                enableCustomViews
                combineSearchAndFilters
                searchPlaceholder="Rechercher..."
                locale="fr"
                variant="lined"
                pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
              />
            </TabsContent>
            <TabsContent value="deals" className="mt-4">
              <DataTable
                data={deals.slice(0, 15)}
                columns={dealsPreset.columns}
                views={dealsPreset.views}
                rowActions={dealsPreset.rowActions}
                bulkActions={dealsPreset.bulkActions}
                getRowId={(row) => row.id}
                enableSorting
                enablePagination
                enableRowSelection
                enableGlobalSearch
                enableAdvancedFilters
                enableCustomViews
                combineSearchAndFilters
                searchPlaceholder="Rechercher..."
                locale="fr"
                variant="lined"
                pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
              />
            </TabsContent>
            <TabsContent value="quotes" className="mt-4">
              <DataTable
                data={quotes}
                columns={quotesPreset.columns}
                views={quotesPreset.views}
                rowActions={quotesPreset.rowActions}
                getRowId={(row) => row.id}
                enableSorting
                enablePagination
                enableGlobalSearch
                enableAdvancedFilters
                enableCustomViews
                combineSearchAndFilters
                searchPlaceholder="Rechercher..."
                locale="fr"
                variant="lined"
                pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
              />
            </TabsContent>
            <TabsContent value="products" className="mt-4">
              <DataTable
                data={products}
                columns={productsPreset.columns}
                views={productsPreset.views}
                rowActions={productsPreset.rowActions}
                getRowId={(row) => row.id}
                enableSorting
                enablePagination
                enableGlobalSearch
                enableAdvancedFilters
                enableCustomViews
                combineSearchAndFilters
                searchPlaceholder="Rechercher..."
                locale="fr"
                variant="lined"
                pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Editable Mode */}
        <ComponentExample
          title="Editable Mode"
          description="Inline-editable cells for spreadsheet-like data entry. Uses editable column builders with onCellEdit callbacks."
          code={`import { createEditableDealsPreset } from "@/components/features/data-table"

const { columns, views } = createEditableDealsPreset({
  onCellEdit: (rowId, columnId, value) => {
    console.log(\`Cell edited: row=\${rowId}, col=\${columnId}, value=\${value}\`);
  },
});

<DataTable data={deals} columns={columns} views={views} variant="lined" density="compact" />`}
        >
          <DataTable
            data={deals.slice(0, 8)}
            columns={editablePreset.columns}
            getRowId={(row) => row.id}
            enableSorting
            enablePagination={false}
            locale="fr"
            variant="lined"
            density="compact"
          />
        </ComponentExample>

        {/* Props Table */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Props</h2>
          <PropsTable props={dataTableProps} />
        </section>

        {/* Available Presets */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Available Presets</h2>
          <p className="text-sm text-muted-foreground">
            Presets provide pre-configured columns, views, and actions for common use cases:
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">User Management</h3>
              <code className="text-xs text-muted-foreground">createUserManagementPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">User listing with status filtering and bulk operations.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">Invitations</h3>
              <code className="text-xs text-muted-foreground">createInvitationPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Invitation management with status tracking and resend.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">Order Management</h3>
              <code className="text-xs text-muted-foreground">createOrderManagementPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Order tracking with fulfillment and payment status.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">CRM Companies</h3>
              <code className="text-xs text-muted-foreground">createCompaniesPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Company management with industry, revenue, and status views.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">CRM Contacts</h3>
              <code className="text-xs text-muted-foreground">createContactsPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Contact management with company links and primary badge.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">CRM Deals</h3>
              <code className="text-xs text-muted-foreground">createDealsPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Deal pipeline with stage badges, probability, and amount.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">CRM Quotes</h3>
              <code className="text-xs text-muted-foreground">createQuotesPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Quote management with duplicate, print, and delete actions.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">CRM Products</h3>
              <code className="text-xs text-muted-foreground">createProductsPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Product catalog with category filters and deactivation.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">Editable Deals</h3>
              <code className="text-xs text-muted-foreground">createEditableDealsPreset()</code>
              <p className="text-sm text-muted-foreground mt-2">Inline-editable deal table with text, number, and select cells.</p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Key Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Filtering & Search</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Global search with debouncing</li>
                <li>Advanced filter builder with AND/OR logic</li>
                <li>Inline column filters</li>
                <li>Predefined filter views</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Sorting & Views</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Single and multi-column sorting</li>
                <li>Predefined views with saved state</li>
                <li>Custom user-created views</li>
                <li>View duplication and renaming</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Selection & Actions</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Row selection with checkboxes</li>
                <li>Select all functionality</li>
                <li>Row-level actions menu</li>
                <li>Bulk actions for selected rows</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Inline Editing</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Editable text, number, currency cells</li>
                <li>Editable select and date cells</li>
                <li>Save on blur or Enter key</li>
                <li>onCellEdit callback for persistence</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Column Definition */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Column Definition</h2>
          <p className="text-sm text-muted-foreground">
            Columns extend TanStack Table's ColumnDef with additional filter configuration:
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-xs">{`const columns: DataTableColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
    enableSorting: true,
    filterConfig: {
      type: "text",
      placeholder: "Search products...",
      showInlineFilter: true,
      defaultInlineFilter: true,
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge>,
    filterConfig: {
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ],
      showInlineFilter: true,
    }
  }
]`}</code>
          </pre>
        </section>

        {/* Best Practices */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Best Practices</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Use presets when available to save development time</li>
            <li>Enable pagination for datasets with more than 25 rows</li>
            <li>Use advanced filters for complex data filtering needs</li>
            <li>Provide row actions for common operations (view, edit, delete)</li>
            <li>Enable bulk actions when users need to operate on multiple rows</li>
            <li>Use custom views to save frequently used filter combinations</li>
            <li>Use appropriate density for your use case (compact for dashboards, comfortable for detailed views)</li>
            <li>Use the editable variant with density="compact" for spreadsheet-like editing</li>
          </ul>
        </section>
      </div>
    </Page>
  );
}
