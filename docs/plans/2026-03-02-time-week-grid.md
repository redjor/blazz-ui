# Time Week Grid — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ajouter une vue "Semaine" à la page `/time` — grille projets × jours pour saisir rapidement des entrées en un clic.

**Architecture:** Tab switcher sur la page `/time` existante (Liste | Semaine). WeekGrid = tableau rows=projets actifs, cols=7 jours avec navigation. Clic sur n'importe quelle cellule → QuickTimeEntryModal pré-rempli (projet + date). Aucun changement backend.

**Tech Stack:** React 19, TypeScript strict, date-fns, react-hook-form + zod, Convex, @blazz/ui

---

## Task 1: Créer le composant WeekGrid

**Files:**
- Create: `apps/ops/components/week-grid.tsx`

**Step 1: Créer le fichier**

```tsx
"use client"

import { useMemo } from "react"
import { format, addDays, isSameDay, isWeekend } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes } from "@/lib/format"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@blazz/ui/lib/utils"

type TimeEntry = Doc<"timeEntries">
type Project = Doc<"projects"> & { clientName?: string }

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
                  "text-center py-2 px-2 font-medium min-w-[72px]",
                  isWeekend(day) ? "text-fg-muted/50" : "text-fg-muted"
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
            const rowTotal = days.reduce((sum, day) => {
              const key = `${project._id}_${format(day, "yyyy-MM-dd")}`
              const dayEntries = entryMap.get(key) ?? []
              return sum + dayEntries.reduce((s, e) => s + e.minutes, 0)
            }, 0)

            return (
              <tr key={project._id} className="border-t border-edge">
                <td className="py-2 pr-4">
                  <p className="font-medium text-fg truncate max-w-[160px]">{project.name}</p>
                  {project.clientName && (
                    <p className="text-xs text-fg-muted">{project.clientName}</p>
                  )}
                </td>
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd")
                  const key = `${project._id}_${dateStr}`
                  const dayEntries = entryMap.get(key) ?? []
                  const totalMins = dayEntries.reduce((s, e) => s + e.minutes, 0)
                  const hasEntries = totalMins > 0

                  return (
                    <td key={day.toISOString()} className="py-1.5 px-1">
                      <button
                        type="button"
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
                              <span className="text-[10px] opacity-70">+{dayEntries.length}</span>
                            )}
                          </span>
                        ) : (
                          <span className="text-[10px]">+</span>
                        )}
                      </button>
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
            {dayTotals.map((mins, i) => (
              <td key={i} className="py-2 px-1 text-center font-mono text-xs text-fg-muted">
                {mins > 0 ? formatMinutes(mins) : "—"}
              </td>
            ))}
            <td className="py-2 pl-4 text-right font-mono text-xs font-semibold text-fg">
              {formatMinutes(dayTotals.reduce((s, m) => s + m, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
```

**Step 2: Vérifier que le fichier est créé sans erreur TypeScript**

L'import `cn` doit être disponible depuis `@blazz/ui/lib/utils`. Vérifier dans `packages/ui/src/lib/utils.ts` que cette fonction est exportée.

**Step 3: Commit**

```bash
git add apps/ops/components/week-grid.tsx
git commit -m "feat(ops): add WeekGrid component for week view"
```

---

## Task 2: Créer le composant QuickTimeEntryModal

**Files:**
- Create: `apps/ops/components/quick-time-entry-modal.tsx`

**Step 1: Créer le fichier**

