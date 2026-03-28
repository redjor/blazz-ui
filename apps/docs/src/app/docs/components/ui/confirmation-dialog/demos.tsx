"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { Archive, LogOut, Trash2 } from "lucide-react"
import * as React from "react"

export function DefaultExample() {
	const [open, setOpen] = React.useState(false)
	return (
		<div>
			<Button onClick={() => setOpen(true)}>Open Dialog</Button>
			<ConfirmationDialog
				open={open}
				onOpenChange={setOpen}
				title="Confirm Action"
				description="Are you sure you want to proceed with this action?"
				confirmLabel="Confirm"
				onConfirm={() => console.log("Confirmed")}
			/>
		</div>
	)
}

export function DestructiveExample() {
	const [open, setOpen] = React.useState(false)
	return (
		<div>
			<Button variant="destructive" onClick={() => setOpen(true)}>
				<Trash2 className="h-4 w-4 mr-2" />
				Delete
			</Button>
			<ConfirmationDialog
				open={open}
				onOpenChange={setOpen}
				title="Delete Item"
				description="Are you sure you want to delete this item? This action cannot be undone."
				confirmLabel="Delete"
				variant="destructive"
				onConfirm={() => console.log("Deleted")}
			/>
		</div>
	)
}

export function LogoutExample() {
	const [open, setOpen] = React.useState(false)
	return (
		<div>
			<Button variant="outline" onClick={() => setOpen(true)}>
				<LogOut className="h-4 w-4 mr-2" />
				Logout
			</Button>
			<ConfirmationDialog
				open={open}
				onOpenChange={setOpen}
				title="Logout"
				description="Are you sure you want to logout? Any unsaved changes will be lost."
				confirmLabel="Logout"
				cancelLabel="Stay logged in"
				onConfirm={() => console.log("Logged out")}
			/>
		</div>
	)
}

export function ArchiveExample() {
	const [open, setOpen] = React.useState(false)
	return (
		<div>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				<Archive className="h-4 w-4 mr-2" />
				Archive
			</Button>
			<ConfirmationDialog
				open={open}
				onOpenChange={setOpen}
				title="Archive Item"
				description="This item will be moved to the archive. You can restore it later from the archive section."
				confirmLabel="Archive"
				onConfirm={() => console.log("Archived")}
			/>
		</div>
	)
}

export function HeroExample() {
	const [open, setOpen] = React.useState(false)
	return (
		<div>
			<Button variant="destructive" onClick={() => setOpen(true)}>
				<Trash2 className="h-4 w-4 mr-2" />
				Delete Item
			</Button>
			<ConfirmationDialog
				open={open}
				onOpenChange={setOpen}
				title="Delete Item"
				description="This action cannot be undone."
				confirmLabel="Delete"
				variant="destructive"
				onConfirm={() => console.log("Deleted")}
			/>
		</div>
	)
}
