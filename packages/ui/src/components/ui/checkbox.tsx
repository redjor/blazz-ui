"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import * as React from "react"
import { cn } from "../../lib/utils"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"border-field bg-card data-checked:bg-brand data-checked:text-brand-fg data-checked:border-brand",
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
			<CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-content-center text-current transition-none">
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

// ---------------------------------------------------------------------------
// BlurFadeText — animated label transition
// ---------------------------------------------------------------------------

function BlurFadeText({ text, duration = 150 }: { text: string; duration?: number }) {
	const [items, setItems] = React.useState([{ text, key: 0 }])
	const counterRef = React.useRef(0)
	const prevText = React.useRef(text)

	React.useEffect(() => {
		if (text === prevText.current) return
		prevText.current = text
		counterRef.current += 1
		const newKey = counterRef.current

		setItems((prev) => [...prev, { text, key: newKey }])

		const cleanup = setTimeout(() => {
			setItems((prev) => prev.filter((item) => item.key === newKey))
		}, duration)

		return () => clearTimeout(cleanup)
	}, [text, duration])

	return (
		<span className="pointer-events-none relative inline-flex">
			{items.map((item, i) => {
				const isEntering = i === items.length - 1 && items.length > 1
				const isLeaving = i < items.length - 1

				return (
					<span
						key={item.key}
						className={cn("transition-[opacity,filter] ease-out", i > 0 && "absolute inset-0")}
						style={{
							transitionDuration: `${duration}ms`,
							opacity: isLeaving ? 0 : 1,
							filter: isLeaving ? "blur(4px)" : isEntering ? "blur(0px)" : undefined,
						}}
					>
						{item.text}
					</span>
				)
			})}
		</span>
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
			<div className={cn(orientation === "vertical" ? "space-y-2" : "flex flex-wrap gap-x-6 gap-y-2")}>
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
								<label htmlFor={id} className={cn("text-sm font-medium leading-none select-none", (option.disabled || disabled) && "opacity-50 cursor-not-allowed")}>
									<BlurFadeText text={option.label} />
								</label>
								{option.description && <p className={cn("text-sm text-fg-muted", (option.disabled || disabled) && "opacity-50")}>{option.description}</p>}
							</div>
						</div>
					)
				})}
			</div>
		</fieldset>
	)
}

export { BlurFadeText, Checkbox, CheckboxGroup }
