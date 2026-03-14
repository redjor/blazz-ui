"use client"

import { ExternalLink, MapPin } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface LocationCardProps {
	name?: string
	address: string
	city?: string
	country?: string
	coordinates?: { lat: number; lng: number }
	className?: string
}

function LocationCardBase({
	name,
	address,
	city,
	country,
	coordinates,
	className,
}: LocationCardProps) {
	const mapsUrl = coordinates
		? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
		: `https://www.google.com/maps/search/${encodeURIComponent([address, city, country].filter(Boolean).join(", "))}`

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-3">
					<MapPin className="size-4 text-fg-muted" />
				</div>
				<div className="min-w-0 flex-1">
					{name && <span className="text-sm font-semibold text-fg">{name}</span>}
					<p className={cn("text-xs text-fg-muted", name && "mt-0.5")}>{address}</p>
					{(city || country) && (
						<p className="text-xs text-fg-muted">{[city, country].filter(Boolean).join(", ")}</p>
					)}
				</div>
			</div>

			<a
				href={mapsUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline"
			>
				Open in Google Maps
				<ExternalLink className="size-3" />
			</a>
		</div>
	)
}

export const LocationCard = withProGuard(LocationCardBase, "LocationCard")
