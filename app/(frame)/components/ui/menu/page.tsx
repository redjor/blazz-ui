"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import {
	Menu,
	MenuTrigger,
	MenuPortal,
	MenuPositioner,
	MenuPopup,
	MenuItem,
	MenuSeparator,
	MenuGroup,
	MenuGroupLabel,
	MenuRadioGroup,
	MenuRadioItem,
	MenuCheckboxItem,
} from "@/components/ui/menu"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

const menuProps = [
	{
		name: "open",
		type: "boolean",
		description: "Controlled open state.",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Callback when open state changes.",
	},
	{
		name: "defaultOpen",
		type: "boolean",
		description: "Initial open state for uncontrolled usage.",
	},
	{
		name: "modal",
		type: "boolean",
		default: "true",
		description: "Restricts interaction outside menu when open.",
	},
]

const menuPositionerProps = [
	{
		name: "side",
		type: "'top' | 'right' | 'bottom' | 'left'",
		default: "'bottom'",
		description: "Placement relative to trigger.",
	},
	{
		name: "align",
		type: "'start' | 'center' | 'end'",
		default: "'center'",
		description: "Alignment relative to trigger.",
	},
	{
		name: "sideOffset",
		type: "number",
		default: "0",
		description: "Distance from trigger in pixels.",
	},
]

