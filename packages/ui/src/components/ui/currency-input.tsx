"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface CurrencyInputProps
	extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
	value?: number | null
	onValueChange?: (value: number | null) => void
	/** Currency symbol. @default "EUR" */
	currency?: string
	/** Locale for formatting. @default "fr-FR" */
	locale?: string
	/** Decimal places. @default 2 */
	decimals?: number
	/** Position of the currency symbol. @default "right" */
	symbolPosition?: "left" | "right"
}

function CurrencyInput({
	value,
	onValueChange,
	currency = "EUR",
	locale = "fr-FR",
	decimals = 2,
	symbolPosition = "right",
	className,
	placeholder,
	...props
}: CurrencyInputProps) {
	const [displayValue, setDisplayValue] = React.useState("")
	const [isFocused, setIsFocused] = React.useState(false)

	const symbol = React.useMemo(() => {
		try {
			return (
				new Intl.NumberFormat(locale, {
					style: "currency",
					currency,
					currencyDisplay: "narrowSymbol",
				})
					.formatToParts(0)
					.find((p) => p.type === "currency")?.value ?? currency
			)
		} catch {
			return currency
		}
	}, [currency, locale])

	const formatValue = React.useCallback(
		(num: number) => {
			return new Intl.NumberFormat(locale, {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			}).format(num)
		},
		[locale, decimals]
	)

	React.useEffect(() => {
		if (!isFocused && value != null) {
			setDisplayValue(formatValue(value))
		} else if (!isFocused && value == null) {
			setDisplayValue("")
		}
	}, [value, isFocused, formatValue])

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(true)
		if (value != null) {
			setDisplayValue(String(value))
		}
		e.target.select()
		props.onFocus?.(e)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(false)
		const parsed = Number.parseFloat(displayValue.replace(/[^\d.,-]/g, "").replace(",", "."))
		if (Number.isNaN(parsed)) {
			onValueChange?.(null)
			setDisplayValue("")
		} else {
			const rounded = Math.round(parsed * 10 ** decimals) / 10 ** decimals
			onValueChange?.(rounded)
			setDisplayValue(formatValue(rounded))
		}
		props.onBlur?.(e)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayValue(e.target.value)
	}

	return (
		<div className={cn("relative", className)}>
			{symbolPosition === "left" && (
				<span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-fg-muted pointer-events-none select-none">
					{symbol}
				</span>
			)}
			<input
				type="text"
				inputMode="decimal"
				data-slot="currency-input"
				value={displayValue}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder={placeholder ?? `0.${"0".repeat(decimals)}`}
				className={cn(
					"w-full min-w-0 outline-none",
					"bg-card",
					"hover:bg-muted",
					"border border-edge",
					"hover:border-edge",
					"focus:border-brand",
					"focus:ring-[3px] focus:ring-brand/20",
					"h-8 rounded-md py-1",
					symbolPosition === "left" ? "pl-8 pr-2.5" : "pl-2.5 pr-8",
					"text-sm text-fg text-right tabular-nums",
					"placeholder:text-fg-subtle",
					"transition-colors duration-150 ease-out",
					"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
					"aria-invalid:border-negative aria-invalid:ring-[3px] aria-invalid:ring-negative/20"
				)}
				{...props}
			/>
			{symbolPosition === "right" && (
				<span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-fg-muted pointer-events-none select-none">
					{symbol}
				</span>
			)}
		</div>
	)
}

export { CurrencyInput }
