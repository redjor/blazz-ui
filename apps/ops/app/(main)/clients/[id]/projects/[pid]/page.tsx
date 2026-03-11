"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { use, useState } from "react"
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { useOpsTopBar } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { BudgetSection } from "@/components/budget-section"
import { computeBudgetMetrics } from "@/lib/budget"
import { ContractSection } from "@/components/contract-section"
import { ContractForm } from "@/components/contract-form"
import { computeContractMetrics } from "@/lib/contracts"
import { formatMinutes } from "@/lib/format"
import { getEffectiveStatus, type EntryStatus, ENTRY_STATUS_LABELS } from "@/lib/time-entry-status"
import { format, parseISO } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"

interface Props {
  params: Promise<{ id: string; pid: string }>
}


const STATUS_FILTERS: Array<{ key: EntryStatus | "all"; label: string }> = [
  { key: "all", label: "Tout" },
  { key: "draft", label: ENTRY_STATUS_LABELS.draft },
  { key: "ready_to_invoice", label: ENTRY_STATUS_LABELS.ready_to_invoice },
  { key: "invoiced", label: ENTRY_STATUS_LABELS.invoiced },
  { key: "paid", label: ENTRY_STATUS_LABELS.paid },
]

export default function ProjectDetailPage({ params }: Props) {
  const { id, pid } = use(params)
  const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
  const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
  const [editOpen, setEditOpen] = useState(false)
  const [contractOpen, setContractOpen] = useState(false)
  const activeContract = useQuery(api.contracts.getActiveByProject, {
    projectId: pid as Id<"projects">,
  })
  const allContracts = useQuery(api.contracts.listByProject, {
    projectId: pid as Id<"projects">,
  })
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all")

  useOpsTopBar(
    data != null
      ? [
          { label: "Clients", href: "/clients" },
          { label: client?.name ?? "...", href: `/clients/${id}` },
          { label: data.project.name },
        ]
      : null
  )

  // Loading state
  if (data === undefined) {
    return (
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
    )
  }

  // Error / not found
  if (data === null) {
    return <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
  }

  const { project, entries, stats } = data

  const budgetMetrics = computeBudgetMetrics({
    budgetAmount: project.budgetAmount,
    tjm: project.tjm,
    hoursPerDay: project.hoursPerDay,
    billableMinutes: stats.billableMinutes,
    billableRevenue: stats.billableRevenue,
  })

  const contractMetrics =
    activeContract && activeContract.type === "tma" && activeContract.daysPerMonth
      ? computeContractMetrics({
          daysPerMonth: activeContract.daysPerMonth,
          carryOver: activeContract.carryOver,
          startDate: activeContract.startDate,
          endDate: activeContract.endDate,
          hoursPerDay: project.hoursPerDay,
          entries: entries.map((e) => ({
            date: e.date,
            minutes: e.minutes,
            billable: e.billable,
          })),
        })
      : null

  const filteredEntries =
    statusFilter === "all"
      ? entries
      : entries.filter((e) => getEffectiveStatus(e) === statusFilter)

  const statusDot: Record<string, string> = {
    active: "bg-green-500",
    paused: "bg-amber-500",
    closed: "bg-fg-muted",
  }
  const statusLabel: Record<string, string> = {
    active: "Actif",
    paused: "En pause",
    closed: "Clôturé",
  }

  return (
    <>
      <div className="p-6 space-y-8">
        <div className="space-y-1.5">
          <PageHeader
            title={project.name}
            actions={[
              {
                label: "Modifier",
                variant: "outline",
                onClick: () => setEditOpen(true),
              },
            ]}
          />
          <span className="flex items-center gap-1.5 text-xs text-fg-muted">
            <span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
            {statusLabel[project.status]}
          </span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">CA total</p>
              <p className="text-xl font-semibold font-pixel">
                {stats.totalRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Facturé</p>
              <p className="text-xl font-semibold font-pixel text-green-600 dark:text-green-400">
                {stats.invoicedRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">À facturer</p>
              <p className="text-xl font-semibold font-pixel text-amber-600 dark:text-amber-400">
                {stats.pendingRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Heures</p>
              <p className="text-xl font-semibold font-pixel">
                {formatMinutes(stats.totalMinutes)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Budget section */}
        {budgetMetrics && (
            <BudgetSection
                metrics={budgetMetrics}
                tjm={project.tjm}
                weeklyBurnDown={data.weeklyBurnDown ?? null}
            />
        )}

        {/* Contract TMA section */}
        {activeContract && contractMetrics && (
          <ContractSection
            contract={activeContract}
            metrics={contractMetrics}
            daysPerMonth={activeContract.daysPerMonth!}
          />
        )}

        {/* Contract management */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-fg">Contrats</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setContractOpen(true)}
          >
            Nouveau contrat
          </Button>
        </div>

        {/* Past contracts list */}
        {allContracts && allContracts.filter((c) => c.status !== "active").length > 0 && (
          <div className="space-y-1">
            {allContracts
              .filter((c) => c.status !== "active")
              .map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between py-2 border-b border-edge last:border-0 text-xs text-fg-muted"
                >
                  <span className="font-mono">{c.startDate} → {c.endDate}</span>
                  <span>
                    {c.type === "tma" ? `${c.daysPerMonth}j/mois` : "Forfait"} ·{" "}
                    {c.status === "completed" ? "Terminé" : "Annulé"}
                  </span>
                </div>
              ))}
          </div>
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
            <div>
              {filteredEntries.map((entry) => {
                const revenue = Math.round((entry.minutes / 60) * entry.hourlyRate)
                const effectiveStatus = getEffectiveStatus(entry)
                return (
                  <div
                    key={entry._id}
                    className="flex items-center gap-4 py-2.5 border-b border-edge last:border-0"
                  >
                    <span className="text-xs font-mono text-fg-muted w-20 shrink-0">
                      {format(parseISO(entry.date), "dd/MM/yyyy")}
                    </span>
                    <span className="text-xs font-mono text-fg w-12 shrink-0">
                      {formatMinutes(entry.minutes)}
                    </span>
                    <span className="text-xs text-fg-muted flex-1 min-w-0 truncate">
                      {entry.description || "—"}
                    </span>
                    <span className="text-xs font-mono text-fg shrink-0">
                      {entry.billable ? `${revenue.toLocaleString("fr-FR")} €` : "—"}
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

      {/* New contract dialog */}
      <Dialog open={contractOpen} onOpenChange={setContractOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau contrat</DialogTitle>
          </DialogHeader>
          <ContractForm
            projectId={pid as Id<"projects">}
            onSuccess={() => setContractOpen(false)}
            onCancel={() => setContractOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
