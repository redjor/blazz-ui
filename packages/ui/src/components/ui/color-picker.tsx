"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface ColorPickerProps {
	value?: string
	onValueChange?: (value: string) => void
	/** Preset color options */
	presets?: string[]
	disabled?: boolean
	className?: string
	placeholder?: string
}

const defaultPresets = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#10b981",
	"#14b8a6",
	"#06b6d4",
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
	"#78716c",
	"#64748b",
	"#000000",
]

function ColorPicker({
	value = "",
	onValueChange,
	presets = defaultPresets,
	disabled = false,
	className,
	placeholder = "Pick a color",
}: ColorPickerProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				disabled={disabled}
				className={cn(
					"inline-flex h-8 items-center gap-2 rounded-md border border-edge bg-surface px-2.5 text-sm",
					"transition-colors hover:bg-surface-3 outline-none",
					"focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/20",
					"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
					className
				)}
			>
				<span
					className={cn("size-4 shrink-0 rounded-sm border border-edge", !value && "bg-surface-3")}
					style={value ? { backgroundColor: value } : undefined}
				/>
				<span className={cn("text-sm", value ? "text-fg" : "text-fg-muted")}>
					{value || placeholder}
				</span>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-3" align="start">
				<div className="space-y-3">
					<div className="grid grid-cols-5 gap-1.5">
						{presets.map((color) => (
							<button
								key={color}
								type="button"
								onClick={() => {
									onValueChange?.(color)
									setOpen(false)
								}}
								className={cn(
									"size-7 rounded-md border transition-all outline-none",
									"hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand/40",
									value === color ? "border-fg ring-2 ring-brand/40" : "border-transparent"
								)}
								style={{ backgroundColor: color }}
								aria-label={color}
							/>
						))}
					</div>
					<div className="flex items-center gap-2">
						<input
							type="color"
							value={value || "#000000"}
							onChange={(e) => onValueChange?.(e.target.value)}
							className="size-7 shrink-0 cursor-pointer rounded-md border border-edge bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-[5px] [&::-webkit-color-swatch]:border-none"
						/>
						<input
							type="text"
							value={value}
							onChange={(e) => onValueChange?.(e.target.value)}
							placeholder="#000000"
							className={cn(
								"flex-1 h-7 rounded-md border border-edge bg-surface px-2 text-xs text-fg",
								"outline-none focus:border-brand focus:ring-[3px] focus:ring-brand/20",
								"placeholder:text-fg-subtle"
							)}
						/>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export { ColorPicker }
