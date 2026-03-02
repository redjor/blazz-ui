"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { Button } from "@blazz/ui/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { toast } from "sonner"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Download, CheckCheck } from "lucide-react"
import { formatMinutes } from "@/lib/format"

function getPeriodDates(preset: string): { from: string; to: string } | null {
  const now = new Date()
  if (preset === "current") {
    return {
      from: format(startOfMonth(now), "yyyy-MM-dd"),
      to: format(endOfMonth(now), "yyyy-MM-dd"),
    }
  }
  if (preset === "last") {
    const last = subMonths(now, 1)
    return {
      from: format(startOfMonth(last), "yyyy-MM-dd"),
      to: format(endOfMonth(last), "yyyy-MM-dd"),
    }
  }
  return null
}

export default function RecapPage() {
  const [clientId, setClientId] = useState<string>("")
  const [projectId, setProjectId] = useState<string>("")
  const [period, setPeriod] = useState("current")
  const [from, setFrom] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"))
  const [to, setTo] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"))

  const clients = useQuery(api.clients.list)
  const clientProjects = useQuery(
    api.projects.listByClient,
    clientId ? { clientId: clientId as Id<"clients"> } : "skip"
  )
  const markInvoiced = useMutation(api.timeEntries.markInvoiced)

  const periodDates = period !== "custom" ? getPeriodDates(period) : { from, to }

  const entries = useQuery(api.timeEntries.listForRecap, {
    projectId: projectId ? (projectId as Id<"projects">) : undefined,
    from: periodDates?.from,
    to: periodDates?.to,
  })

  // Filter by client client-side if client selected but no project selected
  const filteredEntries =
    !projectId && clientId && clientProjects
      ? entries?.filter((e) => clientProjects.some((p) => p._id === e.projectId))
      : entries

  const totalMinutes = filteredEntries?.reduce((s, e) => s + e.minutes, 0) ?? 0
  const totalAmount =
    filteredEntries?.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
  const totalDays = totalMinutes / 60 / 8

  const handleMarkInvoiced = async () => {
    if (!filteredEntries?.length) return
    const ids = filteredEntries.map((e) => e._id)
    try {
      await markInvoiced({ ids })
      toast.success(`${ids.length} entrée(s) marquées comme facturées`)
    } catch {
      toast.error("Erreur")
    }
  }

  const handleExportCSV = () => {
    if (!filteredEntries?.length) return
    const rows = [
      ["Date", "Description", "Durée", "Taux (€/h)", "Montant (€)"],
      ...filteredEntries.map((e) => [
        e.date,
        e.description ?? "",
        formatMinutes(e.minutes),
        e.hourlyRate.toString(),
        ((e.minutes / 60) * e.hourlyRate).toFixed(2),
      ]),
      ["", "TOTAL", formatMinutes(totalMinutes), "", totalAmount.toFixed(2)],
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `recap-${periodDates?.from ?? "custom"}-${periodDates?.to ?? "custom"}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Export CSV téléchargé")
  }

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <h1 className="text-xl font-semibold text-fg">Récapitulatif</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 rounded-xl border border-edge bg-raised">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select
              value={clientId || "_all"}
              onValueChange={(v) => {
                setClientId(v === "_all" ? "" : v)
                setProjectId("")
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">Tous les clients</SelectItem>
                {clients?.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {clientId && (
            <div className="space-y-1.5">
              <Label>Projet</Label>
              <Select
                value={projectId || "_all"}
                onValueChange={(v) => setProjectId(v === "_all" ? "" : v)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Tous les projets</SelectItem>
                  {clientProjects?.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Période</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Mois en cours</SelectItem>
                <SelectItem value="last">Mois précédent</SelectItem>
                <SelectItem value="custom">Personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === "custom" && (
            <>
              <div className="space-y-1.5">
                <Label>Du</Label>
                <Input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Au</Label>
                <Input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-40"
                />
              </div>
            </>
          )}
        </div>

        {/* Table */}
        {filteredEntries === undefined ? (
          <p className="text-fg-muted text-sm">Chargement…</p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-fg-muted text-sm">
            Aucune entrée non facturée sur cette période.
          </p>
        ) : (
          <>
            <div className="rounded-xl border border-edge overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-raised border-b border-edge">
                  <tr>
                    <th className="text-left p-3 font-medium text-fg-muted">Date</th>
                    <th className="text-left p-3 font-medium text-fg-muted">Description</th>
                    <th className="text-right p-3 font-medium text-fg-muted">Durée</th>
                    <th className="text-right p-3 font-medium text-fg-muted">Taux</th>
                    <th className="text-right p-3 font-medium text-fg-muted">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry._id} className="border-b border-edge last:border-0">
                      <td className="p-3 text-fg-muted">
                        {format(new Date(entry.date + "T00:00:00"), "dd MMM", { locale: fr })}
                      </td>
                      <td className="p-3 text-fg">{entry.description ?? "—"}</td>
                      <td className="p-3 text-right font-mono text-fg">
                        {formatMinutes(entry.minutes)}
                      </td>
                      <td className="p-3 text-right text-fg-muted">{entry.hourlyRate}€/h</td>
                      <td className="p-3 text-right font-medium text-fg">
                        {((entry.minutes / 60) * entry.hourlyRate).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-raised border-t border-edge">
                  <tr>
                    <td colSpan={2} className="p-3 font-medium text-fg">
                      Total
                    </td>
                    <td className="p-3 text-right font-mono font-medium text-fg">
                      {formatMinutes(totalMinutes)}
                    </td>
                    <td className="p-3 text-right text-fg-muted">{totalDays.toFixed(1)}j</td>
                    <td className="p-3 text-right font-semibold text-fg">
                      {totalAmount.toFixed(2)}€
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="size-4 mr-1.5" />
                Export CSV
              </Button>
              <Button onClick={handleMarkInvoiced}>
                <CheckCheck className="size-4 mr-1.5" />
                Marquer comme facturé ({filteredEntries.length})
              </Button>
            </div>
          </>
        )}
      </div>
    </OpsFrame>
  )
}
