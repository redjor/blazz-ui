"use client"

import { ClockIcon } from "lucide-react"
import { cn } from "../../lib/utils"

export interface TimePickerProps {
	value?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
	className?: string
	placeholder?: string
	/** Use 24h format. @default true */
	use24h?: boolean
	/** Minute step. @default 1 */
	step?: number
	"aria-invalid"?: boolean
	id?: string
}

function TimePicker({
	value,
	onValueChange,
	disabled = false,
	className,
	placeholder = "HH:MM",
	use24h = true,
	step = 1,
	"aria-invalid": ariaInvalid,
	id,
}: TimePickerProps) {
	return (
		<div className="relative">
			<ClockIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-fg-muted pointer-events-none" />
			<input
				id={id}
				type="time"
				data-slot="time-picker"
				value={value}
				onChange={(e) => onValueChange?.(e.target.value)}
				disabled={disabled}
				step={step * 60}
				aria-invalid={ariaInvalid}
				placeholder={placeholder}
				className={cn(
					"w-full min-w-0 outline-none",
					"bg-surface",
					"hover:bg-raised",
					"border border-edge",
					"hover:border-edge",
					"focus:border-brand",
					"focus:ring-[3px] focus:ring-brand/20",
					"h-8 rounded-md pl-8 pr-2.5 py-1",
					"text-sm text-fg tabular-nums",
					"placeholder:text-fg-subtle",
					"transition-colors duration-150 ease-out",
					"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
					"aria-invalid:border-negative aria-invalid:ring-[3px] aria-invalid:ring-negative/20",
					"[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
					className
				)}
				{...(!use24h ? {} : {})}
			/>
		</div>
	)
}

export { TimePicker }
