"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { DataTableView, FilterGroup } from "./data-table.types"
import type { SortingState, VisibilityState } from "@tanstack/react-table"
import { countActiveFilters } from "./data-table.utils"

interface SaveViewDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	currentState: {
		filters: FilterGroup | null
		sorting: SortingState
		columnVisibility: VisibilityState
	}
	existingViews: DataTableView[]
	onSave: (view: Omit<DataTableView, "id" | "createdAt" | "updatedAt">) => void
	locale?: "fr" | "en"
}

/**
 * Generate a unique ID for a custom view based on its name
 */
const generateViewId = (name: string): string => {
	const slug = name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
	return `custom-${slug}-${Date.now()}`
}

const translations = {
	fr: {
		title: "Enregistrer la vue",
		description: "Créez une vue personnalisée avec les filtres et paramètres actuels",
		nameLabel: "Nom de la vue",
		namePlaceholder: "Ma vue personnalisée",
		defaultLabel: "Définir comme vue par défaut",
		filtersInfo: (count: number) => `${count} filtre${count > 1 ? "s" : ""} actif${count > 1 ? "s" : ""}`,
		sortingInfo: (column: string, desc: boolean) =>
			`Tri par ${column} (${desc ? "décroissant" : "croissant"})`,
		noFilters: "Aucun filtre actif",
		noSorting: "Aucun tri",
		cancel: "Annuler",
		save: "Enregistrer",
		errors: {
			nameRequired: "Le nom est requis",
			nameTooLong: "Le nom ne peut pas dépasser 50 caractères",
			nameExists: "Ce nom de vue existe déjà",
		},
	},
	en: {
		title: "Save View",
		description: "Create a custom view with current filters and settings",
		nameLabel: "View Name",
		namePlaceholder: "My custom view",
		defaultLabel: "Set as default view",
		filtersInfo: (count: number) => `${count} active filter${count > 1 ? "s" : ""}`,
		sortingInfo: (column: string, desc: boolean) => `Sort by ${column} (${desc ? "descending" : "ascending"})`,
		noFilters: "No active filters",
		noSorting: "No sorting",
		cancel: "Cancel",
		save: "Save",
		errors: {
			nameRequired: "Name is required",
			nameTooLong: "Name cannot exceed 50 characters",
			nameExists: "This view name already exists",
		},
	},
}

export function DataTableSaveViewDialog({
	open,
	onOpenChange,
	currentState,
	existingViews,
	onSave,
	locale = "en",
}: SaveViewDialogProps) {
	const t = translations[locale]
	const [viewName, setViewName] = React.useState("")
	const [isDefault, setIsDefault] = React.useState(false)
	const [error, setError] = React.useState<string | null>(null)

	// Reset form when dialog opens
	React.useEffect(() => {
		if (open) {
			setViewName("")
			setIsDefault(false)
			setError(null)
		}
	}, [open])

	// Calculate filter count
	const filterCount = currentState.filters ? countActiveFilters(currentState.filters) : 0

	// Get sorting info
	const sortingInfo = React.useMemo(() => {
		if (currentState.sorting.length === 0) return null
		const firstSort = currentState.sorting[0]
		return {
			column: firstSort.id,
			desc: firstSort.desc,
		}
	}, [currentState.sorting])

	// Validate name
	const validateName = (name: string): string | null => {
		if (!name.trim()) {
			return t.errors.nameRequired
		}
		if (name.length > 50) {
			return t.errors.nameTooLong
		}
		// Check for duplicate names (case-insensitive)
		const existingNames = existingViews.map((v) => v.name.toLowerCase())
		if (existingNames.includes(name.toLowerCase())) {
			return t.errors.nameExists
		}
		return null
	}

	// Handle name change
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value
		setViewName(newName)
		setError(validateName(newName))
	}

	// Handle save
	const handleSave = () => {
		const validationError = validateName(viewName)
		if (validationError) {
			setError(validationError)
			return
		}

		const newView: Omit<DataTableView, "id" | "createdAt" | "updatedAt"> = {
			name: viewName.trim(),
			description: undefined,
			icon: undefined,
			isSystem: false,
			isDefault,
			filters: currentState.filters || { id: "root", operator: "AND", conditions: [] },
			sorting: currentState.sorting.length > 0 ? currentState.sorting : undefined,
			columnVisibility: Object.keys(currentState.columnVisibility).length > 0
				? currentState.columnVisibility
				: undefined,
		}

		onSave(newView)
		onOpenChange(false)
	}

	const isValid = !error && viewName.trim().length > 0

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
					{/* Current State Info */}
					<div className="rounded-lg border border-border bg-muted/50 p-3 space-y-2">
						<div className="flex items-center gap-2">
							{filterCount > 0 ? (
								<Badge variant="secondary">{t.filtersInfo(filterCount)}</Badge>
							) : (
								<span className="text-sm text-muted-foreground">{t.noFilters}</span>
							)}
						</div>
						{sortingInfo ? (
							<p className="text-sm text-muted-foreground">
								{t.sortingInfo(sortingInfo.column, sortingInfo.desc)}
							</p>
						) : (
							<p className="text-sm text-muted-foreground">{t.noSorting}</p>
						)}
					</div>

					{/* Form */}
					<div className="space-y-4">
						{/* Name Input */}
						<div className="space-y-2">
							<Label htmlFor="view-name">{t.nameLabel}</Label>
							<Input
								id="view-name"
								value={viewName}
								onChange={handleNameChange}
								placeholder={t.namePlaceholder}
								autoFocus
								maxLength={50}
								className={error ? "border-destructive" : ""}
							/>
							{error && <p className="text-sm text-destructive">{error}</p>}
						</div>

						{/* Default Checkbox */}
						<div className="flex items-center space-x-2">
							<Checkbox id="is-default" checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked === true)} />
							<Label htmlFor="is-default" className="text-sm font-normal cursor-pointer">
								{t.defaultLabel}
							</Label>
						</div>
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
