"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { BellIcon, CreditCardIcon, DownloadIcon, EyeIcon, FileCodeIcon, FileIcon, FileTextIcon, FolderIcon, FolderOpenIcon, FolderSearchIcon, HelpCircleIcon, KeyboardIcon, LanguagesIcon, LayoutIcon, LogOutIcon, MailIcon, MonitorIcon, MoonIcon, MoreHorizontalIcon, PaletteIcon, SaveIcon, SettingsIcon, ShieldIcon, SunIcon, UserIcon } from "lucide-react"
import * as React from "react"

export function CheckboxItemsDemo() {
	const [showStatusBar, setShowStatusBar] = React.useState(true)
	const [showActivityBar, setShowActivityBar] = React.useState(false)
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Appearance</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>Status Bar</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem checked={showActivityBar} onCheckedChange={setShowActivityBar}>Activity Bar</DropdownMenuCheckboxItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function RadioItemsDemo() {
	const [position, setPosition] = React.useState("bottom")
	return (
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
		</DropdownMenu>
	)
}

export function ComplexDemo() {
	const [notifications, setNotifications] = React.useState({ email: true, sms: false, push: true })
	const [theme, setTheme] = React.useState("light")
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline">Complex Menu</Button>} />
			<DropdownMenuContent className="w-44">
				<DropdownMenuGroup>
					<DropdownMenuLabel>File</DropdownMenuLabel>
					<DropdownMenuItem><FileIcon />New File<DropdownMenuShortcut>⌘N</DropdownMenuShortcut></DropdownMenuItem>
					<DropdownMenuItem><FolderIcon />New Folder<DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut></DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger><FolderOpenIcon />Open Recent</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
									<DropdownMenuItem><FileCodeIcon />Project Alpha</DropdownMenuItem>
									<DropdownMenuItem><FileCodeIcon />Project Beta</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup><DropdownMenuItem><FolderSearchIcon />Browse...</DropdownMenuItem></DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem><SaveIcon />Save<DropdownMenuShortcut>⌘S</DropdownMenuShortcut></DropdownMenuItem>
					<DropdownMenuItem><DownloadIcon />Export<DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut></DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>View</DropdownMenuLabel>
					<DropdownMenuCheckboxItem checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked === true })}><EyeIcon />Show Sidebar</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem checked={notifications.sms} onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked === true })}><LayoutIcon />Show Status Bar</DropdownMenuCheckboxItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger><PaletteIcon />Theme</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel>Appearance</DropdownMenuLabel>
									<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
										<DropdownMenuRadioItem value="light"><SunIcon />Light</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="dark"><MoonIcon />Dark</DropdownMenuRadioItem>
										<DropdownMenuRadioItem value="system"><MonitorIcon />System</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuLabel>Account</DropdownMenuLabel>
					<DropdownMenuItem><UserIcon />Profile<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
					<DropdownMenuItem><CreditCardIcon />Billing</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger><SettingsIcon />Settings</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel>Preferences</DropdownMenuLabel>
									<DropdownMenuItem><KeyboardIcon />Keyboard Shortcuts</DropdownMenuItem>
									<DropdownMenuItem><LanguagesIcon />Language</DropdownMenuItem>
									<DropdownMenuSub>
										<DropdownMenuSubTrigger><BellIcon />Notifications</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent>
												<DropdownMenuGroup>
													<DropdownMenuLabel>Notification Types</DropdownMenuLabel>
													<DropdownMenuCheckboxItem checked={notifications.push} onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked === true })}><BellIcon />Push Notifications</DropdownMenuCheckboxItem>
													<DropdownMenuCheckboxItem checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked === true })}><MailIcon />Email Notifications</DropdownMenuCheckboxItem>
												</DropdownMenuGroup>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup><DropdownMenuItem><ShieldIcon />Privacy & Security</DropdownMenuItem></DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem><HelpCircleIcon />Help & Support</DropdownMenuItem>
					<DropdownMenuItem><FileTextIcon />Documentation</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive"><LogOutIcon />Sign Out<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut></DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
