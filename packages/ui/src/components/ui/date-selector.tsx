"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { cn } from "../../lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

/* ----- Trigger styles (matches Select trigger) ----- */

const triggerBase = [
	"border-field",
	"focus-visible:border-brand focus-visible:ring-brand/20 focus-visible:ring-3",
	"aria-invalid:ring-negative/20 aria-invalid:border-negative aria-invalid:ring-3",
	"inline-flex h-8 items-center gap-1.5 rounded-lg border bg-surface hover:bg-surface-3 px-2.5 text-sm transition-colors select-none",
	"outline-none",
	"disabled:cursor-not-allowed disabled:opacity-50",
	"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
]

/* ----- DateSelector ----- */

interface DateSelectorProps {
	value?: Date
	onValueChange?: (date: Date | undefined) => void
	placeholder?: string
	disabled?: boolean
	className?: string
	/** Format string for date-fns. @default "PPP" */
	formatStr?: string
}

function DateSelector({
	value,
	onValueChange,
	placeholder = "Pick a date",
	disabled = false,
	className,
	formatStr = "PPP",
}: DateSelectorProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				disabled={disabled}
				className={cn(triggerBase, !value && "text-fg-muted", className)}
			>
				<CalendarIcon className="size-4 text-fg-muted" />
				{value ? format(value, formatStr) : placeholder}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={(date) => {
						onValueChange?.(date)
						setOpen(false)
					}}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	)
}

/* ----- DateRangeSelector ----- */

interface DateRangeSelectorProps {
	from?: Date
	to?: Date
	onRangeChange?: (range: { from?: Date; to?: Date }) => void
	fromPlaceholder?: string
	toPlaceholder?: string
	disabled?: boolean
	className?: string
	/** Number of months to display. @default 2 */
	numberOfMonths?: number
	/** Format string for date-fns. @default "PP" */
	formatStr?: string
}

function DateRangeSelector({
	from,
	to,
	onRangeChange,
	fromPlaceholder = "Start date",
	toPlaceholder = "End date",
	disabled = false,
	className,
	numberOfMonths = 2,
	formatStr = "PP",
}: DateRangeSelectorProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger disabled={disabled} className={cn(triggerBase, "gap-0", className)}>
				<CalendarIcon className="mr-1.5 size-4 text-fg-muted" />
				<span className={cn(!from && "text-fg-muted")}>
					{from ? format(from, formatStr) : fromPlaceholder}
				</span>
				<span className="mx-1.5 text-fg-muted">&ndash;</span>
				<span className={cn(!to && "text-fg-muted")}>
					{to ? format(to, formatStr) : toPlaceholder}
				</span>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={from || to ? { from, to } : undefined}
					onSelect={(range) => {
						onRangeChange?.({ from: range?.from, to: range?.to })
					}}
					numberOfMonths={numberOfMonths}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	)
}

export { DateSelector, DateRangeSelector, type DateSelectorProps, type DateRangeSelectorProps }
