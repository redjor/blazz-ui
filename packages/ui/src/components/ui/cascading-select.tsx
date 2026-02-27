"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface CascadingSelectNode {
  id: string
  label: string
  children?: CascadingSelectNode[]
}

export interface CascadingSelectProps {
  nodes: CascadingSelectNode[]
  value?: string
  onValueChange?: (id: string) => void
  placeholder?: string
  className?: string
}

function findPath(
  nodes: CascadingSelectNode[],
  id: string
): CascadingSelectNode[] | null {
  for (const node of nodes) {
    if (node.id === id) return [node]
    if (node.children) {
      const sub = findPath(node.children, id)
      if (sub) return [node, ...sub]
    }
  }
  return null
}

export function CascadingSelect({
  nodes,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
}: CascadingSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [path, setPath] = React.useState<CascadingSelectNode[]>([])

  const currentItems =
    path.length === 0 ? nodes : (path[path.length - 1].children ?? [])

  const selectedPath = value ? findPath(nodes, value) : null
  const triggerLabel = selectedPath
    ? selectedPath.map((n) => n.label).join(" › ")
    : placeholder

  function handleSelect(node: CascadingSelectNode) {
    onValueChange?.(node.id)
    setOpen(false)
  }

  function handleDrillDown(e: React.MouseEvent, node: CascadingSelectNode) {
    e.stopPropagation()
    setPath((prev) => [...prev, node])
  }

  function handleBack() {
    setPath((prev) => prev.slice(0, -1))
  }

  function handleBreadcrumbJump(index: number) {
    setPath((prev) => prev.slice(0, index + 1))
  }

  React.useEffect(() => {
    if (!open) setPath([])
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "focus-visible:border-brand focus-visible:ring-brand/20 border-field bg-surface hover:bg-raised hover:text-fg aria-expanded:bg-raised aria-expanded:text-fg rounded-lg border bg-clip-padding text-sm font-medium focus-visible:ring-[3px] inline-flex items-center justify-between whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none select-none gap-1.5 px-2.5 h-8 w-full",
          !selectedPath && "text-fg-muted",
          className
        )}
        role="combobox"
        aria-expanded={open}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        {path.length > 0 && (
          <div className="flex items-center gap-1.5 border-b border-edge px-2 py-2">
            <button
              type="button"
              onClick={handleBack}
              className="text-fg-muted hover:text-fg rounded p-0.5 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {path.map((node, i) => (
              <React.Fragment key={node.id}>
                {i > 0 && (
                  <ChevronRight className="h-3 w-3 shrink-0 text-fg-muted" />
                )}
                {i < path.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbJump(i)}
                    className="text-xs text-fg-muted transition-colors hover:text-fg"
                  >
                    {node.label}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-fg">
                    {node.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="max-h-64 overflow-y-auto py-1">
          {currentItems.length === 0 ? (
            <p className="px-3 py-2 text-xs text-fg-muted">No items</p>
          ) : (
            currentItems.map((node) => (
              <div key={node.id} className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => handleSelect(node)}
                  className={cn(
                    "flex-1 rounded-l-md px-3 py-1.5 text-left text-sm transition-colors hover:bg-raised",
                    value === node.id && "font-medium text-brand"
                  )}
                >
                  {node.label}
                </button>
                {node.children?.length ? (
                  <button
                    type="button"
                    onClick={(e) => handleDrillDown(e, node)}
                    className="rounded-r-md border-l border-edge/40 px-2.5 py-1.5 text-fg-muted transition-colors hover:bg-raised hover:text-fg"
                    aria-label={`Expand ${node.label}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
