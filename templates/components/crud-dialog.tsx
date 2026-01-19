/**
 * Pattern: CRUD Dialog
 *
 * Dialog réutilisable pour Create/Edit avec formulaire.
 * Cas d'usage: Création et édition d'entités dans dialogs
 *
 * Features:
 * - Mode Create/Edit automatique
 * - Formulaire avec validation
 * - Generic TypeScript (réutilisable)
 * - Save/Cancel actions
 * - Loading states
 * - Reset automatique
 */

'use client'

import { useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// TODO: Remplacer par votre schéma
const exampleSchema = z.object({
	name: z.string().min(3, 'Minimum 3 caractères').max(100),
	email: z.string().email('Email invalide'),
	status: z.enum(['active', 'inactive']),
})

type ExampleFormValues = z.infer<typeof exampleSchema>

// TODO: Remplacer par votre type d'entité
interface ExampleEntity extends ExampleFormValues {
	id: string
	createdAt: Date
}

/**
 * Props génériques pour CRUDDialog
 *
 * @template TEntity - Type de l'entité (avec id)
 * @template TFormValues - Type des valeurs du formulaire (sans id)
 */
interface CRUDDialogProps<
	TEntity extends { id: string },
	TFormValues extends Record<string, any>,
> {
	/** Dialog ouvert/fermé */
	open: boolean
	/** Handler changement état open */
	onOpenChange: (open: boolean) => void
	/** Item à éditer (null pour création) */
	item: TEntity | null
	/** Schéma de validation Zod */
	schema: z.ZodSchema<TFormValues>
	/** Valeurs par défaut du formulaire */
	defaultValues: TFormValues
	/** Handler de soumission */
	onSubmit: (values: TFormValues, isEditing: boolean) => Promise<void> | void
	/** Titre pour création */
	createTitle?: string
	/** Titre pour édition */
	editTitle?: string
	/** Render function pour les champs du formulaire */
	renderFields: (form: UseFormReturn<TFormValues>) => React.ReactNode
	/** État de chargement externe (optionnel) */
	isLoading?: boolean
}

/**
 * Composant Dialog CRUD générique et réutilisable
 *
 * @example
 * ```tsx
 * <CRUDDialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   item={selectedUser}
 *   schema={userSchema}
 *   defaultValues={{ name: '', email: '', status: 'active' }}
 *   onSubmit={async (values, isEditing) => {
 *     if (isEditing) {
 *       await updateUser(selectedUser.id, values)
 *     } else {
 *       await createUser(values)
 *     }
 *   }}
 *   renderFields={(form) => (
 *     <>
 *       <FormField name="name" control={form.control} ... />
 *       <FormField name="email" control={form.control} ... />
 *     </>
 *   )}
 * />
 * ```
 */
export function CRUDDialog<
	TEntity extends { id: string },
	TFormValues extends Record<string, any>,
>({
	open,
	onOpenChange,
	item,
	schema,
	defaultValues,
	onSubmit,
	createTitle = 'Créer',
	editTitle = 'Éditer',
	renderFields,
	isLoading: externalLoading = false,
}: CRUDDialogProps<TEntity, TFormValues>) {
	const isEditing = !!item

	const form = useForm<TFormValues>({
		resolver: zodResolver(schema),
		defaultValues,
	})

	// Reset form quand item change ou dialog ouvre/ferme
	useEffect(() => {
		if (item) {
			// Extraire les champs du formulaire de l'item (exclure id, createdAt, etc.)
			const { id, createdAt, updatedAt, ...formData } = item as any
			form.reset(formData as TFormValues)
		} else {
			form.reset(defaultValues)
		}
	}, [item, defaultValues, form])

	const handleSubmit = async (values: TFormValues) => {
		try {
			await onSubmit(values, isEditing)
			onOpenChange(false)
			form.reset(defaultValues)
		} catch (error) {
			console.error('Error submitting form:', error)
			// L'erreur peut être gérée par le parent via onSubmit
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditing ? editTitle : createTitle}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						{renderFields(form)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={externalLoading || form.formState.isSubmitting}
							>
								Annuler
							</Button>
							<Button
								type="submit"
								disabled={externalLoading || form.formState.isSubmitting}
							>
								{externalLoading || form.formState.isSubmitting
									? 'Sauvegarde...'
									: isEditing
										? 'Sauvegarder'
										: 'Créer'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

// =============================================================================
// EXEMPLE D'UTILISATION
// =============================================================================

/**
 * Exemple: Utilisation avec une entité User
 */
export function ExampleUsage() {
	const [open, setOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<ExampleEntity | null>(null)

	const handleCreate = () => {
		setSelectedUser(null)
		setOpen(true)
	}

	const handleEdit = (user: ExampleEntity) => {
		setSelectedUser(user)
		setOpen(true)
	}

	const handleSubmit = async (values: ExampleFormValues, isEditing: boolean) => {
		console.log(isEditing ? 'Updating' : 'Creating', values)
		// TODO: Implémenter votre logique API
		if (isEditing && selectedUser) {
			// await updateUser(selectedUser.id, values)
		} else {
			// await createUser(values)
		}
	}

	return (
		<>
			<Button onClick={handleCreate}>Créer</Button>

			<CRUDDialog<ExampleEntity, ExampleFormValues>
				open={open}
				onOpenChange={setOpen}
				item={selectedUser}
				schema={exampleSchema}
				defaultValues={{
					name: '',
					email: '',
					status: 'active',
				}}
				onSubmit={handleSubmit}
				createTitle="Nouvel utilisateur"
				editTitle="Éditer l'utilisateur"
				renderFields={(form) => (
					<>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom</FormLabel>
									<FormControl>
										<Input placeholder="Jean Dupont" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="jean@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Statut</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Actif</SelectItem>
												<SelectItem value="inactive">Inactif</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}
			/>
		</>
	)
}

// =============================================================================
// VARIANTE: Dialog avec Submit handler externe
// =============================================================================

/**
 * Variante: CRUDDialog qui expose la soumission au parent
 * Utile si vous voulez gérer les erreurs de façon custom
 */
export function CRUDDialogWithExternalSubmit<
	TEntity extends { id: string },
	TFormValues extends Record<string, any>,
>({
	open,
	onOpenChange,
	item,
	schema,
	defaultValues,
	onSubmit,
	createTitle = 'Créer',
	editTitle = 'Éditer',
	renderFields,
	renderFooter,
}: CRUDDialogProps<TEntity, TFormValues> & {
	renderFooter?: (form: UseFormReturn<TFormValues>, isEditing: boolean) => React.ReactNode
}) {
	const isEditing = !!item
	const form = useForm<TFormValues>({
		resolver: zodResolver(schema),
		defaultValues,
	})

	useEffect(() => {
		if (item) {
			const { id, createdAt, updatedAt, ...formData } = item as any
			form.reset(formData as TFormValues)
		} else {
			form.reset(defaultValues)
		}
	}, [item, defaultValues, form])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEditing ? editTitle : createTitle}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => onSubmit(values, isEditing))}
						className="space-y-4"
					>
						{renderFields(form)}

						{renderFooter ? (
							renderFooter(form, isEditing)
						) : (
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => onOpenChange(false)}
								>
									Annuler
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{isEditing ? 'Sauvegarder' : 'Créer'}
								</Button>
							</DialogFooter>
						)}
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
