"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "../../lib/utils"

export interface SliderProps {
	value?: number | number[]
	defaultValue?: number | number[]
	onValueChange?: (value: number | number[]) => void
	onValueCommitted?: (value: number | number[]) => void
	min?: number
	max?: number
	step?: number
	disabled?: boolean
	className?: string
	"aria-label"?: string
	/** Show a label for each thumb with the current value */
	showValue?: boolean
}

function Slider({ value, defaultValue = 0, onValueChange, onValueCommitted, min = 0, max = 100, step = 1, disabled = false, className, "aria-label": ariaLabel, showValue = false }: SliderProps) {
	return (
		<SliderPrimitive.Root
			data-slot="slider"
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			onValueCommitted={onValueCommitted}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			aria-label={ariaLabel}
			className={cn("relative flex w-full touch-none select-none items-center", "data-disabled:opacity-50", className)}
		>
			<SliderPrimitive.Track data-slot="slider-track" className="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full">
				<SliderPrimitive.Indicator data-slot="slider-indicator" className="bg-brand absolute h-full rounded-full" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				data-slot="slider-thumb"
				className={cn(
					"block size-4 shrink-0 rounded-full border-2 border-brand bg-fg",
					"transition-colors outline-none",
					"focus-visible:ring-[3px] focus-visible:ring-brand/20",
					"disabled:pointer-events-none disabled:opacity-50",
					"hover:border-brand-hover",
					"cursor-grab active:cursor-grabbing"
				)}
			/>
		</SliderPrimitive.Root>
	)
}

export { Slider }
