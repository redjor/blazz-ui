"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Trash2, LogOut, Archive } from "lucide-react"

const confirmationDialogProps = [
	{
		name: "open",
		type: "boolean",
		required: true,
		description: "Controlled open state of the dialog.",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		required: true,
		description: "Callback when the open state changes.",
	},
	{
		name: "title",
		type: "string",
		default: '"Are you sure?"',
		description: "Title displayed at the top of the dialog.",
	},
	{
		name: "description",
		type: "string",
		required: true,
		description: "Description text explaining the action.",
	},
	{
		name: "confirmLabel",
		type: "string",
		default: '"Continue"',
		description: "Label for the confirm button.",
	},
	{
		name: "cancelLabel",
		type: "string",
		default: '"Cancel"',
		description: "Label for the cancel button.",
	},
	{
		name: "onConfirm",
		type: "() => void | Promise<void>",
		required: true,
		description: "Callback when the confirm button is clicked.",
	},
	{
		name: "variant",
		type: '"default" | "destructive"',
		default: '"default"',
		description: "Visual style of the confirm button.",
	},
]

export default function ConfirmationDialogPage() {
	const [deleteOpen, setDeleteOpen] = React.useState(false)
	const [logoutOpen, setLogoutOpen] = React.useState(false)
	const [archiveOpen, setArchiveOpen] = React.useState(false)
	const [customOpen, setCustomOpen] = React.useState(false)

	const handleDelete = () => {
		console.log("Item deleted")
	}

	const handleLogout = () => {
		console.log("User logged out")
	}

	const handleArchive = () => {
		console.log("Item archived")
	}

	const handleCustomAction = () => {
		console.log("Custom action confirmed")
	}

	return (
		<Page
			title="Confirmation Dialog"
			subtitle="A reusable confirmation dialog for critical actions."
		>
			<div className="space-y-12">
				{/* Default Example */}
				<ComponentExample
					title="Default Confirmation"
					description="A standard confirmation dialog with default variant."
					code={`const [open, setOpen] = React.useState(false)

const handleConfirm = () => {
  console.log("Action confirmed")
}

<>
  <Button onClick={() => setOpen(true)}>
    Open Dialog
  </Button>
  <ConfirmationDialog
    open={open}
    onOpenChange={setOpen}
    title="Confirm Action"
    description="Are you sure you want to proceed with this action?"
    confirmLabel="Confirm"
    onConfirm={handleConfirm}
  />
</>`}
				>
					<div>
						<Button onClick={() => setCustomOpen(true)}>
							Open Dialog
						</Button>
						<ConfirmationDialog
							open={customOpen}
							onOpenChange={setCustomOpen}
							title="Confirm Action"
							description="Are you sure you want to proceed with this action?"
							confirmLabel="Confirm"
							onConfirm={handleCustomAction}
						/>
					</div>
				</ComponentExample>

				{/* Destructive Variant */}
				<ComponentExample
					title="Destructive Variant"
					description="Use the destructive variant for dangerous actions like delete."
					code={`const [open, setOpen] = React.useState(false)

const handleDelete = () => {
  console.log("Item deleted")
}

<>
  <Button
    variant="destructive"
    onClick={() => setOpen(true)}
  >
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
    onConfirm={handleDelete}
  />
</>`}
				>
					<div>
						<Button
							variant="destructive"
							onClick={() => setDeleteOpen(true)}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</Button>
						<ConfirmationDialog
							open={deleteOpen}
							onOpenChange={setDeleteOpen}
							title="Delete Item"
							description="Are you sure you want to delete this item? This action cannot be undone."
							confirmLabel="Delete"
							variant="destructive"
							onConfirm={handleDelete}
						/>
					</div>
				</ComponentExample>

				{/* Logout Example */}
				<ComponentExample
					title="Logout Confirmation"
					description="Confirm user logout with custom labels."
					code={`const [open, setOpen] = React.useState(false)

const handleLogout = () => {
  console.log("User logged out")
}

<>
  <Button
    variant="outline"
    onClick={() => setOpen(true)}
  >
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
    onConfirm={handleLogout}
  />
</>`}
				>
					<div>
						<Button
							variant="outline"
							onClick={() => setLogoutOpen(true)}
						>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
						<ConfirmationDialog
							open={logoutOpen}
							onOpenChange={setLogoutOpen}
							title="Logout"
							description="Are you sure you want to logout? Any unsaved changes will be lost."
							confirmLabel="Logout"
							cancelLabel="Stay logged in"
							onConfirm={handleLogout}
						/>
					</div>
				</ComponentExample>

				{/* Archive Example */}
				<ComponentExample
					title="Archive Confirmation"
					description="Confirm archiving with custom messaging."
					code={`const [open, setOpen] = React.useState(false)

const handleArchive = () => {
  console.log("Item archived")
}

<>
  <Button
    variant="secondary"
    onClick={() => setOpen(true)}
  >
    <Archive className="h-4 w-4 mr-2" />
    Archive
  </Button>
  <ConfirmationDialog
    open={open}
    onOpenChange={setOpen}
    title="Archive Item"
    description="This item will be moved to the archive. You can restore it later from the archive section."
    confirmLabel="Archive"
    onConfirm={handleArchive}
  />
</>`}
				>
					<div>
						<Button
							variant="secondary"
							onClick={() => setArchiveOpen(true)}
						>
							<Archive className="h-4 w-4 mr-2" />
							Archive
						</Button>
						<ConfirmationDialog
							open={archiveOpen}
							onOpenChange={setArchiveOpen}
							title="Archive Item"
							description="This item will be moved to the archive. You can restore it later from the archive section."
							confirmLabel="Archive"
							onConfirm={handleArchive}
						/>
					</div>
				</ComponentExample>

				{/* Props Table */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">ConfirmationDialog Props</h2>
					<PropsTable props={confirmationDialogProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						ConfirmationDialog inherits design tokens from the Dialog component:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-background</code> - Dialog background color
						</li>
						<li>
							<code className="text-xs">text-foreground</code> - Main text color
						</li>
						<li>
							<code className="text-xs">text-muted-foreground</code> - Description text color
						</li>
						<li>
							<code className="text-xs">shadow-lg</code> - Large shadow for elevation
						</li>
						<li>
							<code className="text-xs">rounded-lg</code> - Large border radius
						</li>
						<li>
							<code className="text-xs">bg-black/80</code> - Backdrop overlay (80% opacity)
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use for actions that cannot be easily undone (delete, logout, etc.)</li>
						<li>Use the destructive variant for dangerous or permanent actions</li>
						<li>Keep the description clear and concise (explain what will happen)</li>
						<li>Use action-specific labels (e.g., "Delete" instead of "OK")</li>
						<li>Always provide a way to cancel the action</li>
						<li>Consider the severity: not every action needs confirmation</li>
						<li>Place confirm button on the right for consistency</li>
						<li>Don't overuse confirmations as they create friction</li>
					</ul>
				</section>

				{/* Usage Guidelines */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">When to Use</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="border rounded-lg p-4">
							<h3 className="font-semibold text-sm mb-2 text-p-success-text">✓ Do use for:</h3>
							<ul className="text-sm text-p-text-secondary space-y-1">
								<li>• Deleting data</li>
								<li>• Logging out</li>
								<li>• Canceling subscriptions</li>
								<li>• Discarding unsaved changes</li>
								<li>• Irreversible actions</li>
							</ul>
						</div>
						<div className="border rounded-lg p-4">
							<h3 className="font-semibold text-sm mb-2 text-p-critical-text">✗ Don't use for:</h3>
							<ul className="text-sm text-p-text-secondary space-y-1">
								<li>• Easily reversible actions</li>
								<li>• Frequent operations</li>
								<li>• Actions with clear undo</li>
								<li>• Non-destructive saves</li>
								<li>• Simple navigation</li>
							</ul>
						</div>
					</div>
				</section>
			</div>
		</Page>
	)
}
