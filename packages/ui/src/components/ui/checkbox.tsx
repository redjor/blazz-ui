"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"border-field bg-surface data-checked:bg-brand data-checked:text-brand-fg data-checked:border-brand",
				"aria-invalid:border-negative aria-invalid:ring-negative/20",
				"focus-visible:border-brand focus-visible:ring-brand/20",
				"flex size-4 items-center justify-center rounded-[4px] border transition-colors",
				"group-has-disabled/field:opacity-50 focus-visible:ring-[3px] aria-invalid:ring-[3px]",
				"peer relative shrink-0 outline-none",
				"after:absolute after:-inset-x-3 after:-inset-y-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
			>
				<CheckIcon />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

// ---------------------------------------------------------------------------
// CheckboxGroup
// ---------------------------------------------------------------------------

export interface CheckboxGroupOption {
	/** Unique value for this option */
	value: string
	/** Display label */
	label: string
	/** Optional description below the label */
	description?: string
	/** Disable this specific option */
	disabled?: boolean
}

export interface CheckboxGroupProps {
	/** Group label rendered as a legend */
	label?: string
	/** Description below the group label */
	description?: string
	/** Array of checkbox options */
	options: CheckboxGroupOption[]
	/** Controlled selected values */
	value?: string[]
	/** Default selected values (uncontrolled) */
	defaultValue?: string[]
	/** Callback when selection changes */
	onValueChange?: (value: string[]) => void
	/** Disable all checkboxes */
	disabled?: boolean
	/** Show error ring on all checkboxes */
	"aria-invalid"?: boolean
	/** Layout direction @default "vertical" */
	orientation?: "vertical" | "horizontal"
	/** Additional className for the fieldset */
	className?: string
}

function CheckboxGroup({
	label,
	description,
	options,
	value: controlledValue,
	defaultValue,
	onValueChange,
	disabled = false,
	"aria-invalid": ariaInvalid,
	orientation = "vertical",
	className,
}: CheckboxGroupProps) {
	const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? [])
	const isControlled = controlledValue !== undefined
	const selected = isControlled ? controlledValue : internalValue

	const toggle = React.useCallback(
		(optionValue: string, checked: boolean) => {
			const next = checked ? [...selected, optionValue] : selected.filter((v) => v !== optionValue)
			if (!isControlled) setInternalValue(next)
			onValueChange?.(next)
		},
		[selected, isControlled, onValueChange]
	)

	return (
		<fieldset data-slot="checkbox-group" className={cn("space-y-3", className)} disabled={disabled}>
			{(label || description) && (
				<div className="space-y-1">
					{label && <legend className="text-sm font-medium leading-none text-fg">{label}</legend>}
					{description && <p className="text-sm text-fg-muted">{description}</p>}
				</div>
			)}
			<div
				className={cn(orientation === "vertical" ? "space-y-2" : "flex flex-wrap gap-x-6 gap-y-2")}
			>
				{options.map((option) => {
					const id = `checkbox-group-${option.value}`
					return (
						<div key={option.value} className="flex gap-2">
							<Checkbox
								id={id}
								checked={selected.includes(option.value)}
								onCheckedChange={(checked) => toggle(option.value, checked as boolean)}
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
		</fieldset>
	)
}

export { Checkbox, CheckboxGroup }
