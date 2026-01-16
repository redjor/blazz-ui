"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DataTableView } from "./data-table.types"

interface DataTableViewSelectorProps {
  views: DataTableView[]
  activeView: DataTableView | null
  onViewChange: (view: DataTableView) => void
  onViewDelete?: (viewId: string) => void
  onCreateView?: () => void
  enableCustomViews?: boolean
}

export function DataTableViewSelector({
  views,
  activeView,
  onViewChange,
  onViewDelete,
  onCreateView,
  enableCustomViews = false,
}: DataTableViewSelectorProps) {
  return (
    <div className="flex items-center gap-1" data-slot="data-table-view-selector">
      {views.map((view) => (
        <div key={view.id} className="relative group">
          <button
            onClick={() => onViewChange(view)}
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
              onClick={(e) => {
                e.stopPropagation()
                onViewDelete(view.id)
              }}
              className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity hover:opacity-100 group-hover:flex group-hover:opacity-100"
            >
              <X className="h-2.5 w-2.5" />
              <span className="sr-only">Delete view</span>
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
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only">Create view</span>
        </Button>
      )}
    </div>
  )
}
