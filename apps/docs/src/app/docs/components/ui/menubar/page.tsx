"use client"

import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@blazz/ui/components/ui/menubar"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { MenubarCheckboxDemo, MenubarHeroDemo, MenubarRadioDemo } from "./menubar-demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "menubar-props", title: "Menubar Props" },
	{ id: "menubar-content-props", title: "MenubarContent Props" },
	{ id: "menubar-item-props", title: "MenubarItem Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const menubarProps: DocProp[] = [
	{ name: "children", type: "React.ReactNode", required: true, description: "MenubarMenu elements to render in the bar." },
	{ name: "className", type: "string", description: "Additional CSS classes for the menubar container." },
]

const menubarContentProps: DocProp[] = [
	{ name: "align", type: "'start' | 'center' | 'end'", default: "'start'", description: "Alignment relative to the trigger." },
	{ name: "alignOffset", type: "number", default: "-4", description: "Offset from the alignment edge." },
	{ name: "sideOffset", type: "number", default: "8", description: "Distance from the trigger." },
]

const menubarItemProps: DocProp[] = [
	{ name: "inset", type: "boolean", description: "Adds left padding for alignment with checkbox/radio items." },
	{ name: "variant", type: "'default' | 'destructive'", default: "'default'", description: "Visual variant of the item." },
	{ name: "disabled", type: "boolean", description: "Disables the menu item." },
]

const examples = [
	{
		key: "basic",
		code: `<Menubar>
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
</Menubar>`,
	},
	{
		key: "checkbox",
		code: `const [showBookmarks, setShowBookmarks] = React.useState(true)
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
</Menubar>`,
	},
	{
		key: "radio",
		code: `const [profile, setProfile] = React.useState("default")

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
</Menubar>`,
	},
	{
		key: "submenu",
		code: `<Menubar>
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
</Menubar>`,
	},
	{
		key: "full",
		code: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarGroup>
        <MenubarItem>New Tab <MenubarShortcut>\u2318T</MenubarShortcut></MenubarItem>
        <MenubarItem>New Window <MenubarShortcut>\u2318N</MenubarShortcut></MenubarItem>
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
      <MenubarItem>Print... <MenubarShortcut>\u2318P</MenubarShortcut></MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Undo <MenubarShortcut>\u2318Z</MenubarShortcut></MenubarItem>
      <MenubarItem>Redo <MenubarShortcut>\u21E7\u2318Z</MenubarShortcut></MenubarItem>
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
</Menubar>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

export default function MenubarPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Menubar" subtitle="A horizontal menu bar with multiple dropdown menus, commonly used for application toolbars." toc={toc}>
			<DocHero>
				<MenubarHeroDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Menubar" description="A horizontal menu bar with File, Edit and View menus." code={examples[0].code} highlightedCode={html("basic")}>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>
									New Tab<MenubarShortcut>&#8984;T</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									New Window<MenubarShortcut>&#8984;N</MenubarShortcut>
								</MenubarItem>
								<MenubarSeparator />
								<MenubarItem>
									Print...<MenubarShortcut>&#8984;P</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>Edit</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>
									Undo<MenubarShortcut>&#8984;Z</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Redo<MenubarShortcut>&#8679;&#8984;Z</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExampleClient>

				<DocExampleClient title="With Checkbox Items" description="Toggle visibility options with checkbox items." code={examples[1].code} highlightedCode={html("checkbox")}>
					<MenubarCheckboxDemo />
				</DocExampleClient>

				<DocExampleClient title="With Radio Items" description="Single selection with radio items in a group." code={examples[2].code} highlightedCode={html("radio")}>
					<MenubarRadioDemo />
				</DocExampleClient>

				<DocExampleClient title="With Submenu" description="Nested submenu for hierarchical navigation." code={examples[3].code} highlightedCode={html("submenu")}>
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
									Print...<MenubarShortcut>&#8984;P</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</DocExampleClient>

				<DocExampleClient title="Full Application Menubar" description="Complete menubar with groups, shortcuts, submenus and all item types." code={examples[4].code} highlightedCode={html("full")}>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>File</MenubarTrigger>
							<MenubarContent>
								<MenubarGroup>
									<MenubarItem>
										New Tab<MenubarShortcut>&#8984;T</MenubarShortcut>
									</MenubarItem>
									<MenubarItem>
										New Window<MenubarShortcut>&#8984;N</MenubarShortcut>
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
									Print...<MenubarShortcut>&#8984;P</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
						<MenubarMenu>
							<MenubarTrigger>Edit</MenubarTrigger>
							<MenubarContent>
								<MenubarItem>
									Undo<MenubarShortcut>&#8984;Z</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Redo<MenubarShortcut>&#8679;&#8984;Z</MenubarShortcut>
								</MenubarItem>
								<MenubarSeparator />
								<MenubarItem>
									Find<MenubarShortcut>&#8984;F</MenubarShortcut>
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
				</DocExampleClient>
			</DocSection>

			<DocSection id="menubar-props" title="Menubar Props">
				<DocPropsTable props={menubarProps} />
			</DocSection>
			<DocSection id="menubar-content-props" title="MenubarContent Props">
				<DocPropsTable props={menubarContentProps} />
			</DocSection>
			<DocSection id="menubar-item-props" title="MenubarItem Props">
				<DocPropsTable props={menubarItemProps} />
			</DocSection>

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

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{ title: "Dropdown Menu", href: "/docs/components/ui/dropdown-menu", description: "Pre-styled dropdown menu with icons, shortcuts, and variants." },
						{ title: "Menu", href: "/docs/components/ui/menu", description: "Unstyled dropdown with full keyboard navigation and accessibility." },
						{ title: "Nav Menu", href: "/docs/components/ui/nav-menu", description: "Navigation menu for site-level wayfinding." },
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
