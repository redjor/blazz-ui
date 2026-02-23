"use client"

import * as React from "react"
import { addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"

export function SingleSelectionDemo() {
	const [date, setDate] = React.useState<Date | undefined>(new Date())

	return (
		<div className="space-y-2">
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-lg border border-edge"
			/>
			{date && (
				<p className="text-center text-xs text-fg-muted">
					Selected: {date.toLocaleDateString()}
				</p>
			)}
		</div>
	)
}

export function RangeSelectionDemo() {
	const [range, setRange] = React.useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), 6),
	})

	return (
		<div className="space-y-2">
			<Calendar
				mode="range"
				selected={range}
				onSelect={setRange}
				numberOfMonths={2}
				className="rounded-lg border border-edge"
			/>
			{range?.from && range?.to && (
				<p className="text-center text-xs text-fg-muted">
					{range.from.toLocaleDateString()} &ndash; {range.to.toLocaleDateString()}
				</p>
			)}
		</div>
	)
}

export function ControlledDemo() {
	const [date, setDate] = React.useState<Date | undefined>()

	return (
		<div className="space-y-2">
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-lg border border-edge"
			/>
			<p className="text-center text-xs text-fg-muted">
				{date ? `Selected: ${date.toLocaleDateString()}` : "Click a day to select it"}
			</p>
		</div>
	)
}
