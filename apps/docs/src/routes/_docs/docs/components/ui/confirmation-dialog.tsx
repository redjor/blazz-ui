import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { Button } from "@blazz/ui/components/ui/button"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { Trash2, LogOut, Archive } from "lucide-react"
import { DocSection } from "~/components/docs/doc-section"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocPage } from "~/components/docs/doc-page"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "default",
		code: `const [open, setOpen] = React.useState(false)

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
</>`,
	},
	{
		key: "destructive",
		code: `const [open, setOpen] = React.useState(false)

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
</>`,
	},
	{
		key: "logout",
		code: `const [open, setOpen] = React.useState(false)

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
</>`,
	},
	{
		key: "archive",
		code: `const [open, setOpen] = React.useState(false)

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
</>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/confirmation-dialog")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ConfirmationDialogPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "when-to-use", title: "When to Use" },
]

const confirmationDialogProps: DocProp[] = [
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

/* ── Inlined demo components ── */

function DefaultExample() {
	const [open, setOpen] = React.useState(false)
	const handleConfirm = () => {
		console.log("Custom action confirmed")
	}
	return (
		<div>
			<Button onClick={() => setOpen(true)}>Open Dialog</Button>
			<ConfirmationDialog
				open={open}
				onOpenChange={setOpen}
				title="Confirm Action"
				description="Are you sure you want to proceed with this action?"
				confirmLabel="Confirm"
				onConfirm={handleConfirm}
			/>
		</div>
	)
}

function DestructiveExample() {
	const [open, setOpen] = React.useState(false)
	const handleDelete = () => {
		console.log("Item deleted")
	}
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
				onConfirm={handleDelete}
			/>
		</div>
	)
}

function LogoutExample() {
	const [open, setOpen] = React.useState(false)
	const handleLogout = () => {
		console.log("User logged out")
	}
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
				onConfirm={handleLogout}
			/>
		</div>
	)
}

function ArchiveExample() {
	const [open, setOpen] = React.useState(false)
	const handleArchive = () => {
		console.log("Item archived")
	}
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
				onConfirm={handleArchive}
			/>
		</div>
	)
}

function HeroExample() {
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

function ConfirmationDialogPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Confirmation Dialog"
			subtitle="A reusable confirmation dialog for critical actions."
			toc={toc}
		>
			<DocHero>
				<HeroExample />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default Confirmation"
					description="A standard confirmation dialog with default variant."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<DefaultExample />
				</DocExampleClient>

				<DocExampleClient
					title="Destructive Variant"
					description="Use the destructive variant for dangerous actions like delete."
					code={examples[1].code}
					highlightedCode={html("destructive")}
				>
					<DestructiveExample />
				</DocExampleClient>

				<DocExampleClient
					title="Logout Confirmation"
					description="Confirm user logout with custom labels."
					code={examples[2].code}
					highlightedCode={html("logout")}
				>
					<LogoutExample />
				</DocExampleClient>

				<DocExampleClient
					title="Archive Confirmation"
					description="Confirm archiving with custom messaging."
					code={examples[3].code}
					highlightedCode={html("archive")}
				>
					<ArchiveExample />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={confirmationDialogProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					ConfirmationDialog inherits design tokens from the Dialog component:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-surface</code> - Dialog background color
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Main text color
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> - Description text color
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
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use for actions that cannot be easily undone (delete, logout, etc.)</li>
					<li>Use the destructive variant for dangerous or permanent actions</li>
					<li>Keep the description clear and concise (explain what will happen)</li>
					<li>Use action-specific labels (e.g., "Delete" instead of "OK")</li>
					<li>Always provide a way to cancel the action</li>
					<li>Consider the severity: not every action needs confirmation</li>
					<li>Place confirm button on the right for consistency</li>
					<li>Don't overuse confirmations as they create friction</li>
				</ul>
			</DocSection>

			<DocSection id="when-to-use" title="When to Use">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="border rounded-lg p-4">
						<h3 className="font-semibold text-sm mb-2 text-positive">Do use for:</h3>
						<ul className="text-sm text-fg-muted space-y-1">
							<li>Deleting data</li>
							<li>Logging out</li>
							<li>Canceling subscriptions</li>
							<li>Discarding unsaved changes</li>
							<li>Irreversible actions</li>
						</ul>
					</div>
					<div className="border rounded-lg p-4">
						<h3 className="font-semibold text-sm mb-2 text-negative">Don't use for:</h3>
						<ul className="text-sm text-fg-muted space-y-1">
							<li>Easily reversible actions</li>
							<li>Frequent operations</li>
							<li>Actions with clear undo</li>
							<li>Non-destructive saves</li>
							<li>Simple navigation</li>
						</ul>
					</div>
				</div>
			</DocSection>
		</DocPage>
	)
}