export default function MenuPage() {
	const [notifications, setNotifications] = React.useState(true)
	const [autoSave, setAutoSave] = React.useState(false)
	const [theme, setTheme] = React.useState("light")

	return (
		<Page
			title="Menu"
			subtitle="An unstyled dropdown component with full keyboard navigation and accessibility."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Menu"
					description="A simple menu with action items."
					code={`<Menu>
  <MenuTrigger className="px-4 py-2 rounded-md bg-primary text-white">
    Open Menu
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner sideOffset={8}>
      <MenuPopup>
        <MenuItem onClick={() => console.log('New')}>
          New File
        </MenuItem>
        <MenuItem onClick={() => console.log('Open')}>
          Open...
        </MenuItem>
        <MenuItem onClick={() => console.log('Save')}>
          Save
        </MenuItem>
        <MenuSeparator />
        <MenuItem onClick={() => console.log('Exit')}>
          Exit
        </MenuItem>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>`}
				>
					<Menu>
						<MenuTrigger className="px-4 py-2 rounded-md bg-primary text-white">
							Open Menu
						</MenuTrigger>
						<MenuPortal>
							<MenuPositioner sideOffset={8}>
								<MenuPopup>
									<MenuItem onClick={() => console.log('New')}>
										New File
									</MenuItem>
									<MenuItem onClick={() => console.log('Open')}>
										Open...
									</MenuItem>
									<MenuItem onClick={() => console.log('Save')}>
										Save
									</MenuItem>
									<MenuSeparator />
									<MenuItem onClick={() => console.log('Exit')}>
										Exit
									</MenuItem>
								</MenuPopup>
							</MenuPositioner>
						</MenuPortal>
					</Menu>
				</ComponentExample>

				{/* With Groups */}
				<ComponentExample
					title="With Groups"
					description="Organize menu items into labeled groups."
					code={`<Menu>
  <MenuTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-md border">
    Account
    <ChevronDown className="h-4 w-4" />
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner sideOffset={8}>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>My Account</MenuGroupLabel>
          <MenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </MenuItem>
          <MenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </MenuItem>
        </MenuGroup>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>`}
				>
					<Menu>
						<MenuTrigger className="inline-flex items-center gap-2 px-4 py-2 rounded-md border">
							Account
							<ChevronDown className="h-4 w-4" />
						</MenuTrigger>
						<MenuPortal>
							<MenuPositioner sideOffset={8}>
								<MenuPopup>
									<MenuGroup>
										<MenuGroupLabel>My Account</MenuGroupLabel>
										<MenuItem>
											<User className="mr-2 h-4 w-4" />
											Profile
										</MenuItem>
										<MenuItem>
											<Settings className="mr-2 h-4 w-4" />
											Settings
										</MenuItem>
									</MenuGroup>
									<MenuSeparator />
									<MenuGroup>
										<MenuItem>
											<LogOut className="mr-2 h-4 w-4" />
											Log out
										</MenuItem>
									</MenuGroup>
								</MenuPopup>
							</MenuPositioner>
						</MenuPortal>
					</Menu>
				</ComponentExample>

				{/* With Checkbox Items */}
				<ComponentExample
					title="With Checkbox Items"
					description="Menu items with checkbox toggles."
					code={`const [notifications, setNotifications] = React.useState(true)
const [autoSave, setAutoSave] = React.useState(false)

<Menu>
  <MenuTrigger className="px-4 py-2 rounded-md border">
    Settings
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner sideOffset={8}>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Preferences</MenuGroupLabel>
          <MenuCheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Enable Notifications
          </MenuCheckboxItem>
          <MenuCheckboxItem
            checked={autoSave}
            onCheckedChange={setAutoSave}
          >
            Auto-save
          </MenuCheckboxItem>
        </MenuGroup>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>`}
				>
					<Menu>
						<MenuTrigger className="px-4 py-2 rounded-md border">
							Settings
						</MenuTrigger>
						<MenuPortal>
							<MenuPositioner sideOffset={8}>
								<MenuPopup>
									<MenuGroup>
										<MenuGroupLabel>Preferences</MenuGroupLabel>
										<MenuCheckboxItem
											checked={notifications}
											onCheckedChange={setNotifications}
										>
											Enable Notifications
										</MenuCheckboxItem>
										<MenuCheckboxItem
											checked={autoSave}
											onCheckedChange={setAutoSave}
										>
											Auto-save
										</MenuCheckboxItem>
									</MenuGroup>
								</MenuPopup>
							</MenuPositioner>
						</MenuPortal>
					</Menu>
				</ComponentExample>

				{/* With Radio Items */}
				<ComponentExample
					title="With Radio Items"
					description="Menu items with radio selection."
					code={`const [theme, setTheme] = React.useState("light")

<Menu>
  <MenuTrigger className="px-4 py-2 rounded-md border">
    Theme: {theme}
  </MenuTrigger>
  <MenuPortal>
    <MenuPositioner sideOffset={8}>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Choose Theme</MenuGroupLabel>
          <MenuRadioGroup value={theme} onValueChange={setTheme}>
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
            <MenuRadioItem value="system">System</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
      </MenuPopup>
    </MenuPositioner>
  </MenuPortal>
</Menu>`}
				>
					<Menu>
						<MenuTrigger className="px-4 py-2 rounded-md border">
							Theme: {theme}
						</MenuTrigger>
						<MenuPortal>
							<MenuPositioner sideOffset={8}>
								<MenuPopup>
									<MenuGroup>
										<MenuGroupLabel>Choose Theme</MenuGroupLabel>
										<MenuRadioGroup value={theme} onValueChange={setTheme}>
											<MenuRadioItem value="light">Light</MenuRadioItem>
											<MenuRadioItem value="dark">Dark</MenuRadioItem>
											<MenuRadioItem value="system">System</MenuRadioItem>
										</MenuRadioGroup>
									</MenuGroup>
								</MenuPopup>
							</MenuPositioner>
						</MenuPortal>
					</Menu>
				</ComponentExample>

				{/* Props Tables */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Menu Props</h2>
					<PropsTable props={menuProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">MenuPositioner Props</h2>
					<PropsTable props={menuPositionerProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Menu uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-popover</code> - Menu background color
						</li>
						<li>
							<code className="text-xs">text-popover-foreground</code> - Menu text color
						</li>
						<li>
							<code className="text-xs">bg-accent</code> - Highlighted item background
						</li>
						<li>
							<code className="text-xs">text-accent-foreground</code> - Highlighted item text
						</li>
						<li>
							<code className="text-xs">border</code> - Menu border color
						</li>
						<li>
							<code className="text-xs">shadow-md</code> - Medium shadow for elevation
						</li>
						<li>
							<code className="text-xs">rounded-md</code> - Medium border radius (0.375rem)
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Keep menu items concise and action-oriented</li>
						<li>Use MenuSeparator to group related actions logically</li>
						<li>Set closeOnClick=false for non-dismissing items (checkboxes)</li>
						<li>Provide visual feedback for disabled items</li>
						<li>Use keyboard shortcuts alongside menu options when possible</li>
						<li>Limit nesting depth for better UX (max 2-3 levels)</li>
						<li>Use MenuGroup with MenuGroupLabel for organized sections</li>
						<li>Consider using DropdownMenu for styled menus with icons</li>
					</ul>
				</section>

				{/* Accessibility */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Accessibility</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Full keyboard navigation with arrow keys</li>
						<li>Enter/Space to select items</li>
						<li>Escape to close menu</li>
						<li>Roving focus pattern for efficient navigation</li>
						<li>Text-based item matching (type to search)</li>
						<li>Screen reader compatible with proper ARIA attributes</li>
						<li>Focus management when menu opens/closes</li>
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
									<td className="p-3 font-mono text-xs">↑ ↓</td>
									<td className="p-3 text-muted-foreground">Navigate between items</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Enter / Space</td>
									<td className="p-3 text-muted-foreground">Select item</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Esc</td>
									<td className="p-3 text-muted-foreground">Close menu</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Home / End</td>
									<td className="p-3 text-muted-foreground">Jump to first/last item</td>
								</tr>
								<tr>
									<td className="p-3 font-mono text-xs">Type</td>
									<td className="p-3 text-muted-foreground">Jump to item by text</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</Page>
	)
}
