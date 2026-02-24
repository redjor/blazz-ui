"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitiveRoot } from "@base-ui/react/radio-group"
import { cn } from "@/lib/utils"

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
	return (
		<RadioPrimitive.Root
			data-slot="radio"
			className={cn(
				"border-edge data-checked:border-brand",
				"aria-invalid:border-negative aria-invalid:ring-negative/20",
				"focus-visible:border-brand focus-visible:ring-brand/20",
				"flex size-4 items-center justify-center rounded-full border transition-colors",
				"focus-visible:ring-[3px] aria-invalid:ring-[3px]",
				"peer relative shrink-0 outline-none",
				"after:absolute after:-inset-x-3 after:-inset-y-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...props}
		>
			<RadioPrimitive.Indicator
				data-slot="radio-indicator"
				className="size-2 rounded-full bg-brand transition-transform data-unchecked:scale-0 data-checked:scale-100"
			/>
		</RadioPrimitive.Root>
	)
}

/* ---------------------------------------------------------------------------
 * RadioGroup
 * --------------------------------------------------------------------------- */

export interface RadioGroupOption {
	value: string
	label: string
	description?: string
	disabled?: boolean
}

export interface RadioGroupProps {
	label?: string
	description?: string
	options: RadioGroupOption[]
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
	"aria-invalid"?: boolean
	orientation?: "vertical" | "horizontal"
	className?: string
}

function RadioGroup({
	label,
	description,
	options,
	value,
	defaultValue,
	onValueChange,
	disabled = false,
	"aria-invalid": ariaInvalid,
	orientation = "vertical",
	className,
}: RadioGroupProps) {
	return (
		<RadioGroupPrimitiveRoot
			data-slot="radio-group"
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			disabled={disabled}
			className={cn("space-y-3", className)}
		>
			{(label || description) && (
				<div className="space-y-1">
					{label && (
						<span className="text-sm font-medium leading-none text-fg">
							{label}
						</span>
					)}
					{description && (
						<p className="text-sm text-fg-muted">{description}</p>
					)}
				</div>
			)}
			<div
				className={cn(
					orientation === "vertical" ? "space-y-2" : "flex flex-wrap gap-x-6 gap-y-2"
				)}
			>
				{options.map((option) => {
					const id = `radio-group-${option.value}`
					return (
						<div key={option.value} className="flex gap-2">
							<Radio
								id={id}
								value={option.value}
								disabled={option.disabled || disabled}
								aria-invalid={ariaInvalid || undefined}
								className="mt-0.5"
							/>
							<div className="space-y-0.5">
								<label
									htmlFor={id}
									className={cn(
										"text-sm font-medium leading-none select-none",
										(option.disabled || disabled) && "opacity-50 cursor-not-allowed"
									)}
								>
									{option.label}
								</label>
								{option.description && (
									<p
										className={cn(
											"text-sm text-fg-muted",
											(option.disabled || disabled) && "opacity-50"
										)}
									>
										{option.description}
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</RadioGroupPrimitiveRoot>
	)
}

export { Radio, RadioGroup }
