"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { TagInput } from "@/components/tag-input"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

const schema = z.object({
	url: z.string().url("URL invalide"),
	type: z.enum(["tweet", "youtube", "image", "video", "link"]),
	title: z.string().optional(),
	description: z.string().optional(),
	thumbnailUrl: z.string().optional(),
	author: z.string().optional(),
	siteName: z.string().optional(),
	embedUrl: z.string().optional(),
	collectionId: z.string().optional(),
	notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface BookmarkFormDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	bookmark?: Doc<"bookmarks">
	defaultCollectionId?: Id<"bookmarkCollections">
}

export function BookmarkFormDialog({ open, onOpenChange, bookmark, defaultCollectionId }: BookmarkFormDialogProps) {
	const create = useMutation(api.bookmarks.create)
	const update = useMutation(api.bookmarks.update)
	const collections = useQuery(api.bookmarkCollections.list)
	const allTags = useQuery(api.tags.list)

	const [fetchingMetadata, setFetchingMetadata] = useState(false)
	const [tagNames, setTagNames] = useState<string[]>([])

	const isEdit = !!bookmark

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: bookmark
			? {
					url: bookmark.url,
					type: bookmark.type,
					title: bookmark.title ?? "",
					description: bookmark.description ?? "",
					thumbnailUrl: bookmark.thumbnailUrl ?? "",
					author: bookmark.author ?? "",
					siteName: bookmark.siteName ?? "",
					embedUrl: bookmark.embedUrl ?? "",
					collectionId: bookmark.collectionId ?? "",
					notes: bookmark.notes ?? "",
				}
			: {
					url: "",
					type: "link",
					title: "",
					description: "",
					thumbnailUrl: "",
					collectionId: defaultCollectionId ?? "",
					notes: "",
				},
	})

	const thumbnailUrl = watch("thumbnailUrl")
	const title = watch("title")
	const description = watch("description")

	// Convert tag IDs to names when editing
	useEffect(() => {
		if (bookmark?.tags && allTags) {
			const names = bookmark.tags.map((id) => allTags.find((t) => t._id === id)?.name).filter(Boolean) as string[]
			setTagNames(names)
		}
	}, [bookmark?.tags, allTags])

	// Reset form when dialog opens/closes or bookmark changes
	useEffect(() => {
		if (open) {
			if (bookmark) {
				reset({
					url: bookmark.url,
					type: bookmark.type,
					title: bookmark.title ?? "",
					description: bookmark.description ?? "",
					thumbnailUrl: bookmark.thumbnailUrl ?? "",
					author: bookmark.author ?? "",
					siteName: bookmark.siteName ?? "",
					embedUrl: bookmark.embedUrl ?? "",
					collectionId: bookmark.collectionId ?? "",
					notes: bookmark.notes ?? "",
				})
			} else {
				reset({
					url: "",
					type: "link",
					title: "",
					description: "",
					thumbnailUrl: "",
					collectionId: defaultCollectionId ?? "",
					notes: "",
				})
				setTagNames([])
			}
		}
	}, [open, bookmark, defaultCollectionId, reset])

	const fetchMetadata = useCallback(
		async (url: string) => {
			if (!url) return
			try {
				new URL(url)
			} catch {
				return
			}

			setFetchingMetadata(true)
			try {
				const res = await fetch("/api/bookmarks/metadata", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url }),
				})
				if (!res.ok) return
				const data = await res.json()
				if (data.type) setValue("type", data.type)
				if (data.title) setValue("title", data.title)
				if (data.description) setValue("description", data.description)
				if (data.thumbnailUrl) setValue("thumbnailUrl", data.thumbnailUrl)
				if (data.author) setValue("author", data.author)
				if (data.siteName) setValue("siteName", data.siteName)
				if (data.embedUrl) setValue("embedUrl", data.embedUrl)
			} catch {
				// silently fail
			} finally {
				setFetchingMetadata(false)
			}
		},
		[setValue]
	)

	const handlePaste = useCallback(
		(e: React.ClipboardEvent<HTMLInputElement>) => {
			const pasted = e.clipboardData.getData("text")
			if (pasted) {
				// Small delay so the input value updates first
				setTimeout(() => fetchMetadata(pasted), 50)
			}
		},
		[fetchMetadata]
	)

	const createTag = useMutation(api.tags.create)

	// Convert tag names to IDs, creating missing tags
	const resolveTagIds = async (names: string[]): Promise<Id<"tags">[]> => {
		if (!allTags) return []
		const ids: Id<"tags">[] = []
		for (const name of names) {
			const normalized = name.trim().toLowerCase()
			const found = allTags.find((t) => t.name === normalized)
			if (found) {
				ids.push(found._id)
			} else {
				const newId = await createTag({ name: normalized, color: "#6b7280" })
				ids.push(newId)
			}
		}
		return ids
	}

	const onSubmit = async (values: FormValues) => {
		try {
			const tagIds = await resolveTagIds(tagNames)

			if (isEdit && bookmark) {
				await update({
					id: bookmark._id,
					title: values.title || undefined,
					description: values.description || undefined,
					collectionId: values.collectionId ? (values.collectionId as Id<"bookmarkCollections">) : null,
					tags: tagIds.length > 0 ? tagIds : undefined,
					notes: values.notes || undefined,
				})
				toast.success("Bookmark mis à jour")
			} else {
				await create({
					url: values.url,
					type: values.type,
					title: values.title || undefined,
					description: values.description || undefined,
					thumbnailUrl: values.thumbnailUrl || undefined,
					author: values.author || undefined,
					siteName: values.siteName || undefined,
					embedUrl: values.embedUrl || undefined,
					collectionId: values.collectionId ? (values.collectionId as Id<"bookmarkCollections">) : undefined,
					tags: tagIds.length > 0 ? tagIds : undefined,
					notes: values.notes || undefined,
				})
				toast.success("Bookmark ajouté")
			}
			onOpenChange(false)
		} catch {
			toast.error("Une erreur est survenue")
		}
	}

	const tagSuggestions = allTags?.map((t) => t.name) ?? []

	const collectionItems = [
		{ value: "", label: "Aucune collection" },
		...(collections?.map((c) => ({
			value: c._id,
			label: c.icon ? `${c.icon} ${c.name}` : c.name,
		})) ?? []),
	]

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Modifier le bookmark" : "Ajouter un bookmark"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* URL */}
					<div className="space-y-1.5">
						<Label htmlFor="bk-url">URL *</Label>
						<div className="relative">
							<Input
								id="bk-url"
								placeholder="https://..."
								disabled={isEdit}
								{...register("url")}
								onPaste={handlePaste}
								onBlur={(e) => {
									if (!isEdit && e.target.value) {
										fetchMetadata(e.target.value)
									}
								}}
							/>
							{fetchingMetadata && (
								<div className="absolute right-2 top-1/2 -translate-y-1/2">
									<Loader2 className="size-4 animate-spin text-fg-muted" />
								</div>
							)}
						</div>
						{errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
					</div>

					{/* Metadata preview */}
					{(thumbnailUrl || title) && (
						<div className="rounded-lg border border-edge bg-card p-3 space-y-2">
							{thumbnailUrl && <img src={thumbnailUrl} alt="" className="w-full h-32 object-cover rounded-md" />}
							{title && <p className="text-sm font-medium text-fg line-clamp-2">{title}</p>}
							{description && <p className="text-xs text-fg-muted line-clamp-3">{description}</p>}
						</div>
					)}

					{/* Collection */}
					<div className="space-y-1.5">
						<Label>Collection</Label>
						<Controller
							control={control}
							name="collectionId"
							render={({ field }) => (
								<Select value={field.value ?? ""} onValueChange={field.onChange} items={collectionItems}>
									<SelectTrigger>
										<SelectValue placeholder="Aucune collection" />
									</SelectTrigger>
									<SelectContent>
										{collectionItems.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					{/* Tags */}
					<div className="space-y-1.5">
						<Label>Tags</Label>
						<TagInput value={tagNames} onChange={setTagNames} suggestions={tagSuggestions} placeholder="Ajouter un tag..." />
					</div>

					{/* Notes */}
					<div className="space-y-1.5">
						<Label htmlFor="bk-notes">Notes</Label>
						<Textarea id="bk-notes" rows={3} placeholder="Notes personnelles..." {...register("notes")} />
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
							Annuler
						</Button>
						<Button type="submit" disabled={isSubmitting || fetchingMetadata}>
							{isSubmitting ? <Loader2 className="size-4 animate-spin" /> : isEdit ? "Mettre à jour" : "Ajouter"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
