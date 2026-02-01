"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Menu, Settings, X } from "lucide-react"

const sheetProps = [
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

const sheetContentProps = [
	{
		name: "side",
		type: "'left' | 'right' | 'top' | 'bottom'",
		default: "'left'",
		description: "Side from which the sheet slides in.",
	},
	{
		name: "topOffset",
		type: "string",
		description: "Offset from top (e.g., '56px' for header). Applied to backdrop and content.",
	},
]

export default function SheetPage() {
	return (
		<Page
			title="Sheet"
			subtitle="A slide-in panel that slides from the edge of the screen."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Sheet"
					description="A simple sheet that slides from the left."
					code={`<Sheet>
  <SheetTrigger render={<Button variant="outline">Open</Button>} />
  <SheetContent>
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Sheet Title</h2>
      <p className="text-sm text-p-text-secondary">
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
								<p className="text-sm text-p-text-secondary">
									This is a sheet component that slides in from the side.
								</p>
							</div>
						</SheetContent>
					</Sheet>
				</ComponentExample>

				{/* Different Sides */}
				<ComponentExample
					title="Slide from Different Sides"
					description="Control which edge the sheet slides from."
					code={`<div className="flex gap-4">
  <Sheet>
    <SheetTrigger render={<Button variant="outline">Left</Button>} />
    <SheetContent side="left">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Left Sheet</h2>
        <p className="text-sm text-p-text-secondary mt-2">
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
        <p className="text-sm text-p-text-secondary mt-2">
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
        <p className="text-sm text-p-text-secondary mt-2">
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
        <p className="text-sm text-p-text-secondary mt-2">
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
									<p className="text-sm text-p-text-secondary mt-2">
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
									<p className="text-sm text-p-text-secondary mt-2">
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
									<p className="text-sm text-p-text-secondary mt-2">
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
									<p className="text-sm text-p-text-secondary mt-2">
										Slides from the bottom edge
									</p>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</ComponentExample>

				{/* With Form */}
				<ComponentExample
					title="Settings Sheet"
					description="A sheet with form inputs for settings."
					code={`<Sheet>
  <SheetTrigger
    render={
      <Button variant="outline">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    }
  />
  <SheetContent side="right">
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Settings</h2>
        <SheetClose render={
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        } />
      </div>

      <div className="space-y-4 flex-1">
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

      <div className="flex gap-2 pt-6 border-t">
        <SheetClose render={<Button variant="outline" className="flex-1">Cancel</Button>} />
        <Button className="flex-1">Save Changes</Button>
      </div>
    </div>
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
						<SheetContent side="right">
							<div className="p-6 flex flex-col h-full">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-lg font-semibold">Settings</h2>
									<SheetClose render={
										<Button variant="ghost" size="icon">
											<X className="h-4 w-4" />
										</Button>
									} />
								</div>

								<div className="space-y-4 flex-1">
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

								<div className="flex gap-2 pt-6 border-t">
									<SheetClose render={<Button variant="outline" className="flex-1">Cancel</Button>} />
									<Button className="flex-1">Save Changes</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</ComponentExample>

				{/* Navigation Sheet */}
				<ComponentExample
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
				</ComponentExample>

				{/* Props Tables */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Sheet Props</h2>
					<PropsTable props={sheetProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">SheetContent Props</h2>
					<PropsTable props={sheetContentProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Sheet uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-background</code> - Sheet background color
						</li>
						<li>
							<code className="text-xs">shadow-lg</code> - Large shadow for elevation
						</li>
						<li>
							<code className="text-xs">bg-black/80</code> - Backdrop overlay color (80% black)
						</li>
						<li>
							<code className="text-xs">duration-300</code> - Animation duration (300ms)
						</li>
						<li>
							<code className="text-xs">w-[300px]</code> - Default width for side sheets
						</li>
						<li>
							<code className="text-xs">h-[300px]</code> - Default height for top/bottom sheets
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use render prop with SheetTrigger to avoid nested button issues</li>
						<li>Use sheets for contextual panels and secondary navigation</li>
						<li>Consider using Dialog for critical actions requiring user attention</li>
						<li>Provide a close button with SheetClose for better UX</li>
						<li>Keep sheet content focused and avoid excessive scrolling</li>
						<li>Use left/right sheets for navigation and settings</li>
						<li>Use bottom sheets on mobile for contextual actions</li>
						<li>Consider the topOffset prop when you have a fixed header</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
