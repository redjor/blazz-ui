"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { TimeEntryForm } from "@/components/time-entry-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes } from "@/lib/format"

export default function TimePage() {
  const entries = useQuery(api.timeEntries.list, {})
  const remove = useMutation(api.timeEntries.remove)

  const handleDelete = async (id: Id<"timeEntries">) => {
    try {
      await remove({ id })
      toast.success("Entrée supprimée")
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <h1 className="text-xl font-semibold text-fg">Saisie des heures</h1>

        {/* Form */}
        <div className="rounded-xl border border-edge bg-raised p-6 max-w-lg">
          <h2 className="font-medium text-fg mb-4">Nouvelle entrée</h2>
          <TimeEntryForm />
        </div>

        {/* History */}
        <div className="space-y-3">
          <h2 className="font-medium text-fg">Historique</h2>

          {entries === undefined && <p className="text-fg-muted text-sm">Chargement…</p>}
          {entries?.length === 0 && <p className="text-fg-muted text-sm">Aucune entrée pour l'instant.</p>}

          <div className="space-y-2">
            {entries?.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-fg-muted w-20 shrink-0">
                    {format(new Date(entry.date + "T00:00:00"), "dd MMM", { locale: fr })}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-fg">{entry.description ?? "—"}</p>
                    <p className="text-xs text-fg-muted mt-0.5">
                      {formatMinutes(entry.minutes)} · {entry.hourlyRate}€/h · {((entry.minutes / 60) * entry.hourlyRate).toFixed(2)}€
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!entry.billable && <Badge variant="secondary">Non facturable</Badge>}
                  {entry.invoicedAt && <Badge variant="default">Facturé</Badge>}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-fg-muted hover:text-destructive"
                    onClick={() => handleDelete(entry._id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OpsFrame>
  )
}
