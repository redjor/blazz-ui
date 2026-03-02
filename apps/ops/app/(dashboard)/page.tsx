"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes } from "@/lib/format"

export default function DashboardPage() {
  const now = new Date()
  const from = format(startOfMonth(now), "yyyy-MM-dd")
  const to = format(endOfMonth(now), "yyyy-MM-dd")

  const monthEntries = useQuery(api.timeEntries.list, { from, to })
  const activeProjects = useQuery(api.projects.listActive)
  const recentEntries = useQuery(api.timeEntries.recent, { limit: 10 })

  const totalMinutes = monthEntries?.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0) ?? 0
  const totalAmount = monthEntries?.filter((e) => e.billable).reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <h1 className="text-xl font-semibold text-fg capitalize">
          {format(now, "MMMM yyyy", { locale: fr })}
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-edge bg-raised p-5">
            <p className="text-xs text-fg-muted uppercase tracking-wide mb-1">Heures ce mois</p>
            <p className="text-3xl font-semibold text-fg">{formatMinutes(totalMinutes)}</p>
          </div>
          <div className="rounded-xl border border-edge bg-raised p-5">
            <p className="text-xs text-fg-muted uppercase tracking-wide mb-1">Facturable ce mois</p>
            <p className="text-3xl font-semibold text-fg">{totalAmount.toFixed(0)}€</p>
          </div>
        </div>

        {/* Active projects */}
        {(activeProjects?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-fg">Projets actifs</h2>
            <div className="space-y-2">
              {activeProjects?.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 rounded-lg border border-edge bg-raised">
                  <p className="text-sm font-medium text-fg">{project.name}</p>
                  <p className="text-xs text-fg-muted">{project.tjm}€/j · {project.hoursPerDay}h/j</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent entries */}
        {(recentEntries?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h2 className="font-medium text-fg">Entrées récentes</h2>
            <div className="space-y-0">
              {recentEntries?.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between py-2.5 border-b border-edge last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-fg-muted w-20 shrink-0">
                      {format(new Date(entry.date + "T00:00:00"), "dd MMM", { locale: fr })}
                    </span>
                    <span className="text-sm text-fg">{entry.description ?? "—"}</span>
                  </div>
                  <span className="text-sm font-mono text-fg-muted">{formatMinutes(entry.minutes)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {monthEntries?.length === 0 && activeProjects?.length === 0 && (
          <p className="text-fg-muted text-sm">Pas encore de données. Créez un client et des projets pour commencer.</p>
        )}
      </div>
    </OpsFrame>
  )
}
