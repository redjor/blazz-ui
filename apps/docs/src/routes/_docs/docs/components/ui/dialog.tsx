import { createFileRoute } from "@tanstack/react-router"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@blazz/ui/components/ui/dialog"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "default",
		code: `<Dialog>
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
</Dialog>`,
	},
	{
		key: "with-footer",
		code: `<Dialog>
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
</Dialog>`,
	},
	{
		key: "no-close-button",
		code: `<DialogContent showCloseButton={false}>
  <DialogHeader separator={false}>
    ...
  </DialogHeader>
  ...
</DialogContent>`,
	},
	{
		key: "confirmation",
		code: `<Dialog>
  <DialogTrigger render={<Button variant="destructive" />}>
    Delete Account
  </DialogTrigger>
  <DialogContent>
    <DialogHeader separator={false}>
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
</Dialog>`,
	},
	{
		key: "sizes",
		code: `<DialogContent size="sm">…</DialogContent>
<DialogContent size="md">…</DialogContent>
<DialogContent size="lg">…</DialogContent>
<DialogContent size="xl">…</DialogContent>
<DialogContent size="full">…</DialogContent>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/dialog")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: DialogPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "sizes", title: "Sizes" },
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

const dialogHeaderProps: DocProp[] = [
	{
		name: "separator",
		type: "boolean",
		default: "true",
		description:
			"Shows a border-bottom to separate the header from the content. Set to false for compact dialogs like confirmations.",
	},
]

const dialogContentProps: DocProp[] = [
	{
		name: "size",
		type: '"sm" | "md" | "lg" | "xl" | "full"',
		default: '"sm"',
		description:
			"Controls the max-width of the dialog. sm=384px, md=512px, lg=672px, xl=896px, full=1152px.",
	},
	{
		name: "showCloseButton",
		type: "boolean",
		default: "true",
		description: "Whether to show the close button in the top right corner.",
	},
]

function DialogPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Dialog"
			subtitle="Modal dialogs for focused interactions. Use for confirmations, forms, and important information."
			toc={toc}
		>
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

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A basic dialog with header and content."
					code={examples[0].code}
					highlightedCode={html("default")}
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
				</DocExampleClient>

				<DocExampleClient
					title="With Footer"
					description="Dialog with action buttons in the footer."
					code={examples[1].code}
					highlightedCode={html("with-footer")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Without Close Button"
					description="Hide the default close button for custom layouts."
					code={examples[2].code}
					highlightedCode={html("no-close-button")}
				>
					<Dialog>
						<DialogTrigger render={<Button variant="outline" />}>
							No Close Button
						</DialogTrigger>
						<DialogContent showCloseButton={false}>
							<DialogHeader separator={false}>
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
				</DocExampleClient>

				<DocExampleClient
					title="Confirmation"
					description="Use separator={false} for compact dialogs with no content between header and footer."
					code={examples[3].code}
					highlightedCode={html("confirmation")}
				>
					<Dialog>
						<DialogTrigger render={<Button variant="destructive" />}>
							Delete Account
						</DialogTrigger>
						<DialogContent>
							<DialogHeader separator={false}>
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
				</DocExampleClient>

				<DocExampleClient
					title="Sizes"
					description="Use the size prop to control the dialog width."
					code={examples[4].code}
					highlightedCode={html("sizes")}
				>
					<div className="flex flex-wrap gap-2">
						{(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
							<Dialog key={size}>
								<DialogTrigger render={<Button variant="outline" />}>
									{size}
								</DialogTrigger>
								<DialogContent size={size}>
									<DialogHeader>
										<DialogTitle>Size: {size}</DialogTitle>
										<DialogDescription>
											This dialog uses the <code>{size}</code> size variant.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose render={<Button />}>Close</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						))}
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable
					groups={[
						{ title: "Dialog", props: dialogProps },
						{ title: "DialogContent", props: dialogContentProps },
						{ title: "DialogHeader", props: dialogHeaderProps },
					]}
				/>
			</DocSection>

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
