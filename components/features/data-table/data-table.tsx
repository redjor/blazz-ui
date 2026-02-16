'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useDataTableConfig } from './config/data-table-config';
import { dataTableVariants } from './data-table.styles';
import type { DataTableColumnDef, DataTableProps } from './data-table.types';
import { countActiveFilters, createDataFilterFn } from './data-table.utils';
import { DataTableActionsBar } from './data-table-actions-bar';
import { DataTableBulkSelectionBar } from './data-table-bulk-selection-bar';
import { DataTableFilterBuilder } from './data-table-filter-builder';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRenameViewDialog } from './data-table-rename-view-dialog';
import { DataTableReUIFilters } from './data-table-reui-filters';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableRowSelection } from './data-table-row-selection';
import { DataTableSaveViewDialog } from './data-table-save-view-dialog';
import { DataTableSkeleton } from './data-table-skeleton';
import { useDataTableSearch } from './hooks/use-data-table-search';
import { useDataTableViews } from './hooks/use-data-table-views';

export function DataTable<TData, TValue = unknown>({
  data,
  columns,
  getRowId,
  enableSorting = true,
  enableMultiSort = false,
  defaultSorting = [],
  onSortingChange,
  defaultColumnVisibility = {},
  enablePagination = true,
  pagination,
  onPaginationChange,
  enableRowSelection = false,
  onRowSelectionChange,
  enableGlobalSearch = true,
  searchPlaceholder = 'Search...',
  enableAdvancedFilters = false,
  defaultFilterGroup,
  onFilterGroupChange,
  views,
  activeView: externalActiveView,
  onViewChange,
  onViewSave,
  onViewUpdate,
  onViewDelete,
  onCreateView,
  enableCustomViews = false,
  rowActions,
  bulkActions,
  onRowClick,
  variant,
  density,
  className,
  isLoading = false,
  loadingComponent,
  emptyComponent,
  hideToolbar = false,
  hideHeaders = false,
  combineSearchAndFilters = false,
  locale,
  ...props
}: DataTableProps<TData, TValue> & VariantProps<typeof dataTableVariants>) {
  // Get configuration from context (with overrides from props)
  const config = useDataTableConfig();

  // Apply configuration with prop overrides
  const finalPagination = React.useMemo(
    () => ({
      pageIndex: pagination?.pageIndex ?? 0,
      pageSize: pagination?.pageSize ?? config.pagination.defaultPageSize,
      pageSizeOptions: pagination?.pageSizeOptions ?? config.pagination.pageSizeOptions,
      showPageInfo: pagination?.showPageInfo ?? config.pagination.showPageInfo,
      pageCount: pagination?.pageCount,
    }),
    [
      pagination?.pageIndex,
      pagination?.pageSize,
      pagination?.pageSizeOptions,
      pagination?.showPageInfo,
      pagination?.pageCount,
      config.pagination.defaultPageSize,
      config.pagination.pageSizeOptions,
      config.pagination.showPageInfo,
    ]
  );
  const finalVariant = variant ?? config.ui.defaultVariant;
  const finalDensity = density ?? config.ui.defaultDensity;
  const finalLocale = locale ?? config.i18n.defaultLocale;
  const debounceMs = config.performance.searchDebounceMs;

  // Prevent hydration mismatch by only rendering after mount
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Core table state
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultColumnVisibility);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: finalPagination.pageIndex,
    pageSize: finalPagination.pageSize,
  });

  // Sync pageIndex when it changes externally (e.g., URL navigation)
  React.useEffect(() => {
    if (finalPagination.pageIndex !== paginationState.pageIndex) {
      setPaginationState((prev) => ({ ...prev, pageIndex: finalPagination.pageIndex }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalPagination.pageIndex, paginationState.pageIndex]);

  // Search hook
  const { searchOpen, setSearchOpen, searchValue, setSearchValue, globalFilter, setGlobalFilter } =
    useDataTableSearch({
      debounceMs,
      onSearchChange: props.onSearchChange,
    });

  // Views hook
  const viewsHook = useDataTableViews(
    {
      views,
      externalActiveView,
      defaultFilterGroup,
      onViewChange,
      onViewSave,
      onViewUpdate,
      onViewDelete,
      onCreateView,
      onFilterGroupChange,
      enableCustomViews,
      setSorting,
      setColumnVisibility,
    },
    sorting,
    columnVisibility
  );

  // Fade effect on data/view changes
  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);
  const prevDataRef = React.useRef(data);
  const prevViewIdRef = React.useRef(viewsHook.activeView?.id);

  React.useEffect(() => {
    if (prevDataRef.current !== data || prevViewIdRef.current !== viewsHook.activeView?.id) {
      const el = tableBodyRef.current;
      if (el) {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = 'fade-in 150ms ease-out';
      }
      prevDataRef.current = data;
      prevViewIdRef.current = viewsHook.activeView?.id;
    }
  }, [data, viewsHook.activeView?.id]);

  // Build columns with selection and actions
  const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const cols: ColumnDef<TData, TValue>[] = [];

    if (enableRowSelection) {
      cols.push({
        id: 'select',
        header: ({ table }) => <DataTableRowSelection table={table} type="header" />,
        cell: ({ row }) => <DataTableRowSelection row={row} type="cell" />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    cols.push(...columns);

    if (rowActions && rowActions.length > 0) {
      cols.push({
        id: 'actions',
        header: () => null,
        cell: ({ row }) => <DataTableRowActions row={row} actions={rowActions} />,
        enableSorting: false,
        enableHiding: false,
        size: 50,
      });
    }

    return cols;
  }, [columns, enableRowSelection, rowActions]);

  // Extract sortable columns for sort menu
  const sortableColumns = React.useMemo(() => {
    return columns
      .filter((col) => col.enableSorting !== false)
      .map((col) => {
        const id = 'accessorKey' in col ? String(col.accessorKey) : col.id || '';
        let label = id;

        if (typeof col.header === 'string') {
          label = col.header;
        } else if ('header' in col && col.header) {
          label = id.charAt(0).toUpperCase() + id.slice(1);
        }

        return { id, label };
      })
      .filter((col) => col.id);
  }, [columns]);

  // Determine if we're doing server-side filtering
  const isServerSideFiltering = props.onSearchChange !== undefined;

  // Filter data based on advanced filters
  const filteredData = React.useMemo(() => {
    if (!enableAdvancedFilters || !viewsHook.filterGroup || isServerSideFiltering) {
      return data;
    }

    const filterFn = createDataFilterFn<TData>(viewsHook.filterGroup);

    return data.filter(filterFn);
  }, [data, enableAdvancedFilters, viewsHook.filterGroup, isServerSideFiltering]);

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: enablePagination ? paginationState : undefined,
    },
    enableRowSelection,
    onSortingChange: (updater) => {
      setSorting(updater);
      if (onSortingChange) {
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
        onSortingChange(newSorting);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      if (onRowSelectionChange) {
        const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
        onRowSelectionChange(newSelection);
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      setPaginationState(updater);
      if (onPaginationChange && enablePagination) {
        const newPagination = typeof updater === 'function' ? updater(paginationState) : updater;
        onPaginationChange(newPagination);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isServerSideFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableMultiSort,
    manualFiltering: isServerSideFiltering,
    manualPagination: finalPagination.pageCount !== undefined,
    pageCount: finalPagination.pageCount ?? -1,
  });

  // Sync external pageSize changes to internal state
  React.useEffect(() => {
    if (enablePagination && finalPagination.pageSize !== paginationState.pageSize) {
      setPaginationState((prev) => ({ ...prev, pageSize: finalPagination.pageSize }));
    }
  }, [finalPagination.pageSize, enablePagination, paginationState.pageSize]);

  // Wait for mount to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex h-100 flex-col items-center justify-center space-y-2">
        {loadingComponent || (
          <>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-raised border-t-brand" />
            <p className="text-sm text-fg-muted">Loading...</p>
          </>
        )}
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn(className)} data-slot="data-table">
        {loadingComponent || (
          <DataTableSkeleton
            columns={tableColumns.length}
            variant={finalVariant}
            density={finalDensity}
            showSelection={enableRowSelection}
            showActions={rowActions && rowActions.length > 0}
          />
        )}
      </div>
    );
  }

  // Determine if we should show the full UI even with no data
  const showToolbarWithEmptyData =
    (views && views.length > 0) || enableGlobalSearch || enableAdvancedFilters;

  // Empty state (only if we should hide toolbar)
  if (!isLoading && data.length === 0 && !showToolbarWithEmptyData) {
    return (
      <div className="flex h-100 flex-col items-center justify-center space-y-2">
        {emptyComponent || <p className="text-sm text-fg-muted">No data available</p>}
      </div>
    );
  }

  return (
    <div className={cn(className)} data-slot="data-table">
      {/* Filter Builder Dialog */}
      {enableAdvancedFilters && (
        <DataTableFilterBuilder
          open={viewsHook.isFilterBuilderOpen}
          onOpenChange={viewsHook.setIsFilterBuilderOpen}
          columns={columns as DataTableColumnDef<TData, TValue>[]}
          filterGroup={viewsHook.filterGroup}
          onApply={viewsHook.handleFilterGroupChange}
          locale={finalLocale}
        />
      )}

      {/* Save View Dialog */}
      {enableCustomViews && (
        <DataTableSaveViewDialog
          open={viewsHook.showSaveViewDialog}
          onOpenChange={viewsHook.setShowSaveViewDialog}
          currentState={{
            filters: viewsHook.filterGroup,
            sorting,
            columnVisibility,
          }}
          existingViews={views || []}
          onSave={(viewData) => {
            viewsHook.handleSaveView(viewData);
            setSearchOpen(false);
            setSearchValue('');
          }}
          locale={finalLocale}
        />
      )}

      {/* Rename View Dialog */}
      {enableCustomViews && (
        <DataTableRenameViewDialog
          open={viewsHook.showRenameViewDialog}
          onOpenChange={viewsHook.setShowRenameViewDialog}
          view={viewsHook.viewToRename}
          existingViews={views || []}
          onRename={viewsHook.handleSaveRename}
          locale={finalLocale}
        />
      )}

      {/* Table */}
      <div>
        {/* Actions Bar */}
        {!hideToolbar && (
          <DataTableActionsBar
            views={views}
            activeView={viewsHook.activeView}
            onViewChange={viewsHook.handleViewChange}
            onViewOverwrite={viewsHook.handleOverwriteView}
            onViewDuplicate={viewsHook.handleDuplicateView}
            onViewRename={viewsHook.handleRenameView}
            onViewDelete={onViewDelete}
            onCreateView={viewsHook.handleCreateView}
            enableCustomViews={enableCustomViews}
            searchOpen={searchOpen}
            onSearchOpenChange={setSearchOpen}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder={searchPlaceholder}
            sorting={sorting}
            onSortingChange={setSorting}
            sortableColumns={sortableColumns}
            filterCount={viewsHook.filterGroup ? countActiveFilters(viewsHook.filterGroup) : 0}
            onOpenFilterBuilder={() => viewsHook.setIsFilterBuilderOpen(true)}
            showInlineFilters={viewsHook.showInlineFilters}
            onToggleInlineFilters={() =>
              viewsHook.setShowInlineFilters(!viewsHook.showInlineFilters)
            }
            combineSearchAndFilters={combineSearchAndFilters}
            onSaveView={enableCustomViews ? () => viewsHook.setShowSaveViewDialog(true) : undefined}
            locale={finalLocale}
          />
        )}

        {/* Inline Filters */}
        {enableAdvancedFilters && viewsHook.showInlineFilters && (
          <DataTableReUIFilters
            columns={columns as DataTableColumnDef<TData, TValue>[]}
            filterGroup={viewsHook.filterGroup}
            onFilterChange={viewsHook.handleFilterGroupChange}
            locale={finalLocale}
            variant="outline"
            size="sm"
          />
        )}

        <div
          className={cn(
            'relative grid w-full',
            finalVariant === 'editable' && 'overflow-hidden rounded-lg border border-edge'
          )}
        >
          <Table
            className={cn(dataTableVariants({ variant: finalVariant, density: finalDensity }))}
          >
            {!hideHeaders && (
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{
                            width: header.getSize() !== 150 ? header.getSize() : undefined,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
            )}
            <TableBody ref={tableBodyRef}>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={onRowClick ? 'cursor-pointer hover:bg-raised/50' : ''}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      const isCheckbox = target.closest('[role="checkbox"]');
                      const isActions = target.closest('[data-slot="dropdown-menu-trigger"]');
                      const isButton = target.closest('button');
                      const isLink = target.closest('a');

                      if (!isCheckbox && !isActions && !isButton && !isLink && onRowClick) {
                        onRowClick(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                    {emptyComponent || <p className="text-sm text-fg-muted">No results.</p>}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Bulk Selection Bar */}
          {bulkActions && bulkActions.length > 0 && (
            <DataTableBulkSelectionBar
              table={table}
              bulkActions={bulkActions}
              locale={finalLocale}
            />
          )}
        </div>

        {/* Pagination */}
        {enablePagination && (
          <DataTablePagination
            table={table}
            pageSizeOptions={finalPagination.pageSizeOptions}
            locale={finalLocale}
          />
        )}
      </div>
    </div>
  );
}
