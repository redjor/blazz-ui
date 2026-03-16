"use client"

import { X } from "lucide-react"
import type * as React from "react"
import { twMerge } from "tailwind-merge"

interface TabsItemProps {
  title: string
  icon?: React.ReactNode
  isActive: boolean
  onClick: () => void
  onClose?: () => void
  className?: string
  activeClassName?: string
  closeButtonClassName?: string
}

export function TabsItem({
  title,
  icon,
  isActive,
  onClick,
  onClose,
  className,
  activeClassName,
  closeButtonClassName,
}: TabsItemProps) {
  return (
    <div
      className={twMerge(
        "group relative flex w-36 items-center rounded-lg text-xs transition-colors",
        isActive
          ? twMerge("bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100", activeClassName)
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        className
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={twMerge("flex h-7 min-w-0 flex-1 cursor-pointer items-center gap-1.5 truncate pl-2", onClose ? "pr-1" : "pr-2")}
      >
        {icon && <span className="shrink-0 opacity-60 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
        <span className="block truncate" style={{ maxWidth: 120 }}>{title}</span>
      </button>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={twMerge(
            "mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700",
            "opacity-0 group-hover:opacity-100",
            closeButtonClassName
          )}
          aria-label={`Close ${title}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
