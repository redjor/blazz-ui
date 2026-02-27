import { createFileRoute } from "@tanstack/react-router"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { Label } from "@blazz/ui/components/ui/label"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

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

const examples = [
	{
		key: "default",
		code: `<Textarea placeholder="Type your message here." />`,
	},
	{
		key: "with-label",
		code: `<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Enter your message" />
</div>`,
	},
	{
		key: "with-default-value",
		code: `<Textarea defaultValue="This is some default text that can be edited." />`,
	},
	{
		key: "disabled",
		code: `<Textarea disabled placeholder="Disabled textarea" />`,
	},
	{
		key: "error",
		code: `<div className="space-y-2">
  <Label htmlFor="error-textarea">Description</Label>
  <Textarea
    id="error-textarea"
    aria-invalid
    placeholder="This field has an error"
  />
  <p className="text-sm text-negative">
    Description is required.
  </p>
</div>`,
	},
	{
		key: "form-example",
		code: `<div className="space-y-4">
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
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/textarea")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: TextareaPage,
})

function TextareaPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Default"
					description="A basic textarea."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Textarea placeholder="Type your message here." className="max-w-md" />
				</DocExampleClient>

				<DocExampleClient
					title="With Label"
					description="Textarea with an associated label."
					code={examples[1].code}
					highlightedCode={html("with-label")}
				>
					<div className="max-w-md space-y-2">
						<Label htmlFor="message">Message</Label>
						<Textarea id="message" placeholder="Enter your message" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Default Value"
					description="Pre-filled textarea content."
					code={examples[2].code}
					highlightedCode={html("with-default-value")}
				>
					<Textarea
						defaultValue="This is some default text that can be edited by the user."
						className="max-w-md"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Disabled"
					description="Disabled textareas prevent interaction."
					code={examples[3].code}
					highlightedCode={html("disabled")}
				>
					<Textarea
						disabled
						placeholder="This textarea is disabled"
						className="max-w-md"
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Error State"
					description="Show validation errors using aria-invalid."
					code={examples[4].code}
					highlightedCode={html("error")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Form Example"
					description="Complete form with textarea."
					code={examples[5].code}
					highlightedCode={html("form-example")}
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
				</DocExampleClient>
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
