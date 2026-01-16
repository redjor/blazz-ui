'use client'

import * as React from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LayoutTopBarProps {
  onOpenCommandPalette?: () => void
  className?: string
}

/**
 * LayoutTopBar - Global header for the application
 *
 * Structure:
 * - Left: Logo + App Name
 * - Center: Search Bar (opens Command Palette)
 * - Right: Notifications + User Menu
 *
 * @example
 * <LayoutTopBar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
 */
export function LayoutTopBar({ onOpenCommandPalette, className }: LayoutTopBarProps) {
  return (
    <header className={cn('flex h-14 items-center justify-between bg-foreground px-4', className)}>
      {/* Left: Logo + App Name */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
          <span className="text-sm font-bold text-[#2C3338]">UI</span>
        </div>
        <span className="text-base font-semibold text-white">UI Boilerplate</span>
      </div>

      {/* Center: Search Bar */}
      <button
        onClick={onOpenCommandPalette}
        className="mx-4 flex max-w-md flex-1 items-center gap-2 rounded-lg bg-[#464C53] px-3 py-1.5 transition-colors hover:bg-[#505761]"
      >
        <Search className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-400">Search...</span>
        <kbd className="ml-auto hidden text-xs text-gray-400 md:inline-flex">⌘K</kbd>
      </button>

      {/* Right: Notifications + User Menu */}
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg p-2 transition-colors hover:bg-[#464C53]"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-gray-300" />
        </button>
        <button className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-[#464C53]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#95BF47] text-xs font-semibold text-white">
            U
          </div>
          <span className="hidden text-sm text-white md:inline-block">User</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </header>
  )
}
