import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetClose,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
} from "@blazz/ui/components/ui/sheet"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Menu, Settings } from "lucide-react"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "sheet-props", title: "Sheet Props" },
	{ id: "sheet-content-props", title: "SheetContent Props" },
	{ id: "design-tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const sheetProps: DocProp[] = [
	{
		name: "open",
		type: "boolean",
		description: "Controlled open state.",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Callback when open state changes.",
	},
	{
		name: "defaultOpen",
		type: "boolean",
		description: "Initial open state for uncontrolled usage.",
	},
]

const sheetContentProps: DocProp[] = [
	{
		name: "side",
		type: "'left' | 'right' | 'top' | 'bottom'",
		default: "'left'",
		description: "Side from which the sheet slides in.",
	},
	{
		name: "size",
		type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
		default: "'md'",
		description: "Sheet size. Controls width for left/right sides, height for top/bottom.",
	},
	{
		name: "topOffset",
		type: "string",
		description: "Offset from top (e.g., '56px' for header). Applied to backdrop and content.",
	},
]

export default function SheetPage() {
	return (
		<DocPage
			title="Sheet"
			subtitle="A slide-in panel that slides from the edge of the screen."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="flex gap-3">
					<Sheet>
						<SheetTrigger render={<Button variant="outline">Open Left</Button>} />
						<SheetContent side="left">
							<div className="p-6">
								<h2 className="text-lg font-semibold mb-4">Sheet Title</h2>
								<p className="text-sm text-fg-muted">
									This is a sheet component that slides in from the side.
								</p>
							</div>
						</SheetContent>
					</Sheet>
					<Sheet>
						<SheetTrigger render={<Button variant="outline">Open Right</Button>} />
						<SheetContent side="right">
							<div className="p-6">
								<h2 className="text-lg font-semibold mb-4">Sheet Title</h2>
								<p className="text-sm text-fg-muted">
									This is a sheet component that slides in from the right.
								</p>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic Sheet"
					description="A simple sheet that slides from the left."
					code={`<Sheet>
  <SheetTrigger render={<Button variant="outline">Open</Button>} />
  <SheetContent>
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Sheet Title</h2>
      <p className="text-sm text-fg-muted">
        This is a sheet component that slides in from the side.
      </p>
    </div>
  </SheetContent>
</Sheet>`}
				>
					<Sheet>
						<SheetTrigger render={<Button variant="outline">Open</Button>} />
						<SheetContent>
							<div className="p-6">
								<h2 className="text-lg font-semibold mb-4">Sheet Title</h2>
								<p className="text-sm text-fg-muted">
									This is a sheet component that slides in from the side.
								</p>
							</div>
						</SheetContent>
					</Sheet>
				</DocExample>

				<DocExample
					title="Slide from Different Sides"
					description="Control which edge the sheet slides from."
					code={`<div className="flex gap-4">
  <Sheet>
    <SheetTrigger render={<Button variant="outline">Left</Button>} />
    <SheetContent side="left">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Left Sheet</h2>
        <p className="text-sm text-fg-muted mt-2">
          Slides from the left edge
        </p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">Right</Button>} />
    <SheetContent side="right">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Right Sheet</h2>
        <p className="text-sm text-fg-muted mt-2">
          Slides from the right edge
        </p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">Top</Button>} />
    <SheetContent side="top">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Top Sheet</h2>
        <p className="text-sm text-fg-muted mt-2">
          Slides from the top edge
        </p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">Bottom</Button>} />
    <SheetContent side="bottom">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Bottom Sheet</h2>
        <p className="text-sm text-fg-muted mt-2">
          Slides from the bottom edge
        </p>
      </div>
    </SheetContent>
  </Sheet>
</div>`}
				>
					<div className="flex gap-4 flex-wrap">
						<Sheet>
							<SheetTrigger render={<Button variant="outline">Left</Button>} />
							<SheetContent side="left">
								<div className="p-6">
									<h2 className="text-lg font-semibold">Left Sheet</h2>
									<p className="text-sm text-fg-muted mt-2">
										Slides from the left edge
									</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">Right</Button>} />
							<SheetContent side="right">
								<div className="p-6">
									<h2 className="text-lg font-semibold">Right Sheet</h2>
									<p className="text-sm text-fg-muted mt-2">
										Slides from the right edge
									</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">Top</Button>} />
							<SheetContent side="top">
								<div className="p-6">
									<h2 className="text-lg font-semibold">Top Sheet</h2>
									<p className="text-sm text-fg-muted mt-2">
										Slides from the top edge
									</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">Bottom</Button>} />
							<SheetContent side="bottom">
								<div className="p-6">
									<h2 className="text-lg font-semibold">Bottom Sheet</h2>
									<p className="text-sm text-fg-muted mt-2">
										Slides from the bottom edge
									</p>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</DocExample>

				<DocExample
					title="Sizes"
					description="Control the sheet width (left/right) or height (top/bottom) with the size prop."
					code={`<div className="flex gap-4">
  <Sheet>
    <SheetTrigger render={<Button variant="outline">Small</Button>} />
    <SheetContent side="right" size="sm">
      <SheetHeader>
        <SheetTitle>Small (320px)</SheetTitle>
      </SheetHeader>
      <div className="flex-1 p-4">
        <p className="text-sm text-fg-muted">Compact panel for quick actions.</p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">Medium</Button>} />
    <SheetContent side="right" size="md">
      <SheetHeader>
        <SheetTitle>Medium (400px)</SheetTitle>
      </SheetHeader>
      <div className="flex-1 p-4">
        <p className="text-sm text-fg-muted">Default size, good for forms and settings.</p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">Large</Button>} />
    <SheetContent side="right" size="lg">
      <SheetHeader>
        <SheetTitle>Large (520px)</SheetTitle>
      </SheetHeader>
      <div className="flex-1 p-4">
        <p className="text-sm text-fg-muted">More room for complex content.</p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">XL</Button>} />
    <SheetContent side="right" size="xl">
      <SheetHeader>
        <SheetTitle>Extra Large (680px)</SheetTitle>
      </SheetHeader>
      <div className="flex-1 p-4">
        <p className="text-sm text-fg-muted">Ideal for detail views and previews.</p>
      </div>
    </SheetContent>
  </Sheet>

  <Sheet>
    <SheetTrigger render={<Button variant="outline">Full</Button>} />
    <SheetContent side="right" size="full">
      <SheetHeader>
        <SheetTitle>Full</SheetTitle>
      </SheetHeader>
      <div className="flex-1 p-4">
        <p className="text-sm text-fg-muted">Takes up the entire viewport.</p>
      </div>
    </SheetContent>
  </Sheet>
</div>`}
				>
					<div className="flex gap-4 flex-wrap">
						<Sheet>
							<SheetTrigger render={<Button variant="outline">Small</Button>} />
							<SheetContent side="right" size="sm">
								<SheetHeader>
									<SheetTitle>Small (320px)</SheetTitle>
								</SheetHeader>
								<div className="flex-1 p-4">
									<p className="text-sm text-fg-muted">Compact panel for quick actions.</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">Medium</Button>} />
							<SheetContent side="right" size="md">
								<SheetHeader>
									<SheetTitle>Medium (400px)</SheetTitle>
								</SheetHeader>
								<div className="flex-1 p-4">
									<p className="text-sm text-fg-muted">Default size, good for forms and settings.</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">Large</Button>} />
							<SheetContent side="right" size="lg">
								<SheetHeader>
									<SheetTitle>Large (520px)</SheetTitle>
								</SheetHeader>
								<div className="flex-1 p-4">
									<p className="text-sm text-fg-muted">More room for complex content.</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">XL</Button>} />
							<SheetContent side="right" size="xl">
								<SheetHeader>
									<SheetTitle>Extra Large (680px)</SheetTitle>
								</SheetHeader>
								<div className="flex-1 p-4">
									<p className="text-sm text-fg-muted">Ideal for detail views and previews.</p>
								</div>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger render={<Button variant="outline">Full</Button>} />
							<SheetContent side="right" size="full">
								<SheetHeader>
									<SheetTitle>Full</SheetTitle>
								</SheetHeader>
								<div className="flex-1 p-4">
									<p className="text-sm text-fg-muted">Takes up the entire viewport.</p>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</DocExample>

				<DocExample
					title="Settings Sheet"
					description="A sheet with form inputs using SheetHeader and SheetFooter."
					code={`<Sheet>
  <SheetTrigger
    render={
      <Button variant="outline">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    }
  />
  <SheetContent side="right" size="lg">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Manage your account preferences.</SheetDescription>
    </SheetHeader>
    <div className="flex-1 p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Input id="bio" placeholder="Tell us about yourself" />
      </div>
    </div>
    <SheetFooter>
      <SheetClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Save Changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
				>
					<Sheet>
						<SheetTrigger
							render={
								<Button variant="outline">
									<Settings className="h-4 w-4 mr-2" />
									Settings
								</Button>
							}
						/>
						<SheetContent side="right" size="lg">
							<SheetHeader>
								<SheetTitle>Settings</SheetTitle>
								<SheetDescription>Manage your account preferences.</SheetDescription>
							</SheetHeader>
							<div className="flex-1 p-4 space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Display Name</Label>
									<Input id="name" placeholder="Enter your name" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="Enter your email" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="bio">Bio</Label>
									<Input id="bio" placeholder="Tell us about yourself" />
								</div>
							</div>
							<SheetFooter>
								<SheetClose render={<Button variant="outline">Cancel</Button>} />
								<Button>Save Changes</Button>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</DocExample>

				<DocExample
					title="Navigation Menu"
					description="A mobile-style navigation sheet."
					code={`<Sheet>
  <SheetTrigger
    render={
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5" />
      </Button>
    }
  />
  <SheetContent side="left">
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Navigation</h2>
      <nav className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start">Home</Button>
        <Button variant="ghost" className="justify-start">Products</Button>
        <Button variant="ghost" className="justify-start">About</Button>
        <Button variant="ghost" className="justify-start">Contact</Button>
      </nav>
    </div>
  </SheetContent>
</Sheet>`}
				>
					<Sheet>
						<SheetTrigger
							render={
								<Button variant="ghost" size="icon">
									<Menu className="h-5 w-5" />
								</Button>
							}
						/>
						<SheetContent side="left">
							<div className="p-6">
								<h2 className="text-lg font-semibold mb-4">Navigation</h2>
								<nav className="flex flex-col gap-2">
									<Button variant="ghost" className="justify-start">Home</Button>
									<Button variant="ghost" className="justify-start">Products</Button>
									<Button variant="ghost" className="justify-start">About</Button>
									<Button variant="ghost" className="justify-start">Contact</Button>
								</nav>
							</div>
						</SheetContent>
					</Sheet>
				</DocExample>

				<DocExample
					title="With Footer"
					description="A sheet with structured header and footer using SheetHeader and SheetFooter."
					code={`<Sheet>
  <SheetTrigger render={<Button variant="outline">Edit Profile</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Update your personal information.</SheetDescription>
    </SheetHeader>
    <div className="flex-1 p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="footer-name">Name</Label>
        <Input id="footer-name" defaultValue="Jonathan Ruas" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="footer-email">Email</Label>
        <Input id="footer-email" type="email" defaultValue="jonathan@example.com" />
      </div>
    </div>
    <SheetFooter>
      <SheetClose render={<Button variant="outline">Cancel</Button>} />
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}
				>
					<Sheet>
						<SheetTrigger render={<Button variant="outline">Edit Profile</Button>} />
						<SheetContent side="right">
							<SheetHeader>
								<SheetTitle>Edit Profile</SheetTitle>
								<SheetDescription>Update your personal information.</SheetDescription>
							</SheetHeader>
							<div className="flex-1 p-4 space-y-4">
								<div className="space-y-2">
									<Label htmlFor="footer-name">Name</Label>
									<Input id="footer-name" defaultValue="Jonathan Ruas" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="footer-email">Email</Label>
									<Input id="footer-email" type="email" defaultValue="jonathan@example.com" />
								</div>
							</div>
							<SheetFooter>
								<SheetClose render={<Button variant="outline">Cancel</Button>} />
								<Button>Save</Button>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</DocExample>

				<DocExample
					title="Scrollable Content with Footer"
					description="When content overflows, the body scrolls while header and footer stay fixed."
					code={`<Sheet>
  <SheetTrigger render={<Button variant="outline">Notifications</Button>} />
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Notifications</SheetTitle>
      <SheetDescription>You have 12 unread notifications.</SheetDescription>
    </SheetHeader>
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="rounded-lg border border-edge p-3">
          <p className="text-sm font-medium">Notification {i + 1}</p>
          <p className="text-xs text-fg-muted mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      ))}
    </div>
    <SheetFooter>
      <Button variant="outline">Mark all as read</Button>
      <SheetClose render={<Button>Done</Button>} />
    </SheetFooter>
  </SheetContent>
</Sheet>`}
				>
					<Sheet>
						<SheetTrigger render={<Button variant="outline">Notifications</Button>} />
						<SheetContent side="right">
							<SheetHeader>
								<SheetTitle>Notifications</SheetTitle>
								<SheetDescription>You have 12 unread notifications.</SheetDescription>
							</SheetHeader>
							<div className="flex-1 overflow-y-auto p-4 space-y-3">
								{Array.from({ length: 12 }, (_, i) => (
									<div key={i} className="rounded-lg border border-edge p-3">
										<p className="text-sm font-medium">Notification {i + 1}</p>
										<p className="text-xs text-fg-muted mt-1">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
										</p>
									</div>
								))}
							</div>
							<SheetFooter>
								<Button variant="outline">Mark all as read</Button>
								<SheetClose render={<Button>Done</Button>} />
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</DocExample>
			</DocSection>

			{/* Sheet Props */}
			<DocSection id="sheet-props" title="Sheet Props">
				<DocPropsTable props={sheetProps} />
			</DocSection>

			{/* SheetContent Props */}
			<DocSection id="sheet-content-props" title="SheetContent Props">
				<DocPropsTable props={sheetContentProps} />
			</DocSection>

			{/* Design Tokens */}
			<DocSection id="design-tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Sheet uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-panel</code> - Sheet background color
					</li>
					<li>
						<code className="text-xs">border-edge</code> - Border color
					</li>
					<li>
						<code className="text-xs">--radius-xl</code> - Rounded corners
					</li>
					<li>
						<code className="text-xs">shadow-lg</code> - Floating elevation
					</li>
					<li>
						<code className="text-xs">bg-raised</code> - Footer background
					</li>
					<li>
						400ms spring enter / 500ms ease-out exit
					</li>
				</ul>
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use render prop with SheetTrigger to avoid nested button issues</li>
					<li>Use sheets for contextual panels and secondary navigation</li>
					<li>Consider using Dialog for critical actions requiring user attention</li>
					<li>Provide a close button with SheetClose for better UX</li>
					<li>Keep sheet content focused and avoid excessive scrolling</li>
					<li>Use left/right sheets for navigation and settings</li>
					<li>Use bottom sheets on mobile for contextual actions</li>
					<li>Consider the topOffset prop when you have a fixed header</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description: "Modal overlay for critical actions requiring user attention.",
						},
						{
							title: "Popover",
							href: "/docs/components/ui/popover",
							description: "Smaller floating container for lightweight interactions.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
