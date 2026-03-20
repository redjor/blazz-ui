"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"

interface GoalsConfigDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	year: number
	plan: any
}

export function GoalsConfigDialog({ open, onOpenChange, year }: GoalsConfigDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Objectifs {year}</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-fg-muted">Configuration — à implémenter</p>
			</DialogContent>
		</Dialog>
	)
}
