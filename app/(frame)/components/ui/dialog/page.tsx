"use client"

import { Page } from "@/components/ui/page"
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
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const dialogProps: PropDefinition[] = [
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

const dialogContentProps: PropDefinition[] = [
	{
		name: "showCloseButton",
		type: "boolean",
		default: "true",
		description: "Whether to show the close button in the top right corner.",
	},
]

export default function DialogPage() {
	return (
		<Page
			title="Dialog"
			subtitle="Modal dialogs for focused interactions. Use for confirmations, forms, and important information."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
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
								<p className="text-sm text-muted-foreground">
									Your dialog content goes here. This could be anything from text to
									forms.
								</p>
							</DialogContent>
						</Dialog>
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>

					<ComponentExample
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
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Dialog Props</h2>
					<PropsTable props={dialogProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">DialogContent Props</h2>
					<PropsTable props={dialogContentProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Dialog uses the design system tokens for consistent styling:
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
							<code className="text-xs">rounded-lg</code> - Large border radius (0.5rem)
						</li>
						<li>
							<code className="text-xs">bg-black/80</code> - Backdrop overlay (80% opacity)
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Use dialogs sparingly - they interrupt the user's workflow</li>
						<li>Always provide a clear way to close the dialog</li>
						<li>Keep dialog content focused on a single task</li>
						<li>Use the ConfirmationDialog component for delete confirmations</li>
						<li>For side panels, consider using Sheet instead</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
