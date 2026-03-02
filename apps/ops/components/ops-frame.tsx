import type { ReactNode } from "react"
import Image from "next/image"
import { OpsNav } from "./ops-nav"

export function OpsFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface">
      <aside className="w-56 border-r border-edge flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-edge flex items-center gap-2">
          <Image src="/logo_blazz_gold.svg" alt="Blazz" width={60} height={17} priority />
          <span className="text-xs font-medium text-fg-muted">Ops</span>
        </div>
        <OpsNav />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
