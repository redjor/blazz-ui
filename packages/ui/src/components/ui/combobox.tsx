"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../lib/utils"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface ComboboxOption {
	value: string
	label: string
	description?: string
	avatar?: string
	icon?: React.ReactNode
	suggested?: boolean
}

export interface ComboboxProps {
	value?: string
	onValueChange?: (value: string) => void
	options: ComboboxOption[]
	placeholder?: string
	searchPlaceholder?: string
	emptyMessage?: string
	className?: string
	icon?: React.ReactNode
	searchable?: boolean
	iconTrigger?: boolean
}

export function Combobox({
	value,
	onValueChange,
	options,
	placeholder = "Select...",
	searchPlaceholder = "Search...",
	emptyMessage = "No results found.",
	className,
	icon,
	searchable = false,
	iconTrigger = false,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false)

	const selectedOption = options.find((option) => option.value === value)
	const hasRichOptions = options.some((o) => o.avatar || o.description || o.icon)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			{iconTrigger ? (
				<PopoverTrigger
					className={cn(
						"focus-visible:border-brand focus-visible:ring-brand/20 border-field bg-surface hover:bg-raised hover:text-fg aria-expanded:bg-raised aria-expanded:text-fg rounded-lg border bg-clip-padding focus-visible:ring-[3px] inline-flex items-center justify-center transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none select-none size-8",
						className
					)}
					role="combobox"
					aria-expanded={open}
					aria-label={selectedOption?.label ?? placeholder}
				>
					{selectedOption?.icon ?? icon}
				</PopoverTrigger>
			) : (
				<PopoverTrigger
					className={cn(
						"focus-visible:border-brand focus-visible:ring-brand/20 border-field bg-surface hover:bg-raised hover:text-fg aria-expanded:bg-raised aria-expanded:text-fg rounded-lg border bg-clip-padding text-sm font-medium focus-visible:ring-[3px] inline-flex items-center justify-between whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none select-none gap-1.5 px-2.5 w-full",
						hasRichOptions ? "h-10" : "h-8",
						className
					)}
					role="combobox"
					aria-expanded={open}
				>
					<span className="flex items-center gap-2 truncate">
						{icon}
						{selectedOption?.avatar && (
							<img
								src={selectedOption.avatar}
								alt=""
								className="size-6 shrink-0 rounded-full object-cover"
							/>
						)}
						{selectedOption?.icon}
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</PopoverTrigger>
			)}
			<PopoverContent
				className={cn("p-0", iconTrigger ? "w-48" : "w-(--radix-popover-trigger-width)")}
				align="start"
			>
				<Command>
					{searchable && <CommandInput placeholder={searchPlaceholder} />}
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label}
									onSelect={() => {
										onValueChange?.(option.value === value ? "" : option.value)
										setOpen(false)
									}}
									className={cn("gap-2.5", hasRichOptions && "py-2")}
								>
									{option.avatar && (
										<img
											src={option.avatar}
											alt=""
											className="size-8 shrink-0 rounded-full object-cover"
										/>
									)}
									{option.icon}
									<div className="flex-1 truncate">
										<span className={cn(option.description && "font-medium")}>{option.label}</span>
										{option.description && (
											<p className="text-xs text-fg-muted truncate">{option.description}</p>
										)}
									</div>
									<Check
										className={cn(
											"ml-auto h-4 w-4 shrink-0",
											value === option.value ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
