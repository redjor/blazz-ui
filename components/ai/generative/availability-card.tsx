"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export type SlotStatus = "available" | "busy" | "tentative"

export interface TimeSlot {
	time: string
	status: SlotStatus
}

export interface AvailabilityDay {
	date: string
	slots: TimeSlot[]
}

export interface AvailabilityCardProps {
	title?: string
	days: AvailabilityDay[]
	onSelect?: (date: string, time: string) => void
	className?: string
}

const slotStyles = {
	available: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 cursor-pointer",
	busy: "border-edge-subtle bg-raised/50 text-fg-muted/50 cursor-not-allowed",
	tentative: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-900 cursor-pointer",
} as const

export function AvailabilityCard({
	title = "Available times",
	days,
	onSelect,
	className,
}: AvailabilityCardProps) {
	const [selected, setSelected] = useState<string | null>(null)

	function handleSelect(date: string, time: string, status: SlotStatus) {
		if (status === "busy") return
		const key = `${date}-${time}`
		setSelected(key)
		onSelect?.(date, time)
	}

	return (
		<div className={cn("rounded-lg border border-edge bg-surface p-4", className)}>
			<div className="flex items-center gap-2">
				<Clock className="size-4 text-fg-muted" />
				<span className="text-sm font-semibold text-fg">{title}</span>
			</div>

			<div className="mt-3 space-y-3">
				{days.map((day) => (
					<div key={day.date}>
						<span className="text-xs font-medium text-fg">{day.date}</span>
						<div className="mt-1.5 flex flex-wrap gap-1.5">
							{day.slots.map((slot) => {
								const key = `${day.date}-${slot.time}`
								const isSelected = selected === key
								return (
									<button
										key={key}
										type="button"
										disabled={slot.status === "busy"}
										onClick={() => handleSelect(day.date, slot.time, slot.status)}
										className={cn(
											"rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
											isSelected
												? "border-brand bg-brand text-white"
												: slotStyles[slot.status],
										)}
									>
										{slot.time}
									</button>
								)
							})}
						</div>
					</div>
				))}
			</div>

			<div className="mt-3 flex items-center gap-3 text-xs text-fg-muted">
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-emerald-500" /> Available
				</span>
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-amber-500" /> Tentative
				</span>
				<span className="flex items-center gap-1">
					<span className="size-2 rounded-full bg-raised border border-edge" /> Busy
				</span>
			</div>
		</div>
	)
}
