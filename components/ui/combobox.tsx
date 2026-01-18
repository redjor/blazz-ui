"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboboxOption {
	value: string
	label: string
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
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false)

	const selectedOption = options.find((option) => option.value === value)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className={cn(
					"focus-visible:border-ring focus-visible:ring-ring/50 border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground rounded-lg border bg-clip-padding text-sm font-medium focus-visible:ring-[3px] inline-flex items-center justify-between whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none select-none h-8 gap-1.5 px-2.5 w-full",
					className
				)}
				role="combobox"
				aria-expanded={open}
			>
				<span className="flex items-center gap-2">
					{icon}
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										onValueChange?.(currentValue === value ? "" : currentValue)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === option.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
