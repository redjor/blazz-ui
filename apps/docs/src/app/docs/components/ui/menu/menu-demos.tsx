"use client"

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
import * as React from "react"

export function MenuHeroDemo() {
	return (
		<Menu>
			<MenuTrigger className="px-4 py-2 rounded-md bg-brand text-brand-fg">
				Open Menu
			</MenuTrigger>
			<MenuPortal>
				<MenuPositioner sideOffset={8}>
					<MenuPopup>
						<MenuItem>New File</MenuItem>
						<MenuItem>Open...</MenuItem>
						<MenuItem>Save</MenuItem>
						<MenuSeparator />
						<MenuItem>Exit</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</MenuPortal>
		</Menu>
	)
}

export function MenuBasicDemo() {
	return (
		<Menu>
			<MenuTrigger className="px-4 py-2 rounded-md bg-brand text-brand-fg">
				Open Menu
			</MenuTrigger>
			<MenuPortal>
				<MenuPositioner sideOffset={8}>
					<MenuPopup>
						<MenuItem onClick={() => console.log("New")}>New File</MenuItem>
						<MenuItem onClick={() => console.log("Open")}>Open...</MenuItem>
						<MenuItem onClick={() => console.log("Save")}>Save</MenuItem>
						<MenuSeparator />
						<MenuItem onClick={() => console.log("Exit")}>Exit</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</MenuPortal>
		</Menu>
	)
}

export function MenuWithGroupsDemo() {
	return (
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
	)
}

export function MenuCheckboxDemo() {
	const [notifications, setNotifications] = React.useState(true)
	const [autoSave, setAutoSave] = React.useState(false)

	return (
		<Menu>
			<MenuTrigger className="px-4 py-2 rounded-md border">Settings</MenuTrigger>
			<MenuPortal>
				<MenuPositioner sideOffset={8}>
					<MenuPopup>
						<MenuGroup>
							<MenuGroupLabel>Preferences</MenuGroupLabel>
							<MenuCheckboxItem checked={notifications} onCheckedChange={setNotifications}>
								Enable Notifications
							</MenuCheckboxItem>
							<MenuCheckboxItem checked={autoSave} onCheckedChange={setAutoSave}>
								Auto-save
							</MenuCheckboxItem>
						</MenuGroup>
					</MenuPopup>
				</MenuPositioner>
			</MenuPortal>
		</Menu>
	)
}

export function MenuRadioDemo() {
	const [theme, setTheme] = React.useState("light")

	return (
		<Menu>
			<MenuTrigger className="px-4 py-2 rounded-md border">Theme: {theme}</MenuTrigger>
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
	)
}
