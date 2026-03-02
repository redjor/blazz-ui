"use client"

import { useMemo } from "react"
import { format, addDays, isWeekend } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes } from "@/lib/format"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@blazz/ui/lib/utils"

type TimeEntry = Doc<"timeEntries">
type Project = Doc<"projects">

interface WeekGridProps {
  weekStart: Date // doit être un lundi
  entries: TimeEntry[]
  projects: Project[]
  onCellClick: (projectId: Id<"projects">, date: string) => void
}

export function WeekGrid({ weekStart, entries, projects, onCellClick }: WeekGridProps) {
  // 7 jours à partir du lundi
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  )

  // Grouper les entrées par clé "projectId_date"
  const entryMap = useMemo(() => {
    const map = new Map<string, TimeEntry[]>()
    for (const entry of entries) {
      const key = `${entry.projectId}_${entry.date}`
      const existing = map.get(key) ?? []
      map.set(key, [...existing, entry])
    }
    return map
  }, [entries])

  // Total minutes par jour (colonne bas)
  const dayTotals = useMemo(
    () =>
      days.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd")
        return projects.reduce((sum, proj) => {
          const key = `${proj._id}_${dateStr}`
          const dayEntries = entryMap.get(key) ?? []
          return sum + dayEntries.reduce((s, e) => s + e.minutes, 0)
        }, 0)
      }),
    [days, projects, entryMap]
  )

  // Pre-formatted date strings for stable lookup
  const dayStrings = useMemo(
    () => days.map((day) => format(day, "yyyy-MM-dd")),
    [days]
  )

  // Row totals per project (memoized, not computed in render)
  const rowTotals = useMemo(() => {
    const map = new Map<string, number>()
    for (const proj of projects) {
      const total = dayStrings.reduce((sum, dateStr) => {
        const key = `${proj._id}_${dateStr}`
        const dayEntries = entryMap.get(key) ?? []
        return sum + dayEntries.reduce((s, e) => s + e.minutes, 0)
      }, 0)
      map.set(proj._id, total)
    }
    return map
  }, [dayStrings, projects, entryMap])

  const grandTotal = useMemo(
    () => dayTotals.reduce((s, m) => s + m, 0),
    [dayTotals]
  )

  if (projects.length === 0) {
    return (
      <div className="text-sm text-fg-muted text-center py-12">
        Aucun projet actif. Créez un projet pour commencer.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-4 font-medium text-fg-muted min-w-[160px]">
              Projet
            </th>
            {days.map((day) => (
              <th
                key={day.toISOString()}
                className={cn(
                  "text-center py-2 px-2 font-medium min-w-[72px] text-fg-muted",
                  isWeekend(day) && "opacity-50"
                )}
              >
                <div className="uppercase text-xs tracking-wide">
                  {format(day, "EEE", { locale: fr })}
                </div>
                <div className="text-fg font-semibold">
                  {format(day, "d")}
                </div>
              </th>
            ))}
            <th className="text-right py-2 pl-4 font-medium text-fg-muted min-w-[64px]">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const rowTotal = rowTotals.get(project._id) ?? 0

            return (
              <tr key={project._id} className="border-t border-edge">
                <td className="py-2 pr-4">
                  <p className="font-medium text-fg truncate max-w-[160px]">{project.name}</p>
                </td>
                {days.map((day, dayIdx) => {
                  const dateStr = dayStrings[dayIdx]
                  const key = `${project._id}_${dateStr}`
                  const dayEntries = entryMap.get(key) ?? []
                  const totalMins = dayEntries.reduce((s, e) => s + e.minutes, 0)
                  const hasEntries = totalMins > 0

                  const inRange =
                    (!project.startDate || dateStr >= project.startDate) &&
                    (!project.endDate || dateStr <= project.endDate)

                  return (
                    <td key={day.toISOString()} className="py-1.5 px-1">
                      {hasEntries || inRange ? (
                        <button
                          type="button"
                          aria-label={`${hasEntries ? "Voir ou ajouter" : "Ajouter une entrée"} — ${project.name}, ${dateStr}`}
                          onClick={() => onCellClick(project._id, dateStr)}
                          className={cn(
                            "w-full h-10 rounded-md text-xs font-mono transition-colors",
                            isWeekend(day) && "opacity-50",
                            hasEntries
                              ? "bg-brand/15 text-brand hover:bg-brand/25 border border-brand/30"
                              : "bg-raised border border-edge text-fg-muted hover:bg-surface hover:border-brand/40 hover:text-fg"
                          )}
                        >
                          {hasEntries ? (
                            <span className="flex flex-col items-center leading-tight">
                              <span>{formatMinutes(totalMins)}</span>
                              {dayEntries.length > 1 && (
                                <span className="text-[10px] opacity-70">{dayEntries.length}×</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-[10px]">+</span>
                          )}
                        </button>
                      ) : (
                        <div className={cn("w-full h-10 rounded-md", isWeekend(day) && "opacity-30")} />
                      )}
                    </td>
                  )
                })}
                <td className="py-2 pl-4 text-right font-mono text-fg-muted text-xs">
                  {rowTotal > 0 ? formatMinutes(rowTotal) : "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-edge">
            <td className="py-2 pr-4 text-xs font-medium text-fg-muted">Total / jour</td>
            {days.map((day, i) => (
              <td key={day.toISOString()} className="py-2 px-1 text-center font-mono text-xs text-fg-muted">
                {dayTotals[i] > 0 ? formatMinutes(dayTotals[i]) : "—"}
              </td>
            ))}
            <td className="py-2 pl-4 text-right font-mono text-xs font-semibold text-fg">
              {grandTotal > 0 ? formatMinutes(grandTotal) : "—"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
