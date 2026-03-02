"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id, Doc } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { TimeEntryForm } from "@/components/time-entry-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import type { DataTableColumnDef, RowAction } from "@blazz/ui/components/blocks/data-table"
import { Pencil, RotateCcw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes } from "@/lib/format"

type TimeEntry = Doc<"timeEntries">

export default function TimePage() {
  const entries = useQuery(api.timeEntries.list, {})
  const remove = useMutation(api.timeEntries.remove)
  const unmarkInvoiced = useMutation(api.timeEntries.unmarkInvoiced)
  const [editing, setEditing] = useState<TimeEntry | null>(null)
  const [addOpen, setAddOpen] = useState(false)

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

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-fg">Saisie des heures</h1>
          <Button onClick={() => setAddOpen(true)}>Nouvelle entrée</Button>
        </div>

        {/* Table */}
        <DataTable
          data={entries ?? []}
          columns={columns}
          rowActions={rowActions}
          isLoading={entries === undefined}
          enableSorting
          enableGlobalSearch
          enablePagination
          pagination={{ pageSize: 25 }}
          searchPlaceholder="Rechercher…"
          locale="fr"
          defaultSorting={[{ id: "date", desc: true }]}
        />
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle entrée</DialogTitle>
          </DialogHeader>
          <TimeEntryForm onSuccess={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
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
            />
          )}
        </DialogContent>
      </Dialog>
    </OpsFrame>
  )
}
