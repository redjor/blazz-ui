"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { FilterGroup } from "./data-table.types"
import { countActiveFilters } from "./data-table.utils"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  enableGlobalSearch?: boolean
  filterGroup?: FilterGroup | null
  onFilterGroupChange?: (filterGroup: FilterGroup | null) => void
  onOpenFilterBuilder?: () => void
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  enableGlobalSearch = true,
  filterGroup,
  onFilterGroupChange,
  onOpenFilterBuilder,
  children,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = React.useState("")
  const activeFiltersCount = filterGroup ? countActiveFilters(filterGroup) : 0

  // Debounce search
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(searchValue)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue, table])

  const handleClearSearch = () => {
    setSearchValue("")
    table.setGlobalFilter("")
  }

  const handleClearFilters = () => {
    if (onFilterGroupChange) {
      onFilterGroupChange(null)
    }
  }

  return (
    <div className="space-y-3" data-slot="data-table-toolbar">
      {/* Search Bar - Full Width */}
      {enableGlobalSearch && (
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-10 pl-9 pr-9"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      )}

      {/* Filters Row */}
      <div className="flex items-center gap-2">
        {/* Custom toolbar actions (View selector, etc.) */}
        {children}

        {/* Filter Button */}
        {onOpenFilterBuilder && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilterBuilder}
            className="relative h-8"
          >
            Ajouter un filtre +
            {activeFiltersCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        )}

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8">
            Clear filters
            <X className="ml-2 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
