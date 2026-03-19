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
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
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
import { useAction, useMutation } from "convex/react"
import { Check, Loader2, Search } from "lucide-react"
import { useEffect, useState } from "react"
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
	const resolveHandle = useAction(api.feed.resolveYouTubeHandle)

	const isEdit = !!source

	const [handleInput, setHandleInput] = useState("")
	const [resolving, setResolving] = useState(false)
	const [resolved, setResolved] = useState(false)

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
		defaultValues: source
			? { name: source.name, type: source.type, externalId: source.externalId }
			: { name: "", type: "youtube", externalId: "" },
	})

	const selectedType = watch("type")

	useEffect(() => {
		if (open) {
			setHandleInput("")
			setResolved(false)
			if (source) {
				reset({ name: source.name, type: source.type, externalId: source.externalId })
			} else {
				reset({ name: "", type: "youtube", externalId: "" })
			}
		}
	}, [open, source, reset])

	const handleResolve = async () => {
		if (!handleInput.trim()) return
		setResolving(true)
		try {
			const result = await resolveHandle({ handle: handleInput })
			if (result) {
				setValue("externalId", result.channelId)
				if (!watch("name")) {
					setValue("name", result.name)
				}
				setResolved(true)
				toast.success(`Chaîne trouvée : ${result.name}`)
			} else {
				toast.error("Chaîne introuvable")
			}
		} catch {
			toast.error("Erreur lors de la recherche")
		} finally {
			setResolving(false)
		}
	}

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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Modifier la source" : "Ajouter une source"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<BlockStack gap="400">
						{/* Type */}
						<BlockStack gap="150">
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
						</BlockStack>

						{/* YouTube handle resolver */}
						{selectedType === "youtube" && !isEdit && (
							<BlockStack gap="150">
								<Label>Handle YouTube</Label>
								<InlineStack gap="200">
									<Input
										placeholder="@melvynxdev"
										value={handleInput}
										onChange={(e) => {
											setHandleInput(e.target.value)
											setResolved(false)
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault()
												handleResolve()
											}
										}}
										className="flex-1"
									/>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleResolve}
										disabled={resolving || !handleInput.trim()}
										className="shrink-0"
									>
										{resolving ? (
											<Loader2 className="size-3.5 animate-spin" />
										) : resolved ? (
											<Check className="size-3.5 text-green-500" />
										) : (
											<Search className="size-3.5" />
										)}
									</Button>
								</InlineStack>
								<p className="text-[11px] text-fg-muted">
									Collez un handle (@melvynxdev) ou une URL YouTube — le Channel ID sera résolu automatiquement
								</p>
							</BlockStack>
						)}

						{/* Name */}
						<BlockStack gap="150">
							<Label htmlFor="source-name">Nom</Label>
							<Input
								id="source-name"
								placeholder="Ex: Fireship, TechCrunch..."
								{...register("name")}
							/>
							{errors.name && (
								<p className="text-xs text-red-500">{errors.name.message}</p>
							)}
						</BlockStack>

						{/* External ID */}
						<BlockStack gap="150">
							<Label htmlFor="source-external-id">
								{selectedType === "youtube" ? "Channel ID" : "URL du flux RSS"}
							</Label>
							<Input
								id="source-external-id"
								placeholder={
									selectedType === "youtube"
										? "UCxxxxxxxxxxxxxxxxxxxxxx"
										: "https://example.com/feed.xml"
								}
								{...register("externalId")}
							/>
							{selectedType === "youtube" && !resolved && (
								<p className="text-[11px] text-fg-muted">
									Rempli automatiquement si vous utilisez le champ Handle ci-dessus
								</p>
							)}
							{errors.externalId && (
								<p className="text-xs text-red-500">{errors.externalId.message}</p>
							)}
						</BlockStack>

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
