"use client"

import { Clock, Search } from "lucide-react"
import * as React from "react"
import type { NavigationSection } from "../../../types/navigation"
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "../../ui/command"
import { useCommandPalette } from "../../../hooks/use-command-palette"

export interface CommandPaletteProps {
	navigation: NavigationSection[]
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

/**
 * CommandPalette - Global command palette for quick navigation
 *
 * Features:
 * - Cmd/Ctrl + K to open
 * - Fuzzy search through navigation
 * - Recent items section
 * - Keyboard navigation
 *
 * @example
 * <CommandPalette navigation={navConfig} open={open} onOpenChange={setOpen} />
 */
export function CommandPalette({ navigation, open, onOpenChange }: CommandPaletteProps) {
	const { isOpen, setIsOpen, items, recentItems, navigate } = useCommandPalette({ navigation, open, onOpenChange })

	// Group items by section
	const groupedItems = React.useMemo(() => {
		const groups: Record<string, typeof items> = {}
		items.forEach((item) => {
			const section = item.section || "Other"
			if (!groups[section]) {
				groups[section] = []
			}
			groups[section].push(item)
		})
		return groups
	}, [items])

	return (
		<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
			<CommandInput placeholder="Search for pages..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>

				{/* Recent Items */}
				{recentItems.length > 0 && (
					<>
						<CommandGroup heading="Recent">
							{recentItems.map((item) => (
								<CommandItem key={item.id} value={item.title} onSelect={() => navigate(item)}>
									<Clock className="mr-2 h-4 w-4" />
									<span>{item.title}</span>
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator />
					</>
				)}

				{/* Navigation Items by Section */}
				{Object.entries(groupedItems).map(([section, sectionItems]) => (
					<CommandGroup key={section} heading={section}>
						{sectionItems.map((item) => (
							<CommandItem key={item.id} value={item.title} onSelect={() => navigate(item)}>
								<Search className="mr-2 h-4 w-4" />
								<span>{item.title}</span>
								<CommandShortcut>⏎</CommandShortcut>
							</CommandItem>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</CommandDialog>
	)
}
