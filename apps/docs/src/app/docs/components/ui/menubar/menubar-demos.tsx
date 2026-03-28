"use client"

import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@blazz/ui/components/ui/menubar"
import * as React from "react"

export function MenubarHeroDemo() {
	const [showBookmarks, setShowBookmarks] = React.useState(true)
	const [showFullUrls, setShowFullUrls] = React.useState(false)

	return (
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
					<MenubarCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
						Show Bookmarks
					</MenubarCheckboxItem>
					<MenubarCheckboxItem checked={showFullUrls} onCheckedChange={setShowFullUrls}>
						Show Full URLs
					</MenubarCheckboxItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}

export function MenubarCheckboxDemo() {
	const [showBookmarks, setShowBookmarks] = React.useState(true)
	const [showFullUrls, setShowFullUrls] = React.useState(false)

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
						Show Bookmarks
					</MenubarCheckboxItem>
					<MenubarCheckboxItem checked={showFullUrls} onCheckedChange={setShowFullUrls}>
						Show Full URLs
					</MenubarCheckboxItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}

export function MenubarRadioDemo() {
	const [profile, setProfile] = React.useState("default")

	return (
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
	)
}
