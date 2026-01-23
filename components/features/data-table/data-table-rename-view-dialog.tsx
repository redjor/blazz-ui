"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DataTableView } from "./data-table.types"

interface RenameViewDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	view: DataTableView | null
	existingViews: DataTableView[]
	onRename: (viewId: string, newName: string) => void
	locale?: "fr" | "en"
}

const translations = {
	fr: {
		title: "Renommer la vue",
		description: "Modifier le nom de la vue",
		nameLabel: "Nouveau nom",
		cancel: "Annuler",
		save: "Renommer",
		errors: {
			nameRequired: "Le nom est requis",
			nameTooLong: "Le nom ne peut pas dépasser 50 caractères",
			nameExists: "Ce nom de vue existe déjà",
		},
	},
	en: {
		title: "Rename View",
		description: "Change the view name",
		nameLabel: "New name",
		cancel: "Cancel",
		save: "Rename",
		errors: {
			nameRequired: "Name is required",
			nameTooLong: "Name cannot exceed 50 characters",
			nameExists: "This view name already exists",
		},
	},
}

export function DataTableRenameViewDialog({
	open,
	onOpenChange,
	view,
	existingViews,
	onRename,
	locale = "en",
}: RenameViewDialogProps) {
	const t = translations[locale]
	const [newName, setNewName] = React.useState("")
	const [error, setError] = React.useState<string | null>(null)

	// Reset form when dialog opens with the current view name
	React.useEffect(() => {
		if (open && view) {
			setNewName(view.name)
			setError(null)
		}
	}, [open, view])

	// Validate name
	const validateName = (name: string): string | null => {
		if (!name.trim()) {
			return t.errors.nameRequired
		}
		if (name.length > 50) {
			return t.errors.nameTooLong
		}
		// Check for duplicate names (case-insensitive), excluding current view
		const existingNames = existingViews
			.filter((v) => v.id !== view?.id)
			.map((v) => v.name.toLowerCase())
		if (existingNames.includes(name.toLowerCase())) {
			return t.errors.nameExists
		}
		return null
	}

	// Handle name change
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setNewName(value)
		setError(validateName(value))
	}

	// Handle save
	const handleSave = () => {
		if (!view) return

		const validationError = validateName(newName)
		if (validationError) {
			setError(validationError)
			return
		}

		onRename(view.id, newName.trim())
		onOpenChange(false)
	}

	const isValid = !error && newName.trim().length > 0 && newName.trim() !== view?.name

	if (!view) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md" showCloseButton={false}>
				<div className="flex items-start justify-between">
					<div>
						<DialogTitle>{t.title}</DialogTitle>
						<DialogDescription>{t.description}</DialogDescription>
					</div>
					<DialogClose />
				</div>

				<div className="mt-6 space-y-4">
					{/* Name Input */}
					<div className="space-y-2">
						<Label htmlFor="view-name">{t.nameLabel}</Label>
						<Input
							id="view-name"
							value={newName}
							onChange={handleNameChange}
							autoFocus
							maxLength={50}
							className={error ? "border-destructive" : ""}
							onKeyDown={(e) => {
								if (e.key === "Enter" && isValid) {
									handleSave()
								}
							}}
						/>
						{error && <p className="text-sm text-destructive">{error}</p>}
					</div>
				</div>

				{/* Footer */}
				<div className="mt-6 flex justify-end gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						{t.cancel}
					</Button>
					<Button onClick={handleSave} disabled={!isValid}>
						{t.save}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
