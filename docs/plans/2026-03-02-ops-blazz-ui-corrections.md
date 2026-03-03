# Ops App — Corrections Blazz-UI

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Corriger toutes les violations du skill blazz-ui dans l'app ops (format montants, composants connus, statuts dot+texte, Skeleton, FieldGrid, PageHeader, Empty, StatsGrid).

**Architecture:** 6 corrections indépendantes — utilitaire format, puis 5 pages. Chaque correction remplace du code ad hoc par le bloc @blazz/ui correspondant.

**Tech Stack:** Next.js 16, React 19, @blazz/ui (StatsGrid, FieldGrid, Field, Empty, PageHeader, Button, Skeleton), Convex, date-fns

---

## Imports de référence

```ts
// Blocks
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"

// Patterns
import { FieldGrid, Field } from "@blazz/ui/components/patterns/field-grid"

// UI
import { Empty } from "@blazz/ui/components/ui/empty"
import { Button } from "@blazz/ui/components/ui/button"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
```

---

### Task 1 : Utilitaire `formatCurrency`

**Files:**
- Modify: `apps/ops/lib/format.ts`

**Step 1 : Ajouter la fonction**

```ts
export function formatCurrency(amount: number): string {
  return `€${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(amount))}`
}
```

Résultat attendu : `formatCurrency(45000)` → `"€45 000"`, `formatCurrency(1234.56)` → `"€1 235"`

