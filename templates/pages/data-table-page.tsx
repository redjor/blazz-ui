/**
 * Template: DataTable CRUD Page
 *
 * Page CRUD complète avec DataTable enterprise-grade.
 * Cas d'usage: Gestion données tabulaires, admin panels, CRM
 *
 * Features:
 * - DataTable avec sorting, filtering, pagination
 * - Dialog Create/Edit avec formulaire
 * - Delete confirmation
 * - Row selection & bulk actions
 * - Filtres avancés
 * - Recherche globale
 */

'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { DataTable, type ColumnDef } from '@/components/features/data-table'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// TODO: Remplacer par votre type d'entité
interface Entity {
	id: string
	name: string
	email: string
	status: 'active' | 'inactive' | 'pending'
	role: 'admin' | 'user' | 'guest'
	createdAt: Date
	lastLogin?: Date
}

// TODO: Adapter le schéma de validation à votre entité
const entitySchema = z.object({
	name: z.string().min(3, 'Minimum 3 caractères').max(100),
	email: z.string().email('Email invalide'),
	status: z.enum(['active', 'inactive', 'pending']),
	role: z.enum(['admin', 'user', 'guest']),
})

type EntityFormValues = z.infer<typeof entitySchema>

// TODO: Remplacer par vos données réelles (API call, etc.)
const mockData: Entity[] = [
	{
		id: '1',
		name: 'Jean Dupont',
		email: 'jean.dupont@example.com',
		status: 'active',
		role: 'admin',
		createdAt: new Date('2024-01-15'),
		lastLogin: new Date('2024-01-18'),
	},
	{
		id: '2',
		name: 'Marie Martin',
		email: 'marie.martin@example.com',
		status: 'active',
		role: 'user',
		createdAt: new Date('2024-01-16'),
		lastLogin: new Date('2024-01-17'),
	},
	{
		id: '3',
		name: 'Pierre Durand',
		email: 'pierre.durand@example.com',
		status: 'pending',
		role: 'guest',
		createdAt: new Date('2024-01-17'),
	},
	// Ajouter plus d'items pour tester pagination...
]

