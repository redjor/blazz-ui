'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/blocks/page-header';
import { DataTable, createCompaniesPreset } from '@/components/features/data-table';
import { companies } from '@/lib/sample-data';

export default function CompaniesPage() {
  const router = useRouter();

  const { columns, views, rowActions, bulkActions } = useMemo(
    () =>
      createCompaniesPreset({
        onView: (company) => router.push(`/companies/${company.id}`),
        onEdit: (company) => router.push(`/companies/${company.id}/edit`),
        onBulkArchive: (items) => toast.success(`${items.length} entreprise(s) archivée(s)`),
        onBulkDelete: (items) => toast.success(`${items.length} entreprise(s) supprimée(s)`),
      }),
    [router],
  );

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Entreprises"
        description="Gérez votre base d'entreprises"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Entreprises' },
        ]}
        actions={[
          { label: 'Nouvelle entreprise', href: '/companies/new', icon: Plus },
        ]}
      />

      <DataTable
        data={companies}
        columns={columns}
        views={views}
        rowActions={rowActions}
        bulkActions={bulkActions}
        getRowId={(row) => row.id}
        enableSorting
        enablePagination
        enableRowSelection
        enableGlobalSearch
        enableAdvancedFilters
        enableCustomViews
        combineSearchAndFilters
        searchPlaceholder="Rechercher par nom..."
        locale="fr"
        variant="lined"
        pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
      />
    </div>
  );
}
