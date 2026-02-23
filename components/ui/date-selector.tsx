"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

/* ----- Trigger styles (matches Select trigger) ----- */

const triggerBase = [
	"border-edge",
	"focus-visible:border-brand focus-visible:ring-brand/20 focus-visible:ring-3",
	"aria-invalid:ring-negative/20 aria-invalid:border-negative aria-invalid:ring-3",
	"inline-flex h-8 items-center gap-1.5 rounded-lg border bg-transparent px-2.5 text-sm transition-colors select-none",
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
				className={cn(
					triggerBase,
					!value && "text-fg-muted",
					className,
				)}
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
	onFromChange?: (date: Date | undefined) => void
	onToChange?: (date: Date | undefined) => void
	fromPlaceholder?: string
	toPlaceholder?: string
	disabled?: boolean
	className?: string
	/** Format string for date-fns. @default "PP" */
	formatStr?: string
}

function DateRangeSelector({
	from,
	to,
	onFromChange,
	onToChange,
	fromPlaceholder = "Start date",
	toPlaceholder = "End date",
	disabled = false,
	className,
	formatStr = "PP",
}: DateRangeSelectorProps) {
	const [openFrom, setOpenFrom] = React.useState(false)
	const [openTo, setOpenTo] = React.useState(false)

	return (
		<div className={cn("inline-flex items-center", className)}>
			{/* From trigger */}
			<Popover open={openFrom} onOpenChange={setOpenFrom}>
				<PopoverTrigger
					disabled={disabled}
					className={cn(
						triggerBase,
						"rounded-r-none border-r-0",
						!from && "text-fg-muted",
					)}
				>
					<CalendarIcon className="size-4 text-fg-muted" />
					{from ? format(from, formatStr) : fromPlaceholder}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={from}
						onSelect={(date) => {
							onFromChange?.(date)
							setOpenFrom(false)
						}}
						disabled={to ? { after: to } : undefined}
						autoFocus
					/>
				</PopoverContent>
			</Popover>

			{/* Divider */}
			<div className="h-8 w-px bg-edge" />

			{/* To trigger */}
			<Popover open={openTo} onOpenChange={setOpenTo}>
				<PopoverTrigger
					disabled={disabled}
					className={cn(
						triggerBase,
						"rounded-l-none border-l-0",
						!to && "text-fg-muted",
					)}
				>
					<CalendarIcon className="size-4 text-fg-muted" />
					{to ? format(to, formatStr) : toPlaceholder}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={to}
						onSelect={(date) => {
							onToChange?.(date)
							setOpenTo(false)
						}}
						disabled={from ? { before: from } : undefined}
						autoFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export { DateSelector, DateRangeSelector, type DateSelectorProps, type DateRangeSelectorProps }
