"use client"

import { Page } from "@/components/ui/page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const inputProps: PropDefinition[] = [
	{
		name: "type",
		type: "string",
		default: '"text"',
		description: "The type of input (text, email, password, number, etc.).",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text shown when input is empty.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the input is disabled.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the input has an error.",
	},
]

export default function InputPage() {
	return (
		<Page
			title="Input"
			subtitle="Text input field for collecting user data. Supports various types like text, email, password, and more."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A basic text input field."
						code={`<Input placeholder="Enter your name" />`}
					>
						<Input placeholder="Enter your name" className="max-w-sm" />
					</ComponentExample>

					<ComponentExample
						title="With Label"
						description="Input with an associated label for accessibility."
						code={`<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
</div>`}
					>
						<div className="max-w-sm space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="name@example.com" />
						</div>
					</ComponentExample>

					<ComponentExample
						title="Input Types"
						description="Different input types for various data formats."
						code={`<Input type="text" placeholder="Text" />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Number" />`}
					>
						<div className="grid max-w-sm gap-4">
							<Input type="text" placeholder="Text input" />
							<Input type="email" placeholder="email@example.com" />
							<Input type="password" placeholder="Password" />
							<Input type="number" placeholder="0" />
						</div>
					</ComponentExample>

					<ComponentExample
						title="File Input"
						description="Input for file uploads."
						code={`<Input type="file" />`}
					>
						<Input type="file" className="max-w-sm" />
					</ComponentExample>

					<ComponentExample
						title="Disabled"
						description="Disabled inputs prevent user interaction."
						code={`<Input disabled placeholder="Disabled input" />`}
					>
						<Input disabled placeholder="Disabled input" className="max-w-sm" />
					</ComponentExample>

					<ComponentExample
						title="Error State"
						description="Show validation errors using aria-invalid."
						code={`<Input aria-invalid placeholder="Invalid input" />`}
					>
						<Input aria-invalid placeholder="Invalid input" className="max-w-sm" />
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={inputProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Input uses the design system tokens for consistent styling:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-input-bg-surface</code> - Input-specific background
						</li>
						<li>
							<code className="text-xs">border-p-input-border</code> - Input-specific border color
						</li>
						<li>
							<code className="text-xs">text-p-base</code> - Base font size with proper line height
						</li>
						<li>
							<code className="text-xs">rounded-p-lg</code> - Consistent border radius
						</li>
						<li>
							<code className="text-xs">shadow-p-inset</code> - Subtle inset shadow on focus
						</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Always associate inputs with labels for accessibility</li>
						<li>Use appropriate input types for better mobile keyboards</li>
						<li>Provide clear placeholder text as hints, not labels</li>
						<li>Show validation errors inline near the input</li>
						<li>Use the Field component for complete form field layouts</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
