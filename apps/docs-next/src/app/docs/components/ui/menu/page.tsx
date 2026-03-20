"use client"

import { use } from "react"
import {
	Menu,
	MenuCheckboxItem,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuPortal,
	MenuPositioner,
	MenuRadioGroup,
	MenuRadioItem,
	MenuSeparator,
	MenuTrigger,
} from "@blazz/ui/components/ui/menu"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import {
	MenuBasicDemo,
	MenuCheckboxDemo,
	MenuHeroDemo,
	MenuRadioDemo,
	MenuWithGroupsDemo,
} from "./menu-demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "menu-props", title: "Menu Props" },
	{ id: "menu-positioner-props", title: "MenuPositioner Props" },
	{ id: "design-tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "accessibility", title: "Accessibility" },
	{ id: "keyboard-shortcuts", title: "Keyboard Shortcuts" },
	{ id: "related", title: "Related" },
]

const menuProps: DocProp[] = [
	{ name: "open", type: "boolean", description: "Controlled open state." },
	{ name: "onOpenChange", type: "(open: boolean) => void", description: "Callback when open state changes." },
	{ name: "defaultOpen", type: "boolean", description: "Initial open state for uncontrolled usage." },
	{ name: "modal", type: "boolean", default: "true", description: "Restricts interaction outside menu when open." },
]

const menuPositionerProps: DocProp[] = [
	{ name: "side", type: "'top' | 'right' | 'bottom' | 'left'", default: "'bottom'", description: "Placement relative to trigger." },
	{ name: "align", type: "'start' | 'center' | 'end'", default: "'center'", description: "Alignment relative to trigger." },
	{ name: "sideOffset", type: "number", default: "0", description: "Distance from trigger in pixels." },
]

const examples = [
	{
		key: "basic",
		code: `<Menu>
  <MenuTrigger className="px-4 py-2 rounded-md bg-brand text-brand-fg">
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
</Menu>`,
	},
	{
		key: "with-groups",
		code: `<Menu>
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
</Menu>`,
	},
	{
		key: "checkbox",
		code: `const [notifications, setNotifications] = React.useState(true)
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
</Menu>`,
	},
	{
		key: "radio",
		code: `const [theme, setTheme] = React.useState("light")

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
</Menu>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

export default function MenuPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Menu"
			subtitle="An unstyled dropdown component with full keyboard navigation and accessibility."
			toc={toc}
		>
			<DocHero>
				<MenuHeroDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Menu" description="A simple menu with action items." code={examples[0].code} highlightedCode={html("basic")}>
					<MenuBasicDemo />
				</DocExampleClient>

				<DocExampleClient title="With Groups" description="Organize menu items into labeled groups." code={examples[1].code} highlightedCode={html("with-groups")}>
					<MenuWithGroupsDemo />
				</DocExampleClient>

				<DocExampleClient title="With Checkbox Items" description="Menu items with checkbox toggles." code={examples[2].code} highlightedCode={html("checkbox")}>
					<MenuCheckboxDemo />
				</DocExampleClient>

				<DocExampleClient title="With Radio Items" description="Menu items with radio selection." code={examples[3].code} highlightedCode={html("radio")}>
					<MenuRadioDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="menu-props" title="Menu Props">
				<DocPropsTable props={menuProps} />
			</DocSection>

			<DocSection id="menu-positioner-props" title="MenuPositioner Props">
				<DocPropsTable props={menuPositionerProps} />
			</DocSection>

			<DocSection id="design-tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">Menu uses the design system tokens for consistent styling:</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li><code className="text-xs">bg-surface-3</code> - Menu background color</li>
					<li><code className="text-xs">text-fg</code> - Menu text color</li>
					<li><code className="text-xs">bg-brand/10</code> - Highlighted item background</li>
					<li><code className="text-xs">border</code> - Menu border color</li>
					<li><code className="text-xs">shadow-md</code> - Medium shadow for elevation</li>
					<li><code className="text-xs">rounded-md</code> - Medium border radius (0.375rem)</li>
				</ul>
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Keep menu items concise and action-oriented</li>
					<li>Use MenuSeparator to group related actions logically</li>
					<li>Set closeOnClick=false for non-dismissing items (checkboxes)</li>
					<li>Provide visual feedback for disabled items</li>
					<li>Use keyboard shortcuts alongside menu options when possible</li>
					<li>Limit nesting depth for better UX (max 2-3 levels)</li>
					<li>Use MenuGroup with MenuGroupLabel for organized sections</li>
					<li>Consider using DropdownMenu for styled menus with icons</li>
				</ul>
			</DocSection>

			<DocSection id="accessibility" title="Accessibility">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Full keyboard navigation with arrow keys</li>
					<li>Enter/Space to select items</li>
					<li>Escape to close menu</li>
					<li>Roving focus pattern for efficient navigation</li>
					<li>Text-based item matching (type to search)</li>
					<li>Screen reader compatible with proper ARIA attributes</li>
					<li>Focus management when menu opens/closes</li>
				</ul>
			</DocSection>

			<DocSection id="keyboard-shortcuts" title="Keyboard Shortcuts">
				<div className="rounded-lg border">
					<table className="w-full text-sm">
						<thead className="border-b bg-surface-3/50">
							<tr>
								<th className="p-3 text-left font-medium">Key</th>
								<th className="p-3 text-left font-medium">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							<tr><td className="p-3 font-mono text-xs">&#8593; &#8595;</td><td className="p-3 text-fg-muted">Navigate between items</td></tr>
							<tr><td className="p-3 font-mono text-xs">Enter / Space</td><td className="p-3 text-fg-muted">Select item</td></tr>
							<tr><td className="p-3 font-mono text-xs">Esc</td><td className="p-3 text-fg-muted">Close menu</td></tr>
							<tr><td className="p-3 font-mono text-xs">Home / End</td><td className="p-3 text-fg-muted">Jump to first/last item</td></tr>
							<tr><td className="p-3 font-mono text-xs">Type</td><td className="p-3 text-fg-muted">Jump to item by text</td></tr>
						</tbody>
					</table>
				</div>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{ title: "Dropdown Menu", href: "/docs/components/ui/dropdown-menu", description: "Pre-styled dropdown menu with icons, shortcuts, and variants." },
						{ title: "Popover", href: "/docs/components/ui/popover", description: "Floating container for rich content anchored to a trigger." },
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
