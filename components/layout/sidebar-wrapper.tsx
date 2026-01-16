'use client'

import { usePathname, useSearchParams } from 'next/navigation'

import { Sidebar } from './sidebar'

/**
 * SidebarWrapper - Wrapper client-side pour passer les searchParams à Sidebar
 * Permet à la Sidebar de rester un composant SSR tout en réagissant aux changements d'URL
 */
export function SidebarWrapper() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const clientId = searchParams.get('clientId')

  // Cacher la sidebar sur la page de confirmation
  if (pathname === '/confirm') {
    return null
  }

  return <Sidebar clientId={clientId} />
}
