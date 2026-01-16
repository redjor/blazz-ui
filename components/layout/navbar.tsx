'use client'

import { cn } from '@/lib/utils/cn'

export interface NavbarProps {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
  className?: string
  bgColor?: string
}

/**
 * Navbar - Three-column grid navigation bar with Shopify-style centering
 *
 * Usage:
 * <Navbar
 *   left={<Logo />}
 *   center={<NavTabs tabs={tabs} />}
 *   right={<UserMenu />}
 * />
 */
export function Navbar({
  left,
  center,
  right,
  className,
  bgColor = 'bg-bb-dark-green'
}: NavbarProps) {
  return (
    <nav className={cn('sticky top-0 z-50', bgColor, className)}>
      <div className="grid grid-cols-[minmax(min-content,1fr)_auto_minmax(min-content,1fr)] items-center gap-4 px-6 py-3">
        {/* Left section (Logo) */}
        <div className="flex items-center">
          {left}
        </div>

        {/* Center section (Navigation tabs) */}
        <div className="flex items-center justify-center">
          {center}
        </div>

        {/* Right section (User menu, DateTime, etc.) */}
        <div className="flex items-center justify-end gap-4">
          {right}
        </div>
      </div>
    </nav>
  )
}
