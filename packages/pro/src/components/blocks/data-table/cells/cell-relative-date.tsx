"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@blazz/ui"

export interface CellRelativeDateProps {
	/** Date value as string or Date object */
	value: string | Date
	/** Locale for formatting (default 'fr-FR') */
	locale?: string
}

const UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
	{ unit: "year", seconds: 60 * 60 * 24 * 365 },
	{ unit: "month", seconds: 60 * 60 * 24 * 30 },
	{ unit: "day", seconds: 60 * 60 * 24 },
	{ unit: "hour", seconds: 60 * 60 },
	{ unit: "minute", seconds: 60 },
	{ unit: "second", seconds: 1 },
]

function getRelativeTime(date: Date, locale: string): string {
	const now = new Date()
	const diffMs = date.getTime() - now.getTime()
	const diffSec = Math.round(diffMs / 1000)

	if (Math.abs(diffSec) < 10) {
		return locale.startsWith("fr") ? "À l\u2019instant" : "Just now"
	}

	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

	for (const { unit, seconds } of UNITS) {
		if (Math.abs(diffSec) >= seconds) {
			const value = Math.round(diffSec / seconds)
			return rtf.format(value, unit)
		}
	}

	return rtf.format(diffSec, "second")
}

/**
 * Renders a relative date string ("3h ago", "In 2 days") with an exact-date tooltip.
 */
export function CellRelativeDate({ value, locale = "fr-FR" }: CellRelativeDateProps) {
	if (!value) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	const date = value instanceof Date ? value : new Date(value)

	if (Number.isNaN(date.getTime())) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	const relative = getRelativeTime(date, locale)
	const exact = new Intl.DateTimeFormat(locale, {
		dateStyle: "full",
		timeStyle: "short",
	}).format(date)

	return (
		<Tooltip>
			<TooltipTrigger render={<span className="text-body-md text-fg-muted cursor-default" />}>{relative}</TooltipTrigger>
			<TooltipContent>{exact}</TooltipContent>
		</Tooltip>
	)
}
