"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface OtpInputProps {
	/** Number of digits. @default 6 */
	length?: number
	value?: string
	onValueChange?: (value: string) => void
	/** Called when all digits are filled */
	onComplete?: (value: string) => void
	disabled?: boolean
	className?: string
	"aria-invalid"?: boolean
	/** Mask input (for PIN). @default false */
	mask?: boolean
}

function OtpInput({ length = 6, value = "", onValueChange, onComplete, disabled = false, className, "aria-invalid": ariaInvalid, mask = false }: OtpInputProps) {
	const inputsRef = React.useRef<(HTMLInputElement | null)[]>([])

	const digits = React.useMemo(() => {
		const arr = value.split("").slice(0, length)
		while (arr.length < length) arr.push("")
		return arr
	}, [value, length])

	const updateValue = React.useCallback(
		(newDigits: string[]) => {
			const next = newDigits.join("")
			onValueChange?.(next)
			if (next.length === length && newDigits.every((d) => d !== "")) {
				onComplete?.(next)
			}
		},
		[length, onValueChange, onComplete]
	)

	const handleChange = (index: number, inputValue: string) => {
		const char = inputValue.replace(/\D/g, "").slice(-1)
		if (!char && inputValue !== "") return

		const newDigits = [...digits]
		newDigits[index] = char
		updateValue(newDigits)

		if (char && index < length - 1) {
			inputsRef.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			e.preventDefault()
			const newDigits = [...digits]
			if (digits[index]) {
				newDigits[index] = ""
				updateValue(newDigits)
			} else if (index > 0) {
				newDigits[index - 1] = ""
				updateValue(newDigits)
				inputsRef.current[index - 1]?.focus()
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputsRef.current[index - 1]?.focus()
		} else if (e.key === "ArrowRight" && index < length - 1) {
			inputsRef.current[index + 1]?.focus()
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
		if (!pasted) return

		const newDigits = [...digits]
		for (let i = 0; i < pasted.length; i++) {
			newDigits[i] = pasted[i]
		}
		updateValue(newDigits)

		const focusIndex = Math.min(pasted.length, length - 1)
		inputsRef.current[focusIndex]?.focus()
	}

	return (
		<div data-slot="otp-input" className={cn("flex items-center gap-2", className)} role="group" aria-label="One-time password">
			{digits.map((digit, i) => (
				<input
					key={i}
					ref={(el) => {
						inputsRef.current[i] = el
					}}
					type={mask ? "password" : "text"}
					inputMode="numeric"
					autoComplete="one-time-code"
					maxLength={1}
					value={digit}
					onChange={(e) => handleChange(i, e.target.value)}
					onKeyDown={(e) => handleKeyDown(i, e)}
					onPaste={handlePaste}
					onFocus={(e) => e.target.select()}
					disabled={disabled}
					aria-invalid={ariaInvalid}
					aria-label={`Digit ${i + 1}`}
					className={cn(
						"w-10 h-10 text-center text-base font-medium tabular-nums",
						"bg-card border border-edge rounded-md",
						"outline-none transition-colors duration-150",
						"focus:border-brand focus:ring-[3px] focus:ring-brand/20",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						"aria-invalid:border-negative aria-invalid:ring-[3px] aria-invalid:ring-negative/20",
						"text-fg placeholder:text-fg-subtle"
					)}
				/>
			))}
		</div>
	)
}

export { OtpInput }
