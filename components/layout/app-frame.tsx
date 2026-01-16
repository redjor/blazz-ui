'use client'

import * as React from 'react'
import { Frame } from '@/components/layout/frame'
import { AppSidebarV2 } from '@/components/layout/app-sidebar-v2'
import { AppTopBar } from '@/components/layout/app-top-bar'
import { sidebarConfig } from '@/config/navigation'
import type { NavigationSection } from '@/types/navigation'

export interface AppFrameProps {
  navigation?: NavigationSection[]
  children: React.ReactNode
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
  onOpenCommandPalette?: () => void
}

/**
 * AppFrame - Composant Frame préconfiguré avec sidebar Polaris
 *
 * Ce composant combine automatiquement Frame, LayoutSidebar et AppTopBar
 * pour créer une mise en page d'application complète avec une largeur de sidebar de 240px.
 *
 * @example
 * ```tsx
 * import { AppFrame } from '@/components/layout/app-frame'
 * import { navigationConfig } from '@/config/navigation'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <AppFrame navigation={navigationConfig}>
 *       {children}
 *     </AppFrame>
 *   )
 * }
 * ```
 *
 * @example Avec footer personnalisé
 * ```tsx
 * <AppFrame
 *   navigation={navigationConfig}
 *   sidebarFooter={
 *     <div className="flex items-center gap-2 text-xs">
 *       <kbd>⌘K</kbd> to search
 *     </div>
 *   }
 * >
 *   {children}
 * </AppFrame>
 * ```
 */
export function AppFrame({
  navigation,
  children,
  sidebarHeader,
  sidebarFooter,
  onOpenCommandPalette,
}: AppFrameProps) {
  // Utiliser sidebarConfig par défaut, ou le merger avec navigation si fourni
  const config = React.useMemo(() => {
    if (navigation) {
      return {
        ...sidebarConfig,
        navigation,
      }
    }
    return sidebarConfig
  }, [navigation])

  return (
    <Frame
      topBar={<AppTopBar onOpenCommandPalette={onOpenCommandPalette} />}
      navigation={
        <AppSidebarV2
          config={config}
          collapsible="none"
        />
      }
    >
      {children}
    </Frame>
  )
}
