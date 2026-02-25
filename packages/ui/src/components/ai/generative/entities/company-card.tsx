"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Globe, MapPin, Users, DollarSign } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface CompanyCardProps {
	name: string
	logo?: string
	industry?: string
	size?: string
	revenue?: string
	location?: string
	website?: string
	status?: string
	statusVariant?: "default" | "success" | "warning" | "critical" | "info"
	href?: string
	actions?: ReactNode
	className?: string
}

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function CompanyCard({
	name,
	logo,
	industry,
	size,
	revenue,
	location,
	website,
	status,
	statusVariant = "default",
	href,
	actions,
	className,
}: CompanyCardProps) {
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-container bg-surface p-4",
				href && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<Avatar size="lg">
					{logo && <AvatarImage src={logo} alt={name} />}
					<AvatarFallback>{getInitials(name)}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="truncate text-sm font-semibold text-fg">{name}</span>
						{status && (
							<Badge variant={statusVariant} size="xs" fill="subtle">{status}</Badge>
						)}
					</div>
					{industry && <p className="truncate text-sm text-fg-muted">{industry}</p>}
				</div>
			</div>

			{(size || revenue || location || website) && (
				<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
					{size && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Users className="size-3" />
							{size}
						</span>
					)}
					{revenue && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<DollarSign className="size-3" />
							{revenue}
						</span>
					)}
					{location && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<MapPin className="size-3" />
							{location}
						</span>
					)}
					{website && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Globe className="size-3" />
							{website}
						</span>
					)}
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}
