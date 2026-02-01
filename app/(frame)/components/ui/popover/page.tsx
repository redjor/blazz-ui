"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverDescription,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, HelpCircle, Calendar } from "lucide-react"

const popoverProps = [
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

const popoverContentProps = [
	{
		name: "align",
		type: "'start' | 'center' | 'end'",
		default: "'center'",
		description: "Alignment relative to the trigger.",
	},
	{
		name: "side",
		type: "'top' | 'right' | 'bottom' | 'left'",
		default: "'bottom'",
		description: "Side to render the popover.",
	},
	{
		name: "sideOffset",
		type: "number",
		default: "4",
		description: "Distance from the trigger.",
	},
	{
		name: "alignOffset",
		type: "number",
		default: "0",
		description: "Offset from the alignment.",
	},
]

export default function PopoverPage() {
	return (
		<Page
			title="Popover"
			subtitle="Displays rich content in a floating container anchored to a trigger."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Popover"
					description="A simple popover with title and description."
					code={`<Popover>
  <PopoverTrigger render={<Button variant="outline">Open</Button>} />
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Settings</PopoverTitle>
      <PopoverDescription>
        Configure your preferences
      </PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>`}
				>
					<Popover>
						<PopoverTrigger render={<Button variant="outline">Open</Button>} />
						<PopoverContent>
							<PopoverHeader>
								<PopoverTitle>Settings</PopoverTitle>
								<PopoverDescription>
									Configure your preferences
								</PopoverDescription>
							</PopoverHeader>
						</PopoverContent>
					</Popover>
				</ComponentExample>

				{/* With Form */}
				<ComponentExample
					title="With Form"
					description="A popover containing form inputs."
					code={`<Popover>
  <PopoverTrigger render={<Button>Schedule</Button>} />
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Schedule Meeting</PopoverTitle>
      <PopoverDescription>
        Set your availability
      </PopoverDescription>
    </PopoverHeader>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input id="time" type="time" />
      </div>
      <Button className="w-full">Confirm</Button>
    </div>
  </PopoverContent>
</Popover>`}
				>
					<Popover>
						<PopoverTrigger render={<Button>Schedule</Button>} />
						<PopoverContent>
							<PopoverHeader>
								<PopoverTitle>Schedule Meeting</PopoverTitle>
								<PopoverDescription>
									Set your availability
								</PopoverDescription>
							</PopoverHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="date">Date</Label>
									<Input id="date" type="date" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="time">Time</Label>
									<Input id="time" type="time" />
								</div>
								<Button className="w-full">Confirm</Button>
							</div>
						</PopoverContent>
					</Popover>
				</ComponentExample>

				{/* Different Positions */}
				<ComponentExample
					title="Positioning"
					description="Control the side and alignment of the popover."
					code={`<div className="flex gap-4">
  <Popover>
    <PopoverTrigger render={<Button variant="outline">Top</Button>} />
    <PopoverContent side="top">
      <PopoverHeader>
        <PopoverTitle>Top Side</PopoverTitle>
        <PopoverDescription>Opens above the trigger</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger render={<Button variant="outline">Right</Button>} />
    <PopoverContent side="right">
      <PopoverHeader>
        <PopoverTitle>Right Side</PopoverTitle>
        <PopoverDescription>Opens to the right</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger render={<Button variant="outline">Left</Button>} />
    <PopoverContent side="left">
      <PopoverHeader>
        <PopoverTitle>Left Side</PopoverTitle>
        <PopoverDescription>Opens to the left</PopoverDescription>
      </PopoverHeader>
    </PopoverContent>
  </Popover>
</div>`}
				>
					<div className="flex gap-4 justify-center">
						<Popover>
							<PopoverTrigger render={<Button variant="outline">Top</Button>} />
							<PopoverContent side="top">
								<PopoverHeader>
									<PopoverTitle>Top Side</PopoverTitle>
									<PopoverDescription>Opens above the trigger</PopoverDescription>
								</PopoverHeader>
							</PopoverContent>
						</Popover>

						<Popover>
							<PopoverTrigger render={<Button variant="outline">Right</Button>} />
							<PopoverContent side="right">
								<PopoverHeader>
									<PopoverTitle>Right Side</PopoverTitle>
									<PopoverDescription>Opens to the right</PopoverDescription>
								</PopoverHeader>
							</PopoverContent>
						</Popover>

						<Popover>
							<PopoverTrigger render={<Button variant="outline">Left</Button>} />
							<PopoverContent side="left">
								<PopoverHeader>
									<PopoverTitle>Left Side</PopoverTitle>
									<PopoverDescription>Opens to the left</PopoverDescription>
								</PopoverHeader>
							</PopoverContent>
						</Popover>
					</div>
				</ComponentExample>

				{/* With Icon Button */}
				<ComponentExample
					title="Icon Button Trigger"
					description="Use an icon button to trigger the popover."
					code={`<Popover>
  <PopoverTrigger
    render={
      <Button variant="ghost" size="icon">
        <HelpCircle className="h-4 w-4" />
      </Button>
    }
  />
  <PopoverContent align="end">
    <PopoverHeader>
      <PopoverTitle>Help</PopoverTitle>
      <PopoverDescription>
        Click outside or press Esc to close
      </PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>`}
				>
					<div className="flex justify-center">
						<Popover>
							<PopoverTrigger
								render={
									<Button variant="ghost" size="icon">
										<HelpCircle className="h-4 w-4" />
									</Button>
								}
							/>
							<PopoverContent align="end">
								<PopoverHeader>
									<PopoverTitle>Help</PopoverTitle>
									<PopoverDescription>
										Click outside or press Esc to close
									</PopoverDescription>
								</PopoverHeader>
							</PopoverContent>
						</Popover>
					</div>
				</ComponentExample>

				{/* Props Tables */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Popover Props</h2>
					<PropsTable props={popoverProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-xl font-semibold">PopoverContent Props</h2>
					<PropsTable props={popoverContentProps} />
				</section>

				{/* Design Tokens */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Popover uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-popover</code> - Background color for the popover
						</li>
						<li>
							<code className="text-xs">text-popover-foreground</code> - Text color in popover
						</li>
						<li>
							<code className="text-xs">text-muted-foreground</code> - Description text color
						</li>
						<li>
							<code className="text-xs">ring-foreground/10</code> - Border with 10% opacity
						</li>
						<li>
							<code className="text-xs">shadow-md</code> - Medium shadow for elevation
						</li>
						<li>
							<code className="text-xs">rounded-lg</code> - Large border radius (0.5rem)
						</li>
					</ul>
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use render prop to avoid nested button issues</li>
						<li>Use popovers for non-critical information and interactions</li>
						<li>Keep content concise and focused on a single purpose</li>
						<li>Consider using Dialog for critical actions that require user attention</li>
						<li>Provide a clear way to dismiss (click outside, Esc key)</li>
						<li>Use PopoverTitle for accessibility</li>
						<li>Limit the width to maintain readability (default: 18rem)</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
