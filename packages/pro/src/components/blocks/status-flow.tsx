"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Button } from "@blazz/ui/components/ui/button"

export interface StatusDefinition {
	id: string
	label: string
	color: "gray" | "blue" | "green" | "yellow" | "red" | "purple"
}

export interface StatusTransition {
	from: string
	to: string
	action: string
	role?: string
}

export interface StatusFlowProps {
	currentStatus: string
	statuses: StatusDefinition[]
	transitions?: StatusTransition[]
	onTransition?: (from: string, to: string) => void | Promise<void>
	className?: string
}

const colorMap: Record<string, string> = {
	gray: "bg-gray-100 text-gray-700 border-gray-200",
	blue: "bg-blue-100 text-blue-700 border-blue-200",
	green: "bg-green-100 text-green-700 border-green-200",
	yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
	red: "bg-red-100 text-red-700 border-red-200",
	purple: "bg-purple-100 text-purple-700 border-purple-200",
}

const activeColorMap: Record<string, string> = {
	gray: "bg-gray-600 text-white border-gray-600",
	blue: "bg-blue-600 text-white border-blue-600",
	green: "bg-green-600 text-white border-green-600",
	yellow: "bg-yellow-600 text-white border-yellow-600",
	red: "bg-red-600 text-white border-red-600",
	purple: "bg-purple-600 text-white border-purple-600",
}

function StatusFlowBase({
	currentStatus,
	statuses,
	transitions = [],
	onTransition,
	className,
}: StatusFlowProps) {
	const [loading, setLoading] = useState<string | null>(null)

	const availableTransitions = transitions.filter((t) => t.from === currentStatus)

	const handleTransition = async (to: string) => {
		if (!onTransition) return
		setLoading(to)
		try {
			await onTransition(currentStatus, to)
		} finally {
			setLoading(null)
		}
	}

	return (
		<div className={cn("space-y-3", className)}>
			{/* Status steps */}
			<div className="flex items-center gap-1 overflow-x-auto">
				{statuses.map((status, i) => {
					const isCurrent = status.id === currentStatus
					const currentIndex = statuses.findIndex((s) => s.id === currentStatus)
					const isPast = i < currentIndex

					return (
						<div key={status.id} className="flex items-center gap-1">
							{i > 0 && <ChevronRight className="size-4 shrink-0 text-fg-muted" />}
							<span
								className={cn(
									"inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
									isCurrent
										? activeColorMap[status.color]
										: isPast
											? colorMap[status.color]
											: "border-container bg-surface-3/50 text-fg-muted"
								)}
							>
								{status.label}
							</span>
						</div>
					)
				})}
			</div>

			{/* Available transitions */}
			{availableTransitions.length > 0 && onTransition && (
				<div className="flex items-center gap-2">
					{availableTransitions.map((t) => (
						<Button
							key={t.to}
							variant="outline"
							size="sm"
							disabled={loading !== null}
							onClick={() => handleTransition(t.to)}
						>
							{loading === t.to ? "..." : t.action}
						</Button>
					))}
				</div>
			)}
		</div>
	)
}

export const StatusFlow = withProGuard(StatusFlowBase, "StatusFlow")
