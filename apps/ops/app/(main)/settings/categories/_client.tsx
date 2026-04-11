"use client"

import { SettingsHeader, SettingsPage, SettingsSection } from "@blazz/pro/components/blocks/settings-block"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { Input } from "@blazz/ui/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@blazz/ui/components/ui/item"
import { useMutation, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { ColorPicker, IconPicker } from "@/components/icon-picker"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { getIcon } from "@/lib/icon-palette"

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryDot({ color }: { color?: string }) {
	const colorMap: Record<string, string> = {
		indigo: "bg-indigo-500",
		violet: "bg-violet-500",
		rose: "bg-rose-500",
		orange: "bg-orange-500",
		amber: "bg-amber-500",
		emerald: "bg-emerald-500",
		sky: "bg-sky-500",
		zinc: "bg-zinc-400",
	}
	return <span className={`size-2.5 shrink-0 rounded-full ${colorMap[color ?? "zinc"] ?? colorMap.zinc}`} />
}

function CategoryIcon({ iconId, color }: { iconId?: string; color?: string }) {
	const Icon = getIcon(iconId)
	if (!Icon) return <CategoryDot color={color} />

	const textColorMap: Record<string, string> = {
		indigo: "text-indigo-500",
		violet: "text-violet-500",
		rose: "text-rose-500",
		orange: "text-orange-500",
		amber: "text-amber-500",
		emerald: "text-emerald-500",
		sky: "text-sky-500",
		zinc: "text-zinc-400",
	}

	return <Icon className={`size-4 shrink-0 ${textColorMap[color ?? "zinc"] ?? textColorMap.zinc}`} />
}

// ---------------------------------------------------------------------------
// Dialogs
// ---------------------------------------------------------------------------

function CreateCategoryDialog() {
	const createCategory = useMutation(api.categories.create)
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [color, setColor] = useState("indigo")
	const [icon, setIcon] = useState("folder")

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!name.trim()) return
		await createCategory({ name: name.trim(), color, icon })
		setName("")
		setColor("indigo")
		setIcon("folder")
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button size="sm" />}>
				<Plus className="size-3.5 mr-1" />
				Nouvelle catégorie
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Nouvelle catégorie</DialogTitle>
					</DialogHeader>
					<BlockStack gap="400" className="py-4">
						<BlockStack gap="200">
							<label className="text-sm font-medium text-fg">Nom</label>
							<Input placeholder="Ex: Clients, Facturation…" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
						</BlockStack>
						<BlockStack gap="200">
							<label className="text-sm font-medium text-fg">Couleur</label>
							<ColorPicker value={color} onChange={setColor} />
						</BlockStack>
						<BlockStack gap="200">
							<label className="text-sm font-medium text-fg">Icône</label>
							<IconPicker value={icon} onChange={setIcon} color={color} />
						</BlockStack>
					</BlockStack>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={!name.trim()}>
							Créer
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

function EditCategoryDialog({
	category,
	open,
	onOpenChange,
}: {
	category: {
		_id: Id<"categories">
		name: string
		color?: string
		icon?: string
	}
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const updateCategory = useMutation(api.categories.update)
	const [name, setName] = useState(category.name)
	const [color, setColor] = useState(category.color ?? "zinc")
	const [icon, setIcon] = useState(category.icon ?? "folder")

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!name.trim()) return
		await updateCategory({
			id: category._id,
			name: name.trim(),
			color,
			icon,
		})
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Modifier la catégorie</DialogTitle>
					</DialogHeader>
					<BlockStack gap="400" className="py-4">
						<BlockStack gap="200">
							<label className="text-sm font-medium text-fg">Nom</label>
							<Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
						</BlockStack>
						<BlockStack gap="200">
							<label className="text-sm font-medium text-fg">Couleur</label>
							<ColorPicker value={color} onChange={setColor} />
						</BlockStack>
						<BlockStack gap="200">
							<label className="text-sm font-medium text-fg">Icône</label>
							<IconPicker value={icon} onChange={setIcon} color={color} />
						</BlockStack>
					</BlockStack>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Annuler
						</Button>
						<Button type="submit" disabled={!name.trim()}>
							Enregistrer
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

// ---------------------------------------------------------------------------
// Category row
// ---------------------------------------------------------------------------

function CategoryItem({
	category,
}: {
	category: {
		_id: Id<"categories">
		name: string
		color?: string
		icon?: string
		createdAt: number
	}
}) {
	const removeCategory = useMutation(api.categories.remove)
	const [editOpen, setEditOpen] = useState(false)

	return (
		<>
			<Item>
				<ItemMedia variant="icon">
					<CategoryIcon iconId={category.icon} color={category.color} />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>{category.name}</ItemTitle>
					<ItemDescription>
						Créé{" "}
						{formatDistanceToNow(new Date(category.createdAt), {
							addSuffix: true,
							locale: fr,
						})}
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
							<MoreHorizontal className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setEditOpen(true)}>
								<Pencil className="size-3.5 mr-2" />
								Modifier
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-negative" onClick={() => removeCategory({ id: category._id })}>
								<Trash2 className="size-3.5 mr-2" />
								Supprimer
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ItemActions>
			</Item>
			<EditCategoryDialog category={category} open={editOpen} onOpenChange={setEditOpen} />
		</>
	)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CategoriesPageClient() {
	const categories = useQuery(api.categories.list, {})

	return (
		<SettingsPage>
			<SettingsHeader title="Catégories">{categories && categories.length > 0 && <CreateCategoryDialog />}</SettingsHeader>
			<SettingsSection title="Toutes les catégories" description="Utilisées pour organiser vos todos.">
				{categories === undefined ? (
					<Item>
						<ItemContent>
							<ItemDescription>Chargement…</ItemDescription>
						</ItemContent>
					</Item>
				) : categories.length === 0 ? (
					<Item>
						<ItemContent>
							<ItemDescription>Aucune catégorie. Créez-en une pour organiser vos todos.</ItemDescription>
						</ItemContent>
						<ItemActions>
							<CreateCategoryDialog />
						</ItemActions>
					</Item>
				) : (
					categories.map((cat) => <CategoryItem key={cat._id} category={cat} />)
				)}
			</SettingsSection>
		</SettingsPage>
	)
}
