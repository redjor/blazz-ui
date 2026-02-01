"use client"

import { Page } from "@/components/ui/page"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"

const textareaProps: PropDefinition[] = [
	{
		name: "placeholder",
		type: "string",
		description: "Placeholder text shown when empty.",
	},
	{
		name: "rows",
		type: "number",
		description: "Number of visible text lines.",
	},
	{
		name: "disabled",
		type: "boolean",
		default: "false",
		description: "Whether the textarea is disabled.",
	},
	{
		name: "aria-invalid",
		type: "boolean",
		description: "Indicates the textarea has an error.",
	},
]

export default function TextareaPage() {
	return (
		<Page
			title="Textarea"
			subtitle="A multi-line text input field for longer content like descriptions or comments."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Default"
						description="A basic textarea."
						code={`<Textarea placeholder="Type your message here." />`}
					>
						<Textarea placeholder="Type your message here." className="max-w-md" />
					</ComponentExample>

					<ComponentExample
						title="With Label"
						description="Textarea with an associated label."
						code={`<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Enter your message" />
</div>`}
					>
						<div className="max-w-md space-y-2">
							<Label htmlFor="message">Message</Label>
							<Textarea id="message" placeholder="Enter your message" />
						</div>
					</ComponentExample>

					<ComponentExample
						title="With Default Value"
						description="Pre-filled textarea content."
						code={`<Textarea defaultValue="This is some default text that can be edited." />`}
					>
						<Textarea
							defaultValue="This is some default text that can be edited by the user."
							className="max-w-md"
						/>
					</ComponentExample>

					<ComponentExample
						title="Disabled"
						description="Disabled textareas prevent interaction."
						code={`<Textarea disabled placeholder="Disabled textarea" />`}
					>
						<Textarea
							disabled
							placeholder="This textarea is disabled"
							className="max-w-md"
						/>
					</ComponentExample>

					<ComponentExample
						title="Error State"
						description="Show validation errors using aria-invalid."
						code={`<div className="space-y-2">
  <Label htmlFor="error-textarea">Description</Label>
  <Textarea
    id="error-textarea"
    aria-invalid
    placeholder="This field has an error"
  />
  <p className="text-sm text-p-critical-text">
    Description is required.
  </p>
</div>`}
					>
						<div className="max-w-md space-y-2">
							<Label htmlFor="error-textarea">Description</Label>
							<Textarea
								id="error-textarea"
								aria-invalid
								placeholder="This field has an error"
							/>
							<p className="text-sm text-p-critical-text">Description is required.</p>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Form Example"
						description="Complete form with textarea."
						code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="bio">Bio</Label>
    <Textarea
      id="bio"
      placeholder="Tell us about yourself"
    />
    <p className="text-xs text-muted-foreground">
      Maximum 500 characters.
    </p>
  </div>
</div>`}
					>
						<div className="max-w-md space-y-4">
							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea id="bio" placeholder="Tell us about yourself..." />
								<p className="text-xs text-muted-foreground">
									Write a short description about yourself. Maximum 500 characters.
								</p>
							</div>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={textareaProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Design Tokens</h2>
					<p className="text-sm text-p-text-secondary">
						Textarea uses the same design tokens as Input for consistency:
					</p>
					<ul className="list-inside list-disc space-y-2 text-sm text-p-text-secondary">
						<li>
							<code className="text-xs">bg-p-input-bg-surface</code> - Input-specific background
						</li>
						<li>
							<code className="text-xs">border-p-input-border</code> - Input-specific border
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
						<li>Use textarea for multi-line input, Input for single-line</li>
						<li>Provide character limits when appropriate</li>
						<li>Always associate with a label for accessibility</li>
						<li>Consider auto-resize for better UX on longer content</li>
					</ul>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Related Components</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>For single-line input, use the Input component</li>
						<li>For rich text editing, consider a rich text editor</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
