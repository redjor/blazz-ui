import { X } from "lucide-react"
import type * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

export interface CalloutCardAction {
	content: string
	url?: string
	onAction?: () => void
}

export interface CalloutCardProps {
	children?: React.ReactNode
	className?: string
	title: React.ReactNode
	illustration?: string
	primaryAction: CalloutCardAction
	secondaryAction?: CalloutCardAction & {
		variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
	}
	onDismiss?: () => void
}

export function CalloutCard({
	children,
	className,
	title,
	illustration,
	primaryAction,
	secondaryAction,
	onDismiss,
}: CalloutCardProps) {
	const handlePrimaryAction = () => {
		if (primaryAction.onAction) {
			primaryAction.onAction()
		} else if (primaryAction.url) {
			window.location.href = primaryAction.url
		}
	}

	const handleSecondaryAction = () => {
		if (secondaryAction?.onAction) {
			secondaryAction.onAction()
		} else if (secondaryAction?.url) {
			window.location.href = secondaryAction.url
		}
	}

	return (
		<div
			data-slot="callout-card"
			className={cn(
				"relative flex gap-4 rounded-xl border border-container bg-card p-4 text-fg",
				className
			)}
		>
			{onDismiss && (
				<button
					type="button"
					onClick={onDismiss}
					className="absolute right-2 top-2 rounded-md p-1 text-fg-muted hover:bg-muted hover:text-fg"
					aria-label="Dismiss"
				>
					<X className="h-4 w-4" />
				</button>
			)}

			<div className="flex flex-1 flex-col gap-3">
				<h2 className="text-sm font-medium leading-snug pr-6">{title}</h2>

				{children && <div className="text-sm text-fg-muted">{children}</div>}

				<div className="flex flex-wrap gap-2">
					<Button size="sm" onClick={handlePrimaryAction}>
						{primaryAction.content}
					</Button>
					{secondaryAction && (
						<Button
							size="sm"
							variant={secondaryAction.variant || "ghost"}
							onClick={handleSecondaryAction}
						>
							{secondaryAction.content}
						</Button>
					)}
				</div>
			</div>

			{illustration && (
				<div className="hidden shrink-0 sm:block">
					<img src={illustration} alt="" className="h-24 w-24 object-contain" aria-hidden="true" />
				</div>
			)}
		</div>
	)
}
