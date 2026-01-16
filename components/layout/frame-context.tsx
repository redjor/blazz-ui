'use client'

import * as React from 'react'

export interface Breadcrumb {
  label: string
  href?: string
}

interface FrameContextValue {
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  breadcrumbs: Breadcrumb[]
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}

const FrameContext = React.createContext<FrameContextValue | undefined>(undefined)

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([])

  const toggleCommandPalette = React.useCallback(() => {
    setCommandPaletteOpen((prev) => !prev)
  }, [])

  const value = React.useMemo<FrameContextValue>(
    () => ({
      commandPaletteOpen,
      setCommandPaletteOpen,
      toggleCommandPalette,
      breadcrumbs,
      setBreadcrumbs,
    }),
    [commandPaletteOpen, toggleCommandPalette, breadcrumbs]
  )

  return <FrameContext.Provider value={value}>{children}</FrameContext.Provider>
}

export function useFrame() {
  const context = React.useContext(FrameContext)
  if (context === undefined) {
    throw new Error('useFrame must be used within a FrameProvider')
  }
  return context
}

export function useBreadcrumbs(breadcrumbs: Breadcrumb[]) {
  const { setBreadcrumbs } = useFrame()
  const breadcrumbsStr = JSON.stringify(breadcrumbs)

  React.useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breadcrumbsStr, setBreadcrumbs])

  React.useEffect(() => {
    return () => setBreadcrumbs([])
  }, [setBreadcrumbs])
}
