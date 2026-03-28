"use client"

import { Clock, FileText, Search } from "lucide-react"
import * as React from "react"
import { useCommandPalette } from "../../../hooks/use-command-palette"
import type { NavigationSection } from "../../../types/navigation"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../ui/command"

export interface CommandPaletteProps {
	navigation: NavigationSection[]
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ navigation, open, onOpenChange }: CommandPaletteProps) {
	const { isOpen, setIsOpen, items, recentItems, navigate } = useCommandPalette({
		navigation,
		open,
		onOpenChange,
	})

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
		<CommandDialog open={isOpen} onOpenChange={setIsOpen} size="xl">
			<CommandInput placeholder="Search components, blocks, AI..." />
			<CommandList>
				<CommandEmpty>
					<div className="flex flex-col items-center gap-2 py-4">
						<Search className="h-10 w-10 text-fg-muted/40" />
						<p className="text-sm text-fg-muted">No results found.</p>
						<p className="text-xs text-fg-subtle">Try a different keyword or alias.</p>
					</div>
				</CommandEmpty>

				{/* Recent Items */}
				{recentItems.length > 0 && (
					<>
						<CommandGroup heading="Recent">
							{recentItems.map((item) => (
								<CommandItem key={`recent-${item.id}`} value={`recent:${item.title}`} keywords={item.keywords} onSelect={() => navigate(item)}>
									<Clock className="mr-2 h-4 w-4 shrink-0 text-fg-subtle" />
									<div className="flex min-w-0 flex-1 items-center justify-between gap-2">
										<span className="truncate">{item.title}</span>
										{item.breadcrumb && <span className="shrink-0 text-xs text-fg-subtle">{item.breadcrumb}</span>}
									</div>
								</CommandItem>
							))}
						</CommandGroup>
						<CommandSeparator />
					</>
				)}

				{/* Navigation Items by Section */}
				{Object.entries(groupedItems).map(([section, sectionItems]) => (
					<CommandGroup key={section} heading={section}>
						{sectionItems.map((item) => {
							const Icon = item.icon || FileText
							return (
								<CommandItem key={item.id} value={item.title} keywords={item.keywords} onSelect={() => navigate(item)}>
									<Icon className="mr-2 h-4 w-4 shrink-0 text-fg-subtle" />
									<div className="flex min-w-0 flex-1 items-center justify-between gap-2">
										<span className="truncate">{item.title}</span>
										{item.breadcrumb && <span className="shrink-0 text-xs text-fg-subtle">{item.breadcrumb}</span>}
									</div>
								</CommandItem>
							)
						})}
					</CommandGroup>
				))}
			</CommandList>
		</CommandDialog>
	)
}
