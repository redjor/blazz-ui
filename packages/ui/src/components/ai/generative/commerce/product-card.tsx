"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Package } from "lucide-react"
import { Badge } from "../../../ui/badge"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

export type ProductStatus = "active" | "draft" | "archived"

export interface ProductCardProps {
	name: string
	price: string
	category?: string
	status?: ProductStatus
	image?: string
	href?: string
	actions?: ReactNode
	className?: string
}

const statusConfig = {
	active: { label: "Active", variant: "success" as const },
	draft: { label: "Draft", variant: "default" as const },
	archived: { label: "Archived", variant: "outline" as const },
} as const

function ProductCardBase({
	name,
	price,
	category,
	status = "active",
	image,
	href,
	actions,
	className,
}: ProductCardProps) {
	const config = statusConfig[status]
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
				{image ? (
					<img
						src={image}
						alt={name}
						className="mt-0.5 size-10 shrink-0 rounded-md object-cover"
					/>
				) : (
					<div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-raised">
						<Package className="size-4 text-fg-muted" />
					</div>
				)}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-fg truncate">{name}</span>
						<Badge variant={config.variant} size="xs" fill="subtle">
							{config.label}
						</Badge>
					</div>
					<p className="mt-0.5 text-xs text-fg-muted">
						{category && <span>{category} · </span>}
						<span className="font-medium tabular-nums text-fg">{price}</span>
					</p>
				</div>
			</div>

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}

export const ProductCard = withProGuard(ProductCardBase, "ProductCard")
