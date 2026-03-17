"use client"

import { CATEGORY_COLORS } from "@/components/manage-categories-sheet"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
	ItemDescription,
} from "@blazz/ui/components/ui/item"
import {
	SettingsPage,
	SettingsHeader,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import { useMutation, useQuery } from "convex/react"
import {
	Briefcase,
	Building2,
	Calculator,
	Calendar,
	Clock,
	Code,
	CreditCard,
	FileText,
	FolderOpen,
	Globe,
	Hash,
	Heart,
	Home,
	Layers,
	Mail,
	type LucideIcon,
	MessageSquare,
	MoreHorizontal,
	Package,
	Pencil,
	Plus,
	Receipt,
	Settings,
	ShoppingCart,
	Star,
	Tag,
	Trash2,
	Users,
	Wallet,
	Zap,
} from "lucide-react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

// ---------------------------------------------------------------------------
// Icon registry — curated set for a freelance/project management context
// ---------------------------------------------------------------------------

const CATEGORY_ICONS: { id: string; label: string; icon: LucideIcon }[] = [
	{ id: "folder", label: "Dossier", icon: FolderOpen },
	{ id: "briefcase", label: "Travail", icon: Briefcase },
	{ id: "users", label: "Personnes", icon: Users },
	{ id: "building", label: "Entreprise", icon: Building2 },
	{ id: "receipt", label: "Facture", icon: Receipt },
	{ id: "wallet", label: "Finances", icon: Wallet },
	{ id: "credit-card", label: "Paiement", icon: CreditCard },
	{ id: "calculator", label: "Calcul", icon: Calculator },
	{ id: "calendar", label: "Calendrier", icon: Calendar },
	{ id: "clock", label: "Temps", icon: Clock },
	{ id: "file-text", label: "Document", icon: FileText },
	{ id: "mail", label: "Email", icon: Mail },
	{ id: "message", label: "Message", icon: MessageSquare },
	{ id: "code", label: "Code", icon: Code },
	{ id: "globe", label: "Web", icon: Globe },
	{ id: "package", label: "Package", icon: Package },
	{ id: "layers", label: "Couches", icon: Layers },
	{ id: "tag", label: "Label", icon: Tag },
	{ id: "hash", label: "Hash", icon: Hash },
	{ id: "star", label: "Favori", icon: Star },
	{ id: "heart", label: "Important", icon: Heart },
	{ id: "zap", label: "Urgent", icon: Zap },
	{ id: "shopping-cart", label: "Achat", icon: ShoppingCart },
	{ id: "home", label: "Maison", icon: Home },
	{ id: "settings", label: "Config", icon: Settings },
]

function getCategoryIcon(iconId?: string): LucideIcon | null {
	if (!iconId) return null
	return CATEGORY_ICONS.find((i) => i.id === iconId)?.icon ?? null
}

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
	return (
		<span
			className={`size-2.5 shrink-0 rounded-full ${colorMap[color ?? "zinc"] ?? colorMap.zinc}`}
		/>
	)
}

function CategoryIcon({
	iconId,
	color,
}: { iconId?: string; color?: string }) {
	const Icon = getCategoryIcon(iconId)
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

	return (
		<Icon
			className={`size-4 shrink-0 ${textColorMap[color ?? "zinc"] ?? textColorMap.zinc}`}
		/>
	)
}

function ColorPicker({
	value,
	onChange,
}: { value: string; onChange: (color: string) => void }) {
	return (
		<InlineStack gap="100" wrap>
			{CATEGORY_COLORS.map((c) => (
				<button
					key={c.id}
					type="button"
					onClick={() => onChange(c.id)}
					className={`size-6 rounded-full border-2 transition-all ${c.bg} ${value === c.id ? "border-fg scale-110" : "border-transparent"}`}
					title={c.label}
				/>
			))}
		</InlineStack>
	)
}

function IconPicker({
	value,
	onChange,
	color,
}: { value: string; onChange: (icon: string) => void; color: string }) {
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
	const iconColor = textColorMap[color] ?? textColorMap.zinc

	return (
		<div className="grid grid-cols-8 gap-1">
			{CATEGORY_ICONS.map((item) => {
				const isSelected = value === item.id
				return (
					<button
						key={item.id}
						type="button"
						onClick={() => onChange(item.id)}
						className={`flex items-center justify-center size-8 rounded-md transition-all ${
							isSelected
								? `bg-surface-3 ring-1 ring-edge ${iconColor}`
								: "text-fg-muted hover:bg-surface-2 hover:text-fg-secondary"
						}`}
						title={item.label}
					>
						<item.icon className="size-4" />
					</button>
				)
			})}
		</div>
	)
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
							<Input
								placeholder="Ex: Clients, Facturation…"
								value={name}
								onChange={(e) => setName(e.target.value)}
								autoFocus
							/>
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
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
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
							<Input
								value={name}
								onChange={(e) => setName(e.target.value)}
								autoFocus
							/>
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
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
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
						<DropdownMenuTrigger
							render={<Button variant="ghost" size="icon-sm" />}
						>
							<MoreHorizontal className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setEditOpen(true)}>
								<Pencil className="size-3.5 mr-2" />
								Modifier
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-negative"
								onClick={() => removeCategory({ id: category._id })}
							>
								<Trash2 className="size-3.5 mr-2" />
								Supprimer
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ItemActions>
			</Item>
			<EditCategoryDialog
				category={category}
				open={editOpen}
				onOpenChange={setEditOpen}
			/>
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
			<SettingsHeader title="Catégories">
				{categories && categories.length > 0 && <CreateCategoryDialog />}
			</SettingsHeader>
			<SettingsSection
				title="Toutes les catégories"
				description="Utilisées pour organiser vos todos."
			>
				{categories === undefined ? (
					<Item>
						<ItemContent>
							<ItemDescription>Chargement…</ItemDescription>
						</ItemContent>
					</Item>
				) : categories.length === 0 ? (
					<Item>
						<ItemContent>
							<ItemDescription>
								Aucune catégorie. Créez-en une pour organiser vos todos.
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<CreateCategoryDialog />
						</ItemActions>
					</Item>
				) : (
					categories.map((cat) => (
						<CategoryItem key={cat._id} category={cat} />
					))
				)}
			</SettingsSection>
		</SettingsPage>
	)
}
