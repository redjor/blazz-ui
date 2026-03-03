# Design — Todos Kanban : Drag & Drop

**Date:** 2026-03-03
**App:** `apps/ops`
**Status:** Approved

## Context

Le kanban de `/todos` utilise actuellement des flèches ChevronLeft/ChevronRight pour déplacer les cards entre colonnes. On remplace ce mécanisme par du drag & drop en utilisant le composant `KanbanBoard` déjà disponible dans `@blazz/ui/components/blocks/kanban-board`.

## Approche

Utiliser `<KanbanBoard>` de `@blazz/ui` — DnD natif HTML5 intégré, zéro nouvelle dépendance.

## Architecture

### Composant `KanbanBoard` (existant dans le package)

```ts
interface KanbanBoardProps<T extends { id: string }> {
  columns: KanbanColumn<T>[]       // [{ id, label }]
  items: T[]                        // items avec id: string obligatoire
  getColumnId: (item: T) => string  // retourne l'id de colonne de l'item
  onMove?: (itemId, from, to) => void | Promise<void>
  renderCard: (item: T) => ReactNode
  renderColumnHeader?: (column, items) => ReactNode
}
```

Comportements intégrés : drag opacity 40%, highlight colonne en survol, `cursor-grab`.

### Mapping `Doc<"todos">` → item avec `id`

`KanbanBoard` requiert `T extends { id: string }`. Convex utilise `_id`. On crée un type local :

```ts
type TodoWithId = Doc<"todos"> & { id: string }
```

Et on dérive via `useMemo` :
```ts
const todoItems = useMemo<TodoWithId[]>(
  () => (todos ?? []).map((t) => ({ ...t, id: t._id })),
  [todos]
)
```

### Intégration dans `TodosPage`

```tsx
<KanbanBoard
  columns={COLUMNS}  // { id: status, label } — déjà défini dans le fichier
  items={todoItems}
  getColumnId={(t) => t.status}
  onMove={async (id, _from, to) => {
    await updateStatus({ id: id as Id<"todos">, status: to as TodoStatus })
  }}
  renderColumnHeader={(col, colItems) => (
    <div className="flex items-center justify-between px-3 py-2 border-b border-edge">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-fg">{col.label}</span>
        {colItems.length > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 tabular-nums">
            {colItems.length}
          </Badge>
        )}
      </div>
      <Button variant="ghost" size="icon-sm" onClick={() => setAddFor(col.id as TodoStatus)}>
        <Plus className="size-3.5" />
      </Button>
    </div>
  )}
  renderCard={(todo) => <TodoCard todo={todo} projects={projectList} />}
/>
```

### Nettoyage de `TodoCard`

Supprimer :
- Les imports `ChevronLeft`, `ChevronRight`
- La mutation `updateStatus` locale
- Les fonctions `getPrev`, `getNext`
- Les boutons de navigation dans la card
- Les constantes `STATUS_ORDER`, `getPrev`, `getNext` au niveau du fichier

`TodoCard` conserve : affichage texte, description, PriorityIcon, badge projet, bouton édition, bouton suppression.

## States inchangés

- Loading : skeleton grid identique
- Empty : `<Empty>` identique
- List view : `<DataTable>` inchangé

## Out of Scope

- Réordonner les cards dans une même colonne (drag within column)
- Animations spring / @dnd-kit
- Touch drag sur mobile
