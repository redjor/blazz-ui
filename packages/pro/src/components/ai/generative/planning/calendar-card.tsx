"use client"

import { Calendar, Clock } from "lucide-react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { Badge } from "@blazz/ui"

export interface CalendarEvent {
	title: string
	time?: string
	variant?: "default" | "info" | "success" | "warning" | "critical"
}

export interface CalendarDay {
	day: number
	events?: CalendarEvent[]
	isToday?: boolean
	isHighlighted?: boolean
}

export interface CalendarCardProps {
	month: string
	days: CalendarDay[]
	className?: string
}

function CalendarCardBase({ month, days, className }: CalendarCardProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-center gap-2">
				<Calendar className="size-4 text-fg-muted" />
				<span className="text-sm font-semibold text-fg">{month}</span>
			</div>

			<div className="mt-3 space-y-1.5">
				{days.map((day) => (
					<div
						key={day.day}
						className={cn(
							"flex items-start gap-3 rounded-md px-2 py-1.5",
							day.isToday && "bg-brand/5",
							day.isHighlighted && "bg-surface-3"
						)}
					>
						<span
							className={cn(
								"w-6 shrink-0 text-xs font-medium tabular-nums text-right",
								day.isToday ? "text-brand font-bold" : "text-fg-muted"
							)}
						>
							{day.day}
						</span>
						{day.events && day.events.length > 0 ? (
							<div className="flex-1 space-y-0.5">
								{day.events.map((event, i) => (
									<div key={i} className="flex items-center gap-2">
										<span className="text-xs text-fg">{event.title}</span>
										{event.time && (
											<span className="inline-flex items-center gap-0.5 text-xs text-fg-muted">
												<Clock className="size-2.5" />
												{event.time}
											</span>
										)}
										{event.variant && event.variant !== "default" && (
											<Badge variant={event.variant} size="xs" fill="subtle">
												{event.variant}
											</Badge>
										)}
									</div>
								))}
							</div>
						) : (
							<span className="text-xs text-fg-muted/50">—</span>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export const CalendarCard = withProGuard(CalendarCardBase, "CalendarCard")
