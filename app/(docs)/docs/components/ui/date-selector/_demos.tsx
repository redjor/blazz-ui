"use client"

import * as React from "react"
import { DateSelector, DateRangeSelector } from "@/components/ui/date-selector"

export function DateSelectorDemo() {
	const [date, setDate] = React.useState<Date | undefined>()

	return (
		<div className="space-y-2">
			<DateSelector value={date} onValueChange={setDate} />
			{date && (
				<p className="text-xs text-fg-muted">
					Selected: {date.toLocaleDateString()}
				</p>
			)}
		</div>
	)
}

export function DateSelectorCustomFormatDemo() {
	const [date, setDate] = React.useState<Date | undefined>(new Date())

	return <DateSelector value={date} onValueChange={setDate} formatStr="dd/MM/yyyy" />
}

export function DateRangeSelectorDemo() {
	const [from, setFrom] = React.useState<Date | undefined>()
	const [to, setTo] = React.useState<Date | undefined>()

	return (
		<div className="space-y-2">
			<DateRangeSelector
				from={from}
				to={to}
				onFromChange={setFrom}
				onToChange={setTo}
			/>
			{from && to && (
				<p className="text-xs text-fg-muted">
					{from.toLocaleDateString()} &ndash; {to.toLocaleDateString()}
				</p>
			)}
		</div>
	)
}

export function DateRangeSelectorCustomDemo() {
	const [from, setFrom] = React.useState<Date | undefined>()
	const [to, setTo] = React.useState<Date | undefined>()

	return (
		<DateRangeSelector
			from={from}
			to={to}
			onFromChange={setFrom}
			onToChange={setTo}
			fromPlaceholder="Date de début"
			toPlaceholder="Date de fin"
			formatStr="dd MMM yyyy"
		/>
	)
}
