"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

export interface ErrorStateProps {
	title?: string
	description?: string
	onRetry?: () => void
	className?: string
}

export function ErrorState({
	title = "Une erreur est survenue",
	description = "Impossible de charger les données. Veuillez réessayer.",
	onRetry,
	className,
}: ErrorStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-12 text-center",
				className
			)}
		>
			<div className="mb-4 rounded-full bg-negative/10 p-3">
				<AlertTriangle className="size-6 text-negative" />
			</div>
			<h3 className="text-sm font-semibold text-fg">{title}</h3>
			{description && (
				<p className="mt-1 max-w-sm text-sm text-fg-muted">
					{description}
				</p>
			)}
			{onRetry && (
				<Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
					Réessayer
				</Button>
			)}
		</div>
	)
}
