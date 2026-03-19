"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Switch } from "@blazz/ui/components/ui/switch"
import { useMutation, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Plus, Rss, Trash2, Youtube } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { SourceFormDialog } from "@/components/source-form-dialog"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

function SourcesSkeleton() {
	return (
		<BlockStack gap="3">
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="rounded-lg border border-edge bg-surface p-4 flex items-center gap-3"
				>
					<Skeleton className="size-8 rounded" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-40" />
						<Skeleton className="h-3 w-24" />
					</div>
					<Skeleton className="h-5 w-10 rounded-full" />
				</div>
			))}
		</BlockStack>
	)
}

export default function SourcesClient() {
	const [addOpen, setAddOpen] = useState(false)
	const [editSource, setEditSource] = useState<Doc<"feedSources"> | undefined>(undefined)

	// Queries
	const sources = useQuery(api.feedSources.list)

	// Mutations
	const updateSource = useMutation(api.feedSources.update)
	const removeSource = useMutation(api.feedSources.remove)

	// Top bar
	useAppTopBar([{ label: "Veille", href: "/veille" }, { label: "Sources" }])

	// Handlers
	const handleToggleActive = async (source: Doc<"feedSources">) => {
		try {
			await updateSource({ id: source._id, isActive: !source.isActive })
			toast.success(source.isActive ? "Source désactivée" : "Source activée")
		} catch {
			toast.error("Erreur")
		}
	}

	const handleDelete = async (source: Doc<"feedSources">) => {
		if (!window.confirm(`Supprimer "${source.name}" et tous ses articles ?`)) return
		try {
			await removeSource({ id: source._id })
			toast.success("Source supprimée")
		} catch {
			toast.error("Erreur")
		}
	}

	return (
		<div className="flex h-full flex-col">
			{/* Toolbar */}
			<div className="flex items-center gap-3 border-b border-edge px-4 py-3">
				<Button size="sm" onClick={() => setAddOpen(true)}>
					<Plus className="size-4 mr-1.5" />
					Ajouter
				</Button>

				{sources !== undefined && (
					<span className="text-[13px] text-fg-muted">
						{sources.length} source{sources.length !== 1 ? "s" : ""}
					</span>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-4">
				<div className="mx-auto max-w-2xl">
					{/* Loading */}
					{sources === undefined && <SourcesSkeleton />}

					{/* Empty */}
					{sources?.length === 0 && (
						<Empty
							icon={Rss}
							title="Aucune source"
							description="Ajoutez des chaines YouTube ou flux RSS pour alimenter votre veille"
							action={{
								label: "Ajouter une source",
								onClick: () => setAddOpen(true),
								icon: Plus,
							}}
						/>
					)}

					{/* Source list */}
					{sources && sources.length > 0 && (
						<BlockStack gap="3">
							{sources.map((source) => {
								const Icon = source.type === "youtube" ? Youtube : Rss
								return (
									<Box
										key={source._id}
										padding="4"
										background="surface"
										borderWidth="1"
										borderColor="edge"
										borderRadius="lg"
									>
										<InlineStack align="space-between" blockAlign="center">
											<InlineStack gap="3" blockAlign="center">
												<Icon className="size-5 text-fg-muted shrink-0" />
												<BlockStack gap="1">
													<button
														type="button"
														className="text-sm font-medium text-fg hover:text-brand text-left transition-colors"
														onClick={() => setEditSource(source)}
													>
														{source.name}
													</button>
													<InlineStack gap="2" blockAlign="center">
														<Badge variant="secondary" className="text-[11px]">
															{source.type === "youtube" ? "YouTube" : "RSS"}
														</Badge>
														{source.lastFetchedAt && (
															<span className="text-[11px] text-fg-muted">
																Sync{" "}
																{formatDistanceToNow(new Date(source.lastFetchedAt), {
																	addSuffix: true,
																	locale: fr,
																})}
															</span>
														)}
													</InlineStack>
												</BlockStack>
											</InlineStack>

											<InlineStack gap="2" blockAlign="center">
												<Switch
													checked={source.isActive}
													onCheckedChange={() => handleToggleActive(source)}
												/>
												<Button
													size="icon-sm"
													variant="ghost"
													onClick={() => handleDelete(source)}
													className="text-fg-muted hover:text-destructive"
												>
													<Trash2 className="size-3.5" />
												</Button>
											</InlineStack>
										</InlineStack>
									</Box>
								)
							})}
						</BlockStack>
					)}
				</div>
			</div>

			{/* Add/Edit source dialog */}
			<SourceFormDialog
				open={addOpen || !!editSource}
				onOpenChange={(open) => {
					if (!open) {
						setAddOpen(false)
						setEditSource(undefined)
					}
				}}
				source={editSource}
			/>
		</div>
	)
}
