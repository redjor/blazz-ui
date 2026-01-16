"use client"

import * as React from "react"
import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuPopup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import type { RowAction } from "./data-table.types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: RowAction<TData>[]
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [pendingAction, setPendingAction] = React.useState<RowAction<TData> | null>(null)

  // Filter actions based on hidden/disabled conditions
  const visibleActions = actions.filter(
    (action) => !action.hidden || !action.hidden(row)
  )

  if (visibleActions.length === 0) {
    return null
  }

  const handleActionClick = async (action: RowAction<TData>) => {
    // Check if disabled
    if (action.disabled && action.disabled(row)) {
      return
    }

    // Check if requires confirmation
    if (action.requireConfirmation) {
      setPendingAction(action)
      setIsConfirmOpen(true)
      return
    }

    // Execute action
    try {
      await action.handler(row)
    } catch (error) {
      console.error("Error executing action:", error)
    }
  }

  const confirmAction = async () => {
    if (!pendingAction) return

    try {
      await pendingAction.handler(row)
    } catch (error) {
      console.error("Error executing action:", error)
    } finally {
      setIsConfirmOpen(false)
      setPendingAction(null)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-8 w-8 p-0"
          data-slot="data-table-row-actions-trigger"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuPopup data-slot="data-table-row-actions-popup">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {visibleActions.map((action, index) => {
              const isDisabled = action.disabled ? action.disabled(row) : false
              const showSeparator = action.separator && index > 0

              return (
                <React.Fragment key={action.id}>
                  {showSeparator && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => handleActionClick(action)}
                    disabled={isDisabled}
                    className={
                      action.variant === "destructive"
                        ? "text-destructive focus:text-destructive"
                        : ""
                    }
                  >
                    {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                    {action.label}
                    {action.shortcut && (
                      <span className="ml-auto text-xs tracking-widest opacity-60">
                        {action.shortcut}
                      </span>
                    )}
                  </DropdownMenuItem>
                </React.Fragment>
              )
            })}
          </DropdownMenuPopup>
        </DropdownMenuPortal>
      </DropdownMenu>

      {/* Confirmation Dialog - Simple version */}
      {isConfirmOpen && pendingAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setIsConfirmOpen(false)}
        >
          <div
            className="relative z-50 w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">Confirm Action</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {typeof pendingAction.confirmationMessage === "function"
                ? pendingAction.confirmationMessage(row)
                : pendingAction.confirmationMessage ||
                  "Are you sure you want to perform this action?"}
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmOpen(false)
                  setPendingAction(null)
                }}
              >
                Cancel
              </Button>
              <Button
                variant={
                  pendingAction.variant === "destructive" ? "destructive" : "default"
                }
                onClick={confirmAction}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
