# Pattern : Pipeline Kanban

> Vue kanban avec colonnes de statuts, cards draggables, et vue table alternative.
> Exemples : pipeline commercial, board de recrutement, suivi de tickets.

## Structure

```
PageHeader               — titre + total agrégé + toggle vue (Kanban | Table)
FilterBar                — filtres partagés entre les deux vues
KanbanBoard              — colonnes = étapes, cards = éléments
  └─ KanbanColumn        — header avec nom + count + total
       └─ KanbanCard     — résumé d'un élément draggable
OU
DataGrid                 — même données en vue table classique
```

## Fichiers à créer

```
app/(dashboard)/[resources]/
  page.tsx                     ← Server Component, fetch les données
  _components/
    kanban-view.tsx            ← Client Component (drag & drop = interactif)
    kanban-card.tsx            ← Card dans le kanban
    table-view.tsx             ← Vue table alternative
    columns.tsx                ← Colonnes DataGrid
    filters.tsx                ← Filtres partagés
```

## Code complet

### Page (`app/(dashboard)/deals/page.tsx`)

```tsx
import { PageHeader } from "@/components/blocks/page-header"
import { FilterBar } from "@/components/blocks/filter-bar"
import { getDeals } from "@/lib/actions/deals"
import { KanbanView } from "./_components/kanban-view"
import { TableView } from "./_components/table-view"
import { dealFilters } from "./_components/filters"

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const view = params.view ?? "kanban"
  const deals = await getDeals(params)

  return (
    <>
      <PageHeader
        title="Pipeline"
        description={`${deals.totalCount} deals — ${formatCurrency(deals.totalValue)}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Pipeline" },
        ]}
        actions={[
          {
            type: "toggle",
            param: "view",
            value: view,
            options: [
              { value: "kanban", label: "Kanban", icon: "LayoutGrid" },
              { value: "table", label: "Table", icon: "List" },
            ],
          },
          { label: "Nouveau deal", href: "/deals/new", icon: "Plus" },
        ]}
      />

      <FilterBar filters={dealFilters} values={params} />

      {view === "kanban" ? (
        <KanbanView deals={deals.data} stages={dealStages} />
      ) : (
        <TableView
          deals={deals.data}
          totalCount={deals.totalCount}
          currentPage={Number(params.page) || 1}
        />
      )}
    </>
  )
}
```

### Kanban View (`_components/kanban-view.tsx`)

```tsx
"use client"

import { useState } from "react"
import { KanbanBoard } from "@/components/blocks/kanban-board"
import { updateDealStage } from "@/lib/actions/deals"
import { useToast } from "@/hooks/use-toast"
import { KanbanDealCard } from "./kanban-card"
import { type Deal, type DealStage } from "@/lib/schemas/deal"

interface KanbanViewProps {
  deals: Deal[]
  stages: DealStage[]
}

export function KanbanView({ deals, stages }: KanbanViewProps) {
  const { toast } = useToast()

  // Grouper les deals par étape
  const columns = stages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage.id)
    return {
      id: stage.id,
      title: stage.label,
      color: stage.color,
      items: stageDeals,
      count: stageDeals.length,
      aggregate: formatCurrency(stageDeals.reduce((sum, d) => sum + d.amount, 0)),
    }
  })

  const handleDragEnd = async (dealId: string, fromStage: string, toStage: string) => {
    try {
      await updateDealStage(dealId, toStage)
      toast({ variant: "success", title: `Deal déplacé vers ${toStage}` })
    } catch {
      toast({ variant: "error", title: "Erreur lors du déplacement" })
    }
  }

  return (
    <KanbanBoard
      columns={columns}
      onDragEnd={handleDragEnd}
      renderCard={(deal) => <KanbanDealCard deal={deal} />}
    />
  )
}
```

### Kanban Card (`_components/kanban-card.tsx`)

```tsx
import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import { type Deal } from "@/lib/schemas/deal"

export function KanbanDealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 font-medium text-sm">{deal.title}</div>
      <div className="text-xs text-muted-foreground mb-2">{deal.company.name}</div>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{formatCurrency(deal.amount)}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatDate(deal.expectedCloseDate)}
          </span>
          <Avatar size="xs" user={deal.assignedTo} />
        </div>
      </div>
      {/* Barre de probabilité */}
      <div className="mt-2 h-1 rounded-full bg-muted">
        <div
          className="h-1 rounded-full bg-primary"
          style={{ width: `${deal.probability}%` }}
        />
      </div>
    </Link>
  )
}
```

## KanbanBoard — Props du composant

```tsx
<KanbanBoard
  columns={[
    {
      id: "qualification",
      title: "Qualification",
      color: "#6366f1",       // couleur du header
      items: Deal[],
      count: 12,
      aggregate: "€89K",      // affiché sous le titre
    },
    // ...
  ]}
  onDragEnd={(itemId, fromColumnId, toColumnId) => Promise<void>}
  renderCard={(item) => ReactNode}
  emptyColumn={<EmptyState title="Aucun deal" />}
/>
```

## Points critiques

- **Drag & drop** : utiliser `@dnd-kit/core` (pas react-beautiful-dnd, deprecated)
- **Optimistic update** : déplacer visuellement la card immédiatement, rollback si erreur serveur
- **Scroll horizontal** : le board scroll horizontalement si >5 colonnes
- **Scroll vertical** : chaque colonne scroll indépendamment si beaucoup de cards
- **Totaux par colonne** : count + valeur agrégée, mis à jour après chaque drag
- **Mobile** : colonnes en horizontal scroll, pas de drag (tap pour ouvrir le détail)

## Checklist avant de livrer

- [ ] Deux vues (Kanban + Table) avec toggle ✓
- [ ] Filtres partagés entre les deux vues ✓
- [ ] Drag & drop avec @dnd-kit ✓
- [ ] Optimistic update sur le drag ✓
- [ ] Count + total par colonne ✓
- [ ] Card cliquable vers le détail ✓
- [ ] Avatar assigné sur chaque card ✓
- [ ] Empty state par colonne ✓
- [ ] Scroll horizontal du board ✓
- [ ] Bouton "Nouveau deal" en haut à droite ✓
