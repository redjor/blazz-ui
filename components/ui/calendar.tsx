"use client"

import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: React.ComponentProps<typeof DayPicker>) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-2",
				month: "flex flex-col gap-4",
				month_caption: "flex justify-center pt-1 relative items-center w-full",
				caption_label: "text-sm font-medium text-fg",
				nav: "flex items-center gap-1",
				button_previous:
					"absolute left-1 top-0 inline-flex size-7 items-center justify-center rounded-md border border-edge bg-transparent text-fg-muted hover:bg-raised transition-colors",
				button_next:
					"absolute right-1 top-0 inline-flex size-7 items-center justify-center rounded-md border border-edge bg-transparent text-fg-muted hover:bg-raised transition-colors",
				month_grid: "w-full border-collapse",
				weekdays: "flex",
				weekday:
					"w-9 text-[0.8rem] font-normal text-fg-muted rounded-md",
				week: "flex w-full mt-2",
				day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
				day_button:
					"inline-flex size-9 items-center justify-center rounded-md text-sm font-normal transition-colors hover:bg-raised hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 aria-selected:opacity-100",
				selected:
					"bg-brand text-brand-fg hover:bg-brand-hover hover:text-brand-fg focus:bg-brand focus:text-brand-fg rounded-md",
				today: "bg-raised text-fg font-semibold",
				outside: "text-fg-muted opacity-50 aria-selected:opacity-30",
				disabled: "text-fg-muted opacity-50",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) => {
					const Icon = orientation === "left" ? ChevronLeft : ChevronRight
					return <Icon className="size-4" />
				},
			}}
			{...props}
		/>
	)
}

export { Calendar }
