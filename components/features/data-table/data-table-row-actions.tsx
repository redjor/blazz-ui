"use client"

import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import * as React from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { RowAction } from "./data-table.types"

interface DataTableRowActionsProps<TData> {
	row: Row<TData>
	actions: RowAction<TData>[]
}

export function DataTableRowActions<TData>({ row, actions }: DataTableRowActionsProps<TData>) {
	const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
	const [pendingAction, setPendingAction] = React.useState<RowAction<TData> | null>(null)

	// Filter actions based on hidden/disabled conditions
	const visibleActions = actions.filter((action) => !action.hidden || !action.hidden(row))

	if (visibleActions.length === 0) {
		return null
	}

	const handleActionClick = async (action: RowAction<TData>) => {
		// Check if disabled
		if (action.disabled?.(row)) {
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
					<DropdownMenuContent data-slot="data-table-row-actions-popup">
						<DropdownMenuGroup>
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
						</DropdownMenuGroup>
					</DropdownMenuContent>
			</DropdownMenu>

			{/* Confirmation Dialog */}
			{pendingAction && (
				<ConfirmationDialog
					open={isConfirmOpen}
					onOpenChange={(open) => {
						setIsConfirmOpen(open)
						if (!open) setPendingAction(null)
					}}
					title="Confirm Action"
					description={
						typeof pendingAction.confirmationMessage === "function"
							? pendingAction.confirmationMessage(row)
							: pendingAction.confirmationMessage || "Are you sure you want to perform this action?"
					}
					confirmLabel="Confirm"
					cancelLabel="Cancel"
					variant={pendingAction.variant === "destructive" ? "destructive" : "default"}
					onConfirm={confirmAction}
				/>
			)}
		</>
	)
}
