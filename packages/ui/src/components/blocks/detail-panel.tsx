"use client"

import { withProGuard } from "../../lib/with-pro-guard"
import type * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

/* ─── DetailPanel.Header ─── */

export interface DetailPanelAction {
	label: string
	onClick: () => void | Promise<void>
	icon?: LucideIcon
	variant?: "default" | "outline" | "ghost" | "destructive"
}

export interface DetailPanelHeaderProps {
	title: string
	subtitle?: string
	status?: React.ReactNode
	actions?: DetailPanelAction[]
	className?: string
}

function DetailPanelHeader({
	title,
	subtitle,
	status,
	actions,
	className,
}: DetailPanelHeaderProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-start sm:justify-between",
				className
			)}
		>
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<h2 className="text-lg font-semibold text-fg">{title}</h2>
					{status}
				</div>
				{subtitle && (
					<p className="text-sm text-fg-muted">{subtitle}</p>
				)}
			</div>

			{actions && actions.length > 0 && (
				<div className="flex items-center gap-2">
					{actions.map((action, i) => (
						<Button
							key={i}
							variant={action.variant || "outline"}
							size="sm"
							onClick={action.onClick}
						>
							{action.icon && (
								<action.icon className="size-4" data-icon="inline-start" />
							)}
							{action.label}
						</Button>
					))}
				</div>
			)}
		</div>
	)
}

/* ─── DetailPanel.Section ─── */

export interface DetailPanelSectionProps {
	title: string
	description?: string
	children: React.ReactNode
	className?: string
}

function DetailPanelSection({
	title,
	description,
	children,
	className,
}: DetailPanelSectionProps) {
	return (
		<div className={cn("space-y-3", className)}>
			<div>
				<h3 className="text-sm font-semibold text-fg">{title}</h3>
				{description && (
					<p className="text-sm text-fg-muted">{description}</p>
				)}
			</div>
			{children}
		</div>
	)
}

/* ─── DetailPanel ─── */

export interface DetailPanelProps {
	children: React.ReactNode
	className?: string
}

function DetailPanelBase({ children, className }: DetailPanelProps) {
	return <div className={cn("space-y-6", className)}>{children}</div>
}

export const DetailPanel = Object.assign(withProGuard(DetailPanelBase, "DetailPanel"), {
	Header: DetailPanelHeader,
	Section: DetailPanelSection,
})
