"use client"

import { cn } from "../../lib/utils"
import { withProGuard } from "../../lib/with-pro-guard"
import { Skeleton } from "../ui/skeleton"

export interface TimelineEvent {
	date: string
	user: string
	action: string
	detail?: string
}

export interface ActivityTimelineProps {
	events: TimelineEvent[]
	loading?: boolean
	className?: string
}

function formatEventDate(dateStr: string) {
	const date = new Date(dateStr)
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

function TimelineItem({ event }: { event: TimelineEvent }) {
	return (
		<li className="relative pb-6 pl-6 last:pb-0">
			{/* Connector line */}
			<div className="absolute left-[4.5px] top-2 -bottom-2 w-px bg-border last:hidden" />
			{/* Dot */}
			<div className="absolute left-0 top-1.5 size-[10px] rounded-full border-2 border-fg/20 bg-surface" />

			<div className="space-y-0.5">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-fg">{event.user}</span>
					<span className="text-xs text-fg-muted">{formatEventDate(event.date)}</span>
				</div>
				<p className="text-sm text-fg">{event.action}</p>
				{event.detail && <p className="text-sm text-fg-muted">{event.detail}</p>}
			</div>
		</li>
	)
}

function TimelineSkeleton() {
	return (
		<li className="relative pb-6 pl-6">
			<div className="absolute left-[4.5px] top-2 -bottom-2 w-px bg-border" />
			<div className="absolute left-0 top-1.5 size-[10px] rounded-full bg-raised" />
			<div className="space-y-1.5">
				<div className="flex items-center gap-2">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-3 w-28" />
				</div>
				<Skeleton className="h-4 w-48" />
			</div>
		</li>
	)
}

function ActivityTimelineBase({ events, loading = false, className }: ActivityTimelineProps) {
	if (loading) {
		return (
			<ul className={cn("list-none", className)}>
				{Array.from({ length: 4 }).map((_, i) => (
					<TimelineSkeleton key={i} />
				))}
			</ul>
		)
	}

	return (
		<ul className={cn("list-none", className)}>
			{events.map((event, i) => (
				<TimelineItem key={i} event={event} />
			))}
		</ul>
	)
}

export const ActivityTimeline = withProGuard(ActivityTimelineBase, "ActivityTimeline")
