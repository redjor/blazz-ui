"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BulkAction } from "./data-table.types"

interface DataTableBulkActionsProps<TData> {
	table: Table<TData>
	actions: BulkAction<TData>[]
}

export function DataTableBulkActions<TData>({ table, actions }: DataTableBulkActionsProps<TData>) {
	const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
	const [pendingAction, setPendingAction] = React.useState<BulkAction<TData> | null>(null)

	const selectedRows = table.getFilteredSelectedRowModel().rows
	const selectedCount = selectedRows.length

	// Don't render if no rows selected
	if (selectedCount === 0) {
		return null
	}

	const handleActionClick = async (action: BulkAction<TData>) => {
		// Check if disabled
		if (action.disabled?.(selectedRows)) {
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
			await action.handler(selectedRows)
			// Clear selection after successful action
			table.resetRowSelection()
		} catch (error) {
			console.error("Error executing bulk action:", error)
		}
	}

	const confirmAction = async () => {
		if (!pendingAction) return

		try {
			await pendingAction.handler(selectedRows)
			// Clear selection after successful action
			table.resetRowSelection()
		} catch (error) {
			console.error("Error executing bulk action:", error)
		} finally {
			setIsConfirmOpen(false)
			setPendingAction(null)
		}
	}

	return (
		<>
			<div
				className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3"
				data-slot="data-table-bulk-actions"
			>
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">
						{selectedCount} {selectedCount === 1 ? "row" : "rows"} selected
					</span>
					<Button
						variant="ghost"
						size="icon-xs"
						onClick={() => table.resetRowSelection()}
						className="h-6 w-6"
					>
						<X className="h-3 w-3" />
						<span className="sr-only">Clear selection</span>
					</Button>
				</div>

				<div className="flex items-center gap-2">
					{actions.map((action) => {
						const isDisabled = action.disabled ? action.disabled(selectedRows) : false

						return (
							<Button
								key={action.id}
								variant={action.variant || "outline"}
								size="sm"
								onClick={() => handleActionClick(action)}
								disabled={isDisabled}
								className={cn(
									action.variant === "destructive" &&
										"bg-destructive/10 text-destructive hover:bg-destructive/20"
								)}
							>
								{action.icon && <action.icon className="mr-2 h-4 w-4" />}
								{action.label}
							</Button>
						)
					})}
				</div>
			</div>

			{/* Confirmation Dialog */}
			{isConfirmOpen && pendingAction && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
					onClick={() => setIsConfirmOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setIsConfirmOpen(false)
					}}
					role="button"
					tabIndex={0}
				>
					<div
						className="relative z-50 w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
					>
						<h2 className="text-lg font-semibold">Confirm Bulk Action</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							{typeof pendingAction.confirmationMessage === "function"
								? pendingAction.confirmationMessage(selectedCount)
								: pendingAction.confirmationMessage ||
									`Are you sure you want to perform this action on ${selectedCount} ${
										selectedCount === 1 ? "item" : "items"
									}?`}
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
								variant={pendingAction.variant === "destructive" ? "destructive" : "default"}
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
