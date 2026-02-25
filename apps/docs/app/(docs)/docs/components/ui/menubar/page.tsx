"use client"

import * as React from "react"
import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "@/components/docs/doc-props-table"
import { DocRelated } from "@/components/docs/doc-related"
import {
	Menubar,
	MenubarMenu,
	MenubarTrigger,
	MenubarContent,
	MenubarItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarCheckboxItem,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSub,
	MenubarSubTrigger,
	MenubarSubContent,
	MenubarLabel,
	MenubarGroup,
} from "@blazz/ui/components/ui/menubar"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "menubar-props", title: "Menubar Props" },
	{ id: "menubar-content-props", title: "MenubarContent Props" },
	{ id: "menubar-item-props", title: "MenubarItem Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const menubarProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "MenubarMenu elements to render in the bar.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the menubar container.",
	},
]

const menubarContentProps: DocProp[] = [
	{
		name: "align",
		type: "'start' | 'center' | 'end'",
		default: "'start'",
		description: "Alignment relative to the trigger.",
	},
	{
		name: "alignOffset",
		type: "number",
		default: "-4",
		description: "Offset from the alignment edge.",
	},
	{
		name: "sideOffset",
		type: "number",
		default: "8",
		description: "Distance from the trigger.",
	},
]

const menubarItemProps: DocProp[] = [
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

export default function MenubarPage() {
	const [showBookmarks, setShowBookmarks] = React.useState(true)
	const [showFullUrls, setShowFullUrls] = React.useState(false)
	const [profile, setProfile] = React.useState("default")

	return (
		<DocPage
			title="Menubar"
			subtitle="A horizontal menu bar with multiple dropdown menus, commonly used for application toolbars."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Menubar>
					<MenubarMenu>
						<MenubarTrigger>File</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								New Tab
								<MenubarShortcut>&#8984;T</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								New Window
								<MenubarShortcut>&#8984;N</MenubarShortcut>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								Print...
								<MenubarShortcut>&#8984;P</MenubarShortcut>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger>Edit</MenubarTrigger>
						<MenubarContent>
							<MenubarItem>
								Undo
								<MenubarShortcut>&#8984;Z</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								Redo
								<MenubarShortcut>&#8679;&#8984;Z</MenubarShortcut>
							</MenubarItem>
							<MenubarSeparator />
							<MenubarItem>
								Cut
								<MenubarShortcut>&#8984;X</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								Copy
								<MenubarShortcut>&#8984;C</MenubarShortcut>
							</MenubarItem>
							<MenubarItem>
								Paste
								<MenubarShortcut>&#8984;V</MenubarShortcut>
							</MenubarItem>
						</MenubarContent>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger>View</MenubarTrigger>
						<MenubarContent>
							<MenubarCheckboxItem
								checked={showBookmarks}
								onCheckedChange={setShowBookmarks}
							>
								Show Bookmarks
							</MenubarCheckboxItem>
							<MenubarCheckboxItem
								checked={showFullUrls}
								onCheckedChange={setShowFullUrls}
							>
								Show Full URLs
							</MenubarCheckboxItem>
						</MenubarContent>
					</MenubarMenu>
				</Menubar>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic Menubar"
					description="A horizontal menu bar with File, Edit and View menus."
					code={`<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab
        <MenubarShortcut>\u2318T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        New Window
        <MenubarShortcut>\u2318N</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>
        Print...
        <MenubarShortcut>\u2318P</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Undo <MenubarShortcut>\u2318Z</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        Redo <MenubarShortcut>\u21E7\u2318Z</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
				>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>
									New Tab
									<MenubarShortcut>&#8984;T</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									New Window
									<MenubarShortcut>&#8984;N</MenubarShortcut>
								</MenubarItem>
								<MenubarSeparator />
								<MenubarItem>
									Print...
									<MenubarShortcut>&#8984;P</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>Edit</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>
									Undo
									<MenubarShortcut>&#8984;Z</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Redo
									<MenubarShortcut>&#8679;&#8984;Z</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExample>

				<DocExample
					title="With Checkbox Items"
					description="Toggle visibility options with checkbox items."
					code={`const [showBookmarks, setShowBookmarks] = React.useState(true)
const [showFullUrls, setShowFullUrls] = React.useState(false)

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem
        checked={showBookmarks}
        onCheckedChange={setShowBookmarks}
      >
        Show Bookmarks
      </MenubarCheckboxItem>
      <MenubarCheckboxItem
        checked={showFullUrls}
        onCheckedChange={setShowFullUrls}
      >
        Show Full URLs
      </MenubarCheckboxItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
				>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>View</MenubarTrigger>
							<MenubarContent>
								<MenubarCheckboxItem
									checked={showBookmarks}
									onCheckedChange={setShowBookmarks}
								>
									Show Bookmarks
								</MenubarCheckboxItem>
								<MenubarCheckboxItem
									checked={showFullUrls}
									onCheckedChange={setShowFullUrls}
								>
									Show Full URLs
								</MenubarCheckboxItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExample>

				<DocExample
					title="With Radio Items"
					description="Single selection with radio items in a group."
					code={`const [profile, setProfile] = React.useState("default")

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>Profiles</MenubarTrigger>
    <MenubarContent>
      <MenubarLabel>Switch Profile</MenubarLabel>
      <MenubarSeparator />
      <MenubarRadioGroup value={profile} onValueChange={setProfile}>
        <MenubarRadioItem value="default">Default</MenubarRadioItem>
        <MenubarRadioItem value="work">Work</MenubarRadioItem>
        <MenubarRadioItem value="personal">Personal</MenubarRadioItem>
      </MenubarRadioGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
				>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>Profiles</MenubarTrigger>
							<MenubarContent>
								<MenubarLabel>Switch Profile</MenubarLabel>
								<MenubarSeparator />
								<MenubarRadioGroup value={profile} onValueChange={setProfile}>
									<MenubarRadioItem value="default">Default</MenubarRadioItem>
									<MenubarRadioItem value="work">Work</MenubarRadioItem>
									<MenubarRadioItem value="personal">Personal</MenubarRadioItem>
								</MenubarRadioGroup>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExample>

				<DocExample
					title="With Submenu"
					description="Nested submenu for hierarchical navigation."
					code={`<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New File</MenubarItem>
      <MenubarSub>
        <MenubarSubTrigger>Share</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Email Link</MenubarItem>
          <MenubarItem>Copy Link</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Slack</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem>
        Print... <MenubarShortcut>\u2318P</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
				>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>New File</MenubarItem>
								<MenubarSub>
									<MenubarSubTrigger>Share</MenubarSubTrigger>
									<MenubarSubContent>
										<MenubarItem>Email Link</MenubarItem>
										<MenubarItem>Copy Link</MenubarItem>
										<MenubarSeparator />
										<MenubarItem>Slack</MenubarItem>
									</MenubarSubContent>
								</MenubarSub>
								<MenubarSeparator />
								<MenubarItem>
									Print...
									<MenubarShortcut>&#8984;P</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExample>

				<DocExample
					title="Full Application Menubar"
					description="Complete menubar with groups, shortcuts, submenus and all item types."
					code={`<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarGroup>
        <MenubarItem>
          New Tab <MenubarShortcut>\u2318T</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          New Window <MenubarShortcut>\u2318N</MenubarShortcut>
        </MenubarItem>
      </MenubarGroup>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Share</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Email Link</MenubarItem>
          <MenubarItem>Messages</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem>
        Print... <MenubarShortcut>\u2318P</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Undo <MenubarShortcut>\u2318Z</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        Redo <MenubarShortcut>\u21E7\u2318Z</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Find <MenubarShortcut>\u2318F</MenubarShortcut></MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
      <MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`}
				>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarGroup>
									<MenubarItem>
										New Tab
										<MenubarShortcut>&#8984;T</MenubarShortcut>
									</MenubarItem>
									<MenubarItem>
										New Window
										<MenubarShortcut>&#8984;N</MenubarShortcut>
									</MenubarItem>
								</MenubarGroup>
								<MenubarSeparator />
								<MenubarSub>
									<MenubarSubTrigger>Share</MenubarSubTrigger>
									<MenubarSubContent>
										<MenubarItem>Email Link</MenubarItem>
										<MenubarItem>Messages</MenubarItem>
									</MenubarSubContent>
								</MenubarSub>
								<MenubarSeparator />
								<MenubarItem>
									Print...
									<MenubarShortcut>&#8984;P</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>Edit</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>
									Undo
									<MenubarShortcut>&#8984;Z</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Redo
									<MenubarShortcut>&#8679;&#8984;Z</MenubarShortcut>
								</MenubarItem>
								<MenubarSeparator />
								<MenubarItem>
									Find
									<MenubarShortcut>&#8984;F</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>View</MenubarTrigger>
							<MenubarContent>
								<MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
								<MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExample>
			</DocSection>

			{/* Menubar Props */}
			<DocSection id="menubar-props" title="Menubar Props">
				<DocPropsTable props={menubarProps} />
			</DocSection>

			{/* MenubarContent Props */}
			<DocSection id="menubar-content-props" title="MenubarContent Props">
				<DocPropsTable props={menubarContentProps} />
			</DocSection>

			{/* MenubarItem Props */}
			<DocSection id="menubar-item-props" title="MenubarItem Props">
				<DocPropsTable props={menubarItemProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use consistent trigger labels across the menubar (File, Edit, View, Help)</li>
					<li>Group related actions with separators and labels</li>
					<li>Show keyboard shortcuts for frequently used actions</li>
					<li>Keep menu depth to 2 levels maximum for discoverability</li>
					<li>Use checkbox items for toggle settings, radio items for exclusive choices</li>
					<li>Place destructive actions at the bottom with a separator above</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Dropdown Menu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Pre-styled dropdown menu with icons, shortcuts, and variants.",
						},
						{
							title: "Menu",
							href: "/docs/components/ui/menu",
							description: "Unstyled dropdown with full keyboard navigation and accessibility.",
						},
						{
							title: "Nav Menu",
							href: "/docs/components/ui/nav-menu",
							description: "Navigation menu for site-level wayfinding.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
