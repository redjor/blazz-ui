"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import {
	User,
	CreditCard,
	Settings,
	LogOut,
	MoreHorizontal,
	Mail,
	MessageSquare,
	PlusCircle,
	UserPlus,
	Plus,
} from "lucide-react"

const dropdownMenuProps = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The dropdown menu trigger and content.",
	},
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
]

const dropdownMenuContentProps = [
	{
		name: "align",
		type: "'start' | 'center' | 'end'",
		default: "'start'",
		description: "Alignment relative to the trigger.",
	},
	{
		name: "side",
		type: "'top' | 'right' | 'bottom' | 'left'",
		default: "'bottom'",
		description: "Side to render the dropdown.",
	},
	{
		name: "sideOffset",
		type: "number",
		default: "4",
		description: "Distance from the trigger.",
	},
]

const dropdownMenuItemProps = [
	{
		name: "inset",
		type: "boolean",
		description: "Adds left padding for alignment with checkbox/radio items.",
	},
	{
		name: "variant",
		type: "'default' | 'destructive'",
		default: "'default'",
		description: "Visual variant of the item.",
	},
	{
		name: "disabled",
		type: "boolean",
		description: "Disables the menu item.",
	},
]

export default function DropdownMenuPage() {
	const [showStatusBar, setShowStatusBar] = React.useState(true)
	const [showActivityBar, setShowActivityBar] = React.useState(false)
	const [position, setPosition] = React.useState("bottom")

	return (
		<Page
			title="Dropdown Menu"
			subtitle="Displays a menu of actions in a dropdown."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Dropdown Menu"
					description="A simple dropdown menu with items."
					code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      <CreditCard className="mr-2 h-4 w-4" />
      Billing
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard className="mr-2 h-4 w-4" />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive">
								<LogOut className="mr-2 h-4 w-4" />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ComponentExample>

				{/* With Shortcuts */}
				<ComponentExample
					title="With Keyboard Shortcuts"
					description="Display keyboard shortcuts for menu items."
					code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Edit</Button>} />
  <DropdownMenuContent>
    <DropdownMenuItem>
      Undo
      <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Redo
      <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      Cut
      <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Copy
      <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      Paste
      <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline">Edit</Button>} />
						<DropdownMenuContent>
							<DropdownMenuItem>
								Undo
								<DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem>
								Redo
								<DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								Cut
								<DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem>
								Copy
								<DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem>
								Paste
								<DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ComponentExample>

				{/* Checkbox Items */}
				<ComponentExample
					title="With Checkbox Items"
					description="Menu items with checkbox state."
					code={`const [showStatusBar, setShowStatusBar] = React.useState(true)
const [showActivityBar, setShowActivityBar] = React.useState(false)

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
  <DropdownMenuContent>
    <DropdownMenuLabel>Appearance</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem
      checked={showStatusBar}
      onCheckedChange={setShowStatusBar}
    >
      Status Bar
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={showActivityBar}
      onCheckedChange={setShowActivityBar}
    >
      Activity Bar
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
						<DropdownMenuContent>
							<DropdownMenuLabel>Appearance</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem
								checked={showStatusBar}
								onCheckedChange={setShowStatusBar}
							>
								Status Bar
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								checked={showActivityBar}
								onCheckedChange={setShowActivityBar}
							>
								Activity Bar
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ComponentExample>

				{/* Radio Items */}
				<ComponentExample
					title="With Radio Items"
					description="Menu items with radio selection."
					code={`const [position, setPosition] = React.useState("bottom")

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Position</Button>} />
  <DropdownMenuContent>
    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
      <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline">Position</Button>} />
						<DropdownMenuContent>
							<DropdownMenuLabel>Panel Position</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
								<DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</ComponentExample>

				{/* With Submenu */}
				<ComponentExample
					title="With Submenu"
					description="Nested submenus for hierarchical options."
					code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        Profile
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite users
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            More...
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
						<DropdownMenuContent>
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<User className="mr-2 h-4 w-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<UserPlus className="mr-2 h-4 w-4" />
										Invite users
									</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										<DropdownMenuItem>
											<Mail className="mr-2 h-4 w-4" />
											Email
										</DropdownMenuItem>
										<DropdownMenuItem>
											<MessageSquare className="mr-2 h-4 w-4" />
											Message
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<PlusCircle className="mr-2 h-4 w-4" />
											More...
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</ComponentExample>

				{/* Icon Button Trigger */}
				<ComponentExample
					title="Icon Button Trigger"
					description="Use an icon button as the dropdown trigger."
					code={`<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    }
  />
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button variant="ghost" size="icon">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							}
						/>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<DropdownMenuItem>Duplicate</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ComponentExample>

				{/* Props Tables */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">DropdownMenu Props</h2>
					<PropsTable props={dropdownMenuProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">DropdownMenuContent Props</h2>
					<PropsTable props={dropdownMenuContentProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">DropdownMenuItem Props</h2>
					<PropsTable props={dropdownMenuItemProps} />
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use render prop to avoid nested button issues</li>
						<li>Use labels and separators to organize related items</li>
						<li>Keep the menu concise - move complex options to submenus</li>
						<li>Use icons consistently to help users scan options</li>
						<li>Show keyboard shortcuts for frequently used actions</li>
						<li>Use the destructive variant for dangerous actions</li>
						<li>Consider alignment based on the trigger position</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
