"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
	AlertCircle,
	CheckCircle2,
	Info,
	AlertTriangle,
	X,
	type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const bannerVariants = cva(
	"relative flex gap-3 rounded-lg border p-4",
	{
		variants: {
			tone: {
				info: "border-inform/30 bg-inform/10 text-fg",
				success: "border-positive/30 bg-positive/10 text-fg",
				warning: "border-caution/30 bg-caution/10 text-fg",
				critical: "border-negative/30 bg-negative/10 text-fg",
			},
		},
		defaultVariants: {
			tone: "info",
		},
	}
)

const iconVariants = cva("mt-0.5 h-5 w-5 shrink-0", {
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

export interface BannerProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
		VariantProps<typeof bannerVariants> {
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

export function Banner({
	title,
	children,
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

	const handleAction = (bannerAction: BannerAction) => {
		if (bannerAction.url) {
			window.location.href = bannerAction.url
		} else if (bannerAction.onAction) {
			bannerAction.onAction()
		}
	}

	return (
		<div
			role={role}
			aria-live={ariaLive}
			className={cn(bannerVariants({ tone }), className)}
			{...props}
		>
			{!hideIcon && <IconComponent className={cn(iconVariants({ tone }))} aria-hidden="true" />}

			<div className="flex-1 space-y-2">
				{title && <p className="text-sm font-semibold">{title}</p>}
				{children && <div className="text-sm [&_a]:underline [&_p]:leading-relaxed">{children}</div>}

				{(action || secondaryAction) && (
					<div className="flex flex-wrap gap-2 pt-1">
						{action && (
							<Button
								size="sm"
								variant={tone === "critical" ? "destructive" : "default"}
								onClick={() => handleAction(action)}
								disabled={action.disabled}
								className="h-7 px-3 text-xs"
							>
								{action.loading ? "Loading..." : action.content}
							</Button>
						)}
						{secondaryAction && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => handleAction(secondaryAction)}
								disabled={secondaryAction.disabled}
								className="h-7 px-3 text-xs"
							>
								{secondaryAction.loading ? "Loading..." : secondaryAction.content}
							</Button>
						)}
					</div>
				)}
			</div>

			{onDismiss && (
				<button
					type="button"
					onClick={onDismiss}
					className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
					aria-label="Dismiss banner"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	)
}
