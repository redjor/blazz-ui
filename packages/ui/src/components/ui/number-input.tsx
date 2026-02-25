"use client"

import * as React from "react"
import { NumberField } from "@base-ui/react/number-field"
import { MinusIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NumberInputProps {
	value?: number | null
	defaultValue?: number
	onValueChange?: (value: number | null) => void
	min?: number
	max?: number
	step?: number
	disabled?: boolean
	placeholder?: string
	className?: string
	"aria-invalid"?: boolean
	"aria-label"?: string
	id?: string
}

function NumberInput({
	value,
	defaultValue,
	onValueChange,
	min,
	max,
	step = 1,
	disabled = false,
	placeholder,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	id,
}: NumberInputProps) {
	return (
		<NumberField.Root
			data-slot="number-input"
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			min={min}
			max={max}
			step={step}
			disabled={disabled}
			id={id}
			aria-label={ariaLabel}
			className={cn("flex items-center", className)}
		>
			<NumberField.Decrement
				className={cn(
					"inline-flex size-8 items-center justify-center rounded-l-md",
					"border border-r-0 border-edge bg-surface",
					"text-fg-muted hover:bg-raised hover:text-fg",
					"transition-colors outline-none",
					"focus-visible:z-10 focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/20",
					"disabled:opacity-50 disabled:pointer-events-none"
				)}
			>
				<MinusIcon className="size-3.5" />
			</NumberField.Decrement>
			<NumberField.Input
				placeholder={placeholder}
				aria-invalid={ariaInvalid}
				className={cn(
					"w-full min-w-0 outline-none",
					"bg-surface",
					"border-y border-edge",
					"focus:border-brand",
					"focus:ring-[3px] focus:ring-brand/20 focus:z-10",
					"h-8 px-2.5 py-1",
					"text-sm text-fg text-center tabular-nums",
					"placeholder:text-fg-subtle",
					"transition-colors duration-150 ease-out",
					"disabled:opacity-50 disabled:cursor-not-allowed",
					"aria-invalid:border-negative aria-invalid:ring-[3px] aria-invalid:ring-negative/20"
				)}
			/>
			<NumberField.Increment
				className={cn(
					"inline-flex size-8 items-center justify-center rounded-r-md",
					"border border-l-0 border-edge bg-surface",
					"text-fg-muted hover:bg-raised hover:text-fg",
					"transition-colors outline-none",
					"focus-visible:z-10 focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/20",
					"disabled:opacity-50 disabled:pointer-events-none"
				)}
			>
				<PlusIcon className="size-3.5" />
			</NumberField.Increment>
		</NumberField.Root>
	)
}

export { NumberInput }
