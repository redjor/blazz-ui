"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { Star } from "lucide-react"
import { api } from "@/convex/_generated/api"

interface FavoriteButtonProps {
	entityType: "client" | "project" | "todo" | "note" | "bookmark" | "feedItem"
	entityId: string
	label: string
}

export function FavoriteButton({ entityType, entityId, label }: FavoriteButtonProps) {
	const isFavorited = useQuery(api.favorites.isFavorited, { entityType, entityId })
	const addFavorite = useMutation(api.favorites.add)
	const removeFavorite = useMutation(api.favorites.remove)

	if (isFavorited === undefined) return null

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
			onClick={() => {
				if (isFavorited) {
					removeFavorite({ entityType, entityId })
				} else {
					addFavorite({ entityType, entityId, label })
				}
			}}
		>
			<Star
				className={`size-4 transition-transform ${
					isFavorited
						? "fill-amber-400 text-amber-400 scale-110"
						: "text-fg-muted"
				}`}
			/>
		</Button>
	)
}
