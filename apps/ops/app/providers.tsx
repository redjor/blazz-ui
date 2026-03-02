"use client"

import type { ReactNode } from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { ThemeProvider } from "next-themes"
import { ThemePaletteProvider } from "@blazz/ui/lib/theme-context"
import { Toaster } from "sonner"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <ThemePaletteProvider>
          {children}
          <Toaster richColors />
        </ThemePaletteProvider>
      </ThemeProvider>
    </ConvexProvider>
  )
}
