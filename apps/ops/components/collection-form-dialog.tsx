"use client"

import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

const PRESET_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
]

const schema = z.object({
	name: z.string().min(1, "Nom requis"),
	icon: z.string().optional(),
	color: z.string().optional(),
	parentId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface CollectionFormDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	collection?: Doc<"bookmarkCollections">
	parentId?: Id<"bookmarkCollections">
}

export function CollectionFormDialog({
	open,
	onOpenChange,
	collection,
	parentId,
}: CollectionFormDialogProps) {
	const create = useMutation(api.bookmarkCollections.create)
	const update = useMutation(api.bookmarkCollections.update)
	const collections = useQuery(api.bookmarkCollections.list)

	const isEdit = !!collection

	const topLevelCollections =
		collections?.filter((c) => !c.parentId && c._id !== collection?._id) ?? []

	const parentItems = [
		{ value: "", label: "Aucune (niveau racine)" },
		...topLevelCollections.map((c) => ({
			value: c._id,
			label: c.icon ? `${c.icon} ${c.name}` : c.name,
		})),
	]

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: collection
			? {
					name: collection.name,
					icon: collection.icon ?? "",
					color: collection.color ?? "",
					parentId: collection.parentId ?? "",
				}
			: {
					name: "",
					icon: "",
					color: "",
					parentId: parentId ?? "",
				},
	})

	const selectedColor = watch("color")

	// Reset when dialog opens
	useEffect(() => {
		if (open) {
			if (collection) {
				reset({
					name: collection.name,
					icon: collection.icon ?? "",
					color: collection.color ?? "",
					parentId: collection.parentId ?? "",
				})
			} else {
				reset({
					name: "",
					icon: "",
					color: "",
					parentId: parentId ?? "",
				})
			}
		}
	}, [open, collection, parentId, reset])

	const onSubmit = async (values: FormValues) => {
		try {
			if (isEdit && collection) {
				await update({
					id: collection._id,
					name: values.name,
					icon: values.icon || undefined,
					color: values.color || undefined,
				})
				toast.success("Collection mise à jour")
			} else {
				await create({
					name: values.name,
					icon: values.icon || undefined,
					color: values.color || undefined,
					parentId: values.parentId
						? (values.parentId as Id<"bookmarkCollections">)
						: undefined,
				})
				toast.success("Collection créée")
			}
			onOpenChange(false)
		} catch {
			toast.error("Une erreur est survenue")
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Modifier la collection" : "Nouvelle collection"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Name */}
					<div className="space-y-1.5">
						<Label htmlFor="col-name">Nom *</Label>
						<Input id="col-name" placeholder="Ma collection" {...register("name")} />
						{errors.name && (
							<p className="text-xs text-red-500">{errors.name.message}</p>
						)}
					</div>

					{/* Icon */}
					<div className="space-y-1.5">
						<Label htmlFor="col-icon">Icône</Label>
						<Input
							id="col-icon"
							placeholder="Emoji..."
							className="w-20"
							{...register("icon")}
						/>
					</div>

					{/* Color picker */}
					<div className="space-y-1.5">
						<Label>Couleur</Label>
						<div className="flex items-center gap-2">
							{PRESET_COLORS.map((color) => (
								<button
									key={color}
									type="button"
									onClick={() => setValue("color", color)}
									className={`size-6 rounded-full transition-all ${
										selectedColor === color
											? "ring-2 ring-offset-2 ring-brand ring-offset-surface"
											: "hover:scale-110"
									}`}
									style={{ backgroundColor: color }}
								/>
							))}
						</div>
					</div>

					{/* Parent collection (hidden if parentId is pre-set) */}
					{!parentId && (
						<div className="space-y-1.5">
							<Label>Collection parente</Label>
							<Controller
								control={control}
								name="parentId"
								render={({ field }) => (
									<Select
										value={field.value ?? ""}
										onValueChange={field.onChange}
										items={parentItems}
									>
										<SelectTrigger>
											<SelectValue placeholder="Aucune (niveau racine)" />
										</SelectTrigger>
										<SelectContent>
											{parentItems.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Annuler
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<Loader2 className="size-4 animate-spin" />
							) : isEdit ? (
								"Mettre à jour"
							) : (
								"Créer"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
