"use client"

import { Plus } from "lucide-react"
import type * as React from "react"
import { twMerge } from "tailwind-merge"

interface TabsBarProps {
  children: React.ReactNode
  onAddTab?: () => void
  addButtonLabel?: string
  className?: string
  addButtonClassName?: string
}

export function TabsBar({
  children,
  onAddTab,
  addButtonLabel = "Open new tab",
  className,
  addButtonClassName,
}: TabsBarProps) {
  return (
    <div
      className={twMerge(
        "flex h-9 shrink-0 items-center border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
        {children}
      </div>
      {onAddTab && (
        <button
          type="button"
          onClick={onAddTab}
          className={twMerge(
            "flex h-9 w-9 shrink-0 items-center justify-center border-l border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900",
            addButtonClassName
          )}
          aria-label={addButtonLabel}
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
