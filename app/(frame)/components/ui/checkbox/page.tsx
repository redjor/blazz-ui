"use client"

import * as React from "react"
import { Page } from "@/components/ui/page"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const checkboxProps: PropDefinition[] = [
	{
		name: "checked",
		type: "boolean",
		description: "Whether the checkbox is checked.",
	},
	{
		name: "defaultChecked",
		type: "boolean",
		description: "The default checked state for uncontrolled usage.",
	},
	{
		name: "onCheckedChange",
		type: "(checked: boolean) => void",
		description: "Callback when the checked state changes.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the checkbox is disabled.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the checkbox has an error.",
	},
]

export default function CheckboxPage() {
	const [checked, setChecked] = React.useState(false)

	return (
		<Page
			title="Checkbox"
			subtitle="A control that allows users to select one or more items from a set."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A basic checkbox."
						code={`<Checkbox />`}
					>
						<Checkbox />
					</ComponentExample>

					<ComponentExample
						title="With Label"
						description="Checkbox with an associated label for better accessibility."
						code={`<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`}
					>
						<div className="flex items-center gap-2">
							<Checkbox id="terms" />
							<Label htmlFor="terms">Accept terms and conditions</Label>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Controlled"
						description="Control the checkbox state programmatically."
						code={`const [checked, setChecked] = React.useState(false)

<div className="flex items-center gap-2">
  <Checkbox
    id="controlled"
    checked={checked}
    onCheckedChange={setChecked}
  />
  <Label htmlFor="controlled">
    {checked ? "Checked" : "Unchecked"}
  </Label>
</div>`}
					>
						<div className="flex items-center gap-2">
							<Checkbox id="controlled" checked={checked} onCheckedChange={setChecked} />
							<Label htmlFor="controlled">{checked ? "Checked" : "Unchecked"}</Label>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Disabled"
						description="Disabled checkboxes prevent interaction."
						code={`<Checkbox disabled />
<Checkbox disabled defaultChecked />`}
					>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Checkbox id="disabled" disabled />
								<Label htmlFor="disabled" className="opacity-50">
									Disabled
								</Label>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox id="disabled-checked" disabled defaultChecked />
								<Label htmlFor="disabled-checked" className="opacity-50">
									Disabled checked
								</Label>
							</div>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Error State"
						description="Show validation errors using aria-invalid."
						code={`<Checkbox aria-invalid />`}
					>
						<div className="flex items-center gap-2">
							<Checkbox id="error" aria-invalid />
							<Label htmlFor="error">Required field</Label>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Checkbox Group"
						description="Group multiple checkboxes for related options."
						code={`<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Checkbox id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="option3" />
    <Label htmlFor="option3">Option 3</Label>
  </div>
</div>`}
					>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Checkbox id="option1" defaultChecked />
								<Label htmlFor="option1">Email notifications</Label>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox id="option2" />
								<Label htmlFor="option2">SMS notifications</Label>
							</div>
							<div className="flex items-center gap-2">
								<Checkbox id="option3" defaultChecked />
								<Label htmlFor="option3">Push notifications</Label>
							</div>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={checkboxProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Always pair checkboxes with labels for accessibility</li>
						<li>Use checkboxes for multiple selections, radio buttons for single selection</li>
						<li>Group related checkboxes together with a fieldset</li>
						<li>Use clear, positive labels (avoid negative phrasing)</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
