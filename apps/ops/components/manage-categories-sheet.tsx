"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@blazz/ui/components/ui/sheet"
import { useMutation, useQuery } from "convex/react"
import { Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { ICON_COLORS as CATEGORY_COLORS, DOT_COLOR_MAP, getIcon as getCategoryIcon, ICON_COLOR_MAP } from "@/lib/icon-palette"

// Ré-exports depuis le module partagé — conserve les anciens noms pour les
// call sites existants (todos, chat, catégories...). À migrer progressivement.
export {
	DOT_COLOR_MAP,
	getIcon as getCategoryIcon,
	getIconColorClasses as getCategoryColorClasses,
	ICON_COLOR_MAP,
	ICON_COLORS as CATEGORY_COLORS,
	ICON_SET as CATEGORY_ICONS,
} from "@/lib/icon-palette"

export function CategoryBadge({ name, color, icon }: { name: string; color?: string; icon?: string }) {
	const Icon = getCategoryIcon(icon)
	const iconColor = ICON_COLOR_MAP[color ?? "zinc"] ?? ICON_COLOR_MAP.zinc
	const dotColor = DOT_COLOR_MAP[color ?? "zinc"] ?? DOT_COLOR_MAP.zinc

	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-card px-1.5 py-0.5 text-[11px] font-medium text-fg-muted">
			{Icon ? <Icon className={`size-3 shrink-0 ${iconColor}`} /> : <span className={`size-2 shrink-0 rounded-full ${dotColor}`} />}
			{name}
		</span>
	)
}

export function ManageCategoriesSheet() {
	const categories = useQuery(api.categories.list, {})
	const createCategory = useMutation(api.categories.create)
	const removeCategory = useMutation(api.categories.remove)

	const [name, setName] = useState("")
	const [color, setColor] = useState("indigo")

	async function handleCreate(e: React.FormEvent) {
		e.preventDefault()
		if (!name.trim()) return
		await createCategory({ name: name.trim(), color })
		setName("")
		setColor("indigo")
	}

	return (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" size="sm" />}>
				<Settings2 className="size-3.5 mr-1.5" />
				Catégories
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Gérer les catégories</SheetTitle>
				</SheetHeader>
				<div className="mt-6 space-y-6">
					<div className="space-y-2">
						{(categories ?? []).length === 0 ? (
							<p className="text-sm text-fg-muted">Aucune catégorie.</p>
						) : (
							(categories ?? []).map((cat) => (
								<div key={cat._id} className="flex items-center justify-between gap-2 py-1">
									<CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />
									<Button variant="ghost" size="icon-sm" onClick={() => removeCategory({ id: cat._id as Id<"categories"> })} className="text-fg-muted hover:text-destructive" aria-label="Supprimer">
										<Trash2 className="size-3.5" />
									</Button>
								</div>
							))
						)}
					</div>

					<form onSubmit={handleCreate} className="space-y-3 border-t border-edge pt-4">
						<p className="text-sm font-medium text-fg">Nouvelle catégorie</p>
						<Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
						<div className="flex flex-wrap gap-1.5">
							{CATEGORY_COLORS.map((c) => (
								<button
									key={c.id}
									type="button"
									onClick={() => setColor(c.id)}
									className={`w-6 h-6 rounded-full border-2 transition-all ${c.bg} ${color === c.id ? "border-fg scale-110" : "border-transparent"}`}
									title={c.label}
								/>
							))}
						</div>
						<Button type="submit" size="sm" disabled={!name.trim()}>
							Ajouter
						</Button>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	)
}
