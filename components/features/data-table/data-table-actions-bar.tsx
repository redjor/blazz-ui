"use client"

import * as React from "react"
import type { SortingState } from "@tanstack/react-table"
import { Search, SlidersHorizontal, ArrowUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
} from "@/components/ui/menu"
import type { DataTableView } from "./data-table.types"
import { DataTableSortMenu } from "./data-table-sort-menu"

interface DataTableActionsBarProps {
  // Views
  views?: DataTableView[]
  activeView?: DataTableView | null
  onViewChange?: (view: DataTableView) => void
  onViewDelete?: (viewId: string) => void
  onCreateView?: () => void
  enableCustomViews?: boolean

  // Search
  searchOpen: boolean
  onSearchOpenChange: (open: boolean) => void
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string

  // Sort
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  sortableColumns: Array<{ id: string; label: string }>

  // Filters
  filterCount: number
  onOpenFilterBuilder: () => void
}

export function DataTableActionsBar({
  views,
  activeView,
  onViewChange,
  onViewDelete,
  onCreateView,
  enableCustomViews = false,
  searchOpen,
  onSearchOpenChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Recherche...",
  sorting,
  onSortingChange,
  sortableColumns,
  filterCount,
  onOpenFilterBuilder,
}: DataTableActionsBarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  // Focus search input when search opens
  React.useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Handle Escape key to close search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        onSearchOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen, onSearchOpenChange])

  return (
    <div className="border-b border-border" data-slot="data-table-actions-bar">
      {/* Main Actions Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Views */}
        <div className="flex items-center gap-1">
          {views && views.length > 0 ? (
            <>
              {views.map((view) => (
                <div key={view.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => onViewChange?.(view)}
                    className={cn(
                      "relative inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                      activeView?.id === view.id
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <span>{view.name}</span>
                  </button>

                  {/* Delete button for custom views */}
                  {!view.isSystem && onViewDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDelete(view.id)
                      }}
                      className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity hover:opacity-100 group-hover:flex group-hover:opacity-100"
                      aria-label="Delete view"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Create View Button */}
              {enableCustomViews && onCreateView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateView}
                  className="h-8 px-2"
                  aria-label="Create view"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          ) : null}
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-1">
          {/* Search Icon */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onSearchOpenChange(!searchOpen)}
            className={cn(
              "h-8 w-8",
              searchOpen && "bg-accent text-accent-foreground"
            )}
            aria-label="Toggle search"
            aria-expanded={searchOpen}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Filters Icon */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenFilterBuilder}
            className="relative h-8 w-8"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filterCount > 0 && (
              <Badge
                variant="default"
                className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] font-medium flex items-center justify-center"
              >
                {filterCount}
              </Badge>
            )}
          </Button>

          {/* Sort Icon */}
          <Menu>
            <MenuTrigger
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              aria-label="Sort options"
            >
              <ArrowUpDown className="h-4 w-4" />
            </MenuTrigger>
            <MenuPortal>
              <MenuPositioner sideOffset={8}>
                <MenuPopup>
                  <DataTableSortMenu
                    columns={sortableColumns}
                    sorting={sorting}
                    onSortingChange={onSortingChange}
                  />
                </MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </Menu>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div
          className="border-t border-border px-4 py-3 animate-in slide-in-from-top-2 duration-200"
          data-state="open"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10 pl-9 pr-9"
                aria-label="Search"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                onSearchOpenChange(false)
                onSearchChange("")
              }}
              className="h-10"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
