"use client"

import { DayPicker } from "react-day-picker"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"

import { cn } from "../../lib/utils"

const chevronIcons = {
	left: ChevronLeft,
	right: ChevronRight,
	up: ChevronUp,
	down: ChevronDown,
} as const

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			data-slot="calendar"
			showOutsideDays={showOutsideDays}
			className={cn("w-fit rounded-lg bg-surface p-3", className)}
			classNames={{
				months: "relative flex flex-col sm:flex-row gap-2",
				month: "flex flex-col gap-4",
				month_caption: "flex justify-center pt-1 relative items-center w-full",
				caption_label: "text-sm font-medium text-fg",
				nav: "flex items-center gap-1",
				button_previous:
					"absolute left-1 top-0 z-10 inline-flex size-7 items-center justify-center rounded-md border border-container bg-transparent text-fg-muted hover:bg-raised transition-colors",
				button_next:
					"absolute right-1 top-0 z-10 inline-flex size-7 items-center justify-center rounded-md border border-container bg-transparent text-fg-muted hover:bg-raised transition-colors",
				month_grid: "w-full border-collapse",
				weekdays: "flex",
				weekday:
					"w-9 text-center text-[0.8rem] font-normal text-fg-muted rounded-md",
				week: "flex w-full mt-2",
				day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
				day_button:
					"inline-flex size-9 items-center justify-center rounded-md text-sm font-normal transition-colors hover:bg-raised hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-selected:opacity-100",
				selected:
					"bg-brand text-brand-fg hover:bg-brand-hover hover:text-brand-fg focus:bg-brand focus:text-brand-fg rounded-md [&.rdp-today]:bg-brand [&.rdp-today]:text-brand-fg",
				today: "bg-raised text-fg font-semibold",
				outside:
					"text-fg-muted opacity-50 aria-selected:bg-brand/50 aria-selected:text-brand-fg aria-selected:opacity-30",
				disabled: "text-fg-muted opacity-50 pointer-events-none",
				hidden: "invisible",
				range_start: "rounded-r-none",
				range_end: "rounded-l-none",
				range_middle:
					"rounded-none bg-raised text-fg aria-selected:bg-raised aria-selected:text-fg",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation = "left" }) => {
					const Icon = chevronIcons[orientation]
					return <Icon className="size-4" />
				},
			}}
			{...props}
		/>
	)
}

export { Calendar }
