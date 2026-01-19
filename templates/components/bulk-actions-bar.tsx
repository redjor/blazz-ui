/**
 * Pattern: Bulk Actions Bar
 *
 * Barre d'actions pour opérations multiples (bulk).
 * Cas d'usage: DataTables, listes avec sélection multiple
 *
 * Features:
 * - Affiche compteur d'items sélectionnés
 * - Actions multiples configurables
 * - Animation d'apparition/disparition
 * - Position sticky ou fixed
 * - Confirmation actions destructives
 * - Generic TypeScript
 */

'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Action de bulk
 */
export interface BulkAction<T = any> {
	/** Label de l'action */
	label: string
	/** Icône (composant Lucide) */
	icon?: React.ComponentType<{ className?: string }>
	/** Handler appelé avec les items sélectionnés */
	onClick: (selectedItems: T[]) => void | Promise<void>
	/** Variant du bouton */
	variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost'
	/** Demander confirmation avant exécution */
	requireConfirmation?: boolean
	/** Message de confirmation personnalisé */
	confirmationMessage?: string
	/** Titre de confirmation personnalisé */
	confirmationTitle?: string
	/** Désactiver l'action */
	disabled?: boolean
}

export interface BulkActionsBarProps<T = any> {
	/** Nombre d'items sélectionnés */
	selectedCount: number
	/** Items sélectionnés (pour passer aux actions) */
	selectedItems: T[]
	/** Liste des actions disponibles */
	actions: BulkAction<T>[]
	/** Handler pour désélectionner tous les items */
	onClearSelection: () => void
	/** Position de la barre */
	position?: 'sticky' | 'fixed' | 'relative'
	/** Classes CSS additionnelles */
	className?: string
	/** Texte personnalisé pour le compteur */
	counterText?: (count: number) => string
}

/**
 * Barre d'actions pour opérations en bulk
 *
 * @example
 * ```tsx
 * <BulkActionsBar
 *   selectedCount={selectedRows.length}
 *   selectedItems={selectedRows}
 *   onClearSelection={() => table.resetRowSelection()}
 *   actions={[
 *     {
 *       label: 'Activer',
 *       icon: Check,
 *       onClick: (items) => activateItems(items),
 *     },
 *     {
 *       label: 'Supprimer',
 *       icon: Trash2,
 *       variant: 'destructive',
 *       requireConfirmation: true,
 *       onClick: (items) => deleteItems(items),
 *     },
 *   ]}
 * />
 * ```
 */
