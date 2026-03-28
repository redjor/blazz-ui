"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

/* ---------------------------------------------------------------------------
 * Context
 * --------------------------------------------------------------------------- */

type TimelineOrientation = "horizontal" | "vertical"

interface TimelineContextValue {
	orientation: TimelineOrientation
}

const TimelineContext = React.createContext<TimelineContextValue>({
	orientation: "vertical",
})

function useTimeline() {
	return React.useContext(TimelineContext)
}

/* ---------------------------------------------------------------------------
 * Timeline
 * --------------------------------------------------------------------------- */

interface TimelineProps extends React.ComponentProps<"div"> {
	/** Layout direction. @default "vertical" */
	orientation?: TimelineOrientation
}

function Timeline({ className, orientation = "vertical", ...props }: TimelineProps) {
	return (
		<TimelineContext.Provider value={{ orientation }}>
			<div data-slot="timeline" data-orientation={orientation} className={cn("relative", orientation === "horizontal" ? "flex flex-row items-start" : "space-y-0", className)} {...props} />
		</TimelineContext.Provider>
	)
}

/* ---------------------------------------------------------------------------
 * TimelineItem
 * --------------------------------------------------------------------------- */

export interface TimelineItemProps extends React.ComponentProps<"div"> {
	/** Show the connecting line after this item. @default true */
	showLine?: boolean
}

function TimelineItem({ className, showLine = true, ...props }: TimelineItemProps) {
	const { orientation } = useTimeline()
	return <div data-slot="timeline-item" data-line={showLine} className={cn("relative", orientation === "horizontal" ? "flex flex-1 flex-col" : "flex gap-3", className)} {...props} />
}

/* ---------------------------------------------------------------------------
 * TimelineIndicator
 * --------------------------------------------------------------------------- */

function TimelineIndicator({ className, children, ...props }: React.ComponentProps<"div">) {
	const { orientation } = useTimeline()

	if (orientation === "horizontal") {
		return (
			<div className="relative flex w-full flex-row items-center">
				{/* Left connecting line — invisible on first item to preserve layout */}
				<div className="h-px flex-1 bg-edge [[data-slot='timeline-item']:first-child_&]:invisible" />
				<div
					data-slot="timeline-indicator"
					className={cn("z-10 flex size-7 shrink-0 items-center justify-center rounded-full", "border border-edge bg-card text-fg-muted", "[&>svg]:size-3.5", className)}
					{...props}
				>
					{children}
				</div>
				{/* Right connecting line — invisible on last item or when showLine=false */}
				<div className="h-px flex-1 bg-edge [[data-slot='timeline-item']:last-child_&]:invisible [[data-line='false']_&]:invisible" />
			</div>
		)
	}

	return (
		<div className="relative flex flex-col items-center">
			<div
				data-slot="timeline-indicator"
				className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", "border border-edge bg-card text-fg-muted", "[&>svg]:size-3.5", className)}
				{...props}
			>
				{children}
			</div>
			{/* Vertical connecting line */}
			<div className="mt-1.5 w-px flex-1 bg-edge [[data-line='false']_&]:hidden" />
		</div>
	)
}

/* ---------------------------------------------------------------------------
 * TimelineHeader
 * --------------------------------------------------------------------------- */

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="timeline-header" className={cn("flex flex-col", className)} {...props} />
}

/* ---------------------------------------------------------------------------
 * TimelineContent
 * --------------------------------------------------------------------------- */

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
	const { orientation } = useTimeline()
	return (
		<div
			data-slot="timeline-content"
			className={cn(orientation === "horizontal" ? "mt-2 flex flex-col items-center text-center" : "flex-1 pt-0.5 pb-6 [[data-slot='timeline-item']:last-child_&]:pb-1", className)}
			{...props}
		/>
	)
}

/* ---------------------------------------------------------------------------
 * TimelineTitle
 * --------------------------------------------------------------------------- */

function TimelineTitle({ className, ...props }: React.ComponentProps<"p">) {
	return <p data-slot="timeline-title" className={cn("text-sm font-medium text-fg", className)} {...props} />
}

/* ---------------------------------------------------------------------------
 * TimelineDescription
 * --------------------------------------------------------------------------- */

function TimelineDescription({ className, ...props }: React.ComponentProps<"p">) {
	return <p data-slot="timeline-description" className={cn("text-sm text-fg-muted", className)} {...props} />
}

/* ---------------------------------------------------------------------------
 * TimelineDate
 * --------------------------------------------------------------------------- */

function TimelineDate({ className, ...props }: React.ComponentProps<"time">) {
	return <time data-slot="timeline-date" className={cn("text-xs text-fg-muted tabular-nums", className)} {...props} />
}

/* ---------------------------------------------------------------------------
 * TimelineTime (preserved for backward compatibility)
 * --------------------------------------------------------------------------- */

function TimelineTime({ className, ...props }: React.ComponentProps<"time">) {
	return <time data-slot="timeline-time" className={cn("text-xs text-fg-muted tabular-nums", className)} {...props} />
}

export { Timeline, TimelineItem, TimelineIndicator, TimelineHeader, TimelineContent, TimelineTitle, TimelineDescription, TimelineDate, TimelineTime }
