"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Calendar as CalendarComponent } from "@blazz/ui/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui/components/ui/popover"
import {
	addDays,
	format,
	isFriday,
	isThisWeek,
	isToday,
	isTomorrow,
	nextFriday,
	nextMonday,
	parseISO,
} from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowRight, Calendar, Sofa, Sun, Sunrise, X } from "lucide-react"
import { useState } from "react"

interface DueDatePickerProps {
	value: string
	onChange: (value: string) => void
	/** Compact inline pill style (no border, smaller) */
	compact?: boolean
}

interface Shortcut {
	label: string
	icon: React.ReactNode
	getDate: () => Date
	hint: () => string
}

function getShortcuts(): Shortcut[] {
	const now = new Date()
	return [
		{
			label: "Aujourd'hui",
			icon: <Sun className="size-4 text-yellow-500" />,
			getDate: () => now,
			hint: () => format(now, "EEE", { locale: fr }),
		},
		{
			label: "Demain",
			icon: <Sunrise className="size-4 text-orange-500" />,
			getDate: () => addDays(now, 1),
			hint: () => format(addDays(now, 1), "EEE", { locale: fr }),
		},
		{
			label: "Vendredi",
			icon: <Sofa className="size-4 text-blue-500" />,
			getDate: () => (isFriday(now) ? now : nextFriday(now)),
			hint: () => format(isFriday(now) ? now : nextFriday(now), "d MMM", { locale: fr }),
		},
		{
			label: "Semaine prochaine",
			icon: <ArrowRight className="size-4 text-violet-500" />,
			getDate: () => nextMonday(now),
			hint: () => format(nextMonday(now), "d MMM", { locale: fr }),
		},
	]
}

function formatCurrentValue(value: string): string {
	if (!value) return ""
	const date = parseISO(value)
	if (isToday(date)) return "Aujourd'hui"
	if (isTomorrow(date)) return "Demain"
	if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, "EEEE", { locale: fr })
	return format(date, "d MMM yyyy", { locale: fr })
}

export function DueDatePicker({ value, onChange, compact }: DueDatePickerProps) {
	const [open, setOpen] = useState(false)
	const shortcuts = getShortcuts()
	const displayLabel = value ? formatCurrentValue(value) : null

	function pick(date: Date) {
		onChange(format(date, "yyyy-MM-dd"))
		setOpen(false)
	}

	function clear() {
		onChange("")
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant={compact ? "ghost" : "outline"}
						size={compact ? "sm" : "default"}
						className={
							compact
								? "h-7 px-2 text-xs text-fg-muted font-normal"
								: "w-full justify-start text-left font-normal"
						}
					/>
				}
			>
				<Calendar className={compact ? "size-3.5 text-fg-muted" : "size-4 text-fg-muted mr-2"} />
				{displayLabel ? (
					<span className={compact ? "text-xs" : "text-sm"}>{displayLabel}</span>
				) : (
					<span className={compact ? "text-xs text-fg-muted" : "text-sm text-fg-muted"}>Échéance</span>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-auto !p-1" align="start">
				<div className="flex">
					{/* Left — shortcuts */}
					<div className="flex flex-col w-[200px] p-1">
						{shortcuts.map((s) => (
							<button
								key={s.label}
								type="button"
								onClick={() => pick(s.getDate())}
								className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-surface-3 transition-colors"
							>
								{s.icon}
								<span className="flex-1 text-left text-fg">{s.label}</span>
								<span className="text-xs text-fg-muted capitalize">{s.hint()}</span>
							</button>
						))}
						{value && (
							<>
								<div className="mx-3 my-1 border-t border-edge" />
								<button
									type="button"
									onClick={clear}
									className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-surface-3 transition-colors"
								>
									<X className="size-4 text-fg-muted" />
									<span className="flex-1 text-left text-fg-muted">Sans date</span>
								</button>
							</>
						)}
					</div>
					{/* Right — calendar */}
					<div className="p-1">
						<CalendarComponent
							mode="single"
							selected={value ? parseISO(value) : undefined}
							onSelect={(date) => {
								if (date) pick(date)
							}}
							locale={fr}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
