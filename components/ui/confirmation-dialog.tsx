"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

export interface ConfirmationDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title?: string
	description: string
	confirmLabel?: string
	cancelLabel?: string
	onConfirm: () => void | Promise<void>
	variant?: "default" | "destructive"
}

/**
 * ConfirmationDialog - Reusable confirmation dialog component
 *
 * Provides a standard confirmation dialog with customizable title, description,
 * and action buttons. Supports destructive variant styling.
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Item"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmLabel="Delete"
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export function ConfirmationDialog({
	open,
	onOpenChange,
	title = "Are you sure?",
	description,
	confirmLabel = "Continue",
	cancelLabel = "Cancel",
	onConfirm,
	variant = "default",
}: ConfirmationDialogProps) {
	const handleConfirm = () => {
		onConfirm()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false}>
				<DialogHeader separator={false}>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						{cancelLabel}
					</Button>
					<Button
						variant={variant === "destructive" ? "destructive" : "default"}
						onClick={handleConfirm}
					>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
