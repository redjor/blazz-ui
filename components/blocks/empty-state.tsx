import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface EmptyStateAction {
	label: string
	href?: string
	onClick?: () => void
	icon?: LucideIcon
}

export interface EmptyStateProps {
	icon?: LucideIcon
	title: string
	description?: string
	action?: EmptyStateAction
	className?: string
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-12 text-center",
				className
			)}
		>
			{Icon && (
				<div className="mb-4 rounded-full bg-raised p-3">
					<Icon className="size-6 text-fg-muted" />
				</div>
			)}
			<h3 className="text-sm font-semibold text-fg">{title}</h3>
			{description && (
				<p className="mt-1 max-w-sm text-sm text-fg-muted">
					{description}
				</p>
			)}
			{action && (
				<div className="mt-4">
					{action.href ? (
						<Link
							href={action.href}
							className={cn(buttonVariants({ variant: "default", size: "sm" }))}
						>
							{action.icon && (
								<action.icon className="size-4" data-icon="inline-start" />
							)}
							{action.label}
						</Link>
					) : (
						<button
							type="button"
							onClick={action.onClick}
							className={cn(buttonVariants({ variant: "default", size: "sm" }))}
						>
							{action.icon && (
								<action.icon className="size-4" data-icon="inline-start" />
							)}
							{action.label}
						</button>
					)}
				</div>
			)}
		</div>
	)
}