export default function DataTablePage() {
	const [data, setData] = useState<Entity[]>(mockData)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<Entity | null>(null)
	const [itemToDelete, setItemToDelete] = useState<Entity | null>(null)

	const isEditing = !!selectedItem

	// Form avec validation Zod
	const form = useForm<EntityFormValues>({
		resolver: zodResolver(entitySchema),
		defaultValues: {
			name: '',
			email: '',
			status: 'active',
			role: 'user',
		},
	})

	// Reset form quand dialog ouvre/ferme ou selectedItem change
	useState(() => {
		if (selectedItem) {
			form.reset({
				name: selectedItem.name,
				email: selectedItem.email,
				status: selectedItem.status,
				role: selectedItem.role,
			})
		} else {
			form.reset({
				name: '',
				email: '',
				status: 'active',
				role: 'user',
			})
		}
	})

	// TODO: Définir les colonnes de votre DataTable
	const columns = useMemo<ColumnDef<Entity>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Nom',
				cell: ({ row }) => (
					<div className="font-medium">{row.getValue('name')}</div>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
			},
			{
				accessorKey: 'status',
				header: 'Statut',
				cell: ({ row }) => {
					const status = row.getValue('status') as string
					return (
						<Badge
							variant={
								status === 'active'
									? 'default'
									: status === 'inactive'
										? 'secondary'
										: 'outline'
							}
						>
							{status}
						</Badge>
					)
				},
			},
			{
				accessorKey: 'role',
				header: 'Rôle',
				cell: ({ row }) => {
					const role = row.getValue('role') as string
					return (
						<Badge variant="outline">
							{role === 'admin' ? '👑 Admin' : role === 'user' ? '👤 User' : '👥 Guest'}
						</Badge>
					)
				},
			},
			{
				accessorKey: 'createdAt',
				header: 'Date création',
				cell: ({ row }) => {
					const date = row.getValue('createdAt') as Date
					return date.toLocaleDateString('fr-FR')
				},
			},
			{
				accessorKey: 'lastLogin',
				header: 'Dernière connexion',
				cell: ({ row }) => {
					const date = row.getValue('lastLogin') as Date | undefined
					return date ? date.toLocaleDateString('fr-FR') : '—'
				},
			},
			{
				id: 'actions',
				cell: ({ row }) => {
					const item = row.original

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon-sm" aria-label="Actions">
									<MoreHorizontal />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => handleEdit(item)}>
									<Edit className="mr-2 h-4 w-4" />
									Éditer
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleDuplicate(item)}>
									<Copy className="mr-2 h-4 w-4" />
									Dupliquer
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleDeleteConfirm(item)}
									className="text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Supprimer
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				},
			},
		],
		[]
	)

	// TODO: Configurer les filtres selon vos besoins
	const filters = [
		{
			column: 'status',
			title: 'Statut',
			options: [
				{ label: 'Actif', value: 'active' },
				{ label: 'Inactif', value: 'inactive' },
				{ label: 'En attente', value: 'pending' },
			],
		},
		{
			column: 'role',
			title: 'Rôle',
			options: [
				{ label: 'Admin', value: 'admin' },
				{ label: 'User', value: 'user' },
				{ label: 'Guest', value: 'guest' },
			],
		},
	]

	// TODO: Configurer les actions bulk selon vos besoins
	const bulkActions = [
		{
			label: 'Activer',
			onClick: (selectedRows: Entity[]) => {
				console.log('Activate', selectedRows)
				// TODO: Implémenter activation multiple
			},
		},
		{
			label: 'Désactiver',
			onClick: (selectedRows: Entity[]) => {
				console.log('Deactivate', selectedRows)
				// TODO: Implémenter désactivation multiple
			},
		},
		{
			label: 'Supprimer',
			variant: 'destructive' as const,
			onClick: (selectedRows: Entity[]) => {
				console.log('Delete multiple', selectedRows)
				// TODO: Implémenter suppression multiple
			},
		},
	]

	// Handlers
	const handleCreate = () => {
		setSelectedItem(null)
		form.reset({
			name: '',
			email: '',
			status: 'active',
			role: 'user',
		})
		setDialogOpen(true)
	}

	const handleEdit = (item: Entity) => {
		setSelectedItem(item)
		form.reset({
			name: item.name,
			email: item.email,
			status: item.status,
			role: item.role,
		})
		setDialogOpen(true)
	}

	const handleDuplicate = (item: Entity) => {
		const duplicate: Entity = {
			...item,
			id: crypto.randomUUID(),
			name: `${item.name} (copie)`,
			createdAt: new Date(),
			lastLogin: undefined,
		}
		setData([...data, duplicate])
	}

	const handleDeleteConfirm = (item: Entity) => {
		setItemToDelete(item)
		setDeleteDialogOpen(true)
	}

	const handleDelete = () => {
		if (itemToDelete) {
			setData(data.filter((i) => i.id !== itemToDelete.id))
			setDeleteDialogOpen(false)
			setItemToDelete(null)
		}
	}

	const onSubmit = (values: EntityFormValues) => {
		if (isEditing && selectedItem) {
			// Update existing
			setData(
				data.map((item) =>
					item.id === selectedItem.id
						? {
								...item,
								...values,
							}
						: item
				)
			)
		} else {
			// Create new
			const newItem: Entity = {
				id: crypto.randomUUID(),
				...values,
				createdAt: new Date(),
			}
			setData([...data, newItem])
		}

		setDialogOpen(false)
		form.reset()
	}

	return (
		<DashboardLayout>
			<Page>
				<PageHeader
					title="Gestion des Entités"
					description="Gérez vos entités avec DataTable"
					actions={
						<Button onClick={handleCreate}>
							<Plus className="mr-2" />
							Nouvelle entité
						</Button>
					}
				/>

				<DataTable
					data={data}
					columns={columns}
					searchPlaceholder="Rechercher..."
					filters={filters}
					bulkActions={bulkActions}
				/>

				{/* Dialog Create/Edit */}
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{isEditing ? 'Éditer l\'entité' : 'Nouvelle entité'}
							</DialogTitle>
						</DialogHeader>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Sélectionnez un statut" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="active">Actif</SelectItem>
													<SelectItem value="inactive">Inactif</SelectItem>
													<SelectItem value="pending">En attente</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Rôle</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Sélectionnez un rôle" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="admin">Admin</SelectItem>
													<SelectItem value="user">User</SelectItem>
													<SelectItem value="guest">Guest</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={() => setDialogOpen(false)}
									>
										Annuler
									</Button>
									<Button type="submit">
										{isEditing ? 'Sauvegarder' : 'Créer'}
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				</Dialog>

				{/* Delete Confirmation Dialog */}
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
							<AlertDialogDescription>
								Êtes-vous sûr de vouloir supprimer <strong>{itemToDelete?.name}</strong> ?
								Cette action est irréversible.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Annuler</AlertDialogCancel>
							<AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
								Supprimer
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</Page>
		</DashboardLayout>
	)
}
