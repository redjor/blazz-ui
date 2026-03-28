"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useAction, useMutation, useQuery } from "convex/react"
import { CheckCheck, Loader2, RefreshCw, Rss, Settings2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { FeedItemCard } from "@/components/feed-item-card"
import { api } from "@/convex/_generated/api"

type TypeFilter = "all" | "youtube" | "rss"

const PAGE_SIZE = 20

function FeedSkeleton() {
	return (
		<BlockStack gap="300">
			{Array.from({ length: 5 }).map((_, i) => (
				<Box key={i} padding="4" background="surface" border="default" borderRadius="lg">
					<BlockStack gap="300">
						<InlineStack gap="200">
							<Skeleton className="size-3.5 rounded" />
							<Skeleton className="h-3 w-24" />
							<Skeleton className="h-3 w-16" />
						</InlineStack>
						<Skeleton className="h-4 w-3/4" />
						<BlockStack gap="150">
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-2/3" />
						</BlockStack>
					</BlockStack>
				</Box>
			))}
		</BlockStack>
	)
}

export default function VeilleClient() {
	const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
	const [fetching, setFetching] = useState(false)
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	// Queries — fetch all up to visibleCount
	const data = useQuery(api.feedItems.list, {
		type: typeFilter === "all" ? undefined : typeFilter,
		limit: visibleCount,
	})
	const unreadCount = useQuery(api.feedItems.unreadCount)
	const sources = useQuery(api.feedSources.list)

	const items = data?.items
	const hasMore = data?.hasMore ?? false
	const totalCount = data?.totalCount ?? 0

	// Mutations & actions
	const markRead = useMutation(api.feedItems.markRead)
	const toggleFavorite = useMutation(api.feedItems.toggleFavorite)
	const markAllRead = useMutation(api.feedItems.markAllRead)
	const fetchNow = useAction(api.feed.fetchNow)
	const enrichMissing = useAction(api.feed.enrichMissing)

	// Source map for display names
	const sourceMap = useMemo(() => {
		if (!sources) return new Map<string, string>()
		return new Map(sources.map((s: any) => [s._id, s.name]))
	}, [sources])

	// Reset pagination on filter change
	const handleFilterChange = (filter: TypeFilter) => {
		setTypeFilter(filter)
		setVisibleCount(PAGE_SIZE)
	}

	// Handlers
	const handleFetchNow = async () => {
		setFetching(true)
		try {
			await fetchNow()
			toast.success("Synchronisation lancée")
		} catch {
			toast.error("Erreur lors de la synchronisation")
		} finally {
			setFetching(false)
		}
	}

	const handleEnrichMissing = async () => {
		try {
			const count = await enrichMissing()
			toast.success(count > 0 ? `${count} articles en cours d'enrichissement` : "Tous les articles sont déjà enrichis")
		} catch {
			toast.error("Erreur")
		}
	}

	const handleMarkAllRead = async () => {
		try {
			await markAllRead()
			toast.success("Tout marqué comme lu")
		} catch {
			toast.error("Erreur")
		}
	}

	// Top bar
	const topBarActions = useMemo(
		() => (
			<Link href="/veille/sources">
				<Button size="icon-sm" variant="ghost">
					<Settings2 className="size-4" />
				</Button>
			</Link>
		),
		[]
	)
	useAppTopBar([{ label: "Veille" }], topBarActions)

	const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
		{ value: "all", label: "Tout" },
		{ value: "youtube", label: "YouTube" },
		{ value: "rss", label: "RSS" },
	]

	return (
		<div className="flex h-full flex-col">
			{/* Toolbar */}
			<div className="flex items-center gap-3 border-b border-edge px-4 py-3">
				<Button size="sm" onClick={handleFetchNow} disabled={fetching}>
					{fetching ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <RefreshCw className="size-4 mr-1.5" />}
					Fetch now
				</Button>

				<Button size="sm" variant="outline" onClick={handleMarkAllRead} disabled={!unreadCount}>
					<CheckCheck className="size-4 mr-1.5" />
					Tout lire
					{unreadCount !== undefined && unreadCount > 0 && <span className="ml-1 text-[11px] bg-brand text-white rounded-full px-1.5">{unreadCount}</span>}
				</Button>

				{items?.some((i: any) => !i.aiSummary) && (
					<Button size="sm" variant="outline" onClick={handleEnrichMissing}>
						<Sparkles className="size-4 mr-1.5" />
						Enrichir
					</Button>
				)}

				{/* Type filter pills */}
				<InlineStack gap="100" className="ml-auto">
					{TYPE_FILTERS.map((f) => (
						<Button key={f.value} size="sm" variant={typeFilter === f.value ? "default" : "outline"} onClick={() => handleFilterChange(f.value)}>
							{f.label}
						</Button>
					))}
				</InlineStack>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-4">
				<div className="mx-auto max-w-2xl">
					{/* Loading */}
					{data === undefined && <FeedSkeleton />}

					{/* Empty */}
					{items?.length === 0 && (
						<Empty
							icon={Rss}
							title="Aucun article"
							description={typeFilter !== "all" ? "Aucun article pour ce filtre" : "Ajoutez des sources pour commencer votre veille"}
							action={
								typeFilter === "all"
									? {
											label: "Configurer les sources",
											onClick: () => {
												window.location.href = "/veille/sources"
											},
											icon: Settings2,
										}
									: undefined
							}
						/>
					)}

					{/* Feed items */}
					{items && items.length > 0 && (
						<BlockStack gap="300">
							{items.map((item: any) => (
								<FeedItemCard
									key={item._id}
									item={item}
									sourceName={sourceMap.get(item.sourceId)}
									onToggleFavorite={() => toggleFavorite({ id: item._id })}
									onMarkRead={() => markRead({ id: item._id })}
								/>
							))}

							{/* Load more */}
							{hasMore && (
								<Button variant="outline" className="w-full" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
									Charger plus ({totalCount - items.length} restants)
								</Button>
							)}
						</BlockStack>
					)}
				</div>
			</div>
		</div>
	)
}
