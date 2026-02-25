import { Textarea } from "@blazz/ui/components/ui/textarea"
import { Label } from "@blazz/ui/components/ui/label"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tokens", title: "Design Tokens" },
	{ id: "guidelines", title: "Guidelines" },
	{ id: "related", title: "Related" },
]

const textareaProps: DocProp[] = [
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
		<DocPage
			title="Textarea"
			subtitle="A multi-line text input field for longer content like descriptions or comments."
			toc={toc}
		>
			<DocHero>
				<Textarea placeholder="Type your message here." className="max-w-md" />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Default"
					description="A basic textarea."
					code={`<Textarea placeholder="Type your message here." />`}
				>
					<Textarea placeholder="Type your message here." className="max-w-md" />
				</DocExample>

				<DocExample
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
				</DocExample>

				<DocExample
					title="With Default Value"
					description="Pre-filled textarea content."
					code={`<Textarea defaultValue="This is some default text that can be edited." />`}
				>
					<Textarea
						defaultValue="This is some default text that can be edited by the user."
						className="max-w-md"
					/>
				</DocExample>

				<DocExample
					title="Disabled"
					description="Disabled textareas prevent interaction."
					code={`<Textarea disabled placeholder="Disabled textarea" />`}
				>
					<Textarea
						disabled
						placeholder="This textarea is disabled"
						className="max-w-md"
					/>
				</DocExample>

				<DocExample
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={`<div className="space-y-2">
  <Label htmlFor="error-textarea">Description</Label>
  <Textarea
    id="error-textarea"
    aria-invalid
    placeholder="This field has an error"
  />
  <p className="text-sm text-negative">
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
						<p className="text-sm text-negative">Description is required.</p>
					</div>
				</DocExample>

				<DocExample
					title="Form Example"
					description="Complete form with textarea."
					code={`<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="bio">Bio</Label>
    <Textarea
      id="bio"
      placeholder="Tell us about yourself"
    />
    <p className="text-xs text-fg-muted">
      Maximum 500 characters.
    </p>
  </div>
</div>`}
				>
					<div className="max-w-md space-y-4">
						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" placeholder="Tell us about yourself..." />
							<p className="text-xs text-fg-muted">
								Write a short description about yourself. Maximum 500 characters.
							</p>
						</div>
					</div>
				</DocExample>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={textareaProps} />
			</DocSection>

			<DocSection id="tokens" title="Design Tokens">
				<p className="text-sm text-fg-muted">
					Textarea uses the same design tokens as Input for consistency:
				</p>
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>
						<code className="text-xs">bg-surface</code> - Input-specific background
					</li>
					<li>
						<code className="text-xs">border-edge</code> - Input-specific border
					</li>
					<li>
						<code className="text-xs">text-sm</code> - Base font size with proper line height
					</li>
					<li>
						<code className="text-xs">rounded-lg</code> - Consistent border radius
					</li>
					<li>
						<code className="text-xs">shadow-p-inset</code> - Subtle inset shadow on focus
					</li>
				</ul>
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use textarea for multi-line input, Input for single-line</li>
					<li>Provide character limits when appropriate</li>
					<li>Always associate with a label for accessibility</li>
					<li>Consider auto-resize for better UX on longer content</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Input",
							href: "/docs/components/ui/input",
							description: "Single-line text input field.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
