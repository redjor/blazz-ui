"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
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
import { useMutation } from "convex/react"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

const schema = z.object({
	name: z.string().min(1, "Le nom est requis"),
	type: z.enum(["youtube", "rss"]),
	externalId: z.string().min(1, "L'identifiant est requis"),
})

type FormValues = z.infer<typeof schema>

interface SourceFormDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	source?: Doc<"feedSources">
}

const TYPE_ITEMS = [
	{ value: "youtube", label: "YouTube" },
	{ value: "rss", label: "RSS" },
]

export function SourceFormDialog({ open, onOpenChange, source }: SourceFormDialogProps) {
	const create = useMutation(api.feedSources.create)
	const update = useMutation(api.feedSources.update)

	const isEdit = !!source

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: source
			? { name: source.name, type: source.type, externalId: source.externalId }
			: { name: "", type: "youtube", externalId: "" },
	})

	const selectedType = watch("type")

	useEffect(() => {
		if (open) {
			if (source) {
				reset({ name: source.name, type: source.type, externalId: source.externalId })
			} else {
				reset({ name: "", type: "youtube", externalId: "" })
			}
		}
	}, [open, source, reset])

	const onSubmit = async (values: FormValues) => {
		try {
			if (isEdit && source) {
				await update({
					id: source._id,
					name: values.name,
					externalId: values.externalId,
				})
				toast.success("Source mise à jour")
			} else {
				await create({
					name: values.name,
					type: values.type,
					externalId: values.externalId,
				})
				toast.success("Source ajoutée")
			}
			onOpenChange(false)
		} catch {
			toast.error("Une erreur est survenue")
		}
	}

	const externalIdLabel = selectedType === "youtube" ? "Channel ID" : "URL du flux RSS"

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Modifier la source" : "Ajouter une source"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<BlockStack gap="4">
						{/* Name */}
						<div className="space-y-1.5">
							<Label htmlFor="source-name">Nom</Label>
							<Input
								id="source-name"
								placeholder="Ex: Fireship, TechCrunch..."
								{...register("name")}
							/>
							{errors.name && (
								<p className="text-xs text-red-500">{errors.name.message}</p>
							)}
						</div>

						{/* Type */}
						<div className="space-y-1.5">
							<Label>Type</Label>
							<Controller
								control={control}
								name="type"
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isEdit}
										items={TYPE_ITEMS}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="youtube">YouTube</SelectItem>
											<SelectItem value="rss">RSS</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						{/* External ID */}
						<div className="space-y-1.5">
							<Label htmlFor="source-external-id">{externalIdLabel}</Label>
							<Input
								id="source-external-id"
								placeholder={
									selectedType === "youtube"
										? "UCxxxxxxxxxxxxxxxxxxxxxx"
										: "https://example.com/feed.xml"
								}
								{...register("externalId")}
							/>
							{selectedType === "youtube" && (
								<p className="text-[11px] text-fg-muted">
									Trouvable dans l'URL de la chaine : youtube.com/channel/[CHANNEL_ID]
								</p>
							)}
							{errors.externalId && (
								<p className="text-xs text-red-500">{errors.externalId.message}</p>
							)}
						</div>

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
									"Ajouter"
								)}
							</Button>
						</DialogFooter>
					</BlockStack>
				</form>
			</DialogContent>
		</Dialog>
	)
}