```tsx
"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id, Doc } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"

type Project = Doc<"projects">

const schema = z.object({
  hours: z.coerce.number().min(0.25, "Minimum 15min").max(24),
  description: z.string().optional(),
  billable: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: Id<"projects"> | null
  date: string | null
  onSuccess?: () => void
}

export function QuickTimeEntryModal({ open, onOpenChange, projectId, date, onSuccess }: Props) {
  const create = useMutation(api.timeEntries.create)
  // Récupérer les détails du projet pour affichage + calcul du taux
  const projects = useQuery(api.projects.listActive)
  const project = projects?.find((p) => p._id === projectId)

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema) as Resolver<FormValues>,
      defaultValues: { hours: 1, billable: true, description: "" },
    })

  const onSubmit = async (values: FormValues): Promise<void> => {
    if (!projectId || !date || !project) return
    try {
      const hourlyRate = project.tjm / project.hoursPerDay
      await create({
        projectId,
        date,
        minutes: Math.round(values.hours * 60),
        hourlyRate,
        description: values.description || undefined,
        billable: values.billable,
      })
      toast.success("Entrée ajoutée")
      reset({ hours: 1, billable: true, description: "" })
      onSuccess?.()
      onOpenChange(false)
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  const dateLabel = date
    ? format(new Date(date + "T00:00:00"), "EEEE d MMMM", { locale: fr })
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saisie rapide</DialogTitle>
        </DialogHeader>

        {/* Contexte lecture seule */}
        <div className="rounded-lg bg-raised border border-edge px-4 py-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-fg-muted">Projet</span>
            <span className="font-medium text-fg">{project?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fg-muted">Date</span>
            <span className="font-medium text-fg capitalize">{dateLabel}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Durée (heures) *</Label>
            <Input
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              autoFocus
              {...register("hours")}
            />
            {errors.hours && (
              <p className="text-xs text-red-500">{errors.hours.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input placeholder="Ce qui a été fait…" {...register("description")} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="quick-billable"
              checked={watch("billable")}
              onCheckedChange={(v) => setValue("billable", !!v)}
            />
            <Label htmlFor="quick-billable" className="font-normal cursor-pointer">
              Facturable
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/quick-time-entry-modal.tsx
git commit -m "feat(ops): add QuickTimeEntryModal for week grid"
```

---

## Task 3: Modifier la page `/time` pour intégrer la vue semaine

**Files:**
- Modify: `apps/ops/app/time/page.tsx`

**Step 1: Remplacer le contenu du fichier**

```tsx
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

// Retourne le lundi de la semaine d'une date donnée
function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export default function TimePage() {
  const [view, setView] = useState<View>("week")
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))

  // Pour la vue semaine : charger les entrées de la semaine
  const weekFrom = format(weekStart, "yyyy-MM-dd")
  const weekTo = format(addDays(weekStart, 6), "yyyy-MM-dd")
  const weekEntries = useQuery(api.timeEntries.list, { from: weekFrom, to: weekTo })
  const activeProjects = useQuery(api.projects.listActive)

  // Pour la vue liste : charger toutes les entrées
  const allEntries = useQuery(view === "list" ? api.timeEntries.list : "skip", {})

  const remove = useMutation(api.timeEntries.remove)
  const unmarkInvoiced = useMutation(api.timeEntries.unmarkInvoiced)

  const [editing, setEditing] = useState<TimeEntry | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  // État du modal rapide (vue semaine)
  const [quickModal, setQuickModal] = useState<{
    open: boolean
    projectId: Id<"projects"> | null
    date: string | null
  }>({ open: false, projectId: null, date: null })

  // Enrichir les projets avec le nom du client (optionnel si disponible)
  const enrichedProjects = useMemo(() => activeProjects ?? [], [activeProjects])

  // Colonnes DataTable (vue liste)
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

  // Label de la semaine affichée
  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6)
    const startStr = format(weekStart, "d", { locale: fr })
    const endStr = format(end, "d MMM yyyy", { locale: fr })
    return `${startStr} – ${endStr}`
  }, [weekStart])

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-fg">Saisie des heures</h1>
          <div className="flex items-center gap-3">
            {/* Switcher vue */}
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

        {/* Vue Semaine */}
        {view === "week" && (
          <div className="space-y-4">
            {/* Navigation semaine */}
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

            {/* Grille */}
            <WeekGrid
              weekStart={weekStart}
              entries={weekEntries ?? []}
              projects={enrichedProjects}
              onCellClick={(projectId, date) =>
                setQuickModal({ open: true, projectId, date })
              }
            />
          </div>
        )}

        {/* Vue Liste */}
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

      {/* Modal ajout standard */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle entrée</DialogTitle>
          </DialogHeader>
          <TimeEntryForm onSuccess={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal édition */}
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

      {/* Modal saisie rapide (vue semaine) */}
      <QuickTimeEntryModal
        open={quickModal.open}
        onOpenChange={(open) => setQuickModal((s) => ({ ...s, open }))}
        projectId={quickModal.projectId}
        date={quickModal.date}
      />
    </OpsFrame>
  )
}
```

