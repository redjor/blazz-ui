"use client"

import { Page } from "@/components/ui/page"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable } from "@/components/features/docs/props-table"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ChevronLeft, ChevronRight, Bold, Italic, Underline } from "lucide-react"

const buttonGroupProps = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The buttons to group together.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes to apply.",
	},
]

export default function ButtonGroupPage() {
	return (
		<Page
			title="Button Group"
			subtitle="Groups related buttons together with connected styling."
		>
			<div className="space-y-12">
				{/* Basic Example */}
				<ComponentExample
					title="Basic Button Group"
					description="Group buttons together for related actions."
					code={`<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline">Left</Button>
						<Button variant="outline">Center</Button>
						<Button variant="outline">Right</Button>
					</ButtonGroup>
				</ComponentExample>

				{/* With Icons */}
				<ComponentExample
					title="With Icons"
					description="Button groups work well with icon-only buttons."
					code={`<ButtonGroup>
  <Button variant="outline" size="icon">
    <ChevronLeft className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <ChevronRight className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline" size="icon">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</ButtonGroup>
				</ComponentExample>

				{/* Toolbar Example */}
				<ComponentExample
					title="Toolbar"
					description="Create a text formatting toolbar with button groups."
					code={`<ButtonGroup>
  <Button variant="outline" size="icon">
    <Bold className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <Italic className="h-4 w-4" />
  </Button>
  <Button variant="outline" size="icon">
    <Underline className="h-4 w-4" />
  </Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline" size="icon">
							<Bold className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<Italic className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="icon">
							<Underline className="h-4 w-4" />
						</Button>
					</ButtonGroup>
				</ComponentExample>

				{/* Different Variants */}
				<ComponentExample
					title="Different Variants"
					description="Button groups work with different button variants."
					code={`<div className="flex flex-col gap-4">
  <ButtonGroup>
    <Button>Save</Button>
    <Button>Cancel</Button>
  </ButtonGroup>

  <ButtonGroup>
    <Button variant="secondary">Option A</Button>
    <Button variant="secondary">Option B</Button>
    <Button variant="secondary">Option C</Button>
  </ButtonGroup>
</div>`}
				>
					<div className="flex flex-col gap-4">
						<ButtonGroup>
							<Button>Save</Button>
							<Button>Cancel</Button>
						</ButtonGroup>

						<ButtonGroup>
							<Button variant="secondary">Option A</Button>
							<Button variant="secondary">Option B</Button>
							<Button variant="secondary">Option C</Button>
						</ButtonGroup>
					</div>
				</ComponentExample>

				{/* Props Table */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Props</h2>
					<PropsTable props={buttonGroupProps} />
				</section>

				{/* Best Practices */}
				<section className="space-y-4">
					<h2 className="text-xl font-semibold">Best Practices</h2>
					<ul className="list-disc list-inside space-y-2 text-muted-foreground">
						<li>Use button groups for related actions that should be visually connected</li>
						<li>Keep the number of buttons in a group small (2-4 buttons)</li>
						<li>Use consistent button variants within a group</li>
						<li>Consider icon-only buttons for compact toolbars</li>
						<li>Ensure buttons in the group have similar importance levels</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
