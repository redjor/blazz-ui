"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@blazz/ui/lib/utils"
import { PREVIEW_REGISTRY } from "./preview-registry"

interface PlaygroundPreviewProps {
  className?: string
}

export function PlaygroundPreview({ className }: PlaygroundPreviewProps) {
  // Set of active component IDs (default: components with defaultActive=true)
  const [activeIds, setActiveIds] = useState<Set<string>>(
    () => new Set(PREVIEW_REGISTRY.filter((e) => e.defaultActive).map((e) => e.id)),
  )
  const [search, setSearch] = useState("")

  // Filter registry by search term
  const filteredRegistry = useMemo(() => {
    if (!search.trim()) return PREVIEW_REGISTRY
    const q = search.toLowerCase()
    return PREVIEW_REGISTRY.filter((e) => e.label.toLowerCase().includes(q))
  }, [search])

  // Toggle a component on/off
  const toggleComponent = (id: string) => {
    setActiveIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Active entries in registry order
  const activeEntries = PREVIEW_REGISTRY.filter((e) => activeIds.has(e.id))

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
      {/* Topbar: search + chips */}
      <div className="flex items-center gap-2 border-b border-separator px-4 py-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search components..."
            className="w-full rounded-md border border-edge-subtle bg-raised py-1 pl-7 pr-2 text-xs text-fg placeholder:text-fg-subtle focus:border-brand focus:outline-none"
          />
        </div>

        {/* Component chips from filtered results */}
        <div className="flex flex-wrap items-center gap-1">
          {filteredRegistry.map((entry) => {
            const isActive = activeIds.has(entry.id)
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => toggleComponent(entry.id)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-medium transition-colors",
                  isActive
                    ? "bg-brand text-brand-fg"
                    : "bg-raised text-fg-muted hover:text-fg",
                )}
              >
                {entry.label}
                {isActive && <X className="size-2.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview grid */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {activeEntries.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-fg-muted">
            No components selected. Use the search bar to add components.
          </div>
        ) : (
          <div className="space-y-6">
            {activeEntries.map((entry) => {
              const Comp = entry.component
              return (
                <section key={entry.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-fg">{entry.label}</h3>
                    <button
                      type="button"
                      onClick={() => toggleComponent(entry.id)}
                      className="text-fg-subtle hover:text-fg transition-colors"
                      aria-label={`Remove ${entry.label}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="rounded-lg border border-separator bg-surface p-4">
                    <Comp />
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
