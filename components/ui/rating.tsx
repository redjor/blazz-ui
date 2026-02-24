"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RatingProps {
	value?: number
	defaultValue?: number
	onValueChange?: (value: number) => void
	/** Number of stars. @default 5 */
	max?: number
	/** Allow half-star selection. @default false */
	allowHalf?: boolean
	/** Read-only mode. @default false */
	readOnly?: boolean
	disabled?: boolean
	/** Size of the stars. @default "default" */
	size?: "sm" | "default" | "lg"
	className?: string
}

function Rating({
	value: controlledValue,
	defaultValue = 0,
	onValueChange,
	max = 5,
	allowHalf = false,
	readOnly = false,
	disabled = false,
	size = "default",
	className,
}: RatingProps) {
	const [internalValue, setInternalValue] = React.useState(defaultValue)
	const [hoverValue, setHoverValue] = React.useState(0)
	const isControlled = controlledValue !== undefined
	const currentValue = isControlled ? controlledValue : internalValue

	const displayValue = hoverValue || currentValue

	const sizeClasses = {
		sm: "size-4",
		default: "size-5",
		lg: "size-6",
	}

	const handleClick = (starValue: number) => {
		if (readOnly || disabled) return
		const newValue = starValue === currentValue ? 0 : starValue
		if (!isControlled) setInternalValue(newValue)
		onValueChange?.(newValue)
	}

	const handleMouseMove = (starIndex: number, e: React.MouseEvent<HTMLButtonElement>) => {
		if (readOnly || disabled) return
		if (allowHalf) {
			const rect = e.currentTarget.getBoundingClientRect()
			const isLeftHalf = e.clientX - rect.left < rect.width / 2
			setHoverValue(isLeftHalf ? starIndex - 0.5 : starIndex)
		} else {
			setHoverValue(starIndex)
		}
	}

	return (
		<div
			data-slot="rating"
			className={cn(
				"inline-flex items-center gap-0.5",
				disabled && "opacity-50 pointer-events-none",
				className
			)}
			role="radiogroup"
			aria-label="Rating"
			onMouseLeave={() => setHoverValue(0)}
		>
			{Array.from({ length: max }, (_, i) => {
				const starIndex = i + 1
				const filled = displayValue >= starIndex
				const halfFilled = !filled && displayValue >= starIndex - 0.5

				return (
					<button
						key={starIndex}
						type="button"
						role="radio"
						aria-checked={currentValue === starIndex}
						aria-label={`${starIndex} star${starIndex > 1 ? "s" : ""}`}
						tabIndex={readOnly ? -1 : 0}
						disabled={disabled}
						onClick={() => handleClick(starIndex)}
						onMouseMove={(e) => handleMouseMove(starIndex, e)}
						className={cn(
							"relative outline-none transition-colors",
							!readOnly && !disabled && "cursor-pointer",
							"focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:rounded-sm"
						)}
					>
						{halfFilled ? (
							<span className="relative">
								<StarIcon
									className={cn(sizeClasses[size], "text-fg-muted/30")}
									fill="currentColor"
								/>
								<span className="absolute inset-0 overflow-hidden w-1/2">
									<StarIcon
										className={cn(sizeClasses[size], "text-warning")}
										fill="currentColor"
									/>
								</span>
							</span>
						) : (
							<StarIcon
								className={cn(
									sizeClasses[size],
									filled ? "text-warning" : "text-fg-muted/30"
								)}
								fill="currentColor"
							/>
						)}
					</button>
				)
			})}
		</div>
	)
}

export { Rating }
