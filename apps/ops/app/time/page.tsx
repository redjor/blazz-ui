"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id, Doc } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { TimeEntryForm } from "@/components/time-entry-form"
import { WeekGrid } from "@/components/week-grid"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import type { DataTableColumnDef, RowAction } from "@blazz/ui/components/blocks/data-table"
import { ChevronLeft, ChevronRight, Pencil, RotateCcw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format, startOfWeek, addWeeks, subWeeks, addDays } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes } from "@/lib/format"

type TimeEntry = Doc<"timeEntries">

type View = "list" | "week"

function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export default function TimePage() {
  const [view, setView] = useState<View>("week")
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))

  const weekFrom = format(weekStart, "yyyy-MM-dd")
  const weekTo = format(addDays(weekStart, 6), "yyyy-MM-dd")
  const weekEntries = useQuery(
    api.timeEntries.list,
    view === "week" ? { from: weekFrom, to: weekTo } : "skip"
  )
  const activeProjects = useQuery(api.projects.listActive)

  const allEntries = useQuery(
    api.timeEntries.list,
    view === "list" ? {} : "skip"
  )

  const remove = useMutation(api.timeEntries.remove)
  const unmarkInvoiced = useMutation(api.timeEntries.unmarkInvoiced)

  const [editing, setEditing] = useState<TimeEntry | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const [quickModal, setQuickModal] = useState<{
    open: boolean
    projectId: Id<"projects"> | null
    projectName: string | null
    hourlyRate: number | null
    date: string | null
  }>({ open: false, projectId: null, projectName: null, hourlyRate: null, date: null })

  const columns = useMemo<DataTableColumnDef<TimeEntry>[]>(() => [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.date + "T00:00:00"), "dd MMM yyyy", { locale: fr }),
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description ?? "—",
    },
    {
      accessorKey: "minutes",
      header: "Durée",
      cell: ({ row }) => (
        <span className="font-mono">{formatMinutes(row.original.minutes)}</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "hourlyRate",
      header: "Taux",
      cell: ({ row }) => `${row.original.hourlyRate}€/h`,
      enableSorting: true,
    },
    {
      id: "amount",
      header: "Montant",
      cell: ({ row }) => {
        const amount = (row.original.minutes / 60) * row.original.hourlyRate
        return <span className="font-mono">{amount.toFixed(2)}€</span>
      },
    },
    {
      accessorKey: "billable",
      header: "Facturable",
      cell: ({ row }) =>
        row.original.billable ? null : <Badge variant="secondary">Non facturable</Badge>,
    },
    {
      accessorKey: "invoicedAt",
      header: "Statut",
      cell: ({ row }) =>
        row.original.invoicedAt ? <Badge variant="default">Facturé</Badge> : null,
    },
  ], [])

  const rowActions = useMemo<RowAction<TimeEntry>[]>(() => [
    {
      id: "edit",
      label: "Modifier",
      icon: Pencil,
      handler: (row) => setEditing(row.original),
    },
    {
      id: "unmark-invoiced",
      label: "Annuler facturation",
      icon: RotateCcw,
      hidden: (row) => !row.original.invoicedAt,
      handler: async (row) => {
        try {
          await unmarkInvoiced({ ids: [row.original._id] })
          toast.success("Facturation annulée")
        } catch {
          toast.error("Erreur")
        }
      },
    },
    {
      id: "delete",
      label: "Supprimer",
      icon: Trash2,
      variant: "destructive",
      separator: true,
      requireConfirmation: true,
      confirmationMessage: () => "Supprimer cette entrée ? Cette action est irréversible.",
      handler: async (row) => {
        try {
          await remove({ id: row.original._id })
          toast.success("Entrée supprimée")
        } catch {
          toast.error("Erreur lors de la suppression")
        }
      },
    },
  ], [remove, unmarkInvoiced])

  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6)
    const sameMonth = weekStart.getMonth() === end.getMonth()
    const startStr = format(weekStart, sameMonth ? "d" : "d MMM", { locale: fr })
    const endStr = format(end, "d MMM yyyy", { locale: fr })
    return `${startStr} – ${endStr}`
  }, [weekStart])

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-fg">Saisie des heures</h1>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-edge overflow-hidden">
              <button
                type="button"
                onClick={() => setView("week")}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  view === "week"
                    ? "bg-brand text-white"
                    : "bg-raised text-fg-muted hover:text-fg"
                }`}
              >
                Semaine
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  view === "list"
                    ? "bg-brand text-white"
                    : "bg-raised text-fg-muted hover:text-fg"
                }`}
              >
                Liste
              </button>
            </div>
            <Button onClick={() => setAddOpen(true)}>Nouvelle entrée</Button>
          </div>
        </div>

        {view === "week" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setWeekStart((w) => subWeeks(w, 1))}
                className="p-1.5 rounded-md border border-edge bg-raised hover:bg-surface transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-fg-muted" />
              </button>
              <span className="text-sm font-medium text-fg min-w-[160px] text-center capitalize">
                {weekLabel}
              </span>
              <button
                type="button"
                onClick={() => setWeekStart((w) => addWeeks(w, 1))}
                className="p-1.5 rounded-md border border-edge bg-raised hover:bg-surface transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-fg-muted" />
              </button>
              <button
                type="button"
                onClick={() => setWeekStart(getWeekStart(new Date()))}
                className="text-xs text-fg-muted hover:text-fg transition-colors ml-1"
              >
                Aujourd'hui
              </button>
            </div>

            <div className={weekEntries === undefined ? "opacity-50 pointer-events-none" : ""}>
              <WeekGrid
                weekStart={weekStart}
                entries={weekEntries ?? []}
                projects={activeProjects ?? []}
                onCellClick={(projectId, date) => {
                  const project = activeProjects?.find((p) => p._id === projectId)
                  if (!project) return
                  setQuickModal({
                    open: true,
                    projectId,
                    projectName: project.name,
                    hourlyRate: project.hoursPerDay > 0 ? project.tjm / project.hoursPerDay : project.tjm / 8,
                    date,
                  })
                }}
              />
            </div>
          </div>
        )}

        {view === "list" && (
          <DataTable
            data={allEntries ?? []}
            columns={columns}
            rowActions={rowActions}
            isLoading={allEntries === undefined}
            enableSorting
            enableGlobalSearch
            enablePagination
            pagination={{ pageSize: 25 }}
            searchPlaceholder="Rechercher…"
            locale="fr"
            defaultSorting={[{ id: "date", desc: true }]}
          />
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle entrée</DialogTitle>
          </DialogHeader>
          <TimeEntryForm onSuccess={() => setAddOpen(false)} onCancel={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'entrée</DialogTitle>
          </DialogHeader>
          {editing && (
            <TimeEntryForm
              defaultValues={{
                id: editing._id,
                projectId: editing.projectId,
                date: editing.date,
                minutes: editing.minutes,
                description: editing.description,
                billable: editing.billable,
              }}
              onSuccess={() => setEditing(null)}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <QuickTimeEntryModal
        open={quickModal.open}
        onOpenChange={(open) => setQuickModal((s) => ({ ...s, open }))}
        projectId={quickModal.projectId}
        projectName={quickModal.projectName}
        hourlyRate={quickModal.hourlyRate}
        date={quickModal.date}
      />
    </OpsFrame>
  )
}