**Step 2 : Vérifier dans le navigateur (plus tard, en même temps que la page qui l'utilise)**

**Step 3 : Commit**

```bash
git add apps/ops/lib/format.ts
git commit -m "feat(ops): add formatCurrency utility (€1 234 format)"
```

---

### Task 2 : Dashboard — `StatsGrid` + `PageHeader` + `formatCurrency`

**Files:**
- Modify: `apps/ops/app/page.tsx`

**Step 1 : Réécrire la page**

```tsx
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { formatMinutes, formatCurrency } from "@/lib/format"
import { Clock, Banknote, FolderOpen } from "lucide-react"

export default function DashboardPage() {
  const now = new Date()
  const from = format(startOfMonth(now), "yyyy-MM-dd")
  const to = format(endOfMonth(now), "yyyy-MM-dd")

  const monthEntries = useQuery(api.timeEntries.list, { from, to })
  const activeProjects = useQuery(api.projects.listActive)
  const recentEntries = useQuery(api.timeEntries.recent, { limit: 10 })

  const isLoading = monthEntries === undefined

  const totalMinutes = monthEntries?.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0) ?? 0
  const totalAmount = monthEntries?.filter((e) => e.billable).reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
  const activeCount = activeProjects?.length ?? 0

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <PageHeader
          title={format(now, "MMMM yyyy", { locale: fr }).replace(/^\w/, (c) => c.toUpperCase())}
          description="Vue d'ensemble du mois en cours"
        />

        <StatsGrid
          columns={3}
          loading={isLoading}
          stats={[
            {
              label: "Heures ce mois",
              value: formatMinutes(totalMinutes),
              icon: Clock,
            },
            {
              label: "Facturable ce mois",
              value: formatCurrency(totalAmount),
              icon: Banknote,
            },
            {
              label: "Projets actifs",
              value: activeCount,
              icon: FolderOpen,
            },
          ]}
        />

        {/* Active projects */}
        {(activeProjects?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-fg">Projets actifs</h2>
            <div className="space-y-1">
              {activeProjects?.map((project) => (
                <div key={project._id} className="flex items-center justify-between py-2 border-b border-edge last:border-0">
                  <p className="text-sm font-medium text-fg">{project.name}</p>
                  <p className="text-xs text-fg-muted tabular-nums">{project.tjm}€/j · {project.hoursPerDay}h/j</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent entries */}
        {(recentEntries?.length ?? 0) > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-fg">Entrées récentes</h2>
            <div className="space-y-0">
              {recentEntries?.map((entry) => (
                <div key={entry._id} className="flex items-center justify-between py-2.5 border-b border-edge last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-fg-muted w-20 shrink-0 tabular-nums">
                      {format(new Date(entry.date + "T00:00:00"), "dd MMM", { locale: fr })}
                    </span>
                    <span className="text-sm text-fg">{entry.description ?? "—"}</span>
                  </div>
                  <span className="text-sm font-mono text-fg-muted tabular-nums">{formatMinutes(entry.minutes)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && monthEntries?.length === 0 && activeProjects?.length === 0 && (
          <p className="text-fg-muted text-sm">Pas encore de données. Créez un client et des projets pour commencer.</p>
        )}
      </div>
    </OpsFrame>
  )
}
```

**Step 2 : Vérifier visuellement** — `pnpm dev:ops`, aller sur `/`, les 3 KPI cards s'affichent avec Skeleton au chargement, puis les valeurs avec format `€1 234`.

**Step 3 : Commit**

```bash
git add apps/ops/app/page.tsx
git commit -m "feat(ops): replace manual KPI cards with StatsGrid block + PageHeader"
```

---

### Task 3 : Clients — `Empty` + `PageHeader`

**Files:**
- Modify: `apps/ops/app/clients/page.tsx`

**Step 1 : Remplacer l'empty state manuel et le header**

Remplacer l'import de `Users` et le bloc empty state par :

```tsx
// Ajouter aux imports
import { Empty } from "@blazz/ui/components/ui/empty"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
// Supprimer : Users (plus utilisé dans le header)
```

Remplacer le header `<div className="flex items-center justify-between">` par :

```tsx
<PageHeader
  title={`Clients${clients !== undefined ? ` (${clients.length})` : ""}`}
  actions={[
    {
      label: "Nouveau client",
      icon: Plus,
      onClick: () => setOpen(true),
    },
  ]}
/>
```

Remplacer le bloc empty state :

```tsx
{clients?.length === 0 && (
  <Empty
    icon={Users}
    title="Aucun client"
    description="Créez votre premier client pour commencer à tracker du temps"
    action={{ label: "Nouveau client", onClick: () => setOpen(true), icon: Plus }}
  />
)}
```

**Note :** Le composant `Empty` s'importe depuis `@blazz/ui/components/ui/empty`, `Users` depuis `lucide-react` et doit rester dans les imports. Supprimer l'ancien bloc `<div className="flex flex-col items-center...">`.

**Step 2 : Vérifier visuellement** — naviguer sur `/clients`, vérifier que le PageHeader s'affiche, que l'empty state est correct quand vide.

**Step 3 : Commit**

```bash
git add apps/ops/app/clients/page.tsx
git commit -m "feat(ops): replace manual empty state with Empty block + PageHeader on clients"
```

---

### Task 4 : Client detail — `Skeleton`, `FieldGrid`, `PageHeader`, dot+texte statuts

**Files:**
- Modify: `apps/ops/app/clients/[id]/page.tsx`

**Step 1 : Ajouter les imports**

```tsx
import { FieldGrid, Field } from "@blazz/ui/components/patterns/field-grid"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
// Supprimer : Badge, ArrowLeft, Link (breadcrumbs gérés par PageHeader)
```

**Step 2 : Remplacer le loading state texte par un Skeleton**

```tsx
if (client === undefined) {
  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex items-start gap-4">
          <Skeleton className="size-14 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </OpsFrame>
  )
}
```

**Step 3 : Remplacer le header + breadcrumb par `PageHeader`**

Supprimer le `<Link href="/clients">` et le `<div className="flex items-start justify-between">` (header manuel).

Remplacer par :

```tsx
<PageHeader
  breadcrumbs={[
    { label: "Clients", href: "/clients" },
    { label: client.name },
  ]}
  title={client.name}
  actions={[
    {
      label: "Modifier",
      variant: "outline",
      onClick: () => setEditOpen(true),
    },
  ]}
/>
```

Supprimer le `<Dialog>` de Modifier du header (le garder mais le déplacer en dehors du header comme actuellement, juste sans le Trigger visible puisque le PageHeader gère le bouton via onClick).

**Step 4 : Remplacer les `<p>` email/phone/adresse par `FieldGrid` + `Field`**

Supprimer le `<div className="flex items-start gap-4">` avec l'avatar et les `<p>`.

Remplacer par (après le PageHeader et l'avatar qui reste) :

```tsx
{/* Avatar + coordonnées */}
<div className="flex items-start gap-4">
  <div className="size-14 rounded-lg border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
    {client.logoUrl ? (
      <img src={client.logoUrl} alt={client.name} className="size-full object-contain" />
    ) : (
      <span className="text-lg font-semibold text-fg-muted">
        {client.name.slice(0, 2).toUpperCase()}
      </span>
    )}
  </div>
  <FieldGrid columns={3} className="flex-1">
    {client.email && <Field label="Email" value={client.email} />}
    {client.phone && <Field label="Téléphone" value={client.phone} />}
    {client.address && <Field label="Adresse" value={client.address} span={2} />}
    {!client.email && !client.phone && !client.address && (
      <Field label="Informations" value="—" />
    )}
  </FieldGrid>
</div>
```

**Step 5 : Remplacer les Badge de statut par dot+texte**

Supprimer les constantes `statusLabel` et `statusVariant` (et l'import `Badge`).

Ajouter :

```tsx
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
```

Remplacer `<Badge variant={statusVariant[project.status]}>{statusLabel[project.status]}</Badge>` par :

```tsx
<span className="flex items-center gap-1.5 text-xs text-fg-muted">
  <span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
  {statusLabel[project.status]}
</span>
```

**Step 6 : Vérifier visuellement** — naviguer sur `/clients/[id]`, vérifier Skeleton au chargement, FieldGrid avec les champs, breadcrumbs, statuts en dot+texte.

**Step 7 : Commit**

```bash
git add apps/ops/app/clients/[id]/page.tsx
git commit -m "feat(ops): add Skeleton + FieldGrid + PageHeader + dot-text statuses to client detail"
```

---

### Task 5 : Time page — `Button` cohérent + dot+texte statuts

**Files:**
- Modify: `apps/ops/app/time/page.tsx`

**Step 1 : Remplacer le view toggle (raw buttons → Button variants)**

Remplacer le `<div className="flex rounded-lg border...">` avec ses deux `<button>` par :

```tsx
<div className="flex items-center gap-1 rounded-lg border border-edge p-0.5 bg-raised">
  <Button
    type="button"
    size="sm"
    variant={view === "week" ? "default" : "ghost"}
    onClick={() => setView("week")}
    className="h-7 px-3 text-xs"
  >
    Semaine
  </Button>
  <Button
    type="button"
    size="sm"
    variant={view === "list" ? "default" : "ghost"}
    onClick={() => setView("list")}
    className="h-7 px-3 text-xs"
  >
    Liste
  </Button>
</div>
```

**Step 2 : Remplacer les boutons chevron par `Button` ghost icon**

Remplacer les deux `<button className="p-1.5 rounded-md border...">` par :

```tsx
<Button
  type="button"
  variant="ghost"
  size="icon"
  className="size-8"
  onClick={() => setWeekStart((w) => subWeeks(w, 1))}
>
  <ChevronLeft className="h-4 w-4" />
</Button>
```

```tsx
<Button
  type="button"
  variant="ghost"
  size="icon"
  className="size-8"
  onClick={() => setWeekStart((w) => addWeeks(w, 1))}
>
  <ChevronRight className="h-4 w-4" />
</Button>
```

Remplacer le bouton "Aujourd'hui" :

```tsx
<Button
  type="button"
  variant="ghost"
  size="sm"
  className="text-xs h-7 px-2"
  onClick={() => setWeekStart(getWeekStart(new Date()))}
>
  Aujourd'hui
</Button>
```

**Step 3 : Remplacer les `Badge` statut dans les colonnes par dot+texte**

Dans la colonne `billable` :

```tsx
{
  accessorKey: "billable",
  header: "Facturable",
  cell: ({ row }) =>
    row.original.billable ? null : (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="inline-block size-1.5 rounded-full bg-fg-muted" />
        Non facturable
      </span>
    ),
},
```

Dans la colonne `invoicedAt` :

```tsx
{
  accessorKey: "invoicedAt",
  header: "Statut",
  cell: ({ row }) =>
    row.original.invoicedAt ? (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="inline-block size-1.5 rounded-full bg-green-500" />
        Facturé
      </span>
    ) : null,
},
```

**Step 4 : Supprimer l'import `Badge` s'il n'est plus utilisé**

```tsx
// Supprimer : import { Badge } from "@blazz/ui/components/ui/badge"
```

**Step 5 : Vérifier visuellement** — aller sur `/time`, le toggle Semaine/Liste doit être cohérent visuellement, les chevrons ghost, les statuts en dot+texte.

**Step 6 : Commit**

```bash
git add apps/ops/app/time/page.tsx
git commit -m "feat(ops): replace raw buttons with Button component + dot-text statuses on time page"
```

---

### Task 6 : Recap — `Empty` + `formatCurrency` + `PageHeader`

**Files:**
- Modify: `apps/ops/app/recap/page.tsx`

**Step 1 : Ajouter les imports**

```tsx
import { Empty } from "@blazz/ui/components/ui/empty"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { formatCurrency } from "@/lib/format"
import { FileText } from "lucide-react"
```

**Step 2 : Remplacer le titre `<h1>` par `PageHeader`**

```tsx
<PageHeader title="Récapitulatif" description="Export et facturation par période" />
```

**Step 3 : Remplacer le loading text par `Empty` avec spinner**

```tsx
{filteredEntries === undefined ? (
  <Empty
    size="sm"
    title="Chargement…"
  />
) : filteredEntries.length === 0 ? (
  <Empty
    icon={FileText}
    size="sm"
    title="Aucune entrée non facturée"
    description="Aucune entrée non facturée sur cette période."
  />
) : (
  // ... table + boutons existants
)}
```

**Step 4 : Corriger le format des montants dans la table et le total**

Remplacer dans les `<td>` :

```tsx
// Dans la colonne montant de chaque ligne :
<td className="p-3 text-right font-medium text-fg tabular-nums">
  {formatCurrency((entry.minutes / 60) * entry.hourlyRate)}
</td>

// Dans la colonne taux :
<td className="p-3 text-right text-fg-muted tabular-nums">{entry.hourlyRate}€/h</td>

// Dans le tfoot total :
<td className="p-3 text-right font-semibold text-fg tabular-nums">
  {formatCurrency(totalAmount)}
</td>
```

**Step 5 : Vérifier visuellement** — aller sur `/recap`, vérifier l'empty state, le format des montants `€1 234`.

**Step 6 : Commit**

```bash
git add apps/ops/app/recap/page.tsx
git commit -m "feat(ops): add Empty + PageHeader + formatCurrency to recap page"
```

---

## Vérification finale

```bash
pnpm dev:ops
```

Checker chaque page :
- `/` → StatsGrid avec 3 KPIs, format `€1 234`, Skeleton au chargement
- `/clients` → PageHeader avec count, Empty si vide
- `/clients/[id]` → Skeleton loader, FieldGrid, breadcrumbs, dot+texte statuts
- `/time` → Button toggle, Button ghost chevrons, dot+texte statuts
- `/recap` → PageHeader, Empty si vide, format `€1 234`

```bash
pnpm lint
```
