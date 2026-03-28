"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import * as React from "react"

import { cn } from "../../lib/utils"

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: SliderPrimitive.Root.Props) {
	const normalizedDefault = React.useMemo(() => (defaultValue == null ? undefined : Array.isArray(defaultValue) ? defaultValue : [defaultValue]), [defaultValue])
	const normalizedValue = React.useMemo(() => (value == null ? undefined : Array.isArray(value) ? value : [value]), [value])
	const thumbCount = normalizedValue?.length ?? normalizedDefault?.length ?? 1

	return (
		<SliderPrimitive.Root
			className={cn("data-horizontal:w-full data-vertical:h-full", className)}
			data-slot="slider"
			defaultValue={normalizedDefault}
			value={normalizedValue}
			min={min}
			max={max}
			{...props}
		>
			<SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
				<SliderPrimitive.Track data-slot="slider-track" className="relative h-1 w-full grow overflow-hidden rounded-full bg-muted select-none data-vertical:h-full data-vertical:w-1">
					<SliderPrimitive.Indicator data-slot="slider-range" className="h-full bg-primary select-none data-vertical:h-auto data-vertical:w-full" />
				</SliderPrimitive.Track>
				{Array.from({ length: thumbCount }, (_, index) => (
					<SliderPrimitive.Thumb
						data-slot="slider-thumb"
						key={index}
						className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	)
}

export { Slider }
