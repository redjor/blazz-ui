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
        {onAddTab && (
          <button
            type="button"
            onClick={onAddTab}
            className={twMerge(
              "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
              addButtonClassName
            )}
            aria-label={addButtonLabel}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
