'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@blazz/ui/components/blocks/page-header';
import { KanbanBoard, type KanbanColumn } from '@blazz/ui/components/blocks/kanban-board';
import { Badge } from '@blazz/ui/components/ui/badge';
import { Box } from '@blazz/ui/components/ui/box';
import { Skeleton } from '@blazz/ui/components/ui/skeleton';
import { DataTable, createDealsPreset } from '@blazz/ui/components/features/data-table';
import { deals as initialDeals, formatCurrency, type Deal } from '@/lib/sample-data';

const stageConfig: Record<
  string,
  { label: string; variant: 'success' | 'info' | 'warning' | 'critical' | 'outline' | 'default' }
> = {
  lead: { label: 'Lead', variant: 'outline' },
  qualified: { label: 'Qualifié', variant: 'info' },
  proposal: { label: 'Proposition', variant: 'warning' },
  negotiation: { label: 'Négociation', variant: 'default' },
  closed_won: { label: 'Gagné', variant: 'success' },
  closed_lost: { label: 'Perdu', variant: 'critical' },
};

const kanbanColumns: KanbanColumn<Deal>[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualifié' },
  { id: 'proposal', label: 'Proposition' },
  { id: 'negotiation', label: 'Négociation' },
  { id: 'closed_won', label: 'Gagné' },
  { id: 'closed_lost', label: 'Perdu' },
];

function DealCard({ deal }: { deal: Deal }) {
  return (
    <a
      href={`/deals/${deal.id}`}
      className="block rounded-lg border bg-surface p-3 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium truncate">{deal.title}</p>
      <p className="mt-1 text-xs text-fg-muted">{deal.companyName}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{formatCurrency(deal.amount)}</span>
        <span className="text-xs text-fg-muted">{deal.probability}%</span>
      </div>
      <p className="mt-1 text-xs text-fg-muted">{deal.assignedTo}</p>
    </a>
  );
}

function DealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') ?? 'kanban';
  const [dealsList, setDealsList] = useState(initialDeals);

  const totalPipeline = dealsList
    .filter((d) => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((sum, d) => sum + d.amount, 0);

  const handleMove = (itemId: string, _from: string, toColumn: string) => {
    const stage = toColumn as Deal['stage'];
    setDealsList((prev) => prev.map((d) => (d.id === itemId ? { ...d, stage } : d)));
    const deal = dealsList.find((d) => d.id === itemId);
    const stageLabel = stageConfig[stage]?.label ?? stage;
    toast.success(`${deal?.title ?? 'Deal'} → ${stageLabel}`);
  };

  const { columns, views, rowActions, bulkActions } = useMemo(
    () =>
      createDealsPreset({
        onView: (deal) => router.push(`/deals/${deal.id}`),
        onEdit: (deal) => router.push(`/deals/${deal.id}/edit`),
        onBulkArchive: (items) => toast.success(`${items.length} opportunité(s) archivée(s)`),
        onBulkDelete: (items) => toast.success(`${items.length} opportunité(s) supprimée(s)`),
      }),
    [router],
  );

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Pipeline"
        description={`${formatCurrency(totalPipeline)} en pipeline`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Pipeline' }]}
        actions={[
          {
            label: view === 'kanban' ? 'Vue table' : 'Vue kanban',
            href: `/deals?view=${view === 'kanban' ? 'table' : 'kanban'}`,
            variant: 'outline',
          },
          { label: 'Nouveau deal', href: '/deals/new', icon: Plus },
        ]}
      />

      {view === 'kanban' ? (
        <KanbanBoard
          columns={kanbanColumns}
          items={dealsList}
          getColumnId={(deal) => deal.stage}
          onMove={handleMove}
          renderCard={(deal) => <DealCard deal={deal} />}
          renderColumnHeader={(column, items) => {
            const stageTotal = items.reduce((sum, d) => sum + d.amount, 0);
            return (
              <div className="flex items-center justify-between border-b p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{column.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {items.length}
                  </Badge>
                </div>
                <span className="text-xs text-fg-muted">
                  {formatCurrency(stageTotal)}
                </span>
              </div>
            );
          }}
        />
      ) : (
        <Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
          <DataTable
            data={dealsList}
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
            searchPlaceholder="Rechercher par titre..."
            locale="fr"
            variant="lined"
            pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
          />
        </Box>
      )}
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] m-6 rounded-lg" />}>
      <DealsContent />
    </Suspense>
  );
}
