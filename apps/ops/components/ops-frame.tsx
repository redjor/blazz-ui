"use client"

import type { ReactNode } from "react"
import { LayoutDashboard, Users, Clock, FileText } from "lucide-react"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import type { SidebarConfig } from "@blazz/ui/types/navigation"

const opsSidebarConfig: SidebarConfig = {
  navigation: [
    {
      id: "main",
      items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Clients", url: "/clients", icon: Users },
        { title: "Temps", url: "/time", icon: Clock },
        { title: "Récap", url: "/recap", icon: FileText },
      ],
    },
  ],
}

export function OpsFrame({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppFrame sidebarConfig={opsSidebarConfig} minimalTopBar>
        {children}
      </AppFrame>
    </SidebarProvider>
  )
}
