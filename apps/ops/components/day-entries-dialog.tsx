"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { EntryStatusBadge } from "@/components/entry-status-badge"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatMinutes } from "@/lib/format"
import { getEffectiveStatus } from "@/lib/time-entry-status"

type TimeEntry = Doc<"timeEntries">

interface DayEntriesDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	projectName: string
	date: string
	entries: TimeEntry[]
	onEdit: (entry: TimeEntry) => void
	onDelete: (entryId: Id<"timeEntries">) => void
	onAdd: () => void
}

export function DayEntriesDialog({ open, onOpenChange, projectName, date, entries, onEdit, onDelete, onAdd }: DayEntriesDialogProps) {
	const dateLabel = date ? format(new Date(`${date}T00:00:00`), "EEEE d MMMM", { locale: fr }) : ""
	const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{projectName}</DialogTitle>
				</DialogHeader>

				<div className="flex items-baseline justify-between rounded-lg bg-muted border border-edge px-4 py-3">
					<span className="text-sm text-fg-muted capitalize">{dateLabel}</span>
					<span className="text-sm font-medium font-mono text-fg">Total : {formatMinutes(totalMinutes)}</span>
				</div>

				<div className="space-y-1.5">
					{entries.map((entry) => (
						<div key={entry._id} className="group flex items-center gap-3 rounded-lg border border-edge px-3 py-2.5 hover:bg-muted transition-colors">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<span className="text-sm font-mono font-medium text-fg">{formatMinutes(entry.minutes)}</span>
									<EntryStatusBadge status={getEffectiveStatus(entry)} />
								</div>
								{entry.description && <p className="text-xs text-fg-muted mt-0.5 truncate">{entry.description}</p>}
							</div>
							<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-7"
									onClick={() => {
										onOpenChange(false)
										onEdit(entry)
									}}
								>
									<Pencil className="size-3.5" />
								</Button>
								<Button type="button" variant="ghost" size="icon" className="size-7 text-fg-muted hover:text-destructive" onClick={() => onDelete(entry._id)}>
									<Trash2 className="size-3.5" />
								</Button>
							</div>
						</div>
					))}
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full"
					onClick={() => {
						onOpenChange(false)
						onAdd()
					}}
				>
					<Plus className="size-3.5 mr-1.5" />
					Ajouter une entrée
				</Button>
			</DialogContent>
		</Dialog>
	)
}
