"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@blazz/ui/components/ui/sheet"
import { useMutation, useQuery } from "convex/react"
import { Settings2, Trash2 } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export const CATEGORY_COLORS = [
	{ id: "indigo", label: "Indigo", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" },
	{ id: "violet", label: "Violet", bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400" },
	{ id: "rose", label: "Rose", bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400" },
	{ id: "orange", label: "Orange", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" },
	{ id: "amber", label: "Ambre", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
	{ id: "emerald", label: "Émeraude", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400" },
	{ id: "sky", label: "Ciel", bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400" },
	{ id: "zinc", label: "Zinc", bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-700 dark:text-zinc-300" },
]

export function getCategoryColorClasses(color?: string) {
	return CATEGORY_COLORS.find((c) => c.id === color) ?? CATEGORY_COLORS[7]
}

export function CategoryBadge({ name, color }: { name: string; color?: string }) {
	const cls = getCategoryColorClasses(color)
	return (
		<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls.bg} ${cls.text}`}>
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
									<CategoryBadge name={cat.name} color={cat.color} />
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => removeCategory({ id: cat._id as Id<"categories"> })}
										className="text-fg-muted hover:text-destructive"
										aria-label="Supprimer"
									>
										<Trash2 className="size-3.5" />
									</Button>
								</div>
							))
						)}
					</div>

					<form onSubmit={handleCreate} className="space-y-3 border-t border-edge pt-4">
						<p className="text-sm font-medium text-fg">Nouvelle catégorie</p>
						<Input
							placeholder="Nom"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
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
