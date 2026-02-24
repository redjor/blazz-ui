import * as React from "react"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * Timeline
 * --------------------------------------------------------------------------- */

function Timeline({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="timeline"
			className={cn("relative space-y-0", className)}
			{...props}
		/>
	)
}

export interface TimelineItemProps extends React.ComponentProps<"div"> {
	/** Show the connecting line. @default true */
	showLine?: boolean
}

function TimelineItem({ className, showLine = true, ...props }: TimelineItemProps) {
	return (
		<div
			data-slot="timeline-item"
			data-line={showLine}
			className={cn("relative flex gap-3 pb-6 last:pb-0", className)}
			{...props}
		/>
	)
}

function TimelineIndicator({ className, children, ...props }: React.ComponentProps<"div">) {
	return (
		<div className="relative flex flex-col items-center">
			<div
				data-slot="timeline-indicator"
				className={cn(
					"flex size-7 shrink-0 items-center justify-center rounded-full",
					"border border-edge bg-surface text-fg-muted",
					"[&>svg]:size-3.5",
					className
				)}
				{...props}
			>
				{children}
			</div>
			{/* Connecting line */}
			<div className="w-px flex-1 bg-edge mt-1.5 [[data-line='false']_&]:hidden" />
		</div>
	)
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="timeline-content"
			className={cn("flex-1 pt-0.5 pb-1", className)}
			{...props}
		/>
	)
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="timeline-title"
			className={cn("text-sm font-medium text-fg", className)}
			{...props}
		/>
	)
}

function TimelineDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="timeline-description"
			className={cn("text-sm text-fg-muted", className)}
			{...props}
		/>
	)
}

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
	return (
		<time
			data-slot="timeline-time"
			className={cn("text-xs text-fg-muted tabular-nums", className)}
			{...props}
		/>
	)
}

export {
	Timeline,
	TimelineItem,
	TimelineIndicator,
	TimelineContent,
	TimelineTitle,
	TimelineDescription,
	TimelineTime,
}
