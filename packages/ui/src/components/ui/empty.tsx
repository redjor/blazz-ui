import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"

/* ----- Types ----- */

export interface EmptyAction {
	label: string
	href?: string
	onClick?: () => void
	icon?: LucideIcon
}

/* ----- Size variants ----- */

const emptyVariants = cva(
	"flex w-full min-w-0 flex-col items-center justify-center text-center",
	{
		variants: {
			size: {
				sm: "gap-3 py-6",
				default: "gap-4 py-12",
				lg: "gap-5 py-20",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
)

const emptyIconVariants = cva(
	"flex shrink-0 items-center justify-center rounded-full bg-raised text-fg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			size: {
				sm: "size-8 p-1.5 [&_svg:not([class*='size-'])]:size-4",
				default: "size-10 p-2.5 [&_svg:not([class*='size-'])]:size-5",
				lg: "size-12 p-3 [&_svg:not([class*='size-'])]:size-6",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
)

/* ----- Sub-components (compositional API) ----- */

function EmptyIcon({
	className,
	size = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyIconVariants>) {
	return (
		<div
			data-slot="empty-icon"
			className={cn(emptyIconVariants({ size, className }))}
			{...props}
		/>
	)
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="empty-title"
			className={cn("text-sm font-medium text-fg", className)}
			{...props}
		/>
	)
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="empty-description"
			className={cn("max-w-sm text-sm text-fg-muted", className)}
			{...props}
		/>
	)
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-actions"
			className={cn("flex items-center gap-2", className)}
			{...props}
		/>
	)
}

/* ----- Action renderer ----- */

function EmptyActionButton({ action, variant = "default" }: { action: EmptyAction; variant?: "default" | "outline" }) {
	const ActionIcon = action.icon

	if (action.href) {
		return (
			<Button variant={variant} size="sm" render={<Link href={action.href} />}>
				{ActionIcon && <ActionIcon className="size-4" />}
				{action.label}
			</Button>
		)
	}

	return (
		<Button variant={variant} size="sm" onClick={action.onClick}>
			{ActionIcon && <ActionIcon className="size-4" />}
			{action.label}
		</Button>
	)
}

/* ----- Main component ----- */

interface EmptyProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof emptyVariants> {
	/** Lucide icon component rendered in a circular container. */
	icon?: LucideIcon
	/** Title text. */
	title?: string
	/** Description text below the title. */
	description?: string
	/** Primary action button. */
	action?: EmptyAction
	/** Secondary action button. */
	secondaryAction?: EmptyAction
}

function Empty({
	className,
	size = "default",
	icon: Icon,
	title,
	description,
	action,
	secondaryAction,
	children,
	...props
}: EmptyProps) {
	// Compositional mode: just render children
	if (children) {
		return (
			<div
				data-slot="empty"
				className={cn(emptyVariants({ size, className }))}
				{...props}
			>
				{children}
			</div>
		)
	}

	// Props-based mode
	return (
		<div
			data-slot="empty"
			className={cn(emptyVariants({ size, className }))}
			{...props}
		>
			{Icon && (
				<EmptyIcon size={size}>
					<Icon />
				</EmptyIcon>
			)}
			{(title || description) && (
				<div className="flex max-w-sm flex-col items-center gap-1">
					{title && <EmptyTitle>{title}</EmptyTitle>}
					{description && (
						<EmptyDescription>{description}</EmptyDescription>
					)}
				</div>
			)}
			{(action || secondaryAction) && (
				<EmptyActions>
					{action && <EmptyActionButton action={action} />}
					{secondaryAction && (
						<EmptyActionButton action={secondaryAction} variant="outline" />
					)}
				</EmptyActions>
			)}
		</div>
	)
}

export {
	Empty,
	EmptyIcon,
	EmptyTitle,
	EmptyDescription,
	EmptyActions,
}
