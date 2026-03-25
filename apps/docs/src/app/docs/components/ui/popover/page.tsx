"use client"

import { use } from "react"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@blazz/ui/components/ui/popover"
import { HelpCircle } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "popover-props", title: "Popover Props" },
	{ id: "popover-content-props", title: "PopoverContent Props" },
	{ id: "design-tokens", title: "Design Tokens" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const popoverProps: DocProp[] = [
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

const popoverContentProps: DocProp[] = [
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

const examples = [
	{
		key: "basic",
		code: `<Popover>
  <PopoverTrigger render={<Button variant="outline">Open</Button>} />
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Settings</PopoverTitle>
      <PopoverDescription>
        Configure your preferences
      </PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>`,
	},
	{
		key: "with-form",
		code: `<Popover>
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
</Popover>`,
	},
	{
		key: "positioning",
		code: `<div className="flex gap-4">
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
</div>`,
	},
	{
		key: "icon-trigger",
		code: `<Popover>
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
</Popover>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

export default function PopoverPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Popover"
			subtitle="Displays rich content in a floating container anchored to a trigger."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<Popover>
					<PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
					<PopoverContent>
						<PopoverHeader>
							<PopoverTitle>Settings</PopoverTitle>
							<PopoverDescription>Configure your preferences</PopoverDescription>
						</PopoverHeader>
					</PopoverContent>
				</Popover>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Popover"
					description="A simple popover with title and description."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<Popover>
						<PopoverTrigger render={<Button variant="outline">Open</Button>} />
						<PopoverContent>
							<PopoverHeader>
								<PopoverTitle>Settings</PopoverTitle>
								<PopoverDescription>Configure your preferences</PopoverDescription>
							</PopoverHeader>
						</PopoverContent>
					</Popover>
				</DocExampleClient>

				<DocExampleClient
					title="With Form"
					description="A popover containing form inputs."
					code={examples[1].code}
					highlightedCode={html("with-form")}
				>
					<Popover>
						<PopoverTrigger render={<Button>Schedule</Button>} />
						<PopoverContent>
							<PopoverHeader>
								<PopoverTitle>Schedule Meeting</PopoverTitle>
								<PopoverDescription>Set your availability</PopoverDescription>
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
				</DocExampleClient>

				<DocExampleClient
					title="Positioning"
					description="Control the side and alignment of the popover."
					code={examples[2].code}
					highlightedCode={html("positioning")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Icon Button Trigger"
					description="Use an icon button to trigger the popover."
					code={examples[3].code}
					highlightedCode={html("icon-trigger")}
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
									<PopoverDescription>Click outside or press Esc to close</PopoverDescription>
								</PopoverHeader>
							</PopoverContent>
						</Popover>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* Popover Props */}
			<DocSection id="popover-props" title="Popover Props">
				<DocPropsTable props={popoverProps} />
			</DocSection>

			{/* PopoverContent Props */}
			<DocSection id="popover-content-props" title="PopoverContent Props">
				<DocPropsTable props={popoverContentProps} />
			</DocSection>

			{/* Design Tokens */}
			<DocSection id="design-tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Popover uses the design system tokens for consistent styling:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-muted</code> - Background color for the popover
					</li>
					<li>
						<code className="text-xs">text-fg</code> - Text color in popover
					</li>
					<li>
						<code className="text-xs">text-fg-muted</code> - Description text color
					</li>
					<li>
						<code className="text-xs">shadow-md</code> - Medium shadow for elevation
					</li>
					<li>
						<code className="text-xs">rounded-lg</code> - Large border radius (0.5rem)
					</li>
				</ul>
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use render prop to avoid nested button issues</li>
					<li>Use popovers for non-critical information and interactions</li>
					<li>Keep content concise and focused on a single purpose</li>
					<li>Consider using Dialog for critical actions that require user attention</li>
					<li>Provide a clear way to dismiss (click outside, Esc key)</li>
					<li>Use PopoverTitle for accessibility</li>
					<li>Limit the width to maintain readability (default: 18rem)</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Tooltip",
							href: "/docs/components/ui/tooltip",
							description: "Lightweight floating label for brief hints on hover.",
						},
						{
							title: "Dialog",
							href: "/docs/components/ui/dialog",
							description: "Modal overlay for critical actions requiring user attention.",
						},
						{
							title: "Dropdown Menu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Floating menu of actions triggered by a button.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
