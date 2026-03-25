"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@blazz/ui/components/ui/command"
import { Calculator, Calendar, Search, Settings, User } from "lucide-react"
import * as React from "react"

export function CommandDialogExample() {
	const [open, setOpen] = React.useState(false)

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}
		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	return (
		<div>
			<p className="text-sm text-fg-muted mb-4">
				Press{" "}
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-fg-muted opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>{" "}
				to open
			</p>
			<Button onClick={() => setOpen(true)}>Open Command</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem onSelect={() => setOpen(false)}>
							<Calendar className="mr-2 h-4 w-4" />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem onSelect={() => setOpen(false)}>
							<Search className="mr-2 h-4 w-4" />
							<span>Search</span>
						</CommandItem>
						<CommandItem onSelect={() => setOpen(false)}>
							<Calculator className="mr-2 h-4 w-4" />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem onSelect={() => setOpen(false)}>
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem onSelect={() => setOpen(false)}>
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</div>
	)
}
