"use client"

import { BarChartBlock } from "@blazz/ui/components/blocks/bar-chart-block"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { use, useState } from "react"
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { OpsFrame } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { getEffectiveStatus, type EntryStatus, ENTRY_STATUS_LABELS } from "@/lib/time-entry-status"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"

interface Props {
  params: Promise<{ id: string; pid: string }>
}

const chartConfig = {
  heures: { label: "Heures", color: "var(--chart-1)" },
  ca: { label: "CA (€)", color: "var(--chart-2)" },
}

const STATUS_FILTERS: Array<{ key: EntryStatus | "all"; label: string }> = [
  { key: "all", label: "Tout" },
  { key: "draft", label: ENTRY_STATUS_LABELS.draft },
  { key: "ready_to_invoice", label: ENTRY_STATUS_LABELS.ready_to_invoice },
  { key: "invoiced", label: ENTRY_STATUS_LABELS.invoiced },
  { key: "paid", label: ENTRY_STATUS_LABELS.paid },
]

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`
}

export default function ProjectDetailPage({ params }: Props) {
  const { id, pid } = use(params)
  const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
  const [editOpen, setEditOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all")

  // Loading state
  if (data === undefined) {
    return (
      <OpsFrame>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded" />
            ))}
          </div>
        </div>
      </OpsFrame>
    )
  }

  // Error / not found
  if (data === null) {
    return (
      <OpsFrame>
        <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
      </OpsFrame>
    )
  }

  const { project, entries, stats, monthlyData } = data

  const filteredEntries =
    statusFilter === "all"
      ? entries
      : entries.filter((e) => getEffectiveStatus(e) === statusFilter)

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <PageHeader
          breadcrumbs={[
            { label: "Clients", href: "/clients" },
            { label: "Client", href: `/clients/${id}` },
            { label: project.name },
          ]}
          title={project.name}
          actions={[
            {
              label: "Modifier",
              variant: "outline",
              onClick: () => setEditOpen(true),
            },
          ]}
        />

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">CA total</p>
              <p className="text-xl font-semibold tabular-nums">
                {stats.totalRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Facturé</p>
              <p className="text-xl font-semibold tabular-nums text-green-600 dark:text-green-400">
                {stats.invoicedRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">À facturer</p>
              <p className="text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {stats.pendingRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Heures</p>
              <p className="text-xl font-semibold tabular-nums">
                {formatMinutes(stats.totalMinutes)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly bar chart */}
        {monthlyData.length > 0 && (
          <BarChartBlock
            title="Activité mensuelle"
            data={monthlyData}
            config={chartConfig}
            xKey="month"
          />
        )}

        {/* Timeline of entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-fg">Entrées de temps</h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === key
                      ? "bg-brand text-white"
                      : "bg-surface border border-edge text-fg-muted hover:text-fg"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <p className="text-sm text-fg-muted py-4">Aucune entrée pour ce filtre.</p>
          ) : (
            <div className="space-y-0">
              {filteredEntries.map((entry) => {
                const revenue = Math.round((entry.minutes / 60) * entry.hourlyRate)
                const effectiveStatus = getEffectiveStatus(entry)
                return (
                  <div
                    key={entry._id}
                    className="flex items-center gap-4 py-2.5 border-b border-edge last:border-0"
                  >
                    <span className="text-xs tabular-nums text-fg-muted w-20 shrink-0">
                      {entry.date}
                    </span>
                    <span className="text-xs tabular-nums text-fg w-12 shrink-0">
                      {formatMinutes(entry.minutes)}
                    </span>
                    <span className="text-xs text-fg-muted flex-1 min-w-0 truncate">
                      {entry.description || "—"}
                    </span>
                    <span className="text-xs tabular-nums text-fg shrink-0">
                      {entry.billable ? `${revenue} €` : "—"}
                    </span>
                    <div className="shrink-0 w-28">
                      <EntryStatusBadge status={effectiveStatus} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit project dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          <ProjectForm
            clientId={project.clientId}
            defaultValues={{ ...project, id: project._id }}
            onSuccess={() => setEditOpen(false)}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </OpsFrame>
  )
}
