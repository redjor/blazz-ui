"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command"
import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	User,
	Smile,
	Search,
} from "lucide-react"

const commandProps = [
	{
		name: "value",
		type: "string",
		description: "Controlled selected value.",
	},
	{
		name: "onValueChange",
		type: "(value: string) => void",
		description: "Callback when selected value changes.",
	},
	{
		name: "filter",
		type: "(value: string, search: string) => number",
		description: "Custom filter function for items.",
	},
	{
		name: "shouldFilter",
		type: "boolean",
		default: "true",
		description: "Whether to filter items based on search.",
	},
]

const commandItemProps = [
	{
		name: "value",
		type: "string",
		description: "Value of the item for selection and filtering.",
	},
	{
		name: "onSelect",
		type: "(value: string) => void",
		description: "Callback when item is selected.",
	},
	{
		name: "disabled",
		type: "boolean",
		description: "Disables the item.",
	},
]

export default function CommandPage() {
	const [open, setOpen] = React.useState(false)

	// Toggle command dialog with Cmd+K
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
		<Page
			title="Command"
			subtitle="Fast, composable, unstyled command menu for React."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Command"
					description="A simple command menu with search and grouped items."
					code={`<Command className="rounded-lg border shadow-md">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>
        <Calendar className="mr-2 h-4 w-4" />
        <span>Calendar</span>
      </CommandItem>
      <CommandItem>
        <Smile className="mr-2 h-4 w-4" />
        <span>Search Emoji</span>
      </CommandItem>
      <CommandItem>
        <Calculator className="mr-2 h-4 w-4" />
        <span>Calculator</span>
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
        <CommandShortcut>⌘P</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <CreditCard className="mr-2 h-4 w-4" />
        <span>Billing</span>
        <CommandShortcut>⌘B</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
        <CommandShortcut>⌘S</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`}
				>
					<Command className="rounded-lg border shadow-md">
						<CommandInput placeholder="Type a command or search..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup heading="Suggestions">
								<CommandItem>
									<Calendar className="mr-2 h-4 w-4" />
									<span>Calendar</span>
								</CommandItem>
								<CommandItem>
									<Smile className="mr-2 h-4 w-4" />
									<span>Search Emoji</span>
								</CommandItem>
								<CommandItem>
									<Calculator className="mr-2 h-4 w-4" />
									<span>Calculator</span>
								</CommandItem>
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup heading="Settings">
								<CommandItem>
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
									<CommandShortcut>⌘P</CommandShortcut>
								</CommandItem>
								<CommandItem>
									<CreditCard className="mr-2 h-4 w-4" />
									<span>Billing</span>
									<CommandShortcut>⌘B</CommandShortcut>
								</CommandItem>
								<CommandItem>
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
									<CommandShortcut>⌘S</CommandShortcut>
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</ComponentExample>

				{/* Dialog Example */}
				<ComponentExample
					title="Command Dialog"
					description="Open command menu in a modal dialog with keyboard shortcut."
					code={`const [open, setOpen] = React.useState(false)

// Toggle with Cmd+K
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

<>
  <p className="text-sm text-muted-foreground">
    Press{" "}
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
      <span className="text-xs">⌘</span>K
    </kbd>
  </p>
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
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</>`}
				>
					<div>
						<p className="text-sm text-muted-foreground mb-4">
							Press{" "}
							<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
								<span className="text-xs">⌘</span>K
							</kbd>
							{" "}to open
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
				</ComponentExample>

				{/* Props Tables */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Command Props</h2>
					<PropsTable props={commandProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">CommandItem Props</h2>
					<PropsTable props={commandItemProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Command uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-popover</code> - Command background color
						</li>
						<li>
							<code className="text-xs">text-popover-foreground</code> - Command text color
						</li>
						<li>
							<code className="text-xs">bg-accent</code> - Selected item background
						</li>
						<li>
							<code className="text-xs">text-accent-foreground</code> - Selected item text
						</li>
						<li>
							<code className="text-xs">text-muted-foreground</code> - Group headings and shortcuts
						</li>
						<li>
							<code className="text-xs">border</code> - Command border color
						</li>
						<li>
							<code className="text-xs">shadow-md</code> - Medium shadow for elevation
						</li>
						<li>
							<code className="text-xs">rounded-md</code> - Medium border radius
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use CommandDialog for global command palettes with ⌘K shortcut</li>
						<li>Group related commands together with CommandGroup</li>
						<li>Provide clear, action-oriented labels for commands</li>
						<li>Include CommandShortcut hints for frequently used actions</li>
						<li>Always include CommandEmpty to handle no results gracefully</li>
						<li>Use icons to make commands more scannable</li>
						<li>Keep the command list focused - avoid too many options</li>
						<li>Consider custom filtering for better search results</li>
					</ul>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Full keyboard navigation with arrow keys</li>
						<li>Type-ahead search for quick item finding</li>
						<li>Enter to select current item</li>
						<li>Escape to close command menu</li>
						<li>Screen reader compatible with proper ARIA attributes</li>
						<li>Focus management when dialog opens/closes</li>
						<li>Disabled items properly marked and non-interactive</li>
					</ul>
				</section>

				{/* Keyboard Shortcuts */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
					<div className="rounded-lg border">
						<table className="w-full text-sm">
							<thead className="border-b bg-muted/50">
								<tr>
									<th className="p-3 text-left font-medium">Key</th>
									<th className="p-3 text-left font-medium">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								<tr>
									<td className="p-3 font-mono text-xs">⌘K / Ctrl+K</td>
									<td className="p-3 text-muted-foreground">Toggle command dialog</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">↑ ↓</td>
									<td className="p-3 text-muted-foreground">Navigate items</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Enter</td>
									<td className="p-3 text-muted-foreground">Select item</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Esc</td>
									<td className="p-3 text-muted-foreground">Close dialog</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Type</td>
									<td className="p-3 text-muted-foreground">Filter items</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</Page>
	)
}
