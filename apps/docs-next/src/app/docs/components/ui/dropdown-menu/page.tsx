import { Button } from "@blazz/ui/components/ui/button"
import {
import { CheckboxItemsDemo, RadioItemsDemo, ComplexDemo } from "./demos"
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import {
	BellIcon,
	CreditCard,
	CreditCardIcon,
	DownloadIcon,
	EyeIcon,
	FileCodeIcon,
	FileIcon,
	FileTextIcon,
	FolderIcon,
	FolderOpenIcon,
	FolderSearchIcon,
	HelpCircleIcon,
	KeyboardIcon,
	LanguagesIcon,
	LayoutIcon,
	LogOut,
	LogOutIcon,
	Mail,
	MailIcon,
	MessageSquare,
	MonitorIcon,
	MoonIcon,
	MoreHorizontal,
	MoreHorizontalIcon,
	PaletteIcon,
	PlusCircle,
	SaveIcon,
	Settings,
	SettingsIcon,
	ShieldIcon,
	SunIcon,
	User,
	UserIcon,
	UserPlus,
} from "lucide-react"
import * as React from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "basic",
		code: `<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
  <DropdownMenuContent>
    <DropdownMenuGroup>
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
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
	},
	{
		key: "shortcuts",
		code: `<DropdownMenu>
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
</DropdownMenu>`,
	},
	{
		key: "checkbox",
		code: `const [showStatusBar, setShowStatusBar] = React.useState(true)
const [showActivityBar, setShowActivityBar] = React.useState(false)

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
  <DropdownMenuContent>
    <DropdownMenuGroup>
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
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
	},
	{
		key: "radio",
		code: `const [position, setPosition] = React.useState("bottom")

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Position</Button>} />
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
	},
	{
		key: "submenu",
		code: `<DropdownMenu>
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
</DropdownMenu>`,
	},
	{
		key: "icon-trigger",
		code: `<DropdownMenu>
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
</DropdownMenu>`,
	},
	{
		key: "complex",
		code: `const [notifications, setNotifications] = React.useState({
  email: true,
  sms: false,
  push: true,
})
const [theme, setTheme] = React.useState("light")

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline">Complex Menu</Button>} />
  <DropdownMenuContent className="w-44">
    <DropdownMenuGroup>
      <DropdownMenuLabel>File</DropdownMenuLabel>
      <DropdownMenuItem>
        <FileIcon />
        New File
        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FolderIcon />
        New Folder
        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderOpenIcon />
          Open Recent
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
              <DropdownMenuItem>
                <FileCodeIcon />
                Project Alpha
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileCodeIcon />
                Project Beta
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MoreHorizontalIcon />
                  More Projects
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <FileCodeIcon />
                      Project Gamma
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileCodeIcon />
                      Project Delta
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <FolderSearchIcon />
                Browse...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SaveIcon />
        Save
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <DownloadIcon />
        Export
        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>View</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={notifications.email}
        onCheckedChange={(checked) =>
          setNotifications({ ...notifications, email: checked === true })
        }
      >
        <EyeIcon />
        Show Sidebar
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={notifications.sms}
        onCheckedChange={(checked) =>
          setNotifications({ ...notifications, sms: checked === true })
        }
      >
        <LayoutIcon />
        Show Status Bar
      </DropdownMenuCheckboxItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <PaletteIcon />
          Theme
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  <SunIcon />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <MonitorIcon />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem>
        <UserIcon />
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCardIcon />
        Billing
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <SettingsIcon />
          Settings
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Preferences</DropdownMenuLabel>
              <DropdownMenuItem>
                <KeyboardIcon />
                Keyboard Shortcuts
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LanguagesIcon />
                Language
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BellIcon />
                  Notifications
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, push: checked === true })
                        }
                      >
                        <BellIcon />
                        Push Notifications
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked === true })
                        }
                      >
                        <MailIcon />
                        Email Notifications
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ShieldIcon />
                Privacy & Security
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <HelpCircleIcon />
        Help & Support
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FileTextIcon />
        Documentation
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem variant="destructive">
        <LogOutIcon />
        Sign Out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "dropdown-menu-props", title: "DropdownMenu Props" },
	{ id: "dropdown-menu-content-props", title: "DropdownMenuContent Props" },
	{ id: "dropdown-menu-item-props", title: "DropdownMenuItem Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const dropdownMenuProps: DocProp[] = [
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

const dropdownMenuContentProps: DocProp[] = [
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

const dropdownMenuItemProps: DocProp[] = [
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


export default async function DropdownMenuPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Dropdown Menu" subtitle="Displays a menu of actions in a dropdown." toc={toc}>
			<DocHero>
				<DropdownMenu>
					<DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Dropdown Menu"
					description="A simple dropdown menu with items."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
						<DropdownMenuContent>
							<DropdownMenuGroup>
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
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</DocExampleClient>

				<DocExampleClient
					title="With Keyboard Shortcuts"
					description="Display keyboard shortcuts for menu items."
					code={examples[1].code}
					highlightedCode={html("shortcuts")}
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
				</DocExampleClient>

				<DocExampleClient
					title="With Checkbox Items"
					description="Menu items with checkbox state."
					code={examples[2].code}
					highlightedCode={html("checkbox")}
				>
					<CheckboxItemsDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Radio Items"
					description="Menu items with radio selection."
					code={examples[3].code}
					highlightedCode={html("radio")}
				>
					<RadioItemsDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Submenu"
					description="Nested submenus for hierarchical options."
					code={examples[4].code}
					highlightedCode={html("submenu")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Icon Button Trigger"
					description="Use an icon button as the dropdown trigger."
					code={examples[5].code}
					highlightedCode={html("icon-trigger")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Complex Menu"
					description="A comprehensive menu combining submenus, checkbox items, radio items, shortcuts, and nested navigation."
					code={examples[6].code}
					highlightedCode={html("complex")}
				>
					<ComplexDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="dropdown-menu-props" title="DropdownMenu Props">
				<DocPropsTable props={dropdownMenuProps} />
			</DocSection>

			<DocSection id="dropdown-menu-content-props" title="DropdownMenuContent Props">
				<DocPropsTable props={dropdownMenuContentProps} />
			</DocSection>

			<DocSection id="dropdown-menu-item-props" title="DropdownMenuItem Props">
				<DocPropsTable props={dropdownMenuItemProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use render prop to avoid nested button issues</li>
					<li>Use labels and separators to organize related items</li>
					<li>Keep the menu concise - move complex options to submenus</li>
					<li>Use icons consistently to help users scan options</li>
					<li>Show keyboard shortcuts for frequently used actions</li>
					<li>Use the destructive variant for dangerous actions</li>
					<li>Consider alignment based on the trigger position</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Menu",
							href: "/docs/components/ui/menu",
							description: "Unstyled dropdown with full keyboard navigation and accessibility.",
						},
						{
							title: "Popover",
							href: "/docs/components/ui/popover",
							description: "Floating container for rich content anchored to a trigger.",
						},
						{
							title: "Button",
							href: "/docs/components/ui/button",
							description: "Button component commonly used as dropdown trigger.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