**Step 2: Vérifier que `api.timeEntries.list` accepte `"skip"` comme second argument**

Dans Convex, `useQuery(api.xxx, "skip")` est le pattern officiel pour désactiver une query conditionnellement. Si ça cause une erreur TypeScript, remplacer par :

```tsx
// Option alternative : toujours charger les entrées de la semaine courante
// et garder allEntries séparé avec un état de chargement conditionnel
const allEntries = useQuery(
  view === "list" ? api.timeEntries.list : api.timeEntries.list,
  view === "list" ? {} : { from: "9999-12-31", to: "9999-12-31" } // date impossible = 0 résultats
)
```

En pratique, Convex supporte `"skip"` nativement depuis la v1.9. Tester d'abord avec `"skip"`.

**Step 3: Commit**

```bash
git add apps/ops/app/time/page.tsx
git commit -m "feat(ops): integrate WeekGrid + QuickTimeEntryModal in time page"
```

---

## Task 4: Test manuel et vérification

**Step 1: Démarrer l'app ops**

```bash
pnpm dev:ops
```

Ouvrir `http://localhost:3120/time`

**Step 2: Vérifier la vue semaine**

- [ ] La page s'affiche en vue "Semaine" par défaut
- [ ] Le switcher Semaine / Liste est visible et fonctionne
- [ ] Les projets actifs apparaissent en lignes
- [ ] Les 7 jours de la semaine courante apparaissent en colonnes
- [ ] Le label de la semaine (ex: "3 – 9 mars 2026") est correct
- [ ] Sam et Dim sont visuellement plus ternes

**Step 3: Vérifier la navigation**

- [ ] Cliquer `<` passe à la semaine précédente, le label se met à jour
- [ ] Cliquer `>` passe à la semaine suivante
- [ ] Cliquer "Aujourd'hui" revient à la semaine courante

**Step 4: Vérifier la saisie rapide**

- [ ] Cliquer sur une cellule vide ouvre le modal
- [ ] Le modal affiche bien le nom du projet et la date en lecture seule
- [ ] Saisir une durée (ex: 4) et cliquer Ajouter
- [ ] La cellule se met à jour avec "4h" (Convex realtime)
- [ ] Cliquer sur une cellule déjà remplie ouvre le modal (ajoute une 2e entrée)
- [ ] La cellule avec 2 entrées affiche le total + badge "+2"

**Step 5: Vérifier la vue liste**

- [ ] Basculer en vue Liste affiche bien la DataTable existante

**Step 6: Commit final si tout fonctionne**

```bash
git add -A
git commit -m "chore(ops): manual verification pass — week grid feature complete"
```

---

## Notes d'implémentation

### Import `cn` depuis `@blazz/ui/lib/utils`

Si l'import ne résout pas, utiliser une version inline :
```ts
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}
```

### Convex `useQuery` avec `"skip"`

Pattern officiel Convex pour désactiver une query :
```ts
const result = useQuery(api.xxx.list, view === "list" ? {} : "skip")
```
Référence : https://docs.convex.dev/client/react#skipping-a-query

### `listAll` query manquante

Si `api.projects.listAll` n'est pas défini dans `convex/projects.ts`, vérifier. Elle est utilisée dans `time-entry-form.tsx` pour le mode édition. Elle doit déjà exister.
