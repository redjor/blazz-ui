"use client"

import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import * as React from "react"
import { twMerge } from "tailwind-merge"

interface TabsBarProps {
  children: React.ReactNode
  onAddTab?: () => void
  addButtonLabel?: string
  className?: string
  addButtonClassName?: string
  /** Tab IDs in order — enables drag-and-drop reordering when provided with onReorder */
  tabIds?: string[]
  /** Called when a tab is dropped at a new position */
  onReorder?: (activeId: string, overId: string) => void
  /** Render function for the drag overlay — receives the ID of the dragged tab */
  renderDragOverlay?: (activeId: string) => React.ReactNode
}

export function TabsBar({
  children,
  onAddTab,
  addButtonLabel = "Open new tab",
  className,
  addButtonClassName,
  tabIds,
  onReorder,
  renderDragOverlay,
}: TabsBarProps) {
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null)
    const { active, over } = event
    if (over && active.id !== over.id && onReorder) {
      onReorder(String(active.id), String(over.id))
    }
  }

  const handleDragCancel = () => {
    setActiveDragId(null)
  }

  const isDndEnabled = tabIds && tabIds.length > 1 && onReorder

  const addButton = onAddTab ? (
    <button
      type="button"
      onClick={onAddTab}
      className={twMerge(
        "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        addButtonClassName
      )}
      aria-label={addButtonLabel}
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  ) : null

  return (
    <div
      className={twMerge(
        "flex h-9 shrink-0 items-center border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      {isDndEnabled ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
              <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
                {children}
              </div>
            </SortableContext>
            <DragOverlay dropAnimation={null}>
              {activeDragId && renderDragOverlay ? renderDragOverlay(activeDragId) : null}
            </DragOverlay>
          </DndContext>
          {addButton}
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {children}
          {addButton}
        </div>
      )}
    </div>
  )
}
