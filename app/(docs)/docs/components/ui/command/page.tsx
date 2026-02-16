"use client"

import * as React from "react"
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
import { DocSection } from "@/components/features/docs/doc-section"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "accessibility", title: "Accessibility" },
	{ id: "keyboard-shortcuts", title: "Keyboard Shortcuts" },
]

const commandProps: DocProp[] = [
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

const commandItemProps: DocProp[] = [
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

function CommandDialogExample() {
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
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-raised px-1.5 font-mono text-[10px] font-medium text-fg-muted opacity-100">
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
	)
}

export default function CommandPage() {
	return (
		<DocPage
			title="Command"
			subtitle="Fast, composable, unstyled command menu for React."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Command className="rounded-lg border shadow-md max-w-md">
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
						</CommandGroup>
					</CommandList>
				</Command>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
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
				</DocExample>

				<DocExample
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
  <p className="text-sm text-fg-muted">
    Press{" "}
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-raised px-1.5 font-mono text-[10px] font-medium text-fg-muted opacity-100">
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
					<CommandDialogExample />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable
					groups={[
						{ title: "Command", props: commandProps },
						{ title: "CommandItem", props: commandItemProps },
					]}
				/>
			</DocSection>

			{/* Design Tokens */}
			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Command uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-raised</code> - Command background color
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Command text color
					</li>
					<li>
						<code className="text-xs">bg-brand/10</code> - Selected item background
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Selected item text
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> - Group headings and shortcuts
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
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use CommandDialog for global command palettes with ⌘K shortcut</li>
					<li>Group related commands together with CommandGroup</li>
					<li>Provide clear, action-oriented labels for commands</li>
					<li>Include CommandShortcut hints for frequently used actions</li>
					<li>Always include CommandEmpty to handle no results gracefully</li>
					<li>Use icons to make commands more scannable</li>
					<li>Keep the command list focused - avoid too many options</li>
					<li>Consider custom filtering for better search results</li>
				</ul>
			</DocSection>

			{/* Accessibility */}
			<DocSection id="accessibility" title="Accessibility">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Full keyboard navigation with arrow keys</li>
					<li>Type-ahead search for quick item finding</li>
					<li>Enter to select current item</li>
					<li>Escape to close command menu</li>
					<li>Screen reader compatible with proper ARIA attributes</li>
					<li>Focus management when dialog opens/closes</li>
					<li>Disabled items properly marked and non-interactive</li>
				</ul>
			</DocSection>

			{/* Keyboard Shortcuts */}
			<DocSection id="keyboard-shortcuts" title="Keyboard Shortcuts">
				<div className="rounded-lg border">
					<table className="w-full text-sm">
						<thead className="border-b bg-raised/50">
							<tr>
								<th className="p-3 text-left font-medium">Key</th>
								<th className="p-3 text-left font-medium">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr>
								<td className="p-3 font-mono text-xs">⌘K / Ctrl+K</td>
								<td className="p-3 text-fg-muted">Toggle command dialog</td>
							</tr>
							<tr>
								<td className="p-3 font-mono text-xs">↑ ↓</td>
								<td className="p-3 text-fg-muted">Navigate items</td>
							</tr>
							<tr>
								<td className="p-3 font-mono text-xs">Enter</td>
								<td className="p-3 text-fg-muted">Select item</td>
							</tr>
							<tr>
								<td className="p-3 font-mono text-xs">Esc</td>
								<td className="p-3 text-fg-muted">Close dialog</td>
							</tr>
							<tr>
								<td className="p-3 font-mono text-xs">Type</td>
								<td className="p-3 text-fg-muted">Filter items</td>
							</tr>
						</tbody>
					</table>
				</div>
			</DocSection>
		</DocPage>
	)
}
