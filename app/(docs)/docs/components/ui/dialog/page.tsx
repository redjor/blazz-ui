import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
]

const dialogProps: DocProp[] = [
	{
		name: "open",
		type: "boolean",
		description: "Controlled open state of the dialog.",
	},
	{
		name: "defaultOpen",
		type: "boolean",
		description: "The default open state for uncontrolled usage.",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Callback when the open state changes.",
	},
]

const dialogContentProps: DocProp[] = [
	{
		name: "showCloseButton",
		type: "boolean",
		default: "true",
		description: "Whether to show the close button in the top right corner.",
	},
]

export default function DialogPage() {
	return (
		<DocPage
			title="Dialog"
			subtitle="Modal dialogs for focused interactions. Use for confirmations, forms, and important information."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Dialog>
					<DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Dialog Title</DialogTitle>
							<DialogDescription>
								This is a description of the dialog content.
							</DialogDescription>
						</DialogHeader>
						<p className="text-sm text-fg-muted">
							Your dialog content goes here.
						</p>
					</DialogContent>
				</Dialog>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic dialog with header and content."
					code={`<Dialog>
  <DialogTrigger render={<Button />}>
    Open Dialog
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        This is a description of the dialog content.
      </DialogDescription>
    </DialogHeader>
    <p>Dialog content goes here.</p>
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Dialog Title</DialogTitle>
								<DialogDescription>
									This is a description of the dialog content.
								</DialogDescription>
							</DialogHeader>
							<p className="text-sm text-fg-muted">
								Your dialog content goes here. This could be anything from text to
								forms.
							</p>
						</DialogContent>
					</Dialog>
				</DocExample>

				<DocExample
					title="With Footer"
					description="Dialog with action buttons in the footer."
					code={`<Dialog>
  <DialogTrigger render={<Button />}>
    Edit Profile
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="John Doe" />
      </div>
    </div>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>
        Cancel
      </DialogClose>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger render={<Button />}>Edit Profile</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Edit Profile</DialogTitle>
								<DialogDescription>
									Make changes to your profile here. Click save when done.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" defaultValue="John Doe" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" defaultValue="john@example.com" />
								</div>
							</div>
							<DialogFooter>
								<DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
								<Button>Save changes</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</DocExample>

				<DocExample
					title="Without Close Button"
					description="Hide the default close button for custom layouts."
					code={`<DialogContent showCloseButton={false}>
  ...
</DialogContent>`}
				>
					<Dialog>
						<DialogTrigger render={<Button variant="outline" />}>
							No Close Button
						</DialogTrigger>
						<DialogContent showCloseButton={false}>
							<DialogHeader>
								<DialogTitle>Custom Dialog</DialogTitle>
								<DialogDescription>
									This dialog has no close button. Use the footer buttons.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose render={<Button />}>Close</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</DocExample>

				<DocExample
					title="Confirmation"
					description="Use for confirming important actions."
					code={`<Dialog>
  <DialogTrigger render={<Button variant="destructive" />}>
    Delete Account
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>
        Cancel
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger render={<Button variant="destructive" />}>
							Delete Account
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete your
									account and remove your data from our servers.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
								<Button variant="destructive">Delete Account</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable
					groups={[
						{ title: "Dialog", props: dialogProps },
						{ title: "DialogContent", props: dialogContentProps },
					]}
				/>
			</DocSection>

			{/* Design Tokens */}
			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Dialog uses the design system tokens for consistent styling:
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
						<code className="text-xs">rounded-lg</code> - Large border radius (0.5rem)
					</li>
					<li>
						<code className="text-xs">bg-overlay</code> - Backdrop overlay
					</li>
				</ul>
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use dialogs sparingly - they interrupt the user's workflow</li>
					<li>Always provide a clear way to close the dialog</li>
					<li>Keep dialog content focused on a single task</li>
					<li>Use the ConfirmationDialog component for delete confirmations</li>
					<li>For side panels, consider using Sheet instead</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
