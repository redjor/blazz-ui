import type { ReactNode } from "react"
import { OpsNav } from "./ops-nav"

export function OpsFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface">
      <aside className="w-56 border-r border-edge flex flex-col shrink-0">
        <div className="p-4 border-b border-edge">
          <span className="font-semibold text-sm text-fg">Blazz Ops</span>
        </div>
        <OpsNav />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