export function BulkActionsBar<T = any>({
	selectedCount,
	selectedItems,
	actions,
	onClearSelection,
	position = 'sticky',
	className,
	counterText = (count) => `${count} élément${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}`,
}: BulkActionsBarProps<T>) {
	const [confirmAction, setConfirmAction] = React.useState<BulkAction<T> | null>(
		null
	)
	const [isExecuting, setIsExecuting] = React.useState(false)

	const handleActionClick = async (action: BulkAction<T>) => {
		if (action.requireConfirmation) {
			setConfirmAction(action)
		} else {
			await executeAction(action)
		}
	}

	const executeAction = async (action: BulkAction<T>) => {
		setIsExecuting(true)
		try {
			await action.onClick(selectedItems)
		} catch (error) {
			console.error('Error executing bulk action:', error)
		} finally {
			setIsExecuting(false)
			setConfirmAction(null)
		}
	}

	// Ne pas afficher si aucune sélection
	if (selectedCount === 0) {
		return null
	}

	const positionClasses = {
		sticky: 'sticky top-0 z-10',
		fixed: 'fixed bottom-0 left-0 right-0 z-50',
		relative: 'relative',
	}

	return (
		<>
			<div
				className={cn(
					'flex items-center justify-between gap-4 border-b bg-muted/50 px-4 py-3 backdrop-blur-sm animate-in slide-in-from-top',
					positionClasses[position],
					className
				)}
			>
				{/* Count & Clear */}
				<div className="flex items-center gap-3">
					<Badge variant="default" className="text-sm">
						{counterText(selectedCount)}
					</Badge>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClearSelection}
						aria-label="Désélectionner tout"
					>
						<X className="h-4 w-4" />
					</Button>
					<Separator orientation="vertical" className="h-6" />
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					{actions.map((action, index) => {
						const Icon = action.icon

						return (
							<Button
								key={index}
								variant={action.variant || 'outline'}
								size="sm"
								onClick={() => handleActionClick(action)}
								disabled={action.disabled || isExecuting}
							>
								{Icon && <Icon className="mr-2 h-4 w-4" />}
								{action.label}
							</Button>
						)
					})}
				</div>
			</div>

			{/* Confirmation Dialog */}
			<AlertDialog
				open={!!confirmAction}
				onOpenChange={(open) => !open && setConfirmAction(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{confirmAction?.confirmationTitle || 'Confirmer l\'action'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{confirmAction?.confirmationMessage ||
								`Êtes-vous sûr de vouloir appliquer cette action à ${selectedCount} élément${selectedCount > 1 ? 's' : ''} ? Cette action est irréversible.`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isExecuting}>
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => confirmAction && executeAction(confirmAction)}
							disabled={isExecuting}
							className={cn(
								confirmAction?.variant === 'destructive' &&
									'bg-destructive text-destructive-foreground hover:bg-destructive/90'
							)}
						>
							{isExecuting ? 'En cours...' : 'Confirmer'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

// =============================================================================
// VARIANTE: Bulk Actions Bar Compacte
// =============================================================================

export interface BulkActionsBarCompactProps<T = any> {
	selectedCount: number
	selectedItems: T[]
	actions: BulkAction<T>[]
	onClearSelection: () => void
	className?: string
}

/**
 * Version compacte de la Bulk Actions Bar (pour mobile)
 */
export function BulkActionsBarCompact<T = any>({
	selectedCount,
	selectedItems,
	actions,
	onClearSelection,
	className,
}: BulkActionsBarCompactProps<T>) {
	const [confirmAction, setConfirmAction] = React.useState<BulkAction<T> | null>(
		null
	)

	if (selectedCount === 0) return null

	return (
		<>
			<div
				className={cn(
					'fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-2 rounded-lg border bg-card p-3 shadow-lg animate-in slide-in-from-bottom',
					className
				)}
			>
				<div className="flex items-center gap-2">
					<Badge>{selectedCount}</Badge>
					<span className="text-sm font-medium">sélectionné{selectedCount > 1 ? 's' : ''}</span>
				</div>

				<div className="flex items-center gap-2">
					{actions.slice(0, 2).map((action, index) => {
						const Icon = action.icon
						return (
							<Button
								key={index}
								variant={action.variant || 'default'}
								size="sm"
								onClick={() =>
									action.requireConfirmation
										? setConfirmAction(action)
										: action.onClick(selectedItems)
								}
							>
								{Icon && <Icon className="h-4 w-4" />}
							</Button>
						)
					})}
					<Button variant="ghost" size="icon-sm" onClick={onClearSelection}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{confirmAction && (
				<AlertDialog
					open={!!confirmAction}
					onOpenChange={(open) => !open && setConfirmAction(null)}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirmer</AlertDialogTitle>
							<AlertDialogDescription>
								Appliquer à {selectedCount} élément{selectedCount > 1 ? 's' : ''} ?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Annuler</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									confirmAction.onClick(selectedItems)
									setConfirmAction(null)
								}}
							>
								Confirmer
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</>
	)
}

// =============================================================================
// EXEMPLES D'UTILISATION
// =============================================================================

import { Check, Trash2, Download, Mail, Archive } from 'lucide-react'

interface ExampleItem {
	id: string
	name: string
	status: 'active' | 'inactive'
}

export function BulkActionsBarExample() {
	const [selectedItems, setSelectedItems] = React.useState<ExampleItem[]>([
		{ id: '1', name: 'Item 1', status: 'active' },
		{ id: '2', name: 'Item 2', status: 'inactive' },
	])

	const bulkActions: BulkAction<ExampleItem>[] = [
		{
			label: 'Activer',
			icon: Check,
			variant: 'default',
			onClick: async (items) => {
				console.log('Activate', items)
				// TODO: Implémenter activation
				await new Promise((resolve) => setTimeout(resolve, 1000))
			},
		},
		{
			label: 'Archiver',
			icon: Archive,
			variant: 'secondary',
			onClick: async (items) => {
				console.log('Archive', items)
				// TODO: Implémenter archivage
			},
		},
		{
			label: 'Envoyer email',
			icon: Mail,
			variant: 'outline',
			onClick: (items) => {
				console.log('Send email to', items)
				// TODO: Implémenter envoi email
			},
		},
		{
			label: 'Exporter',
			icon: Download,
			variant: 'outline',
			onClick: (items) => {
				console.log('Export', items)
				// TODO: Implémenter export
			},
		},
		{
			label: 'Supprimer',
			icon: Trash2,
			variant: 'destructive',
			requireConfirmation: true,
			confirmationTitle: 'Supprimer les éléments ?',
			confirmationMessage:
				'Cette action supprimera définitivement les éléments sélectionnés.',
			onClick: async (items) => {
				console.log('Delete', items)
				// TODO: Implémenter suppression
				await new Promise((resolve) => setTimeout(resolve, 1000))
			},
		},
	]

	return (
		<div className="space-y-4">
			<BulkActionsBar
				selectedCount={selectedItems.length}
				selectedItems={selectedItems}
				actions={bulkActions}
				onClearSelection={() => setSelectedItems([])}
			/>

			<div className="p-4 border rounded-lg">
				<p className="text-sm text-muted-foreground">
					Simuler sélection: {selectedItems.length} items
				</p>
			</div>
		</div>
	)
}

// =============================================================================
// UTILITAIRES
// =============================================================================

/**
 * Hook pour gérer la sélection bulk avec React Table
 */
export function useBulkSelection<T>(table: any) {
	const selectedRows = table.getFilteredSelectedRowModel().rows
	const selectedItems = selectedRows.map((row: any) => row.original as T)
	const selectedCount = selectedRows.length

	const clearSelection = () => {
		table.resetRowSelection()
	}

	return {
		selectedCount,
		selectedItems,
		clearSelection,
	}
}
