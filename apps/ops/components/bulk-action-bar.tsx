"use client"

import { useState } from "react"
import { Trash2, X } from "lucide-react"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import type { EntryStatus } from "@/lib/time-entry-status"
import {
	ENTRY_STATUS_LABELS,
	getAllowedTransitions,
	getEffectiveStatus,
} from "@/lib/time-entry-status"

interface BulkActionBarProps {
	selectedIds: Set<string>
	entries: Array<{
		_id: string
		status?: EntryStatus | null
		billable: boolean
		invoicedAt?: number | null
	}>
	onClear: () => void
	onStatusChange: (ids: string[], status: EntryStatus) => void
	onBillableChange: (ids: string[], billable: boolean) => void
	onDelete: (ids: string[]) => void
}

function intersectSets<T>(sets: Set<T>[]): Set<T> {
	if (sets.length === 0) return new Set()
	const [first, ...rest] = sets
	return new Set([...first].filter((item) => rest.every((s) => s.has(item))))
}

export function BulkActionBar({
	selectedIds,
	entries,
	onClear,
	onStatusChange,
	onBillableChange,
	onDelete,
}: BulkActionBarProps) {
	const [confirmOpen, setConfirmOpen] = useState(false)

	if (selectedIds.size === 0) return null

	const selectedEntries = entries.filter((e) => selectedIds.has(e._id))
	const selectedCount = selectedEntries.length
	const selectedIdsArray = selectedEntries.map((e) => e._id)

	// Compute common transitions across all selected entries
	const transitionSets = selectedEntries.map(
		(entry) => new Set(getAllowedTransitions(getEffectiveStatus(entry))),
	)
	const commonTransitions = intersectSets(transitionSets)

	// Determine billable state
	const allBillable = selectedEntries.every((e) => e.billable)
	const allNonBillable = selectedEntries.every((e) => !e.billable)

	function handleDelete() {
		onDelete(selectedIdsArray)
		setConfirmOpen(false)
	}

	return (
		<>
			<div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
				<div className="bg-raised border border-edge rounded-lg shadow-lg px-4 py-2.5">
					<InlineStack gap="300" blockAlign="center" wrap={false}>
						{/* Selection count + clear */}
						<InlineStack gap="150" blockAlign="center" wrap={false}>
							<span className="text-sm font-medium text-fg whitespace-nowrap">
								{selectedCount} sélectionnée{selectedCount > 1 ? "s" : ""}
							</span>
							<Button variant="ghost" size="sm" onClick={onClear}>
								<X className="size-3.5" />
							</Button>
						</InlineStack>

						{/* Separator */}
						{commonTransitions.size > 0 && (
							<div className="h-4 w-px bg-edge" />
						)}

						{/* Status transition buttons */}
						{[...commonTransitions].map((status) => (
							<Button
								key={status}
								variant="outline"
								size="sm"
								onClick={() => onStatusChange(selectedIdsArray, status)}
							>
								{ENTRY_STATUS_LABELS[status]}
							</Button>
						))}

						{/* Separator */}
						<div className="h-4 w-px bg-edge" />

						{/* Billable toggle buttons */}
						{allBillable && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onBillableChange(selectedIdsArray, false)}
							>
								Non facturable
							</Button>
						)}
						{allNonBillable && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onBillableChange(selectedIdsArray, true)}
							>
								Facturable
							</Button>
						)}
						{!allBillable && !allNonBillable && (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onBillableChange(selectedIdsArray, true)}
								>
									Facturable
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onBillableChange(selectedIdsArray, false)}
								>
									Non facturable
								</Button>
							</>
						)}

						{/* Separator */}
						<div className="h-4 w-px bg-edge" />

						{/* Delete button */}
						<Button
							variant="destructive"
							size="sm"
							onClick={() => setConfirmOpen(true)}
						>
							<Trash2 className="size-3.5 mr-1" />
							Supprimer
						</Button>
					</InlineStack>
				</div>
			</div>

			{/* Delete confirmation dialog */}
			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirmer la suppression</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-fg-muted">
						{selectedCount} entrée{selectedCount > 1 ? "s" : ""} seront
						supprimée{selectedCount > 1 ? "s" : ""}. Cette action est
						irréversible.
					</p>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setConfirmOpen(false)}
						>
							Annuler
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							Supprimer
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
