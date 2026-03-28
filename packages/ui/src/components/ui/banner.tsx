"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle2, Info, type LucideIcon, X } from "lucide-react"
import Link from "next/link"
import type * as React from "react"
import { cn } from "../../lib/utils"
import { Button, buttonVariants } from "./button"

const bannerVariants = cva("relative flex gap-2 rounded-md border border-container bg-muted p-3", {
	variants: {
		variant: {
			default: "border-l-2",
			outline: "",
		},
		tone: {
			info: "",
			success: "",
			warning: "",
			critical: "",
		},
	},
	compoundVariants: [
		{ variant: "default", tone: "info", className: "border-l-inform" },
		{ variant: "default", tone: "success", className: "border-l-positive" },
		{ variant: "default", tone: "warning", className: "border-l-caution" },
		{ variant: "default", tone: "critical", className: "border-l-negative" },
	],
	defaultVariants: {
		variant: "default",
		tone: "info",
	},
})

const iconVariants = cva("mt-0.5 size-4 shrink-0", {
	variants: {
		tone: {
			info: "text-inform",
			success: "text-positive",
			warning: "text-caution",
			critical: "text-negative",
		},
	},
	defaultVariants: {
		tone: "info",
	},
})

const defaultIcons: Record<string, LucideIcon> = {
	info: Info,
	success: CheckCircle2,
	warning: AlertTriangle,
	critical: AlertCircle,
}

export interface BannerAction {
	content: string
	url?: string
	onAction?: () => void
	loading?: boolean
	disabled?: boolean
}

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof bannerVariants> {
	/** Title of the banner */
	title?: React.ReactNode
	/** Custom icon to display */
	icon?: LucideIcon
	/** Hide the status icon */
	hideIcon?: boolean
	/** Primary action button */
	action?: BannerAction
	/** Secondary action button */
	secondaryAction?: BannerAction
	/** Callback when the banner is dismissed */
	onDismiss?: () => void
	/** Disable screen reader announcements */
	stopAnnouncements?: boolean
}

function ActionButton({ bannerAction, variant }: { bannerAction: BannerAction; variant: "default" | "destructive" | "outline" }) {
	if (bannerAction.url) {
		return (
			<Link href={bannerAction.url} className={cn(buttonVariants({ variant, size: "sm" }))}>
				{bannerAction.content}
			</Link>
		)
	}

	return (
		<Button size="sm" variant={variant} onClick={bannerAction.onAction} disabled={bannerAction.disabled || bannerAction.loading}>
			{bannerAction.loading ? "Loading..." : bannerAction.content}
		</Button>
	)
}

export function Banner({
	title,
	children,
	variant = "default",
	tone = "info",
	icon,
	hideIcon = false,
	action,
	secondaryAction,
	onDismiss,
	stopAnnouncements = false,
	className,
	...props
}: BannerProps) {
	const IconComponent = icon || defaultIcons[tone || "info"]
	const role = tone === "critical" || tone === "warning" ? "alert" : "status"
	const ariaLive = stopAnnouncements ? "off" : tone === "critical" ? "assertive" : "polite"

	return (
		<div role={role} aria-live={ariaLive} className={cn(bannerVariants({ variant, tone }), onDismiss && "pr-8", className)} {...props}>
			{!hideIcon && <IconComponent className={cn(iconVariants({ tone }))} aria-hidden="true" />}

			<div className="flex-1 space-y-1.5">
				{title && <p className="text-sm font-medium">{title}</p>}
				{children && <div className="text-sm text-fg-muted [&_a]:underline [&_p]:leading-relaxed">{children}</div>}

				{(action || secondaryAction) && (
					<div className="flex flex-wrap gap-2 pt-1">
						{action && <ActionButton bannerAction={action} variant={tone === "critical" ? "destructive" : "default"} />}
						{secondaryAction && <ActionButton bannerAction={secondaryAction} variant="outline" />}
					</div>
				)}
			</div>

			{onDismiss && (
				<Button variant="ghost" size="icon-xs" onClick={onDismiss} className="absolute right-1.5 top-1.5 opacity-70 hover:opacity-100" aria-label="Dismiss banner">
					<X />
				</Button>
			)}
		</div>
	)
}
