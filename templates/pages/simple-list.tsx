/**
 * Template: Simple List Page
 *
 * Page avec liste d'items affichés en cards.
 * Cas d'usage: Galerie produits, liste articles, portfolio
 *
 * Features:
 * - Grid responsive de cards
 * - Search bar
 * - Bouton création
 * - Actions par card (edit, delete)
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

// TODO: Remplacer par votre type
interface Item {
	id: string
	title: string
	description: string
	status: 'active' | 'draft' | 'archived'
	imageUrl?: string
	createdAt: Date
}

// TODO: Remplacer par vos données réelles (API call, etc.)
const mockItems: Item[] = [
	{
		id: '1',
		title: 'Item 1',
		description: 'Description de l\'item 1',
		status: 'active',
		createdAt: new Date(),
	},
	{
		id: '2',
		title: 'Item 2',
		description: 'Description de l\'item 2',
		status: 'draft',
		createdAt: new Date(),
	},
	// Ajouter plus d'items...
]

export default function SimpleListPage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [items, setItems] = useState<Item[]>(mockItems)

	// Filtrage par recherche
	const filteredItems = items.filter(
		(item) =>
			item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
	)

	// Handlers
	const handleCreate = () => {
		console.log('Create new item')
		// TODO: Ouvrir dialog de création
	}

	const handleEdit = (item: Item) => {
		console.log('Edit item:', item.id)
		// TODO: Ouvrir dialog d'édition
	}

	const handleDelete = (item: Item) => {
		console.log('Delete item:', item.id)
		// TODO: Confirmer et supprimer
		setItems(items.filter((i) => i.id !== item.id))
	}

	return (
		<DashboardLayout>
			<Page>
				<PageHeader
					title="Liste des Items"
					description="Gérez vos items"
					actions={
						<Button onClick={handleCreate}>
							<Plus className="mr-2" />
							Nouvel item
						</Button>
					}
				/>

				{/* Search Bar */}
				<div className="mb-6">
					<div className="relative max-w-md">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Rechercher..."
							className="pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* Items Grid */}
				{filteredItems.length === 0 ? (
					<Card>
						<CardContent className="py-10 text-center">
							<p className="text-muted-foreground">
								{searchQuery
									? 'Aucun résultat trouvé'
									: 'Aucun item pour le moment'}
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{filteredItems.map((item) => (
							<Card key={item.id}>
								{item.imageUrl && (
									<img
										src={item.imageUrl}
										alt={item.title}
										className="h-48 w-full object-cover"
									/>
								)}

								<CardHeader>
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="line-clamp-1">
											{item.title}
										</CardTitle>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon-sm"
													aria-label="Actions"
												>
													<MoreHorizontal />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onClick={() => handleEdit(item)}>
													<Edit className="mr-2" />
													Éditer
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleDelete(item)}
													className="text-destructive"
												>
													<Trash2 className="mr-2" />
													Supprimer
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardHeader>

								<CardContent>
									<p className="text-sm text-muted-foreground line-clamp-2">
										{item.description}
									</p>
								</CardContent>

								<CardFooter className="justify-between">
									<Badge
										variant={
											item.status === 'active' ? 'default' : 'secondary'
										}
									>
										{item.status}
									</Badge>
									<span className="text-xs text-muted-foreground">
										{item.createdAt.toLocaleDateString('fr-FR')}
									</span>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</Page>
		</DashboardLayout>
	)
}
