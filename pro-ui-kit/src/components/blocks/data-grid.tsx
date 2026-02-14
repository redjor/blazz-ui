"use client"

import { useState, useMemo, type ReactNode } from "react"
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { type BlockMeta } from "@/types/meta"

// ---------------------------------------------------------------------------
// Meta (used by AI tools + registry script)
// ---------------------------------------------------------------------------

export const __meta = {
  name: "DataGrid",
  description:
    "Table paginée côté serveur avec tri, sélection multiple et actions par ligne.",
  context: ["data-management", "dashboard"],
  dataComplexity: "paginated",
  dataShape: `{
    columns: ColumnDef<T>[],
    data: T[],
    totalCount: number,
    currentPage: number,
    pageSize?: number, // default 25
  }`,
  requires: ["Checkbox", "Skeleton", "EmptyState", "BulkActionBar"],
  pairs_with: ["FilterBar", "PageHeader", "BulkActionBar"],
  example_usage: `<DataGrid
  columns={clientColumns}
  data={clients}
  totalCount={totalCount}
  currentPage={page}
  pageSize={25}
  onPageChange={(p) => updateSearchParam("page", p)}
  onSort={(field, dir) => updateSearchParams({ sortField: field, sortDirection: dir })}
  selectable
  bulkActions={[
    { label: "Supprimer", action: deleteClients, variant: "destructive", confirm: true },
  ]}
  emptyState={<EmptyState title="Aucun client" action={{ label: "Créer", href: "/clients/new" }} />}
/>`,
} satisfies BlockMeta

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColumnDef<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  sortable?: boolean
  className?: string
}

export interface RowAction<T> {
  label: string
  icon?: ReactNode
  onClick: (row: T) => void
  variant?: "default" | "destructive"
  hidden?: (row: T) => boolean
}

export interface BulkAction {
  label: string
  action: (ids: string[]) => Promise<void>
  icon?: string
  variant?: "default" | "destructive"
  confirm?: boolean
}

export interface DataGridProps<T extends { id: string }> {
  columns: ColumnDef<T>[]
  data: T[]
  totalCount: number
  currentPage: number
  pageSize?: number
  onPageChange: (page: number) => void
  onSort?: (field: string, direction: "asc" | "desc") => void
  sortField?: string
  sortDirection?: "asc" | "desc"
  selectable?: boolean
  onSelectionChange?: (ids: string[]) => void
  actions?: RowAction<T>[]
  bulkActions?: BulkAction[]
  loading?: boolean
  emptyState?: ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DataGrid<T extends { id: string }>({
  columns,
  data,
  totalCount,
  currentPage,
  pageSize = 25,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  selectable = false,
  onSelectionChange,
  actions,
  bulkActions,
  loading = false,
  emptyState,
}: DataGridProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSelectAll = (checked: boolean) => {
    const next = checked ? new Set(data.map((r) => r.id)) : new Set<string>()
    setSelectedIds(next)
    onSelectionChange?.(Array.from(next))
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const next = new Set(selectedIds)
    checked ? next.add(id) : next.delete(id)
    setSelectedIds(next)
    onSelectionChange?.(Array.from(next))
  }

  const handleSort = (field: string) => {
    if (!onSort) return
    const nextDir =
      sortField === field && sortDirection === "asc" ? "desc" : "asc"
    onSort(field, nextDir)
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
        ))}
      </div>
    )
  }

  // Empty state
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  const allSelected = data.length > 0 && data.every((r) => selectedIds.has(r.id))

  return (
    <div className="space-y-4">
      {/* Bulk actions bar */}
      {selectable && selectedIds.size > 0 && bulkActions && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            {bulkActions.map((action) => (
              <button
                key={action.label}
                className={`text-sm ${action.variant === "destructive" ? "text-destructive" : ""}`}
                onClick={() => action.action(Array.from(selectedIds))}
              >
                {action.label}
              </button>
            ))}
          </div>
          <button
            className="ml-auto text-sm text-muted-foreground"
            onClick={() => handleSelectAll(false)}
          >
            Tout désélectionner
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`px-4 py-3 text-left font-medium ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  } ${col.className ?? ""}`}
                  onClick={() => col.sortable && handleSort(col.id)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="text-muted-foreground">
                        {sortField === col.id ? (
                          sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="w-12 px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className={`border-b transition-colors hover:bg-muted/30 ${
                  selectedIds.has(row.id) ? "bg-muted/20" : ""
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={(checked) =>
                        handleSelectRow(row.id, !!checked)
                      }
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.id} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    {/* Row actions dropdown — implement with Popover */}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {(currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, totalCount)} sur {totalCount}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded p-1 hover:bg-muted disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded p-1 hover:bg-muted disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
